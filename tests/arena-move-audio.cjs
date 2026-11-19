const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const html=read('index.html'),local=read('local-test/PokeArena_Local_Test.html');
const files=['arena-sound-bank','arena-sound-score','arena-sound'].map(name=>'assets/'+name+'.js');
const assetUrls=page=>[...page.matchAll(/<script src="([^"]*\/assets\/arena-sound[^"]*)"><\/script>/g)].map(m=>m[1]);
const urls=assetUrls(html);assert.equal(urls.length,files.length);
for(const [i,url] of urls.entries()){
 const [file,query]=url.split('?');assert.equal(file,'./'+files[i]);assert.match(query,/^v=\d+\.\d+\.\d+$/);
}
assert.deepEqual(assetUrls(local),urls.map(url=>'.'+url),'local and hosted pages use the same versioned assets');
const ctx=vm.createContext({atob});
for(const file of files)vm.runInContext(read(file),ctx);
const {ArenaMoveAudio:audio,ArenaSoundBank:bank,ArenaMoveScores:scores}=ctx;
const names=Object.keys(JSON.parse(html.match(/^const moveCatalog = (.*);$/m)[1]));
assert(names.length>=846);
assert.deepEqual([...scores.keys()].sort(),[...names,'Normal Attack','Struggle'].sort());
function digest(wave){return createHash('sha256').update(Buffer.from(wave.buffer)).digest('hex');}
const seen=new Set();
for(const name of scores.keys())for(const phase of ['warning','release','impact']){
 const wave=audio.render(name,phase);
 assert(wave.length>=.035*bank.sampleRate && wave.length<=2*bank.sampleRate,name+' duration');
 let peak=0,energy=0;
 for(const sample of wave){peak=Math.max(peak,Math.abs(sample));energy+=sample*sample;}
 assert(peak<=.911 && Math.sqrt(energy/wave.length)>.02,name+' '+phase+' invalid or silent');
 if(phase==='release'){
  const hash=digest(wave);assert(!seen.has(hash),'identical releases: '+name);seen.add(hash);
 }
}
assert.equal(digest(audio.render('Surf')),digest(audio.render('Surf')),'render is deterministic');
for(const [move,variants] of [['Weather Ball',['Rain','Sun','Sand','Snow']],['Terrain Pulse',['Electric','Grass','Fairy','Psychic']]]){
 for(const phase of ['release','impact']){
  const versions=['',...variants].map(variant=>digest(audio.render(move,phase,variant)));
  assert.equal(new Set(versions).size,5,move+' '+phase);
 }
}
for(const move of ['Hyper Beam','Explosion','Misty Explosion','Self-Destruct']){
 const stages=['warning','charge1','charge2','charge3','release'].map(phase=>digest(audio.render(move,phase)));
 assert.equal(new Set(stages).size,5,move+' charge stages');
}
assert.equal(audio.render('Unknown Move'),null);
assert.equal(audio.render('Tackle','charge1'),null);

// Exercise the browser adapter, gain controls, voice budget and scheduled strikes on a Web Audio test graph.
class Parameter{
 constructor(){this.calls=[];this.value=1;}
 setValueAtTime(...args){this.value=args[0];this.calls.push(args);}
 setTargetAtTime(...args){this.value=args[0];this.calls.push(args);}
}
class AudioNode{
 connect(output){this.output=output;return output;}
 disconnect(){this.output=null;}
}
class Context{
 constructor(){
  this.state='running';this.currentTime=8;this.destination={};this.started=[];this.buffers=0;this.masters=[];
 }
 createDynamicsCompressor(){
  const node=new AudioNode();
  for(const key of ['threshold','knee','ratio','attack','release'])node[key]=new Parameter();
  return node;
 }
 createGain(){const node=new AudioNode();node.gain=new Parameter();this.masters.push(node);return node;}
 createBuffer(channels,length,rate){
  assert.equal(channels,1);assert.equal(rate,bank.sampleRate);this.buffers++;
  const data=new Float32Array(length);return {length,duration:length/rate,getChannelData:()=>data};
 }
 createBufferSource(){
  const node=new AudioNode();node.start=at=>{node.at=at;this.started.push(node);};
  node.stop=()=>{node.stopped=true;};return node;
 }
 resume(){this.state='running';return Promise.resolve();}
}
const web=new Context();Object.assign(ctx,{musicContext:web,sfxVolume:.45,skillSoundEnabled:true,speed:4,phase:'battle',
 abilityWeather:()=>'Rain',battleTerrain:'Electric',window:{AudioContext:Context}});
const apiStart=html.indexOf('function unlockSkillSound()'),apiEnd=html.indexOf('function updateSfxButton()',apiStart);
vm.runInContext(html.slice(apiStart,apiEnd),ctx);
ctx.playSkillSound('Weather Ball','impact',undefined,.2);
assert.equal(web.started[0].at,8.05,'4× impact follows local strike animation');
assert.deepEqual(web.masters[0].gain.calls,[[.45,8]]);
assert.equal(digest(web.started[0].buffer.getChannelData(0)),digest(audio.render('Weather Ball','impact','Rain')));
ctx.phase='online-battle';ctx.playSkillSound('Weather Ball','impact',undefined,.2,'Snow');
assert.equal(web.started[1].at,8.2);assert.equal(digest(web.started[1].buffer.getChannelData(0)),digest(audio.render('Weather Ball','impact','Snow')));
ctx.playSkillSound('Weather Ball','impact',undefined,0,'Snow');assert.equal(web.buffers,2,'reuses rendered audio');
ctx.skillSoundEnabled=false;ctx.playSkillSound('Pound','release');ctx.skillSoundEnabled=true;
ctx.sfxVolume=0;ctx.playSkillSound('Pound','release');ctx.sfxVolume=.6;
web.state='suspended';ctx.playSkillSound('Pound','release');assert.equal(web.started.length,3);
ctx.unlockSkillSound();assert.equal(web.state,'running');ctx.playSkillSound('Pound','release');
audio.setVolume(web,.25);assert.equal(web.masters[0].gain.value,.25);
audio.stop(web);assert(web.started.every(node=>node.stopped && node.output===null));
const noBank=vm.createContext({atob,ArenaMoveScores:scores});
vm.runInContext(read('assets/arena-sound.js'),noBank);
assert.equal(noBank.ArenaMoveAudio.play(web,'Thunder','release'),false,'combat can proceed when an audio asset is unavailable');
const crowd=new Context();
for(let i=0;i<32;i++)assert(audio.play(crowd,'Normal Attack','impact'));
assert(audio.play(crowd,'Thunder','release'));assert.equal(crowd.started.filter(n=>n.stopped).length,1);
assert(crowd.started.find(n=>!n.stopped).output.gain.value<crowd.started.at(-1).output.gain.value);
for(let i=0;i<32;i++)audio.play(crowd,'Protect','release');
assert.equal(audio.play(crowd,'Normal Attack','impact'),false);
assert.equal(crowd.started.filter(n=>!n.stopped).length,32);
audio.stop(crowd);
const cache=new Context();audio.play(cache,'Absorb','release');
for(const move of names){cache.currentTime+=2;audio.play(cache,move,'release');}
const builds=cache.buffers;cache.currentTime+=2;audio.play(cache,'Absorb','release');
assert.equal(cache.buffers,builds+1,'older sounds are evicted from the bounded cache');

// Adjacent snapshots repeat sounds. Two battlers can release the same move on the very same tick.
const timeline=audio.createTimeline(),output=[];
const emit=(...args)=>output.push(args),shared={clock:7,move:'Thunder',event:'release'};
const events=[{...shared,order:0},{...shared,order:1},{clock:7.1,order:0,move:'Weather Ball',event:'impact',delay:.1,variant:'Snow'}];
timeline.collect(events,7.1);timeline.collect(events,7.15);timeline.advance(6.9,emit);assert.equal(output.length,0);
timeline.advance(7,emit);assert.equal(output.length,2);timeline.advance(7.18,emit);assert.equal(output.length,2);
timeline.advance(7.2,emit);assert.equal(output.length,3);assert.deepEqual(output.at(-1),['Weather Ball','impact',undefined,0,'Snow']);
timeline.collect(events,7.3);timeline.advance(7.3,emit);assert.equal(output.length,3);
timeline.collect([{...shared,clock:8,order:0}],8.8);timeline.advance(8.8,emit);assert.equal(output.length,3,'reconnect skips stale impacts');
const older=audio.createTimeline();
older.collect([shared,shared],7);older.advance(7,emit);older.collect([shared,shared],7.1);older.advance(7.1,emit);
assert.equal(output.length,5,'old snapshots preserve simultaneous releases and do not double-play');
console.log(seen.size+' distinct audible releases ('+names.length+' catalog moves plus Normal Attack and Struggle), '+Object.keys(bank.clips).length+' instruments. Volume, priority, cache, speed and snapshot audio checks passed.');
