/* Arena move artwork. Positions, travel and time come from combat or its replay. */
(() => {
  'use strict';
  const turn = Math.PI * 2;
  const lifetime = 0.58;
  const clamp = value => Math.max(0, Math.min(1, value));
  function ease(value) {
    const p = clamp(value);
    return p * p * (3 - 2 * p);
  }

  const palettes = {
    gold:['#dc8c22','#ffcf42','#ffffd9'], sun:['#5a9a44','#cce958','#fffbb5'],
    ice:['#4276af','#79dcf3','#efffff'], prism:['#8077cb','#9de9db','#ffdcfa'],
    psychic:['#7e4db2','#ee92de','#ffedf9'], steel:['#626c9b','#b8dfef','#fffef7'],
    dragon:['#5942a4','#ae8dff','#ffe4aa'], water:['#235b9c','#48b2eb','#ddffff'],
    mud:['#786040','#bb955e','#ffdf9e'], sludge:['#5c426f','#b474c8','#fbcbf4'],
    fire:['#bf4c2d','#ff9637','#fff0a0'], ghost:['#32234f','#9460cf','#efcfff'],
    aura:['#4552a2','#66bbf3','#f4ffff'], grass:['#428451','#8ed562','#eaffb7'],
    rock:['#644b3e','#b68c64','#f0d3a0'], wind:['#7194ab','#b3e0dd','#fcfff5'],
    mist:['#94679e','#e7a9d9','#fff0fe'], silver:['#687889','#c9d4df','#ffffed']
  };
  const profiles = new Map();
  function register(kind, palette, ...moves) {
    for (const move of moves) profiles.set(move, {kind, colors:palettes[palette]});
  }
  register('sky','gold','Thunder');
  register('bolt','gold','Thunderbolt','Thunder Shock');
  register('orb','gold','Electro Ball');
  register('orb','ghost','Shadow Ball');
  register('orb','aura','Aura Sphere','Focus Blast');
  register('orb','grass','Energy Ball');
  register('orb','sludge','Sludge Bomb');
  register('beam','fire','Hyper Beam');
  register('beam','sun','Solar Beam');
  register('beam','ice','Ice Beam');
  register('beam','prism','Aurora Beam');
  register('beam','psychic','Psybeam');
  register('beam','steel','Flash Cannon');
  register('beam','dragon','Dragon Pulse');
  register('wave','water','Surf');
  register('wave','mud','Muddy Water');
  register('wave','ice','Blizzard');
  register('wave','fire','Heat Wave');
  register('wave','sludge','Sludge Wave');
  register('quake','rock','Earthquake');
  register('cone','fire','Flamethrower');
  register('cone','dragon','Dragon Breath');
  register('cone','ice','Icy Wind');
  register('vortex','wind','Hurricane');
  register('vortex','mud','Twister');
  register('vortex','ice','Bleakwind Storm');
  register('fall','rock','Rock Slide');
  register('fall','dragon','Draco Meteor');
  register('blast','fire','Fire Blast','Explosion','Self-Destruct');
  register('blast','mist','Misty Explosion');
  register('slash','silver','Slash','X Scissor');
  register('slash','ghost','Night Slash');
  register('slash','grass','Leaf Blade');
  register('dash','silver','Quick Attack','Extreme Speed');
  register('dash','fire','Flare Blitz');
  register('dash','wind','Brave Bird');
  register('guard','aura','Protect');
  register('guard','prism','Reflect');
  register('guard','psychic','Light Screen');
  register('heal','aura','Recover');
  register('heal','mist','Moonlight');
  register('heal','grass','Synthesis');
  register('heal','wind','Roost');

  function path(ctx, points, color, width=1) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (let i=1; i<points.length; i++) ctx.lineTo(...points[i]);
    ctx.lineWidth=width; ctx.strokeStyle=color; ctx.stroke();
  }
  function polygon(ctx, points, color) {
    ctx.beginPath(); ctx.moveTo(...points[0]);
    for (let i=1; i<points.length; i++) ctx.lineTo(...points[i]);
    ctx.closePath(); ctx.fillStyle=color; ctx.fill();
  }
  function disc(ctx,x,y,r,color) {
    ctx.beginPath(); ctx.arc(x,y,r,0,turn); ctx.fillStyle=color; ctx.fill();
  }
  function ring(ctx,x,y,rx,ry,color,width=1,tilt=0) {
    ctx.beginPath(); ctx.ellipse(x,y,rx,ry,tilt,0,turn);
    ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke();
  }
  function halo(ctx,x,y,r,color) {
    const glow=ctx.createRadialGradient(x,y,0,x,y,r);
    glow.addColorStop(0,color); glow.addColorStop(1,'transparent');
    ctx.fillStyle=glow; ctx.fillRect(x-r,y-r,2*r,2*r);
  }
  function mote(ctx,x,y,size,color) {
    ctx.fillStyle=color; ctx.fillRect(Math.round(x),Math.round(y),size,size);
  }
  function sparks(ctx,x,y,r,age,colors,count=8) {
    const p=ease(age/.38);
    ctx.save(); ctx.globalAlpha*=1-ease(age/.52);
    for (let i=0; i<count; i++) {
      const angle=i*2.4, dx=Math.cos(angle), dy=Math.sin(angle);
      const reach=(.12+.88*p)*r*(.62+(i%4)*.12);
      const px=x+dx*reach, py=y+dy*reach*.76;
      path(ctx,[[px,py],[px+dx*(2+i%3),py+dy*(2+i%3)]],colors[1+i%2],1.5);
    }
    ctx.restore();
  }

  // Reveal one connected stroke from the ceiling down to the recorded hit point.
  function skyStrike(ctx,x,y,top,age,sign,colors,landed) {
    const height=y-top, point=(offset,fraction)=>[x+sign*offset, top+height*fraction];
    const main=[point(23,-.02),point(4,.17),point(13,.26),point(-8,.43),point(4,.44),
      point(-13,.61),point(2,.59),point(-6,.77),point(5,.81),point(0,1)];
    const fade=1-ease((age-.15)/.27);
    if (fade>0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(x-65,top-4,130,4+height*ease((age+.012)/.083)); ctx.clip();
      ctx.globalAlpha=fade*.25; path(ctx,main,'#7960bd',16);
      ctx.globalAlpha=fade*.76; path(ctx,main,colors[0],8.5);
      ctx.globalAlpha=fade; path(ctx,main,colors[1],4.6); path(ctx,main,colors[2],2.1);
      for (const fork of [[main[2],point(31,.38),point(26,.44),point(48,.56)],
        [main[3],point(-32,.48),point(-33,.55),point(-50,.60)],
        [main[7],point(-18,.82),point(-15,.87),point(-25,.93)]]) {
        path(ctx,fork,colors[1],2.5); path(ctx,fork,colors[2],.95);
      }
      ctx.restore();
    }
    if (landed && age>=.055) {
      const hit=age-.055;
      ctx.globalAlpha=1-ease(hit/.50);
      halo(ctx,x,y,32,colors[1]); ring(ctx,x,y+6,5+24*ease(hit/.3),2+6*ease(hit/.3),colors[2],1.5);
      sparks(ctx,x,y+4,30,hit,colors,11);
    }
  }
  function forkBolt(ctx,length,age,colors,light) {
    const head=length*ease((age+.014)/.08),n=light?6:10;
    const spread=Math.min(light?5:11,length/7),points=[[0,0]];
    for (let i=1;i<n;i++) points.push([head*i/n,Math.sin(i*8.6+age*14)*spread*Math.sin(Math.PI*i/n)]);
    points.push([head,0]); ctx.globalAlpha=1-ease((age-.11)/.34);
    path(ctx,points,colors[0],light?3.7:6.5); path(ctx,points,colors[2],light?1.4:2.4);
    if (!light) for (const i of [3,6]) {
      const [x,y]=points[i], side=i===3?-1:1;
      path(ctx,[[x,y],[x+6,y+side*7],[x+12,y+side*5],[x+18,y+side*13]],colors[1],1.4);
    }
  }

  function charge(ctx,cast) {
    if (!cast.line || cast.flight || !['Hyper Beam','Solar Beam'].includes(cast.move)) return;
    const {line}=cast, colors=profiles.get(cast.move).colors;
    const p=ease(1-cast.remaining/cast.warning),offset=Math.min(12,line.length*.12);
    ctx.save(); ctx.translate(line.x+line.dx*offset,line.y+line.dy*offset);
    const angle=Math.atan2(line.dy,line.dx); ctx.rotate(angle);
    ctx.globalAlpha=.34+.53*p; halo(ctx,0,0,12+22*p,colors[1]); ctx.globalAlpha=1;
    for (let i=0;i<14;i++) {
      const u=(p*(1.9+i%3*.14)+i*.221)%1, a=i*2.4+p*(i%2?.75:-.65);
      const r=(1-u)*(20+17*p+i%4),dx=Math.cos(a),dy=Math.sin(a)*.86;
      ctx.globalAlpha=(.23+.68*p)*Math.sin(Math.PI*u);
      path(ctx,[[dx*(r+4),dy*(r+4)],[dx*r,dy*r]],colors[1+i%2],1.4);
    }
    for (let i=0;i<2;i++) {
      const u=(p*2.05+i*.5)%1, r=6+(1-u)*(10+6*p);
      ctx.globalAlpha=Math.sin(Math.PI*u)*(.22+.52*p); ring(ctx,0,0,r*.65,r,colors[2],1);
    }
    ctx.globalAlpha=1; disc(ctx,0,0,2.5+7*p,colors[1]); disc(ctx,0,0,1.5+4*p,colors[2]);
    ctx.restore();
  }
  function beam(ctx,length,halfWidth,age,colors,move) {
    const hyper=move==='Hyper Beam',offset=Math.min(12,length*.12);
    ctx.translate(offset,0); length-=offset;
    const head=length*ease((age+.022)/.105), fade=1-ease((age-.17)/.41);
    // Snapshots from earlier servers carry a zero beam width.
    const core=halfWidth>0?halfWidth/1.38:(hyper?24:11);
    const r=core*(.32+.68*ease((age+.02)/.1))*(1-.86*ease((age-.17)/.41));
    const throat=Math.min(24,head*.35);
    for (const [w,alpha,tint] of [[1.38,.2,colors[0]],[1,.78,colors[0]],[.73,.98,colors[1]],[.32,1,colors[2]]]) {
      ctx.globalAlpha=fade*alpha;ctx.fillStyle=tint;ctx.beginPath();ctx.moveTo(0,0);
      ctx.quadraticCurveTo(throat*.35,-r*w,throat,-r*w); ctx.lineTo(head,-r*w*.86);
      ctx.lineTo(head,r*w*.86);ctx.lineTo(throat,r*w);ctx.quadraticCurveTo(throat*.35,r*w,0,0);ctx.fill();
    }
    ctx.globalAlpha=fade*.8;
    if (move==='Ice Beam') {
      for(let i=1;i<=9;i++) {
        const x=head*i/10, side=i%2?1:-1;
        polygon(ctx,[[x,0],[x+3,side*(r+4)],[x+8,0]],colors[2]);
      }
    } else if (move==='Aurora Beam' || move==='Psybeam') {
      const ribbons=move==='Aurora Beam'?['#ffb9d9','#b5fbc7','#b0d7ff']:[colors[2],colors[0]];
      ribbons.forEach((tint,i)=>{
        const points=[];
        for(let k=0;k<=16;k++) points.push([head*k/16,Math.sin(k*.74+i*2+age*21)*r*.8]);
        path(ctx,points,tint,1.7);
      });
    } else {
      const count=move==='Dragon Pulse'?6:4;
      for(let i=0;i<count;i++) {
        const x=(i+((age*4)%1))*head/count, ry=r*(move==='Dragon Pulse'?1.28:.94);
        ring(ctx,x,0,Math.max(.5,ry*.32),ry,colors[2],hyper?1.8:1.3);
      }
    }
    ctx.globalAlpha=fade; halo(ctx,0,0,10+r*.6,colors[1]);
  }

  function orb(ctx,line,travel,colors,move) {
    const r=line.radius, angle=Math.atan2(line.dy,line.dx), time=travel/34;
    ctx.save(); ctx.translate(line.x+line.dx*travel,line.y+line.dy*travel);ctx.rotate(angle);
    for(let i=4;i>0;i--) {
      const offset=Math.min(travel,i*r*.75);
      ctx.globalAlpha=.42-i*.064;
      disc(ctx,-offset,0,r*(1-i*.135),colors[1]);
    }
    ctx.globalAlpha=.73;halo(ctx,0,0,r*1.65,colors[1]);ctx.globalAlpha=1;
    disc(ctx,0,0,r,colors[0]);disc(ctx,0,0,r*.69,colors[1]);
    ctx.rotate(time);
    if(move==='Electro Ball') {
      path(ctx,[[-r*.72,-r*.28],[-1,-r*.16],[-3,r*.3],[r*.64,0]],colors[2],2);
      path(ctx,[[0,-r*1.15],[3,-r*.72],[1,-r*.47]],colors[2],1.3);
    } else if(move==='Shadow Ball') {
      disc(ctx,0,0,r*.57,colors[0]);
      for(let i=0;i<3;i++) {
        ctx.rotate(turn/3);ctx.beginPath();ctx.arc(0,0,r*.89,.2,1.7);
        ctx.strokeStyle=colors[2];ctx.lineWidth=1.3;ctx.stroke();
      }
    } else if(move==='Energy Ball'){
      for(let i=0;i<3;i++){ctx.rotate(turn/3);polygon(ctx,[[0,0],[r*.16,-r*.62],[r*.68,-r*.67],[r*.51,-r*.12]],colors[2]);}
    } else if(move==='Sludge Bomb'){
      for(let i=0;i<4;i++){ctx.rotate(turn/4);disc(ctx,r*.72,0,r*.36,colors[i%2]);} disc(ctx,-2,-2,2,colors[2]);
    } else {
      ring(ctx,0,0,r*1.09,r*.5,colors[2],move==='Focus Blast'?2:1.2);
      ring(ctx,0,0,r*.5,r,colors[2],1);disc(ctx,0,0,r*.33,colors[2]);
    }
    ctx.restore();
  }
  function vortex(ctx,cast,colors,sign) {
    const {center,radius,remaining}=cast,age=3-remaining;
    ctx.save();ctx.translate(center.x,center.y);ctx.scale(sign,1);
    ctx.globalAlpha=.18;disc(ctx,0,0,radius,colors[0]);
    ctx.globalAlpha=.82;ring(ctx,0,0,radius,radius,cast.actor?.friendly?'#85dfff':'#ff9d8a',1.4);
    for(let arm=0;arm<3;arm++) {
      const points=[];
      for(let j=0;j<=22;j++) {
        const u=j/22,r=radius*(.09+.87*u),a=age*6+arm*turn/3+u*4.8;
        points.push([Math.cos(a)*r, Math.sin(a)*r]);
      }
      path(ctx,points,arm%2?colors[2]:colors[1],cast.move==='Hurricane'?3.2:2);
      const [x,y]=points[17];mote(ctx,x,y,cast.move==='Twister'?3:2,colors[2]);
    }
    ctx.restore();
  }
  function activeCast(ctx,cast,mirrored=false) {
    const style=profiles.get(cast.move);
    if (!style) return false;
    if (cast.flight && cast.line && style.kind==='orb') {
      orb(ctx,cast.line,cast.travel,style.colors,cast.move); return true;
    }
    if (cast.roaming && style.kind==='vortex') {
      vortex(ctx,cast,style.colors,mirrored?-1:1); return true;
    }
    return false;
  }
  function wave(ctx,length,halfWidth,age,colors,move) {
    const p=ease((age+.014)/.24),head=p*length,fade=1-ease((age-.16)/.42);
    ctx.save();ctx.beginPath();ctx.rect(0,-halfWidth,length,halfWidth*2);ctx.clip();
    ctx.globalAlpha=.12*fade;ctx.fillStyle=colors[0];ctx.fillRect(0,-halfWidth,length,halfWidth*2);
    ctx.globalAlpha=.38*fade;ctx.fillStyle=colors[1];ctx.fillRect(Math.max(0,head-70),-halfWidth,Math.min(70,head),2*halfWidth);
    const crest=[];
    for(let i=0;i<=18;i++) {
      const y=(i/9-1)*halfWidth, curl=Math.sin(i*.83+age*19);
      crest.push([head-4+curl*4,y]);
    }
    ctx.globalAlpha=.9*fade;
    path(ctx,crest,colors[1],7);path(ctx,crest,colors[2],2.1);
    for(let i=0;i<21;i++){
      const y=(i/20*2-1)*halfWidth+Math.sin(i*2.3+age*11)*4;
      const x=head-4-((i*13+age*75)%49);
      if(move==='Blizzard') {
        path(ctx,[[x-7,y+4],[x+5,y-4]],colors[2],1.4);
        if(!(i%4))path(ctx,[[x-1,y-3],[x+1,y+3]],colors[2],1.2);
      } else if(move==='Heat Wave') {
        path(ctx,[[x-9,y+1],[x-4,y-3],[x,y+1],[x+4,y-2]],colors[1+i%2],1.8);
      } else if(move==='Sludge Wave') {
        disc(ctx,x,y,2+i%4,colors[i%2]);if(!(i%3))mote(ctx,x-1,y-1,2,colors[2]);
      } else {
        ring(ctx,x,y,3+i%4,1.1+i%2,colors[move==='Surf'?2:i%3],1.4,-.12);
      }
    }
    ctx.restore();
  }
  function fracture(ctx,x,y,inner,outer,age,colors) {
    const fade=1-ease((age-.13)/.43),front=inner+(outer-inner)*ease((age+.025)/.21);
    ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.arc(0,0,outer,0,turn);
    if(inner>0){ctx.moveTo(inner,0);ctx.arc(0,0,inner,0,turn);}
    ctx.clip('evenodd');
    ctx.globalAlpha=.8*fade;ring(ctx,0,0,front,front,colors[2],2.2);
    for(let i=0;i<11;i++) {
      const angle=i*turn/11+.12,points=[];
      for(let k=0;k<=8;k++) {
        const r=inner+(front-inner)*k/8;
        const bend=Math.sin(r*.15+i*7)*3.4*Math.min(r/15,1);
        points.push([Math.cos(angle)*r-Math.sin(angle)*bend,Math.sin(angle)*r+Math.cos(angle)*bend]);
      }
      path(ctx,points,colors[0],3);path(ctx,points,colors[2],.9);
      const [px,py]=points[5],side=i%2?1:-1;
      path(ctx,[[px,py],[px+Math.cos(angle+side*.7)*9,py+Math.sin(angle+side*.7)*9]],colors[0],1.8);
    }
    ctx.restore();
  }
  function sector(ctx,s,age,colors,move,kind) {
    const angle=Math.atan2(s.dy,s.dx),reach=s.length;
    ctx.save();ctx.translate(s.x,s.y);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(0,0);
    ctx.arc(0,0,reach,-s.halfAngle,s.halfAngle);ctx.closePath();ctx.clip();
    const p=ease((age+.024)/.3),fade=1-ease((age-.12)/.44);
    if (kind==='slash') {
      const r=reach*(.44+.54*p);
      ctx.globalAlpha=fade;
      for(let i=0;i<3;i++) {
        ctx.beginPath();ctx.arc(0,0,r*(.72+i*.12),-s.halfAngle,(2*p-1)*s.halfAngle);
        ctx.lineWidth=i===1?4:1.5;ctx.strokeStyle=colors[i];ctx.stroke();
      }
      if(move==='Leaf Blade')for(let i=0;i<4;i++){
        const a=(i/3-.5)*s.halfAngle*1.6, x=Math.cos(a)*r*.8, y=Math.sin(a)*r*.8;
        polygon(ctx,[[x-3,y+1],[x+2,y-3],[x+5,y-2],[x+1,y+2]],colors[1]);
      }
    } else {
      const front=reach*ease((age+.02)/.16);
      ctx.globalAlpha=.17*fade;
      polygon(ctx,[[0,0],[front*Math.cos(s.halfAngle),-front*Math.sin(s.halfAngle)],[front,0],
        [front*Math.cos(s.halfAngle),front*Math.sin(s.halfAngle)]],colors[1]);
      for(let i=0;i<24;i++) {
        const u=(i*.179+age*2.4)%1,r=u*front,a=Math.sin(i*4.13)*s.halfAngle*.91;
        const x=Math.cos(a)*r,y=Math.sin(a)*r;
        ctx.globalAlpha=fade*(1-u*.53);
        if(move==='Icy Wind') path(ctx,[[x-5,y+1],[x+3,y-2]],colors[1+i%2],1.5);
        else if(move==='Dragon Breath') {
          path(ctx,[[x-7,y-2],[x-1,y+2],[x+4,y-2]],colors[1+i%2],2.2);
        } else {
          disc(ctx,x,y,2+u*7,colors[i%3===0?2:1]);mote(ctx,x+3,y-3,2,colors[2]);
        }
      }
    }
    ctx.restore();
  }
  function rush(ctx,length,age,colors,move) {
    const fade=1-ease(age/.52),head=Math.min(length,length*ease((age+.05)/.15));
    ctx.globalAlpha=fade;
    for(let i=-2;i<=2;i++) {
      const end=Math.max(0,head-Math.abs(i)*4);
      const start=Math.max(0,end-(move==='Extreme Speed'?66:38)+Math.abs(i)*4);
      const y=i*3.4;
      path(ctx,[[start,y],[end,y*.75]],i%2?colors[1]:colors[2],i?1.5:3);
      if(move==='Flare Blitz') disc(ctx,(start+end)/2,y,3+Math.abs(i),colors[i%2?0:1]);
      if(move==='Brave Bird')path(ctx,[[start,y+i*3],[end,y*.75]],colors[1],2);
    }
  }

  function falling(ctx,x,y,r,age,colors,meteor,sign) {
    const count=meteor?1:6;
    for(let i=0;i<count;i++){
      const t=age-(i%3)*.045;
      if(t<0)continue;
      const p=ease((t+.015)/.17),angle=i*2.4;
      const reach=meteor?0:r*(.25+(i%3)*.21);
      const destX=x+sign*Math.cos(angle)*reach,destY=y+Math.sin(angle)*reach;
      const size=meteor?10:4+i%4,shift=1-p;
      const px=destX+sign*shift*(meteor?47:10),py=destY-shift*(meteor?108:46);
      if(t<.23){
        ctx.globalAlpha=1-ease((t-.14)/.09);
        path(ctx,[[px+sign*(meteor?16:3),py-(meteor?34:14)],[px,py]],colors[1],size*.9);
        polygon(ctx,[[px-size,py],[px-size*.42,py-size],[px+size*.53,py-size*.89],[px+size,py+2],
          [px+size*.14,py+size*.7],[px-size*.73,py+size*.48]],colors[0]);
        path(ctx,[[px-size*.74,py-1],[px-size*.29,py-size*.78],[px+size*.50,py-size*.61]],colors[2],1.8);
      }
      if(t>.15){
        const impact=t-.15;ctx.globalAlpha=1-ease(impact/.32);
        ring(ctx,destX,destY,3+ease(impact/.25)*size*2.2,2+ease(impact/.25)*size*.7,colors[1],1.8);
      }
    }
  }
  function blast(ctx,x,y,r,age,colors,move) {
    const p=ease((age+.025)/.27),fade=1-ease((age-.11)/.46);
    ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.arc(0,0,r,0,turn);ctx.clip();
    ctx.globalAlpha=.35*fade;halo(ctx,0,0,Math.max(2,p*r),colors[1]);
    ctx.globalAlpha=.87*fade;
    if(move==='Fire Blast'){
      const size=r*.85*p;
      for(const [dx,dy] of [[0,-1],[-.95,-.28],[.95,-.28],[-.74,.78],[.74,.78]]){
        const ray=[[0,0],[dx*size*.48,dy*size*.34],[dx*size,dy*size]];
        path(ctx,ray,colors[0],Math.max(2,size*.16));path(ctx,ray,colors[1],Math.max(1.4,size*.09));path(ctx,ray,colors[2],2);
      }
    } else {
      ring(ctx,0,0,r*p,r*p,colors[1],4);ring(ctx,0,0,r*p*.83,r*p*.83,colors[2],1.7);
      for(let i=0;i<12;i++){
        const a=i*2.4,dist=p*r*(.32+(i%4)*.13);
        const px=Math.cos(a)*dist,py=Math.sin(a)*dist;
        if(move==='Misty Explosion')ring(ctx,px,py,3+7*p,3+7*p,colors[2],1.7);
        else polygon(ctx,[[px,py],[px+Math.cos(a-.2)*12,py+Math.sin(a-.2)*12],
          [px+Math.cos(a)*19,py+Math.sin(a)*19]],colors[i%3]);
      }
    }
    ctx.restore();
  }
  function support(ctx,x,y,age,colors,move,guard) {
    const p=ease(age/lifetime),fade=1-ease((age-.15)/.42);
    ctx.globalAlpha=.86*fade;
    if(guard){
      const r=16+10*ease((age+.025)/.17);
      if(move==='Protect'){
        ring(ctx,x,y,r,r*1.12,colors[1],2.6);ring(ctx,x,y,r*.76,r*1.06,colors[2],1.2);
      }else{
        for(let i=0;i<2;i++){
          const dx=move==='Reflect'?5*i:-4*i,dy=i*-3;
          const corners=[[x-r+dx,y-r*.67+dy],[x+r*.8+dx,y-r+dy],[x+r*.8+dx,y+r*.66+dy],[x-r+dx,y+r+dy]];
          ctx.globalAlpha=.15*fade;polygon(ctx,corners,colors[1]);
          ctx.globalAlpha=.85*fade;path(ctx,[...corners,corners[0]],colors[1+i],1.7);
        }
      }
    }else{
      ring(ctx,x,y+13,10+11*p,3+3*p,colors[1],1.4);
      for(let i=0;i<8;i++){
        const u=(p+i/8)%1,a=i*2.4,px=x+Math.sin(a+u)*17,py=y+13-u*37;
        if(move==='Roost'||move==='Synthesis'){
          polygon(ctx,[[px-3,py+2],[px,py-3],[px+4,py-3],[px+1,py+2]],colors[1+i%2]);
        } else {
          path(ctx,[[px-3,py],[px+3,py]],colors[2],1.4);path(ctx,[[px,py-3],[px,py+3]],colors[2],1.4);
        }
      }
      if(move==='Moonlight') {
        ctx.beginPath();ctx.arc(x,y-21,7,Math.PI*.12,Math.PI*1.36);ctx.strokeStyle=colors[2];ctx.lineWidth=2.8;ctx.stroke();
      }
    }
  }

  function failed(e) {
    return e.multiplier===0 || e.damage==='Miss' || e.damage==='Ability blocked' || e.damage==='Failed';
  }
  function drawEffect(ctx,e,mirrored=false) {
    const style=profiles.get(e.move);
    if(!style || e.dashSprite)return false;
    const {kind,colors}=style, age=Math.max(0,lifetime-e.life),sign=mirrored?-1:1;
    const dx=e.tx-e.x,dy=e.ty-e.y,length=Math.hypot(dx,dy);
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    if(e.impactOnly) {
      // Target events are separate from a single cast release, even in a six-player raid.
      if(typeof e.damage==='number' && e.damage>0)sparks(ctx,e.tx,e.ty,20,age,colors);
    } else if(e.status && (kind==='guard'||kind==='heal')) {
      if(!failed(e))support(ctx,e.tx,e.ty,age,colors,e.move,kind==='guard');
    } else if(e.sector && (kind==='slash'||kind==='cone')) {
      sector(ctx,e.sector,age,colors,e.move,kind);
    } else if(e.zone) {
      if(kind==='quake')fracture(ctx,e.tx,e.ty,e.innerRadius??0,e.radius,age,colors);
      else if(kind==='fall')falling(ctx,e.tx,e.ty,e.radius,age,colors,false,sign);
      else if(kind==='blast')blast(ctx,e.tx,e.ty,e.radius,age,colors,e.move);
      else {ctx.restore();return false;}
    } else if(kind==='sky') {
      const missSide=e.tx+sign*26<5 || e.tx+sign*26>ctx.canvas.width-5?-sign:sign;
      const targetX=e.damage==='Miss'?e.tx+missSide*26:e.tx;
      skyStrike(ctx,targetX,e.ty,-8,age,sign,colors,!failed(e));
    } else if(kind==='slash' && !failed(e)) {
      const p=ease((age+.015)/.16);
      ctx.globalAlpha=1-ease((age-.15)/.35);
      for(const side of [-1,1]){
        const cut=[[e.tx-13,e.ty-side*12],[e.tx-13+26*p,e.ty+side*(24*p-12)]];
        path(ctx,cut,colors[0],4.6);path(ctx,cut,colors[2],1.9);
      }
    } else if(kind==='fall' && e.move==='Draco Meteor' && !failed(e)) {
      falling(ctx,e.tx,e.ty,0,age,colors,true,sign);
    } else if(kind==='bolt' || e.line) {
      ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(dy,dx));
      if(kind==='bolt')forkBolt(ctx,e.damage==='Miss'?Math.max(0,length-27):length,age,colors,e.move==='Thunder Shock');
      else if(kind==='beam')beam(ctx,length,e.halfWidth,age,colors,e.move);
      else if(kind==='wave')wave(ctx,length,e.halfWidth,age,colors,e.move);
      else if(kind==='dash')rush(ctx,length,age,colors,e.move);
      else {ctx.restore();return false;}
    } else {ctx.restore();return false;}
    ctx.restore();
    return true;
  }
  function aboveUnits(e) {
    const kind=profiles.get(e.move)?.kind;
    return !e.impactOnly && !e.zone && (kind==='sky'||kind==='bolt'||kind==='heal'||kind==='guard'||
      (kind==='slash' && !e.sector)||e.move==='Draco Meteor');
  }
  globalThis.ArenaMoveEffects={activeCast,charge,drawEffect,aboveUnits};
})();
