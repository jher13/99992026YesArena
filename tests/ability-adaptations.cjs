const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html');
const engine=read('supabase/functions/arena-combat/engine.js');
const local=read('local-test/PokeArena_Local_Test.html');
const sections=[
 ['const abilityEffects=','function hiddenAbilityFor('],
 ['// Arena adaptations.','function abilityWeather()'],
 ['function entryAbility(','const hardStatusRecoverySeconds='],
 ['function transformDitto(','function actBattleFields('],
 ['function battleDamage(','function respondToHit('],
 ['function resolveOffensiveMove(','function tickVortex('],
 ['function addMoveExhaustion(','function tickExhaustion('],
];
for(const [start,end] of sections) {
 const take=s=>{const a=s.indexOf(start),b=s.indexOf(end,a);assert(a>=0 && b>a,start);return s.slice(a,b).replaceAll('onlineRandom()','Math.random()');};
 assert.equal(take(local),take(html),'local parity: '+start);
 assert.equal(take(engine),take(html),'online parity: '+start);
}
for(const source of [html,local,engine]) {
 assert(source.includes('abilityEffects.has(ability) && ability!==previous'));
 assert(source.includes("version:'"+JSON.parse(read('version.json')).version+"'"));
}
const probe=String.raw`
export function runAbilityChecks(assert) {
 let checks=0;
 function check(name,fn){try{fn();checks++;}catch(error){error.abilityCheck=name;error.message=name+': '+error.message;throw error;}}
 function fighter(name='Mewtwo',ability=null,friendly=true,moves=['Tackle']) {
  const profile={ivs:Array(6).fill(31),evs:Array(6).fill(0),pid:0,abilityOverride:ability ?? 'Pressure'};
  const a=unit(name,friendly?100:130,120,friendly,100,{profile,moves});
  Object.assign(a,{ability,hp:1000,max:1000,stats:[1000,100,100,100,100,100],pace:60,cooldown:0.5,
   type:'Normal',singleType:true,copiedSecondary:null,side:friendly?'host':'guest',
   onlineId:(friendly?'host:':'guest:')+Math.random(),revealed:true,entryPending:false,
   luckyChantUntil:1e9,defendRecharge:[1e9,1e9,1e9],dashRecharge:[1e9,1e9,1e9],
   ai:normalizeBattleAI({style:'Balanced',position:'Auto',target:'Nearest'})});
  return a;
 }
 function field(a,b,team=[],foes=[]) {
  allies=[a,...team];enemies=[b,...foes];activePlayer=a;activeEnemy=b;
  trainerFields=[allies,enemies].map(roster=>roster.map(actor=>({actor,owner:actor.side,y:actor.y,transition:null})));
  selectedGym=selectedTrainer=selectedWild=rogueRun=null;phase='battle';
  clock=0;lastDamageClock=0;masterPressure=0;recallCooldown=0;recallSlot=0;playerSwitch=enemySwitch=null;
  arenaMap=null;battleWeather=battleTerrain=null;weatherTime=terrainTime=0;
  effects=[];pendingCasts=[];damageBuckets=[];entryHazards=[{},{}];fieldMoveExpiry={};onlineRandomState=100;
 }
 function hit(a,b,move='Tackle',rules=moveRules(move),cast=null) {
  a.lockOnUntil=clock+1;
  resolveOffensiveMove(a,move,rules,b,[b],cast);
  return 1000-b.hp;
 }
 function near(a,b){return Math.abs(a-b)<1e-8;}
 check('registry and descriptions',()=>{
  assert.equal(Object.keys(abilityCatalog).length,311);assert.equal(abilityEffects.size,311);
  for(const ability of abilityEffects)assert(arenaAbilityDescriptions[ability],ability);
  for(const move of [...variableHitMoves,...Object.keys(fixedHitMoves)])assert(moveCatalog[move],move);
 });
 check('Telepathy protects allies, confused attackers and vortexes',()=>{
  const a=fighter(),b=fighter('Mewtwo','Telepathy',true),foe=fighter('Pikachu',null,false);field(a,foe,[b]);
  a.ailment=6;hit(a,b);assert.equal(b.hp,1000);
  const area={actor:a,move:'Hurricane',rules:moveRules('Hurricane'),roaming:true,remaining:1,turnIn:1,
   center:{x:b.x,y:b.y},radius:100,heading:0,touched:[]};
  tickVortex(area,[b],0.01);assert.equal(b.hp,1000);
  a.friendly=false;hit(a,b);assert(b.hp<1000);
 });
 check('Disguise blocks once, persists through recall and respects Mold Breaker',()=>{
  const a=fighter(),b=fighter('Mewtwo','Disguise',false),reserve=fighter('Pikachu',null,false);field(a,b);
  hit(a,b);assert.equal(b.hp,1000);assert(b.disguiseBroken);assert.equal(b.disguiseBrokenAt,0);
  hit(a,b);assert(b.hp<1000);
  const t=startSwitch(b,reserve);t.forced=true;stepSwitch(t,1);assert(b.disguiseBroken);
  b.disguiseBroken=false;b.hp=1000;a.ability='Mold Breaker';hit(a,b);assert(b.hp<1000);assert(!b.disguiseBroken);
 });
 check('Magic Bounce reflects once, recharges, avoids loops and honors suppression',()=>{
  const a=fighter(),b=fighter('Mewtwo','Magic Bounce',false);field(a,b);
  hit(a,b,'Will O Wisp');assert.equal(a.ailment,4);assert.equal(b.ailment,null);assert.equal(b.magicBounceReadyAt,8);
  clock=1;a.ailment=null;hit(a,b,'Will O Wisp');assert.equal(b.ailment,4);
  clock=9;b.ailment=null;a.ability='Magic Bounce';hit(a,b,'Will O Wisp');assert.equal(a.ailment,4);assert.equal(b.ailment,null);
  b.magicBounceReadyAt=0;a.ability='Mold Breaker';a.ailment=null;hit(a,b,'Will O Wisp');assert.equal(b.ailment,4);
 });
 check('Magic Bounce reflects hazards to the originating side',()=>{
  const a=fighter(),b=fighter('Mewtwo','Magic Bounce',false);field(a,b);
  assert(reflectHazard(a,'Spikes'));assert.equal(entryHazards[0].Spikes,1);assert(!entryHazards[1].Spikes);
  assert(!reflectHazard(a,'Spikes'));
 });
 check('Rock Head prevents recoil without blocking sacrifice',()=>{
  let a=fighter(),b=fighter('Mewtwo',null,false);field(a,b);hit(a,b,'Flare Blitz');assert(a.hp<1000);
  a=fighter('Mewtwo','Rock Head');b=fighter('Mewtwo',null,false);field(a,b);hit(a,b,'Flare Blitz');assert.equal(a.hp,1000);
  hit(a,b,'Explosion');assert.equal(a.hp,0);
 });
 check('Prankster speeds status warnings only',()=>{
  const a=fighter('Mewtwo','Prankster'),b=fighter('Pikachu',null,false);field(a,b);
  assert(near(arenaMoveGeometry('Growl',moveRules('Growl'),a).warning,0.375));
  assert.equal(arenaMoveGeometry('Hyper Beam',moveRules('Hyper Beam'),a).warning,2);
  for(const move of ['Growl','Thunder Wave','Will O Wisp'])assert(arenaMoveGeometry(move,moveRules(move),a).warning>=0.25);
 });
 check('Pressure increases nearby skill exhaustion, does not stack and exempts bosses',()=>{
  const a=fighter(),b=fighter('Pikachu','Pressure',false),c=fighter('Eevee','Pressure',false);field(a,b,[],[c]);
  const base=moveExhaustionCost(a,0);addMoveExhaustion(a,0,0);assert(near(a.exhaustion,base*1.2));
  b.x=c.x=900;a.exhaustion=0;addMoveExhaustion(a,0,0);assert.equal(a.exhaustion,base);
  a.side='boss';a.exhaustion=0;addMoveExhaustion(a,0,0);assert.equal(a.exhaustion,0);
 });
 check('Shadow Tag uses a local aura for pivots and manual recalls',()=>{
  const a=fighter(),b=fighter('Pikachu','Shadow Tag',false),reserve=fighter('Eevee');field(a,b);
  allies.push(reserve);assert(shadowTagSource(a));assert(voluntaryRecallBlocked(a));
  assert.equal(forcedSwitchOptions(a,null,true).length,0);assert(!recallWithMove(a));
  assert(!canSendReserve(reserve));
  b.x=500;assert(!voluntaryRecallBlocked(a));assert.equal(forcedSwitchOptions(a,null,true).length,1);assert(canSendReserve(reserve));
  b.x=130;a.type='Ghost';assert(!shadowTagSource(a));
 });
 check('Suction Cups blocks forced switches and allows voluntary recalls',()=>{
  const a=fighter('Mewtwo','Suction Cups'),b=fighter('Pikachu',null,false),reserve=fighter('Eevee');field(a,b);allies.push(reserve);
  assert.equal(forcedSwitchOptions(a,'Suction Cups').length,0);
  assert.equal(forcedSwitchOptions(a,'Suction Cups',true).length,1);
 });
 check('Gooey and Tangling Hair slow contact attackers and expire',()=>{
  for(const ability of ['Gooey','Tangling Hair']) {
   const a=fighter(),b=fighter('Pikachu',ability,false);field(a,b);
   respondToHit(a,b,'Normal Attack','Normal',true,1);assert.equal(a.gooeyUntil,2);assert(near(abilityMovementMultiplier(a),0.8));
   clock=2;assert.equal(abilityMovementMultiplier(a),1);
  }
 });
 check('Unburden requires berry consumption, speeds normals and expires',()=>{
  const a=fighter('Mewtwo','Unburden',true,['Splash']),b=fighter('Pikachu',null,false);field(a,b);
  a.heldItem='Oran Berry';useHeldBerry(a);assert(!a.unburdenUntil);
  a.hp=400;useHeldBerry(a);assert.equal(a.unburdenUntil,6);assert(a.itemUsed);assert(near(abilityMovementMultiplier(a),1.3));
  a.charge=99;act(a,[b],0.01);assert(near(a.normalAttackAt,0.5/1.3));assert.equal(a.exhaustion ?? 0,0);
  clock=6;assert.equal(abilityMovementMultiplier(a),1);
 });
 check('Protean and Libero change type, respect six-second gating and ignore normals',()=>{
  for(const ability of ['Protean','Libero']) {
   const a=fighter('Mewtwo',ability),b=fighter('Pikachu',null,false);field(a,b);
   prepareAbilityMove(a,'Flamethrower');assert.deepEqual(arenaDefenseTypes(a),['Fire']);assert.equal(a.proteanReadyAt,6);
   clock=2;prepareAbilityMove(a,'Surf');assert.deepEqual(arenaDefenseTypes(a),['Fire']);
   clock=6;prepareAbilityMove(a,'Surf');assert.deepEqual(arenaDefenseTypes(a),['Water']);
   clock=13;prepareAbilityMove(a,'Normal Attack');assert.deepEqual(arenaDefenseTypes(a),['Water']);
  }
 });
 check('All four converters affect normal attacks, skills, damage and immunities',()=>{
  for(const [ability,type] of Object.entries(convertedAttackTypes)) {
   const a=fighter('Mewtwo',ability),b=fighter('Pikachu',null,false);field(a,b);
   assert.deepEqual(arenaAttackElement(a,'Normal Attack'),{element:type,converted:true});
   assert.equal(arenaAttackElement(a,'Hyper Beam').element,type);assert.equal(arenaAttackElement(a,'Surf').element,'Water');
   assert.equal(arenaAttackElement(a,'Struggle').element,'Normal');
   assert(near(abilityDamageMultiplier(a,true,type,'Tackle'),1.2));
   assert(tacticalMoveScore(a,b,'Normal Attack',{...moveRules('Tackle'),category:2},0)>0);
  }
  const a=fighter('Mewtwo','Galvanize'),b=fighter('Pikachu','Volt Absorb',false);field(a,b);b.hp=600;
  hit(a,b,'Normal Attack',{...moveRules('Tackle'),category:2});assert.equal(b.hp,850);
  a.ability=null;b.ability='Wonder Guard';b.hp=1000;hit(a,b,'Normal Attack',{...moveRules('Tackle'),category:2});assert.equal(b.hp,1000);
 });
 check('Trace copies the nearest supported ability without touching saved profiles',()=>{
  const a=fighter('Mewtwo','Trace'),far=fighter('Pikachu','Blaze',false),nearby=fighter('Eevee','Rock Head',false);field(a,far,[],[nearby]);
  far.x=500;nearby.x=120;const before=JSON.stringify(a.profile);a.entryPending=true;entryAbility(a,far);
  assert.equal(a.ability,'Rock Head');assert(a.abilityNotice.includes('Rock Head'));assert.equal(JSON.stringify(a.profile),before);
  a.entryPending=true;nearby.ability='Pressure';entryAbility(a,far);assert.equal(a.ability,'Rock Head');
 });
 check('Imposter copies non-HP stats, retains HP and level, round-trips and reverts',()=>{
  const a=fighter('Ditto','Imposter'),b=fighter('Pikachu','Rock Head',false);field(a,b);a.hp=700;a.level=42;b.stats[1]=333;b.max=b.stats[0]=9999;
  const before=JSON.stringify(a.profile);transformDitto(a,b);assert.equal(a.name,'Pikachu');assert.equal(a.originalName,'Ditto');
  assert.equal(a.hp,700);assert.equal(a.max,1000);assert.equal(a.stats[0],1000);assert.equal(a.stats[1],333);assert.equal(a.level,42);
  assert.equal(a.ability,'Rock Head');assert.equal(JSON.stringify(a.profile),before);
  const restored=JSON.parse(JSON.stringify(a));restoreBattleTransform(restored);assert.equal(restored.name,'Ditto');assert.equal(restored.ability,'Imposter');assert.equal(restored.hp,700);assert.equal(restored.shiny,null);
  const d=fighter('Ditto','Pressure');transformDitto(d,b);assert.equal(d.name,'Ditto');
 });
 check('Skill Link reaches five hits and breaks through Disguise on later hits',()=>{
  const a=fighter('Mewtwo','Skill Link'),b=fighter('Pikachu',null,false);field(a,b);hit(a,b,'Bullet Seed');
  const allDamage=1000-b.hp;assert.equal(effects.filter(e=>typeof e.damage==='number' && e.damage>0).length,5);
  b.hp=1000;b.ability='Disguise';effects=[];hit(a,b,'Bullet Seed');
  assert.equal(effects.filter(e=>typeof e.damage==='number' && e.damage>0).length,4);assert(b.disguiseBroken);assert.equal(1000-b.hp,allDamage*4/5);
 });
 check('Parental Bond adds a quarter hit, applies secondary effects once and never rescues a miss',()=>{
  const a=fighter('Mewtwo','Parental Bond'),b=fighter('Pikachu',null,false);field(a,b);
  const rules={...moveRules('Tackle'),changes:[[3,-1]],statChance:100,scope:'single',radius:0};
  hit(a,b,'Tackle',rules);const hits=effects.filter(e=>typeof e.damage==='number' && e.damage>0);
  assert.equal(hits.length,2);assert.equal(b.stages[3],-1);
  assert(Math.abs(hits[1].damage-hits[0].damage/4)<2);
  assert.equal(arenaHitSequence(a,'Surf',moveRules('Surf'),null).length,1);
  assert.equal(arenaHitSequence(a,'Normal Attack',moveRules('Tackle'),null).length,1);
  field(a,b);b.hp=1000;a.lockOnUntil=0;a.stages[7]=-3;b.stages[8]=3;onlineRandomState=20000;
  resolveOffensiveMove(a,'Tackle',moveRules('Tackle'),b,[b]);assert.equal(b.hp,1000);assert.equal(effects.length,1);
 });
 check('Truant permits movement and defend while loafing, then resumes attacking',()=>{
  const a=fighter('Mewtwo','Truant',true,['Splash']),b=fighter('Pikachu',null,false);field(a,b);
  a.abilityElapsed=6.1;b.x=300;const x=a.x;act(a,[b],0.01);assert(a.x>x);assert.equal(b.hp,1000);assert(!a.normalAttackAt);
  a.defendRecharge=[];assert.equal(defendDamage(a,400,clock),200);
  a.abilityElapsed=7.6;a.moveTimers[0]=99;b.x=a.x+20;act(a,[b],0.01);assert(b.hp<1000,JSON.stringify({x:a.x,bx:b.x,elapsed:a.abilityElapsed,normal:a.normalAttackAt,charge:a.charge,attack:a.attack,label:a.moveLabel,move:a.lastUsedMove,ailment:a.ailment,effects}));assert(a.normalAttackAt>clock);
 });
 check('Slow Start expires at eight active seconds',()=>{
  const a=fighter('Mewtwo','Slow Start'),b=fighter('Pikachu',null,false);field(a,b);
  assert(near(abilityMovementMultiplier(a),0.6));assert(near(abilityDamageMultiplier(a,true,'Normal','Tackle'),0.6));
  assert.equal(battleDamage(a,b,20,1,false,'Normal','Sonic Boom'),3);
  tickAbility(a,8);assert.equal(abilityMovementMultiplier(a),1);assert.equal(abilityDamageMultiplier(a,true,'Normal','Tackle'),1);
  assert.equal(battleDamage(a,b,20,1,false,'Normal','Sonic Boom'),5);
 });
 check('Forecast follows weather and restores typing when weather is suppressed',()=>{
  const a=fighter('Castform','Forecast'),b=fighter('Pikachu',null,false);field(a,b);
  for(const [weather,type] of [['Sun','Fire'],['Rain','Water'],['Snow','Ice']]) {
   setWeather(weather);updateAbilityStance(a);assert.deepEqual(arenaDefenseTypes(a),[type]);assert(a.abilityForm);assert(near(abilityDamageMultiplier(a,false,type,'Tackle'),1.2));
  }
  b.ability='Cloud Nine';updateAbilityStance(a);assert.deepEqual(arenaDefenseTypes(a),['Normal']);
  b.ability=null;battleWeather=null;updateAbilityStance(a);assert.equal(a.abilityForm,'Normal');
 });
 check('Stance Change, Zen Mode and Schooling have bounded reversible bonuses',()=>{
  const a=fighter('Aegislash','Stance Change'),b=fighter('Pikachu',null,false);field(a,b);
  updateAbilityStance(a);assert.equal(a.abilityForm,'Shield');assert.equal(abilityDefenseMultiplier(a,a.ability),1.3);
  prepareAbilityMove(a,'Tackle');assert.equal(a.abilityForm,'Blade');assert.equal(abilityDamageMultiplier(a,true,'Normal','Tackle'),1.3);
  clock=3;updateAbilityStance(a);assert.equal(a.abilityForm,'Shield');
  a.ability='Zen Mode';a.name='Darmanitan';a.hp=500;updateAbilityStance(a);assert.equal(a.abilityForm,'Zen');assert.deepEqual(arenaDefenseTypes(a),['Fire','Psychic']);
  assert.equal(abilityDefenseMultiplier(a,a.ability),1.3);a.hp=501;updateAbilityStance(a);assert.deepEqual(arenaDefenseTypes(a),['Normal']);
  a.ability='Schooling';a.name='Wishiwashi';a.hp=251;updateAbilityStance(a);assert.equal(a.abilityForm,'School');assert.equal(abilityDamageMultiplier(a,true,'Water','Tackle'),1.25);
  a.hp=250;updateAbilityStance(a);assert.equal(a.abilityForm,'Solo');assert.equal(abilityDefenseMultiplier(a,a.ability),1);
  a.name='Mewtwo';a.hp=1000;updateAbilityStance(a);assert.equal(a.abilityForm,null);assert.equal(a.abilityStance,'School');
 });
 check('Delta Stream protects Flying types and obeys weather suppression',()=>{
  const a=fighter('Mewtwo','Delta Stream'),b=fighter('Pikachu',null,false);field(a,b);b.type='Flying';
  assert.equal(effectiveness('Electric',b),1);a.ability=null;assert.equal(effectiveness('Electric',b),2);
  a.ability='Delta Stream';b.ability='Air Lock';assert.equal(effectiveness('Electric',b),2);
 });
 check('Infiltrator bypasses screens, decoys, Safeguard and Mist',()=>{
  const a=fighter('Mewtwo','Infiltrator'),b=fighter('Pikachu',null,false);field(a,b);
  b.substituteHP=1000;b.safeguardUntil=b.mistUntil=100;fieldMoveExpiry[screenKey(b,'Reflect')]=100;
  hit(a,b);assert(b.hp<1000);assert.equal(b.substituteHP,1000);
  assert(tryAilment(b,4,a));applyChanges(b,[[3,-1]],a);assert.equal(b.stages[3],-1);
  a.ability=null;b.ailment=null;assert(!tryAilment(b,4,a));applyChanges(b,[[3,-1]],a);assert.equal(b.stages[3],-1);
 });
 check('Plus and Minus require an active opposite partner',()=>{
  const a=fighter('Mewtwo','Plus'),b=fighter('Pikachu',null,false),ally=fighter('Eevee','Minus');field(a,b,[ally]);
  assert.equal(abilityDamageMultiplier(a,false,'Normal','Tackle'),1.5);assert.equal(abilityDamageMultiplier(ally,false,'Normal','Tackle'),1.5);
  assert.equal(abilityDamageMultiplier(a,true,'Normal','Tackle'),1);ally.hp=0;assert.equal(abilityDamageMultiplier(a,false,'Normal','Tackle'),1);
 });
 check('Neutralizing Gas suppresses reactive and stat abilities',()=>{
  const a=fighter('Mewtwo','Skill Link'),b=fighter('Pikachu','Neutralizing Gas',false);field(a,b);
  assert.equal(activeAbility(a),null);assert.equal(abilityMovementMultiplier(a),1);
  b.ability='Disguise';a.ability='Neutralizing Gas';hit(a,b);assert(b.hp<1000);assert(!b.disguiseBroken);
 });
 check('Online view carries temporary visuals through serialization',()=>{
  const a=fighter('Mewtwo','Forecast'),b=fighter('Pikachu',null,false);field(a,b);setWeather('Sun');updateAbilityStance(a);announceAbility(a,'Test ability');
  const state=JSON.parse(JSON.stringify(saveOnlineState()));loadOnlineState(state);
  const view=onlineView(state,'host','unranked');const actor=view.actors.find(v=>v.onlineId===a.onlineId);
  assert.equal(actor.abilityStance,'Sunny');assert.equal(actor.abilityNotice,'Test ability');assert.equal(actor.abilityNoticeUntil,2);
 });
 return checks;
}
export function runSeededAbilityChecks(assert) {
 const abilities=['Telepathy','Disguise','Magic Bounce','Rock Head','Prankster','Pressure','Shadow Tag','Gooey','Tangling Hair',
  'Unburden','Protean','Libero','Aerilate','Pixilate','Refrigerate','Galvanize','Trace','Imposter','Skill Link','Parental Bond',
  'Truant','Slow Start','Forecast','Stance Change','Zen Mode','Schooling','Delta Stream','Infiltrator','Suction Cups','Plus','Minus'];
 const forms={'Disguise':'Mimikyu','Trace':'Gardevoir','Imposter':'Ditto','Skill Link':'Cloyster','Forecast':'Castform',
  'Stance Change':'Aegislash','Zen Mode':'Darmanitan','Schooling':'Wishiwashi'};
 const moves=['Aura Sphere','Psystrike','Thunderbolt','Ice Beam'];
 const entries=(name,ability)=>({
  'pokemon-arena-profiles':JSON.stringify({[dex[name][0]]:{ivs:Array(6).fill(31),evs:[4,0,0,252,0,252],pid:10,abilityOverride:ability}}),
  'pokemon-arena-moves':JSON.stringify({[name]:ability==='Skill Link'?['Icicle Spear','Rock Blast','Pin Missile','Hydro Pump']:moves}),
  'pokemon-arena-wild-progress':JSON.stringify({owned:{[name]:{level:100,xp:0}},ai:{[name]:{style:'Aggressive',position:'Auto'}}}),
 });
 let battles=0,longest=0,timeouts=0;
 for(const ability of abilities)for(const seed of [1024,4116]) {
  const name=forms[ability] ?? 'Mewtwo';
  const match={id:seed.toString(16).padStart(8,'0')+'-1111-4111-8111-111111111111',mode:'unranked',format:1,
   host_pick:[name],guest_pick:['Mewtwo'],host_entries:entries(name,ability),guest_entries:entries('Mewtwo','Pressure')};
  let state=null,result=null;
  for(let second=0;second<301 && !result;second++) {
   const out=simulateOnline(match,state,60,null,'host');state=JSON.parse(JSON.stringify(out.state));result=out.result;
   for(const actor of [...state.allies,...state.enemies]) {
    for(const value of [actor.hp,actor.max,actor.x,actor.y,...actor.stats,...actor.moveTimers])assert(Number.isFinite(value),ability+' has nonfinite state');
    assert(actor.hp>=0 && actor.hp<=actor.max,ability+' HP bounds');
    assert.equal(actor.moves.length,actor.moveTimers.length,ability+' cooldown slots');
   }
  }
  assert(result,ability+' failed to finish its seeded battle');
  if(state.clock>=299.99 && state.allies.some(a=>a.hp>0) && state.enemies.some(a=>a.hp>0))timeouts++;
  longest=Math.max(longest,state.clock);battles++;
  const view=onlineView(state,'host','unranked');assert(view.actors.length>=1);
 }
 return {battles,timeouts,longestSeconds:Math.round(longest*100)/100};
}
`;
(async()=>{
 const mod=await import('data:text/javascript;base64,'+Buffer.from(engine+probe).toString('base64'));
 const checks=mod.runAbilityChecks(assert);
 console.log(checks+' combat ability checks passed, including browser/local/online parity.');
 const seeded=mod.runSeededAbilityChecks(assert);
 assert.equal(seeded.timeouts,0,'Seeded ability smoke battles must not stall to timeout');
 console.log(JSON.stringify(seeded));
})().catch(error=>{console.error((error.abilityCheck ?? '')+'\n'+(error.stack?.split('\n').map(line=>line.replace(/data:text\/javascript;base64,[^:)]*/g,'engine.js')).slice(0,8).join('\n') || error.message));process.exitCode=1;});
