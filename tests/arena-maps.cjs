const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html'),art=read('assets/arena-maps.js');
let checks=0,calls=0,seed=5537;
const math=Object.create(Math);math.random=()=>{calls++;seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const geometry=vm.createContext({Math:math,canvas:{width:960,height:480},clamp:(value,low,high)=>Math.max(low,Math.min(high,value))});
const geometrySource=html.slice(html.indexOf('const arenaBiomes=['),html.indexOf('const megaRaidArenaSize='));
vm.runInContext(geometrySource+html.slice(html.indexOf('function arenaBonus('),html.indexOf('// Arena tactics:'))+
 '\nglobalThis.biomes=arenaBiomes;globalThis.useMap=value=>arenaMap=value;',geometry);
const json=value=>JSON.parse(JSON.stringify(value));
const mirrorZone=zone=>({...zone,x:960-zone.x,vertices:zone.vertices?.map(([x,y])=>[-x,y]),patches:zone.patches?.map(([x,y,rx,ry])=>[-x,y,rx,ry])});
const maps=[],types=new Set();
for(let i=0;i<500;i++){
 const before=calls,map=geometry.randomArenaMap();assert.equal(calls-before,16,'visual seeds must not add combat random draws');
 assert.equal(map.zones.length,3);assert.deepEqual(json(map.rocks),[]);assert(Number.isSafeInteger(map.seed));types.add(map.type);
 for(const zone of map.zones){
  assert(zone.x-zone.w>=32 && zone.x+zone.w<=928);assert(zone.y-zone.h>=32 && zone.y+zone.h<=448);
  assert(geometry.arenaZoneContains(zone,zone.x,zone.y));assert(!geometry.arenaZoneContains(zone,zone.x+zone.w*1.1,zone.y+zone.h*1.1));
  if(zone.patches)for(const [x,y,rx,ry] of zone.patches)assert([x,y,rx,ry].every(Number.isFinite) && rx>0 && ry>0);
  if(i<100)for(let j=0;j<20;j++){
   const x=zone.x+zone.w*(j/9-1),y=zone.y+zone.h*Math.sin(j*1.7);
   assert.equal(geometry.arenaZoneContains(zone,x,y),geometry.arenaZoneContains(mirrorZone(zone),960-x,y),'mirrored bonus footprint');
   if(zone.patches){
    const nx=(x-zone.x)/zone.w,ny=(y-zone.y)/zone.h;
    const expected=zone.patches.some(p=>Math.hypot((nx-p[0])/p[2],(ny-p[1])/p[3])<=1+1e-9);
    assert.equal(geometry.arenaZoneContains(zone,x,y),expected,'visible ellipse union matches bonus region');
   }
  }
 }
 if(!maps.some(other=>other.type===map.type))maps.push(json(map));
}
assert.equal(types.size,18);checks++;
for(const shape of ['ellipse','rectangle','diamond']){
 const zone={x:180,y:120,w:70,h:50,shape};assert(geometry.arenaZoneContains(zone,180,120));assert(!geometry.arenaZoneContains(zone,300,120));
 assert.equal(geometry.arenaZoneContains(zone,240,160),shape==='rectangle');
}
assert(!geometry.arenaZoneContains({x:0,y:0,w:0,h:5},0,0));checks++;
const grass=maps.find(map=>map.type==='Grass');geometry.useMap(grass);
assert(geometry.arenaBonus({x:grass.zones[0].x,y:grass.zones[0].y},'Grass'));
assert(!geometry.arenaBonus({x:grass.zones[0].x,y:grass.zones[0].y},'Fire'));
assert(!geometry.arenaBonus({x:32,y:32},'Grass'));
geometry.useMap({...grass,raid:true,zones:[]});assert(geometry.arenaBonus({x:32,y:32},'Grass'));checks++;
// A recording Canvas verifies every biome without adding a native CI dependency.
let canvasCount=0;
function makeCanvas(){
 const image={width:0,height:0,id:++canvasCount,commands:[]};
 const context=new Proxy({canvas:image},{
  get(target,key){
   if(key in target)return target[key];
   return (...args)=>{
    for(const arg of args)if(typeof arg==='number')assert(Number.isFinite(arg),'nonfinite Canvas '+key);
    image.commands.push([key,...args.map(value=>value?.commands?{canvas:hash(value.commands),width:value.width,height:value.height}:value)]);
   };
  },
  set(target,key,value){target[key]=value;image.commands.push(['set',key,value]);return true;},
 });
 image.getContext=()=>context;return image;
}
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const renderMath=Object.create(Math);renderMath.random=()=>{throw Error('Rendering must not consume combat RNG');};
const rendererVM=vm.createContext({Math:renderMath,document:{createElement:tag=>{assert.equal(tag,'canvas');return makeCanvas();}}});
vm.runInContext(art,rendererVM);const renderer=rendererVM.ArenaMapRenderer;
assert.deepEqual(Object.keys(renderer.themes).sort(),[...types].sort());checks++;
const unique=new Set();
for(const map of maps){
 const snapshot=JSON.stringify(map),surface=makeCanvas();renderer.draw(surface.getContext('2d'),map,960,480);
 assert.equal(JSON.stringify(map),snapshot,'visual renderer cannot mutate authoritative map state');
 assert(surface.commands.some(command=>command[0]==='drawImage'));unique.add(hash(surface.commands));
 const cached=renderer.cacheInfo().builds;
 renderer.draw(surface.getContext('2d'),json(map),960,480);assert.equal(renderer.cacheInfo().builds,cached,'fresh online snapshot reuses cached scenery');
 assert(renderer.cacheInfo().entries<=4,'bounded map cache');
}
assert.equal(unique.size,18);checks++;
renderer.clearCache();const map={...grass,zones:grass.zones.map(zone=>({...zone,x:Math.round(zone.x),y:Math.round(zone.y)}))};
const first=makeCanvas(),second=makeCanvas();renderer.draw(first.getContext('2d'),map,960,480);
renderer.draw(second.getContext('2d'),{...map,viewMirror:true,zones:map.zones.map(mirrorZone)},960,480);
assert.equal(renderer.cacheInfo().builds,1,'host and guest share a canonical scenery image');
assert(second.commands.some(command=>command[0]==='scale' && command[1]===-1));checks++;
renderer.draw(makeCanvas().getContext('2d'),{...map,phase:3,meteors:[{x:200,y:200}]},960,480);
assert.equal(renderer.cacheInfo().builds,1,'raid phases and meteors cannot rebuild static scenery');checks++;
renderer.draw(makeCanvas().getContext('2d'),map,1200,600);assert.equal(renderer.cacheInfo().builds,2,'resolution change rebuilds once');checks++;
for(const shape of ['ellipse','rectangle','diamond'])renderer.draw(makeCanvas().getContext('2d'),{type:'Water',zones:[{x:120,y:120,r:50,shape}]},960,480);
renderer.draw(makeCanvas().getContext('2d'),null,960,480);checks++;
const paint=html.slice(html.indexOf('function paint()'),html.indexOf('function drawExhaustedAlert('));
assert(!paint.includes('x/40+y/40'));assert(!paint.includes('ctx.fillStyle=arenaMap.zone'));assert(!paint.includes('arenaWidth/2,24'));
assert(paint.indexOf('renderer.draw')<paint.indexOf('drawSkillWarning'));assert(paint.indexOf('drawSkillWarning')<paint.indexOf('drawUnit'));
assert(paint.includes('raidBattleBackdrop?.naturalWidth'),'existing custom raid images remain in use');checks++;
const multiplayer=read('multiplayer.js');assert(multiplayer.includes('viewMirror:mirror'));assert(multiplayer.includes('patches:zone.patches?.map(([x,y,rx,ry])=>[dx(x),y,rx,ry])'));checks++;
for(const file of ['index.html','local-test/PokeArena_Local_Test.html']){
 const source=read(file),script=source.match(/<script src="([^"]*arena-maps\.js\?v=\d+\.\d+\.\d+)"/);
 assert(script,'versioned map renderer');assert(source.indexOf(script[1])<source.indexOf('<script>'));
 for(const [,asset] of source.matchAll(/<script src="([^"?]+)\?v=[^"]+"/g))assert(fs.existsSync(path.join(root,path.dirname(file),asset)),file+' '+asset);
}
checks++;
(async()=>{
 const {simulateOnline,onlineView}=await import('../supabase/functions/arena-combat/engine.js');
 for(const seed of [15,327,990]){
  const match={id:seed.toString(16).padStart(8,'0')+'-1111-4111-8111-111111111111',mode:'unranked',format:1,host_pick:['Mewtwo'],guest_pick:['Malamar'],host_entries:{},guest_entries:{}};
  const {state}=simulateOnline(match,null,0,null,'host'),view=onlineView(state,'guest','unranked');
  assert.deepEqual(view.arenaMap.zones,state.arenaMap.zones);assert.equal(view.arenaMap.seed,state.arenaMap.seed);
  const recovered=simulateOnline(match,JSON.parse(JSON.stringify(state)),1,null,'host');assert.deepEqual(recovered.state.arenaMap.zones,state.arenaMap.zones);
 }
 checks++;console.log(JSON.stringify({mapChecks:checks,generatedMaps:500,biomes:types.size,distinctRenders:unique.size,legacyRecovery:true,mirrorParity:true,cacheLimit:4}));
})().catch(error=>{console.error(error);process.exitCode=1;});
