const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const html=read('index.html'),engine=read('supabase/functions/arena-combat/engine.js');
const idA='10000000-0000-4000-8000-000000000001',idB='10000000-0000-4000-8000-000000000002',idC='10000000-0000-4000-8000-000000000003';
const dex=JSON.parse(html.match(/^const dex\s*=\s*(.+);$/m)[1]);
const gyms=JSON.parse(html.match(/^const gymRegions\s*=\s*(.+);$/m)[1]);
const form='Alolan Raichu',pika='Pikachu',rare='Mewtwo';
const iv=pid=>({pid,ivs:Array(6).fill(31),evs:Array(6).fill(0)});
const prof={[dex[pika][0]]:iv(1),[dex[form][0]]:iv(2),150:iv(3)};
const progress={registered:[form,rare,'Raichu'],owned:{[pika]:{level:10,xp:0},[form]:{level:34,xp:0},[rare]:{level:77,xp:0}},
 copies:{[rare]:[{profile:{...iv(4),shiny:true},level:50,xp:0}]},favorites:[form,rare],coins:0,balls:[1,0,0,0,0,0,0,0,0],wins:28,skills:{},items:{},ai:{},held:{},vitamins:{},capsules:0,
 trainerRecords:{trainerWins:2,knockouts:8,bestTrainerMs:28000},trainerCard:{share:false,scene:'Ghost',look:'Tide',accent:'Aqua'},campaign:{title:'',presets:[]}};
const badges=gyms[0][2].map(g=>'Kanto/'+g[3]);
const entries={'pokemon-arena-team':[pika],'pokemon-arena-wild-progress':progress,'pokemon-arena-gym-badges':badges,'pokemon-arena-gym-badges/master':[],
 'pokemon-arena-gym-badges/clean-records':{},'pokemon-arena-profiles':prof,'pokemon-arena-moves':{[pika]:['Thunder'],[form]:['Psychic'],[rare]:['Recover']},
 'pokemon-arena-starter':{name:'Pikachu',ign:'Card owner'},'pokemon-arena-roguelit-progress':{best:5},'pokemon-arena-trainer-options':{}};
const save=()=>({version:2,entries:{...Object.fromEntries(Object.entries(entries).map(([k,v])=>[k,JSON.stringify(v)])),'pokemon-arena-sfx':null,'pokemon-arena-music':null}});
const card=read('trainer-card.js').replace('window.ArenaTrainerCard={open,recordBattle};','window.ArenaTrainerCard={open,recordBattle,localProfile,ownedEntries};');
const probe=`
export function trainerCardChecks(data) {
 const e=data,progress=e['pokemon-arena-wild-progress'];
 team.splice(0,team.length,...e['pokemon-arena-team']);Object.assign(wildProgress,progress);Object.assign(profiles,e['pokemon-arena-profiles']);
 starterSave=e['pokemon-arena-starter'];rogueProgress.best=e['pokemon-arena-roguelit-progress'].best;
 clearedGyms=[...e['pokemon-arena-gym-badges']];registeredPokemon.clear();
 for(const n of progress.registered)registeredPokemon.add(n);
 const api=window.ArenaTrainerCard,local=api.localProfile(api.ownedEntries());
 const controls=id=>({value:id==='pc-element'?'Psychic':id==='pc-sort'?'number':''});
 const filtered=pcCandidates(Object.keys(wildProgress.owned),'',0,controls);
 const byName=pcCandidates(Object.keys(wildProgress.owned),'rai',0,controls);
 const markers=visibleArenaMoves().map(move=>[move,moveDamageKind(move),moveCatalog[move][4],moveRules(move).category]);
 const kinds=Object.fromEntries(['Thunder','Sucker Punch','Recover','Seismic Toss','Night Shade','Sonic Boom','Dragon Rage','Normal Attack'].map(n=>[n,moveDamageKind(n)]));
 api.recordBattle([{hp:0},{hp:3}],true,50,true);api.recordBattle([{hp:0},{hp:0}],true,12.345,false);
 return {local,kinds,markers,filtered,byName,after:wildProgress.trainerRecords};
}
`;
let db;
(async()=>{
 const mod=await import('data:text/javascript;base64,'+Buffer.from(engine+'\n'+card+'\n'+probe).toString('base64'));
 const out=mod.trainerCardChecks(structuredClone(entries));
 assert.deepEqual(out.filtered.sort(),[form,rare].sort());
 assert.deepEqual(out.byName,[form]);
 assert.deepEqual(Object.values(out.kinds),['special','atk','status','fixed','fixed','fixed','fixed','atk']);
 const fixedMoves=new Set(['Seismic Toss','Night Shade','Sonic Boom','Dragon Rage']);
 for(const [move,kind,status,category] of out.markers){
  const expected=status?'status':fixedMoves.has(move)?'fixed':category===3?'special':'atk';
  assert.equal(kind,expected,move);
 }
 assert.deepEqual(out.after,{trainerWins:4,knockouts:11,bestTrainerMs:12345});
 assert.equal(out.local.registered,3);assert.equal(out.local.forms,1);assert.equal(out.local.individuals,4);assert.equal(out.local.shinies,1);
 assert.deepEqual(out.local.shinyLegends,[rare]);assert.equal(out.local.highest,77);assert.equal(out.local.featured[1].level,50);
 db=new PGlite();await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;create schema arena_private;
 create table auth.users(id uuid primary key);
 create table arena_private.players(id uuid primary key,name text unique not null,wins int default 0,losses int default 0,coop int default 0);
 create table arena_private.friends(sender uuid,recipient uuid,accepted boolean);
 create table arena_private.matches(mode text,result text,combat_state jsonb,raid_seats jsonb,host uuid,guest uuid);
 create table arena_private.mega_raid_first_clears(player_id uuid,mode text);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('arena.test_uid',true),'')::uuid$$;
 create function arena_private.require_session() returns void language plpgsql as $$begin if auth.uid() is null or current_setting('arena.test_session',true) is distinct from 'active' then raise exception 'Invalid session';end if;end$$;
 create table public.arena_saves(user_id uuid primary key,save_data jsonb not null,updated_at timestamptz not null default clock_timestamp());
 create function public.arena_write_save(payload jsonb,expected_revision timestamptz) returns jsonb language sql as $$select '{}'::jsonb$$;`);
 for(const file of ['tests/fixtures/trade-save-validation.sql','supabase/migrations/20261118010000_trading_hub.sql','supabase/migrations/20261118020000_regional_progression.sql','supabase/migrations/20261118030000_complete_pokedex.sql','supabase/migrations/20261118040000_trainer_cards.sql'])await db.exec(read(file));
 await db.query('insert into auth.users values($1),($2),($3)',[idA,idB,idC]);
 await db.query("insert into arena_private.players(id,name,wins,losses,coop) values($1,'Card owner',13,4,3),($2,'Friend',0,0,0),($3,'Stranger',0,0,0)",[idA,idB,idC]);
 await db.query('insert into public.arena_saves(user_id,save_data) values($1,$2)',[idA,save()]);
 await db.query('insert into arena_private.friends values($1,$2,true),($1,$3,false)',[idA,idB,idC]);
 await db.query("insert into arena_private.mega_raid_first_clears values($1,'coop_mega')",[idA]);
 const addMatch=(mode,seconds,seats)=>db.query("insert into arena_private.matches(mode,result,combat_state,raid_seats,host) values($1,'coop_win',$2,$3,$4)",[mode,{clock:seconds},JSON.stringify(seats),idA]);
 await addMatch('coop_mega',5,[{uid:idA,pokemon:rare},{uid:idA,pokemon:pika,substitute:true}]);
 await addMatch('coop_mega_master',22.625,[{uid:idA,pokemon:rare},{uid:idB,pokemon:pika}]);
 const rpc=async(name=null)=>(await db.query('select public.arena_trainer_card($1) v',[name])).rows[0].v;
 const user=id=>db.query("select set_config('arena.test_uid',$1,false),set_config('arena.test_session','active',false)",[id]);
 assert.equal((await db.query("select has_function_privilege('anon','public.arena_trainer_card(text)','execute') allowed")).rows[0].allowed,false);
 await assert.rejects(rpc(),/Invalid session/);await user(idA);
 const own=await rpc();assert.equal(own.online.bestGroupMs,22625);assert.deepEqual(own.online.raids,['coop_mega','coop_mega_master']);assert.equal(own.online.wins,13);
 await user(idB);assert.deepEqual(await rpc('Card owner'),{});
 progress.trainerCard.share=true;await db.query('update public.arena_saves set save_data=$2 where user_id=$1',[idA,save()]);
 const friend=await rpc('Card owner'),publicCard=friend.profile;
 for(const field of ['registered','forms','individuals','highest','legends','shinies','regionCounts','shinyLegends','standard','master','style','wildWins','rogueBest'])assert.deepEqual(publicCard[field],out.local[field],field);
 assert.deepEqual(publicCard.featured,[{name:form,level:34,shiny:false},{name:rare,level:50,shiny:true},{name:pika,level:10,shiny:false}]);
 for(const secret of ['ivs','evs','pid','coins','moves','held','save_data'])assert(!JSON.stringify(friend).includes('"'+secret+'"'),secret);
 progress.trainerCard.featured=[null,rare,rare];await db.query('update public.arena_saves set save_data=$2 where user_id=$1',[idA,save()]);
 assert.deepEqual((await rpc('Card owner')).profile.featured,[null,{name:rare,level:50,shiny:true},null]);
 await user(idC);assert.deepEqual(await rpc('Card owner'),{});assert.deepEqual(await rpc('Does not exist'),{});
 await db.query("select set_config('arena.test_session','expired',false)");await assert.rejects(rpc(),/Invalid session/);
 console.log('Trainer cards passed collection parity, copy-aware shinies, favorites, timelines, moves, dual elements, friend permissions and group raid records.');
})().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(()=>db?.close());
