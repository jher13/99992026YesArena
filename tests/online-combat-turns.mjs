import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { generateKeyPair, exportJWK, SignJWT, jwtVerify } from 'jose';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const db = new PGlite();
const origin = 'https://fixture.arena.test';
const people = [1, 2, 3].map(n => '10000000-0000-4000-8000-00000000000' + n);
const sessions = [1, 2, 3].map(n => '20000000-0000-4000-8000-00000000000' + n);
const teams = [
  ['Alolan Raichu', 'Giratina', 'Articuno', 'Mewtwo', 'Ho-Oh', 'Shuckle'],
  ['Ivysaur', 'Wobbuffet', 'Maractus', 'Emolga', 'Pawniard', 'Honedge'],
];
const { publicKey, privateKey } = await generateKeyPair('ES256', { extractable: true });
const publicJwk = { ...await exportJWK(publicKey), alg: 'ES256', kid: 'fixture-key', use: 'sig' };
const legacyKey = new Uint8Array(32).fill(9);
const issuer = origin + '/auth/v1';
function token(i, alg = 'ES256') {
  return new SignJWT({ role: 'authenticated', session_id: sessions[i] })
    .setProtectedHeader({ alg, kid: 'fixture-key' }).setIssuer(issuer).setAudience('authenticated')
    .setSubject(people[i]).setExpirationTime('10m').sign(alg === 'HS256' ? legacyKey : privateKey);
}
const tokens = await Promise.all(people.map((_, i) => token(i)));
const legacy = await token(1, 'HS256');
const stats = { jwks: 0, auth: 0, commits: 0, broadcasts: 0 };
let handler, readBarrier, fixtureTime;
const background = [], pushes = new Map();
function createBarrier() {
  const open = Promise.withResolvers();
  let remaining = 2;
  return async () => {
    if (--remaining === 0) { readBarrier = null; open.resolve(); }
    await open.promise;
  };
}

async function readTurn(id, player, session = null) {
  const { rows } = await db.query('select public.arena_combat_turn_read($1,$2,$3) as data', [id, player, session]);
  return rows[0].data;
}
async function at(ms) {
  fixtureTime = new Date(Date.UTC(2026, 0, 1) + ms).toISOString();
  await db.query("select set_config('arena.fixture_clock',$1,false)", [fixtureTime]);
}
async function room(id, raid = false, builds) {
  const entries = { 'pokemon-arena-wild-progress': JSON.stringify({ owned: { Giratina: { level: 100 } } }) };
  const seats = raid ? people.slice(0, 2).map((uid, i) => ({ uid, pokemon: teams[i][1], entries })) : null;
  await db.query(`insert into arena_private.matches
    (id,host,guest,host_pick,guest_pick,host_entries,guest_entries,mode,format,field,raid_seats,next_tick)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'[]',$10,$11)`,
    [id, people[0], raid ? null : people[1], JSON.stringify(raid ? [] : teams[0]), JSON.stringify(raid ? [] : teams[1]),
      raid ? null : JSON.stringify(builds?.[0] ?? entries), raid ? null : JSON.stringify(builds?.[1] ?? entries), raid ? 'coop_mega_master' : 'free_fight',
      raid ? 1 : 6, seats ? JSON.stringify(seats) : null, fixtureTime]);
}
async function request(id, access = tokens[0], command, status = 200) {
  const response = await handler(new Request(origin + '/functions/v1/arena-combat', {
    method: 'POST', headers: { Authorization: 'Bearer ' + access }, body: JSON.stringify({ id, command }),
  }));
  const data = await response.json();
  assert.equal(response.status, status, data.error);
  if (status === 200) assert.match(response.headers.get('Server-Timing'), /auth;dur=.*read;dur=.*sim;dur=.*commit;dur=.*view;dur=.*total;dur=/);
  return data;
}
async function drain() { await Promise.all(background.splice(0)); }

function checkClient() {
  const source = read('multiplayer.js');
  const start = source.indexOf(' function createCombatRequest()');
  const end = source.indexOf(' function showBattleSnapshot(', start);
  assert(start >= 0 && end > start);
  const helpers = new Function('cloudClient','location','performance','element', source.slice(start,end) +
    'return {createCombatRequest,recordPvPTurn,pvpTimingDetails};');
  const options = [];
  let fail = false, now = 0;
  const cloud = async () => ({ functions: { invoke: async (_, opt) => {
    options.push(opt);
    return fail ? { error: { message: 'Temporary failure', context: { status: 503 } } } : { data: { combatRegion: 'us-east-2' } };
  } } });
  const el = (_, textContent) => ({ textContent, children: [], append(...nodes) {this.children.push(...nodes);} });
  const {createCombatRequest,recordPvPTurn,pvpTimingDetails} = helpers(cloud,{search:''},{now:()=>now},el);
  return (async () => {
    const send=createCombatRequest();
    await send('match'); await send('match'); fail=true;
    await assert.rejects(send('match',{normalAttacks:false}),/Temporary failure/);
    assert.equal(options.length,3,'a failed command is never replayed automatically');
    fail=false;await send('match');now=61000;await send('match');
    assert.deepEqual(options.map(o=>o.region),[undefined,'us-east-2','us-east-2',undefined,'us-east-2']);
    const auto=helpers(cloud,{search:'?arenaRegion=auto'},{now:()=>now},el).createCombatRequest();
    await auto('match');await auto('match');assert.equal(options.at(-1).region,undefined);
    const timing={last:null,updates:0,maxGap:0,stalls:0,server:[]};
    for(const [ms,turn] of [[0,{}],[100,{serverMs:10}],[2200,{serverMs:30}]])recordPvPTurn(timing,turn,ms);
    const text=pvpTimingDetails(timing).children.map(n=>n.textContent).join(' ');
    assert.match(text,/20\.0 ms average/);assert.match(text,/30\.0 ms at the 95th/);
    assert.match(text,/2\.10s/);assert.match(text,/2s or more 1/);
  })();
}

try {
  await db.exec(`
    create schema arena_private; create schema auth;
    create role anon; create role authenticated; create role service_role;
    create table auth.users (id uuid primary key, deleted_at timestamptz, banned_until timestamptz);
    create table auth.sessions (id uuid primary key, user_id uuid, not_after timestamptz);
    create table arena_private.matches (id uuid primary key, host uuid, guest uuid, host_pick jsonb, guest_pick jsonb,
      host_entries jsonb, guest_entries jsonb, mode text, format integer, field jsonb, raid_seats jsonb,
      result text, turn int default 0, combat_state jsonb, next_tick timestamptz);
    create function arena_private.finish_online(room_id uuid,outcome text) returns void language sql as $$
      update arena_private.matches set result=outcome where id=room_id $$;
    create function arena_private.fixture_time() returns timestamptz language sql as $$
      select current_setting('arena.fixture_clock')::timestamptz $$;
  `);
  const migration=read('supabase/migrations/20261120010000_combat_turns.sql');
  await db.exec(migration.replaceAll('clock_timestamp()', 'arena_private.fixture_time()'));
  for (let i=0;i<people.length;i++) {
    await db.query('insert into auth.users(id) values ($1)',[people[i]]);
    await db.query('insert into auth.sessions(id,user_id) values ($1,$2)',[sessions[i],people[i]]);
  }
  for (const [role,allowed] of [['service_role',true],['authenticated',false],['anon',false]]) {
    const {rows}=await db.query("select has_function_privilege($1,'public.arena_combat_turn_read(uuid,uuid,uuid)','EXECUTE') as permitted",[role]);
    assert.equal(rows[0].permitted,allowed);
  }
  globalThis.Deno={env:{get:key=>({SUPABASE_URL:origin,SUPABASE_SERVICE_ROLE_KEY:'fixture',ARENA_COMBAT_REGION:'us-east-2'})[key]},serve:fn=>{handler=fn;}};
  globalThis.EdgeRuntime={waitUntil:promise=>background.push(promise)};
  globalThis.fetch=async (where,init)=>{
    const url=new URL(where);assert.equal(url.origin,origin);
    if(url.pathname==='/auth/v1/.well-known/jwks.json'){stats.jwks++;return Response.json({keys:[publicJwk]});}
    if(url.pathname==='/auth/v1/user'){
      stats.auth++;
      const jwt=new Headers(init.headers).get('authorization').slice(7);
      const {payload}=await jwtVerify(jwt,legacyKey,{algorithms:['HS256'],issuer,audience:'authenticated'});
      return Response.json({id:payload.sub});
    }
    const args=JSON.parse(init.body);
    if(url.pathname.endsWith('/arena_combat_turn_read')){
      const row=await readTurn(args.match_id,args.player_id,args.verified_session);
      if(readBarrier)await readBarrier();
      return Response.json(row);
    }
    if(url.pathname.endsWith('/arena_combat_commit')){
      const {rows}=await db.query('select public.arena_combat_commit($1,$2,$3,$4,$5) as saved',
       [args.match_id,args.revision,JSON.stringify(args.state),args.outcome,args.steps]);
      if(rows[0].saved)stats.commits++;
      return Response.json(rows[0].saved);
    }
    assert.equal(url.pathname,'/realtime/v1/api/broadcast');
    for(const {topic,payload} of args.messages)pushes.set(topic,payload);
    stats.broadcasts++;
    return Response.json({});
  };
  await import('../supabase/functions/arena-combat/index.ts');
  const id='b2450000-0000-4000-8000-000000000001';
  await at(0);await room(id);
  assert.equal((await readTurn(id,people[0])).host_entries['pokemon-arena-wild-progress'].includes('Giratina'),true);
  await request(id,tokens[2],undefined,404);
  const init=await request(id);await drain();
  assert.equal(init.turn,1);assert.equal(init.combatRegion,'us-east-2');
  assert.equal((await readTurn(id,people[1])).side,'guest');
  const held=await readTurn(id,people[0]);assert(held.combat_state);
  for(const key of ['host_entries','guest_entries','host_pick','guest_pick','raid_seats'])assert(!Object.hasOwn(held,key),key);
  await request(id,legacy);assert.equal(stats.auth,1);assert.equal(stats.jwks,1);
  const expired=await new SignJWT({role:'authenticated',session_id:sessions[0]}).setProtectedHeader({alg:'ES256',kid:'fixture-key'})
    .setIssuer(issuer).setAudience('authenticated').setSubject(people[0]).setExpirationTime(1).sign(privateKey);
  await request(id,expired,undefined,401);
  assert.equal(stats.auth,1,'expired signed access is rejected without an Auth round trip');
  await db.query('delete from auth.sessions where id=$1',[sessions[2]]);
  await request(id,tokens[2],undefined,401);
  await db.query("update auth.users set banned_until=now()+interval '5 minutes' where id=$1",[people[1]]);
  await request(id,tokens[1],undefined,401);
  await db.query('update auth.users set banned_until=null where id=$1',[people[1]]);

  for(let ms=100;ms<=1000;ms+=100){await at(ms);await request(id);}
  // Simulate a three-second interruption. Both sides must regain all elapsed game time.
  let packet;
  for(let ms=4000;ms<=5000;ms+=100){await at(ms);packet=await request(id);}
  await drain();
  assert(Math.abs(packet.battle.clock-5)<1e-6);
  for(const side of ['host','guest']){
    const pushed=pushes.get('arena:'+id+':'+side);
    assert.equal(pushed.turn,packet.turn);assert.equal(pushed.battle.clock,packet.battle.clock);assert.equal(pushed.serverMs,packet.serverMs);
  }
  assert.equal(stats.jwks,1);assert.equal(stats.auth,1);
  await at(5100);
  const before=stats.commits;readBarrier=createBarrier();
  const same=await Promise.all([request(id),request(id,tokens[1])]);
  assert.equal(same[0].turn,same[1].turn);assert.equal(stats.commits,before+1);
  // Competing commands must each take effect once, even when they read the same starting turn.
  await at(5200);readBarrier=createBarrier();
  await Promise.all([request(id,tokens[0],{normalAttacks:false}),request(id,tokens[1],{normalAttacks:false})]);
  const state=(await readTurn(id,people[0])).combat_state;
  assert([...state.allies,...state.enemies].every(actor=>actor.normalAttacksEnabled===false));
  await drain();
  const raid='b2450000-0000-4000-8000-000000000002', pushesBefore=stats.broadcasts;
  await room(raid,true);await request(raid,tokens[1]);await at(5400);
  const resumed=await request(raid,tokens[1]);assert(resumed.battle.actors.some(a=>a.side==='raid:'+people[1]));
  assert.equal((await readTurn(raid,people[1])).side,'raid:'+people[1]);
  assert(!Object.hasOwn(await readTurn(raid,people[1]),'raid_seats'));await drain();assert.equal(stats.broadcasts,pushesBefore);
  await checkClient();
  console.log('Online combat passed for compact reads, signed and legacy sessions, concurrent turns, full clock recovery, raid reconnects, regional fallback and PvP timing.');

  if(process.argv.includes('--benchmark')){
    const dex=JSON.parse(read('supabase/functions/arena-combat/engine.js').match(/^const dex=(\{[^\n]+\});$/m)[1]);
    const moves=[
      {'Alolan Raichu':['Thunder Shock','Electro Ball','Thunderbolt','Thunder'],Giratina:['Shadow Force','Destiny Bond','Dragon Breath','Ancient Power'],
       Articuno:['Gust','Powder Snow','Ice Shard','Ancient Power'],Mewtwo:['Future Sight','Recover','Ancient Power','Psystrike']},
      {Ivysaur:['Vine Whip','Razor Leaf','Tackle','Take Down'],Wobbuffet:['Amnesia','Charm','Counter','Destiny Bond'],
       Maractus:['Absorb','Peck','Mega Drain','Sucker Punch'],Emolga:['Nuzzle','Quick Attack','Thunder Shock','Wing Attack']},
    ];
    const builds=teams.map((team,side)=>{
      const owned={},profiles={};
      const names=[...new Set([...team,...Object.keys(dex)])].slice(0,250);
      names.forEach((name,i)=>{
        owned[name]={level:40+i%61,xp:170+i*4};
        profiles[dex[name][0]]={pid:134693+i*6247,ivs:[21,i%32,26,24,28,31],evs:[44,0,0,128,0,48]};
      });
      return {'pokemon-arena-team':JSON.stringify(team),'pokemon-arena-wild-progress':JSON.stringify({owned,held:{},items:{}}),
        'pokemon-arena-profiles':JSON.stringify(profiles),'pokemon-arena-moves':JSON.stringify(moves[side])};
    });
    const reports=[],roundTrips=[],sizes=[];
    for (const seed of ['ff013900','ff013901','d42eaef0','00643412','7fff23e0']) {
      const matchId=seed+'-0000-4000-8000-000000000010';
      await at(0);await room(matchId,false,builds);await request(matchId);
      let last;
      for(let ms=100;ms<=300000;ms+=100){
        await at(ms);
        const start=performance.now();
        last=await request(matchId);
        if(Number.isFinite(last.serverMs)){reports.push(last.serverMs);roundTrips.push(performance.now()-start);}
        await drain();
        assert.equal(pushes.get('arena:'+matchId+':guest').turn,last.turn);
        if(ms===6000){
          const {rows:[row]}=await db.query("select to_jsonb(m)||jsonb_build_object('server_now',arena_private.fixture_time()) as old from arena_private.matches m where id=$1",[matchId]);
          const compact=await readTurn(matchId,people[0],sessions[0]);
          sizes.push([Buffer.byteLength(JSON.stringify(row.old)),Buffer.byteLength(JSON.stringify(compact))]);
        }
        if(last.result)break;
      }
      assert(last.result,'every seeded match should finish');
    }
    reports.sort((a,b)=>a-b);
    roundTrips.sort((a,b)=>a-b);
    const mean=values=>+(values.reduce((a,b)=>a+b,0)/values.length).toFixed(1);
    console.log(JSON.stringify({seededMatches:5,localAdvancingTurns:reports.length,meanMs:mean(reports),
      p95Ms:reports[Math.ceil(reports.length*.95)-1],maxMs:reports.at(-1),localRequestMeanMs:mean(roundTrips),
      localRequestP95Ms:+roundTrips[Math.ceil(roundTrips.length*.95)-1].toFixed(1),
      previousReadBytes:mean(sizes.map(s=>s[0])),currentReadBytes:mean(sizes.map(s=>s[1]))}));
  }
}finally{await db.close();}
