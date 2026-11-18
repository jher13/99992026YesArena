const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const data=name=>JSON.parse(html.match(new RegExp('^const '+name+'\\s*=\\s*(.+);$','m'))[1]);
const dex=data('dex'),forms=data('speciesForms'),pmd=data('pmdData'),stats=data('dexStats'),learn=data('pokemonLearnsets'),levelup=data('levelUpMoves'),catalog=data('moveCatalog'),abilities=data('speciesAbilities'),evo=data('evolutionData'),icons=data('iconBounds');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/roster-expansion.json'),'utf8'));
let checks=0;
assert.equal(Object.keys(dex).length,1083);assert.equal(new Set(Object.values(dex).map(row=>row[0])).size,1083);assert.equal(Object.keys(forms).length,58);checks++;
const ids=new Map(Object.entries(dex).map(([name,[id]])=>[id,name]));for(let id=1;id<=1025;id++)assert(ids.has(id),'missing National Dex '+id);checks++;
for(const entry of manifest.species){const id=entry.id,name=entry.name;
 assert.equal(dex[name][0],id);assert(stats[id-1].length===6 && stats[id-1].every(n=>Number.isInteger(n)&&n>0));
 assert(learn[id].length>=4);assert(learn[id].every(move=>catalog[move]),name+' has an unsupported skill');assert(abilities[id][0].length);assert(evo[id]);assert(icons[id-1]?.[2]>0);
 if(forms[id]){assert.equal(forms[id].dex,entry.dex);assert.equal(forms[id].api,entry.api);assert.notEqual(id,entry.dex);}
}checks++;
assert.deepEqual(stats[997],[115,145,92,87,86,75]);assert.deepEqual(stats[982],[100,135,120,50,85,60]);checks++;
const raichu=dex['Alolan Raichu'][0];assert.deepEqual(stats[raichu-1],[60,85,50,110,85,95]);assert.deepEqual(dex['Alolan Raichu'].slice(1,3),['Electric','Psychic']);assert.notEqual(raichu,dex.Raichu[0]);checks++;
const ctx=vm.createContext({dex,speciesForms:forms,pmdData:pmd,iconBounds:icons});
vm.runInContext(html.slice(html.indexOf('function nationalDexId('),html.indexOf('const dexNames =')),ctx);
vm.runInContext(html.slice(html.indexOf('const generationEnds ='),html.indexOf('const boxSize ='))+'\nglobalThis.gen=generationOf;',ctx);
vm.runInContext(html.slice(html.indexOf('function dexNumber('),html.indexOf('function pokemonNameplate(')),ctx);
assert.equal(ctx.dexNumber('Alolan Raichu'),'#0026');assert.equal(ctx.gen('Alolan Raichu'),7);assert.equal(ctx.gen('Hisuian Growlithe'),8);assert.equal(ctx.gen('Pecharunt'),9);checks++;
for(const entry of manifest.species)assert(ctx.isAvailablePokemon(entry.name));checks++;
for(const entry of manifest.species)if(pmd.motions[entry.id]){
 for(const directions of Object.values(pmd.motions[entry.id]))for(const row of directions)if(row)for(const [index,x,y,time] of row){
  const [page,sx,sy,width,height]=pmd.rects[index];assert(fs.existsSync(path.join(root,pmd.pages[page])));assert([sx,sy,width,height,x,y,time].every(Number.isFinite));assert(width>0&&height>0&&time>0);
 }
}checks++;
const source=html.match(/const legendarySpecies=new Set\((\[.*?\])\);/)[1];const rare=new Set(JSON.parse(source));
for(const name of ['Koraidon','Miraidon','Ogerpon','Terapagos','Pecharunt','Galarian Articuno'])assert(rare.has(dex[name][0]),name+' must use legendary capture rules');assert(!rare.has(dex.Baxcalibur[0]));checks++;
assert(learn[dex.Girafarig[0]].includes('Twin Beam'));assert(learn[dex.Dunsparce[0]].includes('Hyper Drill'));assert(learn[dex.Dipplin[0]].includes('Dragon Cheer'));checks++;
// Play each new species/form with its own legal moves and saved profile.
(async()=>{
 const {simulateOnline,onlineView}=await import('../supabase/functions/arena-combat/engine.js');
 const profile={pid:15,ivs:Array(6).fill(31),evs:[4,0,0,252,0,252]};
 const entries=name=>({'pokemon-arena-profiles':JSON.stringify({[dex[name][0]]:profile}),
  'pokemon-arena-moves':JSON.stringify({[name]:learn[dex[name][0]].filter(move=>catalog[move][1]>0).slice(-4)}),
  'pokemon-arena-wild-progress':JSON.stringify({owned:{[name]:{level:100,xp:0}},ai:{[name]:{style:'Aggressive',position:'Auto'}}})});
 let battles=0,timeouts=0;
 for(const entry of manifest.species){const match={id:(30000+entry.id).toString(16).padStart(8,'0')+'-1111-4111-8111-111111111111',mode:'unranked',format:1,host_pick:[entry.name],guest_pick:['Mewtwo'],host_entries:entries(entry.name),guest_entries:entries('Mewtwo')};
  let state=null,result=null;
  for(let second=0;second<301&&!result;second++){
   const next=simulateOnline(match,state,60,null,'host');state=JSON.parse(JSON.stringify(next.state));result=next.result;
   for(const actor of [...state.allies,...state.enemies])for(const value of [actor.hp,actor.max,actor.x,actor.y,...actor.stats])assert(Number.isFinite(value),entry.name+' has invalid combat state');
  }
  assert(result,entry.name+' did not resolve');if(state.clock>=299.99&&state.allies.some(a=>a.hp>0)&&state.enemies.some(a=>a.hp>0))timeouts++;
  assert(onlineView(state,'host','unranked').actors.length);battles++;
 }
 assert.equal(timeouts,0);console.log(JSON.stringify({rosterChecks:checks,newSpecies:45,regionalForms:58,seededBattles:battles,timeouts}));
})().catch(error=>{console.error(error);process.exitCode=1;});
