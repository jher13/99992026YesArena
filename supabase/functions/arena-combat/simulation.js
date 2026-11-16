// The build script appends this adapter inside the Gym engine's scope.
let onlineRandomState=0;
let onlineSounds=[];
let onlineRecalls={};
function onlineRandom() {
 onlineRandomState=(Math.imul(1664525,onlineRandomState)+1013904223)>>>0;
 return onlineRandomState/4294967296;
}
function onlineActor(name,entries,side,index,bossLevel,levelOverride,raid=null,copy=null,pvpRoster=null) {
 if(!isAvailablePokemon(name)) throw Error('A Pokémon in this team is unavailable.');
 const progress=JSON.parse(entries['pokemon-arena-wild-progress'] ?? '{}') ?? {};
 const starter=JSON.parse(entries['pokemon-arena-starter'] ?? '{}') ?? {};
 const profileData=JSON.parse(entries['pokemon-arena-profiles'] ?? '{}') ?? {};
 let profile=copy?.profile ?? profileData[dex[name][0]];
 if(raid) {
  const traitOrder=[0,1,2,3,5,4];
  let pid=natureNames.indexOf(raid.nature);
  while(traitOrder[pid%traitOrder.length]!==raid.trait)pid+=natureNames.length;
  profile={ivs:Array(6).fill(31),evs:[...raid.evs],pid,abilityOverride:raid.ability};
 }
 const savedLevel=progress.owned?.[name]?.level;
 const level=levelOverride ?? bossLevel ?? (Number.isInteger(savedLevel)?clamp(savedLevel,1,100):name===starter.name?1:5);
 const fallback={ivs:Array(6).fill(bossLevel?23:0),evs:Array(6).fill(0),pid:0};
 savedMoves=JSON.parse(entries['pokemon-arena-moves'] ?? '{}') ?? {};
 delete loadouts[name];
 const moves=raid?legalLoadout(name,raid.moves,8):bossLevel?wildMoves(name):copy?legalLoadout(name,copy.moves ?? []):movesFor(name);
 const actor=unit(name,0,0,side!=='boss',level,{profile:validProfile(profile)?profile:fallback,moves});
 const held=progress.held?.[name];
 const equipped=Object.entries(progress.held ?? {}).filter(([,item])=>item===held).map(([holder])=>holder);
 actor.heldItem=pvpRoster?pvpLoanerFor(name,pvpRoster,progress.pvpLoaners):
  Object.hasOwn(heldItems,held) && equipped.indexOf(name)>=0 && equipped.indexOf(name)<(progress.items?.[held] ?? 0)?held:null;
 if(!bossLevel)actor.ai=normalizeBattleAI(progress.ai?.[name]);
 actor.normalAttacksEnabled=true;
 actor.onlineId=side+':'+index;
 actor.side=side;
 actor.revealed=false;
 return actor;
}
function placeOnline(slot,actor) {
 slot.transition=startSwitch(slot.actor,actor);
 slot.transition.incoming.y=slot.y;
 if(slot.transition.stage==='send')actor.revealed=true;
}
function isCoopMode(mode) {return mode==='coop' || mode==='coop_gigantamax' || Object.hasOwn(megaRaidTiers,mode);}
const raidFormRoster={
 coop_mega:['Gengar','Charizard','Lucario','Gardevoir','Tyranitar','Rayquaza'],
 coop_gigantamax:['Charizard','Gengar','Lapras','Snorlax','Machamp','Corviknight'],
};
function initializeOnline(match) {
 const levelOverride=match.mode==='free_fight'?100:undefined;
 const pvp=['ranked','unranked','free_fight'].includes(match.mode);
 const host=(match.host_pick ?? []).map((name,i)=>onlineActor(name,match.host_entries,'host',i,undefined,levelOverride,null,null,pvp?match.host_pick:null));
 const guest=(match.guest_pick ?? []).map((name,i)=>onlineActor(name,match.guest_entries,'guest',i,undefined,levelOverride,null,null,pvp?match.guest_pick:null));
 const coop=isCoopMode(match.mode);
 const raidTeam=match.raid_seats?.flatMap((seat,index)=>{
  if(!seat?.pokemon)return [];
  const side=seat.substitute || seat.uid===match.host?'host':'raid:'+seat.uid;
  return [onlineActor(seat.pokemon,seat.entries,side,index,undefined,undefined,null,seat.copy_data)];
 });
 const fighters=raidTeam ?? [...host,...guest];
 const bossLevel=Math.min(100,Math.ceil(Math.max(...fighters.map(a=>a.level))*1.1)+2);
 const raid=Object.hasOwn(megaRaidTiers,match.mode)?megaRaidTiers[match.mode]:null;
 setArenaDimensions(raid?megaRaidArenaSize:undefined);
 const forms=raidFormRoster[match.mode];
 const guardians=forms ?? ['Onix','Steelix','Golem','Aggron','Tyranitar','Rhyperior'];
 const boss=coop?Array.from({length:raid?1:match.format*2},(_,i)=>{
  const actor=onlineActor(raid?.species ?? guardians[i],{},'boss',i,raid?.level ?? bossLevel,undefined,raid);
  if(raid) {
   actor.raidForm=raid.name;
   actor.hp=actor.max=actor.stats[0]=raid.hp;
   actor.raidSecondary=raid.secondary;
   for(const stat of [1,2,4,5])actor.stats[stat]=Math.round(actor.stats[stat]*(1+raid.tier*0.12));
   return actor;
  }
  if(forms) {
   const mega=match.mode==='coop_mega';
   actor.raidForm=mega?(actor.name==='Charizard'?'Mega Charizard X':'Mega '+actor.name):'Gigantamax '+actor.name;
   actor.max=Math.round(actor.max*(mega?1.35:1.85));
   actor.hp=actor.max;
   actor.stats[0]=actor.max;
   if(mega)for(const stat of [1,2,4,5])actor.stats[stat]=Math.round(actor.stats[stat]*1.2);
  }
  return actor;
 }):[];
 allies=coop?fighters:host;
 enemies=coop?boss:guest;
 for(const actor of enemies) actor.friendly=false;
 const leads=raidTeam ?? (coop?[...host.slice(0,match.format),...guest.slice(0,match.format)]:host.slice(0,match.format));
 trainerFields=[leads,enemies.slice(0,match.format)].map(leads=>
   leads.map((actor,i)=>{
    const slot={actor:null,owner:actor.side,y:canvas.height/2+(i-(leads.length-1)/2)*Math.min(112,(canvas.height-110)/leads.length)};
    placeOnline(slot,actor);
    return slot;
   }));
 damageBuckets=[];
 entryHazards=[{},{}];
 fieldMoveExpiry={};
 clock=lastDamageClock=weatherTime=terrainTime=recallCooldown=0;
 battleWeather=battleTerrain=null;
 effects=[];pendingCasts=[];onlineSounds=[];onlineRecalls={};
 onlineRandomState=Number.parseInt(match.id.slice(0,8),16)>>>0;
 arenaMap=raid?megaRaidArena(raid):randomArenaMap();
}
const actorReferences=['ailmentSource','lastDamageBy'];
function saveOnlineState() {
 const encodeActor=actor=>({...actor,...Object.fromEntries(actorReferences.map(key=>[key,actor[key]?.onlineId ?? null]))});
 return {
  allies:allies.map(encodeActor),enemies:enemies.map(encodeActor),
  fields:trainerFields.map(slots=>slots.map(slot=>({...slot,actor:slot.actor?.onlineId ?? null,
   transition:slot.transition?{...slot.transition,outgoing:slot.transition.outgoing?.onlineId ?? null,
    incoming:slot.transition.incoming.onlineId}:null}))),
  casts:pendingCasts.map(cast=>({...cast,actor:cast.actor.onlineId})),effects,
  clock,lastDamageClock,battleWeather,weatherTime,battleTerrain,terrainTime,
  arenaMap,damageBuckets,entryHazards,fieldMoveExpiry,recalls:onlineRecalls,random:onlineRandomState,sounds:onlineSounds,
 };
}
function loadOnlineState(state) {
 ({allies,enemies,effects,clock,lastDamageClock,battleWeather,weatherTime,battleTerrain,terrainTime}=state);
 arenaMap=state.arenaMap ?? null;
 setArenaDimensions(arenaMap ?? undefined);
 fieldMoveExpiry=state.fieldMoveExpiry ?? {};
 entryHazards=state.entryHazards ?? [{},{}];
 damageBuckets=state.damageBuckets ?? [];
 onlineRecalls=state.recalls;
 onlineSounds=state.sounds ?? [];
 onlineRandomState=state.random;
 const actors=new Map([...allies,...enemies].map(actor=>[actor.onlineId,actor]));
 const resolve=id=>actors.get(id) ?? null;
 for(const actor of actors.values())for(const key of actorReferences)actor[key]=resolve(actor[key]);
 trainerFields=state.fields.map(slots=>slots.map(slot=>({...slot,actor:resolve(slot.actor),
  transition:slot.transition?{...slot.transition,outgoing:resolve(slot.transition.outgoing),
   incoming:resolve(slot.transition.incoming)}:null})));
 pendingCasts=state.casts.map(cast=>({...cast,actor:resolve(cast.actor)}));
}
function onlineSend(side,incomingId,fieldIndex) {
 const slots=trainerFields.flat().filter(slot=>slot.owner===side);
 const slot=slots[fieldIndex];
 const incoming=[...allies,...enemies].find(actor=>actor.onlineId===incomingId && actor.side===side && actor.hp>0);
 if(!slot || slot.transition || !incoming || trainerFields.flat().some(field=>trainerOnField(incoming,[field])))
  throw Error('Choose an available reserve and field slot.');
 if(slot.actor?.hp>0 && blocksExhaustionRecall(slot.actor))throw Error('This Pokémon is exhausted.');
 if(slot.actor?.hp>0 && !arenaDefenseTypes(slot.actor).includes('Ghost') &&
    enemies.some(actor=>actor.raidForm==='Mega Gengar' && actor.hp>0 && fieldActors().includes(actor) &&
     activeAbility(actor)==='Shadow Tag'))throw Error('Mega Gengar’s Shadow Tag prevents recalls.');
 if(slot.actor?.hp>0 && fieldMoveActive('Fairy Lock'))throw Error('Fairy Lock prevents recalls.');
 if(slot.actor?.hp>0 && (slot.actor.trappedUntil>clock || slot.actor.octolockUntil>clock))throw Error('This Pokémon is trapped.');
 if(slot.actor?.hp>0 && slot.actor.ingrainAt)throw Error('This Pokémon is rooted by Ingrain.');
 if(slot.actor?.hp>0 && (onlineRecalls[side] ?? 0)>clock) throw Error('Recall is on cooldown.');
 placeOnline(slot,incoming);
 if(slot.transition.stage==='recall')onlineRecalls[side]=clock+recallDelay+ballDuration;
}
function onlineFrame(dt,raid=false) {
 refreshBerriesAfterKnockout();
 for(const slots of trainerFields)for(const slot of slots) {
  const transition=slot.transition;
  if(!transition)continue;
  const recalling=transition.stage==='recall';
  if(stepSwitch(transition,dt,dt)) {
   slot.actor=transition.incoming;
   slot.actor.entryPending=true;
   slot.transition=null;
  } else if(recalling && transition.stage==='send') {
   transition.incoming.revealed=true;
   if(!transition.forced && !transition.outgoing.friendly)restoreOpponentTeam(allies);
  }
 }
 const sides=combatSides();
 if(sides.some(side=>!side.length))lastDamageClock+=dt;
 advanceCombat(dt,dt,sides);
 refreshBerriesAfterKnockout();
 // Co-op guardians replace themselves. PvP players choose their reserves.
 for(const slot of trainerFields[1]) {
  if(slot.owner!=='boss' || slot.transition || slot.actor?.hp>0)continue;
  const reserve=enemies.find(actor=>actor.hp>0 && !trainerOnField(actor,trainerFields[1]));
  if(reserve)placeOnline(slot,reserve);
 }
 onlineSounds=onlineSounds.filter(sound=>clock-sound.clock<1);
 for(const effect of effects)effect.life-=dt;
 effects=effects.filter(effect=>effect.life>0);
 const a=allies.some(actor=>actor.hp>0);
 const b=enemies.some(actor=>actor.hp>0);
 if(!a || !b)return a?'host':b?'guest':'draw';
 if(raid)return clock>=raidTimeLimit-1e-8?'guest':null;
 if(clock>=battleTimeLimit-1e-8) {
  const result=compareTeamHP(allies,enemies);
  return result>0?'host':result<0?'guest':'draw';
 }
 return null;
}
export function simulateOnline(match,state,steps,command,side) {
 onlineSounds=[];
 if(state)loadOnlineState(state);else initializeOnline(match);
 if(typeof command?.normalAttacks==='boolean') {
  for(const actor of [...allies,...enemies])if(actor.side===side)actor.normalAttacksEnabled=command.normalAttacks;
 } else if(command?.ai) {
  const {actor:id,target,position,style}=command.ai;
  const team=side==='host'?allies:enemies;
  const opposing=side==='host'?enemies:allies;
  const actor=team.find(member=>member.onlineId===id && member.side===side && member.hp>0);
  if(!actor || isCoopMode(match.mode))throw Error('Choose a healthy Pokémon on your side.');
  if(position!==undefined && !Object.hasOwn(battlePositions,position))throw Error('Invalid position.');
  if(style!==undefined && !['Aggressive','Balanced','Defensive'].includes(style))throw Error('Invalid style.');
  if(target!==undefined && !opposing.some(member=>member.onlineId===target && member.revealed && member.hp>0))
   throw Error('Choose a revealed opponent.');
  actor.ai=normalizeBattleAI({...actor.ai,...(position!==undefined?{position}:{}),...(style!==undefined?{style}:{})});
  if(target!==undefined)actor.manualTarget=target;
 } else if(command)onlineSend(side,command.incoming,command.slot);
 let result=null;
 for(let i=0;i<steps && !result;i++)result=onlineFrame(1/60,isCoopMode(match.mode));
 if(isCoopMode(match.mode) && result && result!=='draw')result=result==='host'?'coop_win':'coop_loss';
 return {state:saveOnlineState(),result};
}
function compactOnlineDamage(buckets) {
 const aggregate={dealt:{},taken:{}};
 for(const bucket of buckets ?? [])for(const kind of ['dealt','taken']) {
  for(const [id,entry] of Object.entries(bucket[kind] ?? {})) {
   const row=aggregate[kind][id] ??= {...entry,damage:0};
   row.damage+=entry.damage;
  }
 }
 return [aggregate];
}
export function onlineView(state,side,mode) {
 const allowed=actor=>actor.side===side || actor.revealed;
 const visible=[...state.allies,...state.enemies].filter(allowed).map(actor=>{
  const {name,side,onlineId,hp,max,level,ability,heldItem,moves,moveCooldowns,moveTimers,x,y,
   friendly,direction,facing,gait,motionTicks,stride,attack,attackStyle,attackSpan,attackX,attackY,
   hit,hitSpan,hitX,hitY,moveLabel,labelTime,fieldTime,ailment,stages,exhaustion,exhaustedUntil,raidForm,raidSecondary}=actor;
  return {name,side,onlineId,hp,max,level:mode==='free_fight'?100:level,ability,heldItem,moves,moveCooldowns,moveTimers,x,y,
   friendly,direction,facing,gait,motionTicks,stride,attack,attackStyle,attackSpan,attackX,attackY,
   hit,hitSpan,hitX,hitY,moveLabel,labelTime,fieldTime,ailment,stages,exhaustion,exhaustedUntil,raidForm,raidSecondary};
 });
 const ids=new Set(visible.map(actor=>actor.onlineId));
 const fields=state.fields.map(slots=>slots.map(slot=>{
  const transition=slot.transition;
  if(!transition || ids.has(transition.incoming))return slot;
  return {...slot,transition:{...transition,incoming:null}};
 }));
 return {actors:visible,fields,arenaMap:state.arenaMap ?? null,damageBuckets:compactOnlineDamage(state.damageBuckets),casts:state.casts,effects:state.effects,
  weather:state.battleWeather,weatherTime:state.weatherTime,terrain:state.battleTerrain,clock:state.clock,
  normalAttacks:[...state.allies,...state.enemies].find(actor=>actor.side===side)?.normalAttacksEnabled ?? true,
  recall:Math.max(0,(state.recalls[side] ?? 0)-state.clock),sounds:state.sounds};
}
