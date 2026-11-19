const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8'),html=read('index.html');
const data=name=>JSON.parse(html.match(new RegExp('^const '+name+'\\s*=\\s*(.+);$','m'))[1]);
let checks=0,saves=0,renders=0;
class Node {
 constructor(tag,text='',cls=''){Object.assign(this,{tagName:tag,textContent:text??'',className:cls,children:[],attributes:{},value:'',hidden:false,disabled:false,open:false,style:{setProperty(){}}});this.classList={toggle(){},remove(){},add(){}};}
 append(...items){this.children.push(...items);}replaceChildren(...items){this.children=items;}setAttribute(k,v){this.attributes[k]=v;}addEventListener(){}showModal(){this.open=true;}close(){this.open=false;}
 all(){return [this,...this.children.flatMap(child=>child instanceof Node?child.all():[])];}
 querySelector(selector){return this.all().find(node=>selector.startsWith('.')?node.className.split(' ').includes(selector.slice(1)):node.tagName===selector)??null;}
}
const nodes=new Map(),storage=new Map(),dex=data('dex'),regions=data('gymRegions'),evo=data('evolutionData');
const allBadges=regions.flatMap(([region,,gyms])=>gyms.map(gym=>region+'/'+gym[3]));
const owned={Mewtwo:{level:100,xp:0},Pikachu:{level:50,xp:0},Squirtle:{level:50,xp:0}};
const settings={owned,items:{Leftovers:1},held:{},ai:{},vitamins:{},capsules:0,coins:0,campaign:{},battlePlan:'Balanced'};
const ctx=vm.createContext({console,Math,Date,Set,Map,JSON,crypto,structuredClone,Promise,
 window:{},sessionStorage:{getItem:k=>storage.get(k)??null},document:{body:new Node('body')},
 element:(...args)=>new Node(...args),byId:id=>{if(!nodes.has(id))nodes.set(id,new Node('div'));return nodes.get(id);},
 phase:'home',automaticBattleLoopActive:()=>false,gymRegions:regions,gymTeams:regions.flatMap(([region,,gyms])=>gyms.map(gym=>({id:region+'/'+gym[3],region}))),
 clearedGyms:[],masterGymClears:new Set(),wildProgress:settings,dex,dexNames:Object.keys(dex),evolutionData:evo,
 speciesById:Object.fromEntries(Object.entries(dex).map(([name,[id]])=>[id,name])),team:['Pikachu','Squirtle'],loadouts:{Pikachu:['Tackle'],Squirtle:['Tackle']},
 heldItems:{Leftovers:{}},evolutionStones:[],canHoldEvolutionItem:()=>true,
 ownedPokemon:name=>settings.owned[name],movesFor:name=>ctx.loadouts[name]??['Tackle'],legalMoves:()=>['Tackle','Surf','Thunderbolt'],
 legalLoadout:(_,moves)=>[...moves],normalizeBattleAI:ai=>({...ai,mode:ai?.mode??'Basic'}),normalizeTeamPlan:plan=>plan??'Balanced',
 saveWildProgress:()=>{saves++;return true;},saveTeam:()=>{saves++;},renderMenu:()=>{renders++;},activeSlot:0,inspected:null,
 earnedCoins:n=>n,experienceCandyName:name=>({'EXP Candy 500':'EXP Candy L','EXP Candy 250':'EXP Candy M'}[name]??name),showPassBattleNotice(){},
 generationOf:name=>{const id=dex[name][0];return [151,251,386,493,649,721,809,905,1025].findIndex(end=>id<=end)+1;},
 isLegendaryEncounter:name=>[144,145,146,150,151,249,250,251,377,378,379,380,381,382,383,384,385,386].includes(dex[name][0]),
 minimumEncounterLevel:()=>1,updateLogEntries:[{version:JSON.parse(read('version.json')).version}],
});
vm.runInContext(html.slice(html.indexOf('function gymRegionCleared('),html.indexOf('const masterOpponentExclusions=')),ctx);
ctx.loadContractEngine=()=>import('../supabase/functions/arena-combat/engine.js');
vm.runInContext(read('campaign-progression.js').replace(/async function engine\(\)\{return import\([^;]+;\}/, 'async function engine(){return await globalThis.loadContractEngine();}'),ctx);const c=ctx.window.ArenaCampaign;
const missions=new Node('section'),routes=[];
ctx.window.ArenaTrainerCard={
 openMissions(section,notice){
  routes.push({section,notice});missions.replaceChildren();ctx.document.body.replaceChildren(missions);
  return c.mountMissions(missions,section,notice);
 },
 closeMissions(){c.unmountMissions();ctx.document.body.replaceChildren();}
};
const complete=n=>{ctx.clearedGyms.splice(0,ctx.clearedGyms.length,...allBadges.slice(0,n));};
const buttons=()=>ctx.document.body.all().filter(node=>node.tagName==='button');
const button=label=>{const found=buttons().find(node=>node.textContent===label);assert(found,'missing button '+label);return found;};
(async()=>{
 assert.equal(c.capacity(),2);assert(!ctx.masterGymsUnlocked());complete(8);assert(ctx.masterGymsUnlocked());assert(ctx.masterGymsUnlocked(ctx.gymTeams[0]));assert(!ctx.masterGymsUnlocked(ctx.gymTeams[8]));assert.equal(c.capacity(),4);checks++;
 complete(32);assert.equal(c.capacity(),6);complete(31);assert.equal(c.capacity(),4);checks++;
 complete(8);settings.ai.Pikachu={mode:'Advanced',gambits:[{move:'Tackle'}]};settings.held.Pikachu='Leftovers';settings.battlePlan='Burst';
 c.savePreset(0,'Water counter');assert.equal(settings.campaign.presets[0].battlePlan,'Burst');assert.equal(settings.campaign.presets[0].ai.Pikachu.mode,'Advanced');checks++;
 ctx.team.splice(0,2,'Squirtle');settings.held={};settings.ai={};settings.battlePlan='Balanced';c.loadPreset(0);assert.deepEqual([...ctx.team],['Pikachu','Squirtle']);assert.equal(settings.battlePlan,'Burst');assert.equal(settings.held.Pikachu,'Leftovers');checks++;
 const before=JSON.stringify({team:ctx.team,held:settings.held,loadouts:ctx.loadouts});delete settings.owned.Pikachu;assert.throws(()=>c.loadPreset(0),/no longer/);assert.equal(JSON.stringify({team:ctx.team,held:settings.held,loadouts:ctx.loadouts}),before);settings.owned.Pikachu={level:50,xp:0};checks++;
 settings.held={Charizard:'Leftovers'};assert.throws(()=>c.loadPreset(0),/No available/);assert.deepEqual(settings.held,{Charizard:'Leftovers'});checks++;
 ctx.phase='contract-battle';assert.throws(()=>c.savePreset(0,'Bad time'),/Finish/);ctx.phase='home';assert.throws(()=>c.savePreset(4,'Locked'),/locked/);checks++;
 settings.campaign.presets[0].moves.Pikachu=['Invalid Move'];assert.throws(()=>c.loadPreset(0),/unavailable/);settings.campaign.presets[0].moves.Pikachu=['Tackle'];checks++;
 const campaign=new Node('section');c.entrance(campaign);assert.equal(campaign.children[0].textContent,'Regional missions');await campaign.children[0].onclick();
 assert.equal(routes.at(-1).section,'regions');assert.equal(button('Regional rewards').attributes['aria-pressed'],'true');assert(!buttons().some(b=>b.textContent==='Cosmetics'));
 assert.equal(button('Claim standard reward').disabled,false);await button('Claim standard reward').onclick();assert.equal(settings.coins,2000);assert.equal(settings.vitamins['Rare Candy'],1);
 const again=buttons().find(node=>node.textContent==='Standard reward claimed');assert(again.disabled);checks++;
 assert.equal(button('Claim All').disabled,true);
 complete(16);ctx.masterGymClears=new Set(allBadges.slice(0,8));await c.open('regions');
 assert.equal(ctx.document.body.all().find(node=>node.id==='campaign-reward-count').textContent,'2 bundles available');
 const previousSave=ctx.saveWildProgress,previousInventory=JSON.stringify(settings);ctx.saveWildProgress=()=>false;
 await button('Claim All').onclick();assert.equal(JSON.stringify(settings),previousInventory,'failed storage leaves both receipts and rewards untouched');
 assert.match(ctx.document.body.querySelector('.campaign-message').textContent,/Could not save/);ctx.saveWildProgress=previousSave;
 const bulk=button('Claim All'),saveCount=saves;await Promise.all([bulk.onclick(),bulk.onclick()]);
 assert.equal(saves,saveCount+1);assert.equal(settings.coins,9000);assert.equal(settings.vitamins['Rare Candy'],4);assert.equal(settings.vitamins['EXP Candy 500'],4);
 assert.deepEqual([...settings.campaign.claimed].sort(),['master:Kanto','standard:Johto','standard:Kanto']);
 assert(button('Claim All').disabled);assert.equal(ctx.document.body.all().find(node=>node.id==='campaign-reward-count').textContent,'0 bundles available');
 complete(24);await c.open('regions');await button('Claim All').onclick();assert.match(ctx.document.body.querySelector('.campaign-message').textContent,/1 regional bundle · 4,500 coins/);checks++;
 // A slow status read started before a successful cloud claim cannot restore stale receipts.
 complete(32);storage.set('arena-online-user','trainer');const fromGuest=[...settings.campaign.claimed];let finishRead,finishClaim,requests=0;
 ctx.window.arenaCampaignRead=()=>new Promise(resolve=>{finishRead=resolve;});
 ctx.window.arenaCampaignMutate=(action,args)=>{assert.equal(action,'claim_all_regions');assert.equal(Object.keys(args).length,0);requests++;return new Promise(resolve=>{finishClaim=resolve;});};
 const opening=c.open('regions'),pendingBulk=button('Claim All'),pendingClick=pendingBulk.onclick();
 await pendingBulk.onclick();assert.equal(requests,1);assert(button('Claim All').disabled);
 const earned=[...fromGuest,'standard:Sinnoh'];finishClaim({campaign:{claimed:earned,hunt:null},claimed_count:1,reward:{coins:6000,vitamins:{'Rare Candy':2,'EXP Candy 500':2}},message:'Claimed 1 regional bundle.'});
 await pendingClick;finishRead({claimed:fromGuest,hunt:null});await opening;assert(button('Claim All').disabled);assert.deepEqual([...settings.campaign.claimed],earned);
 assert.match(ctx.document.body.querySelector('.campaign-message').textContent,/6,000 coins/);storage.delete('arena-online-user');checks++;
 c.family('Pikachu');assert.equal(c.family('Pikachu'),c.family('Raichu'));checks++;
 complete(24);await c.open('hunts');const familyButtons=buttons().filter(node=>node.textContent.includes(' family · Lv.'));assert.equal(familyButtons.length,9);await familyButtons[0].onclick();assert.equal(settings.campaign.hunt.remaining,20);assert(buttons().filter(node=>node.textContent.includes(' family · Lv.')).every(node=>node.disabled));checks++;
 const hunt=settings.campaign.hunt;let attempted=0;const eligible=Object.keys(dex).filter(name=>c.family(name)===hunt.root && !ctx.isLegendaryEncounter(name));
 for(let i=0;i<20;i++){const chosen=c.pickEncounter(eligible,hunt.region,eligible[0]);assert(eligible.includes(chosen));attempted++;}assert.equal(hunt.remaining,0);c.pickEncounter(eligible,hunt.region,eligible[0]);assert.equal(hunt.remaining,0);checks++;
 hunt.remaining=3;assert.equal(c.pickEncounter(['Mewtwo'],hunt.region,'Mewtwo'),'Mewtwo');assert.equal(hunt.remaining,2);checks++;
 const held=hunt.remaining;c.pickEncounter(eligible,'Paldea',eligible[0]);assert.equal(hunt.remaining,held);checks++;
 complete(50);await c.open('hunts');assert.equal(buttons().filter(node=>node.textContent.includes(' family · Lv.')).length,36);checks++;
 ctx.masterGymClears=new Set(allBadges.slice(0,8));assert(c.titles().includes('Kanto Master'));assert(!c.titles().includes('Champion'));settings.campaign.appearance='Kanto';assert.equal(c.appearance(),'Kanto');settings.campaign.appearance='Paldea';assert.equal(c.appearance(),'');checks++;
 complete(68);assert(c.titles().includes('Champion'));checks++;
 await c.open('contracts');assert.equal(buttons().filter(node=>node.textContent==='Challenge').length,4);checks++;
 const ui=read('index.html');assert(ui.includes("!['setup','battle','contract-battle'].includes(phase)"));assert(ui.includes('paintTrim(ctx,arenaWidth,arenaHeight)'));assert(ui.includes('campaign-progression.js?v='));checks++;
 const cloud=read('cloud.js');assert(cloud.includes("operation.service??'market'"));assert(cloud.includes("service==='campaign'?'arena_campaign':'arena_market'"));assert(cloud.includes("body:{campaign,run_id}"));assert(cloud.includes('expected_revision:cloudRevision'));checks++;

 // Play an actual guest contract through the UI adapter and generated engine.
 for(const name of ['allies','enemies','trainerFields','pendingCasts','effects','damageBuckets','arenaSkillFields'])ctx[name]=[];
 for(const name of ['clock','lastDamageClock','onlineMatchDuration','visualTime','weatherTime','terrainTime'])ctx[name]=0;
 for(const name of ['arenaMap','battleWeather','battleTerrain','entryHazards','fieldMoveExpiry','selectedGym','selectedWild','selectedTrainer','rogueRun','raidBattleBackdrop','activePlayer','activeEnemy','playerSwitch','enemySwitch','trainerPanels','recallSlot'])ctx[name]={stale:true};
 ctx.lastDpsRender=9;let rosterBuilds=0,scoreUpdates=0,soundPlays=0;
 ctx.selectedMasterGym=false;ctx.openMenu=()=>ctx.phase='home';ctx.showScreen=()=>{};ctx.stopBattleMusic=ctx.startBattleMusic=ctx.unlockSkillSound=ctx.setArenaDimensions=ctx.updateAutoReserveToggle=ctx.updateNormalAttackToggle=ctx.updateBattleRosters=ctx.renderBattleDps=()=>{};
 ctx.renderBattleRosters=()=>rosterBuilds++;ctx.updateScore=()=>scoreUpdates++;ctx.playSkillSound=()=>soundPlays++;
 let currentActor=null;ctx.updateActivePanels=slots=>{currentActor=slots[0]?.[0]?.actor??null;};
 ctx.readArenaSave=()=>({version:2,entries:{'pokemon-arena-team':'["Mewtwo"]','pokemon-arena-moves':JSON.stringify({Mewtwo:['Psystrike','Aura Sphere','Ice Beam','Recover']}),
  'pokemon-arena-profiles':JSON.stringify({150:{pid:15,ivs:Array(6).fill(31),evs:[4,0,0,252,0,252],abilityOverride:'Pressure'}}),
  'pokemon-arena-wild-progress':JSON.stringify({owned:{Mewtwo:{level:100,xp:0}},held:{Mewtwo:'Leftovers'},items:{Leftovers:1},ai:{Mewtwo:{style:'Aggressive',position:'Auto'}}})}});
 const beforeCoins=settings.coins;await button('Challenge').onclick();assert.equal(ctx.phase,'contract-battle');assert(nodes.get('reset').disabled);
 assert.equal(rosterBuilds,1);assert.equal(ctx.playerSwitch,null);assert.equal(ctx.enemySwitch,null);assert.equal(ctx.trainerPanels,null);assert.equal(ctx.lastDpsRender,-1);assert(nodes.get('legendary-intro').hidden);assert(nodes.get('next-gym').hidden);assert(nodes.get('start').disabled);checks++;
 c.advanceBattle(1/30);const firstActor=currentActor;c.advanceBattle(1/30);assert.equal(currentActor,firstActor,'UI keeps actor identities across frames');checks++;
 for(let i=0;i<10000 && ctx.phase==='contract-battle';i++)c.advanceBattle(1/30);
 assert.equal(ctx.phase,'home');assert(settings.coins>beforeCoins,'real contract pays its bundle');assert(!nodes.get('reset').disabled);assert.equal(rosterBuilds,1,'roster cards are built once for the current actors');assert(scoreUpdates>10);assert(soundPlays>0,'live contract plays skill sounds');checks++;
 assert.equal(routes.at(-1).section,'contracts');assert.match(routes.at(-1).notice,/rewards received/);assert.equal(button('Contracts').attributes['aria-pressed'],'true');
 await button('Challenge').onclick();assert.equal(ctx.phase,'contract-battle');await nodes.get('choices').children.find(node=>node.textContent==='Abandon contract').onclick();assert.equal(ctx.phase,'home');assert(!nodes.get('basic-attacks').disabled);assert.equal(routes.at(-1).section,'contracts');checks++;
 console.log(JSON.stringify({campaignClientChecks:checks,presetAtomicity:true,regionalUnlocks:true,huntLimits:true,cosmetics:true}));
})().catch(error=>{console.error(error);process.exitCode=1;});
