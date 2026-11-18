const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html'),engine=read('supabase/functions/arena-combat/engine.js');
for(const file of ['index.html','local-test/PokeArena_Local_Test.html','supabase/functions/arena-combat/engine.js']){
 const source=read(file);
 for(const removed of ['function firstPillar(','function seekPillarCover(','function damagePillar(','pillarY:','function clipPillarShadows('])assert(!source.includes(removed),file+' retains '+removed);
 assert(source.includes("version:'"+JSON.parse(read('version.json')).version+"'"));
 const start=source.indexOf('// Arena tactics:'),end=source.indexOf('function bodyRadius(',start);
 assert.equal(source.slice(start,end),html.slice(html.indexOf('// Arena tactics:'),html.indexOf('function bodyRadius(',html.indexOf('// Arena tactics:'))),'shared tactics parity');
}
// Exercise the actual PC control construction with an inspectable DOM.
class Node{
 constructor(tag,text,cls){Object.assign(this,{tagName:tag,textContent:text??'',className:cls??'',children:[],attributes:{},value:'',disabled:false});}
 append(...children){this.children.push(...children);}setAttribute(k,v){this.attributes[k]=v;}
 all(){return [this,...this.children.flatMap(child=>child instanceof Node?child.all():[])];}
}
let saved=0;
const ui=vm.createContext({element:(...args)=>new Node(...args),arenaTeamPlans:['Balanced','Burst','Protect Carry','Spread Out'],gambitLabels:{},
 wildProgress:{battlePlan:'Protect Carry',battleCarry:'Mewtwo'},team:['Mewtwo','Pikachu'],saveWildProgress(){saved++;}});
vm.runInContext(html.slice(html.indexOf('function gambitSelect('),html.indexOf('function openGambits('))+
 html.slice(html.indexOf('function normalizeTeamPlan('),html.indexOf('const arenaFieldInfo=')),ui);
let controls=ui.battlePlanControls();let selects=controls.all().filter(node=>node.tagName==='select');
assert.equal(selects[0].value,'Protect Carry');assert.equal(selects[1].value,'Mewtwo');
selects[0].value='Spread Out';selects[0].onchange();assert.equal(ui.wildProgress.battlePlan,'Spread Out');assert.equal(saved,1);
selects[1].value='Automatic';selects[1].onchange();assert.equal(ui.wildProgress.battleCarry,'');assert.equal(saved,2);
assert(ui.battlePlanControls(true).all().filter(node=>node.tagName==='select').every(node=>node.disabled));
assert(read('multiplayer.js').includes('panel.append(battlePlanControls(locked))'));
const client=read('multiplayer.js');assert(client.includes('rocks:[]'));assert(client.includes('arenaSkillFields ?? []'));
// Execute real shared rules inside the generated, authoritative combat engine.
const probe=String.raw`
export function runTacticChecks(assert) {
 let checks=0;
 const check=(name,fn)=>{try{fn();checks++;}catch(error){error.tacticCheck=name;throw error;}};
 const near=(a,b)=>Math.abs(a-b)<1e-8;
 function fighter(name='Mewtwo',friendly=true,moves=['Tackle']) {
  const profile={ivs:Array(6).fill(31),evs:Array(6).fill(0),pid:0,abilityOverride:'Pressure'};
  const actor=unit(name,friendly?150:210,150,friendly,100,{profile,moves});
  return Object.assign(actor,{hp:1000,max:1000,stats:[1000,150,100,100,100,150],pace:60,ability:'Pressure',
   type:'Normal',singleType:true,copiedSecondary:null,side:friendly?'host':'guest',onlineId:(friendly?'host:':'guest:')+name,
   revealed:true,entryPending:false,luckyChantUntil:1e9,ai:normalizeBattleAI({})});
 }
 function field(team,foes) {
  allies=team;enemies=foes;activePlayer=team[0];activeEnemy=foes[0];
  trainerFields=[team,foes].map(roster=>roster.map(actor=>({actor,owner:actor.side,y:actor.y,transition:null})));
  phase='battle';selectedGym=selectedWild=selectedTrainer=rogueRun=null;selectedMasterGym=false;clock=lastDamageClock=0;masterPressure=0;
  recallCooldown=0;playerSwitch=enemySwitch=null;arenaMap=null;effects=[];pendingCasts=[];damageBuckets=[];entryHazards=[{},{}];fieldMoveExpiry={};
  battleWeather=battleTerrain=null;weatherTime=terrainTime=0;arenaSkillFields=[];arenaFieldSequence=0;onlineRecalls={};onlineSounds=[];onlineRandomState=100;
 }
 const rule=(move,condition='Always',value='True',target='Self')=>({target,condition,operator:'Equal',value,move});
 check('all generated fields are open and old collision metadata has no effect',()=>{
  const a=fighter(),b=fighter('Malamar',false);field([a],[b]);
  for(let i=0;i<100;i++)assert.deepEqual(randomArenaMap().rocks,[]);
  for(const raid of Object.values(megaRaidTiers))assert.deepEqual(megaRaidArena(raid).rocks,[]);
  assert(Object.values(gymPlans).every(plan=>!Object.hasOwn(plan,'pillarY')));
  const before=movementClearance(a,a.x,a.y,a.x,a.y+50);arenaMap={rocks:[{x:a.x,y:a.y+20,r:30,hp:24}]};
  assert.equal(movementClearance(a,a.x,a.y,a.x,a.y+50),before);
  assert(inSkill(a,{x:a.x,y:a.y+30},50,null));
 });
 check('new gear is available in shop and equal PvP loaners with unique sprites',()=>{
  const items=['Assault Vest','Quick Claw','Wide Lens'];assert.equal(new Set(items.map(item=>bagItemArt[item][1])).size,3);
  for(const item of items){assert.equal(heldItems[item].price,4000);assert(pvpLoanerItems.includes(item));assert.equal(pvpLoanerFor('Mewtwo',['Mewtwo'],{Mewtwo:item}),item);}
  assert.equal(pvpLoanerFor('Pikachu',['Mewtwo','Pikachu'],{Mewtwo:'Wide Lens',Pikachu:'Wide Lens'}),null);
 });
 check('Assault Vest trades only special defense for status skills; suppression restores status',()=>{
  const a=fighter(),b=fighter('Blastoise',false,['Reflect','Tackle']);field([a],[b]);
  const damage=(physical)=>battleDamage(a,b,100,1,physical,physical?'Normal':'Psychic','Tackle');
  const physical=damage(true),special=damage(false);b.heldItem='Assault Vest';
  assert.equal(damage(true),physical);assert(damage(false)<special*.8);assert(moveRestricted(b,'Reflect'));assert(!moveRestricted(b,'Tackle'));
  b.ability='Klutz';assert(!moveRestricted(b,'Reflect'));assert.equal(damage(false),special);
  b.ability='Pressure';fieldMoveExpiry['Magic Room']=clock+10;assert(!moveRestricted(b,'Reflect'));
 });
 check('Wide Lens expands real aimed geometry and lowers only basic damage',()=>{
  const a=fighter(),b=fighter('Pikachu',false);field([a],[b]);
  const original=arenaMoveGeometry('Ice Beam',moveRules('Ice Beam'),a),area=arenaMoveGeometry('Earthquake',moveRules('Earthquake'),a);
  const damage=()=>battleDamage(a,b,40,1,true,'Normal','Normal Attack');const base=damage();a.heldItem='Wide Lens';
  assert(near(arenaMoveGeometry('Ice Beam',moveRules('Ice Beam'),a).range,original.range*1.15));
  assert.equal(arenaMoveGeometry('Earthquake',moveRules('Earthquake'),a).radius,area.radius);assert(damage()<base);
  const special=battleDamage(a,b,100,1,false,'Psychic','Psychic');a.heldItem=null;assert.equal(battleDamage(a,b,100,1,false,'Psychic','Psychic'),special);
  assert(b.hp>0);b.hp=1;a.heldItem='Wide Lens';a.moves=['Ice Beam'];a.moveTimers=[0];assert(readyKnockout(a,b,original.range*1.1));
  a.ability='Klutz';assert.equal(arenaMoveGeometry('Ice Beam',moveRules('Ice Beam'),a).range,original.range);
 });
 check('Quick Claw recharges dashes faster but Defend slower and retains three charges',()=>{
  const a=fighter(),b=fighter('Pikachu',false);field([a],[b]);a.heldItem='Quick Claw';
  assert(tryBattleDash(a,Math.PI/2,60,()=>true));assert.equal(a.dashRecharge[0],2.4);
  assert(activateDefend(a,0));assert.equal(a.defendUntil,1);assert.equal(a.defendRecharge[0],6);
  a.ability='Klutz';a.dashRecharge=[];a.defendUntil=0;a.defendRecharge=[];
  assert(tryBattleDash(a,Math.PI/2,60,()=>true));assert.equal(a.dashRecharge[0],3);assert(activateDefend(a,1));assert.equal(a.defendRecharge[0],6);
 });
 check('fields are walkable, short lived, side scoped and strictly capped',()=>{
  const a=fighter(),b=fighter('Pikachu',false);field([a],[b]);
  const before=movementClearance(a,a.x,a.y,a.x,a.y+30);
  for(const actor of [a,b])for(const move of ['Surf','Mud Shot','Mist','Tailwind']){
   for(let i=0;i<5;i++)releaseArenaSkillField(actor,move,actor);
  }
  assert.equal(arenaSkillFields.length,8);assert.equal(movementClearance(a,a.x,a.y,a.x,a.y+30),before);
  assert(arenaSkillFields.every(zone=>zone.expires<=5));clock=4;tickArenaSkillFields();assert.equal(arenaSkillFields.length,2);
  clock=5;tickArenaSkillFields();assert.equal(arenaSkillFields.length,0);
 });
 check('field power does not stack or consume on AI previews; electric combo fires once',()=>{
  const a=fighter(),b=fighter('Pikachu',false);field([a],[b]);
  a.x=50;b.x=500;releaseArenaSkillField(a,'Surf',b);releaseArenaSkillField(a,'Surf',b);
  assert(near(arenaFieldDamageMultiplier(a,b,'Electric'),1.1));
  tacticalMoveScore(a,b,'Thunderbolt',moveRules('Thunderbolt'),10);assert.equal(arenaSkillFields.length,1);
  consumeArenaFieldCombo(a,b,'Electric');assert.equal(arenaFieldDamageMultiplier(a,b,'Electric'),1);assert.equal(arenaSkillFields.length,0);
  releaseArenaSkillField(b,'Mist',b);assert(near(arenaFieldDamageMultiplier(a,b,'Psychic'),.9));
  releaseArenaSkillField(b,'Mud Shot',a);releaseArenaSkillField(a,'Tailwind',a);assert(near(arenaFieldPace(a),.88));
  assert(near(arenaFieldPace(b),1));
 });
 check('one released cast cannot recreate a consumed field',()=>{
  const a=fighter(),b=fighter('Pikachu',false);field([a],[b]);const cast={};
  releaseArenaSkillField(a,'Surf',a,cast);consumeArenaFieldCombo(a,b,'Electric');releaseArenaSkillField(a,'Surf',a,cast);assert.equal(arenaSkillFields.length,0);
 });
 check('fields, target commitments and plans survive authoritative state recovery',()=>{
  const a=fighter(),b=fighter('Pikachu',false);field([a],[b]);a.teamPlan='Burst';a.burstTarget=b.onlineId;a.burstUntil=2;releaseArenaSkillField(a,'Surf',a);
  const state=JSON.parse(JSON.stringify(saveOnlineState()));state.arenaMap={rocks:[{hp:30}],zones:[]};loadOnlineState(state);
  assert.deepEqual(arenaMap.rocks,[]);assert.equal(arenaSkillFields.length,1);assert.equal(allies[0].burstTarget,b.onlineId);
  const view=onlineView(saveOnlineState(),'host','unranked');assert.equal(view.arenaSkillFields.length,1);assert.deepEqual(view.arenaMap.rocks,[]);
  delete state.arenaSkillFields;delete state.arenaFieldSequence;loadOnlineState(state);assert.equal(arenaSkillFields.length,0);
 });
 check('tactical Gambits survive normalization and conditions measure real resources',()=>{
  const a=fighter(),b=fighter('Pikachu',false);field([a],[b]);a.dashRecharge=[1,1];a.defendRecharge=[5];
  const ai=normalizeBattleAI({mode:'Advanced',gambits:[rule('Save dash','Dash charges','1'),rule('Defend','Defend charges','2'),rule('Interrupt','Casting','True','Enemy Nearest')]});
  assert.equal(ai.gambits.length,3);assert(gambitMatches(ai.gambits[0],a,null,0));assert(gambitMatches(ai.gambits[1],a,null,0));
  assert.equal(tacticalGambitValue('Nearby allies',a),0);assert.equal(tacticalGambitValue('Nearby enemies',a),1);setWeather('Rain');assert.equal(tacticalGambitValue('Weather',a),'Rain');
 });
 check('resource actions never swallow later attack rules or Basic attacks',()=>{
  const a=fighter('Mewtwo',true,['Tackle']),b=fighter('Pikachu',false);b.x=175;field([a],[b]);
  a.ai=normalizeBattleAI({mode:'Advanced',gambits:[rule('Save dash'),rule('Any','Always','True','Enemy Nearest')]});
  assert(gambitChoice(a,[b],b)?.choice);assert(a.saveDashUntil>clock);assert(!tryBattleDash(a,0,50,()=>true));
  a.ai.gambits=[rule('Save dash')];a.moveTimers.fill(20);a.normalAttackAt=0;act(a,[b],1/60);assert(a.normalAttackAt>0,'resource-only Gambit still normal attacks');
 });
 check('timed Defend waits for heavy impact and cannot be activated on light attacks',()=>{
  const a=fighter(),b=fighter('Pikachu',false,['Hyper Beam']);field([a],[b]);
  a.ai=normalizeBattleAI({mode:'Advanced',gambits:[rule('Defend','Incoming heavy attack')]});
  pendingCasts=[{actor:b,move:'Hyper Beam',center:{x:a.x,y:a.y},radius:100,remaining:.5}];
  applyResourceGambits(a,[b]);assert(!a.defendUntil);pendingCasts[0].remaining=.1;applyResourceGambits(a,[b]);assert(a.defendUntil>clock);
  a.defendUntil=0;a.defendRecharge=[];pendingCasts[0].move='Tackle';a.stats[2]=10000;a.max=a.hp=10000;applyResourceGambits(a,[b]);assert.equal(a.defendUntil,0);
 });
 check('interrupt selects available control without wasting a normal attack slot',()=>{
  const a=fighter('Mewtwo',true,['Sleep Powder','Tackle']),b=fighter('Pikachu',false,['Hyper Beam']);field([a],[b]);b.x=180;
  a.ai=normalizeBattleAI({mode:'Advanced',gambits:[rule('Interrupt','Casting','True','Enemy Nearest')]});
  assert.equal(gambitChoice(a,[b],b),null);pendingCasts=[{actor:b,move:'Hyper Beam',remaining:1,started:0,center:a,radius:50}];
  assert.equal(gambitChoice(a,[b],b)?.choice.move,'Sleep Powder');a.moveTimers[0]=10;assert.equal(gambitChoice(a,[b],b),null);
  b.flinch=.5;clock=.1;tickSkillCasts(.01);assert.equal(pendingCasts.length,0);
 });
 check('Burst focus is shared and stable, while manual targeting still wins',()=>{
  const a=fighter(),ally=fighter('Pikachu'),b=fighter('Malamar',false),c=fighter('Gengar',false);field([a,ally],[b,c]);
  a.teamPlan=ally.teamPlan='Burst';b.hp=100;c.hp=900;
  assert.equal(teamPlanFocus(a,b,[b,c]),85);assert.equal(teamPlanFocus(ally,b,[b,c]),85);
  b.hp=900;c.hp=100;clock=.5;assert.equal(teamPlanFocus(a,b,[b,c]),85);clock=1.3;assert.equal(teamPlanFocus(a,c,[b,c]),85);
  a.manualTarget=b.onlineId;assert.equal(targetPreference(a,b,0),-50000);
 });
 check('Protect Carry intercepts threat selection and nudges healing without holding position',()=>{
  const a=fighter('Blastoise'),carry=fighter(),b=fighter('Pikachu',false),c=fighter('Gengar',false);field([a,carry],[b,c]);
  a.teamPlan='Protect Carry';a.carryName='Mewtwo';carry.hp=740;a.hp=700;b.committedTarget=carry.onlineId;
  assert.equal(protectedCarry(a),carry);assert(teamPlanFocus(a,b,[b,c])>teamPlanFocus(a,c,[b,c]));
  assert(carryHealingRank(a,carry)<carryHealingRank(a,a));
  a.ai=normalizeBattleAI({mode:'Advanced',gambits:[rule('Protect ally','Always','True','Ally Nearest')]});gambitChoice(a,[b,c],b);assert.equal(a.protectAlly,carry.onlineId);a.teamPlan='Burst';assert(teamPlanFocus(a,b,[b,c])>teamPlanFocus(a,c,[b,c]));
 });
 check('Spread Out cannot delay a ready attack; retreat is time boxed and has recovery',()=>{
  const a=fighter(),ally=fighter('Pikachu'),b=fighter('Malamar',false);field([a,ally],[b]);ally.x=a.x+5;
  a.teamPlan='Spread Out';const choice={move:'Tackle',range:100,remaining:0};assert(!tacticalReposition(a,b,choice,10,1/60));
  applyTacticalGambit(a,'Disengage',b);const until=a.disengageUntil;clock=.5;applyTacticalGambit(a,'Disengage',b);assert.equal(a.disengageUntil,until);assert.equal(a.disengageReady,3);
 });
 check('spread movement commits to its waypoint during recovery',()=>{
  const a=fighter(),ally=fighter('Pikachu'),b=fighter('Malamar',false);field([a,ally],[b]);ally.x=a.x+5;
  a.teamPlan='Spread Out';a.charge=1;a.normalAttackAt=10;
  const choice={move:'Ice Beam',range:200,remaining:0};assert(tacticalReposition(a,b,choice,40,1/60));
  const goal={...a.spreadGoal};
  for(let frame=1;frame<10;frame++){clock=frame/60;tacticalReposition(a,b,choice,40,1/60);assert.deepEqual(a.spreadGoal,goal);}
 });
 check('Assault Vest with four status slots continues fighting',()=>{
  const a=fighter('Mewtwo',true,['Reflect','Light Screen','Calm Mind','Recover']),b=fighter('Pikachu',false);field([a],[b]);b.x=175;a.heldItem='Assault Vest';
  act(a,[b],1/60);assert.equal(a.lastUsedMove,'Normal Attack');assert(a.normalAttackAt>0);
 });
 return checks;
}
export function runTacticSeeds(assert) {
 const roster=['Mewtwo','Blastoise','Pikachu','Gengar','Machamp','Gardevoir'];
 const moves={Mewtwo:['Aura Sphere','Psystrike','Ice Beam','Recover'],Blastoise:['Surf','Mud Shot','Aqua Ring','Protect'],
  Pikachu:['Thunderbolt','Quick Attack','Light Screen','Thunder Wave'],Gengar:['Shadow Ball','Dream Eater','Hypnosis','Sludge Bomb'],
  Machamp:['Close Combat','Knock Off','Rock Slide','Bulk Up'],Gardevoir:['Psychic','Moonblast','Safeguard','Heal Pulse']};
 const gear=['Assault Vest','Quick Claw','Wide Lens','Shell Bell','Muscle Band','Wise Glasses'];
 function entries(names,plan,opponent=false){return {
  'pokemon-arena-profiles':JSON.stringify(Object.fromEntries(names.map(name=>[dex[name][0],{ivs:Array(6).fill(31),evs:[4,0,0,252,0,252],pid:10,abilityOverride:'Pressure'}]))),
  'pokemon-arena-moves':JSON.stringify(Object.fromEntries(names.map(name=>[name,moves[name]]))),
  'pokemon-arena-wild-progress':JSON.stringify({battlePlan:plan,battleCarry:'Mewtwo',owned:Object.fromEntries(names.map(name=>[name,{level:100,xp:0}])),
   pvpLoaners:Object.fromEntries(names.map((name,i)=>[name,gear[(i+(opponent?3:0))%gear.length]])),
   ai:Object.fromEntries(names.map((name,i)=>[name,{mode:i%2?'Basic':'Advanced',style:i%2?'Balanced':'Aggressive',position:i%3?'Ranged':'Melee',gambits:[
    {target:'Self',condition:'Incoming heavy attack',operator:'Equal',value:'True',move:'Defend'},
    {target:'Self',condition:'Dash charges',operator:'At Most',value:'1',move:'Save dash'},
    {target:'Ally Lowest HP',condition:'HP %',operator:'At Most',value:'50%',move:'Protect ally'}]}]))}),
 };}
 let battles=0,timeouts=0,longest=0,fieldsSeen=0,maxFields=0;
 for(const plan of arenaTeamPlans)for(const count of [1,3,6])for(const seed of [53,101,642,2026,8819]){
  const names=roster.slice(0,count),foes=[...names].reverse();
  const match={id:seed.toString(16).padStart(8,'0')+'-1111-4111-8111-111111111111',mode:'unranked',format:count,
   host_pick:names,guest_pick:foes,host_entries:entries(names,plan),guest_entries:entries(foes,'Balanced',true)};
  let state=null,result=null;
  for(let second=0;second<301 && !result;second++){
   const out=simulateOnline(match,state,60,null,'host');state=JSON.parse(JSON.stringify(out.state));result=out.result;
   assert.deepEqual(state.arenaMap.rocks,[]);assert(state.arenaSkillFields.length<=8);
   fieldsSeen+=state.arenaSkillFields.length;maxFields=Math.max(maxFields,state.arenaSkillFields.length);
   for(const actor of [...state.allies,...state.enemies]){
    assert([actor.hp,actor.max,actor.x,actor.y,...actor.stats,...actor.moveTimers].every(Number.isFinite));
    assert(actor.hp>=0 && actor.hp<=actor.max);assert.equal(actor.moves.length,actor.moveTimers.length);
   }
  }
  assert(result,plan+' seed '+seed+' did not finish');
  if(state.allies.some(actor=>actor.hp>0) && state.enemies.some(actor=>actor.hp>0))timeouts++;
  longest=Math.max(longest,state.clock);battles++;
 }
 assert(fieldsSeen>0,'seeded fights exercised temporary fields');
 return {battles,timeouts,longestSeconds:Math.round(longest*100)/100,fieldsSeen,maxFields};
}
`;
(async()=>{
 const mod=await import('data:text/javascript;base64,'+Buffer.from(engine+probe).toString('base64'));
 console.log(mod.runTacticChecks(assert)+' Arena tactics checks passed, plus PC plan controls.');
 const seeded=mod.runTacticSeeds(assert);console.log(JSON.stringify(seeded));assert.equal(seeded.timeouts,0,'New Arena tactics must not stall seeded matches');
})().catch(error=>{console.error((error.tacticCheck??'')+'\n'+(error.stack??error.message).split('\n').map(line=>line.replace(/data:text\/javascript;base64,[^:)]*/g,'engine.js')).slice(0,9).join('\n'));process.exitCode=1;});
