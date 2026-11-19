const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const moves=('Thunder|Thunderbolt|Thunder Shock|Electro Ball|Shadow Ball|Aura Sphere|Focus Blast|Energy Ball|Sludge Bomb|'+
 'Hyper Beam|Solar Beam|Ice Beam|Aurora Beam|Psybeam|Flash Cannon|Dragon Pulse|Surf|Muddy Water|Blizzard|Heat Wave|Sludge Wave|Earthquake|'+
 'Flamethrower|Dragon Breath|Icy Wind|Hurricane|Twister|Bleakwind Storm|Rock Slide|Draco Meteor|Fire Blast|Explosion|Self-Destruct|Misty Explosion|'+
 'Slash|X Scissor|Night Slash|Leaf Blade|Quick Attack|Extreme Speed|Flare Blitz|Brave Bird|Protect|Reflect|Light Screen|Recover|Moonlight|Synthesis|Roost|'+
 'Confusion|Psychic|Psyshock|Psystrike|Future Sight|Night Shade|Hex|Moonblast|Dazzling Gleam|Swift|Magical Leaf|Ancient Power|Stone Edge|Earth Power|'+
 'Hydro Pump|Hydro Cannon|Bubble Beam|Water Pulse|Dark Pulse|Origin Pulse|Giga Drain|Mega Drain|Dream Eater|Hyper Voice|Boomburst|Bug Buzz|Snarl|'+
 'Bite|Crunch|Fire Fang|Ice Fang|Thunder Fang|Fire Punch|Ice Punch|Thunder Punch|Sucker Punch|Close Combat|Shadow Claw|Dragon Claw|Psycho Cut|Aqua Jet|Dragon Ascent|Aerial Ace|Fly|Bounce|'+
 'Dragon Rush|Fire Spin|Dragon Tail|Hypnosis|Venoshock|Confuse Ray|Outrage|Blast Burn|Flame Charge|Overheat|Air Slash|Toxic|Shadow Punch|Iron Head|'+
 'Swords Dance|Dragon Dance|Quiver Dance|Calm Mind|Nasty Plot|Agility|Iron Defense|Tailwind|Will O Wisp|Thunder Wave|Sleep Powder|Poison Powder|Stun Spore|Spore|Sing').split('|');

function surface() {
 const commands=[],stack=[];
 const target={canvas:{width:960,height:480},globalAlpha:1,
  save(){stack.push(this.globalAlpha);}, restore(){assert(stack.length,'unpaired restore');this.globalAlpha=stack.pop();},
  createRadialGradient(...args){commands.push(['gradient',...args]);return {addColorStop(){}};}};
 const ctx=new Proxy(target,{get(obj,key){
  if(key in obj)return obj[key];
  return (...args)=>{
   for(const value of args)if(typeof value==='number')assert(Number.isFinite(value),'invalid '+key);
   if(key==='arc'||key==='ellipse')assert(args[2]>=0,key);
   commands.push([key,...args]);
  };
 }});
 return {ctx,commands,stack};
}
const renderMath=Object.create(Math);
renderMath.random=()=>{throw Error('Move artwork used combat RNG');};
const world=vm.createContext({Math:renderMath});
function artworkSources(file){
 return [...read(file).matchAll(/<script src="\.{1,2}\/(assets\/arena-move-effects(?:-[a-z]+)?\.js)(\?[^"]*)?"><\/script>/g)]
  .map(([,src,version])=>[src,version]);
}
const webPacks=artworkSources('index.html');
assert.deepEqual(artworkSources('local-test/PokeArena_Local_Test.html'),webPacks,'local and web releases load the same artwork in order');
for(const [src] of webPacks)vm.runInContext(read(src),world);
const art=world.ArenaMoveEffects;
const recoveryMoves=['Refresh','Heal Bell','Aromatherapy','Psycho Shift','Purify','Lunar Blessing','Jungle Healing','Take Heart',
 'Wake Up Slap','Smelling Salts','Dire Claw','Baneful Bunker','Burning Bulwark','Mist'];
const engine=read('supabase/functions/arena-combat/engine.js');
function snapshotFromClient(mode,side,effects,casts) {
 const source=read('multiplayer.js');
 const start=source.indexOf(' function showBattleSnapshot(');
 const end=source.indexOf(' function updateOnlineRoster(',start);
 const isCoop=source.split('\n').find(line=>line.includes('const isCoop='));
 assert(start>=0 && end>start && isCoop,'online snapshot entry point');
 const view={active:{mode,side},megaRaidTiers:{coop_mega_master:{}},canvas:{width:960},performance:{now:()=>1000},
  displayedTurn:0,battleSnapshot:null,playbackClock:null,playbackDelay:0.25,snapshotArrival:0,
  arenaActors:new Map(),visualSnapshots:[],byId:()=>({}),setArenaDimensions(){},updateNormalAttackToggle(){},
  renderBattleDps(){},updateOnlineRoster(){},
  packet:{turn:1,battle:{clock:1,actors:[],fields:[],arenaMap:{zones:[]},effects,casts}}};
 vm.runInNewContext(isCoop+'\n'+source.slice(start,end)+'\nshowBattleSnapshot(packet,()=>{});',view);
 return {...view.visualSnapshots[0],mirrored:view.arenaMap.viewMirror};
}
const probe=String.raw`
export function raidMoves(){return Object.values(megaRaidTiers).map(raid=>raid.moves);}
export function campaignMoves(){
 const gyms=gymTeams.map(g=>g.roster.flatMap((name,i)=>gymMoves(name,g,i)));
 const masters=gymTeams.map(g=>{
  const opponent=masterGymOpponent(g);
  return opponent.roster.flatMap((name,i)=>masterGymKit(name,opponent,i).moves);
 });
 return {gyms,masters,listed:gymTeams.flatMap(g=>g.plan.team.flatMap(slot=>slot[3])),
  starters:starterNames.map(name=>wildMoves(name)),field:dexNames.map(name=>wildMoves(name))};
}
export function playerMoveCoverage() {
 const visible=visibleArenaMoves(),rareLearners=new Set(),ordinaryLearners=new Set();
 for(const name of dexNames){
  const learners=isLegendaryEncounter(name)?rareLearners:ordinaryLearners;
  for(const move of Object.keys(levelUpMoves[dex[name][0]] ?? {}))learners.add(move);
 }
 return {catalog:visible,player:dexNames.map(name=>movesFor(name)),
  damaging:visible.filter(move=>!moveCatalog[move][4]),
  machines:visible.filter(move=>['HM','TM','TR'].includes(machineKinds[move])),
  ailments:visible.filter(move=>{const rules=moveRules(move);return rules.ailment>=1 && rules.ailment<=6 && (moveCatalog[move][4] || rules.ailmentChance>0);}),
  signatures:visible.filter(move=>rareLearners.has(move) && !ordinaryLearners.has(move) && !moveCatalog[move][4])};
}
export function triggerHazards(opts={}) {
 const match={id:'ab347c12-0000-4000-8000-000000000001',mode:'free_fight',
  format:1,host_pick:['Mew'],guest_pick:['Blissey'],host_entries:{},guest_entries:{}};
 initializeOnline(match);
 allies[0].ability=null;
 for(const [side,actor] of [allies[0],enemies[0]].entries()){
  actor.entryPending=false;
  Object.assign(trainerFields[side][0],{actor,transition:null});
 }
 Object.assign(enemies[0],{x:610,y:208,type:opts.type??'Normal',singleType:true,hp:1000,max:1000,
  heldItem:null,ability:opts.ability??null,ailment:null,stages:Array(10).fill(0)});
 if(opts.reflect) {
  enemies[0].ability='Magic Bounce';
  reflectHazard(allies[0],'Spikes');
 }else{
  entryHazards[1]={...hazardCaps};
  if(opts.resume)loadOnlineState(JSON.parse(JSON.stringify(saveOnlineState())));
  applyEntryHazards(enemies[0],allies[0]);
 }
 const saved=saveOnlineState(),defender=enemies[0];
 return {events:onlineView(saved,'guest',match.mode).effects,hp:defender.hp,speed:defender.stages[6],
  ailment:defender.ailment,hazards:saved.entryHazards,x:defender.x,y:defender.y};
}
export function captureMove(move,opts={}) {
 const reserves=opts.bench ?? (Object.hasOwn(hazardCaps,move) || ['Roar','Parting Shot','Baton Pass','Teleport','Whirlwind','Shed Tail','Chilly Reception','Perish Song','Healing Wish','Lunar Dance','Revival Blessing','Assist'].includes(move));
 const group=opts.group ?? ['Helping Hand','Ally Switch','Coaching','Dragon Cheer','After You','Aromatic Mist','Bestow','Decorate','Floral Healing','Follow Me','Gear Up','Heal Pulse','Instruct','Magnetic Flux','Rage Powder','Spotlight'].includes(move);
 const match={id:'ab347c12-0000-4000-8000-000000000001',mode:'free_fight',format:group?3:1,
  host_pick:group?['Mew','Raichu','Umbreon']:reserves?['Mew','Vaporeon']:['Mew'],
  guest_pick:group?['Blissey','Snorlax','Wigglytuff']:reserves?['Blissey','Snorlax']:['Blissey'],host_entries:{},guest_entries:{}};
 initializeOnline(match);
 const a=allies[0],b=enemies[0];
 for(const [index,actor] of [a,b].entries()){
  Object.assign(actor,{x:310+index*28,y:210,hp:3500,max:5000,charge:0,attack:0,heldItem:null,ability:null,
   type:'Normal',singleType:true,entryPending:false,normalAttacksEnabled:false,dashRecharge:[999,999,999],defendRecharge:[999,999,999],
   moves:[index?'Pound':move],moveTimers:[0],moveCooldowns:[4],moveCooldownStarts:[],side:index?'guest':'host',revealed:true});
  Object.assign(trainerFields[index][0],{actor,transition:null});
 }
 b.type=opts.defenderType ?? 'Water';b.ability=opts.defenderAbility ?? null;b.moves=['Pound','Psychic'];b.moveTimers=[0,0];b.moveCooldowns=[3,4];
 if(opts.defenderHP!==undefined)b.hp=opts.defenderHP;
 if(move==='Taunt')b.moves[1]='Recover';
 if(['Sketch','Mimic','Encore','Spite'].includes(move))b.lastUsedMove='Pound';
 if(['Psych Up','Haze','Power Swap','Guard Swap'].includes(move)){b.stages[2]=2;b.stages[3]=2;}
 if(['Embargo','Magic Room','Trick'].includes(move))b.heldItem='Leftovers';
 if(move==='Recycle'){a.heldItem='Oran Berry';a.itemUsed=true;}
 if(move==='Speed Swap')b.pace=a.pace+35;
 if(move==='Skill Swap')b.ability='Pressure';
 if(['Nightmare','Wake Up Slap'].includes(move)){b.ailment=2;b.ailmentTime=null;}
 if(move==='Smelling Salts'){b.ailment=1;b.ailmentTime=5;}
 if(move==='Purify' || move==='Venom Drench'){b.ailment=5;b.ailmentTime=5;}
 if(['Refresh','Heal Bell','Aromatherapy','Psycho Shift'].includes(move)){a.ailment=5;a.ailmentTime=5;a.dot=1;}
 if(move==='Aurora Veil')setWeather('Snow');
 if(move==='Baton Pass')a.stages[2]=2;
 if(move==='Dream Eater'){b.ailment=2;b.ailmentTime=8;}
 if(group)for(const [side,team] of [allies,enemies].entries())for(let slot=1;slot<3;slot++){
  const actor=team[slot],lead=team[0];
  Object.assign(actor,{x:lead.x+slot*3,y:lead.y+slot*6,hp:3500,max:5000,ability:null,heldItem:null,type:side?(opts.defenderType ?? 'Normal'):'Normal',singleType:true});
  Object.assign(trainerFields[side][slot],{actor,transition:null});
 }
 a.hp=sacrificeProfiles.has(move)?200:1500;
 if(move==='Substitute')a.hp=opts.userHP ?? a.max;
 if(move==='Ally Switch' && group){
  a.hp=a.max;allies[1].hp=allies[1].max*.23;b.x=opts.blockSwap?a.x:430;
  Object.assign(allies[1],{x:235,y:250});Object.assign(allies[2],{x:206,y:318});
  Object.assign(enemies[1],{x:530,y:310});Object.assign(enemies[2],{x:580,y:340});
 }
 // Exercise the prerequisites that the normal AI and move resolver enforce.
 if(['Belly Drum','Follow Me','Rage Powder','Shed Tail'].includes(move))a.hp=a.max;
 if(['Healing Wish','Lunar Dance','Revival Blessing','Assist'].includes(move) && reserves){
  const reserve=allies[1];reserve.moves=['Pound'];reserve.moveTimers=[2];
  reserve.hp=move==='Revival Blessing'?0:Math.floor(reserve.max*.4);
  if(move==='Healing Wish'||move==='Lunar Dance')a.hp=a.max*.2;
 }
 if(['Acupressure','Heal Pulse','Floral Healing','Bestow','Spotlight','After You','Instruct','Magnetic Flux','Gear Up'].includes(move) && group){
  const ally=allies[1];Object.assign(ally,{x:260,y:185,hp:move==='Spotlight'?ally.max:ally.max*.2});
  if(move==='After You')ally.charge=2;
  if(move==='Instruct')ally.lastUsedMove='Pound';
  if(move==='Magnetic Flux'||move==='Gear Up')ally.ability='Plus';
  if(move==='Bestow')a.heldItem='Oran Berry';
  if(opts.blockHeal)ally.healBlockUntil=100;
 }
 if(move==='Happy Hour'){selectedTrainer={name:'Test Trainer'};happyHourBonus=Boolean(opts.alreadyUsed);}
 if(move==='Court Change')entryHazards[0]={Spikes:1};
 if(move==='Teatime'){a.heldItem='Oran Berry';a.itemUsed=false;a.hp=a.max*.8;}
 if(move==='Mud Sport')b.moves[1]='Thunderbolt';
 if(move==='Water Sport')b.moves[1]='Flamethrower';
 if(move==='Soak')b.type=opts.defenderType ?? 'Normal';
 if(['Switcheroo','Corrosive Gas'].includes(move))b.heldItem='Leftovers';
 if(['Gastro Acid','Role Play','Doodle'].includes(move))b.ability=opts.defenderAbility ?? 'Pressure';
 if(['Heart Swap','Topsy-Turvy'].includes(move))b.stages[2]=2;
 if(move==='Power Shift'||move==='Power Trick'){a.stats[2]=a.stats[1]+50;a.stats[4]=a.stats[5]+50;}
 if(move==='Power Split')b.stats[1]=a.stats[1]+50;
 if(['Copycat','Me First','Mirror Move','Disable','Conversion 2'].includes(move))b.lastUsedMove=opts.calledMove===false?null:'Pound';
 if(move==='Me First')b.charge=2;
 if(move==='Conversion'){a.moves.push('Ember');a.moveTimers.push(5);a.moveCooldowns.push(5);}
 if(opts.userType)a.type=opts.userType;
 if(move==='Curse' && opts.userType==='Ghost')a.hp=a.max;
 if(move==='Sleep Talk'){
  if(opts.sleeping!==false){a.ailment=2;a.ailmentTime=8;}
  if(opts.calledMove!==false){a.moves.push(opts.calledMove ?? 'Pound');a.moveTimers.push(0);a.moveCooldowns.push(4);}
 }
 if(move==='Mind Blown'){a.hp=a.max;b.type=opts.defenderType ?? 'Grass';}
 if(move==='Steel Beam'){a.hp=a.max;b.type=opts.defenderType ?? 'Fairy';}
 if(reserves){clock=2;a.enteredAt=0;b.enteredAt=0;}
 if(opts.weather)setWeather(opts.weather);
 if(opts.terrain)setTerrain(opts.terrain);
 a.ability='No Guard';
 a.ai=normalizeBattleAI({mode:'Advanced',gambits:[{target:'Any',condition:'Always',operator:'Equal',value:'True',move}]});
 if(opts.resolve)resolveOffensiveMove(a,move,moveRules(move),b,[b]);
 const warnings=[];
 const snapshot=cast=>JSON.parse(JSON.stringify({...cast,actor:{friendly:cast.actor.friendly}}));
 for(let tries=0;tries<5 && !pendingCasts.length && !effects.length;tries++) {
  act(a,[b],1/60);clock+=1/60;
 }
 if(opts.dodge){b.x=900;b.y=420;}
 if(opts.interrupt)a.flinch=2;
 let initialWarning=pendingCasts[0]?.warning,resumedFlight=false;
 for(let i=0;i<420 && pendingCasts.length;i++){
  const c=pendingCasts[0];
  if(i===0 || (c.flight||c.roaming) && !warnings.some(w=>w.flight||w.roaming))warnings.push(snapshot(c));
  clock+=1/60;tickSkillCasts(1/60);
  if(opts.resume && i===16 || opts.resumeFlight && c.flight && !resumedFlight){
   const saved=JSON.parse(JSON.stringify(saveOnlineState()));
   loadOnlineState(saved);
   if(c.flight)resumedFlight=true;
  }
 }
 if(move==='Wish' && opts.finishWish){
  effects=[];
  if(opts.resume)loadOnlineState(JSON.parse(JSON.stringify(saveOnlineState())));
  const user=allies[0];
  if(opts.blockHeal)user.healBlockUntil=100;
  clock=user.wishAt+.01;tickStatus(user,.01);tickStatus(user,.01);
 }
 const saved=saveOnlineState();
 for(const side of ['host','guest']){
  const view=onlineView(saved,side,match.mode);
  if(JSON.stringify(view.sounds)!==JSON.stringify(saved.sounds))throw Error('Missing sound cues in '+side+' view');
  const publicEvents=view.effects;
  if(JSON.stringify(publicEvents)!==JSON.stringify(saved.effects))throw Error('Missing move events in '+side+' view');
 }
 return {warnings,sounds:saved.sounds,events:saved.effects.filter(e=>e.move===move),initialWarning,targetHP:enemies[0].hp,fields:saved.arenaSkillFields ?? [],
  helped:allies.filter(member=>member.helpingHandUntil>clock).map(member=>[member.x,member.y]),
  recall:saved.fields[0][0].transition,casterMoves:allies[0].moves,resumedFlight,
  userHP:allies[0].hp,decoy:allies[0].substituteHP,seedAt:enemies[0].seedAt,
  allyState:group||reserves?allies.slice(1).map(member=>({x:member.x,y:member.y,hp:member.hp,max:member.max,
   item:member.heldItem,charge:member.charge,stages:member.stages,redirect:member.redirectUntil>clock,moveTimers:member.moveTimers})):[],
  calledEffects:['Sleep Talk','Copycat','Assist','Instruct','Me First','Mirror Move'].includes(move)?saved.effects.filter(e=>e.move!==move):[]};
}
`;
(async()=>{
 const {captureMove,raidMoves,campaignMoves,playerMoveCoverage,triggerHazards}=await import('data:text/javascript;base64,'+Buffer.from(engine+probe).toString('base64'));
 const {gyms,starters,listed,masters,field}=campaignMoves();
 assert.equal(gyms.length,68);assert.equal(starters.length,27);
 assert.equal(masters.length,68);assert.equal(field.length,1083);
 const {catalog,player,machines,signatures,ailments,damaging}=playerMoveCoverage();
 assert.equal(player.length,field.length);
 const required=[...new Set([...moves,...listed,...gyms.flat(),...masters.flat(),...field.flat(),
  ...player.flat(),...machines,...signatures,...ailments,...damaging,...recoveryMoves,'Rest','Substitute','Endure','Sleep Talk','Leech Seed'])];
 const allMoves=[...new Set(catalog)];
 assert.deepEqual(allMoves.length,catalog.length,'duplicate entry in visible move catalog');
 for(const name of required)assert(allMoves.includes(name),'expected in visible move catalog: '+name);
 const paints=command=>['stroke','fill','fillRect'].includes(command[0]);
 const captures=new Map(),missing=[],silent=[];
 for(const move of allMoves){
  const record=captureMove(move);captures.set(move,record);
  if(!record.sounds.some(s=>s.move===move && s.event==='release'))silent.push(move);
  const {ctx,commands,stack}=surface();
  const packet=JSON.stringify(record);
  let castArtwork=false;
  for(const cast of record.warnings){
   const before=commands.length;
   if(art.activeCast(ctx,cast) && commands.slice(before).some(paints))castArtwork=true;
   art.charge(ctx,{...cast,remaining:cast.warning*.35});
  }
  for(const effect of record.events){
   const before=commands.length,handled=art.drawEffect(ctx,{...effect,life:.39});
   if(handled && !effect.impactOnly && commands.slice(before).some(paints))castArtwork=true;
  }
  if(!castArtwork || !commands.length)missing.push(move);
  assert.equal(stack.length,0,move);assert.equal(ctx.globalAlpha,1,move);
  assert.equal(JSON.stringify(record),packet,'mutated combat event for '+move);
 }
 assert.deepEqual(missing,[],'no special artwork on normal casts');
 assert.equal(captures.size,allMoves.length,'count each catalog entry once');
 assert.deepEqual(silent,[],'catalog moves without a release cue on a successful cast');
 vm.runInContext(read('assets/arena-sound-score.js'),world);
 const telegraphs=allMoves.filter(move=>captures.get(move).sounds.some(s=>s.move===move && s.event==='warning'));
 assert.equal(new Set(telegraphs.map(move=>world.ArenaMoveScores.get(move).warning)).size,telegraphs.length,'each visibly telegraphed skill has a distinct wind-up');
 const sounds=(record,move)=>record.sounds.filter(s=>s.move===move);
 const phases=(record,move)=>sounds(record,move).map(s=>s.event);
 for(const move of ['Hyper Beam','Explosion','Self-Destruct','Misty Explosion']){
  const cues=sounds(captures.get(move),move);
  assert.deepEqual(cues.filter(s=>s.event!=='impact').map(s=>s.event),['warning','charge1','charge2','charge3','release'],move);
  assert(cues.filter(s=>s.event.startsWith('charge')).every(s=>s.clock>cues[0].clock && s.clock<cues.find(s=>s.event==='release').clock));
  assert.deepEqual(phases(captureMove(move,{interrupt:true}),move),['warning'],move+' interrupted charge');
 }
 for(const move of ['Shadow Ball','Energy Ball','Focus Blast']){
  const miss=captureMove(move,{dodge:true,resumeFlight:true});
  assert.deepEqual(phases(miss,move),['warning','release'],move+' can fly past the target');
 }
 assert(!phases(captureMove('Thunder',{defenderType:'Ground'}),'Thunder').includes('impact'),'type immunity');
 const surf=captureMove('Surf',{group:true});
 assert(surf.events.filter(e=>e.damage>0).length>1,'multiple targets hit by the same wave');
 assert.equal(phases(surf,'Surf').filter(p=>p==='impact').length,1,'one contact sound for one wave');
 const pop=captures.get('Population Bomb'),hits=pop.events.filter(e=>e.damage>0);
 const pops=sounds(pop,'Population Bomb').filter(s=>s.event==='impact');
 assert.equal(pops.length,hits.length);assert.equal(pops.length,10);
 assert.equal(phases(pop,'Population Bomb').filter(s=>s==='release').length,1);
 assert.deepEqual(pops.map(s=>s.delay??0),hits.map((_,i)=>i*.038));
 assert.equal(phases(captures.get('Earthquake'),'Earthquake').filter(s=>s==='release').length,1);
 for(const move of ['Belly Drum','Baton Pass'])assert.deepEqual(phases(captures.get(move),move),['release']);
 const wishSound=captureMove('Wish',{finishWish:true,resume:true});
 assert.deepEqual(phases(wishSound,'Wish'),['release','impact']);
 assert(!phases(captureMove('Wish',{finishWish:true,blockHeal:true}),'Wish').includes('impact'));
 assert(phases(captureMove('Heal Pulse',{blockHeal:true}),'Heal Pulse').length===0,'unsuccessful ally heal');
 for(const [move,opts,key] of [['Weather Ball',{weather:'Rain'},'Rain'],['Terrain Pulse',{terrain:'Electric'},'Electric']]){
  const cues=sounds(captureMove(move,opts),move);assert(cues.length);assert(cues.every(s=>s.variant===key));
 }
 for(const record of captures.values()){
  const keys=record.sounds.map(s=>s.clock+'/'+s.order);
  assert.equal(new Set(keys).size,keys.length,'unique simultaneous event identifiers');
 }
 console.log(allMoves.length+' combat moves produced release sounds. Charge, dodge, immunity, multi-hit, AoE, delayed healing and online audio checks passed.');
 const raidLoadouts=raidMoves();assert.deepEqual(raidLoadouts.map(set=>set.length).sort((a,b)=>a-b),[8,8,8,16,16,16]);
 for(const raid of raidLoadouts)for(const name of raid)assert(captures.has(name),'untested raid boss move '+name);
 const draw=(method,event,mirror=false)=>{
  const {ctx,commands,stack}=surface();art[method](ctx,event,mirror);
  assert.equal(stack.length,0);return commands;
 };
 const thunder=captures.get('Thunder').events[0],bolt=captures.get('Thunderbolt').events[0];
 const thunderDraw=draw('drawEffect',{...thunder,life:.39});
 assert(thunderDraw.some(([op,x,y])=>op==='moveTo' && y<0),'strike starts overhead');
 assert(thunderDraw.some(([op,x,y])=>op==='lineTo' && x===thunder.tx && y===thunder.ty));
 assert(draw('drawEffect',{...bolt,life:.39}).some(([op,x,y])=>op==='translate'&&x===bolt.x&&y===bolt.y));
 for(const event of [{...thunder,damage:'Miss'},...captureMove('Thunder',{defenderType:'Ground',resolve:true}).events]){
  assert(!draw('drawEffect',{...event,life:.39}).some(([op])=>op==='gradient'),'failed strike played hit flash');
 }
 assert.equal(captures.get('Hyper Beam').initialWarning,2);
 assert.equal(captures.get('Explosion').initialWarning,5);
 const charge=captures.get('Hyper Beam').warnings[0];
 assert(draw('charge',{...charge,remaining:1}).some(([op])=>op==='gradient'));
 for(const move of ['Hyper Beam','Solar Beam','Ice Beam']){
  const record=captures.get(move),beam=record.events.find(e=>e.line);
  assert.equal(beam.halfWidth,record.warnings[0].line.radius,move+' uses its actual collision radius');
  assert(draw('drawEffect',{...beam,halfWidth:0,life:.46}).some(([op])=>op==='quadraticCurveTo'),'older server snapshot');
 }
 const orb=captures.get('Electro Ball').warnings.find(c=>c.flight);
 assert(orb);const travel=24;
 assert(draw('activeCast',{...orb,travel}).some(([op,x,y])=>op==='translate' && x===orb.line.x+orb.line.dx*travel && y===orb.line.y+orb.line.dy*travel));
 const wave=captures.get('Surf').events.find(e=>e.line);
 assert(draw('drawEffect',{...wave,life:.39}).some(([op,x,y,width,height])=>op==='rect'&&y===-wave.halfWidth&&height===wave.halfWidth*2&&width===Math.hypot(wave.tx-wave.x,wave.ty-wave.y)));
 for(const [mode,side,mirrored] of [['free_fight','guest',true],['free_fight','host',false],['coop_mega_master','guest',false]]){
  const view=snapshotFromClient(mode,side,[thunder,wave],[orb,charge]);
  const x=value=>mirrored?960-value:value;
  assert.equal(view.mirrored,mirrored);
  assert(draw('drawEffect',{...view.effects[0],life:.39},mirrored).some(([op,px,py])=>op==='lineTo' && px===x(thunder.tx) && py===thunder.ty));
  assert.equal(view.effects[1].x,x(wave.x));assert.equal(view.effects[1].tx,x(wave.tx));
  assert.equal(view.casts[1].line.end.x,x(charge.line.end.x));
  assert(draw('activeCast',{...view.casts[0],travel},mirrored).some(([op,px,py])=>op==='translate' &&
   Math.abs(px-x(orb.line.x+orb.line.dx*travel))<1e-7 && py===orb.line.y+orb.line.dy*travel));
 }
 assert(!captureMove('Surf',{dodge:true}).events.some(e=>typeof e.damage==='number'),'dodged wave hit its old target');
 const quake=captureMove('Earthquake',{dodge:true,resume:true});
 const full=captures.get('Earthquake').warnings[0].radius;
 assert.deepEqual(quake.events.map(e=>[e.innerRadius,e.radius]),[[0,full/3],[full/3,2*full/3],[2*full/3,full]]);
 assert.equal(quake.targetHP,3500,'quake drew in empty space without hurting a distant target');
 const {ctx}=surface();
 assert.equal(art.drawEffect(ctx,{move:'Unknown arena move'}),false);
 assert.equal(art.drawEffect(ctx,{move:'Quick Attack',dashSprite:{}}),false);
 assert.equal(art.activeCast(ctx,charge),false,'winding up keeps the standard danger indicator');
 assert.equal(art.aboveUnits(thunder),true);assert.equal(art.aboveUnits(wave),false);
 assert.equal(art.aboveUnits(captures.get('X Scissor').events[0]),true,'contact slashes must be visible over the target sprite');
 assert.equal(art.aboveUnits(captures.get('Dragon Ascent').events.find(e=>e.line)),true,'a large raid sprite must not cover its dash trail');
 assert.equal(art.aboveUnits({move:'Dragon Ascent',shape:'dash',dashSprite:{}}),false,'mobility afterimages keep their original layer');
 for(const name of ['Moonblast','Hydro Cannon','Swift','Boomburst','Fly','Bounce','Blast Burn','Discharge','Eruption','Rock Blast']){
  const group=captureMove(name,{group:true,resume:true}),areas=group.events.filter(e=>e.zone);
  assert.equal(areas.length,1,name+' should release once with three targets');
  const hits=group.events.filter(e=>e.impactOnly && Number.isFinite(e.damage) && e.damage>0);
  assert.equal(new Set(hits.map(e=>e.tx+','+e.ty)).size,3,name+' target impacts');
  if(name==='Rock Blast')assert(hits.length>=6 && hits.length<=15,'multi-hit rocks share one area animation');
  else assert.equal(hits.length,3,name+' single hit per target');
  const cast=group.warnings[0],release=areas[0];
  assert.deepEqual([release.tx,release.ty,release.radius],[cast.center.x,cast.center.y,cast.radius],name+' ground anchor');
  const artOps=draw('drawEffect',{...release,life:.39});
  assert(artOps.some(([op,x,y,r])=>op==='arc' && x===0 && y===0 && r===release.radius) && artOps.some(([op])=>op==='clip'));
 }
 const missedLanding=captureMove('Fly',{dodge:true});
 assert(missedLanding.events.some(e=>e.zone));assert(!missedLanding.events.some(e=>e.impactOnly));
 const wind=captureMove('Tailwind',{group:true});
 const recipients=wind.events.filter(e=>e.status);
 assert.equal(new Set(recipients.map(e=>e.tx+','+e.ty)).size,3,'Tailwind animates on each active recipient');
 assert.equal(wind.fields.filter(f=>f.kind==='Wind').length,1,'the cast creates a single Wind field');
 const blockedPowder=captureMove('Sleep Powder',{defenderAbility:'Overcoat',resolve:true}).events;
 const immunePunch=captureMove('Thunder Punch',{defenderType:'Ground',resolve:true}).events;
 for(const event of [blockedPowder[0],immunePunch[0],{...captures.get('Psychic').events[0],damage:'Miss'}]){
  assert(event.multiplier===0 || event.damage==='Miss');
  assert(!draw('drawEffect',{...event,life:.39}).some(paints),'unsuccessful targeted move painted a successful hit');
 }
 const drink=captures.get('Giga Drain').events[0];
 const firstMote=life=>draw('drawEffect',{...drink,life}).find(op=>op[0]==='arc')[1];
 assert(firstMote(.48)>firstMote(.32),'drained energy travels back to the attacker');
 const pulse=captures.get('Origin Pulse').events.find(e=>e.line);
 const roar=captures.get('Snarl').events.find(e=>e.sector);
 for(const [mode,side,mirrored] of [['free_fight','guest',true],['coop_mega_master','raid:p1',false]]){
  const x=value=>mirrored?960-value:value,view=snapshotFromClient(mode,side,[pulse,roar,drink],[]);
  assert.equal(view.mirrored,mirrored);
  assert.equal(view.effects[0].tx,x(pulse.tx));assert.equal(view.effects[1].sector.dx,mirrored?-roar.sector.dx:roar.sector.dx);
  for(const e of view.effects)assert(draw('drawEffect',{...e,life:.4},mirrored).some(paints),e.move);
 }
 const entrant=triggerHazards(),traps=entrant.events.filter(e=>e.hazardEntry);
 assert.deepEqual(triggerHazards({resume:true}),entrant,'entry hazards survive reconnect');
 assert.deepEqual(traps.map(e=>e.move).sort(),['Spikes','Stealth Rock','Sticky Web','Toxic Spikes']);
 assert.deepEqual([entrant.hp,entrant.speed,entrant.ailment],[800,-1,5]);
 const mirroredTraps=snapshotFromClient('free_fight','guest',traps,[]).effects;
 for(const e of mirroredTraps){
  assert.deepEqual([e.x,e.tx,e.y,e.ty],[960-entrant.x,960-entrant.x,entrant.y,entrant.y]);
  assert.equal(e.damage,'');assert(e.hazardEntry && art.aboveUnits(e));
  assert(draw('drawEffect',{...e,life:.39},true).some(paints),e.move+' on entry');
 }
 const airborne=triggerHazards({type:'Flying'}),guarded=triggerHazards({ability:'Magic Guard'}),poison=triggerHazards({type:'Poison'});
 assert.deepEqual(airborne.events.filter(e=>e.hazardEntry).map(e=>e.move),['Stealth Rock']);
 assert.equal(airborne.hp,850);assert.equal(guarded.hp,1000);
 assert.deepEqual(guarded.events.filter(e=>e.hazardEntry).map(e=>e.move).sort(),['Sticky Web','Toxic Spikes']);
 assert(!poison.events.some(e=>e.move==='Toxic Spikes'));assert(!poison.hazards[1]['Toxic Spikes']);
 const bounce=triggerHazards({reflect:true}),reflected=bounce.events.find(e=>e.move==='Spikes');
 assert.equal(bounce.hazards[0].Spikes,1);assert.equal(reflected.hazardEntry,false);
 assert.deepEqual([reflected.tx,reflected.ty],[bounce.x,bounce.y]);
 const bone=captures.get('Bonemerang').events.find(e=>Number.isFinite(e.damage));
 const boneX=age=>draw('drawEffect',{...bone,life:.58-age}).filter(op=>op[0]==='translate').at(-1)[1];
 assert(boneX(.22)>boneX(.04)+10 && boneX(.22)>boneX(.47)+10,'Bonemerang travels out and back');
 const tackle=captures.get('Tackle').events.find(e=>e.line);
 assert(art.aboveUnits(tackle));assert.equal(art.drawEffect(ctx,{...tackle,dashSprite:{}}),false);
 const scratch=captures.get('Scratch').events.find(e=>e.sector);
 const directional=snapshotFromClient('free_fight','guest',[bone,tackle,scratch],[]).effects;
 for(const event of directional){
  assert(draw('drawEffect',{...event,life:.37},true).some(([op,x,y])=>op==='scale'&&x===1&&y===-1),
   event.move+' keeps the same arc in the mirrored view');
 }
 const helping=captures.get('Helping Hand'),boost=helping.events[0];
 assert.deepEqual(helping.helped,[[boost.tx,boost.ty]]);
 assert.notDeepEqual([boost.x,boost.y],[boost.tx,boost.ty]);
 assert.deepEqual(captureMove('Helping Hand',{group:false}).events,[]);
 assert.equal(captures.get('Baton Pass').recall.passStages[2],2);
 for(const move of ['Teleport','Baton Pass']){
  assert(captures.get(move).recall.incoming,move+' really sends a reserve');
  assert.deepEqual(captureMove(move,{bench:false}).events,[],move+' has no departure without a reserve');
 }
 assert.deepEqual(captures.get('Sketch').casterMoves,['Pound']);
 const weatherMarks=new Set();
 for(const weather of [null,'Rain','Sun','Snow','Sand']){
  const shot=captureMove('Weather Ball',{weather,resumeFlight:true});
  assert(shot.resumedFlight);
  const flight=shot.warnings.find(c=>c.flight);
  assert.equal(flight.visualWeather,weather);
  weatherMarks.add(JSON.stringify(draw('activeCast',{...flight,travel:22})));
  assert(shot.events.some(e=>e.impactOnly && e.damage>0));
 }
 assert.equal(weatherMarks.size,5,'Weather Ball has distinct weather emblems');
 const suppressed=captureMove('Weather Ball',{weather:'Rain',defenderAbility:'Cloud Nine'});
 assert.equal(suppressed.warnings.find(c=>c.flight).visualWeather,null);
 const oldBall={...suppressed.warnings.find(c=>c.flight),travel:18};delete oldBall.visualWeather;
 assert(draw('activeCast',oldBall).some(paints),'old snapshots display the neutral Weather Ball');
 for(const move of ['Pin Missile','Icicle Spear','Bullet Seed','Double Kick','Fury Swipes']){
  const hits=captures.get(move).events.filter(e=>e.damage>0);
  assert(hits.length>=2,move);
  assert.deepEqual(hits.map(e=>e.strikeIndex??0),hits.map((_,i)=>i));
  assert(!draw('drawEffect',{...hits[1],life:.575}).some(paints),move+' second hit started early');
  assert(draw('drawEffect',{...hits[1],life:.44}).some(paints),move+' second strike is visible');
  const knockout=captureMove(move,{defenderHP:1});
  assert.equal(knockout.events.filter(e=>e.damage>0).length,1,move+' stops at knockout');
 }
 const current=captures.get('Charge Beam').events.find(e=>e.line);
 assert(draw('drawEffect',{...current,life:.4}).some(([op,x,y,w,h])=>op==='rect'&&y===-current.halfWidth&&h===2*current.halfWidth));
 const grid=captureMove('Electroweb',{group:true,resume:true});
 assert.equal(grid.events.filter(e=>e.zone).length,1);
 assert.equal(grid.events.filter(e=>e.impactOnly && e.damage>0).length,3);
 const decoy=captures.get('Substitute');
 assert.equal(decoy.decoy,1250);assert.equal(decoy.userHP,3750);
 assert.deepEqual(captureMove('Substitute',{userHP:900}).events,[]);
 const sleep=captures.get('Sleep Talk');
 assert.deepEqual(sleep.calledEffects.map(e=>e.move),['Pound']);
 for(const name of ['Pound','Accelerock','Cut','Dynamax Cannon']){
  const hits=captureMove('Sleep Talk',{calledMove:name}).calledEffects;
  assert.equal(hits.length,1,name);const hit=hits[0];assert.equal(hit.move,name);
  assert(!hit.zone && !hit.sector && !hit.line);assert(art.aboveUnits(hit));
  const view=snapshotFromClient('free_fight','guest',[hit],[]);
  for(const [e,mirror] of [[hit,false],[view.effects[0],true]]){
   const recorded=JSON.stringify(e);const ops=draw('drawEffect',{...e,life:.39},mirror);
   assert(ops.some(paints),name+' landed through Sleep Talk');assert.equal(JSON.stringify(e),recorded);
   if(name==='Dynamax Cannon')assert(ops.some(([op,x,y,w,h])=>op==='rect' && w===Math.hypot(e.tx-e.x,e.ty-e.y) && h===14));
  }
 }
 const calledArea=captureMove('Sleep Talk',{calledMove:'Precipice Blades'}).calledEffects;
 assert.equal(calledArea.filter(e=>e.zone).length,1);
 assert.equal(calledArea.filter(e=>draw('drawEffect',{...e,life:.39}).some(paints)).length,1,'one area release per called move');
 assert.equal(sleep.events.length,1);assert.equal(sleep.events[0].x,sleep.events[0].tx);
 for(const opts of [{sleeping:false},{calledMove:false}])assert.deepEqual(captureMove('Sleep Talk',opts).events,[]);
 assert(captures.get('Leech Seed').seedAt>0);assert.deepEqual(captureMove('Leech Seed',{defenderType:'Grass'}).events,[]);
 for(const name of ['Roar Of Time','Spacial Rend','Judgment','Sacred Fire']){
  const hit=captures.get(name).events[0];
  assert(art.aboveUnits(hit),name+' stays visible over raid sprites');
  assert(!draw('drawEffect',{...hit,damage:'Miss',life:.39}).some(paints),name+' has no hit image on a miss');
 }
 for(const name of ['Precipice Blades','Tera Starstorm','Glaciate','Zap Cannon']){
  const battle=captureMove(name,{group:true,resume:true}),releases=battle.events.filter(e=>e.zone);
  assert.equal(releases.length,1);assert.equal(battle.events.filter(e=>e.impactOnly && e.damage>0).length,3);
  const cast=battle.warnings[0],release=releases[0];
  assert.deepEqual([release.tx,release.ty,release.radius],[cast.center.x,cast.center.y,cast.radius]);
  const miss=captureMove(name,{dodge:true});assert(miss.events.some(e=>e.zone));assert(!miss.events.some(e=>e.damage>0));
 }
 for(const name of ['Photon Geyser','Dynamax Cannon','Sandsear Storm']){
  const trajectory=captures.get(name).events.find(e=>e.line);
  assert(draw('drawEffect',{...trajectory,life:.39}).some(([op,x,y,w,h])=>op==='rect' && y===-trajectory.halfWidth && h===trajectory.halfWidth*2));
 }
 for(const name of ['Triple Axel','Double Iron Bash','Tail Slap','Scale Shot','Comet Punch']){
  const strikes=captures.get(name).events.filter(e=>e.damage>0);assert(strikes.length>=2,name);
  assert(!draw('drawEffect',{...strikes[1],life:.575}).some(paints));
  assert(draw('drawEffect',{...strikes[1],life:.44}).some(paints));
  assert.equal(captureMove(name,{defenderHP:1}).events.filter(e=>e.damage>0).length,1);
 }
 const swapped=captures.get('Ally Switch').events[0];
 assert.deepEqual([swapped.x,swapped.y,swapped.tx,swapped.ty],[235,250,310,210]);
 assert.deepEqual(captureMove('Ally Switch',{blockSwap:true}).events,[]);
 for(const [type,self] of [['Normal',true],['Ghost',false]]){
  const ev=captureMove('Curse',{userType:type}).events[0];assert(ev && (ev.x===ev.tx && ev.y===ev.ty)===self);
 }
 const needles=captures.get('Twineedle').events.filter(e=>e.damage>0);assert.equal(needles.length,2);
 assert(!draw('drawEffect',{...needles[1],life:.575}).some(paints));
 assert.equal(captureMove('Twineedle',{defenderHP:1}).events.filter(e=>e.damage>0).length,1);
 for(const name of ['Dark Void','Poison Gas','Pyro Ball','Splishy Splash']){
  const record=captureMove(name,{group:true,resume:true}),release=record.events.filter(e=>e.zone);
  assert.equal(release.length,1,name);assert.equal(release[0].radius,record.warnings[0].radius);
  assert.equal(record.events.filter(e=>e.impactOnly && (e.damage>0 || e.status)).length,3,name);
  const dodge=captureMove(name,{dodge:true});assert(!dodge.events.some(e=>e.impactOnly),name+' has no hit after a dodge');
 }
 const population=captures.get('Population Bomb').events.filter(e=>e.damage>0);
 assert.equal(population.length,10);
 assert.deepEqual(population.map(e=>e.strikeIndex??0),Array.from({length:10},(_,i)=>i));
 const lateStrike=population.at(-1);
 assert(!draw('drawEffect',{...lateStrike,life:.4}).some(paints),'tenth mouse waits its turn');
 assert(draw('drawEffect',{...lateStrike,life:.16}).some(paints),'tenth mouse is visible before the effect expires');
 assert(!draw('drawEffect',{...population[0],life:.16}).some(paints),'the first mouse has already left the target');
 for(const name of ['Population Bomb','Water Shuriken','Surging Strikes','Twin Beam','Tachyon Cutter','Triple Kick','Dragon Darts','Gear Grind']){
  const hits=captures.get(name).events.filter(e=>e.damage>0);assert(hits.length>=2,name);
  assert(!draw('drawEffect',{...hits[1],life:.575}).some(paints),name+' second strike started early');
  assert(draw('drawEffect',{...hits[1],life:.44}).some(paints),name+' second strike missing');
  assert.equal(captureMove(name,{defenderHP:1}).events.filter(e=>e.damage>0).length,1,name+' stops at a knockout');
 }
 for(const name of ['Eternabeam','Glacial Lance','Psyshield Bash','Raging Bull','Jump Kick','Steamroller','Zing Zap']){
  const record=captures.get(name),event=record.events.find(e=>e.line),lane=record.warnings[0].line;
  const width=event.shape==='wave'?lane.halfWidth:lane.radius;
  if(event.shape!=='dash')assert.equal(event.halfWidth,width,name);
  assert(draw('drawEffect',{...event,life:.38}).some(([op,x,y,w,h])=>op==='rect' && x===0 && y<0 && h===-2*y &&
   (event.shape==='dash'?h<=2*width:h===2*width) && Math.abs(w-lane.length)<1e-6),name+' artwork fits the collision lane');
  assert.equal(art.aboveUnits(event),event.shape==='dash',name);
 }
 const windup=captures.get('Eternabeam').warnings[0];
 assert.equal(windup.warning,.5);
 assert.notDeepEqual(draw('charge',{...windup,remaining:.46}),draw('charge',{...windup,remaining:.10}));
 assert.deepEqual(draw('charge',{...windup,flight:true}),[]);
 for(const name of ['Astral Barrage','Make It Rain','Mind Blown','Magnitude','Armor Cannon','Mortal Spin']){
  const record=captureMove(name,{group:true,resume:true,defenderType:'Grass'}),release=record.events.filter(e=>e.zone);
  assert.equal(release.length,1,name);assert.equal(release[0].radius,record.warnings[0].radius);
  assert.equal(record.events.filter(e=>e.impactOnly && e.damage>0).length,3,name+' group impact count');
  assert(!captureMove(name,{dodge:true}).events.some(e=>e.impactOnly),name+' target escaped the marked area');
 }
 for(const name of ['Make It Rain','Astral Barrage']){
  const fx=captureMove('Sleep Talk',{calledMove:name}).calledEffects;
  assert.equal(fx.filter(e=>e.zone).length,1);
  assert.equal(fx.filter(e=>draw('drawEffect',{...e,life:.4}).some(paints)).length,1,name+' single called release');
 }
 for(const name of ['Moongeist Beam','Blood Moon','Spirit Shackle','Behemoth Blade']){
  const hit=captures.get(name).events[0];assert(art.aboveUnits(hit));
  for(const damage of ['Miss','Ability blocked','Failed'])assert(!draw('drawEffect',{...hit,damage,life:.4}).some(paints),name);
 }
 for(const name of ['Heal Pulse','Floral Healing','Bestow','Spotlight','After You','Gear Up','Magnetic Flux']){
  const {events,allyState}=captures.get(name),ally=allyState[0];
  assert.equal(events.length,1,name+' draws once for the affected ally');
  assert.deepEqual([events[0].tx,events[0].ty],[ally.x,ally.y],name+' follows the recipient');
  assert.equal(captureMove(name,{group:false}).events.length,0,name+' without a suitable ally');
  if(name==='Heal Pulse'||name==='Floral Healing'){
   assert.equal(ally.hp,1625);assert.equal(captures.get(name).targetHP,3500);
   assert.equal(captureMove(name,{blockHeal:true}).events.length,0,name+' must not show a blocked heal');
  }
  if(name==='Bestow')assert.equal(ally.item,'Oran Berry');
  if(name==='After You')assert.equal(ally.charge,0);
  if(name==='Spotlight')assert(ally.redirect);
 }
 const pinch=captureMove('Acupressure',{group:true}),boosted=pinch.allyState[0];
 assert(boosted.stages.some(stage=>stage===2),'Acupressure applied to selected teammate');
 assert.deepEqual([pinch.events[0].tx,pinch.events[0].ty],[boosted.x,boosted.y]);
 const selfPinch=captures.get('Acupressure').events[0];
 assert.deepEqual([selfPinch.tx,selfPinch.ty],[selfPinch.x,selfPinch.y],'solo Acupressure');
 for(const name of ['Switcheroo','Trick']){
  const event=captureMove(name,{defenderAbility:'Sticky Hold'}).events[0];
  assert.equal(event.damage,'Failed');
  assert(!draw('drawEffect',{...event,life:.4}).some(paints),'blocked item exchange');
 }
 assert(captures.get('Shed Tail').recall);
 assert.equal(captureMove('Shed Tail',{bench:false}).events.length,0,'no decoy animation without a reserve');
 const wishCast=captures.get('Wish').events[0],wish=captureMove('Wish',{finishWish:true,resume:true});
 assert(!wishCast.wishResolved);assert.equal(wish.events.length,1,'Wish resolves once after restoring the saved cast');
 assert(wish.events[0].wishResolved && wish.userHP>1500);
 assert.notDeepEqual(draw('drawEffect',{...wishCast,life:.4}),draw('drawEffect',{...wish.events[0],life:.4}));
 assert.equal(captureMove('Wish',{finishWish:true,blockHeal:true}).events.length,0,'no landing flash for a blocked Wish');
 for(const name of ['Healing Wish','Lunar Dance','Revival Blessing']){
  const result=captures.get(name),reserve=result.allyState[0],event=result.events[0];
  assert.equal(reserve.hp,name==='Revival Blessing'?Math.ceil(reserve.max/2):reserve.max);
  if(name!=='Revival Blessing')assert.equal(result.userHP,0);
  if(name==='Lunar Dance')assert(reserve.moveTimers.every(value=>value===0));
  assert.deepEqual([event.tx,event.ty],[event.x,event.y],name+' appears at the caster on the battlefield');
  assert.equal(captureMove(name,{bench:false}).events.length,0);
 }
 for(const name of ['Assist','Copycat','Instruct','Me First','Mirror Move']){
  const record=captures.get(name);
  assert.equal(record.events.length,1,name+' cue');
  assert.equal(record.calledEffects.filter(e=>e.move==='Pound'&&!e.impactOnly).length,1,name+' called attack');
 }
 for(const name of ['Chilly Reception','Corrosive Gas','Cotton Spore','Flower Shield','Growl','Leer','Rototiller','Tail Whip']){
  const record=captures.get(name),areas=record.events.filter(e=>e.zone);
  assert.equal(areas.length,1,name+' single area release');assert.equal(areas[0].radius,record.warnings[0].radius);
  assert(draw('drawEffect',{...areas[0],life:.4}).some(op=>op[0]==='clip'),name+' uses telegraphed radius');
 }
 assert.equal(captureMove('Happy Hour',{alreadyUsed:true}).events.length,0,'Happy Hour plays once per trainer battle');
 console.log((allMoves.length-damaging.length)+' status and support moves have tested artwork.');
 console.log(damaging.length+' damaging moves have tested artwork.');
 console.log(allMoves.length+' distinct moves rendered on actual casts, including all '+player.length+
  ' default player and encounter kits, '+machines.length+' HMs, TMs and TRs, '+signatures.length+
  ' damaging moves learned by level only by legendary or mythical Pokémon, all six raids and all 136 Gym teams.');
})().catch(error=>{console.error(String(error.stack).replace(/data:text\/javascript;base64,[^:)]*/g,'engine.js').slice(0,1400));process.exitCode=1;});
