(() => {
 const content=byId('tactics-content');
 const odds=[[100,0,0,0,0],[75,25,0,0,0],[55,35,10,0,0],[40,35,20,5,0],[28,34,25,11,2],[15,25,30,22,8],[10,18,28,30,14],[6,12,22,35,25],[3,7,15,35,40]];
 const roster=[
  ['Bulbasaur','Charmander','Squirtle','Pikachu','Caterpie','Rattata','Pidgey','Zubat','Geodude','Sandshrew','Oddish','Abra','Machop','Gastly','Eevee'],
  ['Ivysaur','Charmeleon','Wartortle','Raichu','Pidgeotto','Golbat','Graveler','Machoke','Kadabra','Haunter','Vulpix','Psyduck','Magnemite','Growlithe'],
  ['Ninetales','Golduck','Magneton','Arcanine','Clefable','Scyther','Pinsir','Rhydon','Hypno','Lapras','Jolteon','Vaporeon','Flareon','Leafeon','Glaceon'],
  ['Venusaur','Charizard','Blastoise','Alakazam','Machamp','Golem','Gengar','Snorlax','Dragonite','Tyranitar','Gardevoir','Metagross','Espeon','Umbreon','Sylveon'],
  ['Regice','Regirock','Registeel','Articuno','Zapdos','Moltres','Mewtwo','Lugia','Ho-Oh','Rayquaza','Raikou','Entei','Suicune','Kyogre','Groudon']
 ];
 const signatures={
  'Bulbasaur':['Seed Burst','Grass',true],
  'Charmander':['Tailflame','Fire',true],
  'Squirtle':['Water Shell Barrier','Water',true],
  'Pikachu':['Volt Dash','Electric',false],
  'Caterpie':['Silk Snap','Bug',false],
  'Rattata':['Fang Rush','Normal',false],
  'Pidgey':['Wing Gust','Flying',true],
  'Zubat':['Night Bite','Dark',false],
  'Geodude':['Stone Knuckle','Rock',false],
  'Sandshrew':['Sand Drill','Ground',false],
  'Oddish':['Moonlit Petals','Grass',true],
  'Abra':['Blink Pulse','Psychic',true],
  'Machop':['Breaker Punch','Fighting',false],
  'Gastly':['Haunt Mist','Ghost',true],
  'Eevee':['Adaptable Tackle','Normal',false],
  'Ivysaur':['Bud Barrage','Grass',false],
  'Charmeleon':['Scorch Claw','Fire',false],
  'Wartortle':['Shellguard Current','Water',true],
  'Raichu':['Thunder Tail','Electric',false],
  'Pidgeotto':['Crosswind Dive','Flying',false],
  'Golbat':['Venom Swoop','Poison',false],
  'Graveler':['Rolling Quake','Ground',false],
  'Machoke':['Seismic Clinch','Fighting',false],
  'Kadabra':['Spoon Shock','Psychic',true],
  'Haunter':['Phantom Grasp','Ghost',true],
  'Vulpix':['Six-Tail Ember','Fire',true],
  'Psyduck':['Headache Wave','Psychic',true],
  'Magnemite':['Polarity Zap','Electric',true],
  'Growlithe':['Ember Pounce','Fire',false],
  'Ninetales':['Foxfire Curse','Fire',true],
  'Golduck':['Gem Torrent','Water',true],
  'Magneton':['Tri-Coil Surge','Electric',true],
  'Arcanine':['Blazing Rush','Fire',false],
  'Clefable':['Lunar Chorus','Fairy',true],
  'Scyther':['Twin Scythe','Bug',false],
  'Pinsir':['Pincer Crush','Bug',false],
  'Rhydon':['Horn Tremor','Ground',false],
  'Hypno':['Pendulum Pulse','Psychic',true],
  'Lapras':['Glacial Aria','Ice',true],
  'Jolteon':['Lightning Quills','Electric',true],
  'Vaporeon':['Melting Tide','Water',true],
  'Flareon':['Furnace Flare','Fire',false],
  'Leafeon':['Verdant Blade','Grass',false],
  'Glaceon':['Diamond Frost','Ice',true],
  'Venusaur':['Canopy Cannon','Grass',true],
  'Charizard':['Inferno Wing','Fire',true],
  'Blastoise':['Hydro Bulwark','Water',true],
  'Alakazam':['Mind Singularity','Psychic',true],
  'Machamp':['Four-Fist Barrage','Fighting',false],
  'Golem':['Granite Avalanche','Rock',false],
  'Gengar':['Shadow Ambush','Ghost',true],
  'Snorlax':['Slumber Slam','Normal',false],
  'Dragonite':['Dragon Tempest','Dragon',true],
  'Tyranitar':['Sandstorm Tyrant','Rock',false],
  'Gardevoir':['Gravity Rift','Psychic',true],
  'Metagross':['Meteor Cross','Steel',false],
  'Espeon':['Sun Gem Ray','Psychic',true],
  'Umbreon':['Eclipse Fang','Dark',false],
  'Sylveon':['Ribbon Resonance','Fairy',true],
  'Regice':['Absolute Zero','Ice',true],
  'Regirock':['Continental Crash','Rock',false],
  'Registeel':['Iron Core Impact','Steel',false],
  'Articuno':['Polar Gale','Ice',true],
  'Zapdos':['Stormwing Bolt','Electric',true],
  'Moltres':['Solar Phoenix','Fire',true],
  'Mewtwo':['Psystrike','Psychic',true],
  'Lugia':['Silverwind Aegis','Flying',true],
  'Ho-Oh':['Sacred Fire','Fire',false],
  'Rayquaza':['Dragon Ascent','Flying',false],
  'Raikou':['Storm Crown','Electric',true],
  'Entei':['Volcanic Roar','Fire',false],
  'Suicune':['Northern Current','Water',true],
  'Kyogre':['Origin Pulse','Water',true],
  'Groudon':['Precipice Blades','Ground',false],
  'Rhyhorn':['Ridge Charge','Ground',false],
  'Boldore':['Crystal Volley','Rock',false],
 };
 const signaturePowerByTier=[[90,150,245],[105,175,280],[120,200,320],[135,225,365],[150,255,420]];
 const signatureColors={
  Grass:'#8af47b',Fire:'#ff8146',Water:'#6de1ff',Electric:'#ffe15b',Bug:'#d1fa77',
  Normal:'#fff0cc',Flying:'#b5d9ff',Dark:'#bf91ff',Rock:'#ecba77',Ground:'#f3a764',
  Psychic:'#ff91dc',Fighting:'#ff595e',Ghost:'#bd79ff',Poison:'#ea7efa',
  Fairy:'#ffb7e3',Ice:'#adf9ff',Dragon:'#9890ff',Steel:'#e1ecff'
 };
 const roleSignatureEffects={Tank:'shield',Fighter:'rally',Reaper:'execute',Carry:'volley',Caster:'burst'};
 const personalSignatureEffects={
  Squirtle:'teamShield',Wartortle:'teamShield',Blastoise:'teamShield',Lugia:'teamShield',Lapras:'heal',
  Caterpie:'snare',Clefable:'heal',Umbreon:'weaken',Rayquaza:'volley',Sylveon:'heal',Gardevoir:'snare'
 };
 const signatureEffectText={
  shield:'Shields itself for 20% / 30% / 45% of max HP for 5 seconds.',
  teamShield:'Shields every living ally for the listed amount for 5 seconds.',
  rally:'Hits the target and gains 15% / 25% / 40% attack speed for 5 seconds.',
  execute:'Deals 25% / 40% / 60% more damage against targets below half HP.',
  volley:'Hits the target and the nearest other enemy within 2 tiles of it for 30% / 45% / 60% splash damage.',
  burst:'Deals concentrated damage to one enemy.',
  heal:'Heals the two living allies with the lowest HP percentage for 10% / 16% / 25% of their max HP.',
  snare:'Hits and delays the target’s next action by 0.5 / 0.75 / 1 second.',
  weaken:'Hits and reduces the target’s damage by 15% / 25% / 35% for 4 seconds.'
 };
 const utilitySignature=effect=>effect==='teamShield' || effect==='heal';
 const roleProfiles={
  Tank:{range:1,hp:1.32,attack:.76,defense:1.25,speed:.82,mana:5,regen:0,rule:'5 mana per hit and 5 when damaged. Draws aggro at equal range.'},
  Fighter:{range:1,hp:1.08,attack:1.03,defense:1.02,speed:1,mana:10,regen:0,rule:'10 mana per hit. Gains 5% attack speed per stage, up to 30%.'},
  Reaper:{range:1,hp:.9,attack:1.18,defense:.91,speed:1.15,mana:10,regen:0,rule:'10 mana per hit. Prioritizes backline damage dealers and takes 15% less attack damage from other enemies.'},
  Caster:{range:3,hp:.86,attack:1.06,defense:.87,speed:.90,mana:7,regen:2,rule:'7 mana per hit and 2 mana per second.'},
  Carry:{range:4,hp:.85,attack:1.13,defense:.84,speed:1.14,mana:10,regen:0,rule:'10 mana per hit. Long range for backline positioning.'},
  Specialist:{range:2,hp:1.02,attack:1.02,defense:1.03,speed:.98,mana:0,regen:0}
 };
 const specialists={
  Caterpie:{hit:8,incoming:4,rule:'Silk Charge: 8 per hit and 4 when damaged.'},
  Clefable:{regen:6,rule:'Moonlight: regenerates 6 mana per second.'},
  Umbreon:{incoming:10,rule:'Moon Charge: 10 mana when damaged.'},
  Rayquaza:{hit:6,travel:3,rule:'Sky Charge: 6 per hit and 3 per movement step.'}
 };
 const roleGroups={
  Tank:['Squirtle','Wartortle','Blastoise','Geodude','Graveler','Golem','Magnemite','Magneton','Lapras','Snorlax','Regice','Regirock','Registeel','Lugia','Rhyhorn','Boldore'],
  Fighter:['Charmander','Charmeleon','Charizard','Machop','Machoke','Machamp','Sandshrew','Arcanine','Rhydon','Flareon','Tyranitar','Metagross','Entei','Groudon','Growlithe','Dragonite','Ho-Oh','Pinsir'],
  Reaper:['Rattata','Zubat','Golbat','Eevee','Pidgey','Pidgeotto','Scyther','Leafeon','Gengar'],
  Caster:['Abra','Kadabra','Alakazam','Gastly','Haunter','Psyduck','Golduck','Hypno','Ninetales','Gardevoir','Espeon','Sylveon','Mewtwo','Bulbasaur','Ivysaur','Venusaur','Oddish','Suicune'],
  Carry:['Pikachu','Raichu','Vulpix','Jolteon','Vaporeon','Glaceon','Articuno','Zapdos','Moltres','Raikou','Kyogre']
 };
 const roles=new Map(Object.entries(roleGroups).flatMap(([role,names])=>names.map(name=>[name,role])));
 const channeledSignatures=new Set(['Glacial Aria','Lunar Chorus','Ribbon Resonance']);
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
 const attackSlowdown=3;
 const combatTicks=240*attackSlowdown, combatStepMs=115, combatDamageScale=.55;
 const traitHealthPerAlly=.06, traitPowerPerAlly=.10;
 const maxLevel=9;
 const cells=Array.from({length:56},(_,i)=>({x:i%7,y:Math.floor(i/7)}));
 const levels=[0,0,4,8,12,16,24,32,40,Infinity];
 const makeTrainer=(name)=>({name,hp:100,gold:0,level:2,xp:0,units:[],shop:[],streak:0,items:[],augments:[],mods:{}});
 let run=null, planningTimer=null, dragged=null, draggedItem=null;
 const components={
  Claw:{attackPct:.10}, Wing:{speed:.10}, Orb:{spAttack:10}, Charm:{regen:1},
  Scale:{armor:20}, Shell:{spDefense:20}, Berry:{flatHP:150}, Lens:{crit:.20},
  Crest:{}, Totem:{}
 };
 const recipeKey=(a,b)=>[a,b].sort().join('+');
 const recipes={
  'Claw+Claw':['Razor Claws',{"attackPct":0.30,"amp":0.10}],
  'Claw+Wing':['Predator Pinion',{"attackPct":0.15,"speed":0.15,"tankAmp":0.15}],
  'Claw+Orb':['Aura Fang',{"attackPct":0.12,"spAttack":20,"allyHeal":0.15}],
  'Charm+Claw':['Spirit Talon',{"attackPct":0.15,"regen":1,"hitMana":5}],
  'Claw+Scale':['Night Carapace',{"attackPct":0.15,"defense":25,"thresholdGuard":1}],
  'Claw+Shell':['Drain Fang',{"attackPct":0.15,"spDefense":25,"vamp":0.15}],
  'Berry+Claw':['Bramble Fang',{"attackPct":0.15,"flatHP":220,"thresholdShield":0.30}],
  'Claw+Lens':['Truefang Lens',{"attackPct":0.15,"crit":0.25,"critDamage":0.15}],
  'Wing+Wing':['Cinder Pinions',{"speed":0.25,"burn":5}],
  'Orb+Wing':['Cyclone Core',{"speed":0.12,"spAttack":15,"rampSpeed":0.04}],
  'Charm+Wing':['Rift Feather',{"speed":0.15,"regen":1,"shred":5}],
  'Scale+Wing':['Meteor Plating',{"speed":0.12,"defense":25,"hitStack":0.02}],
  'Shell+Wing':['Storm Carapace',{"speed":0.15,"spDefense":25,"attackStack":0.035}],
  'Berry+Wing':['Nectar Quill',{"speed":0.15,"flatHP":180,"hitMana":2,"critMana":2}],
  'Lens+Wing':['Piercing Quill',{"speed":0.15,"crit":0.20,"sunder":3}],
  'Orb+Orb':['Prism Crown',{"spAttack":45,"amp":0.10}],
  'Charm+Orb':['Astral Battery',{"spAttack":18,"regen":1,"rampPower":12}],
  'Orb+Scale':['Halo Plate',{"spAttack":18,"defense":25,"startShield":0.25}],
  'Orb+Shell':['Dissonant Pearl',{"spAttack":18,"spDefense":25,"shredAura":1}],
  'Berry+Orb':['Scorchbloom',{"spAttack":18,"flatHP":180,"burn":10}],
  'Lens+Orb':['Prism Lens',{"spAttack":18,"crit":0.25,"critDamage":0.15}],
  'Charm+Charm':['Mystic Charm',{"mana":20,"regen":3,"attackPct":0.10,"spAttackPct":0.10}],
  'Charm+Scale':['Guardian Seal',{"mana":20,"defense":30,"thresholdShield":0.20,"thresholdMana":15}],
  'Charm+Shell':['Tidal Seal',{"regen":1,"spDefense":30,"manaRate":0.15}],
  'Berry+Charm':['Renewal Seed',{"regen":1,"flatHP":200,"missingHeal":0.02,"durability":0.05}],
  'Charm+Lens':['Twin-Tide Lens',{"regen":1,"crit":0.20,"stance":1}],
  'Scale+Scale':['Thorn Carapace',{"defense":50,"flatHP":120,"retaliate":30}],
  'Scale+Shell':['Bastion Shell',{"defense":25,"spDefense":25,"focusArmor":10}],
  'Berry+Scale':['Ember Husk',{"defense":25,"flatHP":220,"burnAura":1}],
  'Lens+Scale':['Ironwatch Lens',{"defense":25,"crit":0.20,"durability":0.08,"healthyGuard":0.08}],
  'Shell+Shell':['Pearl Bulwark',{"spDefense":55,"flatHP":120,"maxHeal":0.025}],
  'Berry+Shell':['Dusk Husk',{"spDefense":25,"flatHP":220,"sunderAura":1}],
  'Lens+Shell':['Jetstream Visor',{"spDefense":25,"crit":0.20,"rampSpeed":0.03}],
  'Berry+Berry':['Berry Satchel',{"flatHP":360,"health":0.18}],
  'Berry+Lens':['Wildgrowth Lens',{"flatHP":200,"crit":0.20,"critAmp":0.04}],
  'Lens+Lens':['Mirage Goggles',{"crit":0.25,"randomGear":1}],
 };
 const standardGear=Object.values(recipes).map(([name])=>name).filter(name=>name!=='Mirage Goggles');
 const ordinaryComponents=Object.keys(components).slice(0,8);
 for(const [catalyst,types] of [
  ['Crest',['Fire','Flying','Psychic','Water','Steel','Ice','Grass','Electric']],
  ['Totem',['Fighting','Bug','Ghost','Fairy','Rock','Ground','Poison','Dragon']]
 ]){
  ordinaryComponents.forEach((item,index)=>{
   const type=types[index];
   recipes[recipeKey(item,catalyst)]=[type+' Emblem',{...components[item]},type];
  });
 }
 for(const [a,b,name] of [['Crest','Crest','Captain’s Crown'],['Totem','Totem','Captain’s Shield'],['Crest','Totem','Captain’s Banner']]){
  recipes[recipeKey(a,b)]=[name,{teamSize:1}];
 }
 const completedItems=new Map(Object.values(recipes).map(([name,stats,type])=>[name,{stats,type}]));
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
  if(items.includes('Mirage Goggles'))return false;
  if(!Object.hasOwn(components,item)){if(items.length>=3 || item==='Mirage Goggles' && items.length)return false;items.push(item);return true;}
  const component=items.find(name=>Object.hasOwn(components,name));
  if(items.length>=3 && !component)return false;
  if(component){
   const recipe=recipes[recipeKey(component,item)];
   if(recipe[0]==='Mirage Goggles' && items.length>1)return false;
   items[items.indexOf(component)]=recipe[0];
  }else items.push(item);
  return true;
 }
 function itemBonuses(item){
  return components[item] ?? completedItems.get(item)?.stats ?? {};
 }
 function describeBonuses(bonuses){
  const labels={
   attackPct:'ATK',spAttackPct:'S.ATK',speed:'attack speed',crit:'crit chance',critDamage:'crit damage',
   amp:'damage amp',tankAmp:'damage against tanks',vamp:'omnivamp',manaRate:'mana gain',durability:'durability'
  };
  const effects={
   allyHeal:'Heals the lowest-health ally for 15% of damage dealt.',hitMana:' mana per basic attack.',critMana:' extra mana on a critical basic attack.',
   thresholdGuard:'Below 50% HP, blocks the next hit and clears Burn, Wound, Sunder and Shred once.',
   thresholdShield:' max HP shield below half health, once.',thresholdMana:' mana below half health, once.',
   burn:'Burns for 1% max HP per second and reduces healing by 33% for ',rampSpeed:' stacking attack speed per second.',
   shred:'Shreds 30% S.DEF for ',sunder:'Sunders 30% DEF for ',
   hitStack:' ATK and S.ATK per hit dealt or taken, up to 25 stacks.',
   attackStack:' ATK per basic attack, up to 15 stacks.',
   rampPower:' S.ATK every 5 seconds.',startShield:' max HP shield for the first 8 seconds.',
   shredAura:'Shreds 30% S.DEF within range 2.',sunderAura:'Sunders 30% DEF within range 2.',
   missingHeal:' missing HP healed each second.',maxHeal:' max HP healed every 2 seconds.',
   retaliate:' retaliation damage to adjacent attackers, once per 2 seconds.',
   focusArmor:' DEF and S.DEF per enemy targeting this Pokémon.',
   burnAura:'Every 2 seconds, burns and wounds a nearby enemy for 10 seconds.',
   healthyGuard:' extra durability above half health.',stance:'Above half HP, +20% ATK and S.ATK. Below half, +20% omnivamp.',
   critAmp:' stacking damage amp on critical hits until 5 seconds after the last crit.',
   randomGear:'Occupies all 3 slots. Rolls 2 completed items each fight.',
   teamSize:' maximum deployed Pokémon while equipped.'
  };
  const percentages=new Set(['thresholdShield','rampSpeed','hitStack','attackStack','startShield','missingHeal','maxHeal','healthyGuard','critAmp']);
  return Object.entries(bonuses).map(([stat,value])=>{
   if(labels[stat])return '+'+Math.round(value*100)+'% '+labels[stat];
   if(['burn','shred','sunder'].includes(stat))return effects[stat]+value+' seconds.';
   if(effects[stat])return /^[a-zA-Z]/.test(effects[stat])?effects[stat]:(percentages.has(stat)?Math.round(value*100)+'%':value)+effects[stat];
   if(stat==='flatHP')return '+'+value+' max HP';
   if(stat==='spAttack')return '+'+value+' S.ATK';
   if(stat==='spDefense')return '+'+value+' S.DEF';
   if(stat==='armor')return '+'+value+' DEF';
   if(stat==='defense')return '+'+value+' DEF and S.DEF';
   if(stat==='health')return '+'+Math.round(value*100)+'% max HP';
   if(stat==='power')return '+'+Math.round(value*100)+'% attack power';
   if(stat==='regen')return value+' mana per second';
   if(stat==='weather')return value+' damage per second to all enemies';
   return '+'+value+(stat==='mana'?' starting mana':' defense');
  }).join(' · ');
 }
 function itemIcon(item){
  const icon=element('span',null,'tactics-item-slot');
  if(item)icon.append(tacticsItemArt(item));
  if(item){
   const type=completedItems.get(item)?.type;
   const bonuses=describeBonuses(itemBonuses(item));
   let description=item+(bonuses?' · '+bonuses:' · Fusion catalyst')+(type?' · Adds the '+type+' trait.':'');
   if(Object.hasOwn(components,item)){
    const combinations=Object.keys(components).map(partner=>{
     const [result]=recipes[recipeKey(item,partner)];
     return partner+' → '+result;
    });
    description+='\nFuses with\n'+combinations.join('\n');
   }
   const tip=element('span',description,'tactics-trait-tooltip tactics-item-tooltip');
   tip.setAttribute('aria-hidden','true');
   icon.tabIndex=0;
   icon.setAttribute('aria-label',description);
   icon.append(tip);
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
  for(const item of unit.combatItems ?? unit.items ?? []){
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
 function openTactics(){
  clearInterval(planningTimer);run=null;phase='tactics';showScreen('tactics');
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
   if(run!==current || phase!=='tactics'){clearInterval(planningTimer);return;}
   const seconds=Math.max(0,Math.ceil((current.deadline-Date.now())/1000));
   const timer=content.querySelector('.tactics-planning-clock');
   if(timer)timer.textContent=seconds+'s';
   if(seconds===0){
    clearInterval(planningTimer);
    void play();
   }
  },250);
 }
 function signatureDescription(stats){
  const skill=element('p',null,'tactics-signature-description');
  const utility=utilitySignature(stats.moveEffect);
  const effect=signatureEffectText[stats.moveEffect];
  skill.append(utility?effect:'At full mana, deals '+stats.moveType+' damage using '+(stats.moveSpecial?'S.ATK against S.DEF':'ATK against DEF')+'. '+effect);
  if(stats.manaLockMs>1000)skill.append(' Mana lock: '+(stats.manaLockMs/1000)+'s.');
  if(stats.moveEffect==='heal')return skill;
  const powers=element('span',utility?'Shield HP ':'Move Power ','tactics-signature-power');
  stats.movePowers.forEach((power,index)=>{
   if(index)powers.append(' / ');
   powers.append(index===stats.star-1?element('strong',String(power)):String(power));
  });
  skill.append(powers);
  return skill;
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
  const statRows=[
   ['ATK','attack',1,0,''],['S.ATK','specialAttack',1,0,''],
   ['DEF','defense',1,0,''],['S.DEF','specialDefense',1,0,''],
   ['Crit Chance','critChance',100,0,'%'],['Crit Damage','critDamage',100,0,'%'],
   ['ATK Speed','attackSpeed',1,2,'/s']
  ];
  for(const [label,key,scale,precision,suffix] of statRows){
   const base=(stats.baseStats[key]*scale).toFixed(precision);
   const total=(stats[key]*scale).toFixed(precision);
   const bonus=Number((Number(total)-Number(base)).toFixed(precision));
   const value=element('strong',base+suffix);
   if(bonus)value.append(element('b',(bonus>0?' + ':' − ')+Math.abs(bonus)+suffix,'tactics-stat-bonus'));
   const cell=element('span');
   cell.append(element('small',label),value);
   numbers.append(cell);
  }
  details.append(art,title,meter(stats.hp,stats.max,'HP','is-hp'),meter(stats.mana,60,'Mana','is-mana'),
   element('p',(stats.move ?? 'No signature move')+' · '+stats.roleLabel+' · Range '+stats.range),items,numbers);
  if(stats.move)numbers.before(signatureDescription(stats),element('p',stats.roleRule,'tactics-role-description'));
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
 function tacticsItemArt(item){
  const parts=Object.keys(components);
  const baseIndex=parts.indexOf(item);
  const recipe=Object.entries(recipes).find(([,entry])=>entry[0]===item);
  const oldArt=['Claw','Charm','Berry','Scale','Razor Claws','Spell Claw','Sitrus Blade','Iron Claw','Mystic Charm','Lucky Berry','Runic Scale','Berry Satchel','Berry Armor','Dragon Armor'];
  if(oldArt.includes(item)){
   const sprite=element('span',null,'tactics-item-sprite');
   sprite.style.setProperty('--item-index',String(oldArt.indexOf(item)));
   sprite.setAttribute('aria-hidden','true');
   return sprite;
  }
  const [left,right]=recipe?recipe[0].split('+').map(part=>parts.indexOf(part)):[baseIndex,baseIndex];
  const colors=['#ff8276','#91d9ff','#af8aff','#59a8ff','#b6bdcf','#f2e7b5','#ef7197','#f3bf59','#72ed9f','#e8a2fd'];
  const shape=recipe?['....oo......','...ocgo.....','..occggo....','.occlgggo...','.occcgo.....','..ooo.......']:
   ['....oo......','...ocdo.....','..oclco.....','..occco.....','...ooo......'];
  return collectionPixelArt(shape,colors[left],colors[right]);
 }
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
 const teamSize=trainer=>trainer.level+trainer.units.reduce((total,unit)=>total+
  (unit.items ?? []).reduce((sum,item)=>sum+(itemBonuses(item).teamSize ?? 0),0),0);

 function merge(trainer,name){
  for(const star of [1,2]){
   const group=trainer.units.filter(unit=>unit.name===name && unit.star===star);
   if(group.length<3)continue;
   const groupToMerge=[...group.filter(unit=>unit.position!==null),...group.filter(unit=>unit.position===null)].slice(0,3);
   const [keeper,...used]=groupToMerge;
   keeper.star++;
   const equipped=groupToMerge.flatMap(unit=>unit.items ?? []);
   keeper.items=equipped.includes('Mirage Goggles')?['Mirage Goggles']:equipped.slice(0,3);
   const retained=[...keeper.items];
   for(const item of equipped){
    const index=retained.indexOf(item);
    if(index>=0)retained.splice(index,1);
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
 function sell(trainer,unit){
  if(!trainer.units.includes(unit))return false;
  trainer.gold+=cost(unit.name)*unit.star;
  run.pool.get(unit.name).copies+=3**(unit.star-1);
  trainer.items.push(...(unit.items ?? []));
  trainer.units.splice(trainer.units.indexOf(unit),1);
  const deployed=field(trainer);
  for(const extra of deployed.slice(teamSize(trainer)))extra.position=null;
  if(run.selected===unit)run.selected=null;
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
  if(unit.position===null && !occupied && field(player).length>=teamSize(player))return;
  if(occupied)occupied.position=unit.position;
  unit.position=position;run.selected=null;render();
 }
 function traits(units){
  const counts={};
  const species=new Set(units.map(unit=>unit.name));
  const typeMembers=new Map();
  for(const unit of units){
   const types=[...dex[unit.name].slice(1,3),...(unit.items ?? []).map(item=>completedItems.get(item)?.type)];
   for(const type of types.filter(Boolean)){
    if(!typeMembers.has(type))typeMembers.set(type,new Set());
    typeMembers.get(type).add(unit.name);
   }
  }
  for(const [type,members] of typeMembers)counts[type]=members.size;
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
    if(unit.items?.length)tile.append(equippedItems(unit,true));
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
   element('span',field(player).length+' / '+teamSize(player)+' deployed'));
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
 function damageChart(report){
  const panel=element('section',null,'tactics-damage-chart');
  const controls=element('div',null,'tactics-damage-tabs');
  const rows=element('div',null,'tactics-damage-rows');
  const tabs=['Damage dealt','Damage taken'].map((label,index)=>{
   const tab=element('button',label);
   tab.type='button';
   tab.onclick=()=>{run.damageMode=index;update();};
   return tab;
  });
  const entries=report.units.filter(unit=>!unit.opponent).map(unit=>{
   const row=element('div',null,'tactics-damage-row');
   const bar=element('progress');
   bar.setAttribute('aria-label',unit.name+' damage share');
   const value=element('small');
   row.append(element('strong',unit.name+' '+'★'.repeat(unit.star)),value,bar);
   return {unit,row,value,bar};
  });
  function update(){
   const taken=Boolean(run.damageMode);
   const metric=taken?'damageTaken':'damageDealt';
   tabs.forEach((tab,index)=>tab.setAttribute('aria-pressed',String(index===Number(taken))));
   const total=entries.reduce((sum,entry)=>sum+(entry.unit[metric] ?? 0),0);
   const seconds=report.ticks*combatStepMs/1000;
   for(const {unit,value,bar} of entries){
    const amount=unit[metric] ?? 0;
    const rate=seconds>0?amount/seconds:0;
    value.textContent=amount.toLocaleString()+' damage · '+rate.toFixed(1)+(taken?' /s':' DPS');
    bar.max=total || 1;
    bar.value=amount;
   }
  }
  controls.append(...tabs);
  rows.append(...entries.map(entry=>entry.row));
  panel.append(element('h3','Your team damage'),controls,rows);
  update();
  return {panel,update};
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
  let timer=null, countdown=null;
  if(rival){
   const banner=element('header',null,'tactics-combat-banner');
   timer=element('progress');
   timer.max=100;timer.value=100;timer.setAttribute('aria-label','Combat time remaining');
   countdown=element('span',Math.ceil(combatTicks*combatStepMs/1000)+'s','tactics-combat-countdown');
   const title=element('div',null,'tactics-combat-title');
   title.append(element('strong','Combat'),countdown);
   banner.append(timer,title,element('small','Stage '+stageLabel(run.round)+' · '+rival));
   arena.append(benchView(player,true));
   middle.append(banner,arena);
   const summary=element('div',null,'tactics-combat-wallet');
   summary.append(element('span','Level '+player.level),element('strong',player.gold+' gold'));
   middle.append(summary);
  }else middle.append(stageHeader(player,run.scout?'Scouting · '+run.scout.name:neutralRound(run.round)?'Planning · Neutral round':'Planning'),arena);
  const left=element('div',null,'tactics-left-column');
  left.append(sidebar);
  if(!rival && run.damageReport)left.append(damageChart(run.damageReport).panel);
  const rankings=element('aside',null,'tactics-sidebar');
  rankings.append(heading('Standings'),standingsPanel());
  layout.append(left,middle,rankings);
  return {layout,left,middle,arena,timer,countdown};
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
    if(unit.items?.length)tile.append(equippedItems(unit,true));
   }
   bench.append(tile);
  }
  return bench;
 }
 function render(){
  const player=run.trainers[0];
  if(player.hp<=0 || run.trainers.every(t=>t===player || !t.hp)){
   content.replaceChildren(heading(player.hp?'First place':'Place '+run.place),standingsPanel(),...(run.damageReport?[damageChart(run.damageReport).panel]:[]),button('Play again',start),button('Back to Poke Fight Tactics',openTactics));
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
    if(!run.busy && sell(player,selected))render();
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
   unit.position=i<teamSize(trainer)?cells[28+(ranged?14:0)+i]:null;
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
  const bonus=Math.max(0,...[...dex[unit.name].slice(1,3),...(unit.items ?? []).map(item=>completedItems.get(item)?.type)].map(t=>(types[t] ?? 0)-1));
  const mods=itemMods(unit,trainer);
  for(const [label,group] of Object.entries(collectionTraits)){
   if(!group.members.includes(unit.name))continue;
   const tier=group.tiers.findLast(([threshold])=>types[label]>=threshold);
   if(!tier)continue;
   for(const [stat,value] of Object.entries(tier[1]))mods[stat]=(mods[stat] ?? 0)+value;

  }
  const specialist=specialists[unit.name];
  const role=specialist?'Specialist':roles.get(unit.name);
  const profile=roleProfiles[role];
  const rarity=rarities.get(unit.name) ?? 0;
  const hp=Math.round(((base[0]*4+180)*profile.hp*(1+rarity*.045)*1.65**(unit.star-1)+(mods.flatHP ?? 0))*(1+bonus*traitHealthPerAlly+(mods.health ?? 0)));
  const [move,moveType,moveSpecial]=signatures[unit.name];
  const moveEffect=personalSignatureEffects[unit.name] ?? roleSignatureEffects[role];
  const movePowers=unit.name==='Squirtle'?[150,255,450]:signaturePowerByTier[rarity];
  const attackScale=profile.attack*(1+rarity*.055)*1.5**(unit.star-1);
  const powerMultiplier=1+bonus*traitPowerPerAlly+(mods.power ?? 0);
  const stage=Number(stageLabel(run.round).split('-')[0]);
  const stageSpeed=role==='Fighter'?1+Math.min(6,stage)*.05:1;
  const attackSpeed=stageSpeed*Math.max(2.3,Math.min(5.4,(2.75+base[3]*.013)*profile.speed+rarity*.055))/attackSlowdown;
  const defenseScale=profile.defense*(1+rarity*.035)*1.13**(unit.star-1);
  const baseDefense=base[2]*defenseScale,baseSpecialDefense=base[4]*defenseScale;
  const baseStats={
   attack:(base[1]*.35+12)*attackScale,specialAttack:(base[5]*.35+12)*attackScale,
   defense:Math.round(baseDefense),specialDefense:Math.round(baseSpecialDefense),
   attackSpeed,critChance:.10,critDamage:1.5
  };
  return {...unit,...baseStats,baseStats,opponent,hp,max:hp,mana:Math.min(60,mods.mana ?? 0),role,roleLabel:(moveSpecial?'S.ATK ':'ATK ')+role,roleRule:specialist?.rule ?? profile.rule,range:profile.range,
   attack:baseStats.attack*(powerMultiplier+(mods.attackPct ?? 0)),
   specialAttack:baseStats.specialAttack*(powerMultiplier+(mods.spAttackPct ?? 0))+(mods.spAttack ?? 0),
   attackSpeed:attackSpeed*(1+(mods.speed ?? 0)),critChance:Math.min(1,baseStats.critChance+(mods.crit ?? 0)),
   critDamage:baseStats.critDamage+(mods.critDamage ?? 0),gear:mods,
   elapsed:0,gearStacks:0,attackStacks:0,critStacks:0,shield:hp*(mods.startShield ?? 0),shieldUntil:8000,
   defense:Math.round(baseDefense+(mods.defense ?? 0)+(mods.armor ?? 0)),specialDefense:Math.round(baseSpecialDefense+(mods.defense ?? 0)+(mods.spDefense ?? 0)),
   direction:opponent?0:4,move,moveType,moveSpecial,moveEffect,movePowers,wait:0,manaRegen:(specialist?.regen ?? profile.regen)+(mods.regen ?? 0),
   manaOnHit:specialist?.hit ?? profile.mana,manaOnDamage:specialist?.incoming ?? (role==='Tank'?5:0),
   manaOnTravel:specialist?.travel ?? 0,manaLock:0,manaLockMs:channeledSignatures.has(move)?1500:1000,
   guard:mods.guard,echo:mods.echo,secondWind:mods.secondWind,overcharge:mods.overcharge,momentum:mods.momentum,
   position:combatPosition(unit.position,opponent)};
 }
 const battleEffects=new WeakMap();
 function battle(a,b){
  const first=field(a),second=field(b), firstTraits=traits(first),secondTraits=traits(second);
  const build=(unit,opponent,counts,trainer)=>{
   const combatItems=unit.items?.includes('Mirage Goggles')?drawRogueChoices(standardGear,2):unit.items;
   return fighter({...unit,combatItems},opponent,counts,trainer);
  };
  const units=[...first.map(unit=>build(unit,false,firstTraits,a)),...second.map(unit=>build(unit,true,secondTraits,b))];
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
   if(unit.hp>0 && alive[source]){
    const damage=Math.min(unit.hp,effects.weather[source]);
    unit.hp-=damage;
    unit.damageTaken=(unit.damageTaken ?? 0)+damage;
   }
  }
 }
 function heal(unit,amount){
  if(unit.hp>0)unit.hp=Math.min(unit.max,unit.hp+Math.round(amount*(unit.woundUntil>unit.elapsed?.67:1)));
 }
 function gainMana(unit,amount){
  if(unit.manaLock<=0)unit.mana=Math.min(60,unit.mana+amount*(1+(unit.gear.manaRate ?? 0)));
 }
 function receiveDamage(target,damage,now=null,critical=false,source=null,periodic=false){
  if(damage<=0 || target.hp<=0)return 0;
  if(target.guard){target.guard=false;return 0;}
  if(source && !periodic && target.role==='Reaper' && target.target!==source)damage*=.85;
  if(source && !periodic)damage*=1-Math.min(.75,(target.gear.durability ?? 0)+(target.hp>target.max/2?(target.gear.healthyGuard ?? 0):0));
  damage=Math.max(1,Math.round(damage));
  if(target.signatureShieldUntil>target.elapsed && target.signatureShield>0){
   const blocked=Math.min(target.signatureShield,damage);
   target.signatureShield-=blocked;
   damage-=blocked;
  }
  if(target.shield>0){
   const blocked=Math.min(target.shield,damage);
   target.shield-=blocked;
   damage-=blocked;
  }
  const actualDamage=Math.min(target.hp,Math.ceil(damage));
  target.hp-=actualDamage;
  target.damageTaken=(target.damageTaken ?? 0)+actualDamage;
  if(source)source.damageDealt=(source.damageDealt ?? 0)+actualDamage;
  if(actualDamage && now!==null)(target.damageEvents ??= []).push({amount:actualDamage,critical,started:now});
  if(target.hp<=0 || !actualDamage)return actualDamage;
  if(target.gear.hitStack)target.gearStacks=Math.min(25,target.gearStacks+1);
  if(target.hp<=target.max/2){
   if(target.secondWind){
    target.secondWind=false;
    heal(target,target.max*.12);
   }
   if(!target.thresholdUsed){
    target.thresholdUsed=true;
    if(target.gear.thresholdGuard){target.guard=true;target.woundUntil=target.burnUntil=target.shredUntil=target.sunderUntil=0;}
    if(target.gear.thresholdShield){
     target.shield+=target.max*target.gear.thresholdShield;
     target.shieldUntil=target.elapsed+4000;
    }
    gainMana(target,target.gear.thresholdMana ?? 0);
   }
  }
  gainMana(target,target.manaOnDamage);
  return actualDamage;
 }
 function ignite(target,seconds,source){
  if(target.hp<=0)return;
  target.burnUntil=target.woundUntil=Math.max(target.burnUntil ?? 0,target.elapsed+seconds*1000);
  target.nextBurn ??= target.elapsed+1000;
  target.burnSource=source;
 }
 function updateGear(unit,units,now){
  unit.elapsed+=combatStepMs;
  const elapsed=unit.elapsed;
  if(elapsed>=unit.shieldUntil)unit.shield=0;
  if(unit.critUntil<=elapsed)unit.critStacks=0;
  if(unit.nextBurn!==undefined && elapsed>=unit.nextBurn){
   if(unit.burnUntil>=elapsed){
    receiveDamage(unit,Math.max(1,Math.round(unit.max*.01)),now,false,unit.burnSource,true);
    unit.nextBurn+=1000;
   }else unit.nextBurn=undefined;
  }
  const previous=elapsed-combatStepMs;
  if(Math.floor(previous/1000)!==Math.floor(elapsed/1000))heal(unit,(unit.max-unit.hp)*(unit.gear.missingHeal ?? 0));
  if(Math.floor(previous/2000)!==Math.floor(elapsed/2000)){
   heal(unit,unit.max*(unit.gear.maxHeal ?? 0));
   if(unit.gear.burnAura){
    const victim=units.find(other=>other.opponent!==unit.opponent && other.hp>0 && distance(unit.position,other.position)<=2);
    if(victim)ignite(victim,10,unit);
   }
  }
 }
 function gearHit(unit,target,units,dealt,cast,critical,now){
  const gear=unit.gear;
  if(gear.hitStack)unit.gearStacks=Math.min(25,unit.gearStacks+1);
  if(gear.attackStack && !cast)unit.attackStacks=Math.min(15,unit.attackStacks+1);
  if(gear.critAmp && critical){unit.critStacks++;unit.critUntil=unit.elapsed+5000;}
  if(gear.burn)ignite(target,gear.burn,unit);
  if(gear.shred)target.shredUntil=target.elapsed+gear.shred*1000;
  if(gear.sunder)target.sunderUntil=target.elapsed+gear.sunder*1000;
  heal(unit,dealt*((gear.vamp ?? 0)+(gear.stance && unit.hp<=unit.max/2?.20:0)));
  if(gear.allyHeal){
   const ally=units.filter(other=>other.opponent===unit.opponent && other.hp>0).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];
   if(ally)heal(ally,dealt*gear.allyHeal);
  }
  if(!cast && target.hp>0 && target.gear.retaliate && (target.retaliateAfter ?? 0)<=target.elapsed &&
     distance(unit.position,target.position)<=1.5){
   target.retaliateAfter=target.elapsed+2000;
   receiveDamage(unit,target.gear.retaliate,now,false,target);
  }
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
   return multiplier*(factor>1?1.5:factor || 1);
  },1);
 }
 function chooseTarget(unit,units){
  const targets=units.filter(other=>other.hp>0 && other.opponent!==unit.opponent);
  const isBackline=target=>target.role==='Carry' || target.role==='Caster';
  return targets.sort((a,b)=>
   (unit.role==='Reaper'?Number(isBackline(b))-Number(isBackline(a)):0) ||
   distance(unit.position,a.position)-distance(unit.position,b.position) ||
   Number(b.role==='Tank')-Number(a.role==='Tank') || a.hp-b.hp)[0];
 }
 function applySignature(unit,target,units,damage,now){
  const star=unit.star-1;
  const allies=units.filter(other=>other.hp>0 && other.opponent===unit.opponent);
  if(unit.moveEffect==='teamShield' || unit.moveEffect==='shield'){
   const team=unit.moveEffect==='teamShield';
   for(const ally of team?allies:[unit]){
    const amount=team?unit.movePowers[star]:Math.round(unit.max*[.2,.3,.45][star]);
    ally.signatureShield=Math.max(ally.signatureShieldUntil>ally.elapsed?ally.signatureShield:0,amount);
    ally.signatureShieldUntil=ally.elapsed+5000;
   }
  }
  if(unit.moveEffect==='heal'){
   allies.sort((a,b)=>a.hp/a.max-b.hp/b.max).slice(0,2).forEach(ally=>heal(ally,ally.max*[.10,.16,.25][star]));
  }
  if(unit.moveEffect==='rally')unit.rallyUntil=unit.elapsed+5000;
  if(unit.moveEffect==='snare')target.wait=Math.max(0,target.wait)+[500,750,1000][star];
  if(unit.moveEffect==='weaken'){
   target.weakenUntil=target.elapsed+4000;
   target.weakenAmount=[.15,.25,.35][star];
  }
  if(unit.moveEffect==='volley'){
   const victim=units.filter(other=>other!==target && other.hp>0 && other.opponent!==unit.opponent &&
    distance(target.position,other.position)<=2).sort((a,b)=>distance(a.position,target.position)-distance(b.position,target.position))[0];
   if(victim)receiveDamage(victim,damage*[.30,.45,.60][star],now,false,unit);
  }
 }
 function tick(units,now=null){
  tickWeather(units);
  for(const unit of units)if(unit.hp>0)updateGear(unit,units,now);
  for(const unit of units)if(unit.hp>0)unit.target=chooseTarget(unit,units);
  for(const unit of units){
   if(unit.hp<=0)continue;
   unit.manaLock=Math.max(0,unit.manaLock-combatStepMs);
   gainMana(unit,unit.manaRegen*combatStepMs/1000);
   const target=unit.target;
   if(!target || target.hp<=0)continue;
   unit.wait=Math.max(-combatStepMs,unit.wait-combatStepMs);
   if(unit.wait>0)continue;
   const gap=distance(unit.position,target.position);
   const cast=unit.manaLock===0 && unit.mana>=60 && unit.move;
   const utility=cast && utilitySignature(unit.moveEffect);
   if(gap>unit.range && !utility){
    const step=nextStep(unit,target,units);
    if(step){
     if(now!==null)setBattlerMotion(unit,step,'walk',now);
     if(now!==null){unit.moveFrom=unit.position;unit.moveStarted=now;}
     unit.position=step;
     gainMana(unit,unit.manaOnTravel);
    }
    continue;
   }
   const type=cast?unit.moveType:dex[unit.name][1];
   const match=elementalMultiplier(type,dex[target.name].slice(1,3));
   const special=cast?unit.moveSpecial:unit.role==='Carry' && unit.moveSpecial;
   const gear=unit.gear;
   const stackBonus=unit.gearStacks*(gear.hitStack ?? 0);
   const stance=gear.stance && unit.hp>unit.max/2?.2:0;
   const offense=special?(unit.specialAttack+Math.floor(unit.elapsed/5000)*(gear.rampPower ?? 0))*(1+stackBonus+stance):
    unit.attack*(1+stackBonus+stance+unit.attackStacks*(gear.attackStack ?? 0));
   const aura=special?'shredAura':'sunderAura';
   const defenseDown=(special?target.shredUntil:target.sunderUntil)>target.elapsed ||
    units.some(other=>other.hp>0 && other.opponent===unit.opponent && other.gear[aura] && distance(target.position,other.position)<=2);
   const focus=target.gear.focusArmor?units.filter(other=>other.hp>0 && other.target===target).length*target.gear.focusArmor:0;
   const defense=((special?target.specialDefense:target.defense)+focus)*(defenseDown?.7:1);
   const critical=Math.random()<unit.critChance?unit.critDamage:1;
   const amp=1+(gear.amp ?? 0)+unit.critStacks*(gear.critAmp ?? 0)+(target.role==='Tank'?(gear.tankAmp ?? 0):0);
   const execute=cast && unit.moveEffect==='execute' && target.hp<target.max/2?1+[.25,.40,.60][unit.star-1]:1;
   const weaken=unit.weakenUntil>unit.elapsed?1-unit.weakenAmount:1;
   const damage=utility?0:Math.max(1,Math.round(execute*weaken*combatDamageScale*offense*(cast?1.8+unit.movePowers[unit.star-1]/120:1)*match*critical*amp*100/(100+defense)));
   if(now!==null){
    setBattlerMotion(unit,target.position,cast?'cast':unit.range>1?'attack':'lunge',now);
    if(cast)unit.lastCast={started:now,move:unit.move,from:unit.position,to:utility?unit.position:target.position};
    if(!utility && (!target.animation || now-target.animation.started>=target.animation.duration || target.animation.motion==='walk'))
     setBattlerMotion(target,unit.position,'hit',now);
   }
   let dealt=receiveDamage(target,damage,now,critical>1,unit);
   if(cast && !utility && unit.echo){
    unit.echo=false;
    dealt+=receiveDamage(target,Math.max(1,Math.round(damage*.35)),now,critical>1,unit);
   }
   if(!utility)gearHit(unit,target,units,dealt,cast,critical>1,now);
   if(cast)applySignature(unit,target,units,damage,now);
   if(target.hp<=0 && unit.momentum)heal(unit,unit.max*.08);
   if(cast){
    unit.mana=unit.overcharge?10:0;
    unit.overcharge=false;
    unit.manaLock=unit.manaLockMs;
   }else gainMana(unit,unit.manaOnHit+(gear.hitMana ?? 0)+(critical>1?(gear.critMana ?? 0):0));
   const rally=unit.rallyUntil>unit.elapsed?[.15,.25,.40][unit.star-1]:0;
   unit.wait+=1000/(unit.attackSpeed*(1+rally+Math.floor(unit.elapsed/1000)*(gear.rampSpeed ?? 0)));
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
 function equippedItems(unit,onTile=false){
  const row=element('div',null,'tactics-live-items'+(onTile?' tactics-placement-items':''));
  row.append(...unit.items.map(itemIcon));
  return row;
 }
 function paintSignatureEffects(canvas,units,now){
  const width=canvas.clientWidth,height=canvas.clientHeight;
  if(!width || !height)return;
  if(canvas.width!==width)canvas.width=width;
  if(canvas.height!==height)canvas.height=height;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,width,height);
  for(const unit of units){
   const cast=unit.lastCast;
   if(!cast)continue;
   const time=(now-cast.started)/620;
   if(time<0 || time>=1)continue;
   const x=point=>width*(.12+point.x/6.5*.76);
   const y=point=>height*(.09+point.y/5.95*.82);
   const seed=Array.from(cast.move).reduce((sum,char)=>sum*31+char.charCodeAt(0)>>>0,0);
   const travel=Math.min(1,time*2.5);
   const burst=Math.max(0,(time-.4)/.6);
   const color=signatureColors[unit.moveType];
   const radius=(16+unit.star*9)*burst;
   ctx.fillStyle=color;
   ctx.shadowColor=color;
   ctx.shadowBlur=7;
   ctx.globalAlpha=1-time;
   for(let i=0;i<8+unit.star*4;i++){
    const angle=i*2.4+(seed%360)*Math.PI/180;
    const distance=radius*(.45+.55*((i*13+seed)%11)/10);
    const offset=(1-travel)*Math.sin(angle)*(3+seed%8);
    const px=x(cast.from)+(x(cast.to)-x(cast.from))*travel+Math.cos(angle)*distance;
    const py=y(cast.from)+(y(cast.to)-y(cast.from))*travel+Math.sin(angle)*distance+offset;
    const size=2+(i+seed)%4;
    ctx.fillRect(Math.round(px),Math.round(py),size,size);
   }
  }
  ctx.globalAlpha=1;
 }
 function combatLayer(units){
  const layer=element('div',null,'tactics-combat-space');
  const effects=element('canvas',null,'tactics-signature-effects');
  effects.setAttribute('aria-hidden','true');
  const damageLayer=element('div',null,'tactics-damage-layer');
  const damageLabels=new Map();
  const views=units.map(unit=>{
   const node=element('div',null,'tactics-live-unit'+(unit.opponent?' is-opponent':''));
   const bars=element('div',null,'tactics-live-bars');
   const hp=element('progress'),mana=element('progress');
   hp.max=unit.max;mana.max=60;
   hp.value=unit.hp;mana.value=unit.mana;
   hp.setAttribute('aria-label',unit.name+' health');
   mana.setAttribute('aria-label',unit.name+' mana');
   bars.append(hp,mana);
   if(unit.combatItems?.length)node.append(equippedItems({...unit,items:unit.combatItems}));
   const bubble=element('span',null,'tactics-cast-bubble');
   bubble.hidden=true;
   node.append(bars,battlerSprite(unit),element('span','★'.repeat(unit.star),'tactics-combat-stars'),bubble);
   unitControls(node,unit,false);
   layer.append(node);
   return {unit,node,hp,mana,bubble};
  });
  layer.append(effects,damageLayer);
  let lastPaint=performance.now();
  function easeMeter(meter,target,weight){
   const difference=target-meter.value;
   meter.value=Math.abs(difference)<.1?target:meter.value+difference*weight;
  }
  function paint(now){
   const weight=1-Math.exp(-Math.max(0,now-lastPaint)/55);
   lastPaint=now;
   paintSignatureEffects(effects,units,now);
   const visibleDamage=new Set();
   for(const unit of units){
    if(!unit.damageEvents)continue;
    unit.damageEvents=unit.damageEvents.filter(event=>now-event.started<850);
    for(const [index,event] of unit.damageEvents.entries()){
     visibleDamage.add(event);
     let label=damageLabels.get(event);
     if(!label){
      label=element('span',String(event.amount),'tactics-damage-number'+(event.critical?' is-critical':''));
      damageLabels.set(event,label);
      damageLayer.append(label);
     }
     const progress=Math.max(0,(now-event.started)/850);
     placeOnField(label,unit.position.x+(index%3-1)*.22,unit.position.y-.3-progress*.8);
     label.style.opacity=String(Math.min(1,(1-progress)*3));
    }
   }
   for(const [event,label] of damageLabels){
    if(visibleDamage.has(event))continue;
    label.remove();
    damageLabels.delete(event);
   }
   for(const {unit,node,hp,mana,bubble} of views){
    easeMeter(hp,unit.hp,weight);
    easeMeter(mana,unit.mana,weight);
    if(unit.hp<=0 && hp.value===0){node.hidden=true;continue;}
    const at=unit.position,from=unit.moveFrom ?? at;
    const progress=Math.min(1,Math.max(0,(now-(unit.moveStarted ?? now))/combatStepMs));
    const x=from.x+(at.x-from.x)*progress,y=from.y+(at.y-from.y)*progress;
    placeOnField(node,x,y);
    node.style.zIndex=String(1+Math.floor(y*10));
    const cast=unit.lastCast;
    const casting=Boolean(cast && now-cast.started<950);
    bubble.hidden=!casting;
    if(casting && bubble.textContent!==cast.move)bubble.textContent=cast.move;
    node.classList.toggle('is-shielded',unit.signatureShieldUntil>unit.elapsed && unit.signatureShield>0);
    node.classList.toggle('is-casting',Boolean(cast && now-cast.started<380));
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
   const match={a,b,units:battle(a,b),mirror,sign:null,ticks:0};
   match.sign=outcome(match.units);
   matches.push(match);
  };
  addMatch(player,rival);
  if(neutral)for(const trainer of opponents)addMatch(trainer,rival);
  else {
   for(let i=0;i+1<opponents.length;i+=2)addMatch(opponents[i],opponents[i+1]);
   if(opponents.length%2)addMatch(opponents.at(-1),ghost,true);
  }
  let watched, watchedTrainer, view, timer, countdown, chart, frame=0;
  run.spectate=trainer=>{
   const match=matches.find(entry=>entry.a===trainer || entry.b===trainer);
   if(!match || match===watched && trainer===watchedTrainer)return;
   watched=match;watchedTrainer=trainer;
   const opponent=match.b.name ?? 'Mirror team';
   const battleView=battleLayout(match.a,match.units,match.a.name+' vs '+opponent,trainer);
   timer=battleView.timer;
   countdown=battleView.countdown;
   view=combatLayer(match.units);
   battleView.arena.insertBefore(view.layer,battleView.arena.querySelector('.tactics-bench'));
   chart=damageChart(matches[0]);
   battleView.left.append(chart.panel);
   content.replaceChildren(battleView.layout);
  };
  run.spectate(player);
  const animate=now=>{
   if(run!==current || !current.busy || phase!=='tactics')return;
   view.paint(now);
   requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
  for(;frame<combatTicks && matches.some(match=>match.sign===null);frame++){
   await new Promise(resolve=>setTimeout(resolve,combatStepMs));
   if(run!==current || phase!=='tactics')return;
   for(const match of matches)if(match.sign===null){
    tick(match.units,performance.now());
    match.ticks++;
    match.sign=outcome(match.units);
   }
   chart.update();
   timer.value=100*(1-(frame+1)/combatTicks);
   countdown.textContent=Math.ceil((combatTicks-frame-1)*combatStepMs/1000)+'s';
   timer.title=matches.filter(match=>match.sign===null).length+' battles still in progress';
  }
  const lastVisibleCast=Math.max(0,...(watched?.units ?? []).map(unit=>unit.lastCast?.started ?? 0));
  const remainingEffect=lastVisibleCast+620-performance.now();
  if(remainingEffect>0)await new Promise(resolve=>setTimeout(resolve,remainingEffect));
  if(run!==current || phase!=='tactics')return;
  run.damageReport=matches[0];
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
  if(!player.hp || run.trainers.filter(t=>t.hp>0).length<=1)recordBattlePass({battles:1,wins:player.hp>0?1:0});
  run.round++;
  for(const trainer of run.trainers)if(trainer.hp)roll(trainer);
  run.result=sign>0?'Victory against '+rival.name:sign<0?'Defeat against '+rival.name:'Draw against '+rival.name;
  run.selected=null;run.busy=false;run.spectate=null;beginChoices();
  if(run.choice || !player.hp || run.trainers.filter(t=>t.hp>0).length<=1)render();
  else startPlanning();
  void checkGameVersion();
 }
 byId('home-tactics').onclick=openTactics;
 byId('tactics-back').onclick=()=>{clearInterval(planningTimer);run=null;openMenu();};
})();
