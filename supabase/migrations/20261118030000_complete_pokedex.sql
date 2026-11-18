-- Expand the shared whitelist without changing existing save/profile IDs.
begin;
alter table arena_private.market_species add column national_dex integer;
alter table arena_private.market_species add column encounter_region text;
update arena_private.market_species set national_dex=dex;
alter table arena_private.market_species alter column national_dex set not null;
insert into arena_private.market_species(dex,name,generation,types,national_dex,encounter_region) values
(981,'Farigiraf',9,array['Normal','Psychic'],981,null),
(982,'Dudunsparce',9,array['Normal'],982,null),
(983,'Kingambit',9,array['Dark','Steel'],983,null),
(984,'Great Tusk',9,array['Ground','Fighting'],984,null),
(985,'Scream Tail',9,array['Fairy','Psychic'],985,null),
(986,'Brute Bonnet',9,array['Grass','Dark'],986,null),
(987,'Flutter Mane',9,array['Ghost','Fairy'],987,null),
(988,'Slither Wing',9,array['Bug','Fighting'],988,null),
(989,'Sandy Shocks',9,array['Electric','Ground'],989,null),
(990,'Iron Treads',9,array['Ground','Steel'],990,null),
(991,'Iron Bundle',9,array['Ice','Water'],991,null),
(992,'Iron Hands',9,array['Fighting','Electric'],992,null),
(993,'Iron Jugulis',9,array['Dark','Flying'],993,null),
(994,'Iron Moth',9,array['Fire','Poison'],994,null),
(995,'Iron Thorns',9,array['Rock','Electric'],995,null),
(996,'Frigibax',9,array['Dragon','Ice'],996,null),
(997,'Arctibax',9,array['Dragon','Ice'],997,null),
(998,'Baxcalibur',9,array['Dragon','Ice'],998,null),
(999,'Gimmighoul',9,array['Ghost'],999,null),
(1000,'Gholdengo',9,array['Steel','Ghost'],1000,null),
(1001,'Wo-Chien',9,array['Dark','Grass'],1001,null),
(1002,'Chien-Pao',9,array['Dark','Ice'],1002,null),
(1003,'Ting-Lu',9,array['Dark','Ground'],1003,null),
(1004,'Chi-Yu',9,array['Dark','Fire'],1004,null),
(1005,'Roaring Moon',9,array['Dragon','Dark'],1005,null),
(1006,'Iron Valiant',9,array['Fairy','Fighting'],1006,null),
(1007,'Koraidon',9,array['Fighting','Dragon'],1007,null),
(1008,'Miraidon',9,array['Electric','Dragon'],1008,null),
(1009,'Walking Wake',9,array['Water','Dragon'],1009,null),
(1010,'Iron Leaves',9,array['Grass','Psychic'],1010,null),
(1011,'Dipplin',9,array['Grass','Dragon'],1011,null),
(1012,'Poltchageist',9,array['Grass','Ghost'],1012,null),
(1013,'Sinistcha',9,array['Grass','Ghost'],1013,null),
(1014,'Okidogi',9,array['Poison','Fighting'],1014,null),
(1015,'Munkidori',9,array['Poison','Psychic'],1015,null),
(1016,'Fezandipiti',9,array['Poison','Fairy'],1016,null),
(1017,'Ogerpon',9,array['Grass'],1017,null),
(1018,'Archaludon',9,array['Steel','Dragon'],1018,null),
(1019,'Hydrapple',9,array['Grass','Dragon'],1019,null),
(1020,'Gouging Fire',9,array['Fire','Dragon'],1020,null),
(1021,'Raging Bolt',9,array['Electric','Dragon'],1021,null),
(1022,'Iron Boulder',9,array['Rock','Psychic'],1022,null),
(1023,'Iron Crown',9,array['Steel','Psychic'],1023,null),
(1024,'Terapagos',9,array['Normal'],1024,null),
(1025,'Pecharunt',9,array['Poison','Ghost'],1025,null),
(1026,'Alolan Rattata',7,array['Dark','Normal'],19,'Alola'),
(1027,'Alolan Raticate',7,array['Dark','Normal'],20,'Alola'),
(1028,'Alolan Raichu',7,array['Electric','Psychic'],26,'Alola'),
(1029,'Alolan Sandshrew',7,array['Ice','Steel'],27,'Alola'),
(1030,'Alolan Sandslash',7,array['Ice','Steel'],28,'Alola'),
(1031,'Alolan Vulpix',7,array['Ice'],37,'Alola'),
(1032,'Alolan Ninetales',7,array['Ice','Fairy'],38,'Alola'),
(1033,'Alolan Diglett',7,array['Ground','Steel'],50,'Alola'),
(1034,'Alolan Dugtrio',7,array['Ground','Steel'],51,'Alola'),
(1035,'Alolan Meowth',7,array['Dark'],52,'Alola'),
(1036,'Alolan Persian',7,array['Dark'],53,'Alola'),
(1037,'Alolan Geodude',7,array['Rock','Electric'],74,'Alola'),
(1038,'Alolan Graveler',7,array['Rock','Electric'],75,'Alola'),
(1039,'Alolan Golem',7,array['Rock','Electric'],76,'Alola'),
(1040,'Alolan Grimer',7,array['Poison','Dark'],88,'Alola'),
(1041,'Alolan Muk',7,array['Poison','Dark'],89,'Alola'),
(1042,'Alolan Exeggutor',7,array['Grass','Dragon'],103,'Alola'),
(1043,'Alolan Marowak',7,array['Fire','Ghost'],105,'Alola'),
(1044,'Galarian Meowth',8,array['Steel'],52,'Galar'),
(1045,'Galarian Ponyta',8,array['Psychic'],77,'Galar'),
(1046,'Galarian Rapidash',8,array['Psychic','Fairy'],78,'Galar'),
(1047,'Galarian Slowpoke',8,array['Psychic'],79,'Galar'),
(1048,'Galarian Slowbro',8,array['Poison','Psychic'],80,'Galar'),
(1049,'Galarian Farfetch’d',8,array['Fighting'],83,'Galar'),
(1050,'Galarian Weezing',8,array['Poison','Fairy'],110,'Galar'),
(1051,'Galarian Mr. Mime',8,array['Ice','Psychic'],122,'Galar'),
(1052,'Galarian Articuno',8,array['Psychic','Flying'],144,'Galar'),
(1053,'Galarian Zapdos',8,array['Fighting','Flying'],145,'Galar'),
(1054,'Galarian Moltres',8,array['Dark','Flying'],146,'Galar'),
(1055,'Galarian Slowking',8,array['Poison','Psychic'],199,'Galar'),
(1056,'Galarian Corsola',8,array['Ghost'],222,'Galar'),
(1057,'Galarian Zigzagoon',8,array['Dark','Normal'],263,'Galar'),
(1058,'Galarian Linoone',8,array['Dark','Normal'],264,'Galar'),
(1059,'Galarian Darumaka',8,array['Ice'],554,'Galar'),
(1060,'Galarian Darmanitan',8,array['Ice'],555,'Galar'),
(1061,'Galarian Yamask',8,array['Ground','Ghost'],562,'Galar'),
(1062,'Galarian Stunfisk',8,array['Ground','Steel'],618,'Galar'),
(1063,'Hisuian Growlithe',8,array['Fire','Rock'],58,'Sinnoh'),
(1064,'Hisuian Arcanine',8,array['Fire','Rock'],59,'Sinnoh'),
(1065,'Hisuian Voltorb',8,array['Electric','Grass'],100,'Sinnoh'),
(1066,'Hisuian Electrode',8,array['Electric','Grass'],101,'Sinnoh'),
(1067,'Hisuian Typhlosion',8,array['Fire','Ghost'],157,'Sinnoh'),
(1068,'Hisuian Qwilfish',8,array['Dark','Poison'],211,'Sinnoh'),
(1069,'Hisuian Sneasel',8,array['Fighting','Poison'],215,'Sinnoh'),
(1070,'Hisuian Samurott',8,array['Water','Dark'],503,'Sinnoh'),
(1071,'Hisuian Lilligant',8,array['Grass','Fighting'],549,'Sinnoh'),
(1072,'Hisuian Zorua',8,array['Normal','Ghost'],570,'Sinnoh'),
(1073,'Hisuian Zoroark',8,array['Normal','Ghost'],571,'Sinnoh'),
(1074,'Hisuian Braviary',8,array['Psychic','Flying'],628,'Sinnoh'),
(1075,'Hisuian Sliggoo',8,array['Steel','Dragon'],705,'Sinnoh'),
(1076,'Hisuian Goodra',8,array['Steel','Dragon'],706,'Sinnoh'),
(1077,'Hisuian Avalugg',8,array['Ice','Rock'],713,'Sinnoh'),
(1078,'Hisuian Decidueye',8,array['Grass','Fighting'],724,'Sinnoh'),
(1079,'White-Striped Basculin',8,array['Water'],550,'Sinnoh'),
(1080,'Paldean Tauros (Combat Breed)',9,array['Fighting'],128,'Paldea'),
(1081,'Paldean Tauros (Blaze Breed)',9,array['Fighting','Fire'],128,'Paldea'),
(1082,'Paldean Tauros (Aqua Breed)',9,array['Fighting','Water'],128,'Paldea'),
(1083,'Paldean Wooper',9,array['Poison','Ground'],194,'Paldea');
insert into arena_private.campaign_families(dex,root,min_level,rare) values
(981,203,32,false),
(982,206,32,false),
(983,624,52,false),
(984,984,1,false),
(985,985,1,false),
(986,986,1,false),
(987,987,1,false),
(988,988,1,false),
(989,989,1,false),
(990,990,1,false),
(991,991,1,false),
(992,992,1,false),
(993,993,1,false),
(994,994,1,false),
(995,995,1,false),
(996,996,1,false),
(997,996,35,false),
(998,996,54,false),
(999,999,1,false),
(1000,999,35,false),
(1001,1001,1,true),
(1002,1002,1,true),
(1003,1003,1,true),
(1004,1004,1,true),
(1005,1005,1,false),
(1006,1006,1,false),
(1007,1007,1,true),
(1008,1008,1,true),
(1009,1009,1,false),
(1010,1010,1,false),
(1011,840,25,false),
(1012,1012,1,false),
(1013,1012,30,false),
(1014,1014,1,true),
(1015,1015,1,true),
(1016,1016,1,true),
(1017,1017,1,true),
(1018,884,50,false),
(1019,840,45,false),
(1020,1020,1,false),
(1021,1021,1,false),
(1022,1022,1,false),
(1023,1023,1,false),
(1024,1024,1,true),
(1025,1025,1,true),
(1026,1026,1,false),
(1027,1026,20,false),
(1028,172,35,false),
(1029,1029,1,false),
(1030,1029,20,false),
(1031,1031,1,false),
(1032,1031,20,false),
(1033,1033,1,false),
(1034,1033,26,false),
(1035,1035,1,false),
(1036,1035,28,false),
(1037,1037,1,false),
(1038,1037,25,false),
(1039,1037,35,false),
(1040,1040,1,false),
(1041,1040,38,false),
(1042,102,20,false),
(1043,104,28,false),
(1044,1044,1,false),
(1045,1045,1,false),
(1046,1045,40,false),
(1047,1047,1,false),
(1048,1047,37,false),
(1049,1049,1,false),
(1050,109,35,false),
(1051,439,20,false),
(1052,1052,1,true),
(1053,1053,1,true),
(1054,1054,1,true),
(1055,1047,37,false),
(1056,1056,1,false),
(1057,1057,1,false),
(1058,1057,20,false),
(1059,1059,1,false),
(1060,1059,20,false),
(1061,1061,1,false),
(1062,1062,1,false),
(1063,1063,1,false),
(1064,1063,20,false),
(1065,1065,1,false),
(1066,1065,20,false),
(1067,155,36,false),
(1068,1068,1,false),
(1069,1069,1,false),
(1070,501,36,false),
(1071,548,20,false),
(1072,1072,1,false),
(1073,1072,30,false),
(1074,627,54,false),
(1075,704,40,false),
(1076,704,50,false),
(1077,712,37,false),
(1078,722,36,false),
(1079,1079,1,false),
(1080,1080,1,false),
(1081,1081,1,false),
(1082,1082,1,false),
(1083,1083,1,false);
create or replace function arena_private.market_metadata(pokemon jsonb)
returns jsonb language plpgsql stable set search_path=pg_catalog as $$
declare c arena_private.market_species; p jsonb:=pokemon->'profile'; pid bigint; best integer; i integer; stat integer;
 nature_names text[]:=array['Hardy','Lonely','Adamant','Naughty','Brave','Bold','Docile','Impish','Lax','Relaxed','Modest','Mild','Bashful','Rash','Quiet','Calm','Gentle','Careful','Quirky','Sassy','Timid','Hasty','Jolly','Naive','Serious'];
 personalities text[][]:=array[array['Hearty','Sleepy','Easygoing','Messy','Relaxed'],array['Proud','Energetic','Hotheaded','Competitive','Feisty'],array['Steady','Resilient','Persistent','Enduring','Determined'],array['Swift','Alert','Impulsive','Playful','Skittish'],array['Resolute','Vain','Defiant','Driven','Stubborn'],array['Curious','Mischievous','Clever','Thoughtful','Picky']];
 stat_order integer[]:=array[0,1,2,3,5,4];
begin
 select * into c from arena_private.market_species where name=pokemon->>'name';
 if c.dex is null or not arena_private.profile_valid(p) then raise exception 'This Pokémon has invalid saved stats.'; end if;
 pid:=(p->>'pid')::bigint;
 select max(value::integer) into best from jsonb_array_elements_text(p->'ivs');
 for i in 0..5 loop
  stat:=stat_order[((pid%6+i)%6)::integer+1];
  if (p->'ivs'->>stat)::integer=best then exit; end if;
 end loop;
 return jsonb_build_object('name',c.name,'number',c.national_dex,'generation',c.generation,'types',to_jsonb(c.types),
  'level',(pokemon->>'level')::integer,'nature',nature_names[(pid%25)::integer+1],
  'personality',personalities[stat+1][best%5+1],'ivs',p->'ivs','evs',p->'evs',
  'iv_total',(select sum(value::integer) from jsonb_array_elements_text(p->'ivs')),
  'shiny',coalesce(p->'shiny','false'),'ability',p->>'abilityOverride');
end $$;
create or replace function public.arena_market(action text,args jsonb default '{}')
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
#variable_conflict use_variable
<<market>>
declare incoming_action constant text:=action; uid uuid:=auth.uid(); saved jsonb; revision timestamptz; expected timestamptz;
 request_id uuid; operation arena_private.market_operations; request_hash text;
 listing arena_private.market_listings; asset arena_private.market_assets; taken record; delivery record;
 pokemon jsonb; metadata jsonb; want jsonb; p jsonb; result jsonb; rows jsonb; total bigint; coins bigint;
 price bigint; bid_amount bigint; payment bigint; duration integer; kind text; tag_values text[]; receipt jsonb:='[]';
 seller_name text; buyer_name text; query_text text; sort_key text; view_side text; page integer; issue text;
begin
 if uid is null then raise exception 'Sign in to use the Trading Hub.';end if;
 perform arena_private.require_session();
 perform arena_private.market_settle_expired(100);
 select name into buyer_name from arena_private.players where id=uid;
 if buyer_name is null then raise exception 'Register an online player name before trading.';end if;
 if action='notices' then
  return jsonb_build_object('notices',coalesce((select jsonb_agg(to_jsonb(n) order by n.created_at desc) from
   (select id,listing_id,title,message,created_at,read_at from arena_private.market_notices where user_id=uid order by created_at desc limit 50) n),'[]'),
   'pending',(select count(*) from arena_private.market_deliveries where user_id=uid and claimed_at is null));
 elsif action='read_notices' then
  update arena_private.market_notices set read_at=coalesce(read_at,clock_timestamp()) where user_id=uid and
   id in(select value::uuid from jsonb_array_elements_text(coalesce(args->'ids','[]')) limit 50);
  return jsonb_build_object('status','ok');
 elsif action in ('search','mine') then
  kind:=case when args->>'kind'='request' then 'request' else 'auction' end;
  query_text:=lower(left(trim(coalesce(args->>'query','')),100));sort_key:=coalesce(args->>'sort','newest');
  view_side:=coalesce(args->>'side','offered');page:=greatest(0,least(5000,coalesce((args->>'page')::integer,0)));
  with selected as (
   select l.*,p.name seller_name,
    case when kind='request' and view_side='wanted' then
     jsonb_build_object('name',c.name,'number',c.national_dex,'generation',c.generation,'types',to_jsonb(c.types),'nature',l.want->>'nature','personality',l.want->>'personality','shiny',l.want->'shiny')
     else l.pokemon end filter_meta
   from arena_private.market_listings l join arena_private.players p on p.id=l.seller_id
    left join arena_private.market_species c on c.name=l.want->>'name'
   where l.kind=kind and (case when action='mine' then l.seller_id=uid else l.status='open' and l.ends_at>clock_timestamp() end)
  ), filtered as (
   select * from selected x where
    (query_text='' or position(query_text in lower(x.filter_meta->>'name'))>0)
    and (coalesce(args->>'ign','')='' or position(lower(left(args->>'ign',24)) in lower(x.seller_name))>0)
    and (nullif(args->>'generation','') is null or x.filter_meta->>'generation'=args->>'generation')
    and (nullif(args->>'dex','') is null or x.filter_meta->>'number'=args->>'dex')
    and (nullif(args->>'element','') is null or x.filter_meta->'types' ? (args->>'element'))
    and (nullif(args->>'nature','') is null or x.filter_meta->>'nature'=args->>'nature' or kind='request' and view_side='wanted' and nullif(x.filter_meta->>'nature','') is null)
    and (nullif(args->>'personality','') is null or x.filter_meta->>'personality'=args->>'personality' or kind='request' and view_side='wanted' and nullif(x.filter_meta->>'personality','') is null)
    and (nullif(args->>'shiny','') is null or x.filter_meta->>'shiny'=args->>'shiny' or kind='request' and view_side='wanted' and x.filter_meta->>'shiny' is null)
  ), sorted as (
   select f.* from filtered f order by
    case when sort_key='ending' then ends_at end asc,
    case when sort_key='price_low' then coalesce(buy_now,minimum_bid,current_bid) end asc,
    case when sort_key='price_high' then coalesce(buy_now,minimum_bid,current_bid) end desc,
    case when sort_key='dex' then (filter_meta->>'number')::integer end asc,
    case when sort_key='level' then (f.pokemon->>'level')::integer end desc,
    case when sort_key='ivs' then (f.pokemon->>'iv_total')::integer end desc,
    created_at desc,id desc limit 20 offset page*20
  ) select coalesce(jsonb_agg(jsonb_build_object('id',n.id,'kind',n.kind,'pokemon',n.pokemon,'want',n.want,'tags',n.tags,
   'seller',n.seller_name,'mine',n.seller_id=uid,'minimum_bid',n.minimum_bid,'buy_now',n.buy_now,'current_bid',n.current_bid,
   'my_bid',n.high_bidder=uid,'ends_at',n.ends_at,'status',n.status,'created_at',n.created_at)),'[]'),
   (select count(*) from filtered) into rows,total from sorted n;
  return jsonb_build_object('rows',rows,'total',total,'page',page);
 end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,802771));
 select save_data,updated_at into saved,revision from public.arena_saves where user_id=uid for update;
 if saved is null then raise exception 'Sync your PC before trading.';end if;
 if action='inventory' then
  select coalesce(jsonb_agg(jsonb_build_object('selector',jsonb_build_object('name',r.name,'slot',r.slot,'fingerprint',md5(r.pokemon::text)),
   'pokemon',arena_private.market_metadata(r.pokemon),'profile',r.pokemon->'profile') order by r.name,r.slot),'[]') into rows
   from arena_private.market_pokemon_rows(saved) r;
  return jsonb_build_object('rows',rows,'coins',arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}')->'coins');
 end if;
 if action not in ('create_auction','create_request','cancel','bid','buy','fulfill','claim') then raise exception 'Unknown Trading Hub action.';end if;
 request_id:=(args->>'request_id')::uuid;
 if request_id is null then raise exception 'This trade needs a transaction identifier.';end if;
 request_hash:=md5(action||(args-'request_id'-'expected_revision')::text);
 select * into operation from arena_private.market_operations o where o.user_id=uid and o.request_id=market.request_id;
 if operation.user_id is not null then
  if operation.action<>action or operation.payload_hash<>request_hash then
   insert into arena_private.market_security_events(user_id,reason) values(uid,'reused_market_transaction');
   return jsonb_build_object('status','rejected','message','Transaction identifier was already used for a different trade.');
  end if;
  return operation.response || jsonb_build_object('save_data',saved,'updated_at',revision,'replayed',true);
 end if;
 expected:=(args->>'expected_revision')::timestamptz;
 if expected is distinct from revision then return jsonb_build_object('status','conflict','message','Your PC changed. Sync or reload before trading.');end if;
 issue:=arena_private.save_issue(saved);
 if issue is not null then raise exception 'Your save must pass validation before trading.';end if;
 p:=arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}');coins:=coalesce((p->>'coins')::bigint,0);
 if action in ('create_auction','create_request','fulfill') then
  select * into taken from arena_private.market_take(saved,args->'selector'->>'name',(args->'selector'->>'slot')::integer,args->'selector'->>'fingerprint',action='fulfill');
  pokemon:=taken.pokemon;
 end if;
 if action in ('create_auction','create_request') then
  if (select count(*) from arena_private.market_listings where seller_id=uid and status='open')>=20 then raise exception 'You may have up to 20 open listings.';end if;
  kind:=case when action='create_request' then 'request' else 'auction' end;
  if kind='auction' then
   price:=nullif(args->>'buy_now','')::bigint;bid_amount:=nullif(args->>'minimum_bid','')::bigint;
   if price is null and bid_amount is null or coalesce(price,1) not between 1 and 1000000000000
    or coalesce(bid_amount,1) not between 1 and 1000000000000 or price<bid_amount then raise exception 'Set a valid starting bid and/or Buy now price.';end if;
   duration:=coalesce((args->>'hours')::integer,24);
   if duration not in (1,6,24,48) then raise exception 'Choose a supported auction duration.';end if;
  else
   duration:=168;want:=args->'want';
   if not exists(select 1 from arena_private.market_species where name=want->>'name') then raise exception 'Choose the Pokémon you want to receive.';end if;
   if nullif(want->>'nature','') is not null and want->>'nature' not in ('Hardy','Lonely','Adamant','Naughty','Brave','Bold','Docile','Impish','Lax','Relaxed','Modest','Mild','Bashful','Rash','Quiet','Calm','Gentle','Careful','Quirky','Sassy','Timid','Hasty','Jolly','Naive','Serious') then raise exception 'Choose a valid nature.';end if;
   if nullif(want->>'personality','') is not null and want->>'personality' not in ('Hearty','Sleepy','Easygoing','Messy','Relaxed','Proud','Energetic','Hotheaded','Competitive','Feisty','Steady','Resilient','Persistent','Enduring','Determined','Swift','Alert','Impulsive','Playful','Skittish','Resolute','Vain','Defiant','Driven','Stubborn','Curious','Mischievous','Clever','Thoughtful','Picky') then raise exception 'Choose a valid personality.';end if;
   if want ? 'shiny' and jsonb_typeof(want->'shiny') not in ('boolean','null') then raise exception 'Choose a valid appearance.';end if;
   want:=jsonb_strip_nulls(jsonb_build_object('name',want->>'name','nature',nullif(want->>'nature',''),'personality',nullif(want->>'personality',''),'shiny',want->'shiny'));
  end if;
  if pokemon->'profile'->>'trade_id' is not null then
   select * into asset from arena_private.market_assets a where a.id=(pokemon->'profile'->>'trade_id')::uuid for update;
   if asset.owner_id is distinct from uid or asset.state is distinct from 'owned' then raise exception 'This Pokémon is not available to trade.';end if;
  else
   if (select count(*) from arena_private.market_pokemon_rows(saved) r where r.name=pokemon->>'name' and r.pokemon->'profile'->'pid'=pokemon->'profile'->'pid')>1 then
    raise exception 'These copies have an ambiguous legacy identity. Choose a different copy.';end if;
   insert into arena_private.market_assets(owner_id,state,source_user_id,source_name,source_pid,pokemon)
    values(uid,'escrow',uid,pokemon->>'name',(pokemon->'profile'->>'pid')::bigint,pokemon) returning * into asset;
  end if;
  pokemon:=jsonb_set(pokemon,'{profile,trade_id}',to_jsonb(asset.id::text));
  update arena_private.market_assets set state='escrow',pokemon=pokemon where id=asset.id;
  select coalesce(array_agg(left(value,24)),'{}') into tag_values from (select distinct trim(value) value from jsonb_array_elements_text(coalesce(args->'tags','[]')) where length(trim(value))>0 limit 8) t;
  metadata:=arena_private.market_metadata(pokemon);
  insert into arena_private.market_listings(kind,seller_id,asset_id,pokemon,want,tags,minimum_bid,buy_now,ends_at)
   values(kind,uid,asset.id,metadata,want,tag_values,bid_amount,price,clock_timestamp()+make_interval(hours=>duration)) returning * into listing;
  saved:=taken.new_document;result:=jsonb_build_object('listing_id',listing.id,'message',case when kind='auction' then 'Auction created.' else 'Trade request created.' end);
 elsif action='claim' then
  for delivery in select * from arena_private.market_deliveries d where d.user_id=uid and d.claimed_at is null order by d.created_at for update loop
   if delivery.asset_id is not null then
    select * into asset from arena_private.market_assets a where a.id=delivery.asset_id for update;
    if asset.owner_id is distinct from uid or asset.state is distinct from 'delivery' then raise exception 'A delivery could not be verified.';end if;
    update arena_private.market_assets set state='owned' where id=asset.id;
    saved:=arena_private.market_put(saved,asset.pokemon);
    receipt:=receipt || jsonb_build_array(jsonb_build_object('name',asset.pokemon->>'name','coins',0));
   end if;
   coins:=coins+delivery.coins;
   if coins>9007199254740991 then raise exception 'Spend some coins before receiving this delivery.';end if;
   if delivery.coins>0 then receipt:=receipt || jsonb_build_array(jsonb_build_object('coins',delivery.coins));end if;
   update arena_private.market_deliveries set claimed_at=clock_timestamp() where id=delivery.id;
  end loop;
  p:=arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}');p:=jsonb_set(p,'{coins}',to_jsonb(coins));
  saved:=arena_private.market_set(saved,'pokemon-arena-wild-progress',p);
  result:=jsonb_build_object('receipts',receipt,'message','Completed trades received in your PC and coin balance.');
 else
  select * into listing from arena_private.market_listings l where l.id=(args->>'id')::uuid for update;
  if listing.id is null or listing.status<>'open' or listing.ends_at<=clock_timestamp() then raise exception 'This listing is no longer available.';end if;
  select name into seller_name from arena_private.players where id=listing.seller_id;
  select * into asset from arena_private.market_assets a where a.id=listing.asset_id for update;
  if action='cancel' then
   if listing.seller_id<>uid then raise exception 'You can only cancel your own listing.';end if;
   if listing.high_bidder is not null then raise exception 'An auction with bids must run to completion.';end if;
   update arena_private.market_assets set state='owned' where id=asset.id;
   saved:=arena_private.market_put(saved,asset.pokemon);
   update arena_private.market_listings set status='cancelled' where id=listing.id;
   result:=jsonb_build_object('message','Listing cancelled. Your Pokémon returned to your PC.');
  elsif action in ('bid','buy') then
   if listing.kind<>'auction' or listing.seller_id=uid then raise exception 'Choose another player’s auction.';end if;
   bid_amount:=case when action='buy' then listing.buy_now else (args->>'amount')::bigint end;
   if bid_amount is null or bid_amount not between 1 and 1000000000000 then raise exception 'Enter a valid coin amount.';end if;
   if action='bid' and (listing.minimum_bid is null or bid_amount<listing.minimum_bid or bid_amount<=listing.current_bid) then raise exception 'Your bid must exceed the current bid and meet the starting bid.';end if;
   if listing.buy_now is not null and bid_amount>=listing.buy_now then action:='buy';bid_amount:=listing.buy_now;end if;
   payment:=bid_amount-case when listing.high_bidder=uid then listing.current_bid else 0 end;
   if coins<payment then raise exception 'You do not have enough coins for this bid.';end if;
   if listing.high_bidder is not null and listing.high_bidder<>uid then
    insert into arena_private.market_deliveries(user_id,coins,event_key) values(listing.high_bidder,listing.current_bid,listing.id||':outbid:'||listing.version);
    perform arena_private.market_notice(listing.high_bidder,listing.id,'You were outbid',listing.pokemon->>'name'||': your reserved '||listing.current_bid||' coins are ready to receive.');
   end if;
   p:=jsonb_set(p,'{coins}',to_jsonb(coins-payment));saved:=arena_private.market_set(saved,'pokemon-arena-wild-progress',p);
   insert into arena_private.market_bids(listing_id,bidder_id,amount) values(listing.id,uid,bid_amount);
   update arena_private.market_listings set high_bidder=uid,current_bid=bid_amount,version=version+1 where id=listing.id;
   if action='buy' then
    update arena_private.market_assets set owner_id=uid,state='owned' where id=asset.id;
    saved:=arena_private.market_put(saved,asset.pokemon);
    insert into arena_private.market_deliveries(user_id,coins,event_key) values(listing.seller_id,bid_amount,listing.id||':payment');
    update arena_private.market_listings set status='completed' where id=listing.id;
    perform arena_private.market_notice(listing.seller_id,listing.id,'Auction sold!',listing.pokemon->>'name'||' was bought by '||buyer_name||' for '||bid_amount||' coins.');
    result:=jsonb_build_object('message','Purchase completed. '||(listing.pokemon->>'name')||' is in your PC.');
   else result:=jsonb_build_object('message','Bid placed. Coins are reserved until you win or are outbid.');end if;
  elsif action='fulfill' then
   if listing.kind<>'request' or listing.seller_id=uid then raise exception 'Choose another player’s open request.';end if;
   if not arena_private.market_matches(pokemon,listing.want) then raise exception 'Your selected Pokémon does not match this request.';end if;
   saved:=taken.new_document;
   if pokemon->'profile'->>'trade_id' is not null then
    if not exists(select 1 from arena_private.market_assets a where a.id=(pokemon->'profile'->>'trade_id')::uuid and a.owner_id=uid and a.state='owned') then raise exception 'Your offered Pokémon could not be verified.';end if;
   else
    if (select count(*) from arena_private.market_pokemon_rows((select save_data from public.arena_saves where user_id=uid)) r where r.name=pokemon->>'name' and r.pokemon->'profile'->'pid'=pokemon->'profile'->'pid')>1 then raise exception 'Choose a copy with an unambiguous identity.';end if;
    insert into arena_private.market_assets(owner_id,state,source_user_id,source_name,source_pid,pokemon)
     values(uid,'owned',uid,pokemon->>'name',(pokemon->'profile'->>'pid')::bigint,pokemon) returning id into request_id;
    pokemon:=jsonb_set(pokemon,'{profile,trade_id}',to_jsonb(request_id::text));
   end if;
   update arena_private.market_assets set owner_id=listing.seller_id,state='delivery',pokemon=pokemon where id=(pokemon->'profile'->>'trade_id')::uuid;
   insert into arena_private.market_deliveries(user_id,asset_id,event_key) values(listing.seller_id,(pokemon->'profile'->>'trade_id')::uuid,listing.id||':requested');
   update arena_private.market_assets set owner_id=uid,state='owned' where id=asset.id;
   saved:=arena_private.market_put(saved,asset.pokemon);
   update arena_private.market_listings set status='completed' where id=listing.id;
   perform arena_private.market_notice(listing.seller_id,listing.id,'Trade request completed!',buyer_name||' fulfilled your request. '||(pokemon->>'name')||' is ready to receive in your PC.');
   perform arena_private.market_notice(uid,listing.id,'Trade completed!',(asset.pokemon->>'name')||' was received from '||seller_name||'.');
   result:=jsonb_build_object('message','Trade completed. '||(asset.pokemon->>'name')||' is in your PC.');
  end if;
 end if;
 issue:=arena_private.market_save_issue(uid,saved);
 if issue is not null then raise exception 'Trade ownership verification failed. Refresh your PC.';end if;
 revision:=clock_timestamp();
 update public.arena_saves set save_data=saved,updated_at=revision where user_id=uid;
 result:=coalesce(result,'{}') || jsonb_build_object('status','ok');
 insert into arena_private.market_operations(user_id,request_id,action,payload_hash,response)
  values(uid,(args->>'request_id')::uuid,incoming_action,request_hash,result);
 return result || jsonb_build_object('save_data',saved,'updated_at',revision);
exception when others then
 if uid is not null then insert into arena_private.market_security_events(user_id,reason,details)
  values(uid,'market_rejection',jsonb_build_object('action',action,'code',sqlstate,'message',left(sqlerrm,500)));end if;
 return jsonb_build_object('status','error','message',case when sqlstate='P0001' then sqlerrm else 'Trading could not be completed. Refresh your PC and try again.' end);
end $$;
create or replace function arena_private.campaign_hunt_choices(uid uuid,document jsonb,region_name text)
returns jsonb language sql stable set search_path=pg_catalog as $$
 select coalesce(jsonb_agg(to_jsonb(choices)-'position' order by position),'[]') from (
  select f.root,(array_agg(s.name order by s.dex))[1] name,min(f.min_level) min_level,
   row_number() over(order by md5(uid::text||(clock_timestamp() at time zone 'UTC')::date::text||f.root)) position
  from arena_private.market_species s join arena_private.campaign_families f using(dex) join arena_private.campaign_regions r on (s.encounter_region is null and r.generation=s.generation or s.encounter_region=r.region)
  where r.region=region_name and not f.rare group by f.root
  order by position limit case when arena_private.campaign_complete(document,'Kalos') then 6 else 3 end
 ) choices
$$;
update arena_private.campaign_families set root=1057,min_level=35 where dex=862;
update arena_private.campaign_families set root=1044,min_level=20 where dex=863;
update arena_private.campaign_families set root=1056,min_level=20 where dex=864;
update arena_private.campaign_families set root=1049,min_level=20 where dex=865;
update arena_private.campaign_families set root=439,min_level=35 where dex=866;
update arena_private.campaign_families set root=1061,min_level=20 where dex=867;
update arena_private.campaign_families set root=1079,min_level=20 where dex=902;
update arena_private.campaign_families set root=1069,min_level=20 where dex=903;
update arena_private.campaign_families set root=1068,min_level=20 where dex=904;
update arena_private.campaign_families set root=1083,min_level=20 where dex=980;
commit;
