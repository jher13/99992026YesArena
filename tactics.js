(() => {
 const content=byId('event-content');
 const odds=[[100,0,0],[75,25,0],[55,35,10],[35,45,20],[20,45,35],[12,38,50]];
 const benchLimit=9;
 const maxLevel=6;
 const cells=Array.from({length:56},(_,i)=>({x:i%7,y:Math.floor(i/7)}));
 const levels=[0,0,4,8,12,16,Infinity];
 const makeTrainer=(name)=>({name,hp:100,gold:10,level:2,xp:0,units:[],shop:[],streak:0,items:[],augments:[],mods:{}});
 let run=null;
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
  ['Battle Focus','Your team gains 12% attack power.','power',.12],
  ['Deep Reserves','Your team gains 15% max HP.','health',.15],
  ['Quick Charge','Your team starts with 15 mana.','mana',15],
  ['Reinforced Scales','Your team gains 18 defense.','defense',18],
  ['Gold Rush','Gain 8 gold immediately.','gold',8],
  ['Field Training','Gain 6 XP immediately.','xp',6]
 ];
 const randomComponent=()=>drawRogueChoices(Object.keys(components),1)[0];
 const neutralRound=round=>round<=3 || round>=10 && (round-10)%7===0;
 const stageLabel=round=>round<=3?'1-'+round:(2+Math.floor((round-4)/7))+'-'+(1+(round-4)%7);
 function grantAugment(trainer,augment){
  const [label,,stat,value]=augment;
  trainer.augments.push(label);
  if(stat==='gold')trainer.gold+=value;
  else if(stat==='xp')xp(trainer,value);
  else trainer.mods[stat]=(trainer.mods[stat] ?? 0)+value;
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
 function itemMods(unit,trainer){
  const mods={...trainer.mods};
  for(const item of unit.items ?? []){
   const bonuses=components[item] ?? Object.values(recipes).find(entry=>entry[0]===item)?.[1] ?? {};
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
  if([4,12,20].includes(run.round)){
   for(const ai of living.slice(1))grantAugment(ai,drawRogueChoices(augments,1)[0]);
   run.choice={kind:'augment',offers:drawRogueChoices(augments,3)};
  }else if(run.round>=7 && (run.round-7)%7===0){
   const offers=[];
   for(let i=0;i<living.length+2;i++){
    const pool=[...run.pool].filter(([,entry])=>entry.copies>0 && entry.tier<=Math.min(2,Math.floor(run.round/8)));
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
   if(choice.kind==='augment')tile.append(element('strong',offer[0]),element('small',offer[1]));
   tile.append(button('Choose',()=>{
    if(choice.kind==='augment')grantAugment(player,offer);
    else {draftCarousel(player,choice.offers.splice(index,1)[0]);choice.complete();}
    run.choice=null;
    render();
   }));
   grid.append(tile);
  }
  content.replaceChildren(heading(choice.kind==='augment'?'Choose an augment':'Shared carousel'),grid);
 }
 function neutralTrainer(){
  const count=run.round<=3?run.round:Math.min(6,Math.floor(run.round/3)+1);
  const names=run.round<=3?['Rattata','Zubat','Geodude']:['Graveler','Golbat','Rhyhorn','Machoke','Boldore','Haunter'];
  return {name:'Wild Pokémon',mods:run.round<=3?{health:-.35,power:-.35}:{health:.05},units:Array.from({length:count},(_,i)=>({
   name:names[i%names.length],star:run.round>=18?2:1,position:cells[28+i]
  }))};
 }
 function completeNeutral(trainer,won){
  trainer.gold+=5+Math.min(5,Math.floor(trainer.gold/10))+(won?1:0);
  xp(trainer,2);
  if(won || run.round<=3)trainer.items.push(randomComponent());
 }

 function button(label,fn,disabled=false){
  const node=element('button',label);node.type='button';node.onclick=fn;node.disabled=disabled;return node;
 }
 const heading=title=>element('h3',title,'bag-section-title');
 function events(){
  run=null;phase='events';showScreen('events');
  content.replaceChildren(heading('Pokémon Teamfight Tactics'),
   element('p','Draft from a shared shop, position your Pokémon, and outlast seven AI trainers.'),
   button('Start match',start));
 }
 function start(){
  const available=dexNames.filter(name=>!isLegendaryEncounter(name) && isAvailablePokemon(name));
  const tiers=[[],[],[]];
  for(const name of drawRogueChoices(available.filter(n=>minimumEncounterLevel(dex[n][0])<16),26))tiers[0].push(name);
  for(const name of drawRogueChoices(available.filter(n=>{
   const level=minimumEncounterLevel(dex[n][0]);return level>=16 && level<34;
  }),20))tiers[1].push(name);
  for(const name of drawRogueChoices(available.filter(n=>minimumEncounterLevel(dex[n][0])>=34),14))tiers[2].push(name);
  const pool=new Map(tiers.flatMap((names,tier)=>names.map(name=>[name,{tier,copies:[22,18,14][tier]}])));
  run={round:1,trainers:[makeTrainer('You'),...Array.from({length:7},(_,i)=>makeTrainer('Trainer '+(i+1)))],tiers,pool,selected:null,busy:false,result:''};
  for(const trainer of run.trainers)roll(trainer);
  render();
 }
 function roll(trainer){
  releaseShop(trainer);
  trainer.shop=Array.from({length:5},()=>{
   const chances=odds[trainer.level-1];
   const roll=Math.random()*100;
   const tier=roll<chances[0]?0:roll<chances[0]+chances[1]?1:2;
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
  trainer.gold-=cost(name);trainer.shop[index]=null;
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
 function moveUnit(player,position){
  const unit=run.selected;
  if(!unit)return;
  const occupied=player.units.find(other=>other.position===position);
  if(unit.position===null && !occupied && field(player).length>=player.level)return;
  if(occupied)occupied.position=unit.position;
  unit.position=position;run.selected=null;render();
 }
 function traits(units){
  const counts={};
  for(const unit of units)for(const type of dex[unit.name].slice(1,3).filter(Boolean))counts[type]=(counts[type] ?? 0)+1;
  return counts;
 }
 function board(units,player,combat=false){
  const grid=element('div',null,'tactics-board');
  for(let y=0;y<8;y++){
   const row=element('div',null,'tactics-hex-row');
   for(let x=0;x<7;x++){
    const position=cells[y*7+x];
    const unit=units.find(unit=>unit.position?.x===x && unit.position?.y===y);
    const tile=button('',()=>{
     if(run.selected && run.selected!==unit)moveUnit(player,position);
     else if(unit){run.selected=unit;render();}
    },combat || y<4);
    tile.className='tactics-hex'+(unit?.opponent?' is-opponent':'');
    tile.setAttribute('aria-label',unit?unit.name+' '+unit.star+' star':'Empty hex '+(x+1)+', '+(y+1));
    if(unit){
     tile.append(pokemonPortrait(unit.name),element('small',combat?Math.ceil(unit.hp)+' HP · '+Math.floor(unit.mana)+' MP':'★'.repeat(unit.star)));
     if(!combat)tile.setAttribute('aria-pressed',String(run.selected===unit));
    }
    row.append(tile);
   }
   grid.append(row);
  }
  return grid;
 }
 function render(){
  const player=run.trainers[0];
  const standings=element('ol',null,'tactics-standings');
  for(const trainer of [...run.trainers].sort((a,b)=>b.hp-a.hp))standings.append(element('li',trainer.name+' · '+trainer.hp+' HP'));
  if(player.hp<=0 || run.trainers.every(t=>t===player || !t.hp)){
   content.replaceChildren(heading(player.hp?'First place':'Place '+run.place),standings,button('Play again',start),button('Back to Events',events));
   return;
  }
  if(run.choice){renderChoice(run.choice);return;}
  const header=element('p','Stage '+stageLabel(run.round)+(neutralRound(run.round)?' · Neutral round':'')+' · '+player.gold+' gold · Level '+player.level+' · '+field(player).length+'/'+player.level+' deployed');
  const shop=element('div',null,'shop-grid');
  player.shop.forEach((name,i)=>{
   if(!name){shop.append(element('div','—','bag-item'));return;}
   const tile=card({name},'Cost '+cost(name)+' gold');
   tile.append(button('Buy',()=>{if(buy(player,i))render();},player.gold<cost(name) ||
    (player.units.filter(unit=>unit.position===null).length>=benchLimit && player.units.filter(unit=>unit.name===name && unit.star===1).length<2)));
   shop.append(tile);
  });
  const bench=element('div',null,'shop-grid');
  for(const unit of player.units.filter(unit=>unit.position===null)){
   const tile=card(unit,'★'.repeat(unit.star));
   tile.append(button(run.selected===unit?'Selected':'Select',()=>{run.selected=unit;render();}));
   bench.append(tile);
  }
  const controls=element('div',null,'menu-actions');
  controls.append(button('Reroll · 2 gold',()=>{player.gold-=2;roll(player);render();},player.gold<2),
   button('Buy 4 XP · 4 gold',()=>{player.gold-=4;xp(player,4);render();},player.gold<4 || player.level>=maxLevel));
  const selected=run.selected;
  if(selected){
   controls.append(button('Sell '+selected.name,()=>{
    player.gold+=cost(selected.name)*selected.star;
    run.pool.get(selected.name).copies+=3**(selected.star-1);
    player.items.push(...(selected.items ?? []));
    player.units=player.units.filter(unit=>unit!==selected);run.selected=null;render();
   }));
   player.items.forEach((item,index)=>controls.append(button('Equip '+item,()=>{
    if(equip(player,selected,item)){player.items.splice(index,1);render();}
   })));
   if(selected.position!==null)controls.append(button('Move to bench',()=>{
    selected.position=null;run.selected=null;render();
   },player.units.filter(unit=>unit.position===null).length>=benchLimit));
  }
  const bonuses=Object.entries(traits(field(player))).filter(([,count])=>count>=2).map(([type,count])=>type+' '+count);
  content.replaceChildren(heading('Planning'),header,element('p',run.result || 'Select a Pokémon, then select a hex on your side.'),
   board(player.units,player),element('p',bonuses.length?'Active traits · '+bonuses.join(' · '):'Deploy two Pokémon of the same type to activate a trait.'),
   button('Start combat',play,!field(player).length),heading('Bench'),bench,heading('Shop'),shop,controls,
   element('p',player.level>=maxLevel?'Max level':'XP '+player.xp+' / '+levels[player.level]),heading('Items & augments'),element('p',player.items.length?player.items.join(' · '):'No items in inventory.'),
   element('p',player.augments.length?player.augments.join(' · '):'No augments selected.'),heading('Standings'),standings);
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
   const ranged=(dexStats[dex[unit.name][0]-1][5]>=dexStats[dex[unit.name][0]-1][1]);
   unit.position=i<trainer.level?cells[(ranged?42:28)+i]:null;
  });
 }
 function distance(a,b){
  const q=p=>p.x-(p.y-(p.y&1))/2;
  return (Math.abs(q(a)-q(b))+Math.abs(a.y-b.y)+Math.abs(q(a)+a.y-q(b)-b.y))/2;
 }
 function fighter(unit,opponent,types,trainer){
  const base=dexStats[dex[unit.name][0]-1];
  const special=base[5]>=base[1];
  const bonus=Math.max(0,...dex[unit.name].slice(1,3).map(t=>(types[t] ?? 0)-1));
  const mods=itemMods(unit,trainer);
  const hp=Math.round((base[0]*4+180)*1.65**(unit.star-1)*(1+bonus*.06+(mods.health ?? 0)));
  const move=legalMoves(unit.name).filter(m=>moveCatalog[m]?.[1]>0 && !moveCatalog[m][4])
   .sort((a,b)=>Number(moveCatalog[b][0]===dex[unit.name][1])-Number(moveCatalog[a][0]===dex[unit.name][1]) || moveCatalog[b][1]-moveCatalog[a][1])[0];
  return {...unit,opponent,hp,max:hp,mana:Math.min(60,mods.mana ?? 0),range:special?3:1,defense:base[special?4:2]+(mods.defense ?? 0),
   power:(Math.max(base[1],base[5])*.35+12)*1.5**(unit.star-1)*(1+bonus*.1+(mods.power ?? 0)),move,wait:0,
   position:opponent?{x:6-unit.position.x,y:7-unit.position.y}:unit.position};
 }
 function battle(a,b){
  return [...field(a).map(unit=>fighter(unit,false,traits(field(a)),a)),
   ...field(b).map(unit=>fighter(unit,true,traits(field(b)),b))];
 }
 function nextStep(unit,target,units){
  const occupied=new Set(units.filter(other=>other.hp>0).map(other=>other.position.y*7+other.position.x));
  const queue=[{position:unit.position,first:null}];
  for(let i=0;i<queue.length;i++){
   const {position,first}=queue[i];
   if(first && distance(position,target.position)<=unit.range)return first;
   for(const cell of cells){
    const key=cell.y*7+cell.x;
    if(occupied.has(key) || distance(position,cell)!==1)continue;
    occupied.add(key);
    queue.push({position:cell,first:first ?? cell});
   }
  }
  return null;
 }
 function tick(units){
  for(const unit of units){
   if(unit.hp<=0)continue;
   const targets=units.filter(other=>other.hp>0 && other.opponent!==unit.opponent)
    .sort((a,b)=>distance(unit.position,a.position)-distance(unit.position,b.position) || a.hp-b.hp);
   const target=targets[0];
   if(!target)continue;
   if(unit.wait>0){unit.wait--;continue;}
   const gap=distance(unit.position,target.position);
   if(gap>unit.range){
    const step=nextStep(unit,target,units);
    if(step)unit.position=step;
    continue;
   }
   const cast=unit.mana>=60 && unit.move;
   const type=cast?moveCatalog[unit.move][0]:dex[unit.name][1];
   const row=typeChart[type] ?? {};
   const match=dex[target.name].slice(1,3).reduce((scale,t)=>scale*(row[t] ?? 1),1);
   const damage=Math.max(1,Math.round(unit.power*(cast?1.8+moveCatalog[unit.move][1]/120:1)*Math.max(.35,match)*100/(100+target.defense)));
   target.hp=Math.max(0,target.hp-damage);
   target.mana=Math.min(60,target.mana+5);
   unit.mana=cast?0:Math.min(60,unit.mana+15);
   unit.wait=1;
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
   trainer.gold+=5+Math.min(5,Math.floor(trainer.gold/10))+Math.min(3,Math.floor(Math.abs(trainer.streak)/2))+(lost?0:1);
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
  for(let i=0;i<100 && outcome(units)===null;i++)tick(units);
  return outcome(units) ?? 0;
 }
 async function play(){
  if(run.busy)return;
  const current=run;
  run.busy=true;
  const player=run.trainers[0];
  const opponents=drawRogueChoices(run.trainers.slice(1).filter(t=>t.hp>0),7);
  for(const trainer of opponents)planAI(trainer);
  const neutral=neutralRound(run.round);
  const rival=neutral?neutralTrainer():opponents.shift();
  const ghost={units:field(rival).map(unit=>({...unit})),mods:rival.mods};
  const units=battle(player,rival);
  for(let i=0;i<100 && outcome(units)===null;i++){
   content.replaceChildren(heading('You vs '+rival.name),board(units.filter(u=>u.hp>0),player,true));
   await new Promise(resolve=>setTimeout(resolve,115));
   if(run!==current || phase!=='events')return;
   tick(units);
  }
  const sign=outcome(units) ?? 0;
  if(neutral){
   completeNeutral(player,sign>0);
   for(const trainer of opponents)completeNeutral(trainer,resolve(battle(trainer,rival))>0);
  }else{
   result(player,rival,units,sign);
   for(let i=0;i+1<opponents.length;i+=2){
    const a=opponents[i],b=opponents[i+1],fight=battle(a,b);
    result(a,b,fight,resolve(fight));
   }
   if(opponents.length%2){
    const a=opponents.at(-1),fight=battle(a,ghost);
    result(a,{units:[],shop:[],hp:100,gold:0,level:maxLevel,streak:0},fight,resolve(fight));
   }
   if(!player.hp)run.place=1+run.trainers.filter(t=>t.hp>0).length+
    run.trainers.slice(1).filter(t=>t.eliminated===run.round && t.name.localeCompare(player.name)<0).length;
  }
  run.round++;
  for(const trainer of run.trainers)if(trainer.hp)roll(trainer);
  run.result=sign>0?'Victory against '+rival.name:sign<0?'Defeat against '+rival.name:'Draw against '+rival.name;
  run.selected=null;run.busy=false;beginChoices();render();
  void checkGameVersion();
 }
 byId('home-events').onclick=events;
 byId('events-back').onclick=()=>{run=null;openMenu();};
})();
