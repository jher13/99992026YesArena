const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const html=read('index.html');
for(const file of ['index.html','local-test/PokeArena_Local_Test.html']){
 for(const [,script] of read(file).matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
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
const auditExports='globalThis.audit={makeTrainer,start,battle,tick,outcome,combatTicks,combatStepMs,roster,rarities,receiveDamage,heal,equip,sell,setRound:round=>{run.round=round;},getRun:()=>run};';
new vm.Script(data+'\n'+source.replace(/\}\)\(\);\s*$/,auditExports+'})();'),{filename:'tactics.js'}).runInContext(context);
const a=context.audit;
byId('home-tactics').onclick();
byId('tactics-content').children.find(node=>node.textContent==='Start match').onclick();
assert.equal(a.getRun().trainers.length,8);
assert.equal(byId('tactics-content').children[0].className,'tactics-layout');
assert(context.window.hasActiveTacticsRun());
const trainer=a.getRun().trainers[0];
const starter=trainer.units[0];
assert(a.equip(trainer,starter,'Claw'));
assert(a.equip(trainer,starter,'Claw'));
assert(a.sell(trainer,starter));
assert.equal(trainer.items[0],'Razor Claws');

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
victim.signatureShield=1;victim.signatureShieldUntil=5000;
storm.wait=victim.wait=10000;

for(let i=0;i<9;i++)a.tick(weatherUnits);
assert.equal(weatherUnits[1].signatureShield,0);
assert.equal(weatherUnits[0].damageDealt ?? 0,0);
for(let i=0;i<9;i++)a.tick(weatherUnits);
assert.equal(weatherUnits[0].damageDealt,1);
assert.equal(weatherUnits[1].damageTaken,1);

const roster=a.roster.flat();
const report=new Map();
let rounds=0, draws=0, totalTicks=0;
a.setRound(11);
for(const [index,name] of roster.entries()){
 for(const star of [1,2,3]){
  const player=a.makeTrainer('Player');
  const enemy=a.makeTrainer('Enemy');
  player.units=[{name,star,position:{x:2,y:4}},{name:'Squirtle',star:1,position:{x:3,y:4}}];
  const rival=roster[(index+19)%roster.length];
  enemy.units=[{name:rival,star,position:{x:3,y:4}},{name:'Charmander',star:1,position:{x:2,y:4}}];
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
