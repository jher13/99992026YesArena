const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const uid='10000000-0000-4000-8000-000000000001',other='10000000-0000-4000-8000-000000000002';
const html=read('index.html'),regions=JSON.parse(html.match(/^const gymRegions\s*=\s*(.+);$/m)[1]);
const badges=regions.flatMap(([name,,gyms])=>gyms.map(gym=>name+'/'+gym[3]));
function save(count=0,masters=[]){return {version:2,entries:{
 'pokemon-arena-team':'["Mewtwo"]','pokemon-arena-moves':'{"Mewtwo":["Psychic","Aura Sphere"]}',
 'pokemon-arena-profiles':JSON.stringify({150:{pid:0,ivs:Array(6).fill(31),evs:Array(6).fill(0)}}),
 'pokemon-arena-wild-progress':JSON.stringify({coins:10000,owned:{Mewtwo:{level:100,xp:0}},ai:{},items:{},vitamins:{},capsules:0,balls:[12,0,0,0,0,0,0,0,0],copies:{}}),
 'pokemon-arena-gym-badges':JSON.stringify(badges.slice(0,count)),'pokemon-arena-gym-badges/master':JSON.stringify(masters),'pokemon-arena-gym-badges/clean-records':'{}',
 'pokemon-arena-starter':'{"name":"Mewtwo"}','pokemon-arena-roguelit-progress':'{}','pokemon-arena-trainer-options':'{}','pokemon-arena-music':null,'pokemon-arena-sfx':null}};}
let db,checks=0;
(async()=>{
 db=new PGlite();await db.exec(`
 create role anon;create role authenticated;create role service_role;create schema auth;create schema arena_private;
 create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('arena.test_uid',true),'')::uuid$$;
 create function arena_private.require_session() returns void language plpgsql as $$begin if auth.uid() is null or current_setting('arena.test_session',true)<>'active' then raise exception 'Invalid session';end if;end$$;
 create table public.arena_saves(user_id uuid primary key,save_data jsonb not null,updated_at timestamptz not null default clock_timestamp());
 create function public.arena_write_save(payload jsonb,expected_revision timestamptz) returns jsonb language plpgsql security definer as $$
 declare stamp timestamptz;issue text;begin
 select updated_at into stamp from public.arena_saves where user_id=auth.uid() for update;
 if stamp is distinct from expected_revision then return '{"status":"conflict"}';end if;
 issue:=arena_private.save_issue(payload);if issue is not null then return jsonb_build_object('status','rejected','reason',issue);end if;
 update public.arena_saves set save_data=payload,updated_at=clock_timestamp() where user_id=auth.uid() returning updated_at into stamp;
 return jsonb_build_object('status','ok','updated_at',stamp);end$$;
 `);
 await db.exec(read('tests/fixtures/trade-save-validation.sql'));
 await db.exec(read('supabase/migrations/20261118010000_trading_hub.sql'));
 await db.exec(read('supabase/migrations/20261118020000_regional_progression.sql'));checks++;
 await db.query('insert into auth.users values($1),($2)',[uid,other]);
 await db.query('insert into public.arena_saves(user_id,save_data) values($1,$3),($2,$3)',[uid,other,save()]);
 await db.query("select set_config('arena.test_uid',$1,false),set_config('arena.test_session','active',false)",[uid]);
 const stored=async()=> (await db.query('select save_data,updated_at::text stamp from public.arena_saves where user_id=$1',[uid])).rows[0];
 const rpc=async(action,args={})=>(await db.query('select public.arena_campaign($1,$2) data',[action,args])).rows[0].data;
 const mutate=async(action,args={},id=crypto.randomUUID())=>rpc(action,{...args,request_id:id,expected_revision:(await stored()).stamp});
 const setSave=async document=>db.query('update public.arena_saves set save_data=$2,updated_at=clock_timestamp() where user_id=$1',[uid,document]);
 const progress=result=>JSON.parse(result.save_data.entries['pokemon-arena-wild-progress']);
 const ok=result=>{assert.equal(result.status,'ok',JSON.stringify(result));checks++;return result;};
 const reject=result=>{assert.equal(result.status,'error',JSON.stringify(result));checks++;};
 let status=await rpc('status');assert.equal(status.contracts.length,0);assert.deepEqual(status.claimed,[]);checks++;
 reject(await mutate('claim_region',{region:'Kanto'}));
 reject(await mutate('claim_region',{region:'Kanto',coins:999999}));
 assert.equal((await db.query('select arena_private.save_issue($1) issue',[save(8,[badges[0]])])).rows[0].issue,null,'regional Master accepted at eight badges');checks++;
 assert.equal((await db.query('select arena_private.save_issue($1) issue',[save(7,[badges[0]])])).rows[0].issue,'campaign_master_locked');checks++;
 assert.equal((await db.query('select arena_private.save_issue($1) issue',[save(8,[badges[8]])])).rows[0].issue,'campaign_master_locked');checks++;
 const malformed=save(8);malformed.entries['pokemon-arena-gym-badges']=JSON.stringify([...badges.slice(0,7),badges[8]]);
 assert.equal((await db.query('select arena_private.save_issue($1) issue',[malformed])).rows[0].issue,'campaign_badge_order');checks++;
 await setSave(save(8));const request=crypto.randomUUID();let result=ok(await mutate('claim_region',{region:'Kanto'},request));assert.equal(progress(result).coins,12000);assert.equal(progress(result).vitamins['Rare Candy'],1);checks++;
 const stamp=result.updated_at;result=ok(await rpc('claim_region',{region:'Kanto',request_id:request,expected_revision:stamp}));assert(result.replayed);assert.equal(progress(result).coins,12000);checks++;
 result=ok(await mutate('claim_region',{region:'Kanto'}));assert.equal(progress(result).coins,12000);checks++;
 reject(await mutate('claim_region',{region:'Johto'},request));
 result=await rpc('claim_region',{region:'Kanto',request_id:crypto.randomUUID(),expected_revision:'2000-01-01'});assert.equal(result.status,'conflict');checks++;
 await setSave(save(16));status=await rpc('status');assert.equal(status.contracts.length,2);assert.deepEqual(status.hunts,{});checks++;
 reject(await mutate('start_hunt',{region:'Kanto',root:1}));
 await setSave(save(24));status=await rpc('status');assert.equal(status.hunts.Kanto.length,3);assert(Object.values(status.hunts).flat().every(row=>row.root!==150));checks++;
 let choice=status.hunts.Kanto[0];result=ok(await mutate('start_hunt',{region:'Kanto',root:choice.root}));assert.equal(progress(result).campaign.hunt.remaining,20);checks++;
 reject(await mutate('start_hunt',{region:'Kanto',root:choice.root}));
 let document=(await stored()).save_data,p=JSON.parse(document.entries['pokemon-arena-wild-progress']);p.campaign.hunt.remaining=19;document.entries['pokemon-arena-wild-progress']=JSON.stringify(p);
 let saved=(await db.query('select public.arena_write_save($1,$2) data',[document,(await stored()).stamp])).rows[0].data;assert.equal(saved.status,'ok');checks++;
 p.campaign.hunt.remaining=20;document.entries['pokemon-arena-wild-progress']=JSON.stringify(p);saved=(await db.query('select public.arena_write_save($1,$2) data',[document,(await stored()).stamp])).rows[0].data;assert.equal(saved.status,'rejected');assert.equal(saved.reason,'campaign_hunt_tamper');checks++;
 await setSave(save(32));status=await rpc('status');assert.equal(status.contracts[0].reward.vitamins['EXP Candy 500'],1);assert.equal(status.contracts[0].reward.vitamins.Protein,1);checks++;
 await setSave(save(42));status=await rpc('status');assert.equal(status.contracts.length,4);assert.equal(status.contracts[2].reward.coins,3000);checks++;
 await setSave(save(50));status=await rpc('status');assert.equal(status.hunts.Kanto.length,6);checks++;
 await setSave(save(60));status=await rpc('status');assert.equal(status.contracts[2].reward.coins,5000);assert.equal(status.contracts[2].reward.vitamins['Rare Candy'],2);checks++;
 const key=status.contracts[0].key;result=ok(await mutate('start_contract',{key}));const run=result.run_id;
 reject(await mutate('claim_contract',{run_id:run}));
 assert.equal((await db.query('select public.arena_campaign_read($1,$2) data',[other,run])).rows[0].data,null);checks++;
 const snapshot=(await db.query('select public.arena_campaign_read($1,$2) data',[uid,run])).rows[0].data;assert.equal(snapshot.entries['pokemon-arena-team'],'["Mewtwo"]');checks++;
 const live=(await stored()).save_data;const liveProgress=JSON.parse(live.entries['pokemon-arena-wild-progress']);liveProgress.owned.Mewtwo.level=99;live.entries['pokemon-arena-wild-progress']=JSON.stringify(liveProgress);await setSave(live);
 const checkpoint=(await db.query('select public.arena_campaign_checkpoint($1,$2,0,$3,null) done',[uid,run,{clock:10}])).rows[0].done;assert(checkpoint);assert.equal((await db.query('select public.arena_campaign_checkpoint($1,$2,0,$3,null) done',[uid,run,{clock:10}])).rows[0].done,false,'stale verification cannot replace a newer checkpoint');checks++;
 await db.query('select public.arena_campaign_finish($1,$2,true,60)',[uid,run]);reject(await mutate('claim_contract',{run_id:run}));
 await db.query("update arena_private.campaign_runs set started_at=clock_timestamp()-interval '2 minutes' where id=$1",[run]);
 result=ok(await mutate('claim_contract',{run_id:run}));assert.equal(progress(result).coins,11000);assert.equal(progress(result).owned.Mewtwo.level,99,'rewards preserve PC changes made after the pinned battle');checks++;
 result=ok(await mutate('claim_contract',{run_id:run}));assert.equal(progress(result).coins,11000);assert.equal(progress(result).owned.Mewtwo.level,99,'rewards preserve PC changes made after the pinned battle');checks++;
 reject(await mutate('start_contract',{key}));
 await setSave(save(68,badges));result=ok(await mutate('claim_region',{region:'Paldea',master:true}));assert.equal(progress(result).coins,70000,'Lucky Coin doubles the fixed 30,000 Master bundle');checks++;
 document=save(0);p=JSON.parse(document.entries['pokemon-arena-wild-progress']);p.campaign={presets:Array(3).fill(null)};document.entries['pokemon-arena-wild-progress']=JSON.stringify(p);
 saved=(await db.query('select public.arena_write_save($1,$2) data',[document,(await stored()).stamp])).rows[0].data;assert.equal(saved.status,'rejected');assert.equal(saved.reason,'campaign_preset_capacity');checks++;
 p.campaign={title:'Champion'};document.entries['pokemon-arena-wild-progress']=JSON.stringify(p);saved=(await db.query('select public.arena_write_save($1,$2) data',[document,(await stored()).stamp])).rows[0].data;assert.equal(saved.reason,'campaign_title_locked');checks++;
 assert((await db.query("select count(*)::int n from arena_private.market_security_events where user_id=$1 and (reason like 'campaign_%' or reason='campaign_rejection')",[uid])).rows[0].n>=6);checks++;
 for(const role of ['anon','authenticated']){
  assert.equal((await db.query("select has_function_privilege($1,'public.arena_campaign_finish(uuid,uuid,boolean,numeric)','execute') allowed",[role])).rows[0].allowed,false);checks++;
  assert.equal((await db.query("select has_function_privilege($1,'public.arena_campaign_checkpoint(uuid,uuid,integer,jsonb,boolean)','execute') allowed",[role])).rows[0].allowed,false);checks++;
  assert.equal((await db.query("select has_function_privilege($1,'public.arena_campaign_read(uuid,uuid)','execute') allowed",[role])).rows[0].allowed,false);checks++;
 }
 assert.equal((await db.query("select has_table_privilege('authenticated','arena_private.campaign_claims','select') allowed")).rows[0].allowed,false);checks++;
const migrated=save(8);const migrantProgress=JSON.parse(migrated.entries['pokemon-arena-wild-progress']);migrantProgress.campaign={claimed:['standard:Kanto'],presets:[]};migrated.entries['pokemon-arena-wild-progress']=JSON.stringify(migrantProgress);await db.query('update public.arena_saves set save_data=$2 where user_id=$1',[other,migrated]);await db.query("select set_config('arena.test_uid',$1,false)",[other]);const adopted=await rpc('status');assert(adopted.claimed.includes('standard:Kanto'));const otherStamp=(await db.query('select updated_at::text stamp from public.arena_saves where user_id=$1',[other])).rows[0].stamp;const credited=ok(await rpc('claim_region',{region:'Kanto',request_id:crypto.randomUUID(),expected_revision:otherStamp}));assert.equal(progress(credited).coins,10000,'offline regional receipts cannot pay again on account adoption');checks++;
 await db.query("select set_config('arena.test_session','expired',false)");reject(await rpc('status'));
 console.log(JSON.stringify({campaignSQLChecks:checks,oneTimeClaims:true,contractVerification:true,regionalMaster:true,huntProtection:true,sessionAndOwnership:true}));await db.close();
})().catch(async error=>{console.error(error);if(db){try{console.error((await db.query('select reason,details from arena_private.market_security_events order by id desc limit 3')).rows);}catch{}await db.close();}process.exitCode=1;});
