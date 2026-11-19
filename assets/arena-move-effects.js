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
    mist:['#94679e','#e7a9d9','#fff0fe'], silver:['#687889','#c9d4df','#ffffed'],
    night:['#2b253c','#9167bc','#f4bdff'], venom:['#603d70','#bc66bc','#eaff9e'],
    ruby:['#9e3c55','#f8786a','#fff3bd'], emerald:['#225d57','#6de0ae','#ffe381']
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

  // These anchors are carried by the combat event. Only ground and lane events play a whole area release.
  function technique(anchor,paint,palette,...moves) {
    for (const move of moves) profiles.set(move,{anchor,paint,colors:palettes[palette]});
  }
  technique('target',mind,'psychic','Confusion','Psychic','Psyshock','Psystrike','Future Sight');
  technique('target',haunt,'night','Night Shade','Hex');
  technique('ground',starlight,'mist','Moonblast','Dazzling Gleam');
  technique('ground',starlight,'gold','Swift');
  technique('link',leaves,'grass','Magical Leaf');
  technique('target',geology,'rock','Ancient Power','Stone Edge');
  technique('target',geology,'fire','Earth Power');
  technique('link',current,'water','Hydro Pump');
  technique('ground',geyser,'water','Hydro Cannon');
  technique('lane',current,'water','Bubble Beam','Water Pulse','Origin Pulse');
  technique('lane',current,'night','Dark Pulse');
  technique('link',drain,'grass','Giga Drain','Mega Drain');
  technique('link',drain,'psychic','Dream Eater');
  technique('ground',soundField,'silver','Hyper Voice');
  technique('ground',soundField,'gold','Boomburst');
  technique('link',buzz,'grass','Bug Buzz');
  technique('fan',snarl,'night','Snarl');
  technique('target',jaws,'silver','Bite');
  technique('target',jaws,'night','Crunch');
  technique('target',jaws,'fire','Fire Fang');
  technique('target',jaws,'ice','Ice Fang');
  technique('target',jaws,'gold','Thunder Fang');
  technique('target',punch,'fire','Fire Punch');
  technique('target',punch,'ice','Ice Punch');
  technique('target',punch,'gold','Thunder Punch');
  technique('target',punch,'night','Sucker Punch','Shadow Punch');
  technique('target',punch,'ruby','Close Combat');
  technique('target',claw,'night','Shadow Claw');
  technique('target',claw,'dragon','Dragon Claw');
  technique('link',airCut,'psychic','Psycho Cut');
  technique('link',airCut,'wind','Air Slash');
  technique('lane',rushTrail,'water','Aqua Jet');
  technique('lane',rushTrail,'emerald','Dragon Ascent');
  technique('lane',rushTrail,'dragon','Dragon Rush');
  technique('lane',rushTrail,'wind','Aerial Ace');
  technique('lane',rushTrail,'fire','Flame Charge');
  technique('lane',rushTrail,'steel','Iron Head');
  technique('ground',landing,'wind','Fly');
  technique('ground',landing,'mist','Bounce');
  technique('target',dragonBlow,'dragon','Dragon Tail');
  technique('target',dragonBlow,'ruby','Outrage');
  technique('target',wildfire,'fire','Fire Spin','Overheat');
  technique('ground',wildfire,'fire','Blast Burn');
  technique('target',venom,'venom','Venoshock','Toxic');
  technique('target',dance,'silver','Swords Dance');
  technique('target',dance,'emerald','Dragon Dance');
  technique('target',dance,'mist','Quiver Dance');
  technique('target',discipline,'psychic','Calm Mind');
  technique('target',discipline,'night','Nasty Plot');
  technique('target',discipline,'steel','Iron Defense');
  technique('target',breeze,'silver','Agility');
  technique('target',breeze,'wind','Tailwind');
  technique('target',wisp,'aura','Will O Wisp');
  technique('target',staticCage,'gold','Thunder Wave');
  technique('target',powder,'prism','Sleep Powder');
  technique('target',powder,'venom','Poison Powder');
  technique('target',powder,'gold','Stun Spore');
  technique('target',powder,'grass','Spore');
  technique('link',melody,'mist','Sing');
  technique('target',trance,'psychic','Hypnosis');
  technique('link',confuseRay,'prism','Confuse Ray');

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

  function star(ctx,x,y,r,tips,rotation,color,inner=.43) {
    const points=[];
    for(let i=0;i<tips*2;i++) {
      const a=rotation+Math.PI*i/tips, radius=i%2?r*inner:r;
      points.push([x+Math.cos(a)*radius,y+Math.sin(a)*radius]);
    }
    polygon(ctx,points,color);
  }
  function crystal(ctx,x,y,w,h,c,tilt=0) {
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt);
    polygon(ctx,[[0,-h],[w,-h*.19],[w*.63,h*.64],[-w*.4,h],[-w,h*.10]],c[0]);
    polygon(ctx,[[0,-h],[w,-h*.19],[0,h*.53],[-w*.38,-h*.09]],c[1]);
    path(ctx,[[-w*.76,-h*.02],[0,-h],[w*.5,-h*.54]],c[2],1.4);ctx.restore();
  }
  function leaf(ctx,x,y,r,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(-r,0);ctx.quadraticCurveTo(-r*.15,-r,r,0);ctx.quadraticCurveTo(0,r*.8,-r,0);
    ctx.fillStyle=c[1];ctx.fill();path(ctx,[[-r*.7,0],[r*.7,0]],c[2],1.2);ctx.restore();
  }
  function flame(ctx,x,y,r,c,lean=0) {
    ctx.save();ctx.translate(x,y);ctx.rotate(lean);
    ctx.beginPath();ctx.moveTo(0,r*.66);ctx.bezierCurveTo(-r*1.2,r*.46,-r*.78,-r*.28,-r*.46,-r*.68);
    ctx.quadraticCurveTo(-r*.5,-r*.05,-r*.15,-r*.19);ctx.quadraticCurveTo(r*.35,-r*.58,r*.17,-r*1.5);
    ctx.bezierCurveTo(r*1.03,-r*.55,r*.98,r*.51,0,r*.66);ctx.fillStyle=c[0];ctx.fill();
    polygon(ctx,[[-r*.45,r*.29],[-r*.17,-r*.46],[0,-r*.13],[r*.33,-r*.71],[r*.41,r*.24],[0,r*.5]],c[1]);
    disc(ctx,0,r*.22,Math.max(.7,r*.19),c[2]);ctx.restore();
  }
  function eye(ctx,x,y,r,c,open) {
    ctx.save();ctx.translate(x,y);ctx.scale(1,open);
    ctx.beginPath();ctx.moveTo(-r,0);ctx.quadraticCurveTo(0,-r*1.12,r,0);ctx.quadraticCurveTo(0,r*1.12,-r,0);
    ctx.fillStyle=c[0];ctx.fill();ctx.strokeStyle=c[2];ctx.lineWidth=1.7;ctx.stroke();
    disc(ctx,0,0,r*.35,c[1]);disc(ctx,0,0,r*.18,c[0]);disc(ctx,-r*.08,-r*.13,r*.075,c[2]);ctx.restore();
  }
  function note(ctx,x,y,r,c,angle) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    ctx.beginPath();ctx.ellipse(-r*.33,r*.45,r*.42,r*.28,-.4,0,turn);ctx.fillStyle=c[1];ctx.fill();
    path(ctx,[[0,r*.4],[0,-r*.8],[r*.43,-r*.48],[r*.6,-r*.22]],c[2],1.7);ctx.restore();
  }

  function mind(ctx,e,age,c) {
    const p=ease(age/.41);
    if(e.move==='Future Sight') {
      const r=29-8*p;
      for(let i=0;i<4;i++){
        const a=i*Math.PI/2+age*.9;ctx.beginPath();ctx.arc(0,-5,r,a+.16,a+.75);ctx.strokeStyle=c[1];ctx.lineWidth=2;ctx.stroke();
      }
      eye(ctx,0,-6,16,c,.2+.8*Math.sin(Math.PI*clamp((age+.02)/.58)));
    } else if(e.move==='Psystrike' || e.move==='Psyshock') {
      const stone=e.move==='Psystrike', count=stone?7:5,orbit=34*(1-ease(age/.25))+9;
      for(let i=0;i<count;i++){
        const a=i*turn/count-.7,x=Math.cos(a)*orbit,y=Math.sin(a)*orbit*.78;
        path(ctx,[[x+Math.cos(a)*12,y+Math.sin(a)*12],[x,y]],c[1],1.6);
        crystal(ctx,x,y,stone?4.8:2.8,stone?7.5:9,stone?[palettes.rock[0],c[1],c[2]]:c,a+.6);
      }
      if(age>.16)star(ctx,0,0,(stone?17:12)*Math.sin(Math.PI*clamp((age-.16)/.42)),6,age,c[2]);
    } else if(e.move==='Psychic'){
      for(let i=0;i<3;i++)ring(ctx,0,-4,14+10*Math.sin(p*Math.PI),6+i*2,c[i],2.2,i*Math.PI/3+age*3);
      for(let i=0;i<4;i++){const a=age*5+i*turn/4;star(ctx,Math.cos(a)*24,Math.sin(a)*17-4,3.3,4,a,c[2]);}
    } else {
      for(let arm=0;arm<2;arm++){
        const points=[];for(let j=0;j<=20;j++){const u=j/20,a=age*5+arm*Math.PI+u*4.1,r=4+17*u;points.push([Math.cos(a)*r,Math.sin(a)*r*.8-3]);}
        path(ctx,points,c[arm+1],2);
      }
    }
  }
  function haunt(ctx,e,age,c) {
    const p=ease(age/.45),r=13+11*p;
    if(e.move==='Hex') {
      ring(ctx,0,-4,r,r,c[1],2);
      for(let i=0;i<6;i++){
        const a=i*turn/6-age*2,x=Math.cos(a)*r,y=Math.sin(a)*r-4;
        polygon(ctx,[[x,y-3.6],[x+3,y],[x,y+3.6],[x-3,y]],c[2]);
        path(ctx,[[x*.7,(y+4)*.7-4],[Math.cos(a+turn/3)*r*.7,Math.sin(a+turn/3)*r*.7-4]],c[0],1.8);
      }
    } else {
      const top=-12-13*p;
      ctx.beginPath();ctx.moveTo(-18,9);ctx.quadraticCurveTo(-14,top-5,0,top-7);ctx.quadraticCurveTo(16,top-4,18,12);
      ctx.lineTo(9,7);ctx.lineTo(5,15);ctx.lineTo(0,8);ctx.lineTo(-6,14);ctx.closePath();ctx.fillStyle=c[0];ctx.fill();
      for(const s of [-1,1])polygon(ctx,[[s*12,top+9],[s*3,top+13],[s*6,top+16]],c[2]);
      for(let i=0;i<4;i++)flame(ctx,(i-1.5)*12,10-Math.sin(age*9+i)*5,3,c,.3);
    }
  }
  function starlight(ctx,e,age,c,r) {
    const p=ease((age+.025)/.38);
    if(e.move==='Moonblast'){
      const y=-r*.7*(1-p),size=8+12*Math.sin(p*Math.PI)+5*p;
      halo(ctx,0,y,size*1.65,c[1]);ctx.beginPath();ctx.moveTo(size*.48,y-size);
      ctx.bezierCurveTo(-size*1.4,y-size,-size*1.4,y+size,size*.48,y+size);
      ctx.quadraticCurveTo(-size*.48,y,size*.48,y-size);ctx.fillStyle=c[2];ctx.fill();
      for(let i=0;i<8;i++){const a=i*turn/8-.4,d=r*.68*p;star(ctx,Math.cos(a)*d,Math.sin(a)*d,3.5,4,a,c[2]);}
    }else if(e.move==='Dazzling Gleam'){
      for(let i=0;i<12;i++){
        const a=i*turn/12+age*.55,d=r*(.28+.62*p)*(i%2?.78:1);
        polygon(ctx,[[Math.cos(a-.1)*d*.27,Math.sin(a-.1)*d*.27],[Math.cos(a)*d,Math.sin(a)*d],[Math.cos(a+.13)*d*.38,Math.sin(a+.13)*d*.38]],i%2?c[1]:palettes.prism[1]);
        star(ctx,Math.cos(a)*d,Math.sin(a)*d,i%2?3.5:5,4,a,c[2]);
      }
    }else{
      for(let i=0;i<6;i++){
        const a=i*turn/6-.9+.95*p,d=r*(.14+.69*p)*(i%2?.78:1);
        const x=Math.cos(a)*d,y=Math.sin(a)*d;
        path(ctx,[[Math.cos(a-.4)*d*.72,Math.sin(a-.4)*d*.72],[x,y]],c[1],2);
        star(ctx,x,y,6+i%3,5,a+age*4,c[1]);star(ctx,x,y,3.5,5,a+age*4,c[2]);
      }
    }
  }
  function leaves(ctx,e,age,c,length) {
    for(let i=0;i<5;i++){
      const u=clamp((age+.035-i*.035)/.34),x=length*u,y=Math.sin(u*Math.PI)*(i-2)*8;
      path(ctx,[[x-Math.min(9,x),y+3],[x,y]],c[0],1.7);leaf(ctx,x,y,6+i%2,u*4+i,c);
    }
  }
  function geology(ctx,e,age,c) {
    const p=ease((age+.02)/.25);
    if(e.move==='Ancient Power'){
      for(let i=0;i<5;i++){
        const a=i*turn/5+age*2,r=12+13*Math.sin(p*Math.PI);
        crystal(ctx,Math.cos(a)*r,Math.sin(a)*r*.66-8*p,4+i%3,5+i%2,c,i+.2);
      }
      ring(ctx,0,7,12+10*p,4+3*p,c[2],1);
    } else if(e.move==='Stone Edge'){
      for(let i=-2;i<=2;i++){
        const rise=ease((age+.02-Math.abs(i)*.035)/.22);
        crystal(ctx,i*8,7-9*rise,3.8,1+(21-Math.abs(i)*4)*rise,c,i*.20);
      }
    } else {
      for(let i=0;i<6;i++){
        const a=i*turn/6,dx=Math.cos(a),dy=Math.sin(a)*.68;
        path(ctx,[[0,7],[dx*10*p,7+dy*7*p],[dx*16*p-dy*4,7+dy*16*p],[dx*31*p,7+dy*29*p]],c[0],4);
        path(ctx,[[0,7],[dx*10*p,7+dy*7*p],[dx*16*p-dy*4,7+dy*16*p]],c[2],1.5);
      }
      for(let i=-1;i<=1;i++)flame(ctx,i*8,3-6*p,(i===0?12:7)*p+.5,c,i*.18);
    }
  }

  function current(ctx,e,age,c,length) {
    const head=length*ease((age+.025)/.22),radius=e.halfWidth || 17;
    if(e.line){
      ctx.beginPath();ctx.rect(0,-radius,length,2*radius);ctx.clip();
    }
    if(e.move==='Bubble Beam') {
      const tail=Math.max(0,head-length*.48);
      for(let i=0;i<12;i++){
        const x=tail+(head-tail)*i/11,y=Math.sin(i*2.1+age*10)*radius*.42,r=2.5+(i%4)*1.3;
        ring(ctx,x,y,r,r,c[1],1.8);
        ctx.beginPath();ctx.arc(x,y,r*.65,3.65,5.1);ctx.strokeStyle=c[2];ctx.lineWidth=1.3;ctx.stroke();
      }
    }else if(e.move==='Water Pulse' || e.move==='Dark Pulse'){
      const dark=e.move==='Dark Pulse';
      for(let i=0;i<5;i++){
        const u=clamp((age+.03-i*.044)/.23),x=length*u,r=radius*(.42+.55*Math.sin(u*Math.PI));
        if(dark){
          const teeth=[];for(let j=0;j<=20;j++){const a=j*turn/20,spike=j%2?1:.71;teeth.push([x+Math.cos(a)*r*.38*spike,Math.sin(a)*r*spike]);}
          path(ctx,teeth,c[0],3.4);path(ctx,teeth,c[1],1.4);
        }else{
          ring(ctx,x,0,r*.34,r,c[1],2.5);ring(ctx,x-1,0,r*.2,r*.73,c[2],1.1);
        }
      }
    }else{
      const twin=e.move==='Origin Pulse',tail=Math.max(0,head-length*.86);
      for(const side of (twin?[-1,1]:[0])){
        const jet=[];
        for(let j=0;j<=18;j++){
          const u=j/18,x=tail+(head-tail)*u,y=side*Math.sin(u*7+age*11)*radius*.48+Math.sin(u*9+age*13)*2;
          jet.push([x,y]);
        }
        path(ctx,jet,c[0],twin?6:12);path(ctx,jet,c[1],twin?4:8);path(ctx,jet,c[2],twin?1.2:2.4);
      }
      for(let i=1;i<=5;i++){
        const u=i/6,x=tail+(head-tail)*u,r=4+3*Math.sin(u*Math.PI);
        ring(ctx,x,0,r*.44,r*(twin?1.6:1),c[2],1,-.12);
      }
    }
  }
  function geyser(ctx,e,age,c,r) {
    const p=ease((age+.015)/.31),height=r*.7*Math.sin(p*Math.PI*.78);
    ring(ctx,0,r*.12,r*(.1+.77*p),r*(.06+.24*p),c[1],2.7);
    for(let i=-2;i<=2;i++){
      const x=i*r*.09,top=-height*(1-Math.abs(i)*.17);
      ctx.beginPath();ctx.moveTo(i*4,r*.12);ctx.quadraticCurveTo(x*.6,top*.8,x*1.5,top);
      ctx.quadraticCurveTo(x*1.15,top*.4,i*7+3,r*.12);ctx.fillStyle=i%2?c[1]:c[2];ctx.fill();
    }
    for(let i=0;i<10;i++){
      const a=(i+.5)*Math.PI/10;
      disc(ctx,Math.cos(a)*r*.74*p,r*.1-Math.sin(a)*height*(i%2?.8:1.05),2+i%3,c[1+i%2]);
    }
  }
  function drain(ctx,e,age,c,length) {
    const dream=e.move==='Dream Eater', count=e.move==='Giga Drain'?10:dream?6:5;
    for(let i=0;i<count;i++){
      const u=clamp((age+.035-i*.016)/.36);
      if(u<=0 || u>=1)continue;
      const lane=i%3-1,x=(1-u)*length,y=Math.sin(u*Math.PI)*(lane*(dream?16:9)+Math.sin(u*6+i)*4);
      path(ctx,[[x+Math.min(6,length*u),y+lane*2],[x,y]],c[1],1.45);
      if(dream)star(ctx,x,y,3+i%2,4,u*3,c[2]);else disc(ctx,x,y,2.1+i%3*.7,c[1+i%2]);
    }
    const arriving=ease((age-.15)/.24);
    if(arriving>0)ring(ctx,0,0,4+12*arriving,3+7*arriving,c[2],1.6);
  }
  function soundField(ctx,e,age,c,r) {
    const shock=e.move==='Boomburst';
    for(let i=0;i<3;i++){
      const p=ease((age+.018-i*.047)/.34);
      if(!p)continue;
      const front=Math.max(1,r*p*.96);
      if(shock){
        const teeth=[];
        for(let j=0;j<=36;j++){const a=j*turn/36,d=front*(j%2?1:.82);teeth.push([Math.cos(a)*d,Math.sin(a)*d]);}
        path(ctx,teeth,c[i%3],i===0?3:1.5);
      }else{
        ring(ctx,0,0,front,front,c[i%3],i===0?2.7:1.5);
      }
    }
    if(!shock)for(let i=0;i<3;i++){
      const a=i*turn/3-.9,d=r*(.13+.51*ease(age/.38));note(ctx,Math.cos(a)*d,Math.sin(a)*d,5,c,a*.12);
    }
  }
  function buzz(ctx,e,age,c,length) {
    const head=length*ease((age+.03)/.19);
    for(const s of [-1,1]){
      ring(ctx,5,s*6,10,3.8,c[1],1.7,s*.55);
      const points=[];
      for(let i=0;i<=20;i++){const u=i/20;points.push([head*u,s*2+Math.sin(u*35+age*24)*4*Math.sin(u*Math.PI)]);}
      path(ctx,points,c[s>0?1:2],1.5);
    }
  }
  function snarl(ctx,e,age,c,length) {
    const half=e.sector.halfAngle;
    for(let i=0;i<3;i++){
      const front=length*ease((age+.025-i*.042)/.26),teeth=[];
      if(front<1)continue;
      for(let j=0;j<=14;j++){
        const a=(j/7-1)*half,r=front*(j%2?.84:1);
        teeth.push([Math.cos(a)*r,Math.sin(a)*r]);
      }
      path(ctx,teeth,c[i],i===0?3.8:2);
    }
  }
  function jaws(ctx,e,age,c) {
    const heavy=e.move==='Crunch',r=heavy?23:18,close=ease((age+.01)/.19);
    const gap=(1-close)*18+Math.max(0,age-.24)*15+3;
    for(const side of [-1,1]){
      const y=side*gap,points=[];
      for(let i=-3;i<=3;i++)points.push([i*r/3,y+side*(1-i*i/9)*7]);
      path(ctx,points,c[0],4);path(ctx,points,c[1],1.7);
      const count=heavy?5:3;
      for(let i=0;i<count;i++){
        const x=(i/(count-1)*2-1)*r*.77,root=y+side*(1-x*x/(r*r))*7;
        polygon(ctx,[[x-3.4,root],[x+3.2,root],[x+.6,root-side*(i===0||i===count-1?9:6)]],c[2]);
      }
    }
    if(age<.13)return;
    if(e.move==='Fire Fang')for(const s of [-1,1])flame(ctx,s*r,-4,5,c,s*.3);
    else if(e.move==='Ice Fang')for(const s of [-1,1])crystal(ctx,s*r,1,2.8,7,c,s*.45);
    else if(e.move==='Thunder Fang')for(const s of [-1,1])path(ctx,[[s*13,-2],[s*24,-7],[s*20,0],[s*29,-3]],c[1],2);
    else if(heavy)sparks(ctx,0,0,22,age-.13,c,6);
  }
  function gauntlet(ctx,x,y,size,c,angle) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(size,size);
    const fist=[[-13,-4],[-7,-6],[-7,-10],[-1,-11],[2,-8],[5,-10],[10,-6],[12,-1],[10,3],[6,5],[0,9],[-8,8],[-11,5]];
    polygon(ctx,fist,c[0]);path(ctx,[...fist,fist[0]],c[1],1.6);
    path(ctx,[[-7,-5],[-3,-6],[0,-3],[2,-3],[5,0]],c[2],1.7);
    path(ctx,[[-5,5],[0,3],[3,5]],c[1],1.4);ctx.restore();
  }
  function punch(ctx,e,age,c) {
    const combo=e.move==='Close Combat',shadow=e.move==='Shadow Punch',count=combo?3:1;
    for(let i=0;i<count;i++){
      const t=age-i*.083;if(t<0 || combo && t>.27)continue;
      const p=ease((t+.015)/.15),s=i===1?-1:1,x=-s*(1-p)*25,y=combo?(i-1)*7:0;
      if(shadow)gauntlet(ctx,x-8,y-3,.9,[c[0],c[0],c[1]],-.25);
      if(e.move==='Sucker Punch')path(ctx,[[x-16,y+12],[x-7,y+1],[x-9,y+6],[x,y]],c[2],2.3);
      gauntlet(ctx,x,y,combo?.71:1,c,s*(combo?.55:-.22));
      if(t>.084)sparks(ctx,5*s,y,combo?20:17,t-.084,c,6);
    }
    if(age<.10)return;
    if(e.move==='Fire Punch')for(let i=0;i<3;i++)flame(ctx,i*6-7,-8,4+i,c,i*.17);
    if(e.move==='Ice Punch')for(let i=0;i<3;i++)crystal(ctx,i*7-5,-7,2.8,5+i,c,i*.27);
    if(e.move==='Thunder Punch')path(ctx,[[-10,6],[-6,-12],[1,-7],[7,-16],[5,-5],[17,-8]],c[2],2.3);
  }
  function claw(ctx,e,age,c) {
    const ghost=e.move==='Shadow Claw',p=ease((age+.014)/.2);
    for(let i=-1;i<=1;i++){
      const x=i*8,y=i*1.8;
      ctx.beginPath();ctx.moveTo(x-10,-17+y);ctx.quadraticCurveTo(x-6+4*p,-2+y,x-10+20*p,-17+y+34*p);
      ctx.quadraticCurveTo(x-10+6*p,-2+y,x-10,-17+y);ctx.fillStyle=c[1];ctx.fill();
      path(ctx,[[x-10,-17+y],[x-10+12*p,-17+y+18*p],[x-10+20*p,-17+y+34*p]],c[2],ghost?1.6:2.4);
      if(ghost)disc(ctx,x-10,2+y-8*p,1.6,c[0]);
    }
  }
  function airCut(ctx,e,age,c,length) {
    const p=ease((age+.02)/.23),x=length*p,psychic=e.move==='Psycho Cut';
    for(let i=0;i<(psychic?1:2);i++){
      const head=Math.max(0,x-i*12),r=psychic?19:13;
      ctx.beginPath();ctx.moveTo(head-8,-r);
      ctx.quadraticCurveTo(head+15,0,head-8,r);ctx.quadraticCurveTo(head+3,0,head-8,-r);
      ctx.fillStyle=c[i+1];ctx.fill();ctx.strokeStyle=c[0];ctx.lineWidth=1;ctx.stroke();
      path(ctx,[[head-14,-r*.6],[head-4,0],[head-12,r*.53]],c[2],1.4);
    }
  }

  function rushTrail(ctx,e,age,c,length) {
    const p=ease((age+.035)/.17),head=length*p,tail=Math.max(0,head-54);
    for(const s of [-1,1]){
      const edge=[];
      for(let i=0;i<=10;i++){
        const u=i/10,x=tail+(head-tail)*u,y=s*Math.sin(u*Math.PI)*(e.move==='Iron Head'?4:8);
        edge.push([x,y]);
      }
      path(ctx,edge,c[1],2.5);
    }
    if(e.move==='Aqua Jet'){
      for(let i=1;i<=4;i++){
        const x=Math.max(tail,head-i*10);
        path(ctx,[[x-5,-i*2],[x+2,0],[x-5,i*2]],c[2],1.4);
      }
    }else if(e.move==='Dragon Ascent'||e.move==='Dragon Rush'){
      const ascent=e.move==='Dragon Ascent',wake=[];
      for(let i=0;i<=15;i++){
        const u=i/15;wake.push([tail+u*(head-tail),Math.sin(u*8+age*13)*(1-u)*(ascent?12:7)]);
      }
      path(ctx,wake,c[0],5);path(ctx,wake,c[1],2.5);
      for(const s of [-1,1])path(ctx,[[head-17,s*(ascent?15:9)],[head-6,s*3],[head,0]],c[2],2.1);
      if(ascent){
        const snout=[[head,0],[head-8,-5],[head-17,-8],[head-14,-2],[head-20,0],[head-11,4]];
        polygon(ctx,snout,c[0]);path(ctx,[...snout,snout[0]],c[1],1.5);
        path(ctx,[[head-10,-3],[head-6,-2]],c[2],1.8);
      }
    }else if(e.move==='Flame Charge'){
      for(let i=0;i<5;i++)flame(ctx,Math.max(tail,head-i*7),Math.sin(i+age*12)*3,6-i*.65,c,-1.1);
    }else if(e.move==='Iron Head'){
      polygon(ctx,[[head,0],[head-8,-8],[head-16,-6],[head-16,6],[head-8,8]],c[0]);
      path(ctx,[[head-14,-6],[head-8,-8],[head,0],[head-8,8]],c[2],2);disc(ctx,head-10,0,1.8,c[1]);
    }else{
      for(const s of [-1,1])for(let i=0;i<3;i++){
        const x=head-i*8;
        path(ctx,[[x-15,s*(11-i)],[x-4,s*3],[x,0]],c[i%2+1],1.6);
      }
    }
  }
  function landing(ctx,e,age,c,r) {
    const p=ease((age+.02)/.29),d=r*(.15+.78*p);
    ring(ctx,0,0,d,d*.62,c[1],2.4);
    if(e.move==='Fly'){
      for(let i=0;i<8;i++){
        const a=i*turn/8, x=Math.cos(a)*d*.8,y=Math.sin(a)*d*.66-9*(1-p);
        leaf(ctx,x,y,5,a+.5+p,c);path(ctx,[[x,y],[x-Math.cos(a)*7,y-Math.sin(a)*7]],c[2],1);
      }
    }else{
      const height=21*(1-p)+6,coil=[];
      for(let i=0;i<=32;i++){const u=i/32,a=u*turn*2.5;coil.push([Math.cos(a)*9,-height*(1-u)+Math.sin(a)*2]);}
      path(ctx,coil,c[1],2);star(ctx,0,1,4+6*p,6,0,c[2]);
    }
  }
  function dragonBlow(ctx,e,age,c) {
    const p=ease((age+.02)/.23);
    if(e.move==='Dragon Tail'){
      const pts=[];
      for(let j=0;j<=14;j++){
        const u=j/14,a=-2.8+u*(.3+2.25*p),r=24-u*6;
        pts.push([Math.cos(a)*r,Math.sin(a)*r+7]);
      }
      path(ctx,pts,c[0],7);path(ctx,pts,c[1],3.7);
      for(const j of [5,8,11]){const [x,y]=pts[j];polygon(ctx,[[x-2,y],[x-4,y-6],[x+3,y]],c[2]);}
    }else{
      for(let i=0;i<3;i++){
        const a=i*turn/3+p*.7,pts=[];
        for(let j=0;j<=7;j++){const u=j/7;pts.push([Math.cos(a+u*1.5)*(25-18*u),Math.sin(a+u*1.5)*(25-18*u)]);}
        path(ctx,pts,c[0],4.2);path(ctx,pts,c[1],2);
      }
      for(const s of [-1,1])polygon(ctx,[[s*12,-6],[s*3,-1],[s*6,1]],c[2]);
    }
  }
  function wildfire(ctx,e,age,c,extent) {
    const p=ease((age+.025)/.36);
    if(e.move==='Blast Burn'){
      const r=extent;
      ring(ctx,0,0,r*(.13+.81*p),r*(.13+.81*p),c[1],3.2);
      for(let i=0;i<8;i++){
        const a=i*turn/8, d=r*(.16+.47*p);
        flame(ctx,Math.cos(a)*d,Math.sin(a)*d,4+9*Math.sin(Math.PI*p)+r*.04,c,.16*Math.sin(a));
      }
      flame(ctx,0,0,6+12*Math.sin(Math.PI*p),c);
    }else if(e.move==='Fire Spin'){
      const coil=[];
      for(let i=0;i<=36;i++){
        const u=i/36,a=u*turn*2.2+age*10,r=11+8*u;
        coil.push([Math.cos(a)*r,13-33*u+Math.sin(a)*4]);
      }
      path(ctx,coil,c[0],4.6);path(ctx,coil,c[1],2.4);
      for(const j of [5,16,27])flame(ctx,coil[j][0],coil[j][1],3.8,c,.35);
    }else{
      for(let i=0;i<7;i++){
        const a=i*turn/7,d=9+13*p;
        flame(ctx,Math.cos(a)*d,Math.sin(a)*d*.78,4+4*Math.sin(p*Math.PI),c,Math.cos(a)*.65);
      }
      halo(ctx,0,0,6+12*(1-p),c[2]);
    }
  }
  function venom(ctx,e,age,c) {
    const p=ease((age+.025)/.38),toxic=e.move==='Toxic';
    for(let i=0;i<6;i++){
      const u=(p*.76+i/6)%1,x=Math.sin(i*2.4)*(10+6*u),y=toxic?11-29*u:-19+30*u;
      disc(ctx,x,y,2.2+i%3,c[i%2]);disc(ctx,x-.7,y-.8,1,c[2]);
    }
    if(toxic){
      ctx.beginPath();ctx.ellipse(0,-6,7,6,0,0,turn);ctx.fillStyle=c[1];ctx.fill();
      ctx.fillRect(-4,-4,8,6);for(const s of [-1,1])disc(ctx,s*2.7,-6,1.7,c[0]);
    }else{
      for(const s of [-1,1])path(ctx,[[s*17,-14],[s*7,-3],[s*10,-3],[s*2,9]],c[2],2);
    }
  }
  function sword(ctx,x,y,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    polygon(ctx,[[0,-13],[3,-8],[1.4,4],[-1.6,4],[-2.7,-8]],c[2]);path(ctx,[[0,-10],[0,3]],c[1],1.2);
    path(ctx,[[-4,3],[4,3]],c[0],2.4);path(ctx,[[0,4],[0,8]],c[1],2);ctx.restore();
  }
  function dance(ctx,e,age,c) {
    const p=ease(age/.49);
    if(e.move==='Swords Dance'){
      for(const s of [-1,1]){
        const a=s*(.94-p*1.55);sword(ctx,s*(17-9*p),-4-9*p,a,c);
        path(ctx,[[s*22,6],[s*23,-3-p*8],[s*19,-12-p*6]],c[1],1.2);
      }
    }else if(e.move==='Dragon Dance'){
      for(const s of [-1,1]){
        const ribbon=[];
        for(let j=0;j<=18;j++){const u=j/18,a=age*7+s*Math.PI/2+u*3.5;ribbon.push([Math.cos(a)*17,10-u*28+Math.sin(a)*5]);}
        path(ctx,ribbon,c[0],3.8);path(ctx,ribbon,c[1],2);
        const [x,y]=ribbon.at(-1);path(ctx,[[x-3,y-4],[x,y],[x+3,y-3]],c[2],1.6);
      }
    }else{
      for(const s of [-1,1]){
        const spread=7+9*Math.abs(Math.sin(age*14+.5));ctx.save();ctx.scale(s,1);
        ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(spread,-23,spread+10,-19,spread,-4);
        ctx.quadraticCurveTo(spread+5,12,2,4);ctx.closePath();ctx.fillStyle=c[1];ctx.fill();
        path(ctx,[[2,0],[spread-2,-10]],c[2],1.6);ctx.restore();
      }
    }
  }
  function discipline(ctx,e,age,c) {
    const p=ease(age/.49);
    if(e.move==='Calm Mind'){
      const r=20-9*p;for(let i=0;i<3;i++)ring(ctx,0,7-i*9,r+i*1.4,3+i*.55,c[i],1.5);
      star(ctx,0,-19,3+2*Math.sin(p*Math.PI),4,0,c[2]);
    }else if(e.move==='Nasty Plot'){
      for(let i=0;i<3;i++){
        const x=5+i*5,y=-7-i*5-3*p,r=2+i*1.6;
        disc(ctx,x,y,r,c[0]);ring(ctx,x,y,r,r,c[1],1.3);
      }
      star(ctx,20,-26-2*p,6,4,.2,c[2]);
    }else{
      for(let i=0;i<6;i++){
        const a=i*turn/6+.52,r=23-9*p,x=Math.cos(a)*r,y=Math.sin(a)*r;
        ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2);
        const plate=[[-6,-4],[3,-6],[7,-2],[6,3],[-1,5],[-6,2]];
        polygon(ctx,plate,c[0]);path(ctx,[...plate,plate[0]],c[1],1.6);disc(ctx,1,-1,1.3,c[2]);ctx.restore();
      }
    }
  }
  function breeze(ctx,e,age,c) {
    const wind=e.move==='Tailwind',p=ease(age/.45);
    for(let i=0;i<(wind?5:4);i++){
      const u=(p+i*.24)%1,x=-24+48*u,y=(i-2)*6;
      if(wind){
        ctx.beginPath();ctx.moveTo(x-12,y+4);ctx.quadraticCurveTo(x-4,y-3,x+4,y);
        ctx.strokeStyle=c[1+i%2];ctx.lineWidth=1.7;ctx.stroke();leaf(ctx,x+4,y-.5,3.7,-.35,c);
      }else{
        path(ctx,[[x-10,y+3],[x+5,y]],c[1+i%2],2);
        if(i===2)path(ctx,[[x,y-5],[x+6,y],[x-2,y+5]],c[2],1.8);
      }
    }
  }
  function wisp(ctx,e,age,c) {
    const p=ease(age/.43);
    for(let i=0;i<3;i++){
      const a=i*turn/3+age*6,r=21-11*p;
      const x=Math.cos(a)*r,y=-4+Math.sin(a)*r*.72;
      halo(ctx,x,y,7,c[1]);flame(ctx,x,y,5.2,c,Math.sin(a)*.3);
    }
  }
  function staticCage(ctx,e,age,c) {
    const r=24-8*ease(age/.32);
    for(let i=0;i<3;i++){
      const a=i*turn/3+age*2,pts=[];
      for(let j=0;j<=8;j++){
        const t=a+j*turn/24,d=r*(j%2?.77:1);pts.push([Math.cos(t)*d,Math.sin(t)*d*.85]);
      }
      path(ctx,pts,c[0],3.7);path(ctx,pts,c[2],1.6);
    }
  }
  function powder(ctx,e,age,c) {
    const p=ease((age+.016)/.47),spore=e.move==='Spore',stun=e.move==='Stun Spore',poison=e.move==='Poison Powder';
    for(let i=0;i<14;i++){
      const u=(i+.5)/14,a=i*2.4+p*.56,r=(7+15*u)*(.44+.64*p);
      const x=Math.cos(a)*r,y=-14+Math.sin(a)*r*.7+10*p;
      if(spore && i%3===0){
        path(ctx,[[x,y],[x-.5,y+4]],c[2],1.3);
        ctx.beginPath();ctx.arc(x,y,3.2,Math.PI,turn);ctx.fillStyle=c[1];ctx.fill();
      }else if(stun && i%3===0)path(ctx,[[x-2,y-3],[x+1,y-1],[x-1,y+1],[x+2,y+3]],c[2],1.35);
      else if(poison && i%3===0)ring(ctx,x,y,2.6,2.6,c[1],1.4);
      else if(!spore&&!stun&&!poison && i%4===0)star(ctx,x,y,3.3,4,.2,c[2]);
      else disc(ctx,x,y,1.2+i%3*.45,c[1+i%2]);
    }
  }
  function melody(ctx,e,age,c,length) {
    for(let i=0;i<4;i++){const u=clamp((age+.02-i*.045)/.35);if(u>0)note(ctx,length*u,-Math.sin(Math.PI*u)*10+(i%2?4:-4),6+i%2,c,Math.sin(u*5)*.3);}
  }
  function trance(ctx,e,age,c) {
    const pts=[];
    for(let i=0;i<=36;i++){const u=i/36,a=age*9+u*turn*2,r=2+18*u;pts.push([Math.cos(a)*r,Math.sin(a)*r*.84-2]);}
    path(ctx,pts,c[1],2);eye(ctx,0,-3,6.5,c,.6+.3*Math.cos(age*8));
  }
  function confuseRay(ctx,e,age,c,length) {
    const u=ease((age+.02)/.28),x=length*u,y=Math.sin(u*turn)*7;
    const ribbon=[];
    for(let i=0;i<=12;i++){const t=u*i/12;ribbon.push([length*t,Math.sin(t*turn)*7]);}
    path(ctx,ribbon,c[1],1.6);
    for(let i=0;i<3;i++){
      const a=age*8+i*turn/3;star(ctx,x+Math.cos(a)*7,y+Math.sin(a)*5,3.3,4,a,c[2]);
    }
  }

  function failed(e) {
    return e.multiplier===0 || e.damage==='Miss' || e.damage==='Ability blocked' || e.damage==='Failed';
  }
  function drawTechnique(ctx,e,style,age,sign) {
    const {anchor,paint,colors}=style;
    ctx.globalAlpha*=1-ease((age-.31)/.27);
    if(anchor==='ground'){
      if(!e.zone || !(e.radius>0))return;
      ctx.translate(e.tx,e.ty);ctx.scale(sign,1);
      ctx.beginPath();ctx.arc(0,0,e.radius,0,turn);ctx.clip();
      paint(ctx,e,age,colors,e.radius);
    }else if(anchor==='fan'){
      const s=e.sector;if(!s)return;
      ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(s.dy,s.dx));
      ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,s.length,-s.halfAngle,s.halfAngle);ctx.closePath();ctx.clip();
      paint(ctx,e,age,colors,s.length);
    }else{
      if(anchor==='lane'){
        if(!e.line)return;
      }else if(failed(e) || !(e.status || Number.isFinite(e.damage) && e.damage>0))return;
      if(anchor==='target'){
        ctx.translate(e.tx,e.ty);ctx.scale(e.tx===e.x?sign:Math.sign(e.tx-e.x),1);
        paint(ctx,e,age,colors);
      }else{
        const dx=e.tx-e.x,dy=e.ty-e.y;
        ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(dy,dx));
        paint(ctx,e,age,colors,Math.hypot(dx,dy));
      }
    }
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
    } else if(style.paint) {
      drawTechnique(ctx,e,style,age,sign);
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
    if(e.impactOnly || e.zone || e.dashSprite)return false;
    const style=profiles.get(e.move);
    if(!style)return false;
    const {kind,anchor}=style;
    return anchor==='target'||anchor==='link'||(anchor==='lane' && e.shape==='dash')||
      kind==='sky'||kind==='bolt'||kind==='heal'||kind==='guard'||
      (kind==='slash' && !e.sector)||e.move==='Draco Meteor';
  }
  globalThis.ArenaMoveEffects={activeCast,charge,drawEffect,aboveUnits};
})();
