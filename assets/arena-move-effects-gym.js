'use strict';
/* Artwork for Gym loadouts and regional starters. Shared by all Arena battle modes. */
globalThis.ArenaMoveEffects.addPack(function gymMoveEffects({
  technique,palettes,turn,ease,clamp,path,polygon,disc,ring,halo,star,crystal,leaf,flame,eye,note
}) {
  technique('target',hazard,'rock','Stealth Rock');
  technique('target',hazard,'silver','Spikes');
  technique('target',hazard,'venom','Toxic Spikes');
  technique('target',hazard,'prism','Sticky Web');
  technique('target',weather,'water','Rain Dance');
  technique('target',weather,'gold','Sunny Day');
  technique('target',weather,'mud','Sandstorm');
  technique('target',weather,'ice','Hail','Snowscape');
  technique('target',rest,'gold','Morning Sun');
  technique('target',rest,'mist','Milk Drink','Slack Off','Yawn');
  technique('target',rest,'ruby','Bulk Up','Taunt');
  technique('link',exchange,'mist','Pain Split');
  technique('link',exchange,'night','Parting Shot');
  technique('link',exchange,'grass','U Turn');
  technique('link',exchange,'gold','Volt Switch');
  technique('link',voice,'rock','Roar');
  technique('link',voice,'ruby','Uproar');
  technique('link',voice,'mist','Alluring Voice');
  technique('link',voice,'psychic','Extrasensory');
  technique('link',vines,'grass','Vine Whip','Power Whip','Branch Poke');
  technique('target',garden,'grass','Grass Knot','Petal Dance','Grass Pledge');
  technique('link',foliage,'grass','Leaf Storm','Leafage','Chloroblast');
  technique('ground',seedBurst,'grass','Seed Bomb');
  technique('target',blade,'sun','Solar Blade');
  technique('target',mallet,'grass','Wood Hammer');
  technique('target',mallet,'ice','Ice Hammer');
  technique('target',mallet,'ruby','Hammer Arm');
  technique('link',waterStream,'water','Scald','Water Gun');
  technique('link',waterStream,'ice','Chilling Water');
  technique('target',waterStrike,'water','Waterfall','Dive','Aqua Tail','Liquidation');
  technique('ground',waterField,'water','Water Spout','Sparkling Aria');
  technique('ground',shockField,'gold','Discharge');
  technique('ground',shockField,'prism','Overdrive');
  technique('target',supercell,'gold','Supercell Slam');
  technique('link',stoneShot,'rock','Rock Throw','Bonemerang');
  technique('ground',stoneBurst,'rock','Rock Blast','Rock Wrecker','Bulldoze');
  technique('link',tunnel,'mud','Dig','Headlong Rush');
  technique('target',winter,'ice','Freeze Dry','Icicle Crash','Avalanche','Ice Spinner');
  technique('link',slime,'venom','Gunk Shot','Belch');
  technique('target',blade,'venom','Poison Jab','Cross Poison');
  technique('target',mandibles,'grass','Bug Bite');
  technique('target',mandibles,'silver','Super Fang');
  technique('target',mandibles,'psychic','Psychic Fangs');
  technique('link',siphon,'grass','Leech Life');
  technique('link',siphon,'aura','Drain Punch');
  technique('ground',swarm,'grass','Struggle Bug');
  technique('link',skitter,'grass','Skitter Smack');
  technique('target',shade,'ghost','Poltergeist','Phantom Force','Astonish');
  technique('target',deceive,'night','Foul Play','False Surrender','Throat Chop');
  technique('target',brawl,'ruby','Thrash','Retaliate','Superpower','Brick Break');
  technique('target',brawl,'silver','Pound','Strength','Facade','Body Press','Upper Hand');
  technique('target',brawl,'mist','Play Rough');
  technique('target',brawl,'gold','Last Resort','Giga Impact');
  technique('target',kick,'ruby','Low Kick','Axe Kick');
  technique('target',steelTail,'steel','Iron Tail');
  technique('link',machinery,'steel','Steel Roller','Hyper Drill');
  technique('link',machinery,'rock','Rollout');
  technique('link',mineralRay,'rock','Meteor Beam','Power Gem');
  technique('link',mineralRay,'steel','Steel Beam');
  technique('target',blade,'aura','Meteor Assault');
  technique('ground',prismBurst,'prism','Tera Blast');
  technique('link',emberFlight,'fire','Ember','Burn Up');
  technique('target',emberFury,'fire','Raging Fury');
  technique('ground',ignition,'fire','Eruption','Shell Trap');
  technique('link',bird,'wind','Sky Attack','Acrobatics','Peck');
  technique('ground',airField,'wind','Razor Wind');
  technique('fan',scratch,'silver','Scratch');
  technique('lane',ram,'silver','Tackle','Take Down','Double Edge','Skull Bash','Body Slam');
  technique('lane',ram,'rock','Head Smash');
  technique('lane',ram,'psychic','Zen Headbutt');
  technique('lane',ram,'mud','High Horsepower');
  technique('lane',waterRush,'water','Flip Turn','Wave Crash');
  technique('lane',chargedRush,'gold','Wild Charge','Volt Tackle');
  technique('lane',brushRush,'grass','Pounce','Lunge','First Impression','Megahorn','Trailblaze');
  technique('lane',jumpRush,'ruby','High Jump Kick');
  technique('lane',jumpRush,'wind','Flying Press');
  technique('lane',jumpRush,'steel','Bullet Punch');

  function arc(ctx,x,y,r,a,b,tint,width) {
    ctx.beginPath();ctx.arc(x,y,r,a,b);ctx.strokeStyle=tint;ctx.lineWidth=width;ctx.stroke();
  }
  function drop(ctx,x,y,r,c) {
    ctx.beginPath();ctx.moveTo(x,y-r*1.4);ctx.bezierCurveTo(x-r*1.5,y+.3*r,x-r*.53,y+r,x,y+r);
    ctx.bezierCurveTo(x+r,y+r,x+r,y+.2*r,x,y-r*1.4);ctx.fillStyle=c[1];ctx.fill();
    path(ctx,[[x-r*.36,y+r*.27],[x-r*.27,y-r*.07]],c[2],1.2);
  }
  function flake(ctx,x,y,r,angle,c) {
    for(let i=0;i<3;i++){
      const a=angle+i*Math.PI/3,dx=Math.cos(a)*r,dy=Math.sin(a)*r;
      path(ctx,[[x-dx,y-dy],[x+dx,y+dy]],c[2],1.4);
      path(ctx,[[x+dx*.65-dy*.22,y+dy*.65+dx*.22],[x+dx*.57,y+dy*.57],[x+dx*.65+dy*.22,y+dy*.65-dx*.22]],c[1],1);
    }
  }
  function cloud(ctx,x,y,r,c) {
    for(const [dx,dy,s] of [[-.55,.06,.53],[0,-.18,.69],[.57,.08,.49]]){
      disc(ctx,x+dx*r,y+dy*r,r*s,c[0]);disc(ctx,x+dx*r,y+(dy-.13)*r,r*s*.86,c[1]);
    }
  }
  function zap(ctx,x1,y1,x2,y2,bend,c) {
    const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,nx=-dy/len*bend,ny=dx/len*bend;
    const pts=[[x1,y1],[x1+dx*.34+nx,y1+dy*.34+ny],[x1+dx*.48-nx*.5,y1+dy*.48-ny*.5],
      [x1+dx*.68+nx*.6,y1+dy*.68+ny*.6],[x2,y2]];
    path(ctx,pts,c[0],3.6);path(ctx,pts,c[2],1.6);
  }
  function sickle(ctx,x,y,r,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(-r,-r*.26);ctx.quadraticCurveTo(0,r*.86,r,-r*.26);
    ctx.quadraticCurveTo(0,r*.37,-r,-r*.26);ctx.fillStyle=c[1];ctx.fill();
    ctx.strokeStyle=c[2];ctx.lineWidth=1;ctx.stroke();ctx.restore();
  }
  function boulder(ctx,x,y,r,rotation,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
    const rim=[[-r,-r*.12],[-r*.53,-r*.82],[r*.22,-r],[r*.88,-r*.51],[r,r*.35],[r*.31,r*.84],[-r*.57,r*.61]];
    polygon(ctx,rim,c[0]);polygon(ctx,[rim[0],rim[1],rim[2],rim[3],[r*.1,r*.12]],c[1]);
    path(ctx,[rim[1],rim[2],rim[3]],c[2],1.3);ctx.restore();
  }
  function impact(ctx,x,y,r,p,c) {
    const spread=r*(.24+.76*p);
    for(let i=0;i<7;i++){
      const a=i*turn/7+.2,dx=Math.cos(a),dy=Math.sin(a);
      path(ctx,[[x+dx*spread*.6,y+dy*spread*.6],[x+dx*spread,y+dy*spread]],c[1+i%2],i%2?1.2:2);
    }
  }

  function hazard(ctx,e,age,c) {
    // The caster raises a marker. On entry the same pieces spring up at the affected Pokémon's feet.
    const p=ease((age+.025)/.37),entry=e.hazardEntry,r=entry?12+13*p:22-9*p;
    const y=entry?11:5-13*Math.sin(p*Math.PI);
    if(e.move==='Sticky Web'){
      for(let i=0;i<8;i++){
        const a=i*turn/8;path(ctx,[[0,y],[Math.cos(a)*r,y+Math.sin(a)*r*.65]],c[2],1.3);
      }
      for(const k of [.42,.74,1]){
        const web=[];for(let i=0;i<=16;i++){const a=i*turn/16,d=k*r*(i%2 ? 0.84 : 1);web.push([Math.cos(a)*d,y+Math.sin(a)*d*.65]);}
        path(ctx,web,c[1],1.35);
      }
      return;
    }
    const rock=e.move==='Stealth Rock',toxic=e.move==='Toxic Spikes';
    for(let i=0;i<(rock?5:6);i++){
      const a=i*turn/(rock?5:6)+p*(rock ? 0.65 : 0.19),x=Math.cos(a)*r,cy=y+Math.sin(a)*r*.55;
      if(rock)boulder(ctx,x,cy-3,3.4+i%3,p+i,c);
      else{
        const h=(toxic?9:7)*(entry ? 0.42+.7*Math.sin(p*Math.PI) : 0.68+.32*p);
        polygon(ctx,[[x-4,cy+2],[x,cy-h],[x+2,cy],[x+5,cy+2]],c[0]);
        path(ctx,[[x-2,cy],[x,cy-h],[x+1,cy-2]],c[2],1.35);
        if(toxic)drop(ctx,x+3,cy-3-h,1.8,c);
      }
    }
  }
  function weather(ctx,e,age,c) {
    const p=ease((age+.018)/.46);
    if(e.move==='Sunny Day'){
      const x=-6+12*p,y=-30-5*Math.sin(p*Math.PI),r=8+3*p;
      halo(ctx,x,y,r*1.9,c[1]);disc(ctx,x,y,r,c[1]);disc(ctx,x,y,r*.63,c[2]);
      for(let i=0;i<8;i++){const a=i*turn/8+p*.45;path(ctx,[[x+Math.cos(a)*(r+2),y+Math.sin(a)*(r+2)],[x+Math.cos(a)*(r+6),y+Math.sin(a)*(r+6)]],c[2],1.4);}
    }else if(e.move==='Sandstorm'){
      for(let j=0;j<3;j++){
        const pts=[];for(let i=0;i<=14;i++){const u=i/14;pts.push([-23+46*u,4-j*7+Math.sin(u*7+p*5+j)*5]);}
        path(ctx,pts,c[j],1.8);
      }
      for(let i=0;i<10;i++){const u=(i*.27+p*.8)%1;ctx.fillStyle=c[i%3];ctx.fillRect(-21+42*u,-15+(i*7%25),2,2);}
    }else{
      const rain=e.move==='Rain Dance',hail=e.move==='Hail';
      if(rain || hail)cloud(ctx,Math.sin(p*Math.PI)*3,-36,15,c);
      for(let i=0;i<(rain?12:9);i++){
        const u=(age*2.4+i*.19)%1,x=(i*13%49)-24+(rain?-u*5:Math.sin(u*3+i)*4),y=-31+u*44;
        if(rain)path(ctx,[[x,y],[x-2.7,y+7]],c[1+i%2],1.8);
        else if(hail)crystal(ctx,x,y,2.3,3.4,c,i+u);
        else flake(ctx,x,y,2.6+i%2,u*2+i,c);
      }
      if(rain){
        for(let i=0;i<3;i++){
          const ripple=(p+i/3)%1;
          ring(ctx,(i-1)*14,11+2*(i%2),2+4*ripple,1+1.4*ripple,c[1+i%2],1);
        }
      }else arc(ctx,0,10,14+6*p,.18,Math.PI-.18,c[2],1.2);
    }
  }
  function rest(ctx,e,age,c) {
    const p=ease(age/.42);
    if(e.move==='Morning Sun'){
      const y=-5-15*p;arc(ctx,0,y,7,Math.PI,turn,c[2],3);
      for(let i=0;i<5;i++){const a=Math.PI*(i+1)/6;path(ctx,[[Math.cos(a)*10,y-Math.sin(a)*10],[Math.cos(a)*15,y-Math.sin(a)*15]],c[1],1.7);}
      for(let i=-1;i<=1;i++){const x=i*10;path(ctx,[[x-2,9-10*p],[x+2,9-10*p]],c[2],1.4);path(ctx,[[x,7-10*p],[x,11-10*p]],c[2],1.4);}
    }else if(e.move==='Milk Drink'){
      ctx.save();ctx.translate(7,-11-3*p);ctx.rotate(-.5-.35*p);
      const glass=[[-3,-9],[3,-9],[3,-5],[5,-2],[5,7],[-5,7],[-5,-2],[-3,-5]];
      polygon(ctx,glass,c[2]);path(ctx,[...glass,glass[0]],c[0],1.4);path(ctx,[[-3,-8],[3,-8]],c[1],2.4);ctx.restore();
      drop(ctx,-2,2+5*p,2.8,[c[0],c[2],c[1]]);
    }else if(e.move==='Bulk Up'){
      for(const s of [-1,1]){
        const x=s*(14+4*p);path(ctx,[[x-s*4,7],[x+s*4,4],[x+s*5,-4],[x+s,-9],[x-s*4,-6]],c[0],5);
        path(ctx,[[x,4],[x+s*4,-1],[x+s,-6]],c[2],2);
      }
    }else if(e.move==='Taunt'){
      for(const s of [-1,1]){
        const x=s*(10+3*p);path(ctx,[[x+s*6,-13],[x,-11],[x-s*3,-5]],c[1],2.7);
        path(ctx,[[s*4,-4],[s*10,-7]],c[2],1.7);
      }
      arc(ctx,0,-2,8,.21,2.86,c[0],2.4);
    }else if(e.move==='Yawn'){
      for(let i=0;i<4;i++){const u=(age*1.2+i*.23)%1,r=2+3*u;ring(ctx,5+14*u,-5-16*u,r,r,c[1+i%2],1.6);}
      arc(ctx,-4,2,5,.23,2.75,c[2],1.5);
    }else{
      for(let i=0;i<3;i++){const u=(age+i*.19)%1,x=3+i*6,y=-5-i*5-u*6;
        path(ctx,[[x-2,y-2],[x+3,y-2],[x-2,y+2],[x+3,y+2]],c[1+i%2],1.35);}
      ring(ctx,0,11,14+3*Math.sin(p*Math.PI),3.4,c[1],1.4);
    }
  }
  function exchange(ctx,e,age,c,length) {
    const p=ease((age+.025)/.38);
    if(e.move==='Pain Split'){
      for(const s of [1,-1]){
        const u=s===1?p:1-p,x=u*length,y=s*7*Math.sin(p*Math.PI);
        path(ctx,[[length*.5,0],[x,y]],c[s===1?0:1],1.4);disc(ctx,x,y,3.6,c[1]);disc(ctx,x-1,y-1,1.3,c[2]);
      }
      return;
    }
    const u=ease((age+.02)/.2),back=ease((age-.14)/.3),x=length*u;
    if(e.move==='Volt Switch'){
      zap(ctx,0,0,x,0,6*Math.sin(Math.PI*u*.85),c);
      if(back>0)star(ctx,length*(1-back),-5*Math.sin(back*Math.PI),4.2,4,.2,c[2]);
    }else if(e.move==='U Turn'){
      const pts=[];for(let i=0;i<=14;i++){const t=back*i/14;pts.push([length*(1-t),-Math.sin(t*Math.PI)*13]);}
      path(ctx,[[0,2],[x,0]],c[1],2);if(back>0){path(ctx,pts,c[2],2);const [px,py]=pts.at(-1);path(ctx,[[px+6,py-4],[px,py],[px+6,py+2]],c[0],2);}
    }else{
      const head=length*p;for(let i=0;i<3;i++)path(ctx,[[head-8,-5+i*5],[head,-7+i*5],[head-4,-4+i*5]],c[1+i%2],1.6);
      if(p>.45)path(ctx,[[length-9,-10],[length-2,-12],[length+6,-9],[length+4,-3],[length,-3],[length-4,1],[length-4,-3]],c[2],1.5);
    }
  }
  function voice(ctx,e,age,c,length) {
    for(let i=0;i<4;i++){
      const u=clamp((age+.025-i*.045)/.28);if(!u)continue;
      const x=length*ease(u),r=3+8*u;
      if(e.move==='Alluring Voice'){note(ctx,x,Math.sin(u*Math.PI*2+i)*5,4+i%2,c,u*.5);if(i%2)star(ctx,x-3,-6,2.5,4,u,c[1]);}
      else if(e.move==='Extrasensory'){ring(ctx,x,0,r*.4,r,c[i%3],1.6,u*.4);if(i===2)eye(ctx,x,0,5,c,.8);}
      else if(e.move==='Roar'){ctx.beginPath();ctx.ellipse(x,0,r*.55,r,0,-1.23,1.23);ctx.strokeStyle=c[1+i%2];ctx.lineWidth=2;ctx.stroke();}
      else path(ctx,[[x-4,-r],[x+3,-r*.4],[x-1,0],[x+4,r*.45],[x-3,r]],c[1+i%2],2);
    }
  }

  function vines(ctx,e,age,c,length) {
    const p=ease((age+.02)/.2),retract=ease((age-.2)/.3),reach=length*p*(1-.72*retract);
    if(e.move==='Branch Poke'){
      ctx.save();ctx.translate(reach,0);ctx.rotate(-.16);
      path(ctx,[[-19,2],[-9,0],[0,-2]],palettes.rock[0],3.5);
      path(ctx,[[-10,0],[-9,-5],[-6,-7]],palettes.rock[1],1.7);leaf(ctx,-8,-6,3.2,-.7,c);ctx.restore();return;
    }
    const heavy=e.move==='Power Whip',pts=[];
    for(let i=0;i<=20;i++){const u=i/20,dy=Math.sin(u*8-age*18)*Math.sin(u*Math.PI);pts.push([u*reach,dy*(heavy?15:9)]);}
    path(ctx,pts,c[0],heavy?5:3);path(ctx,pts,c[1],heavy?2.6:1.5);
    if(heavy)for(const n of [4,8,12,16]){const [x,y]=pts[n];polygon(ctx,[[x-3,y],[x+1,y-5],[x+3,y]],c[2]);}
  }
  function garden(ctx,e,age,c) {
    const p=ease((age+.025)/.38);
    if(e.move==='Petal Dance'){
      for(let i=0;i<10;i++){
        const a=i*2.4+age*8,r=9+14*(i%4)/3,x=Math.cos(a)*r,y=Math.sin(a)*r*.55+7-24*p;
        leaf(ctx,x,y,3.5+i%2,a,[c[0],i%2?'#ed8db5':'#ffd8de','#fff6dc']);
      }
    }else if(e.move==='Grass Knot'){
      for(const s of [-1,1]){
        const loop=[];for(let j=0;j<=20;j++){const a=j*turn/20;loop.push([s*(9-4*p)+Math.cos(a)*(8+3*p),9+Math.sin(a)*6]);}
        path(ctx,loop,c[0],3.8);path(ctx,loop,c[1],1.6);
        leaf(ctx,s*(15-3*p),5-2*p,5,s*.6,c);
      }
    }else{
      for(let i=-2;i<=2;i++){
        const x=i*8,rise=ease((age+.02-Math.abs(i)*.04)/.25),h=(20-Math.abs(i)*4)*rise;
        path(ctx,[[x,12],[x+i,12-h]],c[0],2);
        leaf(ctx,x+i-3,13-h,4+.8*rise,-.6,c);leaf(ctx,x+i+3,11-h,4,.65,c);
      }
    }
  }
  function foliage(ctx,e,age,c,length) {
    const storm=e.move==='Leaf Storm',blast=e.move==='Chloroblast',p=ease((age+.015)/.28);
    if(storm){
      for(const side of [-1,1]){
        const curl=[];
        for(let i=0;i<=18;i++){
          const u=i/18,reach=clamp((age+.03)/.31)*u;
          curl.push([reach*length,Math.sin(reach*10+age*9)*Math.sin(u*Math.PI)*side*15]);
        }
        path(ctx,curl,side===1?'#c9eea3':'#59966a',1.6);
      }
    }
    if(blast){
      const w=8*Math.sin(Math.PI*.82*p);
      for(const side of [-1,1]){const pts=[];
        for(let i=0;i<=14;i++){const u=i/14;pts.push([length*p*u,side*w*Math.sin(u*Math.PI)+Math.sin(u*9+age*8)*2]);}
        path(ctx,pts,c[0],4.5);path(ctx,pts,c[2],1.7);}
    }
    const count=storm?12:blast?5:3;
    for(let i=0;i<count;i++){
      const u=clamp((age+.03-i*.015)/.31);if(!u)continue;
      const wave=Math.sin(Math.PI*u),a=u*8+i*2.4;
      const x=length*u,y=Math.sin(a)*wave*(storm?18:blast?6:8);
      leaf(ctx,x,y,storm?4+i%3:5.2,a,c);
    }
  }
  function seedBurst(ctx,e,age,c,r) {
    const p=ease((age+.02)/.31);
    if(age<.18){
      const fall=ease((age+.02)/.16);ctx.save();ctx.translate(0,-r*.60*(1-fall));ctx.rotate(fall*2);
      boulder(ctx,0,0,7,0,[c[0],palettes.rock[1],c[2]]);leaf(ctx,4,-6,4,-.45,c);ctx.restore();
    }
    for(let i=0;i<8;i++){
      const a=i*turn/8,d=r*.75*p;leaf(ctx,Math.cos(a)*d,Math.sin(a)*d,4,a+p,c);
      disc(ctx,Math.cos(a+.2)*d*.65,Math.sin(a+.2)*d*.65,2,c[0]);
    }
  }
  function blade(ctx,e,age,c) {
    const p=ease((age+.015)/.23);
    if(e.move==='Cross Poison'){
      for(const s of [-1,1]){
        const x=-s*17+s*34*p,y=-17+34*p;
        path(ctx,[[-s*17,-17],[x,y]],c[0],4.7);path(ctx,[[-s*17,-17],[x,y]],c[1],2);
        if(age>.13)drop(ctx,s*11,9+4*p,2.5,c);
      }
    }else if(e.move==='Solar Blade'){
      ctx.save();ctx.rotate(-1.25+2.4*p);
      polygon(ctx,[[-2,10],[-4,-12],[0,-28],[4,-12],[2,10]],c[1]);
      path(ctx,[[0,8],[0,-25]],c[2],2);leaf(ctx,-5,9,5,-.6,c);leaf(ctx,5,9,5,.6,c);ctx.restore();
    }else{
      const spear=e.move==='Meteor Assault',x=-19+26*p;
      polygon(ctx,[[x-17,5],[x-12,-4],[x+7,-7],[x+1,1]],c[0]);
      path(ctx,[[x-11,-3],[x+7,-7],[x-1,-1]],c[2],2);
      if(spear){for(let i=0;i<5;i++)star(ctx,x-10-i*3,-6+Math.sin(i*2)*6,2+i%2,4,age+i,c[1]);}
      else drop(ctx,x+5,-3,2.8,c);
    }
  }
  function mallet(ctx,e,age,c) {
    const p=ease((age+.014)/.22),wood=e.move==='Wood Hammer';
    ctx.save();ctx.translate(-12,6);ctx.rotate(-1.1+1.6*p);
    path(ctx,[[0,0],[16,-7]],wood?palettes.rock[0]:c[0],4.7);
    if(e.move==='Hammer Arm'){
      polygon(ctx,[[10,-10],[12,-15],[19,-15],[23,-12],[23,-3],[15,0],[10,-4]],c[0]);
      path(ctx,[[12,-12],[16,-13],[19,-11],[22,-9]],c[2],1.8);
    }else{
      const face=wood?palettes.rock[1]:c[1];
      polygon(ctx,[[10,-16],[17,-19],[24,-6],[17,-2],[12,-7]],face);
      path(ctx,[[10,-16],[17,-19],[24,-6]],c[2],1.7);
      if(wood){ring(ctx,18,-6,3,1.7,palettes.rock[0],1,-.4);leaf(ctx,14,-17,4,-.5,c);}
      else flake(ctx,16,-11,4,0,c);
    }
    ctx.restore();if(age>.15)impact(ctx,4,5,21,ease((age-.15)/.28),c);
  }
  function waterStream(ctx,e,age,c,length) {
    const hot=e.move==='Scald',cold=e.move==='Chilling Water';
    const p=ease((age+.025)/.23),head=length*p;
    for(let i=0;i<3;i++){
      const pts=[];for(let j=0;j<=12;j++){const u=j/12;
        const x=head*(.12+.88*u),y=(i-1)*(hot?3:2)+Math.sin(u*8+age*13+i)*2;
        pts.push([x,y]);}
      path(ctx,pts,c[i],hot?3.2:1.9);
    }
    if(hot)for(let i=0;i<4;i++){
      const x=head-2-i*3,y=-5-i*2-7*p;ctx.beginPath();ctx.moveTo(x,y+6);
      ctx.bezierCurveTo(x-5,y+2,x+5,y-2,x,y-5);ctx.strokeStyle='#eef6db';ctx.lineWidth=1.5;ctx.stroke();
    }else if(cold){for(let i=0;i<3;i++)flake(ctx,head-i*7,(i-1)*5,3+i%2,age+i,c);}
    else for(let i=0;i<3;i++)drop(ctx,head-2-i*5,(i-1)*4,2,c);
  }
  function waterStrike(ctx,e,age,c) {
    const p=ease((age+.018)/.32);
    if(e.move==='Aqua Tail'){
      for(let i=0;i<3;i++){sickle(ctx,0,3,14+i*4,-1.4+2.8*p+i*.23,c);}
      for(let i=0;i<4;i++){const a=i*.53+p;drop(ctx,Math.sin(a)*20,Math.cos(a)*13,2,c);}
    }else if(e.move==='Liquidation'){
      ctx.save();ctx.rotate(-.75+.65*p);
      polygon(ctx,[[-5,13],[-6,1],[-1,-13],[5,-24],[4,-9],[7,-4],[2,9]],c[1]);
      path(ctx,[[-3,10],[1,-5],[5,-19]],c[2],2.2);ctx.restore();
      for(let i=0;i<3;i++)drop(ctx,9+i*3,-9+i*5+6*p,2,c);
    }else{
      const dive=e.move==='Dive',h=(dive?25:40)*Math.sin(p*Math.PI*.85);
      ring(ctx,0,10,8+14*p,3+4*p,c[1],2);
      if(dive)ring(ctx,0,10,5+8*p,2+2*p,c[2],1.3);
      for(let i=-2;i<=2;i++){
        const x=i*4,top=7-h*(1-.12*Math.abs(i));
        ctx.beginPath();ctx.moveTo(x,9);ctx.quadraticCurveTo(x*.65,top+3,x+(dive?i*3:2),top);
        ctx.strokeStyle=c[1+Math.abs(i)%2];ctx.lineWidth=dive?2:3;ctx.stroke();
        if(!dive)disc(ctx,x+i*2,top-3,1.6,c[2]);
      }
    }
  }
  function waterField(ctx,e,age,c,r) {
    const p=ease((age+.025)/.38),aria=e.move==='Sparkling Aria';
    ring(ctx,0,0,2+r*.88*p,2+r*(aria ? 0.86 : 0.36)*p,c[1],2);
    for(let i=0;i<(aria?7:9);i++){
      const a=i*turn/(aria?7:9),d=r*(aria ? 0.72 : 0.52)*p,x=Math.cos(a)*d,y=Math.sin(a)*d;
      if(aria){note(ctx,x,y,5+i%2,c,Math.cos(a)*.32);star(ctx,x+4,y-6,2.9,4,a,c[2]);}
      else{
        const h=r*(.18+.25*Math.sin(p*Math.PI))*(.75+i%3*.12),cy=y*.7;
        ctx.beginPath();ctx.moveTo(x*.53,cy+4);ctx.quadraticCurveTo(x*.72,cy-h*.85,x,cy-h);
        ctx.strokeStyle=c[1+i%2];ctx.lineWidth=3.2;ctx.stroke();drop(ctx,x,cy-h-3,2.6,c);
      }
    }
  }
  function shockField(ctx,e,age,c,r) {
    const p=ease((age+.014)/.31),music=e.move==='Overdrive',d=r*(.12+.8*p);
    for(let i=0;i<(music?6:9);i++){
      const a=i*turn/(music?6:9)+.16,dx=Math.cos(a),dy=Math.sin(a);
      if(music){
        const pts=[];for(let j=0;j<=12;j++){const u=j/12,b=Math.sin(u*12+age*15)*4*Math.sin(Math.PI*u);pts.push([dx*d*u-dy*b,dy*d*u+dx*b]);}
        path(ctx,pts,c[1+i%2],2);if(i%2===0)note(ctx,dx*d,dy*d,5,c,a*.1);
      }else{
        zap(ctx,dx*7,dy*7,dx*d,dy*d,(i%2?1:-1)*d*.12,c);
        if(i%2===0)path(ctx,[[dx*d*.6,dy*d*.6],[dx*d*.76-dy*8,dy*d*.76+dx*8]],c[1],1.5);
      }
    }
  }
  function supercell(ctx,e,age,c) {
    const p=ease((age+.02)/.2);
    cloud(ctx,-4,-24,8,c);zap(ctx,-4,-22,-4+7*p,-22+27*p,5,c);
    if(age>.11){ring(ctx,3,7,4+18*p,2+4*p,c[1],1.5);impact(ctx,3,6,20,p,c);}
  }
  function stoneShot(ctx,e,age,c,length) {
    const bone=e.move==='Bonemerang',p=ease((age+.018)/(bone ? 0.49 : 0.27));
    const u=bone?1-Math.abs(2*p-1):p,x=length*u,y=-Math.sin(p*Math.PI*(bone?2:1))*16;
    if(bone){
      const trail=[];
      for(let i=0;i<=6;i++){
        const phase=Math.max(0,p-.08+i*.08/6);
        trail.push([length*(1-Math.abs(2*phase-1)),-16*Math.sin(turn*phase)]);
      }
      path(ctx,trail,'rgba(255,231,184,.7)',2);
      ctx.save();ctx.translate(x,y);ctx.rotate(p*turn*1.8);
      const ends=[[-9,3],[-1,1],[8,-4]];
      path(ctx,ends,'#735742',5.5);path(ctx,ends,'#ffe5b6',3.5);
      for(const [bx,by] of [ends[0],ends[2]]){
        for(const offset of [-2,2]){
          disc(ctx,bx+offset*.45,by+offset,3.4,'#866a50');
          disc(ctx,bx+offset*.45,by+offset-.4,2.65,'#fff1ce');
        }
      }
      ctx.restore();
    }else{path(ctx,[[x-Math.min(10,x),y-2],[x,y]],c[1],1.7);boulder(ctx,x,y,5.8,p*3,c);}
  }
  function stoneBurst(ctx,e,age,c,r) {
    const p=ease((age+.025)/.35);
    if(e.move==='Bulldoze'){
      for(let j=1;j<=3;j++){
        const d=2+r*p*j*.30,pts=[];
        for(let i=0;i<=30;i++){const a=i*turn/30,m=1-.08*(i%3);pts.push([Math.cos(a)*d*m,Math.sin(a)*d*m]);}
        path(ctx,pts,c[j%3],j===3?2.7:1.4);
      }
      return;
    }
    const heavy=e.move==='Rock Wrecker',count=heavy?1:5;
    for(let i=0;i<count;i++){
      const u=ease((age+.025-i*.027)/.23),a=i*2.4,d=heavy?0:r*(.22+.08*i);
      const x=Math.cos(a)*d,y=Math.sin(a)*d;
      if(age<.30+i*.027){
        const bx=x-12*(1-u),by=y-r*.5*(1-u);
        if(!heavy && u<.94)path(ctx,[[bx-5,by-9],[bx,by]],c[2],1.6);
        boulder(ctx,bx,by,heavy?r*.22:7+i%3,u*2+i,c);
      }
      if(u>.52){ring(ctx,x,y+4,3+u*(heavy?16:6),2+u*(heavy?5:2),c[1],1.6);}
    }
    if(heavy && age>.12)for(let i=0;i<8;i++){const a=i*turn/8,d=r*.63*p;boulder(ctx,Math.cos(a)*d,Math.sin(a)*d,2.7+i%3,p+i,c);}
  }
  function tunnel(ctx,e,age,c,length) {
    const rush=e.move==='Headlong Rush',p=ease((age+.015)/.28),head=length*p;
    for(let i=0;i<7;i++){
      const x=head*i/6,h=2+(i%3)*1.8;
      polygon(ctx,[[x-4,3],[x-1,-h],[x+3,-h*.56],[x+6,3]],c[i%2]);
      if(rush && i%2===0)path(ctx,[[x-6,-5],[x+2,-7]],c[2],1.7);
    }
    if(!rush){ring(ctx,head,0,7,3,c[0],2.8);boulder(ctx,head+4,-5,3.1,p*3,c);}
    else impact(ctx,head,0,15,p,c);
  }
  function winter(ctx,e,age,c) {
    const p=ease((age+.014)/.3);
    if(e.move==='Ice Spinner'){
      for(let i=0;i<3;i++){const a=age*7+i*turn/3;arc(ctx,0,0,14+i*2,a,a+1.45,c[i],2.6);crystal(ctx,Math.cos(a)*17,Math.sin(a)*17,2.8,5,c,a);}
    }else if(e.move==='Freeze Dry'){
      flake(ctx,0,-2,5+13*p,.35-p*.25,c);
      for(let i=0;i<5;i++){const a=i*turn/5;crystal(ctx,Math.cos(a)*(8+11*p),Math.sin(a)*(8+11*p),2.2,4,c,a);}
    }else{
      const slide=e.move==='Avalanche',count=slide?6:3;
      for(let i=0;i<count;i++){const u=ease((age+.02-i*.027)/.18),x=slide?i*6-14-(1-u)*13:(i-1)*7,y=-27+26*u+(i%2)*4;
        if(slide)boulder(ctx,x,y,4+i%3,u+i,c);else crystal(ctx,x,y,3+i%2,9-i,c,.09);}
      if(age>.13)impact(ctx,0,6,20,p,c);
    }
  }

  function slime(ctx,e,age,c,length) {
    const shot=e.move==='Gunk Shot',p=ease((age+.022)/.29);
    for(let i=0;i<(shot?5:10);i++){
      const u=clamp((age+.025-i*.017)/.25),x=length*u,y=shot?-15*Math.sin(u*Math.PI)+Math.sin(i)*3:Math.sin(u*6+i)*9*u;
      if(shot){disc(ctx,x,y,3+(4-i)*.72,c[i%2]);disc(ctx,x-1.4,y-1.6,1.2,c[2]);}
      else{ring(ctx,x,y,2.4+i%3,2+i%3,c[1+i%2],1.4);if(i%3===0)disc(ctx,x-2,y+2,1.2,c[0]);}
    }
    if(shot&&p>.7)for(let i=0;i<5;i++){const a=i*turn/5;drop(ctx,length+Math.cos(a)*13*p,Math.sin(a)*9*p,2.3,c);}
  }
  function mandibles(ctx,e,age,c) {
    const p=ease((age+.02)/.20),gap=15-10*p,bug=e.move==='Bug Bite',psy=e.move==='Psychic Fangs';
    for(const s of [-1,1]){
      if(bug){
        path(ctx,[[s*(gap+10),-11],[s*(gap+7),-2],[s*gap,5],[s*(gap-3),0]],c[0],4.2);
        path(ctx,[[s*(gap+7),-2],[s*gap,5],[s*(gap-3),0]],c[2],1.6);
      }else{
        const x=s*(psy?9:11),y=-gap;
        polygon(ctx,[[x-4,y-6],[x+4,y-7],[x+s*2,y+9],[x,y+13]],c[2]);
        path(ctx,[[x-4,y-6],[x+4,y-7],[x+s*2,y+9]],c[0],1.3);
        sickle(ctx,x,6+gap*.35,5,.25*s,c);
      }
    }
    if(psy)ring(ctx,0,-3,13+6*Math.sin(Math.PI*p),5+4*p,c[1],1.5,p*.55);
  }
  function siphon(ctx,e,age,c,length) {
    const punch=e.move==='Drain Punch',p=ease(age/.3);
    if(age<.31){
      if(punch){
        const x=length-10*(1-p);
        const shape=[[x-8,-3],[x-7,-7],[x-3,-8],[x,-6],[x+2,-7],[x+7,-2],[x+6,3],[x,6],[x-6,4]];
        polygon(ctx,shape,c[0]);path(ctx,[...shape,shape[0]],c[1],1.9);path(ctx,[[x-4,-4],[x-1,-4],[x+2,-1]],c[2],1.4);
      }else for(const s of [-1,1])path(ctx,[[length-8,s*7],[length-1,s*6],[length+2,s*2]],c[2],2.1);
    }
    for(let i=0;i<(punch?5:7);i++){
      const u=clamp((age-.04-i*.018)/.34);if(!u||u===1)continue;
      const x=length*(1-u),y=Math.sin(u*Math.PI)*((i%3)-1)*8;
      path(ctx,[[x+Math.min(7,length*u),y+1],[x,y]],c[1],1.4);disc(ctx,x,y,2+i%2,c[2]);
    }
  }
  function swarm(ctx,e,age,c,r) {
    const p=ease((age+.02)/.36);
    for(let i=0;i<10;i++){
      const a=i*2.4+.5*p,d=r*(.18+.58*p)*(i%2 ? 0.76 : 1),x=Math.cos(a)*d,y=Math.sin(a)*d;
      ctx.save();ctx.translate(x,y);ctx.rotate(a+.3);
      ring(ctx,-2,-2,3,1.4,c[2],1);ring(ctx,-2,2,3,1.4,c[2],1);disc(ctx,0,0,2.1,c[0]);ctx.restore();
    }
  }
  function skitter(ctx,e,age,c,length) {
    const p=ease((age+.02)/.31),pts=[];
    for(let i=0;i<=12;i++){const u=i/12,amp=Math.sin(u*Math.PI)*8;pts.push([length*p*u,(i%2?1:-1)*amp]);}
    path(ctx,pts,c[0],2.7);for(const j of [4,8,12]){const [x,y]=pts[j];path(ctx,[[x-5,y-4],[x,y],[x-3,y+5]],c[2],1.8);}
  }
  function shade(ctx,e,age,c) {
    const p=ease((age+.016)/.34);
    if(e.move==='Poltergeist'){
      for(let i=0;i<4;i++){
        const a=i*turn/4+p*1.6,r=25-12*p,x=Math.cos(a)*r,y=Math.sin(a)*r*.69-6;
        ring(ctx,x,y,5,3,c[1],1.2,a);boulder(ctx,x,y,3.6+i%2,p+i,[palettes.rock[0],c[1],c[2]]);
      }
    }else if(e.move==='Phantom Force'){
      const gap=4+9*Math.sin(p*Math.PI);
      ctx.save();ctx.rotate(-.35);ctx.beginPath();ctx.moveTo(0,-22);ctx.quadraticCurveTo(-gap,0,0,18);
      ctx.quadraticCurveTo(gap,0,0,-22);ctx.fillStyle=c[0];ctx.fill();ctx.strokeStyle=c[1];ctx.lineWidth=1.5;ctx.stroke();
      path(ctx,[[-3,-6],[2,-3],[5,-7]],c[2],1.6);ctx.restore();
    }else{
      for(const s of [-1,1])eye(ctx,s*(5+3*p),-4,4.8,c,.45+.5*p);
      for(let i=0;i<3;i++)star(ctx,(i-1)*12,-13-5*Math.sin(p*Math.PI),3.8-i%2,4,i,c[1+i%2]);
    }
  }
  function deceive(ctx,e,age,c) {
    const p=ease((age+.015)/.26);
    if(e.move==='Foul Play'){
      const mask=[[-15,-7],[-6,-3],[0,-6],[6,-3],[15,-7],[11,4],[3,7],[0,4],[-4,7],[-11,3]];
      ctx.save();ctx.rotate(-.26+.38*p);polygon(ctx,mask,c[0]);path(ctx,[...mask,mask[0]],c[1],1.7);
      for(const s of [-1,1])path(ctx,[[s*10,-2],[s*4,0]],c[2],1.7);ctx.restore();
    }else if(e.move==='Throat Chop'){
      note(ctx,4,-6,7,c,-.2);
      path(ctx,[[-14,12],[-6,4],[-4,5],[12*p,-12*p]],c[0],5);path(ctx,[[-12,11],[12*p,-12*p]],c[2],1.6);
    }else{
      const y=9-22*p;
      for(const s of [-1,1]){path(ctx,[[s*16,4],[s*8,8],[s*4,y]],c[1],2.8);polygon(ctx,[[s*5,y+4],[s*2,y-6],[s*9,y]],c[2]);}
    }
  }
  function palm(ctx,x,y,size,c) {
    ctx.save();ctx.translate(x,y);ctx.scale(size,size);
    const pts=[[-6,1],[-8,-2],[-7,-4],[-4,-3],[-4,-9],[-2,-10],[0,-6],[0,-11],[2,-11],[3,-6],[4,-9],[6,-8],[6,-4],[8,-5],[9,-2],[6,5],[2,9],[-4,7]];
    polygon(ctx,pts,c[0]);path(ctx,[...pts,pts[0]],c[1],1.5);path(ctx,[[-3,1],[0,3],[4,1]],c[2],1.4);ctx.restore();
  }
  function brawl(ctx,e,age,c) {
    const p=ease((age+.015)/.25),late=ease((age-.10)/.3);
    switch(e.move){
      case 'Brick Break':
        for(let i=0;i<4;i++){
          const side=i%2?1:-1,x=side*(6.5+late*13),y=(i<2?-4.5:4.5)+late*(i<2?-6:6);
          ctx.save();ctx.translate(x,y);ctx.rotate(side*late*.38);
          ctx.fillStyle='#6b403d';ctx.fillRect(-6.5,-4,13,8);
          ctx.fillStyle='#c17659';ctx.fillRect(-5.5,-3,11,5);path(ctx,[[-5,-2.5],[5,-2.5]],'#ffd49d',1.2);
          ctx.restore();
        }
        path(ctx,[[-10,-24],[-7,-18],[3*p,5*p],[0,9]],c[0],5);
        path(ctx,[[-10,-24],[-7,-18],[3*p,5*p],[0,9]],c[2],2.5);
        if(age>.14)impact(ctx,0,1,17,late,c);break;
      case 'Upper Hand':case 'Pound':
        if(e.move==='Upper Hand'){palm(ctx,2,12-18*p,1,c);path(ctx,[[-8,13],[-10,4],[-8,-4]],c[2],1.4);}
        else{ctx.save();ctx.rotate(-.8);palm(ctx,0,-10+14*p,.83,c);ctx.restore();if(late)impact(ctx,2,5,13,late,c);}
        break;
      case 'Strength':case 'Superpower':
        if(e.move==='Strength'){boulder(ctx,0,-5-8*p,7.5,p*.28,c);}
        else star(ctx,0,-4,6+5*p,6,.3,c[2]);
        for(const s of [-1,1])path(ctx,[[s*3,10],[s*(14+3*p),8],[s*16,-3],[s*11,-7]],c[1],3);
        if(e.move==='Superpower')impact(ctx,0,0,24,p,c);
        break;
      case 'Body Press':{
        const y=-18+22*p;
        for(let i=-1;i<=1;i++)path(ctx,[[i*8,y-9],[i*8,y+1],[i*8-2,y-2]],c[1+i*i],1.8);
        ring(ctx,0,8,5+16*p,2+5*p,c[0],2.5);break;
      }
      case 'Thrash':case 'Retaliate':{
        const count=e.move==='Thrash'?3:2;
        for(let i=0;i<count;i++){
          const u=ease((age+.02-i*.044)/.16);if(!u)continue;
          const a=i*(e.move==='Thrash'?2.15:Math.PI)+.45,dx=Math.cos(a),dy=Math.sin(a);
          path(ctx,[[dx*23,dy*23],[dx*(23-35*u)-dy*3,dy*(23-35*u)+dx*3]],c[1+i%2],i%2?2.3:3.4);
        }
        if(e.move==='Retaliate')ring(ctx,0,0,8+6*p,8+6*p,c[0],1.4);break;
      }
      case 'Facade':
        for(const s of [-1,1]){arc(ctx,s*7,-4,4,Math.PI+.18,turn-.2,c[1],1.8);path(ctx,[[s*15,-5],[s*(17+4*p),-8]],c[0],1.4);}
        sickle(ctx,0,2,10,p*.25,c);break;
      case 'Play Rough':
        cloud(ctx,0,1,13+4*Math.sin(p*Math.PI),c);
        for(let i=0;i<5;i++){const a=i*turn/5+p;star(ctx,Math.cos(a)*(16+3*p),Math.sin(a)*13,3.5,5,a,c[2]);}
        break;
      case 'Last Resort':
        for(let i=0;i<5;i++){const a=i*turn/5-p*.7,r=24-14*p;star(ctx,Math.cos(a)*r,Math.sin(a)*r,3.5,5,a,c[1]);}
        star(ctx,0,0,4+8*p,5,-1.57,c[2]);break;
      case 'Giga Impact':
        ring(ctx,0,0,4+21*p,3+18*p,c[1],3);star(ctx,0,0,5+13*Math.sin(p*Math.PI),8,p*.5,c[2]);
        impact(ctx,0,0,26,p,c);break;
    }
  }
  function foot(ctx,x,y,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    const shoe=[[-6,-8],[-1,-9],[1,-3],[7,0],[8,4],[3,5],[-5,3]];
    polygon(ctx,shoe,c[0]);path(ctx,[...shoe,shoe[0]],c[1],1.6);path(ctx,[[-4,2],[2,4],[7,3]],c[2],1.3);ctx.restore();
  }
  function kick(ctx,e,age,c) {
    const p=ease((age+.012)/.23),axe=e.move==='Axe Kick';
    const a=axe?-2.2+2.6*p:2.8-2.5*p,x=Math.cos(a)*15,y=(axe?-8:6)+Math.sin(a)*(axe?17:5);
    sickle(ctx,0,axe?-4:6,16,axe?-1.1:-.25,c);foot(ctx,x,y,a+.4,c);
  }
  function steelTail(ctx,e,age,c) {
    const p=ease((age+.018)/.28);
    for(let i=0;i<7;i++){
      const u=i/6,a=-2.6+u*(.3+2.65*p),r=20-u*5;
      const x=Math.cos(a)*r,y=Math.sin(a)*r+7;
      ctx.save();ctx.translate(x,y);ctx.rotate(a);
      const scale=5-u*2;polygon(ctx,[[-scale,0],[0,-scale],[scale*.8,0],[0,scale]],c[i%2]);
      path(ctx,[[-scale,0],[0,-scale]],c[2],1.1);ctx.restore();
    }
  }
  function machinery(ctx,e,age,c,length) {
    const p=ease((age+.025)/.3),x=length*p;
    if(e.move==='Hyper Drill'){
      polygon(ctx,[[x+5,0],[x-14,-6],[x-19,0],[x-14,6]],c[0]);
      for(let i=0;i<4;i++){const r=2+i;path(ctx,[[x-i*4,-r],[x-i*4+Math.sin(age*19+i)*2,r]],c[1+i%2],1.5);}
    }else if(e.move==='Rollout'){
      boulder(ctx,x,-3,7.6,p*turn,c);
      for(let i=1;i<4;i++)disc(ctx,Math.max(0,x-i*6),4+(i%2)*2,1.6+i*.25,c[1]);
    }else{
      const r=7;ctx.save();ctx.translate(x,-2);ctx.rotate(p*turn);
      disc(ctx,0,0,r,c[0]);ring(ctx,0,0,r,r,c[1],2);ring(ctx,0,0,3,3,c[2],1);
      for(let i=0;i<5;i++){const a=i*turn/5;path(ctx,[[Math.cos(a)*3,Math.sin(a)*3],[Math.cos(a+.2)*6,Math.sin(a+.2)*6]],c[1],1.2);}ctx.restore();
    }
  }
  function mineralRay(ctx,e,age,c,length) {
    const p=ease((age+.02)/.22),head=length*p;
    if(e.move==='Power Gem'){
      for(let i=-1;i<=1;i++){
        const x=4+(1-Math.abs(i))*4,y=i*7;crystal(ctx,x,y,3,5,i===0?palettes.prism:c,i*.28);
        path(ctx,[[x,y],[head,y*(1-p)]],i===0?palettes.prism[1]:c[2],1.6);
      }
    }else if(e.move==='Steel Beam'){
      for(let i=-1;i<=1;i++)path(ctx,[[0,i*3],[head,i*1.6]],c[i+1],i===0?4.3:1.5);
      for(let i=1;i<5;i++){const x=head*i/5;path(ctx,[[x-3,-5],[x+1,-5],[x+4,0],[x+1,5]],c[2],1.3);}
    }else{
      path(ctx,[[0,0],[head*.35,-1],[head,0]],c[1],5);path(ctx,[[0,0],[head,0]],c[2],1.7);
      for(let i=0;i<6;i++){const x=head*i/6,y=Math.sin(i+age*8)*(3+i%2*3);boulder(ctx,x,y,2.3+i%2,p+i,c);}
    }
  }
  function prismBurst(ctx,e,age,c,r) {
    const p=ease((age+.02)/.32),face=e.color||c[1];
    for(let i=0;i<8;i++){
      const a=i*turn/8+p*.18,d=r*(.13+.7*p),x=Math.cos(a)*d,y=Math.sin(a)*d;
      path(ctx,[[Math.cos(a)*d*.2,Math.sin(a)*d*.2],[x,y]],i%2?face:c[1],1.6);
      crystal(ctx,x,y,3+i%3,6+i%4,[c[0],i%2?face:c[1],c[2]],a+Math.PI/2);
    }
    star(ctx,0,0,5+8*Math.sin(p*Math.PI),6,p,c[2]);
  }

  function emberFlight(ctx,e,age,c,length) {
    const large=e.move==='Burn Up',count=large?8:4;
    for(let i=0;i<count;i++){
      const u=clamp((age+.025-i*.02)/.28);if(!u)continue;
      const x=length*u,y=Math.sin(Math.PI*u)*Math.sin(i*2.4)*(large?11:5);
      flame(ctx,x,y,large?6+i%3:4.2+i%2,c,1.15);
    }
    if(large && age>.13)halo(ctx,length,0,8+6*ease((age-.13)/.22),c[1]);
  }
  function emberFury(ctx,e,age,c) {
    const p=ease((age+.02)/.29);
    for(let i=0;i<3;i++){
      const a=i*turn/3+p*2,r=19-8*p;
      sickle(ctx,Math.cos(a)*r,Math.sin(a)*r,9,a,c);flame(ctx,Math.cos(a+.4)*r,Math.sin(a+.4)*r,4,c,a);
    }
    impact(ctx,0,0,18,p,c);
  }
  function ignition(ctx,e,age,c,r) {
    const p=ease((age+.02)/.36),shell=e.move==='Shell Trap';
    if(shell){
      const pieces=6;for(let i=0;i<pieces;i++){
        const a=i*turn/pieces,d=6+r*.42*p,x=Math.cos(a)*d,y=Math.sin(a)*d;
        ctx.save();ctx.translate(x,y);ctx.rotate(a+p);
        polygon(ctx,[[-6,-2],[0,-6],[6,0],[3,5],[-4,5]],palettes.rock[0]);
        path(ctx,[[-5,0],[0,-4],[4,-1]],c[1],1.6);ctx.restore();
      }
      flame(ctx,0,0,5+16*Math.sin(p*Math.PI),c);ring(ctx,0,0,3+r*.77*p,3+r*.77*p,c[1],2.1);
    }else{
      for(let i=0;i<12;i++){
        const a=i*2.4,d=r*(.16+.64*p)*(i%2 ? 0.74 : 1),x=Math.cos(a)*d,y=Math.sin(a)*d*.65-16*Math.sin(p*Math.PI);
        path(ctx,[[x*.77,y*.87],[x,y]],c[1],2);boulder(ctx,x,y,3.2+i%3,p*3+i,[palettes.rock[0],c[1],c[2]]);
      }
      for(let i=-1;i<=1;i++)flame(ctx,i*10,3,(i===0?14:7)*(1-.42*p),c,i*.35);
    }
  }
  function bird(ctx,e,age,c,length) {
    const peck=e.move==='Peck',acro=e.move==='Acrobatics',p=ease((age+.02)/.26);
    const x=length*p,y=peck?0:-Math.sin(p*Math.PI)*(acro?18:27);
    if(peck){polygon(ctx,[[x-7,-4],[x+3,0],[x-7,4]],c[1]);path(ctx,[[x-6,-3],[x+3,0]],c[2],1.5);return;}
    if(acro){
      const pts=[];for(let i=0;i<=17;i++){const u=p*i/17;pts.push([u*length+Math.sin(u*turn)*7,-Math.sin(u*Math.PI)*18+Math.sin(u*turn)*4]);}
      path(ctx,pts,c[1],2);sickle(ctx,x,y,7,p*turn,c);
    }else{
      for(const s of [-1,1]){const wing=[[x+4,y],[x-6,y-1],[x-18,y+s*(6+9*(1-p))],[x-10,y+s*2]];
        polygon(ctx,wing,c[1]);path(ctx,[wing[2],wing[1],wing[0]],c[2],1.5);}
      if(p>.65)impact(ctx,x,y,15,p,c);
    }
  }
  function airField(ctx,e,age,c,r) {
    const p=ease((age+.02)/.35);
    for(let i=0;i<7;i++){
      const a=i*turn/7+p*.8,d=r*(.12+.67*p);
      sickle(ctx,Math.cos(a)*d,Math.sin(a)*d,r*.14,a+Math.PI/2,c);
    }
  }
  function scratch(ctx,e,age,c,length) {
    const half=e.sector.halfAngle,p=ease((age+.017)/.19);
    for(let i=0;i<3;i++){
      const from=-half*.84,to=from+(half*1.7)*p,r=length*(.57+i*.14);
      arc(ctx,0,0,r,from,to,c[i],i===1?2.8:1.7);
    }
  }
  function ram(ctx,e,age,c,length) {
    const p=ease((age+.026)/.17),x=length*p,tail=Math.max(0,x-35),move=e.move;
    if(move==='High Horsepower'){
      for(let i=0;i<4;i++){const px=tail+(x-tail)*i/3,py=(i%2?1:-1)*5;
        arc(ctx,px,py,3.7,.45,turn-.45,c[1],2);disc(ctx,px-2,py+3,1.5,c[0]);}
      return;
    }
    for(const s of [-1,1])path(ctx,[[tail,s*4],[x-5,s*2],[x,0]],c[s>0?1:2],move==='Tackle'?1.6:2.5);
    switch(move){
      case 'Double Edge':
        for(const s of [-1,1]){sickle(ctx,x-6,s*6,10,s*1.12,c);path(ctx,[[tail-3,s*9],[x-12,s*5]],c[2],1.3);}break;
      case 'Body Slam':
        for(let i=0;i<3;i++)ring(ctx,x-i*4,2+i*2,4+i*2,2+i*.75,c[i],1.65);
        break;
      case 'Skull Bash':
        disc(ctx,x-3,0,6,c[0]);arc(ctx,x-4,0,6,-1.3,1.3,c[2],2.6);break;
      case 'Head Smash':
        boulder(ctx,x-4,0,7.5,p*.6,c);for(let i=1;i<4;i++)boulder(ctx,x-i*6,(i%2?1:-1)*5,2,p+i,c);break;
      case 'Zen Headbutt':
        for(let i=0;i<3;i++)ring(ctx,x-i*5,0,2.6+i*.4,7-i,c[i],1.4);star(ctx,x,0,4,4,p,c[2]);break;
      case 'Take Down':
        path(ctx,[[x-12,-7],[x,0],[x-12,7]],c[0],3);path(ctx,[[x-9,-5],[x,0],[x-9,5]],c[1],1.8);break;
      case 'Tackle':
        path(ctx,[[tail,0],[x-2,0]],c[1],1.6);break;
    }
  }
  function waterRush(ctx,e,age,c,length) {
    const flip=e.move==='Flip Turn',p=ease((age+.025)/.19),x=length*p,tail=Math.max(0,x-41);
    for(const s of [-1,1]){
      const pts=[];for(let i=0;i<=12;i++){const u=i/12;pts.push([tail+(x-tail)*u,s*Math.sin(u*Math.PI)*(flip?5:10)]);}
      path(ctx,pts,c[1],flip?2:3.5);
    }
    if(flip){sickle(ctx,x-5,0,9,age*9,c);if(age>.15)path(ctx,[[x-6,-7],[x-15,-3],[x-10,-1]],c[2],1.7);}
    else{for(let i=0;i<5;i++)drop(ctx,x-(i%3)*5,(i-2)*4,2.4+i%2,c);sickle(ctx,x,0,12,-1.4,c);}
  }
  function chargedRush(ctx,e,age,c,length) {
    const p=ease((age+.025)/.17),x=length*p,tail=Math.max(0,x-43),wild=e.move==='Wild Charge';
    for(const s of [-1,1])zap(ctx,tail,s*(wild?7:3),x,s*2,s*(wild?9:5),c);
    if(!wild)ring(ctx,x-3,0,3.3,8.5,c[1],2.2);else star(ctx,x,0,6.4,6,age*7,c[2]);
  }
  function brushRush(ctx,e,age,c,length) {
    const p=ease((age+.025)/.19),x=length*p,tail=Math.max(0,x-36);
    if(e.move==='Trailblaze'){
      for(let i=0;i<6;i++){const px=tail+(x-tail)*i/5;leaf(ctx,px,(i%2?1:-1)*3,3.8,i+age*5,c);}
    }else if(e.move==='Megahorn'){
      ctx.beginPath();ctx.moveTo(x-20,5);ctx.quadraticCurveTo(x-8,0,x+2,-8);ctx.quadraticCurveTo(x-2,6,x-16,9);
      ctx.fillStyle=c[1];ctx.fill();path(ctx,[[x-14,5],[x-8,3],[x+2,-8]],c[2],1.7);
    }else if(e.move==='Pounce'){
      const pts=[];for(let i=0;i<=12;i++){const u=i/12;pts.push([tail+(x-tail)*u,-Math.sin(u*Math.PI)*9]);}
      path(ctx,pts,c[1],2);for(let i=-1;i<=1;i++)disc(ctx,x+i*3,-2-Math.abs(i),1.7,c[2]);
    }else{
      const first=e.move==='First Impression';
      for(const s of [-1,1])path(ctx,[[tail,s*(first?11:6)],[x-8,s*3],[x,0]],c[1],2.4);
      if(first)star(ctx,x,0,6.5,4,p*.5,c[2]);else path(ctx,[[x-11,-4],[x+1,0],[x-11,4]],c[2],1.4);
    }
  }
  function jumpRush(ctx,e,age,c,length) {
    const p=ease((age+.025)/.17),x=length*p,tail=Math.max(0,x-38);
    if(e.move==='Bullet Punch'){
      for(let i=-1;i<=1;i++)path(ctx,[[tail,i*3],[x,i*1.4]],c[1+Math.abs(i)],1.8);
      polygon(ctx,[[x-7,-4],[x-1,-5],[x+4,-1],[x+3,3],[x-6,4]],c[1]);return;
    }
    const wings=e.move==='Flying Press',pts=[];
    for(let i=0;i<=15;i++){const u=i/15;pts.push([tail+(x-tail)*u,-Math.sin(Math.PI*u)*(wings?10:15)]);}
    path(ctx,pts,c[1],2.2);foot(ctx,x,0,.75,c);
    if(wings)for(const s of [-1,1])path(ctx,[[x-15,s*12],[x-8,s*3],[x-3,0]],c[2],1.8);
  }
});
