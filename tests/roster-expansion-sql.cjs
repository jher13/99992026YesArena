const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const manifest=JSON.parse(read('assets/roster-expansion.json')),alolan=manifest.species.find(p=>p.name==='Alolan Raichu');
const uid='10000000-0000-4000-8000-000000000001',buyer='10000000-0000-4000-8000-000000000002';
const html=read('index.html'),regions=JSON.parse(html.match(/^const gymRegions\s*=\s*(.+);$/m)[1]);
const badges=regions.flatMap(([name,,gyms])=>gyms.map(gym=>name+'/'+gym[3]));
const profile=pid=>({pid,ivs:Array(6).fill(31),evs:Array(6).fill(0)});
const save=(withForms=true)=>({version:2,entries:{
 'pokemon-arena-team':JSON.stringify(withForms?['Raichu','Alolan Raichu','Archaludon']:['Mewtwo']),
 'pokemon-arena-moves':JSON.stringify(withForms?{Raichu:['Thunderbolt'],'Alolan Raichu':['Psychic'],Archaludon:['Flash Cannon']}:{Mewtwo:['Psychic']}),
 'pokemon-arena-profiles':JSON.stringify(withForms?{26:profile(101),[alolan.id]:profile(202),1018:profile(303)}:{150:profile(404)}),
 'pokemon-arena-wild-progress':JSON.stringify({coins:10000,owned:withForms?{Raichu:{level:100,xp:0},'Alolan Raichu':{level:100,xp:0},Archaludon:{level:100,xp:0}}:{Mewtwo:{level:100,xp:0}},held:{},ai:{},items:{},vitamins:{},capsules:0,balls:[12,0,0,0,0,0,0,0,0],copies:{}}),
 'pokemon-arena-gym-badges':JSON.stringify(badges),'pokemon-arena-gym-badges/master':'[]','pokemon-arena-gym-badges/clean-records':'{}',
 'pokemon-arena-starter':'{"name":"Raichu"}','pokemon-arena-roguelit-progress':'{}','pokemon-arena-trainer-options':'{}','pokemon-arena-music':null,'pokemon-arena-sfx':null}});
let db,checks=0;
(async()=>{
 db=new PGlite();await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;create schema arena_private;
 create table auth.users(id uuid primary key);
 create table arena_private.players(id uuid primary key,name text unique not null);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('arena.test_uid',true),'')::uuid$$;
 create function arena_private.require_session() returns void language plpgsql as $$begin if auth.uid() is null or current_setting('arena.test_session',true)<>'active' then raise exception 'Invalid session';end if;end$$;
 create table public.arena_saves(user_id uuid primary key,save_data jsonb not null,updated_at timestamptz not null default clock_timestamp());
 create function public.arena_write_save(payload jsonb,expected_revision timestamptz) returns jsonb language sql as $$select '{}'::jsonb$$;`);
 for(const file of ['tests/fixtures/trade-save-validation.sql','supabase/migrations/20261118010000_trading_hub.sql','supabase/migrations/20261118020000_regional_progression.sql','supabase/migrations/20261118030000_complete_pokedex.sql'])await db.exec(read(file));checks++;
 let rows=(await db.query('select count(*)::int total,count(distinct national_dex)::int species from arena_private.market_species')).rows[0];assert.deepEqual(rows,{total:1083,species:1025});checks++;
 assert.equal((await db.query('select arena_private.save_issue($1) issue',[save()])).rows[0].issue,null);checks++;
 await db.query('insert into auth.users values($1),($2)',[uid,buyer]);await db.query("insert into arena_private.players values($1,'Seller'),($2,'Buyer')",[uid,buyer]);await db.query('insert into public.arena_saves(user_id,save_data) values($1,$3),($2,$4)',[uid,buyer,save(),save(false)]);
 const login=async id=>db.query("select set_config('arena.test_uid',$1,false),set_config('arena.test_session','active',false)",[id]);
 const stored=async(id=uid)=>(await db.query('select save_data,updated_at::text stamp from public.arena_saves where user_id=$1',[id])).rows[0];
 const rpc=async(action,args={})=>(await db.query('select public.arena_market($1,$2) data',[action,args])).rows[0].data;
 const mutate=async(action,args,id=uid)=>rpc(action,{...args,request_id:crypto.randomUUID(),expected_revision:(await stored(id)).stamp});
 await login(uid);
 const metadata=(await db.query('select arena_private.market_metadata($1) data',[{name:'Alolan Raichu',level:100,xp:0,profile:profile(202)}])).rows[0].data;
 assert.equal(metadata.number,26);assert.equal(metadata.generation,7);assert.deepEqual(metadata.types,['Electric','Psychic']);checks++;
 const match=(await db.query("select arena_private.market_matches($1,$2) matches",[{name:'Raichu',level:100,profile:profile(101)},{name:'Alolan Raichu'}])).rows[0].matches;assert.equal(match,false);checks++;
 const inventory=await rpc('inventory');assert(Array.isArray(inventory.rows),JSON.stringify(inventory));
 const candidate=inventory.rows.find(row=>row.selector.name==='Alolan Raichu');assert(candidate,'regional form can be listed');checks++;
 const listed=await mutate('create_auction',{selector:candidate.selector,minimum_bid:100,buy_now:200,hours:24});
 assert.equal(listed.status,'ok',JSON.stringify(listed));checks++;
 const after=(await stored()).save_data;const profiles=JSON.parse(after.entries['pokemon-arena-profiles']);assert.equal(profiles['26'].pid,101);assert(!profiles[alolan.id]);checks++;
 const found=await rpc('search',{kind:'auction',dex:'26'});assert(found.rows.some(row=>row.pokemon.name==='Alolan Raichu'));checks++;
 await login(buyer);const bought=await mutate('buy',{id:listed.listing_id},buyer);assert.equal(bought.status,'ok',JSON.stringify(bought));checks++;
 const delivered=(await stored(buyer)).save_data;assert.equal(JSON.parse(delivered.entries['pokemon-arena-profiles'])[alolan.id].pid,202);assert(JSON.parse(delivered.entries['pokemon-arena-wild-progress']).owned['Alolan Raichu']);checks++;
 const families=(await db.query('select count(*)::int total from arena_private.campaign_families')).rows[0].total;assert.equal(families,1083);checks++;
 const hisui=manifest.species.find(row=>row.name==='Hisuian Growlithe');rows=(await db.query('select s.encounter_region,s.generation,f.root from arena_private.market_species s join arena_private.campaign_families f using(dex) where dex=$1',[hisui.id])).rows[0];assert.equal(rows.encounter_region,'Sinnoh');assert.equal(rows.generation,8);assert.equal(rows.root,hisui.id);checks++;
 assert.equal((await db.query('select rare from arena_private.campaign_families where dex=1008')).rows[0].rare,true);checks++;
 await login(uid);const contract=(await db.query("select public.arena_campaign('start_contract',$1) data",[{key:(await db.query("select public.arena_campaign('status','{}') data")).rows[0].data.contracts[0].key,request_id:crypto.randomUUID(),expected_revision:(await stored()).stamp}])).rows[0].data;assert.equal(contract.status,'ok',JSON.stringify(contract));checks++;
 console.log(JSON.stringify({rosterSQLChecks:checks,selectableEntries:1083,nationalSpecies:1025,separateFormProfiles:true,nationalDexSearch:true}));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>db?.close());
