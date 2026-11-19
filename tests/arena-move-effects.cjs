const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const moves=('Thunder|Thunderbolt|Thunder Shock|Electro Ball|Shadow Ball|Aura Sphere|Focus Blast|Energy Ball|Sludge Bomb|'+
 'Hyper Beam|Solar Beam|Ice Beam|Aurora Beam|Psybeam|Flash Cannon|Dragon Pulse|Surf|Muddy Water|Blizzard|Heat Wave|Sludge Wave|Earthquake|'+
 'Flamethrower|Dragon Breath|Icy Wind|Hurricane|Twister|Bleakwind Storm|Rock Slide|Draco Meteor|Fire Blast|Explosion|Self-Destruct|Misty Explosion|'+
 'Slash|X Scissor|Night Slash|Leaf Blade|Quick Attack|Extreme Speed|Flare Blitz|Brave Bird|Protect|Reflect|Light Screen|Recover|Moonlight|Synthesis|Roost').split('|');

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
export function captureMove(move,opts={}) {
 const match={id:'ab347c12-0000-4000-8000-000000000001',mode:'free_fight',format:1,host_pick:['Mew'],guest_pick:['Blissey'],host_entries:{},guest_entries:{}};
 initializeOnline(match);
 const a=allies[0],b=enemies[0];
 for(const [index,actor] of [a,b].entries()){
  Object.assign(actor,{x:310+index*28,y:210,hp:3500,max:5000,charge:0,attack:0,heldItem:null,ability:null,
   type:'Normal',singleType:true,entryPending:false,normalAttacksEnabled:false,dashRecharge:[999,999,999],defendRecharge:[999,999,999],
   moves:[index?'Pound':move],moveTimers:[0],moveCooldowns:[4],moveCooldownStarts:[],side:index?'guest':'host',revealed:true});
  Object.assign(trainerFields[index][0],{actor,transition:null});
 }
 b.type='Water';b.moves=['Pound','Psychic'];b.moveTimers=[0,0];b.moveCooldowns=[3,4];
 a.hp=sacrificeProfiles.has(move)?200:1500;
 a.ability='No Guard';
 a.ai=normalizeBattleAI({mode:'Advanced',gambits:[{target:'Any',condition:'Always',operator:'Equal',value:'True',move}]});
 if(opts.immune){b.type='Ground';resolveOffensiveMove(a,move,moveRules(move),b,[b]);}
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
 return {warnings,events:saved.effects.filter(e=>e.move===move),initialWarning,targetHP:enemies[0].hp};
}
`;
(async()=>{
 const {captureMove}=await import('data:text/javascript;base64,'+Buffer.from(engine+probe).toString('base64'));
 const captures=new Map(),missing=[];
 for(const move of moves){
  const record=captureMove(move);captures.set(move,record);
  const {ctx,commands,stack}=surface();
  const packet=JSON.stringify(record);
  let castArtwork=false;
  for(const cast of record.warnings){
   if(art.activeCast(ctx,cast))castArtwork=true;
   art.charge(ctx,{...cast,remaining:cast.warning*.35});
  }
  for(const effect of record.events){
   const handled=art.drawEffect(ctx,{...effect,life:.39});
   if(handled && !effect.impactOnly)castArtwork=true;
  }
  if(!castArtwork || !commands.length)missing.push(move);
  assert.equal(stack.length,0,move);assert.equal(ctx.globalAlpha,1,move);
  assert.equal(JSON.stringify(record),packet,'mutated combat event for '+move);
 }
 assert.deepEqual(missing,[],'no special artwork on normal casts');
 const draw=(method,event,mirror=false)=>{
  const {ctx,commands,stack}=surface();art[method](ctx,event,mirror);
  assert.equal(stack.length,0);return commands;
 };
 const thunder=captures.get('Thunder').events[0],bolt=captures.get('Thunderbolt').events[0];
 const thunderDraw=draw('drawEffect',{...thunder,life:.39});
 assert(thunderDraw.some(([op,x,y])=>op==='moveTo' && y<0),'strike starts overhead');
 assert(thunderDraw.some(([op,x,y])=>op==='lineTo' && x===thunder.tx && y===thunder.ty));
 assert(draw('drawEffect',{...bolt,life:.39}).some(([op,x,y])=>op==='translate'&&x===bolt.x&&y===bolt.y));
 for(const event of [{...thunder,damage:'Miss'},...captureMove('Thunder',{immune:true}).events]){
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
 assert.equal(art.drawEffect(ctx,{move:'Water Gun'}),false);
 assert.equal(art.drawEffect(ctx,{move:'Quick Attack',dashSprite:{}}),false);
 assert.equal(art.activeCast(ctx,charge),false,'winding up keeps the standard danger indicator');
 assert.equal(art.aboveUnits(thunder),true);assert.equal(art.aboveUnits(wave),false);
 assert.equal(art.aboveUnits(captures.get('X Scissor').events[0]),true,'contact slashes must be visible over the target sprite');
 console.log(moves.length+' move animations passed on authoritative battle events, including dodges, immunity, mirrored coordinates and restored Earthquake rings.');
})().catch(error=>{console.error(String(error.stack).replace(/data:text\/javascript;base64,[^:)]*/g,'engine.js').slice(0,1400));process.exitCode=1;});
