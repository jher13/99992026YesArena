(() => {
 const content=byId('event-content');
 const odds=[[100,0,0,0,0],[75,25,0,0,0],[55,35,10,0,0],[40,35,20,5,0],[28,34,25,11,2],[15,25,30,22,8],[10,18,28,30,14],[6,12,22,35,25],[3,7,15,35,40]];
 const roster=[
  ['Bulbasaur','Charmander','Squirtle','Pikachu','Caterpie','Rattata','Pidgey','Zubat','Geodude','Sandshrew','Oddish','Abra','Machop','Gastly','Eevee'],
  ['Ivysaur','Charmeleon','Wartortle','Raichu','Pidgeotto','Golbat','Graveler','Machoke','Kadabra','Haunter','Vulpix','Psyduck','Magnemite','Growlithe'],
  ['Ninetales','Golduck','Magneton','Arcanine','Clefable','Scyther','Pinsir','Rhydon','Hypno','Lapras','Jolteon','Vaporeon','Flareon','Leafeon','Glaceon'],
  ['Venusaur','Charizard','Blastoise','Alakazam','Machamp','Golem','Gengar','Snorlax','Dragonite','Tyranitar','Gardevoir','Metagross','Espeon','Umbreon','Sylveon'],
  ['Regice','Regirock','Registeel','Articuno','Zapdos','Moltres','Mewtwo','Lugia','Ho-Oh','Rayquaza','Raikou','Entei','Suicune','Kyogre','Groudon']
 ];
 const roleProfiles={
  Tank:{range:1,hp:1.22,attack:.85,defense:1.17,speed:.82},
  Bruiser:{range:1,hp:1.08,attack:1.03,defense:1.02,speed:1},
  Skirmisher:{range:1,hp:.9,attack:1.18,defense:.91,speed:1.15},
  Caster:{range:3,hp:.88,attack:1.12,defense:.91,speed:.94},
  Ranged:{range:4,hp:.91,attack:1.02,defense:.91,speed:1.03},
  Vanguard:{range:2,hp:1.02,attack:1.02,defense:1.03,speed:.98}
 };
 const roleGroups={
  Tank:['Squirtle','Wartortle','Blastoise','Geodude','Graveler','Golem','Magnemite','Magneton','Clefable','Lapras','Snorlax','Umbreon','Regice','Regirock','Registeel','Lugia','Suicune'],
  Bruiser:['Charmander','Machop','Machoke','Machamp','Sandshrew','Arcanine','Rhydon','Pinsir','Flareon','Tyranitar','Metagross','Entei','Groudon'],
  Skirmisher:['Rattata','Zubat','Golbat','Eevee','Pidgey','Pidgeotto','Scyther','Leafeon'],
  Caster:['Abra','Kadabra','Alakazam','Gastly','Haunter','Gengar','Psyduck','Golduck','Hypno','Ninetales','Gardevoir','Espeon','Sylveon','Mewtwo'],
  Ranged:['Pikachu','Raichu','Vulpix','Jolteon','Vaporeon','Glaceon','Articuno','Zapdos','Moltres','Raikou','Kyogre'],
  Vanguard:['Bulbasaur','Ivysaur','Venusaur','Caterpie','Oddish','Growlithe','Charmeleon','Charizard','Dragonite','Ho-Oh','Rayquaza']
 };
 const roles=new Map(Object.entries(roleGroups).flatMap(([role,names])=>names.map(name=>[name,role])));
 const rarities=new Map(roster.flatMap((names,index)=>names.map(name=>[name,index])));
 const collectionTraits={
  'ILoveEevee':{color:'#d8a9dd',members:['Eevee','Vaporeon','Jolteon','Flareon','Espeon','Umbreon','Leafeon','Glaceon','Sylveon'],
   tiers:[[2,{health:.08,power:.08}],[4,{health:.14,power:.16,mana:10}],[6,{health:.22,power:.24,mana:15,regen:1}],[9,{health:.32,power:.36,mana:20,regen:2}]]},
  'Regi-Trio':{color:'#b2c3cc',members:['Regice','Regirock','Registeel'],tiers:[[3,{health:.18,power:.18,defense:24,mana:15,regen:2}]]},
  'Kanto Partners':{color:'#91cf81',members:['Venusaur','Charizard','Blastoise'],tiers:[[3,{health:.16,power:.16,defense:12}]]},
  'Legendary Birds':{color:'#e4c268',members:['Articuno','Zapdos','Moltres'],tiers:[[3,{power:.20,mana:20,regen:1}]]},
  'Legendary Beasts':{color:'#d69775',members:['Raikou','Entei','Suicune'],tiers:[[3,{health:.18,power:.18,mana:15}]]},
  'Weather Trio':{color:'#76bcb2',members:['Kyogre','Groudon','Rayquaza'],tiers:[[1,{weather:1}],[2,{weather:2}],[3,{weather:3}]]}
 };
 const benchLimit=9;
 const combatTicks=240, combatStepMs=115, combatDamageScale=.55;
 const traitHealthPerAlly=.06, traitPowerPerAlly=.10;
 const maxLevel=9;
 const cells=Array.from({length:56},(_,i)=>({x:i%7,y:Math.floor(i/7)}));
 const levels=[0,0,4,8,12,16,24,32,40,Infinity];
 const makeTrainer=(name)=>({name,hp:100,gold:0,level:2,xp:0,units:[],shop:[],streak:0,items:[],augments:[],mods:{}});
 let run=null, planningTimer=null, dragged=null, draggedItem=null;
 const components={
  Claw:{power:.10}, Charm:{mana:12}, Berry:{health:.15}, Scale:{defense:16}
 };
 const recipes={
  'Claw+Claw':['Razor Claws',{power:.30}], 'Charm+Claw':['Spell Claw',{power:.17,mana:22}],
  'Berry+Claw':['Sitrus Blade',{power:.16,health:.24}], 'Claw+Scale':['Iron Claw',{power:.16,defense:26}],
  'Charm+Charm':['Mystic Charm',{mana:40}], 'Berry+Charm':['Lucky Berry',{health:.25,mana:22}],
  'Charm+Scale':['Runic Scale',{defense:26,mana:22}], 'Berry+Berry':['Berry Satchel',{health:.45}],
  'Berry+Scale':['Berry Armor',{health:.25,defense:28}], 'Scale+Scale':['Dragon Armor',{defense:55}]
 };
 const augments=[
  ['Opening Guard','Each ally blocks the first damaging hit it takes.','guard'],
  ['Echo Cast','Each ally’s first signature move hits again for 35% damage.','echo'],
  ['Second Wind','Each ally heals 12% max HP the first time it falls below half health and survives.','secondWind'],
  ['Overcharge','Each ally restores 10 mana after its first signature move.','overcharge'],
  ['Momentum','Each ally heals 8% max HP whenever it knocks out an opponent.','momentum'],
  ['Weather Surge','While Weather Trio is active, its storm deals 1 extra damage each second.','weatherSurge']
 ];
 const randomComponent=()=>drawRogueChoices(Object.keys(components),1)[0];
 const neutralRound=round=>round<=3 || round>=10 && (round-10)%7===0;
 const stageLabel=round=>round<=3?'1-'+round:(2+Math.floor((round-4)/7))+'-'+(1+(round-4)%7);
 function grantAugment(trainer,augment){
  const [label,,effect]=augment;
  if(trainer.augments.includes(label))return;
  trainer.augments.push(label);
  trainer.mods[effect]=true;
 }
 function equip(trainer,unit,item){
  const items=unit.items ??= [];
  if(!Object.hasOwn(components,item)){if(items.length>=3)return false;items.push(item);return true;}
  const component=items.find(name=>Object.hasOwn(components,name));
  if(items.length>=3 && !component)return false;
  if(component){
   const recipe=recipes[[component,item].sort().join('+')];
   items[items.indexOf(component)]=recipe[0];
  }else items.push(item);
  return true;
 }
 function itemBonuses(item){
  return components[item] ?? Object.values(recipes).find(entry=>entry[0]===item)?.[1] ?? {};
 }
 function describeBonuses(bonuses){
  return Object.entries(bonuses).map(([stat,value])=>{
   if(stat==='health')return '+'+Math.round(value*100)+'% max HP';
   if(stat==='power')return '+'+Math.round(value*100)+'% attack power';
   if(stat==='regen')return value+' mana per second';
   if(stat==='weather')return value+' damage per second to all enemies';
   return '+'+value+(stat==='mana'?' starting mana':' defense');
  }).join(' · ');
 }
 function itemIcon(item){
  const icon=element('span',null,'tactics-item-slot');
  const index=itemSprites.indexOf(item);
  if(index>=0){
   const sprite=element('span',null,'tactics-item-sprite');
   sprite.style.setProperty('--item-index',String(index));
   sprite.setAttribute('aria-hidden','true');
   icon.append(sprite);
  }
  if(item){
   icon.title=item+' · '+describeBonuses(itemBonuses(item));
   icon.setAttribute('aria-label',icon.title);
  }
  return icon;
 }
 function equipFromInventory(player,unit,index){
  if(run.busy || !player.units.includes(unit) || !player.items[index])return;
  if(equip(player,unit,player.items[index])){
   player.items.splice(index,1);render();
  }
 }
 function itemMods(unit,trainer){
  const mods={...trainer.mods};
  for(const item of unit.items ?? []){
   const bonuses=itemBonuses(item);
   for(const [stat,value] of Object.entries(bonuses))mods[stat]=(mods[stat] ?? 0)+value;
  }
  return mods;
 }
 function draftCarousel(trainer,offer){
  const {name,item}=offer;
  trainer.units.push({name,star:1,position:null,items:[]});
  trainer.items.push(item);
  merge(trainer,name);
 }
 function beginChoices(){
  const player=run.trainers[0];
  const living=run.trainers.filter(t=>t.hp>0);
  if(!player.hp || living.length===1)return;
  if([4,12,19].includes(run.round)){
   for(const ai of living.slice(1))grantAugment(ai,drawRogueChoices(augments.filter(([label])=>!ai.augments.includes(label)),1)[0]);
   run.choice={kind:'augment',offers:drawRogueChoices(augments.filter(([label])=>!player.augments.includes(label)),3)};
  }else if(run.round>=7 && (run.round-7)%7===0){
   const offers=[];
   for(let i=0;i<living.length+2;i++){
    const pool=[...run.pool].filter(([,entry])=>entry.copies>0 && entry.tier<=Math.min(4,Math.floor(run.round/6)));
    const selected=drawRogueChoices(pool,1)[0];
    if(!selected)break;
    const [name,entry]=selected;entry.copies--;
    offers.push({name,item:randomComponent()});
   }
   const order=[...living].sort((a,b)=>a.hp-b.hp);
   const aiPick=trainer=>{
    if(offers.length && trainer.units.filter(u=>u.position===null).length<benchLimit)draftCarousel(trainer,offers.splice(Math.floor(Math.random()*offers.length),1)[0]);
   };
   while(order.length && order[0]!==player)aiPick(order.shift());
   if(!offers.length || player.units.filter(u=>u.position===null).length>=benchLimit){
    for(const ai of order.slice(1))aiPick(ai);
    for(const offer of offers)run.pool.get(offer.name).copies++;
   }else run.choice={kind:'carousel',offers,complete:()=>{
    for(const ai of order.slice(1))aiPick(ai);
    for(const offer of offers)run.pool.get(offer.name).copies++;
   }};
  }
 }
 function renderChoice(choice){
  const player=run.trainers[0];
  const grid=element('div',null,'shop-grid');
  for(const [index,offer] of choice.offers.entries()){
   const tile=choice.kind==='carousel'?card(offer,offer.item):element('div',null,'bag-item');
   if(choice.kind==='carousel')tile.append(itemIcon(offer.item));
   if(choice.kind==='augment'){tile.classList.add('tactics-augment-card');tile.append(element('span',['✦','◆','✹'][index],'tactics-augment-icon'),element('strong',offer[0]),element('small',offer[1]));}
   tile.append(button('Choose',()=>{
    if(choice.kind==='augment')grantAugment(player,offer);
    else {draftCarousel(player,choice.offers.splice(index,1)[0]);choice.complete();}
    run.choice=null;
    startPlanning();
   }));
   grid.append(tile);
  }
  const panel=element('section',null,'tactics-choice'+(choice.kind==='augment'?' tactics-augment-screen':''));
  panel.append(choice.kind==='augment'?element('h2','Choose one'):heading('Shared carousel'),grid);
  content.replaceChildren(panel);
 }
 function neutralTrainer(){
  const count=run.round<=3?run.round:Math.min(6,Math.floor(run.round/3)+1);
  const names=run.round<=3?['Rattata','Zubat','Geodude']:['Graveler','Golbat','Rhyhorn','Machoke','Boldore','Haunter'];
  return {name:'Wild Pokémon',mods:run.round<=3?{health:-.35,power:-.35}:{health:.05},units:Array.from({length:count},(_,i)=>({
   name:names[i%names.length],star:run.round>=18?2:1,position:cells[28+i]
  }))};
 }
 function goldInterest(gold){return Math.min(5,Math.floor(gold/10));}
 function streakGold(streak){
  const count=Math.abs(streak);
  return count>=6?3:count===5?2:count>=2?1:0;
 }
 function passiveGold(){return run.round<=3?run.round+1:5;}
 function economyTooltip(label,title,lines){
  const wrapper=element('span',null,'tactics-economy-help');
  wrapper.tabIndex=0;
  const tip=element('span',null,'tactics-economy-tooltip');
  tip.append(element('strong',title),...lines.map(line=>element('span',line)));
  wrapper.append(element('span',label),tip);
  wrapper.setAttribute('aria-label',[label,title,...lines].join('. '));
  return wrapper;
 }
 function payRound(trainer,base,win){
  const interest=goldInterest(trainer.gold), streak=streakGold(trainer.streak);
  trainer.income={base,interest,streak,win};
  trainer.gold+=base+interest+streak+win;
 }
 function completeNeutral(trainer,won){
  payRound(trainer,passiveGold(),run.round>3 && won?1:0);
  xp(trainer,2);
  if(won || run.round<=3)trainer.items.push(randomComponent());
 }

 function button(label,fn,disabled=false){
  const node=element('button',label);node.type='button';node.onclick=fn;node.disabled=disabled;return node;
 }
 const heading=title=>element('h3',title,'bag-section-title');
 function events(){
  clearInterval(planningTimer);run=null;phase='events';showScreen('events');
  content.replaceChildren(heading('Poke Fight Tactics'),
   element('p','Draft from a shared shop, position your Pokémon, and outlast seven AI trainers.'),
   button('Start match',start));
 }
 function start(){
  const tiers=roster;
  const pool=new Map(tiers.flatMap((names,tier)=>names.map(name=>[name,{tier,copies:[26,22,18,12,9][tier]}])));
  run={round:1,trainers:[makeTrainer('You'),...Array.from({length:7},(_,i)=>makeTrainer('Trainer '+(i+1)))],tiers,pool,selected:null,busy:false,result:''};
  for(const [index,trainer] of run.trainers.entries()){
   const name=drawRogueChoices(tiers[0].filter(name=>pool.get(name).copies>0),1)[0];
   pool.get(name).copies--;
   trainer.units.push({name,star:1,position:index===0?null:cells[31]});
  }
  startPlanning();
 }
 function startPlanning(){
  clearInterval(planningTimer);
  run.deadline=Date.now()+(run.round===1?20:30)*1000;
  render();
  const current=run;
  planningTimer=setInterval(()=>{
   if(run!==current || phase!=='events'){clearInterval(planningTimer);return;}
   const seconds=Math.max(0,Math.ceil((current.deadline-Date.now())/1000));
   const timer=content.querySelector('.tactics-planning-clock');
   if(timer)timer.textContent=seconds+'s';
   if(seconds===0){
    clearInterval(planningTimer);
    void play();
   }
  },250);
 }
 function statCard(unit){
  const trainer=run.scout ?? run.trainers[0];
  const stats=unit.hp===undefined?fighter(unit,false,traits(field(trainer)),trainer):unit;
  const details=element('aside',null,'tactics-stat-card');
  const art=element('div',null,'tactics-stat-art');
  art.append(idlePokemonPortrait(unit.name,null,null,true,0));
  const types=element('div',null,'tactics-stat-types');
  for(const type of dex[unit.name].slice(1,3).filter(Boolean))types.append(element('span',type));
  art.append(types);
  const title=element('header');
  title.append(element('strong',unit.name+' '+ '★'.repeat(unit.star)),
   element('small',run.pool.has(unit.name)?'● '+cost(unit.name):'Wild'));
  const meter=(value,max,label,style)=>{
   const row=element('div',null,'tactics-stat-meter '+style);
   const bar=element('progress');bar.max=max;bar.value=value;
   bar.setAttribute('aria-label',label);
   row.append(bar,element('span',label+' '+Math.ceil(value)+' / '+max));
   return row;
  };
  const items=element('div',null,'tactics-stat-items');
  for(let i=0;i<3;i++){
   const item=unit.items?.[i];
   items.append(itemIcon(item));
  }
  const numbers=element('div',null,'tactics-stat-numbers');
  for(const [label,value] of [['ATK',Math.round(stats.attack)],['S.ATK',Math.round(stats.specialAttack)],['DEF',stats.defense],['S.DEF',stats.specialDefense],['Crit Chance',Math.round(stats.critChance*100)+'%'],['Crit Damage',Math.round(stats.critDamage*100)+'%'],['ATK Speed',stats.attackSpeed.toFixed(2)+'/s']]){
   const cell=element('span');cell.append(element('small',label),element('strong',String(value)));numbers.append(cell);
  }
  details.append(art,title,meter(stats.hp,stats.max,'HP','is-hp'),meter(stats.mana,60,'Mana','is-mana'),
   element('p',(stats.move ?? 'No signature move')+' · '+stats.role+' · Range '+stats.range),items,numbers);
  return details;
 }
 function inspectUnit(unit){
  const details=element('dialog',null,'tactics-inspect');
  details.append(statCard(unit),button('Done',()=>details.close()));
  details.addEventListener('close',()=>details.remove(),{once:true});
  content.append(details);details.showModal();
 }
 function unitControls(tile,unit,editable,visual){
  tile.oncontextmenu=event=>{event.preventDefault();inspectUnit(unit);};
  let hoverCard;
  const hide=()=>{hoverCard?.remove();hoverCard=null;};
  const show=()=>{
   if(dragged || draggedItem!==null || hoverCard)return;
   hoverCard=statCard(unit);
   hoverCard.classList.add('is-hover');
   content.append(hoverCard);
   const rect=tile.getBoundingClientRect(),box=hoverCard.getBoundingClientRect();
   hoverCard.style.left=Math.max(8,Math.min(rect.right+8,innerWidth-box.width-8))+'px';
   hoverCard.style.top=Math.max(8,Math.min(rect.top,innerHeight-box.height-8))+'px';
  };
  tile.addEventListener('pointerenter',show);
  tile.addEventListener('pointerleave',hide);
  tile.addEventListener('focus',show);
  tile.addEventListener('blur',hide);
  if(!editable || !visual)return;
  visual.draggable=true;
  visual.ondragstart=event=>{
   hide();dragged=unit;event.dataTransfer.setData('text/plain',unit.name);
   event.dataTransfer.setDragImage(visual,visual.offsetWidth/2,visual.offsetHeight/2);
  };
  visual.ondragend=()=>{dragged=null;};
 }
 function unitVisual(unit,direction){
  const visual=element('span',null,'tactics-unit-visual');
  visual.append(idlePokemonPortrait(unit.name,null,null,true,direction),element('small','★'.repeat(unit.star)));
  return visual;
 }
 const itemSprites=[...Object.keys(components),...Object.values(recipes).map(([name])=>name)];
 function dropUnit(tile,callback,unit){
  tile.ondragover=event=>{if(dragged || (unit && draggedItem!==null))event.preventDefault();};
  tile.ondrop=event=>{
   event.preventDefault();
   if(unit && draggedItem!==null)equipFromInventory(run.trainers[0],unit,draggedItem);
   else if(dragged)callback(dragged);
   dragged=null;draggedItem=null;
  };
 }
 function roll(trainer){
  const locked=trainer.lockedOffers ?? new Set();
  const previous=trainer.shop;
  for(const [index,name] of previous.entries())if(name && !locked.has(index))run.pool.get(name).copies++;
  trainer.shop=Array.from({length:5},(_,i)=>{
   if(locked.has(i) && previous[i])return previous[i];
   const chances=odds[trainer.level-1];
   let tierRoll=Math.random()*100;
   const tier=chances.findIndex(chance=>(tierRoll-=chance)<0);
   const names=run.tiers[tier].filter(name=>run.pool.get(name).copies>0);
   const total=names.reduce((sum,name)=>sum+run.pool.get(name).copies,0);
   let ticket=Math.random()*total;
   const name=names.find(name=>(ticket-=run.pool.get(name).copies)<0);
   if(name)run.pool.get(name).copies--;
   return name ?? null;
  });
 }
 function releaseShop(trainer){
  for(const name of trainer.shop)if(name)run.pool.get(name).copies++;
  trainer.shop=[];
  trainer.lockedOffers?.clear();
 }
 const field=trainer=>trainer.units.filter(unit=>unit.position!==null);
 function merge(trainer,name){
  for(const star of [1,2]){
   const group=trainer.units.filter(unit=>unit.name===name && unit.star===star);
   if(group.length<3)continue;
   const groupToMerge=[...group.filter(unit=>unit.position!==null),...group.filter(unit=>unit.position===null)].slice(0,3);
   const [keeper,...used]=groupToMerge;
   keeper.star++;
   for(const unit of used)for(const item of unit.items ?? []){
    const items=keeper.items ??= [];
    if(items.length<3 && !Object.hasOwn(components,item))items.push(item);
    else if(Object.hasOwn(components,item) && equip(trainer,keeper,item))continue;
    else trainer.items.push(item);
   }
   if(used.includes(run.selected))run.selected=keeper;
   trainer.units=trainer.units.filter(unit=>!used.includes(unit));
  }
 }
 function buy(trainer,index){
  const name=trainer.shop[index];
  if(!name || trainer.gold<cost(name))return false;
  const full=trainer.units.filter(unit=>unit.position===null).length>=benchLimit;
  if(full && trainer.units.filter(unit=>unit.name===name && unit.star===1).length<2)return false;
  trainer.gold-=cost(name);trainer.shop[index]=null;trainer.lockedOffers?.delete(index);
  trainer.units.push({name,star:1,position:null});merge(trainer,name);
  return true;
 }
 const cost=name=>run.pool.get(name).tier+1;
 function xp(trainer,amount){
  if(trainer.level>=maxLevel)return;
  trainer.xp+=amount;
  while(trainer.level<maxLevel && trainer.xp>=levels[trainer.level]){
   trainer.xp-=levels[trainer.level];trainer.level++;
  }
 }
 function card(unit,detail){
  const tile=element('div',null,'bag-item');
  tile.append(idlePokemonPortrait(unit.name),element('strong',unit.name),element('small',detail));
  if(unit.items?.length)tile.append(element('small',unit.items.join(' · ')));
  return tile;
 }
 function moveUnit(player,position,unit=run.selected){
  if(!unit || unit.position===position)return;
  const occupied=player.units.find(other=>other.position===position);
  if(unit.position===null && !occupied && field(player).length>=player.level)return;
  if(occupied)occupied.position=unit.position;
  unit.position=position;run.selected=null;render();
 }
 function traits(units){
  const counts={};
  const species=new Set(units.map(unit=>unit.name));
  for(const name of species)for(const type of dex[name].slice(1,3).filter(Boolean))counts[type]=(counts[type] ?? 0)+1;
  for(const [label,trait] of Object.entries(collectionTraits))counts[label]=trait.members.filter(name=>species.has(name)).length;
  return counts;
 }
 const battlerCanvases=new WeakMap();
 function battlerSprite(unit){
  let canvas=battlerCanvases.get(unit);
  if(!canvas){
   canvas=element('canvas',null,'tactics-battler');
   canvas.width=64;canvas.height=52;
   canvas.setAttribute('aria-hidden','true');
   battlerCanvases.set(unit,canvas);
  }
  paintBattler(unit,performance.now());
  return canvas;
 }
 function paintBattler(unit,now){
  const canvas=battlerCanvases.get(unit);
  if(!canvas)return;
  const action=unit.animation;
  const elapsed=action?Math.max(0,now-action.started):0;
  const clip=action && elapsed<action.duration?pmdMotion(unit,action.motion):null;
  const motion=clip ?? pmdMotion(unit,'idle');
  const ticks=clip?Math.min(clip.duration-.001,elapsed*.06):(now*.06+dex[unit.name][0])%(motion?.duration || 1);
  const frame=motion?.frames.find(frame=>ticks<frame.end) ?? pmdReference(unit.name,unit.direction);
  const sheet=frame?pmdImage(frame.page):null;
  const fallback=getSprite(unit.name);
  const source=sheet?.naturalWidth?frame:fallback;
  const image=sheet?.naturalWidth?sheet:fallback.image;
  const context=canvas.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);
  if(!image.naturalWidth)return;
  context.imageSmoothingEnabled=false;
  const scale=Math.min(1.25,60/source.width,44/source.height);
  const x=source===frame && Number.isFinite(frame.x)?32+frame.x*scale:32-source.width*scale/2;
  const y=source===frame && Number.isFinite(frame.y)?46+frame.y*scale:46-source.height*scale;
  context.drawImage(image,source.sx,source.sy,source.width,source.height,
   Math.round(x),Math.round(y),Math.round(source.width*scale),Math.round(source.height*scale));
 }
 function setBattlerMotion(unit,target,motion,now){
  const dx=target.x-unit.position.x;
  const dy=target.y-unit.position.y;
  unit.direction=pmdDirection(dx,dy);
  const clip=pmdMotion(unit,motion);
  unit.animation={motion,started:now,duration:motion==='walk'?170:Math.min(380,(clip?.duration ?? 16)/.06)};
 }
 function placeOnField(node,x,y){
  node.style.left=(12+x/6.5*76)+'%';
  node.style.top=(9+y/5.95*82)+'%';
 }
 function board(units,player,scouting=false){
  const grid=element('div',null,'tactics-board tactics-planning-space tactics-combat-space');
  for(const position of cells){
   const {x,y}=position;
   const unit=units.find(unit=>unit.position?.x===x && unit.position?.y===y);
   const tile=button('',()=>{
    if(run.selected && run.selected!==unit)moveUnit(player,position);
    else if(unit){run.selected=unit;render();}
   },scouting || y<4);
   tile.className='tactics-hex'+(unit?' is-occupied':'');
   tile.setAttribute('aria-label',unit?unit.name+' '+unit.star+' star':'Empty hex '+(x+1)+', '+(y+1));
   const center=combatPosition(position,false);
   placeOnField(tile,center.x,center.y);
   if(!scouting && y>=4)dropUnit(tile,moving=>moveUnit(player,position,moving),unit);
   if(unit){
    const visual=unitVisual(unit,unit.opponent?0:4);
    unitControls(tile,unit,!scouting,visual);
    tile.append(visual);
    tile.setAttribute('aria-pressed',String(run.selected===unit));
   }
   grid.append(tile);
  }
  return grid;
 }
 function standingsPanel(){
  const standings=element('ol',null,'tactics-standings');
  for(const trainer of [...run.trainers].sort((a,b)=>b.hp-a.hp)){
   const entry=element('li',null,trainer===run.trainers[0]?'is-you':'');
   const health=element('progress');
   health.max=100;health.value=trainer.hp;health.setAttribute('aria-label',trainer.name+' HP');
   const name=button(trainer.name,()=>{if(run.busy)run.spectate?.(trainer);else {run.scout=trainer===run.trainers[0]?null:trainer;render();}},!trainer.hp);
   entry.append(name,element('strong',String(trainer.hp)),health);
   standings.append(entry);
  }
  return standings;
 }
 function stageHeader(player,mode){
  const header=element('header',null,'tactics-stage');
  header.append(element('strong','Stage '+stageLabel(run.round)),element('span',mode),
   element('span',field(player).length+' / '+player.level+' deployed'));
  if(!run.busy){
   const timer=element('span',Math.max(0,Math.ceil((run.deadline-Date.now())/1000))+'s','tactics-planning-clock');
   header.append(timer);
  }
  const timeline=element('div',null,'tactics-timeline');
  for(let round=run.round;round<run.round+5;round++){
   const kind=neutralRound(round)?'Wild':[4,12,19].includes(round)?'Augment':(round>=7 && (round-7)%7===0)?'Draft':'Duel';
   const marker=element('span',stageLabel(round)+' '+kind);
   if(round===run.round)marker.setAttribute('aria-current','step');
   timeline.append(marker);
  }
  header.append(timeline);
  return header;
 }
 function battleLayout(player,units,rival=null,traitTrainer=null){
  const inspected=traitTrainer ?? run.scout ?? player;
  const layout=element('div',null,'tactics-layout'+(rival?' is-combat':''));
  const sidebar=element('aside',null,'tactics-sidebar');
  sidebar.classList.add('tactics-loadout');
  const inventory=element('div',null,'tactics-item-rail');
  inventory.setAttribute('aria-label','Item inventory');
  for(let i=0;i<Math.max(9,inspected.items.length);i++){
   const item=inspected.items[i];
   const slot=itemIcon(item);
   if(item){
    slot.tabIndex=0;
    if(!rival && !run.scout){
     slot.draggable=true;
     slot.ondragstart=event=>{
      draggedItem=i;event.dataTransfer.setData('text/plain',item);
     };
     slot.ondragend=()=>{draggedItem=null;};
    }
   }
   inventory.append(slot);
  }
  const traitList=element('div',null,'tactics-trait-list');
  traitList.append(heading(inspected===run.trainers[0]?'Traits':inspected.name+' traits'));
  sidebar.append(inventory,traitList);
  const types=Object.entries(traits(field(inspected))).filter(([,count])=>count>0).sort((a,b)=>b[1]-a[1]);
  for(const [type,count] of types){
   const group=collectionTraits[type];
   const tier=group?.tiers.findLast(([threshold])=>count>=threshold);
   const active=group?Boolean(tier):count>=2;
   const entry=element('div',null,'tactics-trait'+(active?' is-active':''));
   const badge=element('span',type,'home-type-badge');
   badge.style.setProperty('--type-color',group?.color ?? moveColors[type] ?? '#b7c7dd');
   const strength=Math.max(0,count-1);
   const bonus=amount=>Math.round(100*amount*strength);
   const nextTier=group?.tiers.find(([threshold])=>threshold>count);
   const next=group?nextTier?.[0]:count<2?2:count<maxLevel?count+1:null;
   const progress=next?count+' / '+next:count+' · Max';
   const needed=next?' Next tier: '+(next-count)+' more.':' Maximum tier reached.';
   const description=group?
    'Members: '+group.members.join(', ')+'. '+(tier?(type==='Weather Trio'?'Field effect: ':'Current member bonus: ')+describeBonuses(tier[1])+'.':'Inactive.')+
     (nextTier?' At '+nextTier[0]+': '+describeBonuses(nextTier[1])+'.':''):
    (active?type+' Pokémon gain +'+bonus(traitHealthPerAlly)+'% max HP and +'+bonus(traitPowerPerAlly)+'% attack power.':
     'Inactive. Deploy 2 '+type+' Pokémon to gain +6% max HP and +10% attack power.')+
    ' Only the strongest active type bonus applies to a Pokémon.';
   const tip=element('span',description+needed,'tactics-trait-tooltip');
   entry.tabIndex=0;
   entry.setAttribute('aria-label',type+' trait. '+tip.textContent);
   entry.append(badge,element('span',progress),tip);
   traitList.append(entry);
  }
  if(!types.length)traitList.append(element('small','No active traits.'));
  if(inspected.augments.length)traitList.append(heading('Augments'),element('small',inspected.augments.join(' · ')));
  const middle=element('div',null,'tactics-center');
  const arena=element('div',null,'tactics-field');
  if(!rival){
   const preview=neutralRound(run.round)?neutralTrainer().units.map(unit=>({...unit,opponent:true,
    position:{x:6-unit.position.x,y:7-unit.position.y}})):[];
   arena.append(board([...(run.scout?run.scout.units:units),...preview],player,Boolean(run.scout)));
  }
  let timer=null;
  if(rival){
   const banner=element('header',null,'tactics-combat-banner');
   timer=element('progress');
   timer.max=100;timer.value=100;timer.setAttribute('aria-label','Combat time remaining');
   banner.append(timer,element('strong','Combat'),element('small','Stage '+stageLabel(run.round)+' · '+rival));
   arena.prepend(banner);
   arena.append(benchView(player,true));
   middle.append(arena);
   const summary=element('div',null,'tactics-combat-wallet');
   summary.append(element('span','Level '+player.level),element('strong',player.gold+' gold'));
   middle.append(summary);
  }else middle.append(stageHeader(player,run.scout?'Scouting · '+run.scout.name:neutralRound(run.round)?'Planning · Neutral round':'Planning'),arena);
  const rankings=element('aside',null,'tactics-sidebar');
  rankings.append(heading('Standings'),standingsPanel());
  layout.append(sidebar,middle,rankings);
  return {layout,middle,arena,timer};
 }
 function benchView(player,combat=false){
  const bench=element('div',null,'tactics-bench');
  const benched=player.units.filter(unit=>unit.position===null);
  for(let i=0;i<benchLimit;i++){
   const unit=benched[i];
   const tile=unit?button('',()=>{
    if(combat)inspectUnit(unit);else {run.selected=unit;render();}
   }):element('div');
   tile.className='tactics-bench-slot';
   if(!combat)dropUnit(tile,draggedUnit=>{
    if(draggedUnit.position===null)return;
    if(unit)unit.position=draggedUnit.position;
    else if(benched.length>=benchLimit)return;
    draggedUnit.position=null;run.selected=null;render();
   },unit);
   tile.setAttribute('aria-label',unit?'Select '+unit.name:'Empty bench slot');
   if(unit){
    const visual=unitVisual(unit,0);
    unitControls(tile,unit,!combat,visual);
    tile.setAttribute('aria-pressed',String(run.selected===unit));
    tile.append(visual);
   }
   bench.append(tile);
  }
  return bench;
 }
 function render(){
  const player=run.trainers[0];
  if(player.hp<=0 || run.trainers.every(t=>t===player || !t.hp)){
   content.replaceChildren(heading(player.hp?'First place':'Place '+run.place),standingsPanel(),button('Play again',start),button('Back to Events',events));
   return;
  }
  if(run.choice){renderChoice(run.choice);return;}
  const {layout,middle,arena}=battleLayout(player,player.units);
  const bench=benchView(player);
  const benched=player.units.filter(unit=>unit.position===null);
  const shop=element('section',null,'tactics-shop');
  shop.setAttribute('aria-label','Pokémon shop');
  const bar=element('div',null,'tactics-shop-bar');
  const level=element('div',null,'tactics-shop-level');
  level.append(element('strong','Lvl. '+player.level),element('small',player.level>=maxLevel?'Max':player.xp+'/'+levels[player.level]+' XP'));
  const progress=element('progress');
  progress.max=player.level>=maxLevel?1:levels[player.level];
  progress.value=player.level>=maxLevel?1:player.xp;
  progress.setAttribute('aria-label','Level progress');
  level.append(progress);
  const chances=element('div',null,'tactics-shop-odds');
  odds[player.level-1].forEach((chance,i)=>{
   const label=element('span',chance+'%','tier-'+(i+1));
   label.title='Tier '+(i+1)+' shop odds';
   label.setAttribute('aria-label',label.title+' '+chance+' percent');
   chances.append(label);
  });
  const base=passiveGold(),interest=goldInterest(player.gold);
  const bonus=streakGold(player.streak);
  const win=run.round>3?1:0;
  const nextWinBonus=neutralRound(run.round)?bonus:streakGold(Math.max(1,player.streak+1));
  const nextLossBonus=neutralRound(run.round)?bonus:streakGold(Math.min(-1,player.streak-1));
  const possible=Math.max(nextWinBonus+win,nextLossBonus);
  const gold=economyTooltip(player.gold+' gold','Total income possible · '+(base+interest+possible),[
   'Passive income +'+base,'Interest (max 5) +'+interest,
   'Win/loss streak · +'+nextWinBonus+' on a win / +'+nextLossBonus+' on a loss','Gold per win +'+win
  ]);
  gold.classList.add('tactics-shop-gold');
  const streakName=player.streak<0?'Loss streak':player.streak>0?'Win streak':'Win/loss streak';
  const streak=economyTooltip('🔥 '+Math.abs(player.streak),streakName,[
   'Earn extra gold for consecutive wins or losses.','2–4 rounds · +1 gold','5 rounds · +2 gold',
   '6+ rounds · +3 gold','Current bonus · +'+bonus+' gold'
  ]);
  bar.append(level,chances,gold,streak);
  shop.append(bar);
  const economy=element('div',null,'tactics-economy');
  economy.append(button('Buy XP · 4 gold',()=>{player.gold-=4;xp(player,4);render();},player.gold<4 || player.level>=maxLevel),
   button('Reroll · 2 gold',()=>{player.gold-=2;roll(player);render();},player.gold<2));
  shop.append(economy);
  for(const [index,name] of player.shop.entries()){
   const tile=button('',()=>{if(buy(player,index))render();},!name || player.gold<cost(name) ||
    (benched.length>=benchLimit && player.units.filter(unit=>unit.name===name && unit.star===1).length<2));
   tile.className='tactics-offer'+(name?' tier-'+cost(name):'');
   if(name){
    const types=dex[name].slice(1,3).filter(Boolean);
    const art=element('span',null,'tactics-offer-art');
    art.style.setProperty('--offer-type',moveColors[types[0]] ?? '#72958a');
    const labels=element('span',null,'tactics-offer-types');
    labels.append(...types.map(type=>element('small',type)));
    art.append(pokemonPortrait(name,null,true,0),labels);
    const footer=element('span',null,'tactics-offer-footer');
    footer.append(element('strong',name),element('span','● '+cost(name),'tactics-offer-cost'));
    tile.append(art,footer);
    tile.setAttribute('aria-label','Buy '+name+' for '+cost(name)+' gold');
   }else tile.append(element('small','Sold'));
   const offer=element('div',null,'tactics-shop-slot');
   offer.append(tile);
   if(name){
    const locked=player.lockedOffers ??= new Set();
    const lock=button(locked.has(index)?'🔒':'🔓',()=>{
     if(locked.has(index))locked.delete(index);else locked.add(index);
     render();
    });
    lock.className='tactics-offer-lock';
    lock.title=locked.has(index)?'Unlock offer':'Keep this offer for next round';
    lock.setAttribute('aria-label',(locked.has(index)?'Unlock ':'Lock ')+name);
    lock.setAttribute('aria-pressed',String(locked.has(index)));
    offer.append(lock);
   }
   if(name){offer.tabIndex=0;unitControls(offer,{name,star:1,position:null},false);}
   shop.append(offer);
  }
  const controls=element('div',null,'tactics-unit-actions');
  if(run.scout)controls.append(button('Return to your board',()=>{run.scout=null;render();}));
  if(!run.scout)arena.append(bench);
  middle.append(controls);
  const selected=run.selected;
  if(selected){
   controls.append(button('Sell '+selected.name,()=>{
    player.gold+=cost(selected.name)*selected.star;
    run.pool.get(selected.name).copies+=3**(selected.star-1);
    player.items.push(...(selected.items ?? []));
    player.units=player.units.filter(unit=>unit!==selected);run.selected=null;render();
   }));
   player.items.forEach((item,index)=>controls.append(button('Equip '+item,()=>{
    equipFromInventory(player,selected,index);
   })));
   if(selected.position!==null)controls.append(button('Move to bench',()=>{
    selected.position=null;run.selected=null;render();
   },player.units.filter(unit=>unit.position===null).length>=benchLimit));
  }
  const hint=element('p',run.result || 'Select a Pokémon, then choose a hex on your side.','tactics-hint');
  const income=player.income;
  if(income)hint.append(' · Income: '+income.base+' base, +'+income.interest+' interest, +'+income.streak+' streak'+(income.win?', +1 win':''));
  content.replaceChildren(layout,...(run.round>1?[shop]:[]),hint);
 }
 function planAI(trainer){
  if(trainer.gold>=10 && trainer.level<maxLevel){trainer.gold-=4;xp(trainer,4);}
  for(let i=0;i<5;i++)buy(trainer,i);
  if(!trainer.units.length && trainer.gold>=3){trainer.gold-=2;roll(trainer);for(let i=0;i<5;i++)buy(trainer,i);}
  for(let i=trainer.items.length-1;i>=0;i--){
   const unit=trainer.units.find(unit=>unit.position!==null) ?? trainer.units[0];
   if(unit && equip(trainer,unit,trainer.items[i]))trainer.items.splice(i,1);
  }
  trainer.units.sort((a,b)=>b.star-a.star || cost(b.name)-cost(a.name));
  trainer.units.forEach((unit,i)=>{
   const ranged=roleProfiles[roles.get(unit.name)]?.range>=3;
   unit.position=i<trainer.level?cells[(ranged?42:28)+i]:null;
  });
 }
 function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
 function combatPosition(position,opponent){
  if(!position)return null;
  const x=opponent?6-position.x:position.x;
  const y=opponent?7-position.y:position.y;
  return {x:x+(y%2)*.5,y:y*.85};
 }
 function fighter(unit,opponent,types,trainer){
  const base=dexStats[dex[unit.name][0]-1];
  const special=base[5]>=base[1];
  const bonus=Math.max(0,...dex[unit.name].slice(1,3).map(t=>(types[t] ?? 0)-1));
  const mods=itemMods(unit,trainer);
  for(const [label,group] of Object.entries(collectionTraits)){
   if(!group.members.includes(unit.name))continue;
   const tier=group.tiers.findLast(([threshold])=>types[label]>=threshold);
   if(!tier)continue;
   for(const [stat,value] of Object.entries(tier[1]))mods[stat]=(mods[stat] ?? 0)+value;

  }
  const role=roles.get(unit.name) ?? (special?'Caster':'Bruiser');
  const profile=roleProfiles[role];
  const rarity=rarities.get(unit.name) ?? 0;
  const hp=Math.round((base[0]*4+180)*profile.hp*(1+rarity*.045)*1.65**(unit.star-1)*(1+bonus*traitHealthPerAlly+(mods.health ?? 0)));
  const move=legalMoves(unit.name).filter(m=>moveCatalog[m]?.[1]>0 && !moveCatalog[m][4])
   .sort((a,b)=>Number(moveCatalog[b][0]===dex[unit.name][1])-Number(moveCatalog[a][0]===dex[unit.name][1]) || moveCatalog[b][1]-moveCatalog[a][1])[0];
  const attackScale=profile.attack*(1+rarity*.055)*1.5**(unit.star-1)*(1+bonus*traitPowerPerAlly+(mods.power ?? 0));
  const attackSpeed=Math.max(2.3,Math.min(5.4,(2.75+base[3]*.013)*profile.speed+rarity*.055));
  const defenseScale=profile.defense*(1+rarity*.035)*1.13**(unit.star-1);
  return {...unit,opponent,hp,max:hp,mana:Math.min(60,mods.mana ?? 0),role,range:profile.range,attackSpeed,
   attack:(base[1]*.35+12)*attackScale,specialAttack:(base[5]*.35+12)*attackScale,
   defense:Math.round(base[2]*defenseScale+(mods.defense ?? 0)),specialDefense:Math.round(base[4]*defenseScale+(mods.defense ?? 0)),
   critChance:.10,critDamage:1.5,direction:opponent?0:4,move,wait:0,manaRegen:mods.regen ?? 0,
   guard:mods.guard,echo:mods.echo,secondWind:mods.secondWind,overcharge:mods.overcharge,momentum:mods.momentum,
   position:combatPosition(unit.position,opponent)};
 }
 const battleEffects=new WeakMap();
 function battle(a,b){
  const first=field(a),second=field(b), firstTraits=traits(first),secondTraits=traits(second);
  const units=[...first.map(unit=>fighter(unit,false,firstTraits,a)),...second.map(unit=>fighter(unit,true,secondTraits,b))];
  const storm=(trainer,counts)=>(counts['Weather Trio'] ?? 0)+(counts['Weather Trio'] && trainer.mods.weatherSurge?1:0);
  battleEffects.set(units,{elapsed:0,weather:[storm(a,firstTraits),storm(b,secondTraits)]});
  return units;
 }
 function tickWeather(units){
  const effects=battleEffects.get(units);
  if(!effects)return;
  effects.elapsed+=combatStepMs;
  if(effects.elapsed<1000)return;
  effects.elapsed-=1000;
  const alive=[units.some(unit=>unit.hp>0 && !unit.opponent),units.some(unit=>unit.hp>0 && unit.opponent)];
  for(const unit of units){
   const source=unit.opponent?0:1;
   if(unit.hp>0 && alive[source])unit.hp=Math.max(0,unit.hp-effects.weather[source]);
  }
 }
 function receiveDamage(target,damage){
  if(damage<=0 || target.hp<=0)return;
  if(target.guard){target.guard=false;return;}
  target.hp=Math.max(0,target.hp-damage);
  if(target.secondWind && target.hp>0 && target.hp<target.max/2){
   target.secondWind=false;
   target.hp=Math.min(target.max,target.hp+Math.max(1,Math.round(target.max*.12)));
  }
  target.mana=Math.min(60,target.mana+5);
 }
 function nextStep(unit,target,units){
  const {x,y}=unit.position;
  const heading=Math.atan2(target.position.y-y,target.position.x-x);
  const step=Math.min(.34,Math.max(.08,distance(unit.position,target.position)-unit.range+.04));
  for(const offset of [0,.6,-.6,1.15,-1.15,1.65,-1.65]){
   const angle=heading+offset;
   const point={x:Math.max(0,Math.min(6.5,x+Math.cos(angle)*step)),
    y:Math.max(0,Math.min(5.95,y+Math.sin(angle)*step))};
   if(distance(point,unit.position)<.01)continue;
   if(!units.some(other=>other!==unit && other.hp>0 && distance(point,other.position)<.55))return point;
  }
  return null;
 }
 function elementalMultiplier(type,types){
  const row=typeChart[type] ?? {};
  return types.reduce((multiplier,defense)=>{
   const factor=row[defense] ?? 1;
   return multiplier*(factor>1?1.5:factor);
  },1);
 }
 function tick(units,now=null){
  tickWeather(units);
  for(const unit of units){
   if(unit.hp<=0)continue;
   unit.mana=Math.min(60,unit.mana+unit.manaRegen*combatStepMs/1000);
   const targets=units.filter(other=>other.hp>0 && other.opponent!==unit.opponent)
    .sort((a,b)=>distance(unit.position,a.position)-distance(unit.position,b.position) || a.hp-b.hp);
   const target=targets[0];
   if(!target)continue;
   unit.wait=Math.max(-combatStepMs,unit.wait-combatStepMs);
   if(unit.wait>0)continue;
   const gap=distance(unit.position,target.position);
   if(gap>unit.range){
    const step=nextStep(unit,target,units);
    if(step){
     if(now!==null)setBattlerMotion(unit,step,'walk',now);
     if(now!==null){unit.moveFrom=unit.position;unit.moveStarted=now;}
     unit.position=step;
    }
    continue;
   }
   const cast=unit.mana>=60 && unit.move;
   const type=cast?moveCatalog[unit.move][0]:dex[unit.name][1];
   const match=elementalMultiplier(type,dex[target.name].slice(1,3));
   const special=cast && moveReferences[unit.move]?.[2]==='Special';
   const offense=special?unit.specialAttack:unit.attack;
   const defense=special?target.specialDefense:target.defense;
   const critical=Math.random()<unit.critChance?unit.critDamage:1;
   const damage=match===0?0:Math.max(1,Math.round(combatDamageScale*offense*(cast?1.8+moveCatalog[unit.move][1]/120:1)*match*critical*100/(100+defense)));
   if(now!==null){
    setBattlerMotion(unit,target.position,cast || unit.range>1?'attack':'lunge',now);
    if(!target.animation || now-target.animation.started>=target.animation.duration || target.animation.motion==='walk')
     setBattlerMotion(target,unit.position,'hit',now);
   }
   receiveDamage(target,damage);
   if(cast && unit.echo){
    unit.echo=false;
    if(damage)receiveDamage(target,Math.max(1,Math.round(damage*.35)));
   }
   if(target.hp<=0 && unit.momentum)unit.hp=Math.min(unit.max,unit.hp+Math.max(1,Math.round(unit.max*.08)));
   if(cast){
    unit.mana=unit.overcharge?10:0;
    unit.overcharge=false;
   }else unit.mana=Math.min(60,unit.mana+15);
   unit.wait+=1000/unit.attackSpeed;
  }
 }
 function outcome(units){
  const ours=units.filter(u=>u.hp>0&&!u.opponent),theirs=units.filter(u=>u.hp>0&&u.opponent);
  if(!ours.length || !theirs.length)return Math.sign(ours.length-theirs.length);
  return null;
 }
 function result(a,b,units,sign){
  const losers=sign===0?[a,b]:[sign>0?b:a];
  const damage=2+Math.floor(run.round/3)+units.filter(u=>u.hp>0 && u.opponent===(sign<0)).length;
  for(const trainer of [a,b]){
   const lost=losers.includes(trainer);
   trainer.streak=lost?Math.min(-1,trainer.streak-1):Math.max(1,trainer.streak+1);
   payRound(trainer,passiveGold(),lost?0:1);
   xp(trainer,2);
   if(lost)trainer.hp=Math.max(0,trainer.hp-damage);
   if(!trainer.hp){
    trainer.eliminated=run.round;
    releaseShop(trainer);
    for(const unit of trainer.units)run.pool.get(unit.name).copies+=3**(unit.star-1);
    trainer.units=[];
   }
  }
 }
 function resolve(units){
  for(let i=0;i<combatTicks && outcome(units)===null;i++)tick(units);
  return outcome(units) ?? 0;
 }
 function combatLayer(units){
  const layer=element('div',null,'tactics-combat-space');
  const views=units.map(unit=>{
   const node=element('div',null,'tactics-live-unit'+(unit.opponent?' is-opponent':''));
   const bars=element('div',null,'tactics-live-bars');
   const hp=element('progress'),mana=element('progress');
   hp.max=unit.max;mana.max=60;
   hp.setAttribute('aria-label',unit.name+' health');
   mana.setAttribute('aria-label',unit.name+' mana');
   bars.append(hp,mana);
   if(unit.items?.length){
    const equipped=element('div',null,'tactics-live-items');
    equipped.append(...unit.items.map(itemIcon));node.append(equipped);
   }
   node.append(bars,battlerSprite(unit),element('span','★'.repeat(unit.star),'tactics-combat-stars'));
   unitControls(node,unit,false);
   layer.append(node);
   return {unit,node,hp,mana};
  });
  function paint(now){
   for(const {unit,node,hp,mana} of views){
    if(unit.hp<=0){node.hidden=true;continue;}
    const at=unit.position,from=unit.moveFrom ?? at;
    const progress=Math.min(1,Math.max(0,(now-(unit.moveStarted ?? now))/combatStepMs));
    const x=from.x+(at.x-from.x)*progress,y=from.y+(at.y-from.y)*progress;
    placeOnField(node,x,y);
    node.style.zIndex=String(1+Math.floor(y*10));
    hp.value=unit.hp;mana.value=unit.mana;
    paintBattler(unit,now);
   }
  }
  paint(performance.now());
  return {layer,paint};
 }
 async function play(){
  if(run.busy)return;
  const current=run;
  run.busy=true;
  run.scout=null;
  const player=run.trainers[0];
  if(!field(player).length && player.units.length)player.units[0].position=cells[31];
  const opponents=drawRogueChoices(run.trainers.slice(1).filter(t=>t.hp>0),7);
  for(const trainer of opponents)planAI(trainer);
  const neutral=neutralRound(run.round);
  const rival=neutral?neutralTrainer():opponents.shift();
  const ghost={units:field(rival).map(unit=>({...unit})),mods:rival.mods};
  const matches=[];
  const addMatch=(a,b,mirror=false)=>{
   const match={a,b,units:battle(a,b),mirror,sign:null};
   match.sign=outcome(match.units);
   matches.push(match);
  };
  addMatch(player,rival);
  if(neutral)for(const trainer of opponents)addMatch(trainer,rival);
  else {
   for(let i=0;i+1<opponents.length;i+=2)addMatch(opponents[i],opponents[i+1]);
   if(opponents.length%2)addMatch(opponents.at(-1),ghost,true);
  }
  let watched, watchedTrainer, view, timer, frame=0;
  run.spectate=trainer=>{
   const match=matches.find(entry=>entry.a===trainer || entry.b===trainer);
   if(!match || match===watched && trainer===watchedTrainer)return;
   watched=match;watchedTrainer=trainer;
   const opponent=match.b.name ?? 'Mirror team';
   const battleView=battleLayout(match.a,match.units,match.a.name+' vs '+opponent,trainer);
   timer=battleView.timer;
   view=combatLayer(match.units);
   battleView.arena.insertBefore(view.layer,battleView.arena.querySelector('.tactics-bench'));
   content.replaceChildren(battleView.layout);
  };
  run.spectate(player);
  const animate=now=>{
   if(run!==current || !current.busy || phase!=='events')return;
   view.paint(now);
   requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
  for(;frame<combatTicks && matches.some(match=>match.sign===null);frame++){
   await new Promise(resolve=>setTimeout(resolve,combatStepMs));
   if(run!==current || phase!=='events')return;
   for(const match of matches)if(match.sign===null){
    tick(match.units,performance.now());
    match.sign=outcome(match.units);
   }
   timer.value=100*(1-(frame+1)/combatTicks);
   timer.title=matches.filter(match=>match.sign===null).length+' battles still in progress';
  }
  const sign=matches[0].sign ?? 0;
  if(neutral){
   for(const match of matches)completeNeutral(match.a,match.sign>0);
  }else{
   for(const match of matches){
    const enemy=match.mirror?{units:[],shop:[],hp:100,gold:0,level:maxLevel,streak:0}:match.b;
    result(match.a,enemy,match.units,match.sign ?? 0);
   }
   if(!player.hp)run.place=1+run.trainers.filter(t=>t.hp>0).length+
    run.trainers.slice(1).filter(t=>t.eliminated===run.round && t.name.localeCompare(player.name)<0).length;
  }
  run.round++;
  for(const trainer of run.trainers)if(trainer.hp)roll(trainer);
  run.result=sign>0?'Victory against '+rival.name:sign<0?'Defeat against '+rival.name:'Draw against '+rival.name;
  run.selected=null;run.busy=false;run.spectate=null;beginChoices();
  if(run.choice || !player.hp || run.trainers.filter(t=>t.hp>0).length<=1)render();
  else startPlanning();
  void checkGameVersion();
 }
 byId('home-events').onclick=events;
 byId('events-back').onclick=()=>{clearInterval(planningTimer);run=null;openMenu();};
})();
