/* Score player shared by the local arena, regional contracts, PvP and co-op. */
(() => {
  'use strict';
  const instruments=new Map(),players=new WeakMap();
  const levels=Float32Array.from({length:256},(_,i)=>{
    const u=(i-128)/127;
    return Math.sign(u)*Math.expm1(Math.abs(u)*Math.log(256))/255;
  });
  const variants={
    'Weather Ball':{
      Rain:['bubble:2 jet:3@59 splash:3@132','splash:3'],
      Sun:['ember:3 fireball:3@54 flame:3@128','flame:3'],
      Sand:['sand:2 spin:2@52 rock:4@124','gravel:2'],
      Snow:['frost:2 ice:4@58 shard:2@128','shatter:3']
    },
    'Terrain Pulse':{
      Electric:['ripple:2 coil:3@44 arc:2@113','zap:3'],
      Grass:['root:2 pulse:4@53 leaf:3@115','seed:3'],
      Fairy:['pollen:2 pulse:3@53 shimmer:4@115','chime:5'],
      Psychic:['sonar:2 pulse:2@53 mind:4@115','pulse:3']
    }
  };
  const chargeCues={
    'Hyper Beam':['coil:-1 ray@51*.45','coil:4 ray:5@42*.5','charge:8 ping:6@32*.48'],
    Explosion:['fuse:-2 tick:-3@35','tick:2 fuse:3@23','tick:7 tick:10@70'],
    'Self-Destruct':['tick:-1 fuse:1@29','tick:3 fuse:5@22','tick:6 tick:9@62'],
    'Misty Explosion':['chime:-2 fuse:2@35','tick:4 star:3@42','tick:8 star:7@55']
  };
  function score(move,event,variant){
    const entry=globalThis.ArenaMoveScores?.get(move);
    if(!entry)return;
    if(event==='warning')return entry.warning;
    if(event==='release'||event==='impact'){
      const alternative=Object.hasOwn(variants,move)&&Object.hasOwn(variants[move],variant)?variants[move][variant]:null;
      return alternative?alternative[event==='release'?0:1]:entry[event];
    }
    if(['charge1','charge2','charge3'].includes(event))return chargeCues[move]?.[Number(event.at(-1))-1];
  }
  function instrument(name){
    let samples=instruments.get(name);
    if(samples)return samples;
    const bank=globalThis.ArenaSoundBank;
    if(!bank||!Object.hasOwn(bank.clips,name))throw Error('Unknown sound instrument: '+name);
    const bytes=atob(bank.clips[name]);
    samples=new Float32Array(bytes.length);
    for(let i=0;i<samples.length;i++)samples[i]=levels[bytes.charCodeAt(i)];
    instruments.set(name,samples);
    return samples;
  }
  function renderScore(notation){
    const rate=globalThis.ArenaSoundBank.sampleRate;
    let length=0;
    const parts=notation.split(' ').map(note=>{
      const match=/^([a-zA-Z]+)(?::(-?\d+))?(?:@(\d+))?(?:\*(\d*\.?\d+))?$/.exec(note);
      if(!match)throw Error('Invalid Arena sound note: '+note);
      const [,name,pitch=0,onset=0,gain=1]=match;
      const wave=instrument(name),step=2**(Number(pitch)/12),at=Math.round(Number(onset)*rate/1000);
      const count=Math.ceil((wave.length-1)/step);
      length=Math.max(length,at+count);
      return {wave,step,at,count,gain:Number(gain)};
    });
    const mix=new Float32Array(length);
    for(const {wave,step,at,count,gain} of parts){
      for(let i=0;i<count;i++){
        const pos=i*step,lo=Math.floor(pos);
        mix[at+i]+=(wave[lo]+(wave[lo+1]-wave[lo])*(pos-lo))*gain;
      }
    }
    let peak=0;
    for(let i=0;i<length;i++)peak=Math.max(peak,Math.abs(mix[i]));
    const scale=.91/Math.max(1,peak);
    for(let i=0;i<length;i++)mix[i]*=scale;
    return mix;
  }
  function render(move,event='release',variant=''){
    const notation=score(move,event,variant);
    return notation?renderScore(notation):null;
  }

  function player(ctx){
    let state=players.get(ctx);
    if(state)return state;
    const bus=ctx.createDynamicsCompressor(),master=ctx.createGain();
    bus.threshold.value=-13;bus.knee.value=8;bus.ratio.value=7;bus.attack.value=.003;bus.release.value=.12;
    bus.connect(master);master.connect(ctx.destination);
    state={bus,master,clips:new Map(),samples:0,active:new Set(),volume:null};
    players.set(ctx,state);
    return state;
  }
  function bufferFor(ctx,state,notation){
    let buffer=state.clips.get(notation);
    if(buffer){state.clips.delete(notation);state.clips.set(notation,buffer);return buffer;}
    const mix=renderScore(notation);
    buffer=ctx.createBuffer(1,mix.length,globalThis.ArenaSoundBank.sampleRate);
    buffer.getChannelData(0).set(mix);
    state.clips.set(notation,buffer);state.samples+=buffer.length;
    // At most 8 MiB of rendered cues per context. Instrument PCM is shared across all cues.
    while(state.samples>2097152 && state.clips.size>1){
      const oldest=state.clips.keys().next().value;
      state.samples-=state.clips.get(oldest).length;state.clips.delete(oldest);
    }
    return buffer;
  }
  function setVolume(ctx,volume){
    const state=ctx&&players.get(ctx);
    if(!state||state.volume===volume)return;
    const level=Math.max(0,Math.min(1,volume));
    if(state.volume===null)state.master.gain.setValueAtTime(level,ctx.currentTime);
    else state.master.gain.setTargetAtTime(level,ctx.currentTime,.008);
    state.volume=volume;
  }
  function retire(state,voice,stop){
    if(!state.active.delete(voice))return;
    voice.source.onended=null;
    if(stop)voice.source.stop();
    voice.source.disconnect();voice.gain.disconnect();
  }
  function stop(ctx){
    const state=ctx&&players.get(ctx);
    if(state)for(const voice of state.active)retire(state,voice,true);
  }
  function play(ctx,move,event,volume=1,delay=0,variant=''){
    if(!ctx||ctx.state!=='running'||!(volume>0)||!globalThis.ArenaSoundBank)return false;
    const notation=score(move,event,variant);
    if(!notation)return false;
    const state=player(ctx),now=ctx.currentTime,basic=move==='Normal Attack';
    const priority=basic?0:event==='impact'?1:event==='release'?3:2;
    for(const old of state.active)if(old.end<=now)retire(state,old,false);
    // In a crowded raid, keep telegraphs and signature releases audible over ordinary contact.
    if(state.active.size>=32){
      let weakest;
      for(const voice of state.active)if(!weakest||voice.priority<weakest.priority)weakest=voice;
      if(weakest.priority>priority)return false;
      retire(state,weakest,true);
    }
    setVolume(ctx,volume);
    const source=ctx.createBufferSource(),gain=ctx.createGain();
    source.buffer=bufferFor(ctx,state,notation);
    gain.gain.value=basic?.095:event==='release'?.47:event==='impact'?.30:.25;
    source.connect(gain);gain.connect(state.bus);
    const at=now+Math.max(0,delay),voice={source,gain,priority,end:at+source.buffer.duration};
    state.active.add(voice);source.onended=()=>retire(state,voice,false);source.start(at);
    return true;
  }

  // Snapshot windows overlap. Remember source events, then release them against the
  // displayed battle clock. Reconnecting skips sounds whose visible action is already over.
  function createTimeline(){
    const seen=new Map();let pending=[];
    return {
      collect(sounds,latest){
        if(!Number.isFinite(latest))return;
        for(const [key,time] of seen)if(time<latest-2)seen.delete(key);
        const counts=new Map();
        for(const sound of sounds||[]){
          if(!Number.isFinite(sound.clock)||sound.clock<latest-1.1)continue;
          const fallback=[sound.clock,sound.move,sound.event,sound.shape].join('/');
          const ordinal=counts.get(fallback)||0;counts.set(fallback,ordinal+1);
          const key=sound.order==null?fallback+'/'+ordinal:sound.clock+'#'+sound.order;
          if(seen.has(key))continue;
          seen.set(key,sound.clock);
          pending.push({at:sound.clock+Math.max(0,sound.delay||0),sound});
        }
        pending=pending.filter(item=>item.at>=latest-1.25).sort((a,b)=>a.at-b.at);
      },
      advance(clock,emit){
        while(pending.length && pending[0].at<=clock+.00001){
          const {at,sound}=pending.shift();
          if(clock-at<=.22)emit(sound.move,sound.event,sound.shape,0,sound.variant||'');
        }
      }
    };
  }
  globalThis.ArenaMoveAudio={play,render,setVolume,stop,createTimeline};
})();
