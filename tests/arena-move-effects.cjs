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
vm.runInContext(read('assets/arena-move-effects.js'),world);
vm.runInContext(read('assets/arena-move-effects-gym.js'),world);
const art=world.ArenaMoveEffects;
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
 return {gyms:gymTeams.map(g=>g.plan.team.flatMap(slot=>slot[3])),starters:starterNames.map(name=>wildMoves(name))};
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
 const reserves=opts.bench || Object.hasOwn(hazardCaps,move) || move==='Roar' || move==='Parting Shot';
 const match={id:'ab347c12-0000-4000-8000-000000000001',mode:'free_fight',format:opts.group?3:1,
  host_pick:opts.group?['Mew','Raichu','Umbreon']:reserves?['Mew','Vaporeon']:['Mew'],
  guest_pick:opts.group?['Blissey','Snorlax','Wigglytuff']:reserves?['Blissey','Snorlax']:['Blissey'],host_entries:{},guest_entries:{}};
 initializeOnline(match);
 const a=allies[0],b=enemies[0];
 for(const [index,actor] of [a,b].entries()){
  Object.assign(actor,{x:310+index*28,y:210,hp:3500,max:5000,charge:0,attack:0,heldItem:null,ability:null,
   type:'Normal',singleType:true,entryPending:false,normalAttacksEnabled:false,dashRecharge:[999,999,999],defendRecharge:[999,999,999],
   moves:[index?'Pound':move],moveTimers:[0],moveCooldowns:[4],moveCooldownStarts:[],side:index?'guest':'host',revealed:true});
  Object.assign(trainerFields[index][0],{actor,transition:null});
 }
 b.type=opts.defenderType ?? 'Water';b.ability=opts.defenderAbility ?? null;b.moves=['Pound','Psychic'];b.moveTimers=[0,0];b.moveCooldowns=[3,4];
 if(move==='Taunt')b.moves[1]='Recover';
 if(move==='Dream Eater'){b.ailment=2;b.ailmentTime=8;}
 if(opts.group)for(const [side,team] of [allies,enemies].entries())for(let slot=1;slot<3;slot++){
  const actor=team[slot],lead=team[0];
  Object.assign(actor,{x:lead.x+slot*3,y:lead.y+slot*6,hp:3500,max:5000,ability:null,heldItem:null,type:'Normal',singleType:true});
  Object.assign(trainerFields[side][slot],{actor,transition:null});
 }
 a.hp=sacrificeProfiles.has(move)?200:1500;
 if(move==='Steel Beam'){a.hp=a.max;b.type=opts.defenderType ?? 'Fairy';}
 if(reserves){clock=2;a.enteredAt=0;b.enteredAt=0;}
 a.ability='No Guard';
 a.ai=normalizeBattleAI({mode:'Advanced',gambits:[{target:'Any',condition:'Always',operator:'Equal',value:'True',move}]});
 if(opts.resolve)resolveOffensiveMove(a,move,moveRules(move),b,[b]);
 const warnings=[];
 const snapshot=cast=>JSON.parse(JSON.stringify({...cast,actor:{friendly:cast.actor.friendly}}));
 for(let tries=0;tries<5 && !pendingCasts.length && !effects.length;tries++) {
  act(a,[b],1/60);clock+=1/60;
 }
 if(opts.dodge){b.x=900;b.y=420;}
 let initialWarning=pendingCasts[0]?.warning;
 for(let i=0;i<420 && pendingCasts.length;i++){
  const c=pendingCasts[0];
  if(i===0 || (c.flight||c.roaming) && !warnings.some(w=>w.flight||w.roaming))warnings.push(snapshot(c));
  clock+=1/60;tickSkillCasts(1/60);
  if(opts.resume && i===16){
   const saved=JSON.parse(JSON.stringify(saveOnlineState()));
   loadOnlineState(saved);
  }
 }
 const saved=saveOnlineState();
 for(const side of ['host','guest']){
  const publicEvents=onlineView(saved,side,match.mode).effects;
  if(JSON.stringify(publicEvents)!==JSON.stringify(saved.effects))throw Error('Missing move events in '+side+' view');
 }
 return {warnings,events:saved.effects.filter(e=>e.move===move),initialWarning,targetHP:enemies[0].hp,fields:saved.arenaSkillFields ?? []};
}
`;
(async()=>{
 const {captureMove,raidMoves,campaignMoves,triggerHazards}=await import('data:text/javascript;base64,'+Buffer.from(engine+probe).toString('base64'));
 const {gyms,starters}=campaignMoves();
 assert.equal(gyms.length,68);assert.equal(starters.length,27);
 const allMoves=[...new Set([...moves,...gyms.flat(),...starters.flat()])];
 const paints=command=>['stroke','fill','fillRect'].includes(command[0]);
 const captures=new Map(),missing=[];
 for(const move of allMoves){
  const record=captureMove(move);captures.set(move,record);
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
 assert.equal(art.drawEffect(ctx,{move:'Splash'}),false);
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
 console.log(allMoves.length+' move animations passed on authoritative casts across all six Mega raids, all 68 standard Gym loadouts and all 27 default starter kits.');
})().catch(error=>{console.error(String(error.stack).replace(/data:text\/javascript;base64,[^:)]*/g,'engine.js').slice(0,1400));process.exitCode=1;});
