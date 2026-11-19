/* Trainer profile and showcases. Collection totals distinguish National species from regional entries. */
(()=>{
 'use strict';
 const ranks=[['Rookie',0],['Trainer',8],['Ace',24],['Veteran',48],['Elite',68],['Champion',100],['Master',130]];
 const settings={
  scene:{Grass:'Grassland Plains',Ghost:'Haunted Hollow',Water:'Flooded Wasteland',Ice:'Frozen Reach'},
  accent:{Gold:'#f7c468',Aqua:'#68dfd2',Orchid:'#d8abff'},
  look:{Ember:'#e97851',Tide:'#5faed3',Moss:'#95b66b'}
 };
 const blank=()=>[null,null,null];
 const asCount=n=>Number.isSafeInteger(n)&&n>=0?n:0;
 const countText=n=>asCount(n).toLocaleString();
 const goodTime=n=>Number.isSafeInteger(n)&&n>0?n:null;
 const timeText=ms=>goodTime(ms)?Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+Math.floor(ms%1000/100):'—';
 const node=element;
 const typeOfName=name=>dex[name].slice(1,3).filter(Boolean);
 const cardState=()=>wildProgress.trainerCard??={};
 const campaignState=()=>wildProgress.campaign??={};
 function appearance(source={}){
  return Object.fromEntries(Object.entries(settings).map(([key,choices])=>[key,Object.hasOwn(choices,source[key])?source[key]:Object.keys(choices)[0]]));
 }
 function recordBattle(enemies,trainerWin,clock,timedOut){
  const kos=enemies.filter(foe=>foe.hp<=0).length;
  if(!kos&&!trainerWin)return;
  const records=wildProgress.trainerRecords??={};
  records.knockouts=asCount(records.knockouts)+kos;
  if(trainerWin){
   records.trainerWins=asCount(records.trainerWins)+1;
   const elapsed=Math.round(clock*1000);
   if(!timedOut&&goodTime(elapsed))records.bestTrainerMs=Math.min(goodTime(records.bestTrainerMs)??Infinity,elapsed);
  }
  saveWildProgress();
 }
 function ownedEntries(){
  const entries=new Map();
  for(const [name,mon] of Object.entries(wildProgress.owned)){
   if(!isAvailablePokemon(name))continue;
   const individuals=[{level:mon.level,profile:profiles[dex[name][0]]},...(wildProgress.copies[name]??[])];
   let best=0,shinyLevel=0;
   for(const copy of individuals){best=Math.max(best,copy.level);if(copy.profile?.shiny)shinyLevel=Math.max(shinyLevel,copy.level);}
   entries.set(name,{name,level:shinyLevel||best,shiny:shinyLevel>0,highest:best,count:individuals.length});
  }
  return entries;
 }
 function localProfile(entries){
  const reg=new Set([...registeredPokemon,...entries.keys()].filter(isAvailablePokemon)),national=new Set(),legends=new Set(),shinyIds=new Set();
  let forms=0,highest=0,individuals=0;
  const shinyLegends=[],regionCounts=Array(9).fill(0);
  for(const name of reg){
   const id=nationalDexId(name);if(dex[name][0]!==id)forms++;
   if(isLegendaryEncounter(name))legends.add(id);
   if(national.has(id))continue;
   national.add(id);regionCounts[generationEnds.findIndex(end=>id<=end)]++;
  }
  for(const mon of entries.values()){
   highest=Math.max(highest,mon.highest);individuals+=mon.count;
   if(mon.shiny){shinyIds.add(nationalDexId(mon.name));if(isLegendaryEncounter(mon.name))shinyLegends.push(mon.name);}
  }
  const state=cardState(),fallback=[...new Set([...wildProgress.favorites,...team])].filter(name=>entries.has(name));
  const slots=Array.isArray(state.featured)?state.featured:fallback;
  const featured=blank().map((_,i)=>slots[i]&&slots.indexOf(slots[i])===i?entries.get(slots[i])??null:null);
  return {name:starterSave?.ign??currentPlayer.name,style:appearance(state),title:campaignState().title,laurel:campaignState().laurel===true,
   standard:[...clearedGyms],master:[...masterGymClears],wildWins:wildProgress.wins,records:wildProgress.trainerRecords??{},
   rogueBest:rogueProgress.best,registered:national.size,forms,individuals,highest,legends:legends.size,shinies:shinyIds.size,
   shinyLegends,regionCounts,featured,raidClears:[...wildProgress.megaRaidRewards]};
 }
 function button(label,action,cls){
  const b=node('button',label,cls);b.type='button';b.onclick=action;return b;
 }
 function meter(value,total,label){
  const p=node('progress');p.max=Math.max(1,total);p.value=Math.min(value,p.max);p.setAttribute('aria-label',label);return p;
 }
 function panel(title,cls=''){
  const box=node('section',null,'tc-panel '+cls);box.append(node('h3',title));return box;
 }
 function metric(parent,label,value){
  const row=node('div',null,'tc-row');row.append(node('span',label),node('strong',String(value)));parent.append(row);
 }
 function tags(name){
  const row=node('div',null,'tc-types');
  for(const type of typeOfName(name)){const pill=node('span',type);pill.style.background=moveColors[type];row.append(pill);}
  return row;
 }
 function portrait(name,shiny=false,cls='',variant=null){
  const art=idlePokemonPortrait(name,cls,variant??(shiny?spriteVariants(name).shiny:null),true);
  art.setAttribute('aria-hidden','true');return art;
 }
 function trainerSprite(look){
  const canvas=node('canvas',null,'tc-trainer');canvas.width=16;canvas.height=22;canvas.setAttribute('aria-hidden','true');
  const ctx=canvas.getContext('2d');
  const palette={o:'#162127',a:settings.look[look],b:'#473b48',s:'#e8ab81',l:'#ffdab1',w:'#f4eacb',d:'#33495a',t:'#72a5ae'};
  const rows=['.....oooooo.....','....oaaaaaao....','...oaawwaaaao...','...oaaaawwaao...','..oaaaaaaaaaao..','..ooooooaaaaao..','...obblllllo....','...obllololo....','...ossllllso....','....osllsso.....','.....ooooo......','...oowaaawoo....','..oaaowswoaao...','..oaaoowoaaao...','..olloodoosso...','..ossoaaoolso...','...ooowwoooo....','....oddddo......','....odoodo......','....odoodo......','...obboobbo.....','...ooo.oooo.....'];
  rows.forEach((row,y)=>[...row].forEach((c,x)=>{if(palette[c]){ctx.fillStyle=palette[c];ctx.fillRect(x,y,1,1);}}));
  return canvas;
 }
 function allowedTitles(model){
  const standard=new Set(model.standard),master=new Set(model.master);
  const complete=(region,set)=>{const gyms=gymTeams.filter(g=>g.region===region);return gyms.length>0&&gyms.every(g=>set.has(g.id));};
  return [...(complete('Paldea',standard)?['Champion']:[]),...gymRegions.filter(([region])=>complete(region,master)).map(([region])=>region+' Master')];
 }
 const raidList=()=>Object.entries(megaRaidTiers).filter(([,tier])=>!tier.master);
 const baseRegionTotals=generationEnds.map((end,i)=>end-(generationEnds[i-1]??0));
 function raidSection(clears){
  const box=panel('Mega raid collection','tc-raid-panel'),grid=node('div',null,'tc-raids');
  for(const [id,raid] of raidList()){
   const master=clears.has(id+'_master'),standard=master||clears.has(id);
   const item=node('div',null,'tc-raid'+(standard?' earned':''));
   const variants=spriteVariants(raid.species).mega?.[raid.name];
   item.append(portrait(raid.species,false,'',variants?.[master?1:0]??variants?.[0]),node('strong',raid.name),
    node('small',master?'Master cleared':standard?'Standard cleared':'Uncleared'));
   grid.append(item);
  }
  box.append(grid);return box;
 }
 function regionsSection(model){
  const box=panel('Regions'),grid=node('div',null,'tc-regions');
  wildRegions.forEach((region,i)=>{
   const item=node('div',null,'tc-region'),top=node('div'),captured=asCount(model.regionCounts[i]),all=baseRegionTotals[i];
   const gyms=gymTeams.filter(g=>g.region===region),normal=gyms.filter(g=>model.standard.includes(g.id)).length,master=gyms.filter(g=>model.master.includes(g.id)).length;
   top.append(node('strong',region),node('span',captured+' / '+all));item.append(top,meter(captured,all,region+' National Pokédex'),
    node('small',gyms.length?normal+'/'+gyms.length+' badges · '+master+'/'+gyms.length+' Master':'National Pokédex'));
   grid.append(item);
  });
  box.append(grid);return box;
 }
 let root,body,nav,activeTab='Profile',model,entries,mine,revision=0,editing=false,networkNote='';
 function tabBar(){
  nav.replaceChildren();
  for(const tab of mine?['Profile','Missions','Achievements']:['Profile','Achievements']){
   const b=button(tab,()=>{activeTab=tab;render();});b.setAttribute('aria-pressed',String(activeTab===tab));nav.append(b);
  }
 }
 function rankData(){
  const total=model.standard.length+model.master.length;
  const index=ranks.findLastIndex(([,goal])=>total>=goal);
  return {total,index,next:ranks[index+1]};
 }
 function rankStrip(rank){
  const strip=node('ol',null,'tc-ranks');strip.setAttribute('aria-label','Badge rank milestones');
  ranks.forEach(([name,goal],i)=>{
   const step=node('li',null,i<=rank.index?'achieved':'');
   if(i===rank.index)step.setAttribute('aria-current','step');
   step.append(node('b',String(i+1)),node('strong',name),node('small',goal+' badges'));strip.append(step);
  });
  return strip;
 }
 function hero(rank,titles){
  const style=appearance(model.style),section=node('section',null,'tc-hero'),scene=node('canvas',null,'tc-scene');
  scene.width=860;scene.height=300;scene.setAttribute('aria-hidden','true');
  const zones=[{x:104,y:92,r:46},{x:753,y:147,r:54},{x:589,y:249,r:33}];
  globalThis.ArenaMapRenderer?.draw(scene.getContext('2d'),{type:style.scene,seed:913,zones},860,300);
  const xp=asCount(model.wildWins)+model.standard.length*5;
  const bio=node('div',null,'tc-bio'),progress=node('div',null,'tc-level'),rankName=ranks[rank.index][0];
  bio.append(node('div',rankName+' rank · '+(rank.next?(rank.next[1]-rank.total)+' badges to '+rank.next[0]:'Highest rank'),'tc-rank-name'),node('h2',model.name),
   node('span',titles.includes(model.title)?model.title:'Pokémon Trainer','tc-title'));
  progress.append(node('strong','Trainer Lv. '+(1+Math.floor(xp/10))),meter(xp%10,10,'Trainer level progress'),node('small',(xp%10)+' / 10 XP'));
  bio.append(progress);
  const facts=node('div',null,'tc-facts');
  for(const [n,label] of [[rank.total,'Badges'],[model.registered,'Species'],[model.shinies,'Shinies'],[model.legends,'Legendaries']]){
   const stat=node('div');stat.append(node('strong',countText(n)),node('small',label));facts.append(stat);
  }
  section.append(scene,trainerSprite(style.look),bio,facts);
  const lead=model.featured.find(Boolean);
  if(lead){const buddy=node('div',null,'tc-buddy'+(lead.shiny?' is-shiny':''));buddy.append(portrait(lead.name,lead.shiny));section.append(buddy);}
  if(model.laurel&&model.standard.filter(id=>id.startsWith('Kalos/')).length===gymTeams.filter(g=>g.region==='Kalos').length)section.classList.add('laurel');
  return section;
 }
 function editControls(titles){
  const details=node('details',null,'tc-edit'),controls=node('div',null,'tc-controls');
  details.open=editing;details.ontoggle=()=>{if(details.isConnected)editing=details.open;};details.append(node('summary','Edit trainer card'));
  function select(label,id,options,current,apply){
   const field=node('label',label),input=node('select');input.id='tc-'+id;
   for(const [v,t] of options){const opt=node('option',t);opt.value=v;input.append(opt);}
   input.value=current;input.onchange=()=>{editing=true;apply(input.value);saveWildProgress();refreshLocal();body.querySelector('#tc-'+id)?.focus();};
   field.append(input);controls.append(field);
  }
  for(const [key,label] of [['scene','Background'],['accent','Banner color'],['look','Trainer outfit']]){
   select(label,key,Object.entries(settings[key]).map(([v,t])=>[v,key==='scene'?t:v]),model.style[key],v=>cardState()[key]=v);
  }
  select('Title','title',[['','Pokémon Trainer'],...titles.map(v=>[v,v])],titles.includes(model.title)?model.title:'',v=>{campaignState().title=v;window.ArenaCampaign?.refreshCosmetics();});
  const share=node('label',null,'tc-share'),c=node('input');c.type='checkbox';c.checked=cardState().share===true;
  c.onchange=()=>{cardState().share=c.checked;saveWildProgress();};share.append(c,'Show my card to accepted friends');controls.append(share);
  details.append(controls);return details;
 }
 function featureCards(){
  const section=panel('Favorite Pokémon','tc-featured'),grid=node('div',null,'tc-favorites');
  model.featured.forEach((mon,i)=>{
   const label='Favorite Pokémon '+(i+1),card=mine?button('',()=>chooseFavorite(i),'tc-mon'):node('div',null,'tc-mon');
   if(mine)card.setAttribute('aria-label','Change '+label+(mon?' · '+mon.name:''));
   if(mon){
    card.style.setProperty('--mon-color',moveColors[typeOfName(mon.name)[0]]??'#a2bbc5');
    const head=node('div',null,'tc-mon-head');head.append(node('small',dexNumber(mon.name)),node('small',mine?'Change':'Lv. '+mon.level));
    card.append(head,portrait(mon.name,mon.shiny),node('strong',(mon.shiny?'✦ ':'')+mon.name),tags(mon.name));
    if(mon.shiny){card.classList.add('is-shiny');card.title='Shiny '+mon.name;}
   }else{card.classList.add('empty');card.append(node('strong',mine?'＋ Choose Pokémon':'Empty slot'),node('small',label));}
   grid.append(card);
  });
  section.append(grid);return section;
 }
 function chooseFavorite(slot){
  const picker=node('dialog',null,'tc-picker'),label=node('h2','Choose favorite Pokémon'),search=node('input');
  picker.setAttribute('aria-label',label.textContent);search.type='search';search.placeholder='Search your Pokémon';search.setAttribute('aria-label',search.placeholder);
  const grid=node('div',null,'tc-pick-grid'),pageText=node('span'),pages=node('div',null,'tc-pager');
  let page=0;const limit=30,old=model.featured.map(mon=>mon?.name??null);
  const set=name=>{
   const used=old.indexOf(name);if(name&&used!==-1&&used!==slot)old[used]=old[slot];
   old[slot]=name;cardState().featured=old;saveWildProgress();picker.close();refreshLocal();
   body.querySelectorAll('.tc-mon')[slot]?.focus();
  };
  const back=button('Previous',()=>{page--;paint();}),next=button('Next',()=>{page++;paint();});
  function paint(){
   const query=search.value.trim().replace(/^#/,'').toLowerCase();
   const list=dexNames.filter(name=>entries.has(name)&&(!query||name.toLowerCase().includes(query)||String(nationalDexId(name))===query.replace(/^0+/,'')));
   const count=Math.max(1,Math.ceil(list.length/limit));page=Math.min(page,count-1);back.disabled=page===0;next.disabled=page>=count-1;
   pageText.textContent=(page+1)+' / '+count;
   grid.replaceChildren(...list.slice(page*limit,(page+1)*limit).map(name=>{
    const mon=entries.get(name),tile=button('',()=>set(name));tile.append(portrait(name,mon.shiny),node('small',(mon.shiny?'✦ ':'')+name));return tile;
   }));
   if(!list.length)grid.append(node('p','No matching Pokémon.'));
  }
  search.oninput=()=>{page=0;paint();};pages.append(back,pageText,next);
  picker.append(label,search,grid,pages,button('Clear slot',()=>set(null)),button('Cancel',()=>picker.close()));
  picker.addEventListener('close',()=>picker.remove(),{once:true});document.body.append(picker);paint();picker.showModal();search.focus();
 }
 function summaries(){
  const group=node('div',null,'tc-summary'),records=panel('Records'),battle=panel('Battle'),collection=panel('Collection'),r=model.records??{},net=model.online;
  metric(records,'Fastest Trainer win',timeText(r.bestTrainerMs));metric(records,'Fastest group raid',timeText(net?.bestGroupMs));
  metric(records,'Highest owned level',model.highest?String(model.highest):'—');metric(records,'Best Roguelit run',countText(model.rogueBest)+' wins');
  metric(battle,'Wild wins',countText(model.wildWins));metric(battle,'Trainer wins¹',countText(r.trainerWins));metric(battle,'Arena knockouts¹',countText(r.knockouts));
  metric(battle,'Ranked PvP',net?countText(net.wins)+'W / '+countText(net.losses)+'L':'—');metric(battle,'Co-op clears',net?countText(net.coop):'—');
  metric(collection,'National Pokédex',countText(model.registered)+' / '+countText(generationEnds.at(-1)));
  collection.append(meter(model.registered,generationEnds.at(-1),'National Pokédex'));
  metric(collection,'Regional forms',countText(model.forms)+' / '+Object.keys(speciesForms).length);
  metric(collection,'Pokémon in PC and team',countText(model.individuals));metric(collection,'Shiny species owned',countText(model.shinies));
  group.append(records,battle,collection);return group;
 }
 function shinyGallery(){
  const section=panel('Legendary shinies · '+model.shinyLegends.length),grid=node('div',null,'tc-shinies');
  for(const name of [...model.shinyLegends].filter(isAvailablePokemon).sort((a,b)=>nationalDexId(a)-nationalDexId(b))){
   const tile=node('div',null,'is-shiny');tile.append(portrait(name,true),node('small',name));grid.append(tile);
  }
  if(!grid.children.length)grid.append(node('p','Your shiny Legendary and Mythical Pokémon appear here.'));
  section.append(grid);return section;
 }
 function missionSections(){
  const pass=battlePassState();
  return Object.entries(passQuests).map(([period,quests])=>{const section=panel(period==='daily'?'Daily missions':'Weekly missions');
   for(const [id,label,goal] of quests){const n=Math.min(goal,pass[period][id]??0);metric(section,label,n+' / '+goal);section.append(meter(n,goal,label));}return section;});
 }
 function achievements(titles){
  const section=panel('Earned titles');
  if(titles.length)for(const title of titles)section.append(node('span',title,'tc-earned-title'));
  else section.append(node('p','Clear Paldea to earn Champion, or complete a regional Master campaign to earn its title.'));
  const badges=panel('Campaign badges'),grid=node('div',null,'tc-earned-badges');
  for(const [i,gym] of gymTeams.entries()){
   const earned=model.standard.includes(gym.id),master=model.master.includes(gym.id);
   if(!earned&&!master)continue;
   const badge=node('div'),art=node('span',null,'gym-badge-sprite');
   art.style.setProperty('--badge-x',-(i%10)*48+'px');art.style.setProperty('--badge-y',-Math.floor(i/10)*48+'px');
   badge.append(art,node('small',gym.badge+(master?' · M':'')));grid.append(badge);
  }
  if(!grid.children.length)grid.append(node('p','Win a Campaign gym battle to earn your first badge.'));
  badges.append(grid);return [section,badges];
 }
 function render(){
  tabBar();if(!model)return;
  const rank=rankData(),titles=allowedTitles(model),style=appearance(model.style);
  root.style.setProperty('--tc-accent',settings.accent[style.accent]);body.replaceChildren();
  if(activeTab==='Missions')body.append(...missionSections());
  else if(activeTab==='Achievements')body.append(rankStrip(rank),...achievements(titles));
  else{
   body.append(hero(rank,titles));if(mine)body.append(editControls(titles));
   body.append(rankStrip(rank),featureCards(),summaries(),shinyGallery(),raidSection(new Set([...(model.raidClears??[]),...(model.online?.raids??[])])),
    regionsSection(model),node('small','¹ Trainer wins, Arena knockouts and fastest Trainer wins are recorded from v0.22.70.','tc-note'));
  }
  if(networkNote)body.append(node('p',networkNote,'tc-note'));
 }
 function refreshLocal(){const net=model?.online;entries=ownedEntries();model=localProfile(entries);model.online=net;render();}
 function mount(){
  if(root)return;root=node('dialog');root.id='trainer-card-dialog';root.setAttribute('aria-labelledby','trainer-card-title');
  const heading=node('div',null,'tc-heading'),title=node('h2','Player Profile');title.id='trainer-card-title';
  heading.append(title,button('Close',()=>root.close()));nav=node('nav',null,'tc-nav');nav.setAttribute('aria-label','Trainer profile sections');
  body=node('div',null,'tc-body');root.append(heading,nav,body);document.body.append(root);root.addEventListener('close',()=>{revision++;});
 }
 async function open(trainerName=null){
  mount();const token=++revision;mine=trainerName===null;editing=false;activeTab='Profile';networkNote='';model=null;
  if(mine)refreshLocal();else{tabBar();body.replaceChildren(node('p','Loading trainer card…'));}
  root.scrollTop=0;if(!root.open)root.showModal();
  if(!sessionStorage.getItem('arena-online-user')){
   if(!mine)body.replaceChildren(node('p','Sign in to view a friend’s trainer card.'));
   return;
  }
  try{
   const {data,error}=await (await cloudClient()).rpc('arena_trainer_card',{trainer_name:trainerName});
   if(token!==revision||!root.open)return;if(error)throw error;
   if(!mine){if(!data?.profile){body.replaceChildren(node('p','This trainer card is private or unavailable.'));return;}model=data.profile;}
   model.online=data?.online??null;
   if(!mine)render();
   else if(activeTab==='Profile'){
    body.querySelector('.tc-summary')?.replaceWith(summaries());
    body.querySelector('.tc-raid-panel')?.replaceWith(raidSection(new Set([...model.raidClears,...(model.online?.raids??[])])));
   }
  }catch{
   if(token!==revision||!root.open)return;
   networkNote='Online records are unavailable right now.';
   if(mine)body.append(node('p',networkNote,'tc-note'));
   else body.replaceChildren(node('p',networkNote));
  }
 }
 window.ArenaTrainerCard={open,recordBattle};
})();
