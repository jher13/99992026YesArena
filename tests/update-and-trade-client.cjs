const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html');
let checks=0;
class Node {
 constructor(tag='div',text='',cls=''){this.tagName=tag;this.textContent=text??'';this.children=[];this.attributes={};this.classes=new Set(cls.split(' ').filter(Boolean));this.style={setProperty(){}};this.value='';this.open=false;this.events={};
  this.classList={add:(...xs)=>xs.forEach(x=>this.classes.add(x)),remove:(...xs)=>xs.forEach(x=>this.classes.delete(x)),toggle:(x,yes)=>yes?this.classes.add(x):this.classes.delete(x)};
 }
 append(...xs){for(const x of xs){if(x instanceof Node)x.parent=this;this.children.push(x);}}
 prepend(...xs){this.children.unshift(...xs);}
 replaceChildren(...xs){this.children=[];this.append(...xs);}
 setAttribute(k,v){this.attributes[k]=String(v);}
 removeAttribute(k){delete this.attributes[k];}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn);}
 showModal(){this.open=true;}
 close(){this.open=false;for(const f of this.events.close??[])f();}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
 matches(selector){return selector.startsWith('.')?this.classes.has(selector.split(/[\[ ]/)[0].slice(1))&&(!selector.includes('[open]')||this.open):selector.startsWith('dialog')?this.tagName==='dialog'&&(!selector.includes('[open]')||this.open):this.tagName===selector;}
 all(){return this.children.filter(x=>x instanceof Node).flatMap(x=>[x,...x.all()]);}
 querySelector(selector){return this.all().find(x=>x.matches(selector))??null;}
}
function dom(){
 const body=new Node('body'),nodes=new Map();
 const byId=id=>{if(!nodes.has(id)){const n=new Node(id==='home-dialog'?'dialog':'div');nodes.set(id,n);body.append(n);}return nodes.get(id);};
 return {body,byId,element:(...xs)=>new Node(...xs),document:{body,addEventListener(){},querySelector:s=>body.querySelector(s)}};
}
async function updateChecks(){
 const d=dom();let now=0,waitHook=null,flushHook=null,fetchHook=null;const redirects=[];
 const ctx=vm.createContext({...d,window:{},location:{protocol:'https:',href:'https://example.test/PokeArena/',pathname:'/PokeArena/',replace:url=>redirects.push(url)},URL,AbortSignal,
  Date:class extends Date{static now(){return now;}},setTimeout:fn=>{now+=1000;if(waitHook)waitHook();queueMicrotask(fn);},
  fetch:async()=>{if(fetchHook)await fetchHook();return {ok:true,json:async()=>({version:'9.0.0'})};},
  flushArenaSave:async()=>{if(flushHook)await flushHook();},saving:false,
  phase:'home',selectedWild:null,selectedTrainer:null,repeatTimer:null,wildProgress:{autoRepeat:true},trainerOptions:{autoRepeat:true},updateLogEntries:[{version:'0.22.63'}]});
 vm.runInContext(html.slice(html.indexOf('let clientVersionCheckPending='),html.indexOf("window.addEventListener('focus'")),ctx);
 const safe=()=>vm.runInContext('canCheckGameVersion()',ctx);
 assert(safe(),'Saved Auto repeat preferences alone must not block menu updates');checks++;
 for(const kind of ['wild','trainer'])for(const phase of ['battle','wild-result','evolution','trainer-result','wild-select','trainer-select']){
  ctx.phase=phase;ctx.selectedWild=kind==='wild'?{}:null;ctx.selectedTrainer=kind==='trainer'?{}:null;
  assert(!safe(),kind+' automatic session in '+phase);checks++;
 }
 ctx.selectedWild=null;ctx.selectedTrainer=null;ctx.phase='home';ctx.repeatTimer=42;assert(!safe());checks++;
 ctx.repeatTimer=null;ctx.window.isArenaMarketBusy=()=>true;assert(!safe());ctx.window.isArenaMarketBusy=()=>false;checks++;
 ctx.wildResult={capture:{pending:true}};assert(!safe(),'A single automatic capture also needs protection');ctx.wildResult=null;checks++;
 const evolution=new Node('dialog',null,'evolution-dialog');d.body.append(evolution);evolution.showModal();assert(!safe());evolution.close();checks++;
 fetchHook=()=>{ctx.selectedWild={};};await ctx.checkGameVersion();assert.equal(redirects.length,0,'A battle started during manifest fetch must win the race');checks++;
 ctx.selectedWild=null;fetchHook=null;waitHook=()=>{ctx.selectedTrainer={};};await ctx.restartUpdatedClient('9.0.0');assert.equal(redirects.length,0);assert(!d.body.querySelector('.client-update-dialog'));checks++;
 ctx.selectedTrainer=null;waitHook=null;flushHook=()=>{ctx.selectedWild={};};await ctx.restartUpdatedClient('9.0.0');assert.equal(redirects.length,0,'Recheck after cloud flush');checks++;
 ctx.selectedWild=null;flushHook=null;await ctx.restartUpdatedClient('9.0.0');assert.equal(redirects.length,1);assert.match(redirects[0],/gameVersion=9.0.0/);checks++;
}
function storage(){const m=new Map();return {get length(){return m.size;},key:i=>[...m.keys()][i],getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function cloudChecks(){
 const d=dom(),local=storage(),session=storage();let saveWrites=0,marketCalls=[],failures=0,loseResponse=false,heldResolve=null,lastResult;
 const save={version:2,entries:Object.fromEntries(['team','moves','profiles','wild-progress','gym-badges','starter','roguelit-progress','trainer-options','music','sfx','gym-badges/master','gym-badges/clean-records'].map(key=>['pokemon-arena-'+key,null]))};
 Object.assign(save.entries,{'pokemon-arena-team':'["Charmander"]','pokemon-arena-profiles':'{"4":{"pid":3,"ivs":[31,31,31,31,31,31],"evs":[0,0,0,0,0,0]}}','pokemon-arena-moves':'{"Charmander":["Ember"]}',
  'pokemon-arena-wild-progress':JSON.stringify({coins:9000,owned:{Charmander:{level:50,xp:1}},copies:{},registered:['Charmander'],autoRepeat:true,items:{'Rare Candy':2}})});
 const client={rpc:async(name,params)=>{
  if(name==='arena_write_save'){saveWrites++;return {data:{status:'ok',updated_at:'r1'}};}
  marketCalls.push(params);if(heldResolve)await new Promise(resolve=>{heldResolve=resolve;});
  if(params.action==='notices')return {data:{notices:[],pending:1}};
  if(failures>0){failures--;throw Error('Offline');}
  lastResult={status:'ok',save_data:structuredClone(save),updated_at:'r2'};
  if(loseResponse){loseResponse=false;throw Error('Response lost after commit');}
  return {data:lastResult};
 }};
 const ctx=vm.createContext({...d,window:{addEventListener(){}},localStorage:local,sessionStorage:session,playerStorage:local,playerSaveKey:key=>key,
  MutationObserver:class{observe(){}},setTimeout,clearTimeout,setInterval:()=>0,clearInterval,queueMicrotask,crypto:require('node:crypto').webcrypto,
  phase:'home',automaticBattleLoopActive:()=>false,team:['Bulbasaur'],profiles:{1:{pid:1}},loadouts:{Bulbasaur:['Tackle']},savedMoves:{Bulbasaur:['Tackle']},
  wildProgress:{owned:{Bulbasaur:{level:1,xp:0}},coins:10000,autoRepeat:true},registeredPokemon:new Set(['Bulbasaur']),inspected:'Bulbasaur',activeSlot:0,
  gymRematchRecords:{},onlineSaveId:null,openMenu(){},console});
 vm.runInContext(html.slice(html.indexOf('function applyArenaMarketMemory('),html.indexOf('\nfor(const name of team) wildProgress.owned',html.indexOf('function applyArenaMarketMemory('))),ctx);
 vm.runInContext(read('cloud.js').replace('installAccountGate();',''),ctx);
 ctx.testClient=client;vm.runInContext("cloudAccount='user-one';cloudRevision='r0';cloudClient=async()=>testClient;",ctx);
 ctx.phase='battle';await assert.rejects(()=>ctx.window.arenaMarketMutate('buy',{id:'x'}),/main menu/);assert.equal(marketCalls.length,0);checks++;
 ctx.phase='home';loseResponse=true;const result=await ctx.window.arenaMarketMutate('buy',{id:'x'});
 assert.equal(result.status,'ok');assert.equal(marketCalls.length,2);assert.equal(marketCalls[0].args.request_id,marketCalls[1].args.request_id);checks++;
 assert.deepEqual([...ctx.team],['Charmander']);assert.equal(ctx.wildProgress.coins,9000);assert.equal(ctx.wildProgress.autoRepeat,true);assert.equal(ctx.wildProgress.items['Rare Candy'],2);assert(!ctx.loadouts.Bulbasaur);assert(ctx.savedMoves.Charmander);assert(ctx.registeredPokemon.has('Charmander'));checks++;
 failures=2;await assert.rejects(()=>ctx.window.arenaMarketMutate('claim'),/Offline/);assert(ctx.window.isArenaMarketBusy());checks++;
 vm.runInContext('dirty=true',ctx);await ctx.flushArenaSave();assert.equal(saveWrites,0,'Pending ambiguous transactions must never upload an older PC snapshot');checks++;
 vm.runInContext('dirty=false',ctx);const retryId=marketCalls.at(-1).args.request_id;await ctx.window.arenaMarketRecover();assert.equal(marketCalls.at(-1).args.request_id,retryId);assert(!ctx.window.isArenaMarketBusy());checks++;
 heldResolve=true;const pending=ctx.window.arenaMarketMutate('claim');await tick();assert(ctx.window.isArenaMarketBusy());await assert.rejects(()=>ctx.window.arenaMarketMutate('claim'),/still syncing/);const resolve=heldResolve;heldResolve=null;resolve();await pending;checks++;
 const before=marketCalls.length;ctx.phase='battle';await ctx.window.arenaMarketNotifications();await tick();assert.equal(marketCalls.length,before+1,'Do not claim offline deliveries during battle');checks++;
}
async function hubChecks(){
 const d=dom();d.byId('home-dialog').append(d.byId('home-dialog-content'));
 const sample={name:'Bulbasaur',number:1,generation:1,types:['Grass','Poison'],level:50,nature:'Adamant',personality:'Resilient',shiny:false,iv_total:186,ivs:Array(6).fill(31),evs:Array(6).fill(0)};
 const rows=[0,1].map(slot=>({selector:{name:'Bulbasaur',slot,fingerprint:'copy-'+slot},pokemon:sample}));
 const calls=[],mutations=[];let listings=[];
 const ctx=vm.createContext({...d,window:{arenaMarketPrepare:async()=>{},arenaMarketRead:async(action,args)=>{calls.push({action,args});return action==='inventory'?{rows}:{rows:listings,total:listings.length};},
  arenaMarketMutate:async(action,args)=>{mutations.push({action,args});return {message:'Saved.'};}},wildProgress:{coins:10000},
  dexNames:['Bulbasaur','Charmander'],dex:{Bulbasaur:[1],Charmander:[4]},natureNames:['Adamant','Timid'],personalityTraits:[['Resilient','Swift']],statLabels:['HP','Attack','Defense','Speed','Sp. Def','Sp. Atk'],
  moveColors:{Grass:'#00aa00',Fire:'#ff0000'},typeChart:{Grass:{},Fire:{}},pokemonPortrait:()=>new Node('img'),spriteVariants:()=>({shiny:'shiny'}),confirm:()=>true,console});
 vm.runInContext(read('trade-hub.js'),ctx);
 const content=d.byId('home-dialog-content');const text=()=>content.all().map(n=>n.textContent).join(' ');
 const button=label=>content.all().find(n=>n.tagName==='button'&&n.textContent===label);
 const input=label=>content.all().find(n=>n.attributes['aria-label']===label);
 await ctx.window.openTradingHub();assert(d.byId('home-dialog').open);for(const tab of ['Search','Sell','Request'])assert(button(tab));checks++;
 for(const label of ['Pokémon name','Pokédex number','Player IGN','Generation','Element','Nature','Personality','Appearance','Sort by'])assert(input(label));checks++;
 input('Nature').value='Timid';input('Nature').onchange();input('Player IGN').value='Nifty';input('Player IGN').oninput();
 content.all().find(n=>n.tagName==='form').onsubmit({preventDefault(){}});await tick();assert.equal(calls.at(-1).args.nature,'Timid');assert.equal(calls.at(-1).args.ign,'Nifty');checks++;
 await button('Sell').onclick();assert.match(text(),/Active/);assert.match(text(),/Copy 2/);checks++;
 await content.all().find(n=>n.tagName==='button'&&n.textContent.endsWith('Copy 2')).onclick();input('Starting bid (optional)').value='100';input('Buy now price (optional)').value='500';
 await content.all().find(n=>n.tagName==='form').onsubmit({preventDefault(){}});assert.equal(mutations.at(-1).action,'create_auction');assert.equal(mutations.at(-1).args.selector.slot,1);assert.equal(mutations.at(-1).args.buy_now,500);checks++;
 await button('Request').onclick();assert(input('Search requests for'));await button('Create request').onclick();
 await content.all().find(n=>n.tagName==='button'&&n.textContent.endsWith('Active')).onclick();input('Pokémon you want').value='charmander';input('Wanted nature').value='Timid';input('Wanted personality').value='Swift';input('Wanted appearance').value='true';
 await content.all().find(n=>n.tagName==='form').onsubmit({preventDefault(){}});const wanted=mutations.at(-1);assert.equal(wanted.action,'create_request');assert.equal(wanted.args.want.name,'Charmander');assert.equal(wanted.args.want.personality,'Swift');assert.equal(wanted.args.want.shiny,true);checks++;
 assert(ctx.window.arenaMarketMatchesWanted({...sample,name:'Charmander',nature:'Timid',personality:'Swift',shiny:true},wanted.args.want));assert(!ctx.window.arenaMarketMatchesWanted({...sample,name:'Charmander'},wanted.args.want));checks++;
 await button('Browse requests').onclick();listings=[{id:'request-one',kind:'request',pokemon:sample,seller:'Brock',want:{name:'Bulbasaur',nature:'Adamant',personality:'Resilient'},ends_at:new Date(Date.now()+86400000).toISOString(),status:'open'}];
 await button('Refresh').onclick();await button('Offer a matching Pokémon').onclick();await content.all().find(n=>n.tagName==='button'&&n.textContent.endsWith('Copy 2')).onclick();await button('Complete this trade').onclick();assert.equal(mutations.at(-1).action,'fulfill');assert.equal(mutations.at(-1).args.selector.slot,1);checks++;
 d.byId('home-dialog').close();assert(!d.byId('home-dialog').classes.has('trade-hub-dialog'));checks++;
}
(async()=>{await updateChecks();await cloudChecks();await hubChecks();console.log(checks+' client checks passed: automatic session update guards, transaction recovery, live PC imports and all Hub tabs.');})().catch(error=>{console.error(error);process.exitCode=1;});
