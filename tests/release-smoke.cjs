const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const html=read('index.html');
const manifest=JSON.parse(read('version.json'));
assert.match(manifest.version,/^\d+\.\d+\.\d+$/);
const migrations=fs.readdirSync(path.join(__dirname,'../supabase/migrations'));
assert(migrations.length>0);
const migrationVersions=migrations.map(file=>{
 assert.match(file,/^\d{14}_[a-z0-9_]+\.sql$/);
 return file.slice(0,14);
});
assert.equal(new Set(migrationVersions).size,migrationVersions.length);
for(const file of ['index.html','local-test/PokeArena_Local_Test.html']){
 const markup=read(file);
 assert.equal(markup.match(/const updateLogEntries\s*=\s*\[\s*\{version:'([^']+)'/)?.[1],manifest.version,file);
 for(const [,asset] of markup.matchAll(/<script src="([^"?]+)\?v=[^"]+"/g)){
  assert(fs.existsSync(path.join(__dirname,'..',path.dirname(file),asset)),asset);
 }
 for(const [,script] of markup.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
  if(script.trim())new vm.Script(script,{filename:file});
 }
}
for(const file of ['cloud.js','multiplayer.js','tactics.js'])new vm.Script(read(file),{filename:file});
const data=html.split('\n').filter(line=>/^const (dex|dexStats|typeChart) =/.test(line)).join('\n');
class Node {
 constructor(tag,text,classes=''){this.tagName=tag;this.textContent=text;this.className=classes;this.children=[];this.style={setProperty(){}};this.dataset={};}
 append(...children){this.children.push(...children);}
 prepend(...children){this.children.unshift(...children);}
 replaceChildren(...children){this.children=children;}
 setAttribute(){}
 addEventListener(){}
 get classList(){return {add(){},toggle(){}};}
 get firstElementChild(){return this.children[0];}
}
const nodes=new Map();
const element=(...args)=>new Node(...args);
const byId=id=>{if(!nodes.has(id))nodes.set(id,element('div'));return nodes.get(id);};
let seed=0x13579bdf;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const context=vm.createContext({
 byId,element,window:{},phase:'home',showScreen(){},setInterval(){},clearInterval(){},
 idlePokemonPortrait:()=>element('canvas'),getSprite:()=>({image:{}}),
 types:{},moveColors:{},pmdDirection:()=>0,pmdMotion:()=>null,checkGameVersion(){},structuredClone,openMenu(){},
 drawRogueChoices:(list,n)=>list.slice(0,n),
 Math:Object.assign(Object.create(Math),{random})
});
context.button=(label,onclick,disabled)=>Object.assign(element('button',label),{onclick,disabled});
const source=read('tactics.js');
const auditExports='globalThis.audit={makeTrainer,start,battle,tick,outcome,combatTicks,combatStepMs,roster,rarities,combatRole,evolutionFamilies,collectionTraits,unitTraits,signatures,expandedSignatures,signatureEffects,signatureEffectText,extraSignatureText,traits,familyOf,stageLabel,openingRound,wildRound,megaRound,augmentRound,carouselRound,megaRewardTier,finalRound,neutralTrainer,completeNeutral,grantTowerWard,receiveDamage,heal,equip,sell,ignite,fusionPlan,applyFusion,setRound:round=>{run.round=round;},getRun:()=>run};';
new vm.Script(data+'\n'+source.replace(/\}\)\(\);\s*$/,auditExports+'})();'),{filename:'tactics.js'}).runInContext(context);
const a=context.audit;
byId('home-tactics').onclick();
byId('tactics-content').children.find(node=>node.textContent==='Start match').onclick();
assert.equal(a.getRun().trainers.length,8);
assert(a.getRun().trainers.every(trainer=>trainer.gold===2));
assert.equal(byId('tactics-content').children[0].className,'tactics-layout');
assert(context.window.hasActiveTacticsRun());
const trainer=a.getRun().trainers[0];
const starter=trainer.units[0];
assert(a.equip(trainer,starter,'Claw'));
assert(a.equip(trainer,starter,'Claw'));
assert(a.sell(trainer,starter));
assert.equal(trainer.items[0],'Razor Claws');

const originalUnits=trainer.units;
trainer.units=[
 ...Array.from({length:9},()=>({name:'Pikachu',star:1,position:null})),
 ...Array.from({length:3},(_,x)=>({name:'Pikachu',star:1,position:{x,y:4}})),
 {name:'Pikachu',star:1,position:null,items:['Captain’s Crown']}
];
const captain=trainer.units.at(-1),goldBefore=trainer.gold;
assert.equal(a.sell(trainer,captain),false);
assert.equal(trainer.units.length,13);
assert.equal(trainer.gold,goldBefore);
assert(a.sell(trainer,trainer.units[0]));
assert(a.sell(trainer,captain));
assert.equal(trainer.units.filter(unit=>unit.position===null).length,9);
trainer.units=originalUnits;
const fusionTrainer=a.makeTrainer('Fusion test');
fusionTrainer.units=[
 {name:'Pikachu',star:1,position:{x:0,y:4},items:['Captain’s Crown']},
 {name:'Charmander',star:1,position:{x:1,y:4}},
 {name:'Squirtle',star:1,position:{x:2,y:4}},
 {name:'Pikachu',star:1,position:null,items:['Mirage Goggles']}
];
const fusion=a.fusionPlan(fusionTrainer,{name:'Pikachu',star:1,position:null});
assert.deepEqual(Array.from(fusion.displaced,unit=>unit.name),['Squirtle']);
assert.deepEqual(Array.from(fusion.returned),['Captain’s Crown']);
assert.equal(fusionTrainer.units.filter(unit=>unit.position!==null).length,3);
a.applyFusion(fusionTrainer,fusion);
assert.equal(fusionTrainer.units.filter(unit=>unit.position!==null).length,2);
const roleCounts=new Map();
for(const tier of a.roster){
 const counts=new Map();
 for(const name of tier){
  const role=a.combatRole(name);
  counts.set(role,(counts.get(role) ?? 0)+1);
  roleCounts.set(role,(roleCounts.get(role) ?? 0)+1);
 }
 assert.equal(counts.size,6);
 assert(Math.max(...counts.values())-Math.min(...counts.values())<=1);
}
assert.deepEqual([...roleCounts.values()].sort((a,b)=>a-b),[20,21,21,21,21,21]);
assert.equal(a.combatRole('Squirtle'),a.combatRole('Blastoise'));
assert.equal(a.roster.flat().length,125);
assert.equal(Object.keys(a.evolutionFamilies).length,110);
const fuseFamily=(root,star,branch)=>{
 const squad=a.makeTrainer('Evolution check');
 const path=a.evolutionFamilies[root]?.[branch];
 const name=star===1?root:(path?.[0] ?? root);
 const make=()=>({name,star,branch,position:null});
 squad.units=[make(),make()];
 const plan=a.fusionPlan(squad,make());
 assert.equal(plan.units.length,1);
 assert.equal(a.familyOf(plan.units[0]),root);
 return plan.units[0];
};
assert.equal(fuseFamily('Charmander',1,0).name,'Charmeleon');
assert.equal(fuseFamily('Charmander',2,0).name,'Charizard');
const gardevoir=fuseFamily('Ralts',2,0),gallade=fuseFamily('Ralts',2,1);
assert.equal(gardevoir.name,'Gardevoir');
assert.equal(gallade.name,'Gallade');
assert.equal(a.traits([gardevoir])['Mind Ward'],1);
assert.equal(a.traits([gallade])['Blade Guard'],1);
assert.equal(fuseFamily('Wurmple',1,1).name,'Cascoon');
assert.equal(fuseFamily('Eevee',2,1).name,'Jolteon');
assert.equal(fuseFamily('Mewtwo',2,0).name,'Mewtwo');
assert.equal(a.traits([{name:'Charmander'},{name:'Charmeleon'}]).Warband,1);
assert.equal(a.traits([{name:'Charmander'},{name:'Charmeleon'}]).Fire,undefined);
assert.equal(a.traits([{name:'Squirtle',items:['Marksmen Emblem']}]).Marksmen,1);

assert.equal(a.stageLabel(1),'1-1');
assert.equal(a.stageLabel(4),'1-4');
assert.equal(a.stageLabel(5),'2-1');
assert.equal(a.stageLabel(20),'4-2');
assert.equal(a.stageLabel(31),'5-6');
assert.equal(a.finalRound,123);
assert.equal(a.stageLabel(a.finalRound),'18-7');
assert(a.openingRound(1) && a.wildRound(2) && a.wildRound(4) && a.augmentRound(5));
for(let round=5;round<=a.finalRound;round++){
 const step=Number(a.stageLabel(round).split('-')[1]);
 assert.equal(a.carouselRound(round),step===4);
 assert.equal(a.megaRound(round),step===7);
}
for(const [round,tier] of [[11,2],[18,3],[25,4],[32,5],[123,5]]){
 a.setRound(round);
 assert.equal(a.megaRewardTier(round),tier);
 assert.match(a.neutralTrainer().units[0].raidForm,/^Mega /);
 const winner=a.makeTrainer('Test winner');
 const loser=a.makeTrainer('Test loser');
 const award=a.completeNeutral(winner,true);
 a.completeNeutral(loser,false);
 assert.equal(winner.items.length,2);
 assert.equal(winner.gold-loser.gold,15);
 assert.equal(winner.units.length,1);
 assert.equal(a.rarities.get(winner.units[0].name)+1,tier);
 assert.match(award,/Tier /);
 assert.equal(loser.units.length,0);
 assert.equal(loser.items.length,0);
}
a.setRound(1);

for(const [region,...forms] of [
 ['Johto','Chikorita','Quilava','Feraligatr'],['Hoenn','Sceptile','Torchic','Swampert'],
 ['Sinnoh','Torterra','Chimchar','Prinplup'],['Unova','Servine','Emboar','Oshawott'],
 ['Kalos','Chespin','Delphox','Greninja'],['Alola','Dartrix','Incineroar','Primarina'],
 ['Galar','Rillaboom','Scorbunny','Inteleon'],['Paldea','Meowscarada','Crocalor','Quaxly']
]){
 assert.equal(a.traits(forms.map(name=>({name})))[region+' Partners'],3);
}
assert.equal(a.traits([{name:'Rowlet'},{name:'Dartrix'}])['Alola Partners'],1);
const towerParty=a.makeTrainer('Tower test');
towerParty.units=['Lugia','Ho-Oh','Pikachu'].map((name,x)=>({name,star:1,position:{x,y:4}}));
const towerUnits=a.battle(towerParty,a.makeTrainer('Opponent'));
assert.equal(towerUnits[0].gear.towerWard,.12);
a.grantTowerWard(towerUnits[0],towerUnits);
assert.equal(towerUnits[2].signatureShield,Math.round(towerUnits[2].max*.12));
towerUnits[2].signatureShield=0;
a.grantTowerWard(towerUnits[1],towerUnits);
assert.equal(towerUnits[2].signatureShield,0);

const rosterForms=new Set([...a.roster.flat(),...Object.values(a.evolutionFamilies).flat(2),'Rattata','Zubat','Geodude']);
const moveNames=new Set(), effectSets=new Set();
for(const name of rosterForms){
 const move=a.signatures[name]?.[0] ?? a.expandedSignatures[name]?.[0];
 const effects=(a.signatureEffects[name] ?? a.expandedSignatures[name]?.[1] ?? '').split(' ');
 assert(move && move!=='Signature Skill' && !moveNames.has(move),name);
 moveNames.add(move);
 const key=[...effects].sort().join(' ');
 assert(!effectSets.has(key),name+' shares '+key);
 effectSets.add(key);
 for(const effect of effects)assert(a.signatureEffectText[effect] || a.extraSignatureText[effect],effect);
}
assert.equal(a.expandedSignatures.Tinkaton[0],'Gigaton Hammer');
assert.equal(a.expandedSignatures.Decidueye[0],'Spirit Quill Snare');

const branchTrainer=a.makeTrainer('Branch modal');
const kirlia={name:'Kirlia',family:'Ralts',star:2,position:null,branch:0};
branchTrainer.units=[{...kirlia},{...kirlia}];
const pathPlan=a.fusionPlan(branchTrainer,{...kirlia},1);
assert.equal(pathPlan.upgrades[0].branchStep,true);
assert.equal(pathPlan.units[0].name,'Gallade');
const cascoon={name:'Cascoon',family:'Wurmple',star:2,position:null,branch:1};
branchTrainer.units=[{...cascoon},{...cascoon}];
const lockedPath=a.fusionPlan(branchTrainer,{...cascoon},0);
assert.equal(lockedPath.upgrades[0].branchStep,false);
assert.equal(lockedPath.units[0].name,'Dustox');

const noOrigin=[];
for(const name of a.roster.flat()){
 for(const [,form] of a.evolutionFamilies[name] ?? [[name,name]]){
  if(![...a.unitTraits({name:form,star:3})].some(trait=>!a.collectionTraits[trait].role))noOrigin.push(form);
 }
}
assert.deepEqual(noOrigin,[]);
assert.equal(a.traits([{name:'Tyranitar'},{name:'Gigalith'}]).Sandstorm,2);
assert.equal(a.traits([{name:'Tyranitar'},{name:'Larvitar'}]).Sandstorm,1);
const chaseTeam=a.makeTrainer('Chase');
chaseTeam.units=['Mewtwo','Slaking','Porygon-Z'].map((name,x)=>({name,star:3,position:{x,y:4}}));
const chaseEnemy=a.makeTrainer('Chase enemy');
chaseEnemy.units=[{name:'Rayquaza',star:2,position:{x:2,y:4}}];
const chase=a.battle(chaseTeam,chaseEnemy);
assert.equal(chase[0].geneticTarget,chase[3]);
assert(chase[1].truantAsleep);
assert(chase[2].glitchRole);
assert(chase[3].gear.airLock);

const afflicted={hp:100,elapsed:500,woundUntil:9000};
a.ignite(afflicted,5,{});
assert.equal(afflicted.burnUntil,5500);
assert.equal(afflicted.woundUntil,9000);
assert.equal(afflicted.nextBurn,1500);

const cloud=read('cloud.js');
const keys=cloud.slice(0,cloud.indexOf('const cloudRedirect'));
const validateStart=cloud.indexOf('function validateArenaSave');
const validateEnd=cloud.indexOf('let cloudAccount',validateStart);
const storage=new Map();
const localStorage={
 getItem:key=>storage.get(key) ?? null,
 setItem:(key,value)=>storage.set(key,value),
 removeItem:key=>storage.delete(key)
};
const backups=new Function('localStorage','playerSaveKey',keys+cloud.slice(validateStart,validateEnd)+
 'return {arenaSaveKeys,validateArenaSave,restoreArenaSave}')(localStorage,key=>key);
const backup={version:1,entries:Object.fromEntries(backups.arenaSaveKeys.map(key=>[key,null]))};
backup.entries['pokemon-arena-team']='["Pikachu"]';
backup.entries['pokemon-arena-starter']='{"ign":"Smoke test","name":"Pikachu"}';
backups.restoreArenaSave(backup);
assert.equal(storage.get('pokemon-arena-team'),'["Pikachu"]');
const invalid=structuredClone(backup);
invalid.entries['pokemon-arena-team']='{}';
assert.throws(()=>backups.restoreArenaSave(invalid),/invalid team/);
assert.equal(storage.get('pokemon-arena-team'),'["Pikachu"]');

const updatedBackup=structuredClone(backup);
updatedBackup.version=2;
updatedBackup.entries['pokemon-arena-gym-badges/master']='["brock"]';
updatedBackup.entries['pokemon-arena-gym-badges/clean-records']='{"misty":true}';
backups.restoreArenaSave(updatedBackup);
assert.equal(storage.get('pokemon-arena-gym-badges/master'),'["brock"]');
assert.equal(storage.get('pokemon-arena-gym-badges/clean-records'),'{"misty":true}');
backups.restoreArenaSave(backup);
assert.equal(storage.get('pokemon-arena-gym-badges/master'),'["brock"]');

const captureSettings={autoCaptureBall:6,autoCaptureFallback:'standard',reservePremiumBalls:true,balls:[1,0,0,0,0,0,1,1]};
const captureCode=html.slice(html.indexOf('function autoCaptureChoice('),html.indexOf('function renderAutoOptions('));
const chooseBall=new Function('wildProgress','ballTypes','isLegendaryEncounter',captureCode+'return autoCaptureChoice')(
 captureSettings,Array.from({length:8},()=>({})),name=>name==='Mewtwo');
assert.equal(chooseBall({name:'Pikachu'}),0);
assert.equal(chooseBall({name:'Pikachu',profile:{shiny:true}}),6);
assert.equal(chooseBall({name:'Mewtwo'}),6);
captureSettings.autoCaptureFallback='none';
assert.equal(chooseBall({name:'Pikachu'}),-1);

const passCode=html.slice(html.indexOf('const passTierXP='),html.indexOf('let selectedPassReward='));
const progress={battlePass:{xp:0,claimed:[]},balls:[0]};
const pass=new Function('wildProgress','ballTypes','saveWildProgress',passCode+'return {recordBattlePass,claimPassReward}')(
 progress,[{name:'Great Ball'}],()=>{});
assert.match(pass.recordBattlePass({battles:1,wins:1,raidWins:1},'raid-1'),/Clear a co-op raid/);
assert.equal(pass.recordBattlePass({battles:1,wins:1,raidWins:1},'raid-1'),'');
pass.recordBattlePass({battles:3,wins:3});
pass.claimPassReward(0,false);
pass.claimPassReward(0,false);
assert.equal(progress.balls[0],5);
const shieldProvider={};
const shielded={hp:50,max:50,signatureShield:6,signatureShieldUntil:2000,elapsed:0,shieldProvider,gear:{},manaLock:0,mana:0,manaOnDamage:0};
assert.equal(a.receiveDamage(shielded,10),4);
assert.equal(shieldProvider.shieldedDamage,6);
a.heal(shielded,20,shieldProvider);
assert.equal(shieldProvider.healingDone,4);

const multiplayer=read('multiplayer.js');
const retryStart=multiplayer.indexOf(' function onlineRetryMessage(');
const retry=new Function(multiplayer.slice(retryStart,multiplayer.indexOf(' let generation=',retryStart))+'return onlineRetryMessage')();
assert.match(retry(new TypeError('Failed to fetch'),true),/^Connection lost/);
assert.match(retry(new TypeError("Cannot read properties of undefined (reading 'slice')"),true),/^Online battle error/);
assert.match(retry(new Error('Network unavailable'),false),/^Connection lost/);
const weatherTrainer=a.makeTrainer('Weather');
weatherTrainer.units=[{name:'Kyogre',star:1,position:{x:0,y:7}}];
const weatherEnemy=a.makeTrainer('Enemy');
weatherEnemy.units=[{name:'Squirtle',star:1,position:{x:0,y:7}}];
const weatherUnits=a.battle(weatherTrainer,weatherEnemy);
const [storm,victim]=weatherUnits;
const stormPulse=Math.round(victim.max*.015);
victim.signatureShield=stormPulse;victim.signatureShieldUntil=5000;
storm.wait=victim.wait=10000;

for(let i=0;i<9;i++)a.tick(weatherUnits);
assert.equal(weatherUnits[1].signatureShield,0);
assert.equal(weatherUnits[0].damageDealt ?? 0,0);
for(let i=0;i<9;i++)a.tick(weatherUnits);
assert.equal(weatherUnits[0].damageDealt,stormPulse);
assert.equal(weatherUnits[1].damageTaken,stormPulse);

const roster=a.roster.flat();
const report=new Map();
let rounds=0, draws=0, totalTicks=0;
a.setRound(11);
for(const [index,name] of roster.entries()){
 for(const star of [1,2,3]){
  const player=a.makeTrainer('Player');
  const enemy=a.makeTrainer('Enemy');
  const atStar=root=>star===1?root:a.evolutionFamilies[root]?.[0]?.[star-2] ?? root;
  player.units=[{name:atStar(name),star,position:{x:2,y:4}},{name:'Squirtle',star:1,position:{x:3,y:4}}];
  const rival=roster[(index+19)%roster.length];
  enemy.units=[{name:atStar(rival),star,position:{x:3,y:4}},{name:'Charmander',star:1,position:{x:2,y:4}}];
  const units=a.battle(player,enemy);
  let ticks=0, firstCast=null;
  for(;ticks<a.combatTicks && a.outcome(units)===null;ticks++){
   a.tick(units,ticks*a.combatStepMs);
   if(firstCast===null && units[0].lastCast)firstCast=ticks*a.combatStepMs/1000;
  }
  rounds++;
  totalTicks+=ticks;
  if(!a.outcome(units))draws++;
  for(const unit of units){
   assert(Number.isFinite(unit.hp) && unit.hp>=0 && unit.hp<=unit.max);
   assert(Number.isFinite(unit.mana) && unit.mana>=0 && unit.mana<=60);
  }
  const unit=units[0];
  const key='Cost '+(a.rarities.get(name)+1)+' · '+unit.role+' · '+star+'★';
  const stats=report.get(key) ?? {samples:0,wins:0,damage:0,healed:0,shielded:0,cast:0,castSamples:0,seconds:0};
  stats.samples++;stats.wins+=Number(a.outcome(units)>0);
  stats.damage+=unit.damageDealt ?? 0;stats.healed+=unit.healingDone ?? 0;stats.shielded+=unit.shieldedDamage ?? 0;
  stats.seconds+=ticks*a.combatStepMs/1000;
  if(firstCast!==null){stats.cast+=firstCast;stats.castSamples++;}
  report.set(key,stats);
 }
}
console.log('Start Match, item fusion and sale, Battle Pass idempotency, healing and shielding passed.');
console.log(rounds+' seeded rounds · '+draws+' draws/timeouts · '+(totalTicks*a.combatStepMs/rounds/1000).toFixed(1)+'s mean duration');
if(process.argv.includes('--balance'))console.table([...report].map(([group,s])=>({
 group,matches:s.samples,winPct:Math.round(s.wins/s.samples*100),damage:Math.round(s.damage/s.samples),
 heal:Math.round(s.healed/s.samples),shield:Math.round(s.shielded/s.samples),
 firstCast:s.castSamples?+(s.cast/s.castSamples).toFixed(1):null,seconds:+(s.seconds/s.samples).toFixed(1)
})));

async function verifyRaidRetry(){
 const start=multiplayer.indexOf('  let retryCount=0, retryButton=null;');
 const end=multiplayer.indexOf('  if(!active.result)timer=setTimeout(poll,850);',start);
 assert(start>=0 && end>start);
 const source=multiplayer.slice(start,end);
 const scheduled=[];
 const fakeTimeout=(callback,delay)=>{scheduled.push({callback,delay});return scheduled.length;};
 for(const stage of ['ready','combat','result']){
  scheduled.length=0;
  const status=element('p');
  const state={active:{id:'test',started:stage!=='ready',seats:[]},rendered:0,snapshots:0,fail:true};
  const rpc=async()=>{
   if(state.fail)throw new TypeError('Failed to fetch');
   return {...state.active,ready:true};
  };
  const combat=async()=>{
   if(state.fail)throw new TypeError('Failed to fetch');
   return {turn:1,battle:{},result:stage==='result'?'coop_win':null};
  };
  const poll=new Function('state','status','rpc','combat','onlineRetryMessage','element','setTimeout','clearTimeout',
   'let active=state.active, timer, displayedTurn=0;'+
   'const token=1,generation=1,submitting=false, live=false,began=0,lastPush=0,'+
   'phase=active.started?"online-battle":"raid-lobby",dialog={open:true},navigator={onLine:true};'+
   'const raidRpc=rpc,view=status,byId=()=>status,joinBattleChannel=()=>{},render=()=>{state.rendered++;};'+
   'const button=(text,onclick)=>({text,onclick,disabled:false});'+
   'const acceptBattle=packet=>{displayedTurn=packet.turn;state.snapshots++;active.result=packet.result;};'+
   source+'return poll;')(state,status,rpc,combat,retry,element,fakeTimeout,()=>{});
  await poll();await poll();await poll();
  assert.match(status.children[0].textContent,/Waiting for a fresh match snapshot/);
  assert.equal(status.children[1].text,'Request fresh snapshot');
  assert(scheduled.at(-1).delay>scheduled[0].delay);
  state.fail=false;
  await scheduled.pop().callback();
  if(stage==='ready')assert.equal(state.rendered,1);
  else assert.equal(state.snapshots,1);
  if(stage==='result')assert.equal(state.active.result,'coop_win');
 }
 console.log('Simulated raid reconnect passed during ready-up, combat and result.');
}
verifyRaidRetry().catch(error=>{console.error(error);process.exitCode=1;});

const manualCapture=html.slice(html.indexOf('function runWildResultOptions()'),html.indexOf('function renderWildResult()'));
const throws=[];
let rendered=0;
new Function('wildProgress','wildResult','phase','difficultyMenu','captureMenu','cancelWildRepeat','canCatchResult',
 'autoCaptureChoice','tryCatch','renderWildResult',manualCapture+'runWildResultOptions()')(
 {autoCapture:true,autoRepeat:true,balls:[1]}, {name:'Pikachu'}, 'wild-result', false, true,()=>{},()=>true,
 ()=>0,index=>throws.push(index),()=>rendered++);
assert.deepEqual(throws,[]);
assert.equal(rendered,1);

const draftTrainer=a.makeTrainer('Full bench');
draftTrainer.units=[
 {name:'Pikachu',star:1,position:null},{name:'Pikachu',star:1,position:null},
 ...Array.from({length:7},()=>({name:'Squirtle',star:1,position:null}))
];
assert.equal(a.fusionPlan(draftTrainer,{name:'Pikachu',star:1,position:null}).overflow,0);
assert.equal(a.fusionPlan(draftTrainer,{name:'Charmander',star:1,position:null}).overflow,1);

async function verifyPendingRecovery(){
 const from=cloud.indexOf('const pendingSaveKey=');
 const markerCode=cloud.slice(from,cloud.indexOf('async function flushArenaSave(',from));
 const enter=cloud.slice(cloud.indexOf('async function enterCloudAccount('),cloud.indexOf("window.addEventListener('online'"));
 const actions=[];
 const browser={queueArenaSave:()=>actions.push('retry')};
 let serverRevision='original';
 const logic=new Function('localStorage','sessionStorage','window','claimArenaSession','fetchArenaSave',
  'restoreArenaSave','checkArenaLease','setInterval','clearInterval','saveState',
  'let cloudAccount="user",cloudRevision="original",dirty=true,onlineSaveId="user",leaseTimer;'+
  markerCode+enter+'return {updatePendingSave,enterCloudAccount,revision:()=>cloudRevision};')(
  localStorage,{getItem:()=>null,setItem(){}},browser,async()=>true,
  async()=>({updated_at:serverRevision,save_data:{}}),()=>actions.push('restore'),
  ()=>{},()=>{},()=>{},{});
 logic.updatePendingSave();
 for(const revision of ['original','newer']){
  serverRevision=revision;
  await logic.enterCloudAccount({}, {id:'user'},()=>{});
  assert.equal(logic.revision(),'original');
 }
 assert.deepEqual(actions,['retry','retry']);
}
async function verifyLoanerGear(){
 const {simulateOnline}=await import('../supabase/functions/arena-combat/engine.js');
 const playerEntries=choices=>({
  'pokemon-arena-wild-progress':JSON.stringify({
   owned:{Pikachu:{level:5},Squirtle:{level:5}},
   held:{Pikachu:'Leftovers'},items:{Leftovers:1},pvpLoaners:choices
  })
 });
 const match={
  id:'b2450000-0000-0000-0000-000000000000',mode:'ranked',format:1,host:'a',guest:'b',
  host_pick:['Pikachu','Squirtle'],guest_pick:['Pikachu'],
  host_entries:playerEntries({Pikachu:'Muscle Band',Squirtle:'Muscle Band'}),
  guest_entries:playerEntries({Pikachu:'Wise Glasses'})
 };
 const serialized=JSON.stringify(simulateOnline(match,null,0,null,'host'));
 assert.equal((serialized.match(/"heldItem":"Muscle Band"/g) ?? []).length,1);
 assert.equal((serialized.match(/"heldItem":"Wise Glasses"/g) ?? []).length,1);
 assert(!serialized.includes('"heldItem":"Leftovers"'));
}
Promise.all([verifyPendingRecovery(),verifyLoanerGear()]).then(()=>{
 console.log('Manual Capture, full-bench fusion, pending-save recovery, and server loaner gear checks passed.');
}).catch(error=>{console.error(error);process.exitCode=1;});
