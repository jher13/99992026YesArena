'use strict';
/* Artwork for player loadouts, technical machines and legendary signature moves. */
globalThis.ArenaMoveEffects.addPack(function signatureMoveEffects({
  technique,palettes,turn,ease,clamp,path,polygon,disc,ring,halo,star,crystal,leaf,flame,eye,note
}) {
  const azure=['#2652ac','#50c5ff','#e2ffff'];
  const sacred=['#b44b39','#ffc867','#fff7c9'];
  const prism=['#fc8186','#ffc566','#eeed8a','#7fdeb1','#73d6ed','#b9a4ff'];

  technique('target',timeDial,'aura','Roar Of Time');
  technique('target',voidRift,'psychic','Spacial Rend');
  technique('target',voidRift,'ghost','Shadow Force');
  technique('target',voidRift,'gold','Hyperspace Hole');
  technique('target',orbitalStrike,'steel','Doom Desire');
  technique('target',orbitalStrike,'gold','Judgment');
  technique('target',naturalPower,'emerald',"Nature's Madness");
  technique('target',naturalPower,'night','Ruination','Night Daze');
  technique('target',naturalPower,'ice','Sheer Cold','Freezing Glare');
  technique('target',earthwork,'fire','Magma Storm');
  technique('target',earthwork,'mud','Fissure','Rock Climb');
  technique('target',earthwork,'grass','Frenzy Plant','Seed Flare');
  technique('target',pledge,'water','Water Pledge');
  technique('target',pledge,'fire','Sacred Fire','Inferno','Fire Pledge','Temper Flare');

  technique('link',fusion,'fire','Blue Flare','Fusion Flare');
  technique('link',fusion,'gold','Fusion Bolt','Bolt Strike');
  technique('link',fusion,'dragon','Dragon Rage');
  technique('link',currents,'wind','Aeroblast');
  technique('link',currents,'night','Oblivion Wing');
  technique('link',currents,'venom','Malignant Chain');
  technique('link',airborne,'venom','Apple Acid');
  technique('link',airborne,'night','Fling');
  technique('link',airborne,'grass','Natural Gift');
  technique('link',airborne,'dragon','Scale Shot');
  technique('link',mindWave,'psychic','Psychic Noise','Psywave','Mystical Power','Psycho Boost');
  technique('link',mindWave,'prism','Prismatic Laser','Secret Power');
  technique('link',mindWave,'silver','Round');

  technique('target',weapon,'steel','Razor Shell');
  technique('target',weapon,'aura','Sacred Sword');
  technique('target',weapon,'grass','Ivy Cudgel');
  technique('target',weapon,'fire','V Create');
  technique('target',weapon,'prism','Multi-Attack');
  technique('target',weapon,'silver','Horn Drill');
  technique('target',hand,'ruby','Focus Punch','Dynamic Punch','Comet Punch');
  technique('target',hand,'gold','Plasma Fists');
  technique('target',hand,'steel','Double Iron Bash','Hard Press');
  technique('target',hand,'silver','Crush Grip');
  technique('target',foot,'fire','Blaze Kick');
  technique('target',foot,'ice','Triple Axel');
  technique('target',foot,'night','Thunderous Kick');
  technique('target',foot,'silver','Tail Slap');
  technique('target',throwMove,'ruby','Seismic Toss','Storm Throw','Submission');
  technique('target',throwMove,'wind','Sky Drop');
  technique('target',counterMove,'silver','Endeavor','Frustration','Return','Rage');
  technique('target',counterMove,'ruby','Revenge','Reversal');
  technique('target',shadowMove,'night','Beat Up','Darkest Lariat','Power Trip','Pursuit');
  technique('link',currents,'ghost','Spectral Thief');

  technique('target',selfMove,'silver','Bide','Endure','Rest','Sleep Talk');
  technique('target',selfMove,'grass','Leech Seed','Substitute');
  technique('target',selfMove,'ghost','Destiny Bond');
  technique('ground',terrain,'fire','Precipice Blades');
  technique('ground',terrain,'emerald',"Land's Wrath",'Thousand Waves','Thousand Arrows');
  technique('ground',weather,'gold','Wildbolt Storm');
  technique('ground',weather,'mist','Springtide Storm');
  technique('ground',weather,'ice','Glaciate');
  technique('ground',weather,'prism','Tera Starstorm');
  technique('ground',flowers,'grass','Petal Blizzard','Pollen Puff');
  technique('ground',flowers,'steel','Fleur Cannon');
  technique('ground',flowers,'silver','Egg Bomb','Relic Song');
  technique('ground',reactor,'gold','Zap Cannon');
  technique('ground',reactor,'steel','Gyro Ball');
  technique('ground',reactor,'fire','Searing Shot');
  technique('ground',reactor,'night','Fiery Wrath');
  technique('ground',reactor,'dragon','Dragon Energy');
  technique('fan',cut,'silver','Cut');
  technique('lane',dash,'rock','Accelerock');
  technique('lane',dash,'gold','Electro Drift');
  technique('lane',dash,'ruby','Collision Course');
  technique('lane',dash,'steel','Heavy Slam');
  technique('lane',dash,'fire','Heat Crash');
  technique('lane',cannon,'dragon','Dynamax Cannon');
  technique('lane',cannon,'prism','Photon Geyser');
  technique('lane',sandWall,'mud','Sandsear Storm');

  function arc(ctx,x,y,r,squash,angle,span,color,width=2) {
    ctx.beginPath();ctx.ellipse(x,y,r,r*squash,0,angle,angle+span);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  function trace(ctx,points,c,width=4) {
    path(ctx,points,c[0],width);path(ctx,points,c[2],width*.39);
  }
  function rays(ctx,x,y,r,p,c,count=8,offset=0) {
    for(let i=0;i<count;i++){
      const a=turn*i/count+offset,dx=Math.cos(a)*r,dy=Math.sin(a)*r;
      path(ctx,[[x+dx*(.20+.39*p),y+dy*(.20+.39*p)],[x+dx*(.39+.61*p),y+dy*(.39+.61*p)]],c[1+i%2],1.4+i%2);
    }
  }
  function bolt(ctx,x1,y1,x2,y2,amp,phase,c) {
    const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,points=[];
    for(let i=0;i<=8;i++){
      const u=i/8,k=Math.sin(i*2.4+phase)*Math.sin(u*Math.PI)*amp;
      points.push([x1+dx*u-dy/d*k,y1+dy*u+dx/d*k]);
    }
    trace(ctx,points,c,3.7);
  }
  function spear(ctx,x,y,h,w,tilt,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt);
    polygon(ctx,[[-w,2],[-w*.69,-h*.47],[0,-h],[w*.82,-h*.6],[w,2]],c[0]);
    polygon(ctx,[[0,-h],[w*.82,-h*.6],[w,2],[w*.19,-h*.15]],c[1]);
    path(ctx,[[-w*.7,-h*.46],[0,-h],[w*.72,-h*.61]],c[2],1.5);
    ctx.restore();
  }
  function plume(ctx,x,y,r,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    polygon(ctx,[[-r,0],[-r*.63,-r*.45],[r*.8,-r*.38],[r*.25,-r*.06],
      [r*.51,-r*.1],[-r*.12,r*.27],[-r*.49,r*.34]],c[1]);
    path(ctx,[[-r*1.1,r*.13],[r*.55,-r*.3]],c[2],1.4);ctx.restore();
  }
  function knot(ctx,x,y,r,phase,c) {
    for(let i=0;i<5;i++){
      const u=i/4,a=u*turn+phase;
      if(i<4)ring(ctx,x+Math.cos(a)*r*.36,y+Math.sin(a)*r*.35,r*.66,r*.29,c[i%2],2,a+.4);
    }
    disc(ctx,x,y,r*.22,c[2]);
  }
  function timeDial(ctx,e,age,c) {
    const p=ease((age+.025)/.44),r=17+10*Math.sin(Math.PI*p),y=-5;
    halo(ctx,0,y,r+7,'#789ee153');ring(ctx,0,y,r,r,c[0],3.5);
    arc(ctx,0,y,r+4,1,-.48-p*3,4.3,c[1],2.1);
    for(let i=0;i<12;i++){
      const a=i*turn/12-Math.PI/2,len=i%3?3.2:6;
      path(ctx,[[Math.cos(a)*(r-len),y+Math.sin(a)*(r-len)],[Math.cos(a)*r,y+Math.sin(a)*r]],c[2],i%3?1.3:2.2);
    }
    const hand=-Math.PI/2-p*turn*1.18,short=1.04-p*2;
    trace(ctx,[[Math.cos(short)*r*.46,y+Math.sin(short)*r*.46],[0,y],[Math.cos(hand)*r*.78,y+Math.sin(hand)*r*.78]],c,3.9);
    disc(ctx,0,y,2.4,c[2]);
    for(let i=0;i<4;i++){const a=i*1.58+p*.65;crystal(ctx,Math.cos(a)*(r+6),y+Math.sin(a)*(r+6),2,4,c,a);}
  }
  function voidRift(ctx,e,age,c) {
    const p=ease((age+.02)/.41),open=Math.sin(Math.PI*Math.min(.94,p)),r=7+15*open;
    if(e.move==='Hyperspace Hole'){
      for(let i=0;i<2;i++){
        const x=(i?1:-1)*(14-5*p),y=(i?-1:1)*8;
        ring(ctx,x,y,6+r*.25,r*.76,c[0],5,i?.46:-.46);ring(ctx,x,y,6+r*.25,r*.76,c[1],2.5,i?.46:-.46);
      }
      const x=-9+20*p;polygon(ctx,[[x-9,4],[x-5,-4],[x,-8],[x+6,-7],[x+9,-3],[x+5,3]],'#4d265a');
      path(ctx,[[x-1,-7],[x+1,-3],[x+5,-6],[x+7,-2]],c[2],1.6);
      return;
    }
    if(e.move==='Shadow Force'){
      const y=11-17*p;ring(ctx,0,11,9+14*open,4+3*open,c[1],2.8);
      polygon(ctx,[[-16,11],[-12,y-7],[-17,y-18],[-5,y-13],[0,y-22],[7,y-12],[17,y-19],[12,y-2],[16,11]],c[0]);
      for(const k of [-1,1])path(ctx,[[k*12,y-8],[k*6,y-5],[k*3,y-6]],'#ff938e',2.2);
      for(let i=0;i<3;i++){const x=-13+i*10+7*p;trace(ctx,[[x-6,10],[x-2,-2-7*p],[x+8,-11-12*p]],c,2.4);}
      return;
    }
    ctx.save();ctx.rotate(.63);
    const length=14+21*p,w=2+8*open;
    const left=[[0,-length],[-w*.5,-length*.54],[-w,-6],[-w*.37,3],[-w*.74,10],[0,length]];
    const right=[[0,length],[w*.49,10],[w*.23,2],[w,-8],[w*.36,-length*.54],[0,-length]];
    polygon(ctx,[...left,...right],'#271b53');path(ctx,left,'#ff9ee8',2.8);path(ctx,right,'#b0e6ff',2);
    for(let i=0;i<8;i++){const s=i%2?1:-1,dx=s*(w+2+(i%3+1)*4*p),y=(i-3.5)*5.6;
      crystal(ctx,dx,y,1.6,3.1,c,i*.67+p);}
    ctx.restore();
  }
  function orbitalStrike(ctx,e,age,c) {
    const p=ease((age+.02)/.38),holy=e.move==='Judgment';
    if(holy){
      const y=-29+4*Math.sin(p*Math.PI);
      ring(ctx,0,y,18,4.5,c[1],2.4);
      for(let i=0;i<5;i++){
        const x=(i-2)*7,drop=ease((age+.015-(i%3)*.033)/.23);
        const tip=y+5+(28-Math.abs(i-2)*3)*drop;
        polygon(ctx,[[x-1.8,y+3],[x+2.2,y+3],[x+1,tip-3],[x,tip+4],[x-1.3,tip-2]],c[1+i%2]);
      }
      star(ctx,0,y,7,4,0,c[2]);ring(ctx,0,7,5+17*p,3+3*p,c[1],1.6);
    }else{
      for(let i=0;i<4;i++){const a=i*turn/4+p*.8;arc(ctx,0,2,19-5*p,.77,a,.91,c[1],2.5);}
      for(let i=0;i<3;i++){
        const x=(i-1)*8+3,y=-36+37*ease((age+.015-i*.035)/.25);
        trace(ctx,[[x+7,y-14],[x+1,y-3],[x,y]],c,3);crystal(ctx,x,y,3.3,6,c,.42);
      }
      rays(ctx,0,3,20,p,c,5);
    }
  }
  function naturalPower(ctx,e,age,c) {
    const p=ease((age+.025)/.4),r=9+15*p;
    switch(e.move){
      case 'Freezing Glare':
        eye(ctx,0,-16,12,c,.5+.47*Math.sin(p*Math.PI));
        for(let i=-1;i<=1;i++){spear(ctx,i*8,10,9+11*p,4,-i*.2,c);path(ctx,[[i*3,-12],[i*8,1]],c[1],1.2);}
        break;
      case 'Sheer Cold':
        for(let i=0;i<6;i++){const a=i*turn/6,x=Math.cos(a)*r,y=Math.sin(a)*r*.86;
          path(ctx,[[0,0],[x,y]],c[2],1.9);
          for(const s of [-1,1])path(ctx,[[x*.55,y*.55],[x*.78-s*y*.16,y*.78+s*x*.16]],c[1],2);}
        crystal(ctx,0,-2,5+4*p,10+7*p,c,.12);break;
      case "Nature's Madness":
        for(const s of [-1,1]){
          const x=s*(20-12*p);
          polygon(ctx,[[x-s*6,-18],[x+s*8,-12],[x+s*10,4],[x-s,16],[x-s*6,7]],c[0]);
          path(ctx,[[x-s*4,-11],[x+s*5,-7],[x,0],[x+s*5,4]],c[1],2.9);
          eye(ctx,x,0,4.8,c,.8);
        }
        star(ctx,0,-18,5,4,.2,c[2]);break;
      case 'Ruination':
        for(const s of [-1,1]){
          const x=s*(1+8*p);
          polygon(ctx,[[x,-15],[x+s*9,-16],[x+s*7,-8],[x+s*12,-4],[x+s*10,8],[x+s*3,12],[x,7],[x+s*4,-2]],c[0]);
          path(ctx,[[x+s*9,-16],[x,-15],[x+s*4,-2],[x,7]],'#ffa690',1.9);
        }
        for(let i=0;i<6;i++)crystal(ctx,Math.cos(i*1.1)*r,Math.sin(i*1.1)*r*.67,2.1,3.5,c,p+i);break;
      case 'Night Daze':
        for(let i=0;i<7;i++){const a=i*turn/7+p*.75,x=Math.cos(a)*r,y=Math.sin(a)*r*.8;
          polygon(ctx,[[x,y],[x+Math.cos(a+1.8)*9,y+Math.sin(a+1.8)*9],[Math.cos(a+.76)*(r+5),Math.sin(a+.76)*(r+5)*.8],[x*.52,y*.5]],c[i%2]);}
        eye(ctx,0,-1,8+2*p,c,.56);break;
    }
  }
  function earthwork(ctx,e,age,c) {
    const p=ease((age+.02)/.39);
    if(e.move==='Fissure'){
      const w=1.6+6*Math.sin(p*Math.PI),d=12+20*p;
      const line=[[-d,6],[-d*.57,1],[-d*.18,4],[1,-2],[d*.36,1],[d*.51,-4],[d,-8]];
      polygon(ctx,[...line,...line.slice().reverse().map(([x,y])=>[x,y+w])],'#372b39');path(ctx,line,c[2],2);
      for(const i of [1,3,4]){const [x,y]=line[i];path(ctx,[[x,y],[x+4,y-5],[x+2+i,y-9-p*3]],c[0],1.8);}
    }else if(e.move==='Rock Climb'){
      for(let i=0;i<5;i++){const u=ease((age+.02-i*.028)/.24),x=-15+i*7,y=13-i*5-4*u;
        crystal(ctx,x,y,5,5+3*u,c,-.4+i*.19);path(ctx,[[x-3,y-1],[x-1,y-5],[x+2,y-6]],c[2],1.5);}
    }else if(e.move==='Magma Storm'){
      for(let i=0;i<4;i++){
        const a=p*4+i*.83,r=23-i*3,y=8-i*6;
        arc(ctx,0,y,r,.31,a,4.6,c[i%2],3);
        flame(ctx,Math.cos(a)*r,y+Math.sin(a)*r*.31,4+i*.7,c,.47);
      }
    }else if(e.move==='Frenzy Plant'){
      for(let i=0;i<5;i++){
        const s=i%2?1:-1,x=s*(3+i*3.6),h=(13+i%3*6)*p,a=-.9+s*p*.4;
        const vine=[[x,12],[x-s*3,7],[x+s*1,-h*.36],[x-s*5,-h*.7],[x-s*2,-h]];
        path(ctx,vine,c[0],5-i%2);path(ctx,vine,c[1],2);
        leaf(ctx,x-s*3,-h*.49,4+i%2,a,c);polygon(ctx,[[x,5],[x+s*6,1],[x+s,7]],c[2]);
      }
    }else{
      ring(ctx,0,4,7+18*p,3+9*p,c[1],2);
      for(let i=0;i<8;i++){const a=i*turn/8+p*.29,r=7+17*p;leaf(ctx,Math.cos(a)*r,Math.sin(a)*r*.85,4.8,a,c);}
      star(ctx,0,0,6+3*Math.sin(p*Math.PI),5,-Math.PI/2,palettes.sun[2]);
    }
  }
  function pledge(ctx,e,age,c) {
    const p=ease((age+.025)/.39);
    switch(e.move){
      case 'Sacred Fire':
        for(const s of [-1,1]){
          path(ctx,[[s*4,3],[s*11,-2],[s*20,-6],[s*(25+5*p),-13-9*p]],sacred[0],3.5);
          for(let i=0;i<4;i++){
            const x=s*(7+i*6),y=3-i*(2.8+3*p);
            flame(ctx,x,y,4.7+i*.45,sacred,s*(.24+i*.18));
            plume(ctx,x,y+2,6.6+i*.45,s*(i*.17-.75)+(s<0?Math.PI:0),sacred);
          }
        }
        flame(ctx,0,-3,9+6*p,sacred,.07);star(ctx,0,-22-4*p,4.5,4,0,sacred[2]);break;
      case 'Inferno':
        for(let i=0;i<5;i++){const x=(i-2)*(10-4*p),y=7-4*Math.sin(i+age*13);flame(ctx,x,y,6+(2-Math.abs(i-2))*5*p,c,(i-2)*-.13);}
        break;
      case 'Fire Pledge':
      case 'Water Pledge':
        for(let i=0;i<3;i++){
          const x=(i-1)*10,h=(17+(i===1?14:3))*ease((age+.025-i*.028)/.23);
          ring(ctx,x,9,6,2,c[1],1.3);
          if(e.move==='Fire Pledge')flame(ctx,x,7-h*.35,4+h*.35,c,(i-1)*.08);
          else{path(ctx,[[x-3,8],[x-3,4-h*.5],[x,-h+7],[x+3,-h+4]],c[1],4);disc(ctx,x+3,1-h,2.2,c[2]);}
        }
        break;
      case 'Temper Flare':
        for(let i=0;i<6;i++){
          const a=-Math.PI*.87+i*.40,r=12+11*p;flame(ctx,r*Math.cos(a),r*Math.sin(a)+8,5.4,c,a+Math.PI/2);
        }
        path(ctx,[[-8,-3],[-2,-9],[1,-4],[7,-11]],c[2],2.1);break;
    }
  }
  function fusion(ctx,e,age,c,length) {
    const p=ease((age+.025)/.32),x=length*p,spin=age*12;
    if(e.move==='Blue Flare' || e.move==='Dragon Rage'){
      const blue=e.move==='Blue Flare',colors=blue?azure:['#77365e','#fa8570','#ffdda5'];
      for(let i=3;i>=0;i--){const u=Math.max(0,p-i*.08),y=blue?(i%2?2:-2)*Math.sin(p*Math.PI):Math.sin(u*turn*1.3)*5;
        flame(ctx,length*u,y,4+(3-i)*(blue?2.3:1.5),colors,1.2+Math.sin(spin+i)*.16);}
      if(!blue){const y=Math.sin(p*turn*1.3)*5;polygon(ctx,[[x-7,y-3],[x-8,y-10],[x-1,y-5],[x+6,y-2],[x+7,y+2],[x-2,y+4]],colors[1]);disc(ctx,x+2,y-1,1.2,colors[2]);}
    }else if(e.move==='Bolt Strike'){
      bolt(ctx,0,-1,x,0,7,spin,c);
      for(let i=0;i<2;i++){const u=p*(.48+i*.28);bolt(ctx,length*u,0,length*u+8,(i?1:-1)*(7+5*p),3,spin+i,c);}
      polygon(ctx,[[x-8,-3],[x-1,-8],[x+8,-3],[x+2,0],[x+5,4],[x-8,5],[x-2,1]],c[1]);star(ctx,x,0,4,4,spin*.2,c[2]);
    }else{
      const electric=e.move==='Fusion Bolt',r=6+6*Math.sin(Math.PI*(.12+.8*p));
      halo(ctx,x,0,r*1.8,electric?'#efcf4a68':'#ff904f78');disc(ctx,x,0,r*.8,c[0]);
      for(let i=0;i<3;i++){
        const a=i*turn/3+spin;
        if(electric){const qx=x+Math.cos(a)*r,qy=Math.sin(a)*r;bolt(ctx,qx,qy,x+Math.cos(a+2)*r,Math.sin(a+2)*r,3.6,spin+i,c);}
        else{arc(ctx,x,0,r+i*.7,1,a,1.37,c[1+i%2],2.7);flame(ctx,x+Math.cos(a)*r,Math.sin(a)*r,4,c,a+.8);}
      }
      star(ctx,x,0,5.3,electric?4:6,spin*.32,c[2]);
    }
  }
  function currents(ctx,e,age,c,length) {
    const p=ease((age+.019)/.42),x=length*p;
    if(e.move==='Aeroblast'){
      for(let i=0;i<6;i++){
        const u=clamp((age+.03-i*.021)/.28);if(!u)continue;
        const r=3.6+(1-u)*8+i*.58;
        arc(ctx,length*u,0,r,.99,-1.15+age*9+i*.85,4.6,c[i%3],1.8);
      }
      trace(ctx,[[Math.max(0,x-30),3],[x,-2],[Math.max(0,x-12),-3]],c,2.4);
    }else if(e.move==='Malignant Chain'){
      const count=Math.max(3,Math.min(18,Math.ceil(length/7)));
      for(let i=0;i<=count;i++){
        const u=i/count;if(u>p+.016)break;
        const y=Math.sin(u*8-age*13)*5.5;
        ring(ctx,length*u,y,5,2.2+(i%2)*1.1,i%2?c[1]:c[0],2.2,Math.sin(i*1.6)*.7);
      }
      const y=Math.sin(p*8-age*13)*5.5;knot(ctx,x,y,5.6,age*9,c);
    }else{
      const ghost=e.move==='Spectral Thief',reverse=1-p,head=length*reverse;
      if(ghost){
        const fingers=[[-6,2],[-8,-4],[-5,-3],[-4,-9],[-2,-5],[0,-11],[2,-5],[5,-8],[4,0],[8,-2],[5,5],[-1,7]];
        for(let i=0;i<3;i++){const u=clamp(reverse+i*.065);disc(ctx,length*u,-4-Math.sin(Math.PI*u)*8,2.9-i*.4,c[i]);}
        ctx.save();ctx.translate(head,-4-Math.sin(p*Math.PI)*8);polygon(ctx,fingers,c[1]);path(ctx,fingers.slice(2,8),c[2],1.4);ctx.restore();
      }else{
        for(const side of [-1,1]){
          const wing=[[0,0],[6,-side*4],[15,-side*11],[23,-side*(17+7*p)],[20,-side*8],
            [16,-side*9],[16,-side*4],[12,-side*5],[11,0],[6,side*2]];
          polygon(ctx,wing,c[0]);path(ctx,wing.slice(1,4),'#ec92ae',2.4);
          const trail=[];
          for(let k=0;k<=14;k++){
            const u=reverse+(1-reverse)*k/14;
            trail.push([length*u,side*Math.sin(u*Math.PI)*(4+3*Math.sin(u*8-age*6))]);
          }
          path(ctx,trail,'#bb789d',1.45);
        }
        for(let i=0;i<5;i++){const u=clamp(reverse+i*.092),y=Math.sin(u*turn+i*.35)*5;rays(ctx,length*u,y,3.6,.4,c,3,age*7);disc(ctx,length*u,y,1.8,'#e98d97');}
      }
    }
  }
  function airborne(ctx,e,age,c,length) {
    const i=e.strikeIndex??0,p=ease((age+.015-i*.055)/.29);if(!p)return;
    const x=length*p,h=Math.min(30,8+length*.14);
    const y=-Math.sin(p*Math.PI)*h;
    switch(e.move){
      case 'Scale Shot':{
        const offset=(i%3-1)*4;
        for(let k=0;k<3;k++){
          const u=Math.max(0,p-k*.045),px=length*u,py=offset-Math.sin(u*Math.PI)*4;
          polygon(ctx,[[px-6,py-2],[px+1,py-4],[px+6,py],[px-2,py+3]],c[k%2]);path(ctx,[[px-3,py-1],[px+3,py-1]],c[2],1);
        }
        break;
      }
      case 'Fling':
        ctx.save();ctx.translate(x,y);ctx.rotate(-2+p*6);
        polygon(ctx,[[-5,-5],[4,-6],[7,-1],[3,5],[-6,4]],c[0]);path(ctx,[[-5,-5],[4,-6],[6,-2]],c[1],2);
        path(ctx,[[-3,1],[1,-2],[3,0]],c[2],1.4);ctx.restore();break;
      case 'Natural Gift':
      case 'Apple Acid':{
        const apple=e.move==='Apple Acid',fruit=apple?['#617c36','#b4d94c','#f2ffaf']:['#a3516a','#ec8f9a','#fff5b1'];
        disc(ctx,x-2.5,y,4.8,fruit[1]);disc(ctx,x+2.2,y-.4,4.8,fruit[1]);path(ctx,[[x,y-3],[x+1,y-8]],fruit[0],1.7);
        leaf(ctx,x+3,y-7,3,.1,palettes.grass);disc(ctx,x-3.4,y-1.5,1.15,fruit[2]);
        if(apple){for(let k=0;k<5;k++){const a=-2.8+k*.63;disc(ctx,x+Math.cos(a)*9*p,y+2+6*p+Math.sin(a)*4,1.5,fruit[1]);}}
        else{for(let k=0;k<3;k++){const a=k*turn/3+age*8;star(ctx,x+Math.cos(a)*8,y+Math.sin(a)*8,2.6,4,0,fruit[2]);}}
        break;
      }
    }
  }
  function mindWave(ctx,e,age,c,length) {
    const p=ease((age+.025)/.38),x=length*p;
    switch(e.move){
      case 'Prismatic Laser':{
        const split=length*.26,head=x;
        path(ctx,[[0,0],[Math.min(split,head),0]],c[2],3.4);
        if(head>=split)for(let i=0;i<prism.length;i++){
          const off=(i-2.5)*2.7*Math.sin(Math.PI*p*.88);
          path(ctx,[[split,0],[(split+head)*.5,off],[head,off*.26]],prism[i],2.05);
        }
        crystal(ctx,split,0,4.1,7,c,.28+age*.6);break;
      }
      case 'Round':
        for(let i=0;i<4;i++){const u=clamp((age+.025-i*.041)/.28);if(u)note(ctx,length*u,Math.sin(u*turn+i*.45)*5-2,5.4+i%2,c,Math.sin(u*4)*.27);}
        arc(ctx,x,0,6+3*p,1,-1.08,2.16,c[2],1.5);break;
      case 'Psychic Noise':
      case 'Psywave':{
        const noise=e.move==='Psychic Noise';
        for(let j=0;j<(noise?2:1);j++){
          const pts=[];
          for(let i=0;i<=32;i++){
            const u=i/32,amplitude=Math.sin(u*Math.PI)*(noise?8:10);
            const signal=noise?Math.sin(i*2.23-age*30+j)*Math.abs(Math.cos(i*.9+j)):Math.sin(u*turn*2.35-age*12);
            pts.push([x*u,(j?1:-1)*signal*amplitude]);
          }
          trace(ctx,pts,j?palettes.aura:c,noise?2.6:3.6);
        }
        break;
      }
      case 'Mystical Power':
        for(let i=0;i<4;i++){const u=clamp(p-i*.08),a=age*7+i*1.6;star(ctx,length*u,Math.sin(a)*6,4+i%2,4,a,c[1+i%2]);}
        eye(ctx,x,-2,6.3,c,.55+.3*Math.sin(p*Math.PI));break;
      case 'Psycho Boost':
        for(let i=0;i<3;i++){const u=clamp(p-i*.07),r=6+i*2;arc(ctx,length*u,0,r,.95,age*11+i*1.1,4.5,c[i],2.1);}
        trace(ctx,[[0,2],[x*.62,-3],[x,0]],c,2.4);break;
      case 'Secret Power':
        for(let i=0;i<4;i++){
          const u=clamp(p-i*.075),a=u*turn+i*1.55,px=length*u,py=Math.sin(a)*5;
          if(i===0)star(ctx,px,py,5.9,4,a,c[2]);
          else if(i===1)leaf(ctx,px,py,4.3,a,palettes.grass);
          else if(i===2)crystal(ctx,px,py,2.5,4.4,palettes.ice,a);
          else disc(ctx,px,py,2.7,palettes.fire[1]);
        }
        break;
    }
  }
  function weapon(ctx,e,age,c) {
    const p=ease((age+.02)/.33);
    switch(e.move){
      case 'V Create':{
        const y=9+3*p;
        for(const s of [-1,1]){
          const x=s*(9+15*p),tip=-7-14*p;trace(ctx,[[0,y],[x*.46,-1],[x,tip]],sacred,6.2);
          flame(ctx,x,tip,5.2,c,s*.55);flame(ctx,x*.5,0,4.5,c,s*.48);
        }
        star(ctx,0,y,4.8,4,0,c[2]);break;
      }
      case 'Ivy Cudgel':{
        ctx.save();ctx.rotate(-.95+2.13*p);trace(ctx,[[0,10],[0,-14]],c,4.3);
        polygon(ctx,[[-5,-13],[-7,-23],[-2,-29],[6,-26],[8,-17],[5,-12]],c[0]);
        path(ctx,[[-5,-16],[-1,-18],[-3,-21],[4,-24]],c[2],1.7);
        leaf(ctx,5,-15,4.2,-.75,c);ctx.restore();break;
      }
      case 'Horn Drill':
        ctx.save();ctx.translate(-13+21*p,0);polygon(ctx,[[-12,-7],[13,0],[-12,7]],c[1]);
        for(let i=0;i<3;i++){const x=-10+i*6;path(ctx,[[x-1,-5+i],[x+3,4-i]],c[0],2);}
        ctx.restore();arc(ctx,9,0,5+8*p,.83,age*16,4.5,c[2]);break;
      case 'Multi-Attack':
        for(let i=0;i<3;i++){const a=i*turn/3+.56+p*.9,x=Math.cos(a)*14,y=Math.sin(a)*14;
          trace(ctx,[[x*1.6,y*1.6],[x*.7-y*.39,y*.7+x*.39],[x*.14,y*.14]],[c[0],c[1],prism[i*2]],3.5);}
        crystal(ctx,0,0,3.6,6,c,p);break;
      default:{
        const shell=e.move==='Razor Shell';
        ctx.save();ctx.rotate(-1.13+2.37*p);
        if(shell){
          polygon(ctx,[[-6,8],[-10,1],[-8,-9],[-3,-15],[5,-12],[9,-3],[6,5]],'#9fd9eb');
          for(let i=-1;i<=1;i++)path(ctx,[[0,5],[i*6,-8-Math.abs(i-1)]],c[0],1.45);
        }else{
          spear(ctx,0,1,28,4.8,0,c);trace(ctx,[[-6,2],[0,1],[6,2]],c,2.9);path(ctx,[[0,2],[0,10]],c[1],3);
        }
        ctx.restore();arc(ctx,0,0,shell?17:23,.83,-2.7+p,1.65*p+.2,c[2],1.9);break;
      }
    }
  }
  function gauntlet(ctx,x,y,r,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(r,r);
    const pts=[[-9,-3],[-4,-6],[-1,-7],[2,-6],[5,-6],[8,-3],[9,1],[6,5],[0,6],[-4,4],[-9,4]];
    polygon(ctx,pts,c[0]);polygon(ctx,[[-4,-3],[0,-5],[5,-4],[7,-1],[5,2],[0,3],[-4,1]],c[1]);
    path(ctx,[[-2,-3],[0,-5],[2,-3],[4,-4],[6,-2]],c[2],1.2);ctx.restore();
  }
  function hand(ctx,e,age,c) {
    const i=e.strikeIndex??0,p=ease((age+.015-i*.055)/.25);if(!p)return;
    const x=-17+25*p;
    switch(e.move){
      case 'Double Iron Bash':{
        const s=i%2?-1:1;
        trace(ctx,[[x-12,s*7],[x-2,s*2]],c,4);ctx.save();ctx.translate(x,s*2);ctx.rotate(p*1.5+s*.35);
        polygon(ctx,[[-8,0],[-4,-7],[4,-7],[8,0],[4,7],[-4,7]],c[1]);disc(ctx,0,0,3.2,c[0]);arc(ctx,0,0,7,1,.1,2,c[2],1.4);ctx.restore();break;
      }
      case 'Hard Press':
      case 'Crush Grip':{
        const steel=e.move==='Hard Press',d=23-16*p;
        for(const s of [-1,1]){
          if(steel){polygon(ctx,[[-12,s*d],[12,s*d],[10,s*(d+6)],[-10,s*(d+6)]],c[0]);path(ctx,[[-11,s*d],[11,s*d]],c[2],2.5);}
          else{const k=s*d;trace(ctx,[[k,-10],[k-s*4,-6],[k-s*6,0],[k-s*2,6]],c,4.6);path(ctx,[[k-s*4,-1],[k-s*9,-5]],c[1],2.3);}
        }
        rays(ctx,0,0,13,p,c,5,.2);break;
      }
      case 'Plasma Fists':
        for(const s of [-1,1]){
          const px=x+s*4,py=s*7;bolt(ctx,px-16,py+s*4,px+4,py,4,p*7+s,c);
          gauntlet(ctx,px,py,.79,-s*.2,palettes.steel);
        }
        break;
      case 'Comet Punch':{
        const y=(i%3-1)*6;star(ctx,x-7,y,5+i%2,5,p+i,palettes.gold[1]);gauntlet(ctx,x+2,y,.78,(i%2?1:-1)*.27,c);break;
      }
      case 'Focus Punch':
        for(let k=0;k<3;k++)arc(ctx,-7,0,5+k*5-2*p,.85,k*.8+age*10,3.6,c[k],1.8);
        gauntlet(ctx,-14+24*p,0,1.23,.12,c);break;
      case 'Dynamic Punch':
        gauntlet(ctx,x,0,1.05,p*.5-.3,c);
        for(let k=0;k<5;k++){const a=k*turn/5+p*1.3;star(ctx,6+Math.cos(a)*(9+6*p),Math.sin(a)*(9+6*p),2.8+k%2,4,a,c[1+k%2]);}
        break;
    }
  }
  function foot(ctx,e,age,c) {
    const i=e.strikeIndex??0,p=ease((age+.015-i*.055)/.26);if(!p)return;
    const s=i%2?-1:1;
    if(e.move==='Tail Slap'){
      ctx.save();ctx.scale(1,s);const y=6-13*p;
      polygon(ctx,[[-18,5],[-12,1],[-4,y],[6,y-4],[13,y-3],[16,y],[11,y+4],[2,y+4],[-10,7]],c[1]);
      path(ctx,[[-11,2],[-2,y],[7,y-3]],c[2],1.7);ctx.restore();return;
    }
    if(e.move==='Triple Axel'){
      const a=-2.3+p*3+i*turn/3;
      arc(ctx,0,0,12+i*2,.8,a,2.3,c[1],2.8);
      const x=Math.cos(a+2.3)*(12+i*2),y=Math.sin(a+2.3)*(12+i*2)*.8;
      crystal(ctx,x,y,3.3,6.1,c,a+1.2);
      path(ctx,[[x-5,y+3],[x,y+4],[x+5,y+1]],c[2],1.7);return;
    }
    const angle=-1.1+p*1.38;
    ctx.save();ctx.rotate(angle);polygon(ctx,[[-13,7],[-8,-2],[-3,-7],[3,-4],[0,0],[10,-2],[15,1],[12,5],[-2,6],[-7,10]],c[0]);
    path(ctx,[[-5,5],[1,2],[11,2]],c[2],2.2);ctx.restore();
    if(e.move==='Blaze Kick')for(let k=0;k<3;k++)flame(ctx,-11+k*7,5-k*2,4.5+k*.7,c,.8+p*.4);
    else{bolt(ctx,-10,-17,8+3*p,2,4.5,p*11,palettes.gold);arc(ctx,0,0,18,.7,-2.6+p,2.1,c[1],2);}
  }
  function throwMove(ctx,e,age,c) {
    const p=ease((age+.02)/.37);
    if(e.move==='Seismic Toss'){
      const y=-6-17*Math.sin(Math.PI*p),r=8.4;
      disc(ctx,0,y,r,palettes.water[0]);ring(ctx,0,y,r,r,palettes.aura[1],1.25);
      for(const s of [-1,1])arc(ctx,s*3,y,4,.99,1.1+p*2+s,2.8,palettes.grass[1],1.6);
      path(ctx,[[-r,y],[0,y+1.8],[r,y]],palettes.water[2],1.2);
      arc(ctx,0,-4,17,.9,-2.6+p,3.2,c[1],2.4);ring(ctx,0,9,5+14*p,2+4*p,c[2],1.6);
    }else if(e.move==='Sky Drop'){
      for(const s of [-1,1])plume(ctx,s*(8+5*p),-22+26*p,9,s<0?2.65:.5,c);
      for(let i=-1;i<=1;i++)path(ctx,[[i*7,-32+8*p],[i*5,-5+13*p]],c[1+i*i],2.1);
      trace(ctx,[[-6,0+8*p],[0,8+8*p],[6,8*p]],c,3.4);
    }else if(e.move==='Storm Throw'){
      for(let i=0;i<3;i++){const a=p*4+i*turn/3;arc(ctx,0,1,15+i,.73,a,2.2,c[i],2.6);
        const x=Math.cos(a)*16,y=1+Math.sin(a)*12;path(ctx,[[x,y],[x-4,y+1],[x-2,y+4]],c[2],1.5);}
      rays(ctx,0,7,15,p,c,5);
    }else{
      for(const s of [-1,1]){
        const d=14-7*p;ring(ctx,s*d,1,9,4,c[1],2.9,s*(.7+p*.33));
        trace(ctx,[[s*d,-4],[s*3,2],[s*(d-2),9]],c,3.5);
      }
    }
  }
  function counterMove(ctx,e,age,c) {
    const p=ease((age+.02)/.34);
    switch(e.move){
      case 'Return':
        for(let i=0;i<3;i++){const x=(i-1)*8,y=4-11*p-(i%2)*3;
          const r=i===1?5:3;disc(ctx,x-r*.45,y,r*.7,'#ffaac4');disc(ctx,x+r*.45,y,r*.7,'#ffaac4');
          polygon(ctx,[[x-r,y],[x+r,y],[x,y+r*1.35]],'#ffaac4');}
        arc(ctx,0,3,15+3*p,.73,.26+p,2.5,c[2],1.75);break;
      case 'Frustration':
      case 'Rage':{
        const angry=e.move==='Frustration';
        const marks=angry?4:3;
        for(let i=0;i<marks;i++){const a=i*turn/marks-.5+p*.24;
          ctx.save();ctx.rotate(a);ctx.translate(0,-(6+5*p));
          if(angry)path(ctx,[[-6,-5],[-5,-1],[-1,0],[0,5]],palettes.ruby[1],3);
          else flame(ctx,0,0,4+i%2*.8,palettes.fire,.3);
          ctx.restore();}
        if(!angry)gauntlet(ctx,0,2,.8,p*.27,c);break;
      }
      case 'Endeavor':
        for(const s of [-1,1]){
          const x=s*(19-10*p);trace(ctx,[[x+s*6,-8],[x,0],[x+s*6,8]],c,3.6);
        }
        star(ctx,0,0,3+4*p,4,.3,palettes.gold[1]);break;
      case 'Reversal':
        for(let i=0;i<2;i++){
          const a=-2.7+i*Math.PI-p*1.7,r=13+i*1.6;arc(ctx,0,0,r,.85,a,2.38,c[1+i],2.6);
          const end=a+2.38,x=r*Math.cos(end),y=r*.85*Math.sin(end);
          polygon(ctx,[[x,y],[x+6*Math.sin(end),y-5*Math.cos(end)],[x-3*Math.cos(end),y-3*Math.sin(end)]],c[1+i]);
        }
        break;
      case 'Revenge':
        trace(ctx,[[-20,7],[-8,7],[-3,1],[-9,-4],[11,-4]],c,3.9);
        gauntlet(ctx,-3+14*p,-4,.86,-.12,palettes.ruby);rays(ctx,9,-4,12,p,c,4);break;
    }
  }
  function shadowMove(ctx,e,age,c) {
    const i=e.strikeIndex??0,p=ease((age+.014-i*.055)/.27);if(!p)return;
    if(e.move==='Darkest Lariat'){
      for(const s of [-1,1]){
        const a=age*14+(s<0?Math.PI:0),x=Math.cos(a)*19,y=Math.sin(a)*7;
        arc(ctx,0,1,19,.38,a-1.9,1.9,c[1],2.9);gauntlet(ctx,x,y,.7,a,c);
      }
    }else if(e.move==='Power Trip'){
      for(let j=0;j<3;j++){const x=(j-1)*8,h=8+5*j+6*p;
        trace(ctx,[[x-4,3],[x,3-h],[x+4,3],[x+1,0]],c,2.8);}
      arc(ctx,0,6,15,.29,.1,2.95,c[1],2.8);
    }else if(e.move==='Pursuit'){
      for(let j=0;j<3;j++){
        const x=-22+j*9+8*p,y=(j%2?1:-1)*4;
        disc(ctx,x,y,2.8,c[1]);for(let k=0;k<3;k++)disc(ctx,x+2.6+k*.4,y-2.5+k*2.5,1.2,c[2]);
      }
      trace(ctx,[[8,-7],[15,-2],[9,4]],c,3);
    }else{
      const a=i*2.4-.7,x=Math.cos(a)*(17-11*p),y=Math.sin(a)*(17-11*p);
      gauntlet(ctx,x,y,.92,a,c);rays(ctx,0,0,15,p,c,6,.4+i);
    }
  }
  function selfMove(ctx,e,age,c) {
    const p=ease((age+.024)/.41);
    switch(e.move){
      case 'Bide':
        for(let i=0;i<3;i++){const r=24-i*4-p*7;arc(ctx,0,4-i*3,r,.4,age*8+i*1.6,4.4,c[i],2.3);}
        for(let i=0;i<4;i++){const a=i*turn/4+p*.44;disc(ctx,Math.cos(a)*(20-9*p),Math.sin(a)*9-5,2,palettes.ruby[1]);}
        break;
      case 'Endure':
        for(const s of [-1,1])for(let i=0;i<2;i++){
          const x=s*(17-4*p+i*4),y=5-i*5;
          trace(ctx,[[x-s*3,y-9],[x,y+1],[x-s*6,y+7]],i?c:palettes.gold,2.8);
        }
        star(ctx,0,9,4,4,0,c[2]);break;
      case 'Destiny Bond':
        for(const s of [-1,1]){
          const x=s*(17-5*p),y=-4+s*2;knot(ctx,x,y,8,p*3+s,c);
          path(ctx,[[x,y],[s*8,-4+s*3],[0,-4-s*2],[-s*5,-4]],c[1],1.8);
        }
        for(let i=0;i<3;i++){const y=-9-i*4-6*p;disc(ctx,Math.sin(i*2+p)*4,y,1.5,c[2]);}
        break;
      case 'Leech Seed':
        for(let i=0;i<3;i++){
          const x=(i-1)*7,y=10-i%2*3,h=4+10*p;
          disc(ctx,x,y,2.7,'#b38856');path(ctx,[[x,y],[x+1,y-h*.5],[x,y-h]],c[0],2.4);
          leaf(ctx,x+3,y-h,4.4,-.48,c);leaf(ctx,x-2,y-h*.65,3.1,-2.75,c);
        }
        break;
      case 'Substitute':{
        const x=12+4*p,y=11-4*Math.sin(p*Math.PI);
        for(let i=0;i<5;i++){const a=-3+i*.73;disc(ctx,x+Math.cos(a)*(5+8*p),y+Math.sin(a)*4,2.7-i%2,c[2]);}
        ctx.save();ctx.translate(x,y);
        const plush=[[-9,0],[-10,-6],[-7,-9],[-7,-15],[-4,-12],[1,-13],[5,-17],[7,-13],[6,-9],[9,-6],[8,-3],[13,-6],[10,-1],[6,1],[5,4],[1,4],[0,2],[-5,2],[-7,4],[-10,3]];
        polygon(ctx,plush,'#376655');ctx.save();ctx.translate(0,-1);ctx.scale(.81,.81);polygon(ctx,plush,'#94cb86');ctx.restore();
        path(ctx,[[-6,-7],[-4,-6],[-3,-7]],'#304c45',1.4);path(ctx,[[-1,0],[3,0]],'#f5e5be',1.5);ctx.restore();break;
      }
      case 'Rest':{
        const x=8+p*5,y=-17-7*p;
        ctx.beginPath();ctx.moveTo(x+3,y-7);ctx.bezierCurveTo(x-12,y-7,x-11,y+10,x+4,y+7);
        ctx.bezierCurveTo(x-2,y+4,x-1,y-2,x+3,y-7);ctx.fillStyle='#ffe49a';ctx.fill();
        for(let i=0;i<3;i++){const px=x+6+i*4,py=y+2-i*5-p*i;path(ctx,[[px,py],[px+3,py],[px,py+3],[px+3,py+3]],c[2],1.3);}
        break;
      }
      case 'Sleep Talk':{
        const x=10+2*p,y=-18-4*p,r=9;
        ctx.beginPath();ctx.ellipse(x,y,r+2,r*.72,0,0,turn);ctx.fillStyle='#eee4fc';ctx.fill();
        polygon(ctx,[[x-6,y+3],[x-9,y+11],[x-1,y+5]],'#eee4fc');
        const pts=[];for(let i=0;i<=8;i++)pts.push([x-6+i*1.5,y+Math.sin(i*2.2+age*18)*(i%2?3:1)]);
        path(ctx,pts,palettes.ghost[0],1.6);break;
      }
    }
  }
  function terrain(ctx,e,age,c,r) {
    const p=ease((age+.025)/.43);
    if(e.move==='Precipice Blades'){
      for(let i=0;i<8;i++){
        const lane=i%4,back=i<4,step=ease((age+.025-(lane+(back?.34:0))*.028)/.24);
        const x=(lane-1.55)*r*.43+(back?r*.15:0),y=(back?-.11:.28)*r+Math.sin(lane*2)*r*.09;
        const h=r*(back?.34:.47)*step,w=r*(back?.071:.094);
        path(ctx,[[x-w*1.5,y],[x-w*.6,y-2],[x+w*.8,y+1],[x+w*1.5,y-2]],'#f38741',2);
        if(step){spear(ctx,x,y,h,w,.24,['#4d3642','#af5442','#ffce77']);
          path(ctx,[[x-w*.3,y-1],[x+w*.18,y-h*.28],[x+w*.43,y-h*.41]],'#ffa43f',1.55);}
      }
    }else if(e.move==="Land's Wrath"){
      for(let k=0;k<2;k++){
        const rr=r*(.23+p*.49+k*.16),pts=[];
        for(let i=0;i<=6;i++){const a=i*turn/6+.13;pts.push([Math.cos(a)*rr,Math.sin(a)*rr*.8]);}trace(ctx,pts,c,2.9-k*.7);
      }
      for(let i=0;i<6;i++){const a=i*turn/6+.13;
        trace(ctx,[[0,0],[Math.cos(a+.21)*r*.28,Math.sin(a+.21)*r*.22],[Math.cos(a)*r*(.35+.48*p),Math.sin(a)*r*(.32+.42*p)]],c,2.4);}
    }else if(e.move==='Thousand Arrows'){
      for(let i=0;i<14;i++){
        const a=i*2.4,rad=r*.78*Math.sqrt((i+.4)/14),x=Math.cos(a)*rad,y=Math.sin(a)*rad*.86;
        const drop=ease((age+.035-(i%5)*.031)/.21),height=(1-drop)*r*.46,tipY=y-height;
        ctx.save();ctx.translate(x+height*.26,tipY);ctx.rotate(.24);
        path(ctx,[[0,-12],[0,0]],c[1],1.65);polygon(ctx,[[-3,-4],[0,2],[3,-4]],c[2]);ctx.restore();
        if(drop>.76)ring(ctx,x,y,3+3*drop,2,c[1],1);
      }
    }else{
      for(let j=0;j<4;j++){
        const u=ease((age+.04-j*.042)/.31);if(!u)continue;
        const rr=r*(.12+.83*u),points=[];
        for(let i=0;i<=28;i++){const a=i*turn/28,v=rr*(i%2?.95:1.04);points.push([Math.cos(a)*v,Math.sin(a)*v*.71]);}
        path(ctx,points,c[j%2],j%2?2.2:3.1);
      }
    }
  }
  function weather(ctx,e,age,c,r) {
    const p=ease((age+.017)/.40);
    if(e.move==='Tera Starstorm'){
      for(let i=0;i<11;i++){
        const a=i*2.4,dist=r*.79*Math.sqrt((i+.35)/11),x=Math.cos(a)*dist,y=Math.sin(a)*dist*.79;
        const f=ease((age+.025-i%4*.036)/.26),h=(1-f)*r*.48;
        path(ctx,[[x+h*.52+4,y-h-8],[x+h*.52,y-h]],prism[i%6],2);
        star(ctx,x+h*.52,y-h,4.4+i%3,4,i*.46+age*2,prism[i%6],.32);
        star(ctx,x+h*.52,y-h,2.1,4,i*.46+age*2,c[2]);
        if(f>.73)ring(ctx,x,y+1,4+4*f,2,c[1],1.1);
      }
    }else if(e.move==='Glaciate'){
      for(let i=0;i<13;i++){
        const a=i*2.4,rr=r*.85*Math.sqrt((i+.3)/13),x=Math.cos(a)*rr,y=Math.sin(a)*rr*.7;
        const f=ease((age+.04-(i%4)*.031)/.27);
        crystal(ctx,x,y-(3+8*f),3+r*.03,4+(8+i%3*2)*f,c,Math.cos(a)*.48);
        path(ctx,[[x-4,y+2],[x,y],[x+5,y+2]],c[1],1.2);
      }
    }else{
      const electric=e.move==='Wildbolt Storm';
      for(let j=0;j<3;j++)arc(ctx,0,3,r*(.30+.16*j+.09*p),.64,age*6+j*2.1,3.7,c[j],2.7-j*.3);
      for(let i=0;i<8;i++){
        const a=i*turn/8+age*2,rr=r*(.32+(i%3)*.17);
        const x=Math.cos(a)*rr,y=Math.sin(a)*rr*.72;
        if(electric){bolt(ctx,x+5,y-r*.32,x,y,5.3,age*13+i,c);star(ctx,x,y,3.8,4,.26,c[2]);}
        else{leaf(ctx,x,y,5.2+i%3,a+1.3,c);star(ctx,x+3,y-5,2.5,4,a,c[2]);}
      }
    }
  }
  function flowers(ctx,e,age,c,r) {
    const p=ease((age+.02)/.38);
    switch(e.move){
      case 'Petal Blizzard':
        for(let j=0;j<2;j++)arc(ctx,0,0,r*(.34+j*.3+.09*p),.67,-.9+age*7+j*2,3.45,'#f4bdd5',1.6);
        for(let i=0;i<23;i++){
          const a=i*2.4+p*1.53,rr=r*(.12+.76*Math.sqrt((i+.4)/23));
          leaf(ctx,Math.cos(a)*rr,Math.sin(a)*rr*.76,3.4+i%3,a+.6,i%4?palettes.mist:c);
        }
        break;
      case 'Pollen Puff':
        for(let i=0;i<16;i++){
          const a=i*2.4,rr=r*(.13+.51*p)*Math.sqrt((i+1)/16),x=Math.cos(a)*rr,y=Math.sin(a)*rr*.82;
          const puff=3.7+(i%3)*1.55;disc(ctx,x,y,puff,'#e6cb78');disc(ctx,x-puff*.3,y-puff*.3,puff*.46,'#fff2bd');
          for(let j=0;j<2;j++){const d=rr*(1.4+j*.1);disc(ctx,Math.cos(a+.12*j)*d,Math.sin(a+.12*j)*d*.88,1.55,j?c[2]:'#ffe78c');}
        }
        break;
      case 'Fleur Cannon':{
        const rr=r*(.17+.37*p);
        for(let i=0;i<6;i++){
          const a=i*turn/6+p*.31,dx=Math.cos(a),dy=Math.sin(a);
          ctx.save();ctx.rotate(a);
          const petal=[[3,0],[rr*.45,-rr*.23],[rr*.87,-rr*.26],[rr,-rr*.10],[rr*.96,0],
            [rr,rr*.10],[rr*.87,rr*.26],[rr*.45,rr*.23]];
          polygon(ctx,petal,i%2?'#ed9dc5':'#b7a4d9');path(ctx,petal.slice(1,5),c[2],1.6);
          path(ctx,[[4,0],[rr*.80,0]],c[0],1.4);ctx.restore();
          const ray=rr*(1.22+.26*p);
          trace(ctx,[[dx*(rr+2),dy*(rr+2)],[dx*ray,dy*ray]],c,2.2);
        }
        ring(ctx,0,0,7,7,c[1],2.4);star(ctx,0,0,8+5*p,6,p,c[2]);break;
      }
      case 'Egg Bomb':{
        for(const s of [-1,1]){
          ctx.save();ctx.translate(s*(3+14*p),1-12*Math.sin(p*Math.PI));ctx.rotate(s*(.2+p));
          const pt=[[0,-11],[s*4,-9],[s*7,-4],[s*8,3],[s*5,9],[0,10],[-s*1,4],[s*2,1],[-s*1,-2],[s*2,-6]];
          polygon(ctx,pt,'#fff0d1');path(ctx,pt.slice(5),'#c68d67',1.35);ctx.restore();
        }
        const rr=r*(.16+.53*p);rays(ctx,0,1,rr,p,palettes.gold,10,.13);
        ring(ctx,0,3,rr,rr*.6,palettes.gold[1],1.9);break;
      }
      case 'Relic Song':
        for(let j=0;j<3;j++)arc(ctx,0,0,r*(.28+.11*j+.15*p),.64,age*3+j*.25-.9,4.8,'#cfae76',1.45);
        for(let i=0;i<8;i++){const a=i*turn/8+age*2.1,rr=r*(.40+.22*(i%2));
          note(ctx,Math.cos(a)*rr,Math.sin(a)*rr*.61-5*p,5.2+i%2,palettes.gold,Math.sin(a)*.3);}
        star(ctx,0,0,6,6,p,c[2]);break;
    }
  }
  function reactor(ctx,e,age,c,r) {
    const p=ease((age+.02)/.39);
    switch(e.move){
      case 'Zap Cannon':{
        const size=r*(.17+.12*Math.sin(Math.PI*p));
        halo(ctx,0,0,size*1.8,'#ffcf565c');disc(ctx,0,0,size,c[0]);
        for(let i=0;i<8;i++){const a=i*turn/8+age*2.5,rr=r*(.41+.36*p);
          bolt(ctx,Math.cos(a)*size*.76,Math.sin(a)*size*.76,Math.cos(a)*rr,Math.sin(a)*rr,6,age*17+i,c);}
        star(ctx,0,0,size*.79,5,age*7,c[2]);break;
      }
      case 'Gyro Ball':{
        const size=r*.30,x=(p-.5)*r*.88;
        disc(ctx,x,0,size,c[0]);ring(ctx,x,0,size,size,c[1],2.2);
        for(let i=0;i<3;i++){
          const a=age*8+i*turn/3;ring(ctx,x,0,size,size*.31,c[1+i%2],1.7,a);
          disc(ctx,x+Math.cos(a)*size*.86,Math.sin(a)*size*.86,2.3,c[2]);
        }
        for(let i=0;i<3;i++)arc(ctx,x,0,size+8+i*5,.76,age*12+i*2.2,2.5,c[i%2+1],2);break;
      }
      case 'Searing Shot':
        for(let i=0;i<12;i++){const a=i*turn/12,rr=r*(.16+.60*p);flame(ctx,Math.cos(a)*rr,Math.sin(a)*rr*.75,4+i%3,c,a*.28);}
        ring(ctx,0,0,r*(.16+.60*p),r*(.13+.45*p),c[1],2.5);
        flame(ctx,0,0,r*.14*(1.12-p*.45),c,.08);break;
      case 'Fiery Wrath':
        for(const s of [-1,1])for(let i=0;i<6;i++){
          const x=s*(8+i*r*.095)*(.52+.48*p),y=-Math.sin(i*.64)*r*.20-i*r*.016;
          flame(ctx,x,y,r*(.115-i*.008),['#452448','#cf4d89','#ffd0d5'],s*(.9+i*.095));
        }
        eye(ctx,0,0,r*.135,c,.57);break;
      case 'Dragon Energy':{
        const pts=[];
        for(let i=0;i<=46;i++){
          const u=i/46,a=u*turn*1.45+age*5,rr=r*(.075+.68*u)*(.72+.28*p);
          pts.push([Math.cos(a)*rr,Math.sin(a)*rr*.72]);
        }
        trace(ctx,pts,['#3f467f','#86d8dc','#adddcf'],5.5);
        const [x,y]=pts[pts.length-1],[prevX,prevY]=pts[pts.length-2];
        ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(y-prevY,x-prevX));
        polygon(ctx,[[-10,-3],[-13,-10],[-3,-6],[5,-4],[13,0],[5,5],[-6,4],[-12,8]],c[0]);
        path(ctx,[[-7,-4],[-2,-5],[7,-1]],'#a8f2e1',2);disc(ctx,4,-1.5,1.5,c[2]);ctx.restore();break;
      }
    }
  }
  function cut(ctx,e,age,c,length) {
    const p=ease((age+.018)/.23),rr=length*.72,half=e.sector.halfAngle;
    for(let i=0;i<2;i++){
      const points=[];
      for(let k=0;k<=17;k++){
        const u=p*k/17,a=-half*.83+u*half*1.65,r=rr*(.88+.17*Math.sin(u*Math.PI))+i*3.8;
        points.push([Math.cos(a)*r,Math.sin(a)*r]);
      }
      path(ctx,points,c[1+i],i?1.6:3.4);
    }
  }
  function dash(ctx,e,age,c,length) {
    const p=ease((age+.021)/.29),head=length*p;
    if(e.move==='Electro Drift'){
      for(let i=0;i<2;i++){
        const pts=[];
        for(let k=0;k<=21;k++){const u=p*k/21;
          pts.push([length*u,(i?1:-1)*(2+6*Math.sin(u*Math.PI)**2)+Math.sin(u*turn-.7)*4]);}
        trace(ctx,pts,i?palettes.aura:c,2.7);
      }
      ring(ctx,head,Math.sin(p*turn-.7)*4,7,5,c[1],2.4,-.3);
      bolt(ctx,Math.max(0,head-18),-1,head+1,0,4,age*15,c);
    }else if(e.move==='Collision Course'){
      for(let i=0;i<4;i++){const u=clamp(p-i*.085);if(!u)continue;
        const x=length*u;trace(ctx,[[x-8,-8],[x+3,0],[x-8,8]],i===0?palettes.gold:c,i===0?4.5:2.1);}
      star(ctx,head,0,7,6,age*7,c[2]);
    }else if(e.move==='Accelerock'){
      for(let i=0;i<6;i++){
        const u=clamp(p-i*.068),y=Math.sin(i*2.4)*(2+i);if(u)crystal(ctx,length*u,y,2.7+(5-i)*.48,3.1+(5-i)*.65,c,1.1+i*.41);
      }
      path(ctx,[[Math.max(0,head-16),-2],[head+2,-1]],c[2],2);
    }else{
      const fire=e.move==='Heat Crash';
      for(let i=0;i<5;i++){
        const u=clamp(p-i*.067);if(!u)continue;
        const x=length*u,y=-Math.sin(Math.PI*u)*Math.min(13,length*.15);
        if(fire)flame(ctx,x,y,4+(4-i)*1.32,c,1.1);
        else{
          const w=4.7-i*.46;polygon(ctx,[[x-w*1.4,y],[x-w*.42,y-w],[x+w,y-w*.55],[x+w*1.4,y],[x,y+w*.8]],c[i%2]);
          path(ctx,[[x-w*.42,y-w],[x+w,y-w*.55]],c[2],1.5);
        }
      }
      if(p>.59)ring(ctx,length,3,3+(p-.59)*25,2+(p-.59)*9,c[1],2);
    }
  }
  function cannon(ctx,e,age,c,length) {
    const p=ease((age+.028)/.23),w=e.halfWidth>0?e.halfWidth:17,l=length*p;
    ctx.beginPath();ctx.rect(0,-w,length,2*w);ctx.clip();
    if(e.move==='Photon Geyser'){
      for(let i=0;i<6;i++){
        const off=(i-2.5)*w*.25;
        path(ctx,[[0,0],[l*.27,off*.28],[l*.42,off],[l*.72,-off*.42],[l,off*.25]],prism[i],2.5);
      }
      for(let i=1;i<5;i++){const x=l*i/5;crystal(ctx,x,Math.sin(age*8+i)*w*.25,2.7,5.1,c,.56+i*.35);}
      path(ctx,[[0,0],[l,0]],c[2],1.55);
    }else{
      const width=w*(.36+.18*Math.sin(p*Math.PI));
      polygon(ctx,[[0,-width*.48],[l*.29,-width],[l,-width*.4],[l,width*.4],[l*.29,width],[0,width*.48]],'#bd497c');
      for(const sign of [-1,1]){
        const points=[];for(let i=0;i<=36;i++){const u=i/36;points.push([l*u,sign*Math.sin(u*turn*2.3-age*13)*width*.74]);}
        path(ctx,points,sign===1?'#ffa4d8':'#e5c3ff',2.35);
      }
      for(let i=0;i<4;i++){const x=l*(i+.55)/4;arc(ctx,x,0,width*1.3,.86,age*9+i*1.4,4.75,c[1],1.65);}
    }
  }
  function sandWall(ctx,e,age,c,length) {
    const p=ease((age+.03)/.41),w=e.halfWidth>0?e.halfWidth:42.5;
    ctx.beginPath();ctx.rect(0,-w,length,2*w);ctx.clip();
    for(let i=0;i<7;i++){
      const u=clamp(p-(i%3)*.037),x=length*u-i%2*5,y=(i-3)*w*.27;
      arc(ctx,x-4,y,7+i%3*2,.82,-2.5+age*7+i,4.1,c[i%2],2.5);
      for(let j=0;j<4;j++){
        const px=x-5-j*3+Math.cos(i+j+age*12)*3,py=y+Math.sin(i*1.4+j+age*9)*5;
        disc(ctx,px,py,1.4+j%2*.7,c[1+j%2]);
      }
    }
  }
});
