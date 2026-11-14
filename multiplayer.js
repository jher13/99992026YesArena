(() => {
 const isCoop=mode=>mode==='coop' || mode==='coop_gigantamax' || Object.hasOwn(megaRaidTiers,mode);
 const dialog=byId('home-dialog');
 let generation=0, timer, active;
 let arenaActors=new Map(), rosterRows=new Map(), displayedTurn=-1, recallSlotOnline=null;
 let frameAge=0, playbackClock=null, playbackDelay=0.25, snapshotArrival=0, arrivalGaps=[], visualSnapshots=[], soundsPlayed=new Set(), battleSnapshot=null;
 const commands={Attack:'a',Select:'s',Ranged:'r',Backline:'d',Melee:'m','Mid-Range':'c',Auto:'z',
  Aggressive:'q',Balanced:'w',Defensive:'e'};
 for(let i=1;i<=6;i++){commands['Ally '+i]=String(i);commands['Enemy '+i]='ctrl+'+i;}
 const keyStorage='pokemon-arena-pvp-keys';
 let bindings={...commands};
 try {bindings={...commands,...JSON.parse(playerStorage.getItem(keyStorage) ?? '{}')};}catch {}
 let selectedUnit=null, commandMode=null, commandSend=null;
 const keyName=event=>(event.ctrlKey?'ctrl+':'')+(event.altKey?'alt+':'')+
  (event.shiftKey?'shift+':'')+(event.metaKey?'meta+':'')+event.key.toLowerCase();
 function editPvpKeys() {
  const rows=Object.keys(commands).map(action=>{
   const label=element('div',null,'hotkey-setting-row');
   const name=action==='Select'?'Quick swap':action;
   label.append(element('span',name));
   const key=element('button',bindings[action]);
   key.type='button';
   key.setAttribute('aria-label',name+' key: '+bindings[action]);
   key.onclick=()=>{
    key.focus();
    key.textContent='Press a key…';
    key.onkeydown=event=>{
     if(['Control','Alt','Shift','Meta','Escape'].includes(event.key))return;
     event.preventDefault();event.stopPropagation();
     const value=keyName(event);
     if(Object.keys(bindings).some(other=>other!==action && bindings[other]===value)){
      key.textContent='Already assigned';return;
     }
     bindings[action]=value;
     playerStorage.setItem(keyStorage,JSON.stringify(bindings));
     key.textContent=value;
     key.setAttribute('aria-label',name+' key: '+value);
     key.onkeydown=null;
    };
   };
   key.onblur=()=>{key.onkeydown=null;key.textContent=bindings[action];};
   label.append(key);
   return label;
  });
  const reset=button('Reset defaults',()=>{
   bindings={...commands};playerStorage.setItem(keyStorage,JSON.stringify(bindings));editPvpKeys();
  });
  show('Hotkey Settings',...rows,reset);
 }
 function chooseBattleUnit(actor) {
  if(!commandSend)return;
  if(actor.hp<=0)return;
  if(commandMode==='Attack' && actor.side!==active.side && selectedUnit) {
   commandMode=null;
   updateOnlineRoster(commandSend);
   commandSend({ai:{actor:selectedUnit,target:actor.onlineId}});
   return;
  }
  if(actor.side!==active.side || commandMode==='Attack')return;
  const slots=trainerFields.flat().filter(slot=>slot.owner===active.side);
  const fieldIndex=slots.findIndex(slot=>trainerOnField(actor,[slot]));
  if(!commandMode && fieldIndex>=0 && !slots[fieldIndex].transition) {
   selectedUnit=actor.onlineId;
   updateOnlineRoster(commandSend);
   return;
  }
  if(fieldIndex>=0)return;
  const index=slots.length===1?0:commandMode==='Select'?
   slots.findIndex(slot=>slot.actor?.onlineId===selectedUnit):
   slots.findIndex(slot=>!slot.transition && !(slot.actor?.hp>0));
  const slot=slots[index];
  if(!slot || slot.transition || battleSnapshot.recall>0 && slot.actor?.hp>0){
   byId('status').textContent='That field slot is not ready to swap.';return;
  }
  commandMode=null;
  updateOnlineRoster(commandSend);
  commandSend({incoming:actor.onlineId,slot:index});
 }
 let soloSelection=null, soloCommand=null;
 function localHotkey(action) {
  const living=actor=>actor?.hp>0;
  const fields=trainerFields?.[0] ?? [{actor:activePlayer,transition:playerSwitch}];
  if(!allies.includes(soloSelection) || !living(soloSelection))soloSelection=null;
  if(action==='Escape'){
   soloCommand=null;updateBattleRosters();updateRecallStatus();return;
  }
  if(action==='Attack' || action==='Select'){
   soloCommand=action;updateBattleRosters();
   byId('status').textContent=action==='Attack'?'Choose an enemy target.':'Choose a healthy reserve to swap in.';
   return;
  }
  const rosterKey=/^(Ally|Enemy) ([1-6])$/.exec(action);
  if(rosterKey) {
   const friendly=rosterKey[1]==='Ally',index=Number(rosterKey[2])-1;
   const actor=(friendly?allies:enemies)[index];
   if(!living(actor))return;
   if(phase==='setup'){
    if(friendly)rosterCards.find(row=>row.actor===actor)?.card.click();
    return;
   }
   if(!friendly){
    if(soloCommand==='Attack'){
     const outgoing=soloSelection ?? fields.find(slot=>living(slot.actor))?.actor;
     if(outgoing)outgoing.manualTarget=battleActorId(actor);
     soloCommand=null;updateBattleRosters();updateRecallStatus();
    }
    return;
   }
   if(soloCommand==='Attack')return;
   const fieldIndex=fields.findIndex(slot=>slot.actor===actor && !slot.transition);
   if(fieldIndex>=0 && !soloCommand){
    soloSelection=actor;updateBattleRosters();
    byId('status').textContent=actor.name+' selected for commands.';return;
   }
   if(fieldIndex>=0)return;
   if(trainerFields && soloCommand==='Select'){
    const outgoing=fields.findIndex(slot=>slot.actor===soloSelection && !slot.transition);
    if(outgoing<0)return;
    recallSlot=outgoing;
   }
   if(!canSendReserve(actor))return;
   soloCommand=null;
   updateBattleRosters();
   rosterCards.find(row=>row.actor===actor)?.card.click();
   return;
  }
  const actor=soloSelection ?? fields.find(slot=>living(slot.actor))?.actor;
  if(!living(actor))return;
  const style=['Aggressive','Balanced','Defensive'].includes(action);
  actor.ai=normalizeBattleAI({...actor.ai,[style?'style':'position']:action});
  byId('status').textContent=actor.name+' · '+action;
 }
 window.localBattleHotkeyClick=(friendly,index)=>{
  if(phase!=='battle' || !soloCommand)return false;
  localHotkey((friendly?'Ally ':'Enemy ')+(index+1));return true;
 };
 window.localBattleCanTarget=()=>phase==='battle' && soloCommand==='Attack';
 window.localBattleCanSwap=()=>phase==='battle' && soloCommand==='Select';
 window.localBattleIsSelected=actor=>actor===soloSelection;
 function handleBattleHotkey(event) {
  if(phase==='setup' || phase==='battle'){
   if(dialog.open || byId('battle-settings').open || event.repeat ||
      event.target.closest?.('input,textarea,select,[contenteditable]'))return;
   const action=event.key==='Escape' && soloCommand?'Escape':Object.keys(bindings).find(key=>bindings[key]===keyName(event));
   if(action){event.preventDefault();localHotkey(action);}
   return;
  }
  if(phase!=='online-battle' || active?.result || active?.mode==='coop' || dialog.open || byId('battle-settings').open ||
     event.repeat || event.target.closest?.('input,textarea,select,[contenteditable]'))return;
  if(event.key==='Escape' && commandMode){
   commandMode=null;updateOnlineRoster(commandSend);return;
  }
  const action=Object.keys(bindings).find(key=>bindings[key]===keyName(event));
  if(!action)return;
  if(!battleSnapshot) {
   if(!active.started && !active.locked && active.format!==6 && action.startsWith('Ally ')){
    const card=byId('player-roster').querySelectorAll('.battle-slot')[Number(action.split(' ')[1])-1];
    if(card && !card.disabled){event.preventDefault();card.click();}
   }
   return;
  }
  if(!commandSend || isCoop(active.mode) && !(/^(Ally |Select$)/.test(action)))return;
  event.preventDefault();
  if(action==='Attack' || action==='Select'){
   if(!selectedUnit) {
    byId('status').textContent='Select a field Pokémon first.';
    return;
   }
   commandMode=action;
   updateOnlineRoster(commandSend);
   return;
  }
  if(/^(Ally|Enemy) /.test(action)){
   const [side,number]=action.split(' ');
   const id=(side==='Ally'?active.side:active.side==='host'?'guest':'host')+':'+(Number(number)-1);
   const actor=arenaActors.get(id);
   if(actor)chooseBattleUnit(actor);
   else byId('status').textContent='No revealed Pokémon in that roster slot.';
   return;
  }
  if(selectedUnit)commandSend({ai:{actor:selectedUnit,...(['Aggressive','Balanced','Defensive'].includes(action)?
   {style:action}:{position:action})}});
  else byId('status').textContent='Select a field Pokémon first.';
 }
 window.addEventListener('keydown',handleBattleHotkey,true);
 const settingsButton=element('button','Hotkey Settings');
 settingsButton.type='button';
 settingsButton.onclick=()=>{byId('battle-settings').close();editPvpKeys();};
 byId('battle-settings').querySelector('.battle-settings-grid').append(settingsButton);
 const menuSettings=byId('toolbar-settings').onclick;
 byId('toolbar-settings').onclick=()=>{
  menuSettings();
  byId('home-dialog-content').append(button('Hotkey Settings',editPvpKeys));
 };
 function arenaView(match, picks, togglePick, ready, leave) {
  if(phase!=='online-battle') {
   lastDpsRender=-1;renderBattleDps(0,[]);
   selectedUnit=null;commandMode=null;
   arenaActors=new Map();rosterRows=new Map();soundsPlayed=new Set();displayedTurn=-1;
   recallSlotOnline=null;battleSnapshot=null;playbackClock=null;playbackDelay=0.25;snapshotArrival=0;arrivalGaps=[];visualSnapshots=[];trainerFields=[[],[]];trainerPanels=null;
   phase='online-battle';speed=1;
   effects=[];pendingCasts=[];playerSwitch=enemySwitch=null;
   battleWeather=battleTerrain=null;arenaMap=null;weatherTime=0;onlineMatchDuration=0;
   showScreen('battle');
   for(const id of ['start','auto-reserve','battle-auto-repeat','battle-auto-start','battle-auto-capture','next-gym'])byId(id).hidden=true;
   for(const id of ['player-active','enemy-active','player-roster','enemy-roster','choices'])byId(id).replaceChildren();
   for(const id of ['player-roster','enemy-roster'])delete byId(id).dataset.onlineRoster;
   byId('speed').textContent='1× speed';byId('speed').disabled=true;
   byId('speed').setAttribute('aria-pressed','false');
   byId('score').textContent='Online battle · 1×';
   byId('reset').onclick=leave;
   try {startBattleMusic();} catch {}
  }
  if(match.started) {
   if(!battleSnapshot)byId('status').textContent='Both players are ready. Sending out Pokémon…';
   byId('choices').replaceChildren();
   return;
  }
  byId('status').textContent=match.locked?'Ready. Waiting for the other player…':
   (match.format===6?'Press Ready to send out your full team.':'Choose '+match.format+' lead Pokémon from your team, then press Ready.')+(match.opponentLocked?' The other player is ready.':'');
  byId('player-roster').replaceChildren(element('h2','Your team'),...team.map(name=>{
   const card=element('button',null,'battle-slot');
   card.append(pokemonPortrait(name),battleRosterIdentity(name,match.mode==='free_fight'?100:ownedPokemon(name)?.level ?? 5));
   card.disabled=match.locked || match.format===6;
   card.setAttribute('aria-pressed',String(picks.includes(name)));
   card.onclick=()=>togglePick(name);
   return card;
  }));
  const confirmReady=button(match.locked?'Ready ✓':'Ready',ready);
  confirmReady.disabled=match.locked || (match.format===6?team.length!==6:picks.length!==match.format);
  byId('choices').replaceChildren(confirmReady);
 }
 async function combat(id,command) {
  const client=await cloudClient();
  const {data,error}=await client.functions.invoke('arena-combat',{body:{id,command}});
  if(error) {
   const body=await error.context?.json?.().catch(()=>null);
   throw Error(body?.error ?? error.message);
  }
  return data;
 }
 function showBattleSnapshot(packet,send) {
  if(!packet.battle || packet.turn<=displayedTurn)return;
  displayedTurn=packet.turn;
  const data=packet.battle;
  const snapshotInterval=data.clock-(battleSnapshot?.clock ?? data.clock);
  if(snapshotInterval>0 || !battleSnapshot) {
   const arrived=performance.now()/1000;
   if(snapshotArrival && snapshotInterval>0) {
    arrivalGaps.push(Math.max(arrived-snapshotArrival,snapshotInterval));
    if(arrivalGaps.length>16)arrivalGaps.shift();
    const gaps=[...arrivalGaps].sort((a,b)=>a-b);
    const desired=clamp(gaps[Math.ceil(gaps.length*0.9)-1]+0.06,0.16,0.65);
    playbackDelay+=(desired-playbackDelay)*(desired>playbackDelay?0.65:0.06);
   }
   snapshotArrival=arrived;
  }
  playbackClock ??= data.clock-playbackDelay;
  updateNormalAttackToggle(data.normalAttacks ?? true,normalAttacks=>send({normalAttacks}));
  const mirror=!isCoop(active.mode) && active.side==='guest';
  const mx=x=>mirror?canvas.width-x:x;
  const dx=x=>mirror?-x:x;
  const lineView=line=>!line?line:{...line,x:mx(line.x),dx:dx(line.dx),
   angle:mirror?Math.PI-line.angle:line.angle,end:{...line.end,x:mx(line.end.x)}};
  for(const entry of data.actors) {
   const actor=arenaActors.get(entry.onlineId) ?? {};
   const oldX=actor.x,oldY=actor.y;

   Object.assign(actor,entry,{
    x:mx(entry.x),friendly:mirror?!entry.friendly:entry.friendly,
    direction:mirror?(8-entry.direction)%8:entry.direction,facing:dx(entry.facing),
    attackX:dx(entry.attackX),hitX:dx(entry.hitX),
   });
   const samples=actor.motionSamples ??= [];
   const sample={time:data.clock,x:actor.x,y:actor.y,ticks:actor.motionTicks};
   if(samples.length && samples.at(-1).time===sample.time)samples[samples.length-1]=sample;
   else samples.push(sample);
   if(samples.length>64)samples.shift();
   if(Number.isFinite(oldX))actor.x=oldX;
   if(Number.isFinite(oldY))actor.y=oldY;
   arenaActors.set(entry.onlineId,actor);
  }
  const actorFor=id=>arenaActors.get(id) ?? null;
  const fields=(mirror?[...data.fields].reverse():data.fields).map(slots=>slots.map(slot=>({
   ...slot,actor:actorFor(slot.actor),
   transition:slot.transition?{...slot.transition,outgoing:actorFor(slot.transition.outgoing),
    incoming:actorFor(slot.transition.incoming),snapshotElapsed:slot.transition.elapsed}:null,
  })));
  trainerFields=fields;
  visualSnapshots.push({time:data.clock,
   effects:data.effects.map(effect=>({...effect,x:mx(effect.x),tx:mx(effect.tx),sector:lineView(effect.sector)})),
   casts:data.casts.map(cast=>({...cast,actor:actorFor(cast.actor),
    center:cast.center?{...cast.center,x:mx(cast.center.x)}:null,line:lineView(cast.line)})),
  });
  if(visualSnapshots.length>64)visualSnapshots.shift();
  battleWeather=data.weather;battleTerrain=data.terrain;weatherTime=data.weatherTime ?? 0;
  arenaMap=data.arenaMap?{...data.arenaMap,rocks:data.arenaMap.rocks.map(rock=>({...rock,x:mx(rock.x),fall:rock.fall?{...rock.fall,x:mx(rock.fall.x),dx:dx(rock.fall.dx)}:null})),
   zones:data.arenaMap.zones.map(zone=>({...zone,x:mx(zone.x)}))}:null;
  byId('score').textContent='Online battle · 1×'+(data.weather?' · '+data.weather+' '+Math.ceil(data.weatherTime ?? 0)+'s'+(abilityWeather()?'':' (suppressed)'):'');
  const freshSounds=new Set();
  for(const sound of data.sounds ?? []) {
   const key=[sound.clock,sound.move,sound.event,sound.shape].join(':');
   if(!soundsPlayed.has(key))playSkillSound(sound.move,sound.event,sound.shape);
   freshSounds.add(key);
  }
  soundsPlayed=freshSounds;
  const boss=data.actors.find(actor=>actor.side==='boss' && actor.raidForm?.startsWith('Mega '));
  byId('raid-boss-hud').hidden=!boss;
  if(boss){
   byId('raid-boss-name').textContent=boss.raidForm;
   const hp=byId('raid-boss-hp');hp.max=boss.max;hp.value=boss.hp;
   byId('raid-boss-value').textContent=boss.hp.toLocaleString()+' / '+boss.max.toLocaleString()+' HP';
  }
  battleSnapshot=data;
  onlineMatchDuration=data.clock;
  renderBattleDps(data.clock,data.damageBuckets ?? [],mirror);
  frameAge=0;
  updateOnlineRoster(send);
 }
 function updateOnlineRoster(send) {
  commandSend=send;
  const ownSlots=trainerFields.flat().filter(slot=>slot.owner===active.side);
  const selectedSlot=ownSlots[recallSlotOnline];
  if(recallSlotOnline!==null && (!selectedSlot?.actor?.hp || selectedSlot.transition))recallSlotOnline=null;
  const openSlot=ownSlots.findIndex(slot=>!slot.transition && !(slot.actor?.hp>0));
  const reserveSlot=openSlot>=0?openSlot:ownSlots.length===1?0:recallSlotOnline;
  const canReserve=[...arenaActors.values()].some(actor=>actor.side===active.side && actor.hp>0 &&
   !ownSlots.some(slot=>trainerOnField(actor,[slot])));
  const status=ownSlots.some(slot=>slot.transition)?'Sending out Pokémon…':
   openSlot>=0 && canReserve?'Choose a healthy reserve to send out.':
   !canReserve?'Battle in progress.':
   battleSnapshot.recall>0?'Recall ready in '+Math.ceil(battleSnapshot.recall)+'s.':
   recallSlotOnline!==null?'Choose a reserve to send out.':'Select an active Pokémon to recall it.';
  byId('status').textContent=commandMode==='Attack'?'Choose an enemy target.':commandMode==='Select'?'Choose a healthy reserve to swap in.':status;
  for(const [friendly,id] of [[true,'player-roster'],[false,'enemy-roster']]) {
   const container=byId(id);
   if(!container.dataset.onlineRoster) {
    container.replaceChildren(element('h2',friendly?'Your side':isCoop(active.mode)?'Guardians':'Opponent'));
    container.dataset.onlineRoster='true';
   }
   for(const actor of arenaActors.values()) {
    if(actor.friendly!==friendly)continue;
    const own=actor.side===active.side;
    const index=ownSlots.findIndex(slot=>slot.actor===actor || slot.transition?.incoming===actor);
    let row=rosterRows.get(actor.onlineId);
    if(!row || row.form!==actor.name) {
     const card=element('button',null,'battle-slot');
     const identity=battleRosterIdentity(actor.raidForm ?? actor.name,actor.level);
     const hp=element('progress');hp.max=actor.max;hp.setAttribute('aria-label',actor.name+' HP');
     const stages=element('span',null,'battle-stage-icons');
     const exhaustion=makeExhaustionBar(actor);
     card.append(pokemonPortrait(actor.name),identity,hp,exhaustion,stages);
     if(row)row.card.replaceWith(card);else container.append(card);
     row={card,hp,stages,exhaustion,form:actor.name};rosterRows.set(actor.onlineId,row);
    }
    row.hp.value=actor.hp;
    updateStageIcons(row.stages,actor);
    updateExhaustionBar(row.exhaustion,actor);
    row.card.classList.toggle('is-out',actor.hp<=0);
    row.card.classList.toggle('is-active',trainerFields.flat().some(slot=>trainerOnField(actor,[slot])) && actor.hp>0);
    row.card.classList.toggle('is-command-selected',actor.onlineId===selectedUnit);
    row.card.setAttribute('aria-pressed',String(actor.onlineId===selectedUnit || index>=0 && recallSlotOnline===index));
    row.card.disabled=!own || actor.hp<=0 || (index>=0?!canReserve || Boolean(ownSlots[index].transition):
     reserveSlot===null || (openSlot<0 && battleSnapshot.recall>0));
    if(!isCoop(active.mode) || commandMode==='Select'){
     const outgoing=ownSlots.find(slot=>slot.actor?.onlineId===selectedUnit);
     const swapSlot=ownSlots.length===1?ownSlots[0]:outgoing;
     const canQuickSwap=index<0 && Boolean(swapSlot) && !swapSlot.transition &&
      (!(swapSlot.actor?.hp>0) || battleSnapshot.recall<=0);
     row.card.disabled=actor.hp<=0 || (commandMode==='Attack'?own:!own ||
      (commandMode==='Select'?!canQuickSwap:index>=0?Boolean(ownSlots[index].transition):
       ownSlots.length===1?!canQuickSwap:openSlot<0));
    }
    row.card.onclick=()=>{
     if(commandMode || (!isCoop(active.mode) && (index>=0 || ownSlots.length===1))){
      chooseBattleUnit(actor);
      return;
     }
     if(index>=0) {
      recallSlotOnline=recallSlotOnline===index?null:index;
      updateOnlineRoster(send);
     } else send({incoming:actor.onlineId,slot:reserveSlot});
    };
   }
  }
 }
 window.paintOnlineBattle=dt=>{
  visualTime+=dt;frameAge+=dt;
  if(battleSnapshot) {
   const latest=battleSnapshot.clock;
   const age=Math.max(0,performance.now()/1000-snapshotArrival);
   const target=latest+Math.min(age,playbackDelay)-playbackDelay;
   const rate=clamp(1+(target-playbackClock)*1.5,0.75,1.20);
   playbackClock=active?.result?latest:Math.min(latest,playbackClock+dt*rate);
  }
  for(const actor of arenaActors.values()) {
   const samples=actor.motionSamples;
   while(samples.length>2 && samples[1].time<=playbackClock)samples.shift();
   const from=samples[0];
   const to=samples[1] ?? from;
   const blend=to.time>from.time?clamp((playbackClock-from.time)/(to.time-from.time),0,1):1;
   const position=Math.hypot(to.x-from.x,to.y-from.y)>90 && blend<1?0:blend;
   actor.x=from.x+(to.x-from.x)*position;
   actor.y=from.y+(to.y-from.y)*position;
   actor.motionTicks=from.ticks+(to.ticks-from.ticks)*position;
   actor.attack=Math.max(0,actor.attack-dt);
   actor.hit=Math.max(0,actor.hit-dt);
   actor.labelTime=Math.max(0,actor.labelTime-dt);
   if(actor.ailment!==1)for(let i=0;i<actor.moveTimers.length;i++)actor.moveTimers[i]=Math.max(0,actor.moveTimers[i]-dt);
  }
  for(const slot of trainerFields.flat()) {
   if(slot.transition) {
    const duration=slot.transition.stage==='recall'?ballDuration:throwDuration+releaseDuration;
    slot.transition.elapsed=Math.min(duration,slot.transition.snapshotElapsed+frameAge);
   }
  }
  while(visualSnapshots.length>1 && visualSnapshots[1].time<=playbackClock)visualSnapshots.shift();
  const visual=visualSnapshots[0];
  if(visual && visual.time<=playbackClock) {
   const elapsed=playbackClock-visual.time;
   effects=visual.effects.filter(effect=>effect.life>elapsed).map(effect=>({...effect,life:effect.life-elapsed}));
   pendingCasts=visual.casts.map(cast=>cast.flight && cast.line?
    {...cast,travel:Math.min(cast.line.length,cast.travel+460*elapsed)}:
    {...cast,remaining:Math.max(0,cast.remaining-elapsed)});
  }
  if(battleSnapshot && (frameAge===dt || Math.floor(frameAge*10)!==Math.floor((frameAge-dt)*10)))updateActivePanels(trainerFields);
  paint();
 };
 const originalMenu=openMenu;
 openMenu=()=>{
  stop();
  soloSelection=soloCommand=null;
  byId('start').hidden=false;
  byId('speed').disabled=false;
  byId('reset').onclick=openMenu;
  originalMenu();
 };
 let closeBattleChannel=null;
 const stop=()=>{
  generation++;
  clearTimeout(timer);
  closeBattleChannel?.();
  closeBattleChannel=null;
 };
 dialog.addEventListener('close',()=>{
  if(phase==='online-battle' && active?.result)openMenu();
  else if(phase!=='online-battle' && phase!=='raid-lobby')stop();
 });
 async function rpc(action,args={}) {
  const client=await cloudClient();
  const {data,error}=await client.rpc('arena_online',{action,args});
  if(error) throw error;
  return data;
 }
 function show(title,...nodes) {
  byId('home-dialog-title').textContent=title;
  byId('home-dialog-content').replaceChildren(...nodes);
  if(!dialog.open) dialog.showModal();
 }
 function button(label,fn) {
  const b=element('button',label);
  b.onclick=async()=>{
   b.disabled=true;
   try {await fn();}
   catch(error){(phase==='raid-lobby'?byId('raid-lobby').querySelector('.raid-room-controls'):byId('home-dialog-content')).append(element('p',error.message));}
   finally {b.disabled=false;}
  };
  return b;
 }
 function input(label) {
  const field=element('input');field.placeholder=label;field.setAttribute('aria-label',label);return field;
 }
 function select(label,values) {
  const node=element('select');node.setAttribute('aria-label',label);
  for(const [value,title] of values){const option=element('option',title);option.value=value;node.append(option);}
  return node;
 }
 async function open(title,view) {
  stop();
  const token=generation;
  show(title,element('p','Loading…'));
  try {
   const client=await cloudClient();
   const {data}=await client.auth.getUser();
   if(!data?.user) throw Error('Log in with your email to use online features.');
   const name=starterSave?.ign ?? currentPlayer.name;
   try {await rpc('profile',{name});}
   catch {
    if(token!==generation) return;
    const field=input('Online player name');field.maxLength=24;
    show(title,field,button('Register',async()=>{await rpc('profile',{name:field.value});await view();}));
    return;
   }
   if(token===generation) await view();
  } catch(error){if(token===generation)show(title,element('p',error.message));}
 }
 function raidRoom(title,visibility,leave,tier=1,code) {
  phase='raid-lobby';
  showScreen('raid-lobby');
  if(dialog.open)dialog.close();
  const root=byId('raid-lobby');
  root.dataset.tier=String(tier);
  const top=element('div',null,'raid-room-top');
  const actions=element('div',null,'raid-room-actions');
  actions.append(button('Settings',()=>byId('toolbar-settings').click()),button(leave?'Leave room':'Main menu',leave ?? openMenu));
  const roomInfo=element('div',null,'raid-room-info');
  roomInfo.append(element('span',visibility));
  if(code)roomInfo.append(element('small',code));
  top.append(roomInfo,element('h2',title),actions);
  const seats=element('div',null,'raid-room-seats');
  const controls=element('div',null,'raid-room-controls');
  const footer=element('div',null,'raid-room-footer');
  const start=element('div',null,'raid-room-start');
  footer.append(controls,start);
  root.replaceChildren(top,seats,footer);
  return {root,seats,controls,start};
 }
 async function raidRpc(action,args) {
  const client=await cloudClient();
  const {data,error}=await client.rpc('arena_raid',{action,args});
  if(error)throw error;
  return data;
 }
 function showRaidSeats(initial) {
  stop();
  const token=generation;
  let match=initial, busy=false, revision='';
  const tier=megaRaidTiers[match.mode];
  const room=raidRoom(tier?tier.name+' · Tier '+tier.tier:'Co-op Raid',
   match.public?'Public room':'Private room',async()=>{
    await raidRpc('leave',{id:match.id});if(token===generation)openMenu();
   },tier?.tier ?? 1,match.code);
  const status=element('p');
  const actions=element('div',null,'raid-left-actions');
  room.controls.append(status,actions);
  const available=Object.keys(wildProgress.owned).filter(isAvailablePokemon).sort((a,b)=>a.localeCompare(b));
  let fighter=match.seats[match.ownSlot]?.pokemon ?? team[0] ?? available[0] ?? '';
  let kickMode=false;
  function editFighter(initial,save) {
   const editor=element('dialog',null,'raid-pc-dialog');
   const panel=byId('pokemon-detail');
   const anchor=document.createComment('PC detail position');
   const prior=inspected;
   panel.before(anchor);
   const title=element('h2','Edit Pokémon');
   const picker=select('Choose raid Pokémon',available.map(name=>[name,name]));
   picker.value=initial || available[0] || '';
   const preview=()=>{
    if(!picker.value)return;
    inspected=picker.value;
    renderDetail();
   };
   picker.onchange=preview;
   const use=button('Use this Pokémon',async()=>{
    if(!picker.value)return;
    await save(picker.value);
    editor.close();
   });
   use.disabled=!available.length;
   editor.append(title,picker,panel,element('div',null,'raid-room-actions'));
   editor.lastChild.append(use,button('Done',()=>editor.close()));
   editor.addEventListener('close',()=>{
    anchor.replaceWith(panel);
    inspected=prior;
    editor.remove();
   },{once:true});
   document.body.append(editor);
   preview();
   editor.showModal();
  }
  const act=async(action,args={})=>{
   if(busy)return;
   busy=true;
   try{
    if(action==='pick' || action==='fill'){
     if(args.pokemon){profileFor(args.pokemon);saveTeam();await flushArenaSave();}
    }
    const next=await raidRpc(action,{id:match.id,...args});
    if(token===generation){match=next;draw();}
   }catch(error){status.textContent=error.message;}
   finally{busy=false;}
  };
  function draw(){
   if(match.result){openMenu();return;}
   if(match.started){active=match;showMatch('Co-op Raid');return;}
   const nextRevision=JSON.stringify(match.seats);
   const viewRevision=nextRevision+'|'+fighter+'|'+kickMode;
   if(viewRevision===revision)return;
   revision=viewRevision;
   room.seats.replaceChildren(...match.seats.map((seat,index)=>{
    const tile=element('div',null,'raid-seat');
    const pad=element('div',null,'raid-seat-pad');
    const shown=index===match.ownSlot?fighter:seat?.pokemon;
    if(shown)pad.append(idlePokemonPortrait(shown));
    tile.append(pad,element('strong',seat?.name ?? 'Open seat'),
     element('small',shown ? shown+(seat?.ready?' · Ready':' · Not ready') : seat?'Not ready':''));
    if(kickMode && match.side==='host' && seat?.uid && index!==match.ownSlot)
     tile.append(button('Remove player',()=>{kickMode=false;return act('kick',{slot:index});}));
    if(match.side==='host' && (!seat || seat.substitute)){
     tile.append(button(seat?'Edit substitute':'Choose Pokémon',()=>editFighter(shown,pokemon=>act('fill',{slot:index,pokemon}))));
     if(seat)tile.append(button('Clear',()=>act('fill',{slot:index,pokemon:''})));
    }
    return tile;
   }));
   const current=match.seats[match.ownSlot];
   const ready=button(current?.ready?'Unready':'Ready Up',()=>act('pick',{pokemon:current?.ready?'':fighter}));
   ready.disabled=!fighter;
   const edit=button('Edit Pokémon',()=>editFighter(fighter,async pokemon=>{
    fighter=pokemon;
    await act('pick',{pokemon:''});
   }));
   const invite=button('Invite',()=>{
    const contacts=element('div');
    const showContacts=async kind=>{
     const data=kind==='friends'?await rpc('friends'):null;
     let names;
     if(kind==='friends')names=data.filter(friend=>friend.accepted).map(friend=>friend.name);
     else names=await raidRpc('guildlist',{id:match.id});
     contacts.replaceChildren(...(names.length?names.map(name=>button('Invite '+name,async()=>{
      await raidRpc('invite',{id:match.id,name});
      contacts.append(element('p','Invited '+name+'.'));
     })):[element('p','No contacts available.')]));
    };
    show('Invite',button('Friendlist',()=>showContacts('friends')),button('Guildlist',()=>showContacts('guild')),
     button('Copy Room Code',async()=>{
      try{await navigator.clipboard.writeText(match.code);contacts.replaceChildren(element('p','Room code copied.'));}
      catch{contacts.replaceChildren(element('p',match.code));}
     }),contacts);
   });
   actions.replaceChildren(ready,edit,invite);
   if(match.side==='host'){
    const kick=button(kickMode?'Cancel kick':'Kick',()=>{kickMode=!kickMode;draw();});
    kick.disabled=!match.seats.some((seat,index)=>seat?.uid && index!==match.ownSlot);
    actions.append(kick);
    const start=button('START',()=>act('start'));
    start.disabled=match.seats.some(seat=>seat && !seat.ready);
    room.start.replaceChildren(start);
   }

  }
  async function pollRaid(){
   if(token!==generation)return;
   try{
    if(!busy){
     const next=await raidRpc('poll',{id:match.id});
     if(token!==generation)return;
     if(!busy){match=next;draw();}
    }
   }catch(error){status.textContent=error.message;}
   if(token===generation)timer=setTimeout(pollRaid,900);
  }
  draw();
  if(token===generation)timer=setTimeout(pollRaid,900);
 }
 function lobby(coop) {
  stop();
  const title=coop?'Co-op':'PvP';
  const mode=select('Match type',[['unranked','Unranked'],['ranked','Ranked']]);
  const raid=select('Raid tier',[
   ...Object.entries(megaRaidTiers).map(([mode,entry])=>[mode,'Tier '+entry.tier+' · '+entry.name]),
  ]);
  const format=select('Battle format',[[1,'1v1'],[2,'2v2'],[3,'3v3']]);
  const freeFight=element('input');freeFight.type='checkbox';
  const freeFightLabel=element('label','Free Fight · Lv. 100 ');freeFightLabel.append(freeFight);
  const code=input('Room code');
  const begin=async (action,extra={})=>{
   if(cloudAccount && dirty) await flushArenaSave();
   const match=await (coop?raidRpc:rpc)(action,{mode:coop?raid.value:mode.value==='unranked' && freeFight.checked?'free_fight':mode.value,format:Number(format.value),code:code.value,...extra});
   if(coop?phase!=='raid-lobby':!dialog.open)return;
   if(coop){showRaidSeats(match);return;}
   active=match;
   showMatch(title);
  };
  const create=button('Create room',()=>{
   if(!coop)return begin('create');
   show('Create Raid Room',button('Public',()=>begin('create',{visibility:'public'})),
    button('Private',()=>begin('create',{visibility:'private'})));
  });
  const join=button('Join room',()=>begin('join'));
  if(!coop) {
   const six=element('option','6v6');six.value='6';
   format.append(six);
   mode.onchange=freeFight.onchange=()=>{
    create.hidden=join.hidden=code.hidden=mode.value==='ranked';
    freeFightLabel.hidden=mode.value!=='unranked';
   };
  }
  const find=button(coop?'Auto Match':'Find match',()=>begin('queue'));
  if(coop){
   const room=raidRoom('Co-op Raids','Raid selection');
   raid.onchange=()=>{room.root.dataset.tier=String(megaRaidTiers[raid.value].tier);};
   raid.onchange();
   const findRoom=button('Find Room',async()=>{
    const rooms=await raidRpc('list',{});
    const search=input('Search by host, tier, or boss');
    const results=element('div');
    const render=()=>{
     const query=search.value.trim().toLowerCase();
     const rows=rooms.filter(row=>{
      const tier=megaRaidTiers[row.mode];
      return (row.host+' Tier '+tier?.tier+' '+tier?.name).toLowerCase().includes(query);
     });
     results.replaceChildren(...(rows.length?rows.map(row=>{
      const tier=megaRaidTiers[row.mode];
      return button(row.host+' · Tier '+tier?.tier+' · '+tier?.name+' · '+row.players+'/6 players',
       ()=>begin('join_public',{id:row.id}));
     }):[element('p','No matching public rooms.')]));
    };
    search.oninput=render;render();
    show('Find Room',search,results);
   });
   room.controls.append(raid,find,create,findRoom,code,join);
   return;
  }
  show(title,mode,freeFightLabel,format,find,create,code,join);
 }
 function showMatch(title) {
  if(active.mode==='free_fight')title='Free Fight';
  stop();
  const token=generation;
  const view=element('div');
  const leave=async()=>{
   if(!active.result && !confirm('Leave this match? Leaving a started ranked match counts as a loss.'))return;
   try {
    if(!active.result)await (active.seats?raidRpc:rpc)('leave',{id:active.id});
    if(token!==generation)return;
    openMenu();if(dialog.open)dialog.close();
   } catch(error) {byId('status').textContent=error.message;view.append(element('p',error.message));}
  };
  const coOp=isCoop(active.mode);
  const tier=megaRaidTiers[active.mode];
  const raid=coOp?raidRoom(tier?tier.name+' · Tier '+tier.tier:title,active.code?'Private room':'Public room',leave):null;
  if(raid)raid.controls.append(view);
  else show(title,view,button('Leave match',leave));
  let picks=[], submitting=false, sending=false;
  let joiningChannel=false, live=false, lastPush=0;
  async function joinBattleChannel() {
   if(joiningChannel || isCoop(active.mode))return;
   joiningChannel=true;
   try {
    const client=await cloudClient();
    if(token!==generation || active.result)return;
    const channel=client.channel('arena:'+active.id+':'+active.side,{config:{private:true}});
    closeBattleChannel=()=>{void client.removeChannel(channel);};
    channel.on('broadcast',{event:'snapshot'},({payload})=>{
     if(token!==generation || active.result || !payload?.battle)return;
     lastPush=performance.now();
     acceptBattle(payload);
    }).subscribe(status=>{live=status==='SUBSCRIBED';});
   } catch {live=false;}
  }
  async function send(command) {
   if(sending || active.result)return;
   sending=true;
   try {
    const packet=await combat(active.id,command);
    if(token!==generation)return;
    acceptBattle(packet);
   } catch(error) {
    if(token===generation)byId('status').textContent=error.message;
   } finally {sending=false;}
  }
  function acceptBattle(packet) {
   showBattleSnapshot(packet,send);
   if(packet.result && !active.result) {
    active={...active,result:packet.result};
    clearTimeout(timer);
    closeBattleChannel?.();
    closeBattleChannel=null;
    render();
   }
  }
  function togglePick(name) {
   if(submitting || active.locked)return;
   picks=picks.includes(name)?picks.filter(p=>p!==name):[...picks,name].slice(-active.format);
   render();
  }
  async function ready() {
   if(active.format===6)picks=team.slice(0,6);
   if(submitting || active.locked || picks.length!==active.format)return;
   submitting=true;
   try {
    for(const name of team)profileFor(name);
    saveTeam();
    if(cloudAccount) {
     await flushArenaSave();
     if(dirty || saving)throw Error('Waiting for your battle team to sync. Try Ready again.');
    }
    unlockSkillSound();
    const next=await rpc('lock',{id:active.id,picks});
    if(token===generation)active=next;
   } catch(error) {
    if(token===generation)byId('status').textContent=error.message;
    return;
   } finally {submitting=false;}
   if(token===generation)render();
  }
  function render() {
   const m=active;
   view.replaceChildren(element('p',m.mode+' · '+m.format+' per player'));
   if(m.code)view.append(element('p','Room code '+m.code));
   if(m.result){
    const result={draw:'Draw',cancelled:'Match cancelled',coop_win:'Co-op victory',coop_loss:'Co-op defeat'}[m.result] ?? (m.result===m.side?'Victory':'Defeat');
    stopBattleMusic();
    if(phase==='online-battle') {
     byId('status').textContent=result;
     const data=battleSnapshot;
     const stats=[];
     if(data) {
      const seconds=Math.floor(data.clock);
      stats.push(element('p','Duration · '+Math.floor(seconds/60)+'m '+seconds%60+'s'));
      const mirror=!isCoop(m.mode) && m.side==='guest';
      const chart=element('section');
      const tabs=element('div',null,'damage-tabs');
      const bars=element('div');
      const modes=[['dealt','Damage Dealt'],['taken','Damage Taken']];
      const buttons=modes.map(([mode,label])=>button(label,()=>renderBars(mode)));
      function renderBars(mode) {
       buttons.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(modes[i][0]===mode)));
       const totals=battleDamageTotals(data.damageBuckets ?? [],mode);
       bars.replaceChildren();
       for(const friendly of [true,false]) {
        const rows=totals.filter(row=>(row.friendly!==mirror)===friendly && row.total>0).sort((a,b)=>b.total-a.total);
        const actors=[...arenaActors.values()].filter(actor=>actor.friendly===friendly);
        bars.append(element('h3',friendly?'Your side':'Opposing side'),
         element('p',actors.filter(actor=>actor.hp<=0).length+' fainted'),
         ...(rows.length?damageBarRows(rows,data.clock,mode):[element('p','No damage recorded.')]));
       }
      }
      tabs.append(...buttons);
      chart.append(tabs,bars);
      renderBars('dealt');
      stats.push(chart);
     }
     show(result,...stats,button('Main menu',()=>dialog.close()));
    }
    else view.append(element('strong',result));return;
   }
   if(raid && !m.joined)raid.seats.replaceChildren(element('div','You','raid-seat'),element('div','Open seat','raid-seat'));
   if(!m.joined && !m.seats){
    view.append(element('p','Waiting for another player…'));
    if(m.code && m.side==='host') view.append(button('Invite friend or guild member',async()=>{
     const names=await rpc('invite_list');
     const recipient=select('Invite recipient',names.map(name=>[name,name]));
     view.append(...(names.length?[recipient,button('Send invite',async()=>{
      await rpc('invite',{id:m.id,name:recipient.value});view.append(element('p','Invitation sent.'));
     })]:[element('p','No friends or guild members to invite.')]));
    }));
    return;
   }
   if(raid && !m.started){
    raid.seats.replaceChildren(...[
     ['You',m.locked], [m.joined?'Partner':'Open seat',m.opponentLocked],
    ].map(([name,ready])=>element('div',name+' · '+(ready?'Ready':'Not ready'),'raid-seat')));
    if(!m.locked){
     const teamChoices=element('div',null,'raid-room-actions');
     teamChoices.append(...team.map(name=>{
      const choice=button(name,()=>togglePick(name));
      choice.setAttribute('aria-pressed',String(picks.includes(name)));
      return choice;
     }));
     const confirm=button('Ready up',ready);confirm.disabled=picks.length!==m.format;
     view.append(element('p','Choose '+m.format+' lead Pokémon.'),teamChoices,confirm);
    } else view.append(element('p','Ready. Waiting for your partner…'));
    return;
   }
   arenaView(m,picks,togglePick,ready,leave);
   if(dialog.open)dialog.close();
  }
  render();
  async function poll() {
   if(token!==generation || active.result)return;
   const began=performance.now();
   try {
    if(active.started && !active.result) {
     void joinBattleChannel();
     if(active.side==='guest' && live && began-lastPush<550){
      timer=setTimeout(poll,120);
      return;
     }
     const packet=await combat(active.id);
     if(token!==generation)return;
     acceptBattle(packet);
    } else {
     const next=await (active.seats?raidRpc:rpc)('poll',{id:active.id});
     if(token!==generation || (!dialog.open && phase!=='online-battle' && phase!=='raid-lobby'))return;
     if(!submitting && (!active.locked || next.locked || next.result) && !active.started &&
       JSON.stringify(next)!==JSON.stringify(active)){active=next;render();}
    }
    if(!active.result)timer=setTimeout(poll,active.started?Math.max(0,100-(performance.now()-began)):850);
   } catch(error){
    if(token!==generation)return;
    if(phase==='online-battle')byId('status').textContent='Reconnecting… '+error.message;
    else view.replaceChildren(element('p','Reconnecting… '+error.message));
    timer=setTimeout(poll,active.started?400:2000);
   }
  }
  if(!active.result)timer=setTimeout(poll,850);
 }
 async function friends() {
  const rows=await rpc('friends'),name=input('Player name');
  show('Friendlist',name,button('Send request',async()=>{await rpc('friend_request',{name:name.value});await friends();}),
   ...rows.map(friend=>{
    const row=element('p',friend.name+' · '+(friend.accepted?'Friend':friend.incoming?'Incoming request':'Request sent'));
    if(friend.accepted) {
     const presence=element('span',null,'friend-presence'+(friend.online?' is-online':''));
     presence.title=friend.online?'Online':'Offline';
     presence.setAttribute('role','img');
     presence.setAttribute('aria-label',presence.title);
     row.prepend(presence);
    }
    if(friend.incoming&&!friend.accepted)row.append(button('Accept',async()=>{await rpc('friend_request',{name:friend.name});await friends();}));
    return row;
   }));
 }
 async function guilds() {
  const data=await rpc('guilds'),name=input('Guild name');
  show('Guilds',element('p',data.membership?'Your guild: '+data.membership:'You have no guild.'),
   ...(data.membership?[button('Leave guild',async()=>{await rpc('guild_leave');await guilds();})]:
    [name,button('Create guild',async()=>{await rpc('guild_create',{name:name.value});await guilds();}),
     button('Join guild',async()=>{await rpc('guild_join',{name:name.value});await guilds();})]),
   ...data.guilds.map(g=>element('p',g.name+' · '+g.members+' members · '+g.xp+' XP')));
 }
 async function boards() {
  const data=await rpc('leaderboards');
  const sections=[['Ranked PvP',data.ranked,p=>p.rating+' rating · '+p.wins+' wins · '+p.losses+' losses'],
   ['Co-op',data.coop,p=>p.coop+' clears'],['Guilds',data.guilds,p=>p.xp+' XP']];
  show('Leaderboards',...sections.flatMap(([title,rows,describe])=>[element('h3',title),
   ...(rows.length?rows.map((row,i)=>element('p',(i+1)+'. '+row.name+' · '+describe(row))):[element('p','No results yet.')])]));
 }
 const notificationReadKey='pokemon-arena-read-notifications';
 const notificationKeys=data=>[
  ...data.friends.map(name=>'friend:'+name),
  ...data.invites.map(invite=>'invite:'+invite.code),
 ];
 function updateNotificationUnread(data,markRead=false) {
  const keys=notificationKeys(data);
  const prior=new Set(JSON.parse(playerStorage.getItem(notificationReadKey) ?? '[]'));
  const seen=markRead?keys:keys.filter(key=>prior.has(key));
  playerStorage.setItem(notificationReadKey,JSON.stringify(seen));
  setToolbarUnread('toolbar-notices',keys.length-seen.length);
 }
 async function notifications() {
  const data=await rpc('notifications');
  updateNotificationUnread(data,true);
  show('Notifications',...data.friends.map(name=>element('div',name+' sent a friend request.')),
   ...data.friends.map(name=>button('Accept '+name,async()=>{await rpc('friend_request',{name});await notifications();})),
   ...data.invites.map(invite=>button('Join '+invite.name+' · '+invite.mode,async()=>{
    if(invite.raid){showRaidSeats(await raidRpc('join',{code:invite.code}));return;}
    active=await rpc('join',{code:invite.code});showMatch(isCoop(invite.mode)?'Co-op':'PvP');
   })),
   ...(!data.friends.length&&!data.invites.length?[element('p','No new notifications.')]:[]));
 }
 byId('toolbar-notices').onclick=()=>open('Notifications',notifications);
 setInterval(async()=>{
  if(phase!=='home' || !cloudAccount)return;
  try {
   const data=await rpc('notifications');
   updateNotificationUnread(data);
  } catch {}
 },5000);
 byId('home-coop').onclick=()=>open('Co-op',()=>lobby(true));
 byId('home-pvp').onclick=()=>open('PvP',()=>lobby(false));
 byId('home-friendlist').onclick=()=>open('Friendlist',friends);
 byId('home-guilds').onclick=()=>open('Guilds',guilds);
 byId('home-leaderboard').onclick=()=>open('Leaderboards',boards);
})();
