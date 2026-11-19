const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

// Run the shipped click handlers and renderers against a small DOM and a controlled network.
class Element {
 constructor(tag) {
  this.tag = tag; this.children = []; this.attributes = {}; this.events = {}; this.dataset = {};
  this.style = {setProperty(key,value){this[key]=value;}};
  this.classes = new Set();
  this.classList = {
   add: (...names) => names.forEach(name => this.classes.add(name)),
   remove: (...names) => names.forEach(name => this.classes.delete(name)),
   contains: name => this.classes.has(name),
   toggle: (name,on) => on ? this.classes.add(name) : this.classes.delete(name)
  };
 }
 set className(value){this.classes=new Set(value.split(/\s+/).filter(Boolean));}
 get className(){return [...this.classes].join(' ');}
 set textContent(value){this.replaceChildren(String(value??''));}
 get textContent(){return this.children.map(child=>child instanceof Element?child.textContent:child).join('');}
 append(...items){for(const item of items){if(item instanceof Element){item.remove();item.parent=this;}this.children.push(item);}}
 prepend(...items){this.replaceChildren(...items,...this.children);}
 replaceChildren(...items){for(const child of this.children)if(child instanceof Element)child.parent=null;this.children=[];this.append(...items);}
 replaceWith(item){if(this.parent){const owner=this.parent;owner.replaceChildren(...owner.children.map(child=>child===this?item:child));}}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);this.parent=null;}
 cloneNode(deep){const copy=new Element(this.tag);copy.className=this.className;if(deep)copy.append(...this.children.map(c=>c instanceof Element?c.cloneNode(true):c));return copy;}
 get isConnected(){return this===document.body||Boolean(this.parent?.isConnected);}
 contains(node){return this===node||Boolean(node?.parent&&this.contains(node.parent));}
 setAttribute(key,value){this.attributes[key]=String(value);}
 getAttribute(key){return this.attributes[key]??null;}
 addEventListener(type,handler){(this.events[type]??=[]).push(handler);}
 focus(){document.activeElement=this;}
 showModal(){this.open=true;}
 close(){this.open=false;for(const handler of this.events.close??[])handler({target:this});}
 getContext(){return new Proxy({measureText:s=>({width:s.length*6})},{get:(obj,key)=>obj[key]??(()=>{})});}
 matches(selector){
  const [key,qualifier]=selector.split('[');
  if(qualifier==='open]'&&!this.open)return false;
  return key[0]==='#'?this.id===key.slice(1):key[0]==='.'?this.classes.has(key.slice(1)):key===this.tag;
 }
 querySelectorAll(selector){return this.children.filter(c=>c instanceof Element).flatMap(c=>[...(c.matches(selector)?[c]:[]),...c.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0]??null;}
}
const document={body:new Element('body'),activeElement:null,currentScript:{src:'https://arena.test/multiplayer.js'},
 createElement:tag=>new Element(tag),addEventListener(){},querySelector(s){return this.body.querySelector(s);},querySelectorAll(s){return this.body.querySelectorAll(s);},
 getElementById(id){let el=this.body.querySelector('#'+id);if(!el){el=new Element('div');el.id=id;this.body.append(el);}return el;}
};
const session=new Map();
const store={getItem:key=>session.get(key)??null,setItem:(key,value)=>session.set(key,String(value)),removeItem:key=>session.delete(key)};
const rows=[{name:'Nifty',self:true},{name:'Rival',self:false}];
const network={rows,profile:null,fail:false,marketOpens:0,requests:[],
 async rpc(method,args){
  if(method==='arena_online' && args.action==='notifications'){
   this.onNotifications?.();await this.pendingNotifications;return {data:{friends:[],invites:[]}};
  }
  if(method==='arena_online')return {data:{name:'Nifty'}};
  if(method==='arena_online_directory'){
   this.requests.push(args.operation);
   if(this.fail)throw Error('Offline');
   return {data:args.operation==='list'?{count:this.rows.length,players:this.rows}:{count:this.rows.length}};
  }
  if(method==='arena_trainer_card')return {data:args.trainer_name?this.profile:{online:{name:'Nifty',raids:[]}}};
  throw Error(method);
 },auth:{getUser:async()=>({data:{user:{id:'viewer'}}})}
};
async function navigationChecks(A, net) {
 const find=(el,text)=>el.querySelectorAll('button').find(b=>b.textContent===text);
 const click=async(el,text)=>{const b=find(el,text);A.ok(b,text);await b.onclick();};
 const select=(el,id,value)=>{const c=el.querySelector('#tc-'+id);A.ok(c,id);c.value=value;c.onchange();};
 const account='viewer';
 phase='home';starterSave={name:'Pikachu',ign:'Local name'};team.splice(0,team.length,'Pikachu');
 wildProgress.trainerCard={};wildProgress.campaign={};wildProgress.owned={Pikachu:{level:44,xp:0}};wildProgress.favorites=['Pikachu'];
 const dlg=()=>byId('trainer-card-dialog'),gallery=()=>dlg().querySelectorAll('.tc-badge');
 await byId('toolbar-profile').onclick();
 const steps=dlg().querySelector('.tc-ranks').children;
 A.deepEqual(steps.map(step=>step.querySelector('b').textContent),['1','2','3','4','5','6','7']);
 A.deepEqual(steps.map(step=>step.querySelector('strong').textContent),['Rookie','Trainer','Ace','Veteran','Elite','Champion','Master']);
 for(const step of steps)A.equal(step.querySelector('.tc-rank-marker').getAttribute('aria-hidden'),'true');
 A.deepEqual(dlg().querySelector('#tc-frame').children.map(o=>o.value),['']);
 const badgeIds=gymTeams.map(g=>g.id);
 clearedGyms=[...badgeIds];for(const id of badgeIds.slice(0,8))masterGymClears.add(id);
 await window.ArenaTrainerCard.open();
 const featured=dlg().querySelector('.tc-buddy');A.ok(featured);
 const effect=featured.querySelector('.tc-buddy-effect'),sprite=featured.querySelector('.tc-buddy-sprite');
 A.ok(effect&&sprite);A.equal(effect.parent,sprite.parent);A.equal(effect.width,effect.height);A.equal(sprite.dataset.portraitAlign,'center');
 select(dlg(),'frame','laurel');A.ok(dlg().querySelector('.tc-hero').classList.contains('laurel'));
 const hero=dlg().querySelector('.tc-hero');A.equal(hero.children.at(-1),hero.querySelector('.tc-card-frame'));
 A.equal(hero.querySelectorAll('.tc-frame-corner').length,4);A.equal(hero.querySelector('.tc-card-frame').getAttribute('aria-hidden'),'true');
 A.ok(dlg().querySelector('.tc-buddy').classList.contains('tc-frame-laurel'));
 A.ok(byId('home').classList.contains('has-kalos-laurel'));A.equal(wildProgress.campaign.laurel,true);
 select(dlg(),'frame','');A.equal(dlg().querySelector('.tc-card-frame'),null);A.equal(dlg().querySelector('.tc-frame-laurel'),null);A.equal(byId('home').classList.contains('has-kalos-laurel'),false);
 select(dlg(),'frame','laurel');
 select(dlg(),'pennants','Kanto');select(dlg(),'title','Kanto Master');select(dlg(),'audience','friends');
 A.equal(window.ArenaCampaign.appearance(),'Kanto');A.equal(byId('campaign-player-title').textContent,'Kanto Master');A.equal(wildProgress.trainerCard.audience,'friends');
 await click(dlg(),'Achievements');A.equal(gallery().length,68);
 A.equal(dlg().querySelectorAll('.master-badge-mark').length,8);
 A.deepEqual(gallery().map(b=>b.querySelector('.gym-badge-sprite').style['--badge-y']),badgeIds.map((_,i)=>-Math.floor(i/10)*48+'px'));
 await gallery()[67].onclick();A.match(dlg().querySelector('.tc-badge-detail').textContent,new RegExp(gymTeams[67].badge));await gallery()[67].onclick();A.equal(dlg().querySelector('.tc-badge-detail').hidden,true);
 await click(dlg(),'Missions');A.ok(find(dlg(),'Regional rewards'));A.match(dlg().textContent,/Daily missions/);A.equal(dlg().querySelector('#tc-frame'),null);
 await click(dlg(),'Contracts');A.equal(find(dlg(),'Contracts').getAttribute('aria-pressed'),'true');
 await click(dlg(),'Close');phase='gyms';renderCampaign(false);await click(byId('gym-grid'),'Regional missions');
 A.equal(find(dlg(),'Missions').getAttribute('aria-pressed'),'true');A.equal(find(dlg(),'Regional rewards').getAttribute('aria-pressed'),'true');
 await click(dlg(),'Close');phase='home';
 const lobby=byId('home-dialog'),content=byId('home-dialog-content');lobby.append(byId('home-dialog-title'),content);
 await byId('home-online').onclick();A.match(content.textContent,/Sign in/);
 cloudAccount=account;sessionStorage.setItem('arena-online-user',account);await window.resumeArenaPresence();
 window.openTradingHub=async()=>{net.marketOpens++;};await byId('home-hub').onclick();A.equal(net.marketOpens,1);
 await byId('home-online').onclick();A.equal(byId('home-dialog-title').textContent,'Online');A.equal(byId('home-online-count').textContent,'2');
 const profileLinks=()=>content.querySelectorAll('button').filter(b=>b.textContent==='View profile');
 A.deepEqual(profileLinks().map(b=>b.dataset.trainer),['Nifty','Rival']);A.match(content.textContent,/Nifty \(you\)/);
 await profileLinks()[0].onclick();A.equal(dlg().querySelector('.tc-bio').querySelector('h2').textContent,'Nifty');await click(dlg(),'Close');
 net.profile={profile:{publicOnly:true,name:'Rival',style:{},laurel:true},online:{wins:2,losses:1,rating:1012,coop:4}};
 await profileLinks()[1].onclick();A.equal(dlg().querySelector('.tc-nav').hidden,true);A.ok(dlg().querySelector('.tc-avatar').classList.contains('tc-frame-laurel'));A.match(dlg().textContent,/1012|1,012/);
 A.equal(dlg().querySelector('.tc-edit'),null);await click(dlg(),'Close');A.equal(lobby.open,true);
 net.profile={profile:{name:'Rival',style:{},standard:badgeIds,master:[],laurel:true,featured:[{name:'Pikachu',level:44},null,null],
  regionCounts:Array(9).fill(0),shinyLegends:[],records:{}},online:{raids:[]}};
 await profileLinks()[1].onclick();A.ok(dlg().querySelector('.tc-buddy').classList.contains('tc-frame-laurel'));
 A.equal(dlg().querySelector('.tc-edit'),null);A.equal(find(dlg(),'Missions'),undefined);await click(dlg(),'Achievements');A.equal(gallery().length,68);await click(dlg(),'Close');
 profileLinks()[1].focus();net.rows.unshift({name:'Abra',self:false});await click(content,'Refresh');
 A.equal(document.activeElement.dataset.trainer,'Rival');A.equal(byId('home-online-count').textContent,'3');
 net.rows=net.rows.filter(r=>r.self);await click(content,'Refresh');A.equal(profileLinks().length,1);
 net.fail=true;await click(content,'Refresh');A.equal(profileLinks().length,0);A.match(content.textContent,/Try refreshing/);A.equal(byId('home-online-count').hidden,true);
 net.fail=false;await click(content,'Refresh');A.equal(profileLinks().length,1);
 const started=new Promise(resolve=>net.onNotifications=resolve);let finishHeartbeat;
 net.pendingNotifications=new Promise(resolve=>finishHeartbeat=resolve);
 const polling=byId('toolbar-notices').onclick();await started;
 const leaving=window.leaveArenaPresence(net);await Promise.resolve();
 A.notEqual(net.requests.at(-1),'leave');finishHeartbeat();await Promise.all([polling,leaving]);
 A.equal(net.requests.at(-1),'leave');A.equal(byId('home-online-count').hidden,true);
}
(async()=>{
 for(const [file,assetRoot] of [['index.html','./assets/'],['local-test/PokeArena_Local_Test.html','../assets/']]){
  const markup=read(file);
  assert(markup.includes('--arena-kalos-laurel:url("'+assetRoot+'campaign-laurel.svg'));
  assert(markup.includes('#home.has-kalos-laurel #feature-sprite::before,.tc-frame-laurel::before'));
  assert(markup.includes(assetRoot+'gym-badges.png'));
 }
 for(const rule of ['.tc-card-frame{','.tc-frame-corner{','.tc-buddy>canvas{grid-area:1/1'])assert(read('trainer-card.css').includes(rule));
 const settingsGrid=new Element('div');settingsGrid.className='battle-settings-grid';document.getElementById('battle-settings').append(settingsGrid);
 globalThis.profileTest={document,store,network};
 let engine=read('supabase/functions/arena-combat/engine.js');
 engine=engine.slice(0,engine.indexOf('const makeNode'))+'const document=globalThis.profileTest.document;\n'+engine.slice(engine.indexOf('const localStorage'));
 engine=engine.replace('const sessionStorage=localStorage;','const sessionStorage=globalThis.profileTest.store;');
 engine=engine.replace('const Image=class {};','const Image=class {addEventListener(){}};');
 const source=[engine,'let cloudAccount=null;const cloudClient=async()=>globalThis.profileTest.network;',read('campaign-progression.js'),read('trainer-card.js'),read('multiplayer.js'),'export '+navigationChecks.toString()].join('\n');
 const mod=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 await mod.navigationChecks(assert,network);
 console.log('Passed profile navigation, cosmetics on own and visiting cards, 68 badge icons, Mission shortcuts, online listings and refresh recovery.');
})().catch(error=>{
 console.error(error.name,error.message);
 console.error(error.stack.split('\n').slice(1,4).map(l=>l.replace(/data:text\/javascript;base64,[\w+/=]+/g,'arena-client')).join('\n'));
 process.exitCode=1;
});
