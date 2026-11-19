'use strict';
/* Move-specific casts for ailments, cures, field control and technical machines. */
globalThis.ArenaMoveEffects.addPack(function techniques({
  technique,palettes,turn,ease,clamp,path,polygon,disc,ring,star,crystal,leaf,flame,eye,note
}){
  technique('target',expression,'night','Scary Face','Torment','Nightmare');
  technique('target',expression,'gold','Glare','Swagger');
  technique('target',expression,'mist','Flatter','Fake Tears');
  technique('link',affection,'mist','Attract','Sweet Kiss','Lovely Kiss');
  technique('link',sound,'wind','Chatter','Grass Whistle','Confide');
  technique('link',sound,'silver','Screech','Supersonic');
  technique('link',sound,'steel','Metal Sound');
  technique('link',exchange,'aura','Power Swap','Guard Swap','Speed Swap','Skill Swap','Ally Switch');
  technique('link',exchange,'night','Trick');
  technique('link',exchange,'psychic','Psycho Shift','Psych Up');
  technique('link',stream,'gold','Buzzy Buzz','Eerie Impulse');
  technique('link',stream,'venom','Toxic Thread','Twineedle');
  technique('link',stream,'mist','Strange Steam');
  technique('link',stream,'wind','Whirlwind','Defog');
  technique('target',coldFire,'ice','Freeze Shock','Ice Burn');
  technique('target',coldFire,'fire','Sizzly Slide');
  technique('target',contact,'ruby','Dizzy Punch','Wake Up Slap');
  technique('target',contact,'venom','Dire Claw');
  technique('target',contact,'silver','Smelling Salts');
  technique('target',terrain,'gold','Electric Terrain');
  technique('target',terrain,'grass','Grassy Terrain');
  technique('target',terrain,'mist','Misty Terrain');
  technique('target',terrain,'psychic','Psychic Terrain','Gravity');
  technique('target',rooms,'psychic','Trick Room','Magic Room','Wonder Room');
  technique('target',shield,'ice','Aurora Veil','Mist');
  technique('target',shield,'prism','Safeguard');
  technique('target',shield,'aura','Detect');
  technique('target',shield,'venom','Baneful Bunker');
  technique('target',shield,'fire','Burning Bulwark');
  technique('target',seal,'ghost','Curse','Spite');
  technique('target',seal,'night','Embargo','Snatch');
  technique('target',seal,'psychic','Imprison','Quash','Telekinesis');
  technique('target',training,'gold','Charge','Focus Energy');
  technique('target',training,'ruby','Work Up','Coaching');
  technique('target',training,'dragon','Dragon Cheer');
  technique('target',training,'rock','Rock Polish','Defense Curl');
  technique('target',training,'steel','Hone Claws');
  technique('target',tricks,'silver','Double Team','Mimic','Metronome','Encore');
  technique('target',tricks,'grass','Recycle','Nature Power');
  technique('target',tricks,'wind','Feather Dance');
  technique('target',tricks,'gold','Flash');
  technique('target',remedy,'grass','Jungle Healing','Aromatherapy');
  technique('target',remedy,'aura','Refresh','Purify');
  technique('target',remedy,'gold','Heal Bell','Soft Boiled');
  technique('target',remedy,'psychic','Take Heart','Lunar Blessing');
  technique('ground',cloud,'venom','Poison Gas','Venom Drench');
  technique('ground',cloud,'ice','Haze');
  technique('ground',cloud,'mist','Sweet Scent','Captivate');
  technique('ground',ritual,'night','Dark Void');
  technique('ground',ritual,'psychic','Heal Block');
  technique('ground',ritual,'mist','Teeter Dance');
  technique('ground',splash,'fire','Pyro Ball');
  technique('ground',splash,'water','Splishy Splash');
  technique('lane',signal,'grass','Signal Beam');

  function arc(ctx,x,y,r,flat,a,span,color,w=2) {
    ctx.beginPath();ctx.ellipse(x,y,r,r*flat,0,a,a+span);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke();
  }
  function edge(ctx,pts,c,w=3.7) {path(ctx,pts,c[0],w);path(ctx,pts,c[2],w*.4);}
  function heart(ctx,x,y,s,color) {
    ctx.beginPath();ctx.moveTo(x,y+s);
    ctx.bezierCurveTo(x-s*1.47,y-s*.13,x-s*.85,y-s*1.29,x,y-s*.53);
    ctx.bezierCurveTo(x+s*.85,y-s*1.29,x+s*1.47,y-s*.13,x,y+s);
    ctx.fillStyle=color;ctx.fill();
  }
  function crescent(ctx,x,y,r,c) {
    ctx.beginPath();ctx.moveTo(x+r*.46,y-r);
    ctx.bezierCurveTo(x-r*1.32,y-r,x-r*1.35,y+r*1.1,x+r*.69,y+r*.65);
    ctx.bezierCurveTo(x-r*.19,y+r*.37,x-r*.13,y-r*.55,x+r*.46,y-r);ctx.fillStyle=c;ctx.fill();
  }
  function drop(ctx,x,y,r,c) {
    ctx.beginPath();ctx.moveTo(x,y-r*1.5);ctx.bezierCurveTo(x-r*1.5,y+r*.29,x-r*.75,y+r,x,y+r);
    ctx.bezierCurveTo(x+r*.86,y+r,x+r*1.28,y+r*.25,x,y-r*1.5);ctx.fillStyle=c[1];ctx.fill();
    path(ctx,[[x-r*.37,y],[x-r*.23,y+r*.4]],c[2],1.3);
  }
  function bolt(ctx,x1,y1,x2,y2,r,phase,c) {
    const dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy)||1,pts=[];
    for(let i=0;i<=7;i++){const u=i/7,d=Math.sin(u*Math.PI)*Math.sin(i*2.54+phase)*r;pts.push([x1+dx*u-d*dy/length,y1+dy*u+d*dx/length]);}
    edge(ctx,pts,c,3.3);
  }
  function chevron(ctx,x,y,size,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);edge(ctx,[[-size,size*.25],[0,-size*.6],[size,size*.25]],c,3);ctx.restore();
  }
  function feather(ctx,x,y,size,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    polygon(ctx,[[-size,0],[-size*.45,-size*.47],[size*.74,-size*.43],[size*.3,-size*.1],[size*.55,-size*.15],[0,size*.23],[-size*.46,size*.26]],c[1]);
    path(ctx,[[-size,.12*size],[size*.5,-size*.3]],c[2],1.3);ctx.restore();
  }
  function rays(ctx,x,y,r,p,c,tips=7,offset=0) {
    for(let i=0;i<tips;i++){const a=i*turn/tips+offset,dx=r*Math.cos(a),dy=r*Math.sin(a);
      path(ctx,[[x+dx*(.25+.28*p),y+dy*(.25+.28*p)],[x+dx*(.47+.53*p),y+dy*(.47+.53*p)]],c[1+i%2],1.6);}
  }
  function expression(ctx,e,age,c){
    const p=ease((age+.025)/.4),y=-8-4*Math.sin(p*Math.PI);
    switch(e.move){
      case 'Glare':
        for(const s of [-1,1]){
          ctx.save();ctx.translate(s*8,y);ctx.rotate(s*.29);eye(ctx,0,0,7.4,c,.63+.22*p);
          path(ctx,[[0,-2.7],[0,2.7]],'#9a521e',1.5);ctx.restore();
        }
        for(let i=0;i<3;i++)path(ctx,[[i*6-7,0],[i*6-10,5+i*1.6]],c[1],1.6);break;
      case 'Scary Face':
      case 'Torment':{
        const two=e.move==='Torment';
        for(const s of two?[-1,1]:[0]){
          const x=s*(12-5*p),size=two?.68:1;
          ctx.save();ctx.translate(x,y+s*3);ctx.scale(size,size);
          const face=[[-14,-5],[-15,-15],[-7,-10],[0,-13],[8,-10],[15,-16],[13,-2],[9,8],[3,12],[-6,10]];
          polygon(ctx,face,c[0]);for(const dir of [-1,1])path(ctx,[[dir*10,-6],[dir*5,-3],[dir*3,-4]],two?'#ff9ec0':c[1],2.5);
          if(two)arc(ctx,0,3,5,.56,s<0?0:Math.PI,Math.PI,c[2],1.6);
          else{path(ctx,[[-8,3],[-6,7],[-3,4],[0,7],[3,4],[5,7],[8,3]],c[2],1.8);}
          ctx.restore();
        }
        break;
      }
      case 'Nightmare':
        crescent(ctx,0,y,13,c[0]);eye(ctx,-2,y+1,6,c,.7);
        for(let i=0;i<3;i++){const x=(i-1)*10;edge(ctx,[[x,7],[x+3,2-p*6],[x,0-p*8]],c,2.4);}
        break;
      case 'Fake Tears':
        for(const s of [-1,1]){
          arc(ctx,s*7,y,4,.5,Math.PI,Math.PI,palettes.aura[0],2.2);
          for(let i=0;i<2;i++){const u=clamp(p-i*.26);drop(ctx,s*(9+2*u),y+3+14*u,2.2+i*.5,palettes.water);}
        }
        break;
      case 'Flatter':
      case 'Swagger':{
        const boast=e.move==='Swagger',gold=palettes.gold;
        if(boast){for(const side of [-1,1])chevron(ctx,side*(9+4*p),y+12,5,side*.45,c);
          path(ctx,[[-9,y+3],[-3,y-3],[1,y],[8,y-5]],c[2],2.4);}
        else{for(let i=0;i<3;i++)heart(ctx,(i-1)*10,y+9-8*p+(i%2)*2,3.4,c[1]);}
        const h=y-9-2*p;polygon(ctx,[[-9,h-4],[-5,h],[0,h-6],[4,h],[9,h-4],[7,h+4],[-7,h+4]],gold[1]);
        path(ctx,[[-6,h+3],[6,h+3]],gold[2],1.6);break;
      }
    }
  }
  function affection(ctx,e,age,c,length){
    const p=ease((age+.022)/.36);
    for(let i=0;i<3;i++){
      const u=clamp(p-i*.09),x=length*u,y=-Math.sin(u*Math.PI)*(5+i*2.4);if(!u)continue;
      if(e.move==='Attract'){heart(ctx,x,y,5.8-i*.86,palettes.mist[i%2+1]);continue;}
      if(i===0){polygon(ctx,[[x-7,y],[x-3,y-3],[x,y-2],[x+3,y-3],[x+7,y],[x+2,y+3],[x-3,y+3]],'#ea7296');
        path(ctx,[[x-5,y],[x,y+1],[x+5,y]],'#ffccd8',1.3);}
      else if(e.move==='Lovely Kiss'){crescent(ctx,x,y-i*2,3.6,palettes.gold[1]);}
      else{star(ctx,x,y+i*2,4.4,5,age*5+i,c[2]);}
    }
  }
  function sound(ctx,e,age,c,length){
    const p=ease((age+.024)/.35);
    if(e.move==='Confide'){
      const x=length*p,y=-8*Math.sin(p*Math.PI);
      ring(ctx,x,y,9,6.2,c[1],2.1);path(ctx,[[x-4,y+5],[x-6,y+10],[x,y+6]],c[1],1.5);
      for(let i=-1;i<=1;i++)disc(ctx,x+i*3.2,y,1,c[2]);return;
    }
    if(e.move==='Chatter' || e.move==='Grass Whistle'){
      const grass=e.move==='Grass Whistle';
      if(grass){leaf(ctx,3,0,8,-.55,palettes.grass);path(ctx,[[0,1],[8,-3]],palettes.grass[2],1.3);}
      for(let i=0;i<4;i++){const u=clamp(p-i*.075),x=length*u,y=Math.sin(u*turn+i*.7)*5-i;
        if(!u)continue;
        if(grass || i%2)note(ctx,x,y,5+i%2,grass?palettes.grass:c,Math.sin(u*5)*.26);
        else{path(ctx,[[x-6,y-3],[x-2,y-2],[x,y+1],[x+3,y-2],[x+6,y-3]],i?c[2]:palettes.gold[1],1.9);}
      }
      return;
    }
    const metal=e.move==='Metal Sound',screech=e.move==='Screech';
    if(metal){ring(ctx,3,0,6,8,c[0],2,.4);ring(ctx,3,0,3,4,c[2],1.4,.4);}
    for(let i=0;i<(screech?4:6);i++){
      const u=clamp((age+.024-i*.032)/.29);if(!u)continue;
      const x=length*u,r=4+u*7+i%2*2;
      if(screech){edge(ctx,[[x-4,-r],[x+2,-r*.52],[x-2,-r*.21],[x+5,0],[x-2,r*.22],[x+2,r*.53],[x-4,r]],c,2.65);}
      else if(metal){path(ctx,[[x-3,-r],[x+4,-r*.4],[x+4,r*.4],[x-3,r]],c[1+i%2],1.9);}
      else arc(ctx,x,0,r,1.1,-1.12,2.24,c[1+i%2],2.1);
    }
  }
  function badge(ctx,kind,x,y,s,c) {
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    switch(kind){
      case 'Power Swap':polygon(ctx,[[-6,4],[2,-7],[7,-9],[6,-3],[-3,5]],c[1]);path(ctx,[[-7,1],[-2,6]],c[2],2.4);break;
      case 'Guard Swap':polygon(ctx,[[-7,-6],[0,-8],[7,-6],[6,1],[0,7],[-6,2]],c[0]);path(ctx,[[-5,-4],[0,-5],[5,-4],[4,1],[0,5]],c[2],1.5);break;
      case 'Speed Swap':feather(ctx,0,0,7,-.58,c);break;
      case 'Skill Swap':for(const d of [-1,1]){const pts=[];for(let i=0;i<=12;i++){const u=i/12;pts.push([Math.sin(u*turn)*4*d,-7+14*u]);}path(ctx,pts,c[d<0?1:2],1.6);}break;
      case 'Trick':polygon(ctx,[[-6,-3],[0,-7],[6,-4],[6,4],[0,7],[-6,3]],c[1]);path(ctx,[[-6,-3],[0,0],[6,-4]],c[2],1.3);path(ctx,[[0,0],[0,6]],c[0],1.5);break;
      case 'Ally Switch':ring(ctx,0,2,6,3,c[1],1.8);chevron(ctx,0,-3,3.6,0,c);break;
    }
    ctx.restore();
  }
  function exchange(ctx,e,age,c,length){
    const p=ease((age+.021)/.36),amp=Math.min(11,4+length*.06);
    if(e.move==='Psycho Shift' || e.move==='Psych Up'){
      const copy=e.move==='Psych Up',u=copy?1-p:p,x=length*u,y=-Math.sin(u*Math.PI)*amp;
      for(let i=0;i<3;i++){
        const a=i*turn/3+p*4,dx=Math.cos(a)*5,dy=Math.sin(a)*5;
        if(copy)crystal(ctx,x+dx,y+dy,2.7,4,c,a);else ring(ctx,x+dx,y+dy,3.8,2.4,palettes.venom[i],1.6,a);
      }
      if(copy)eye(ctx,x,y,4.1,c,.68);else disc(ctx,x,y,3,c[2]);return;
    }
    const second=e.move==='Trick'?palettes.gold:e.move==='Ally Switch'?palettes.emerald:palettes.ruby;
    for(const s of [-1,1]){
      const forward=s===1,x=length*(forward?p:1-p),y=s*Math.sin(p*Math.PI)*amp;
      const pts=[];for(let i=0;i<=12;i++){const u=p*i/12;pts.push([length*(forward?u:1-u),s*Math.sin(u*Math.PI)*amp]);}
      const colors=forward?c:second;path(ctx,pts,colors[1],1.4);badge(ctx,e.move,x,y,.88,colors);
    }
  }
  function stream(ctx,e,age,c,length){
    const i=e.strikeIndex??0,p=ease((age+.015-i*.055)/.32);if(!p)return;
    const x=length*p;
    switch(e.move){
      case 'Buzzy Buzz':
      case 'Eerie Impulse':{
        const odd=e.move==='Eerie Impulse';
        if(odd){for(let j=0;j<3;j++){const u=clamp(p-j*.11),px=length*u;ring(ctx,px,0,2.6,6+j,c[1+j%2],1.8,-.16);}}
        bolt(ctx,0,0,x,0,odd?4.5:7,p*11,c);
        if(!odd){star(ctx,x,0,6.7,4,p,palettes.gold[2]);bolt(ctx,x*.59,0,x*.70,-9,2.8,p*13,c);}
        break;
      }
      case 'Twineedle':{
        const y=(i%2?1:-1)*3;
        polygon(ctx,[[x-10,y-2],[x+8,y],[x-10,y+2],[x-6,y]],c[1]);path(ctx,[[x-7,y],[x+5,y]],c[2],1.15);
        path(ctx,[[Math.max(0,x-18),y-2],[Math.max(0,x-11),y-2]],c[0],1.5);break;
      }
      case 'Toxic Thread':
        for(let j=0;j<2;j++){
          const pts=[];for(let k=0;k<=30;k++){const u=p*k/30;pts.push([length*u,(j?1:-1)*Math.sin(u*turn*2)*4]);}
          path(ctx,pts,c[1+j],1.75);
        }
        for(let j=1;j<=4;j++){const u=p*j/4;disc(ctx,length*u,Math.sin(u*turn*2)*4,2.4,c[0]);}break;
      case 'Whirlwind':
        for(let j=0;j<5;j++){
          const u=clamp(p-j*.065),r=4+j*1.8;arc(ctx,length*u,1-j*2,r,.45,age*12+j*.9,4.55,c[1+j%2],2.2);
        }
        break;
      case 'Defog':
        for(const s of [-1,1]){const pts=[];for(let k=0;k<=18;k++){const u=p*k/18;pts.push([length*u,s*(2+10*Math.sin(u*Math.PI))]);}
          path(ctx,pts,c[2],1.9);feather(ctx,x,s*(4+7*p),6.3,s*.4,c);}
        break;
      case 'Strange Steam':
        for(let j=0;j<8;j++){
          const u=clamp(p-j*.04),a=u*turn*1.3+j*.55,r=3+j*.42;
          const px=length*u,py=Math.sin(a)*6;arc(ctx,px,py,r,.83,a,4.4,(j%2?c:palettes.venom)[1],2);
          if(j%3===0)star(ctx,px+3,py-3,2.4,4,a,c[2]);
        }
        break;
    }
  }
  function coldFire(ctx,e,age,c) {
    const p=ease((age+.021)/.36);
    if(e.move==='Sizzly Slide'){
      const pts=[];for(let i=0;i<=15;i++){const u=p*i/15;pts.push([-23+40*u,9-15*u+5*Math.sin(u*Math.PI)]);}
      edge(ctx,pts,c,4.9);for(let i=0;i<4;i++){const u=clamp(p-i*.095);flame(ctx,-23+40*u,7-15*u+5*Math.sin(u*Math.PI),3.7+i*.6,c,.94);}
      return;
    }
    for(let i=0;i<5;i++){
      const a=i*turn/5-.2,rr=8+9*p,x=Math.cos(a)*rr,y=Math.sin(a)*rr*.76;
      crystal(ctx,x,y,3.2+i%2,6.5+i%3,c,a+.2);
      if(e.move==='Freeze Shock')bolt(ctx,x,y,0,0,3.3,p*15+i,palettes.gold);
      else flame(ctx,x*.55,y*.5,3.5+i%2,palettes.fire,a*.15);
    }
    if(e.move==='Ice Burn')arc(ctx,0,2,14+5*p,.7,-.4+age*8,3.9,palettes.fire[1],2.1);
  }
  function contact(ctx,e,age,c) {
    const p=ease((age+.015)/.31);
    switch(e.move){
      case 'Dire Claw':for(let i=0;i<3;i++){const y=-10+i*7;
        edge(ctx,[[-17,y+5],[-8+14*p,y-3],[2+14*p,y-7]],c,3.3);
        drop(ctx,-4+i*6,y+8*p,1.9,palettes.venom);}break;
      case 'Dizzy Punch':
        polygon(ctx,[[-17+14*p,-2],[-13+14*p,-8],[-5+14*p,-7],[-2+14*p,-3],[-4+14*p,4],[-11+14*p,6],[-17+14*p,3]],c[1]);
        for(let k=0;k<4;k++){const a=k*turn/4+p*3;star(ctx,4+Math.cos(a)*12,Math.sin(a)*8,3.8,5,a,palettes.gold[1+k%2]);}break;
      case 'Wake Up Slap':
        for(let i=0;i<4;i++){const x=-11+i*4+8*p;path(ctx,[[x,3],[x+2,-9+i%2*2]],c[i%2+1],2.4);}
        arc(ctx,0,0,14,.72,-.2+p,2.1,c[1],2.2);rays(ctx,9,-4,12,p,palettes.gold,5);break;
      case 'Smelling Salts':
        ctx.save();ctx.translate(-7+7*p,-1);ctx.rotate(.43);polygon(ctx,[[-4,-7],[3,-7],[3,-3],[6,-1],[6,7],[-5,7],[-5,-2],[-3,-3]],c[1]);
        path(ctx,[[-3,-7],[3,-7]],c[0],2.3);ctx.restore();
        for(let k=0;k<5;k++){const x=2+k*2,y=-3-k*2-5*p;crystal(ctx,x,y,1.7,2.2,c,p+k);}break;
    }
  }
  function terrain(ctx,e,age,c){
    const p=ease((age+.02)/.43),r=9+17*p;
    if(e.move==='Gravity'){
      for(let i=-1;i<=1;i++){const fall=6+11*p;edge(ctx,[[i*11,-21],[i*11,-18+fall]],c,2.7);chevron(ctx,i*11,-16+fall,4.8,Math.PI,c);}
      for(let i=0;i<2;i++)ring(ctx,0,9+i*2,12+8*p+i*3,3.2+i,c[1+i],1.6);return;
    }
    ring(ctx,0,9,r,r*.32,c[1],1.9);
    switch(e.move){
      case 'Electric Terrain':
        for(let i=-1;i<=1;i++)bolt(ctx,-r*.8,9+i*3,r*.8,9+i*3,2.6,age*13+i,c);
        for(const s of [-1,1])bolt(ctx,s*r*.6,8,s*(r*.59+2),-3-5*p,2.8,age*11,c);break;
      case 'Grassy Terrain':
        for(let i=0;i<8;i++){
          const a=i*turn/8+.2,x=Math.cos(a)*r*.8,y=8+Math.sin(a)*r*.24,h=4+7*p;
          path(ctx,[[x,y],[x-1,y-h*.56],[x+1,y-h]],c[0],1.8);
          leaf(ctx,x+2,y-h*.76,3.7,-.59,c);
        }break;
      case 'Misty Terrain':
        for(let j=0;j<4;j++){
          const pts=[];for(let k=0;k<=14;k++){const u=k/14;pts.push([(u*2-1)*r*.92,5+j*2+Math.sin(u*turn+age*6+j)*2.1]);}
          path(ctx,pts,c[j%2+1],1.65);
        }
        for(const s of [-1,1])star(ctx,s*(9+3*p),0,3.2,4,.1,c[2]);break;
      case 'Psychic Terrain':{
        const diamond=[[-r*.67,8],[0,1],[r*.67,8],[0,15],[-r*.67,8]];edge(ctx,diamond,c,2.9);
        eye(ctx,0,8,7.2,c,.64);for(const s of [-1,1])crystal(ctx,s*(r*.77),5,2.1,4.6,c,.3*s);break;
      }
    }
  }
  function rooms(ctx,e,age,c){
    const p=ease((age+.018)/.39),w=12+6*p,h=13+3*p,shift=Math.sin(p*3)*3;
    const top=[[0,-h-8],[-w+shift,-h+1],[0,-h+7],[w+shift,-h-1],[0,-h-8]];
    const bottom=top.map(([x,y])=>[x,y+h*1.43]);
    path(ctx,top,c[1],1.9);path(ctx,bottom,c[0],1.7);
    for(let i=0;i<4;i++)path(ctx,[top[i],bottom[i]],c[i%2+1],1.45);
    if(e.move==='Trick Room'){
      const a=-p*5;ring(ctx,0,-2,6,6,c[2],1.5);path(ctx,[[0,-6],[0,-2],[Math.cos(a)*5,-2+Math.sin(a)*5]],palettes.gold[1],1.9);
    }else if(e.move==='Magic Room'){
      crystal(ctx,0,-3,3.8,7,c,.31+p*.6);path(ctx,[[-8,5],[8,-10]],palettes.gold[2],1.9);
    }else{
      for(const s of [-1,1]){const x=s*(5+2*Math.sin(p*4));badge(ctx,s<0?'Power Swap':'Guard Swap',x,-2,.62,s<0?palettes.ruby:palettes.aura);}
    }
  }
  function shield(ctx,e,age,c){
    const p=ease((age+.024)/.38),r=13+8*p;
    switch(e.move){
      case 'Aurora Veil':
        for(let i=0;i<4;i++){
          const band=[];for(let k=0;k<=18;k++){const u=k/18,x=(u*2-1)*r;
            band.push([x,-5+Math.sin(u*6-age*7+i*.3)*6+i*2]);}
          const hem=band.slice().reverse().map(([x,y])=>[x,y+3+3*p]);
          polygon(ctx,[...band,...hem],['#76d5b274','#81d5ed80','#b0a1e982','#eca4d576'][i]);path(ctx,band,['#92f5c8','#afeaff','#cebcff','#f6bee6'][i],1.3);
        }break;
      case 'Mist':
        for(let i=0;i<5;i++){
          const x=(i-2)*6*p,y=4+Math.sin(i+age*6)*3;
          arc(ctx,x,y,4.5+i%3,.66,-2.8+i*.4,4.2,c[1+i%2],2.75);
        }break;
      case 'Safeguard':{
        const pts=[];for(let i=0;i<=6;i++){const a=i*turn/6-Math.PI/2;pts.push([Math.cos(a)*r,Math.sin(a)*r-1]);}
        polygon(ctx,pts,'#7ce9c22d');edge(ctx,pts,palettes.emerald,3.3);
        for(let i=0;i<6;i++)star(ctx,...pts[i],2.2,4,age,palettes.emerald[2]);break;
      }
      case 'Detect':
        arc(ctx,0,-3,r,.72,-2.6+p,4.4,c[1],2);eye(ctx,0,-3,9.2,c,.4+.55*Math.sin(p*Math.PI));
        for(let i=-1;i<=1;i++)path(ctx,[[i*7,-17],[i*8,-21-i%2]],c[2],1.5);break;
      case 'Baneful Bunker':{
        const dome=[[-r,9],[-r*.82,-3],[-r*.46,-12],[0,-16],[r*.55,-11],[r*.91,-3],[r,9]];
        polygon(ctx,dome,'#713b8259');path(ctx,dome,c[1],2.5);
        for(let i=1;i<6;i++){const [x,y]=dome[i];polygon(ctx,[[x-3,y+1],[x+x*.16,y-6-3*p],[x+3,y+1]],c[2]);}
        ring(ctx,0,8,r,3,c[0],2);break;
      }
      case 'Burning Bulwark':
        for(let j=0;j<2;j++)for(let i=0;i<3;i++){
          const x=(i-1)*10+(j?3:-2),y=5-j*7;polygon(ctx,[[x-4,y-3],[x+4,y-3],[x+4,y+2],[x-4,y+2]],c[0]);
          path(ctx,[[x-4,y-2],[x-4,y-3],[x+4,y-3]],c[1],1.35);
        }
        for(let i=-1;i<=1;i++)flame(ctx,i*9,-9,4.6+2*Math.sin(age*9+i)**2,c,i*.22);break;
    }
  }
  function seal(ctx,e,age,c){
    const p=ease((age+.016)/.37);
    switch(e.move){
      case 'Curse':
        if(e.x===e.tx && e.y===e.ty){
          for(const s of [-1,1]){badge(ctx,s<0?'Power Swap':'Guard Swap',s*10,4-7*p,.83,s<0?palettes.ruby:palettes.steel);}
          chevron(ctx,0,7,5,Math.PI,c);
        }else{
          ctx.save();ctx.rotate(-.54);polygon(ctx,[[-4,-17],[4,-17],[4,-14],[1,-13],[1,6+7*p],[0,12+7*p],[-2,4],[-2,-13],[-4,-14]],c[1]);
          path(ctx,[[-3,-16],[3,-16]],c[2],1.4);ctx.restore();
          ring(ctx,0,7,6+9*p,2+3*p,c[0],2.3);
        }break;
      case 'Spite':
        ring(ctx,0,-3,10,10,c[1],1.7);path(ctx,[[0,-10],[0,-3],[7,-2]],c[2],1.8);
        const a=p*4;arc(ctx,0,-3,14,.92,a,2.6,c[0],3.2);crystal(ctx,Math.cos(a)*14,-3+Math.sin(a)*13,2.3,4.3,c,a);break;
      case 'Embargo':
      case 'Imprison':{
        const lock=e.move==='Imprison';
        if(lock){for(const s of [-1,1])for(let i=0;i<3;i++)ring(ctx,s*(8+i*4),-3+i*3,4,2.1,c[i%2+1],1.45,s*.68);}
        else badge(ctx,'Trick',5,-1,.98,palettes.gold);
        const x=lock?0:-5;arc(ctx,x,-6,5.3,.98,Math.PI+.2*p,Math.PI,c[2],2.6);
        polygon(ctx,[[x-7,-5],[x+7,-5],[x+7,5],[x-7,5]],c[0]);disc(ctx,x,0,1.65,c[2]);
        if(!lock)path(ctx,[[-11,9],[11,-10]],'#ed8a82',2.35);break;
      }
      case 'Quash':
        for(let i=0;i<2;i++)chevron(ctx,0,-15+i*6+8*p,9-i,Math.PI,c);
        path(ctx,[[-11,8],[11,8]],c[1],3.2);break;
      case 'Telekinesis':
        for(let i=0;i<3;i++){const y=10-i*7-5*p;arc(ctx,0,y,13-i*.8,.30,p*3+i,5.3,c[i],1.9);}
        for(const s of [-1,1])chevron(ctx,s*14,-3-6*p,3.4,0,c);break;
      case 'Snatch':{
        const x=-9+13*p;const claw=[[x-9,5],[x-9,-3],[x-6,0],[x-5,-7],[x-2,-3],[x,-9],[x+2,-3],[x+5,-7],[x+4,0],[x+7,-2],[x+5,5],[x-2,8]];
        polygon(ctx,claw,c[0]);path(ctx,claw.slice(2,9),c[1],1.7);star(ctx,x+8,-4,3.2,4,0,c[2]);break;
      }
    }
  }
  function training(ctx,e,age,c){
    const p=ease((age+.017)/.36);
    switch(e.move){
      case 'Charge':for(let i=0;i<5;i++){
        const a=i*turn/5+age*4,r=23-12*p;bolt(ctx,r*Math.cos(a),r*Math.sin(a)*.77,r*.32*Math.cos(a),r*.32*Math.sin(a),2.8,p*8+i,c);
      }star(ctx,0,0,4.4+p*2,4,.2,c[2]);break;
      case 'Focus Energy':
        for(let i=0;i<3;i++)arc(ctx,0,-2,22-i*5-p*6,.85,age*6+i*1.65,2.6,c[i],1.8);
        star(ctx,0,-2,5,4,0,c[2]);break;
      case 'Work Up':
      case 'Coaching':{
        const coach=e.move==='Coaching';for(let j=0;j<2;j++)chevron(ctx,(coach?5:-3)*(j?1:-1),7-j*8-8*p,6,0,c);
        if(coach){path(ctx,[[-15,5],[-13,-9],[-4,-7],[-8,-3],[-12,-4]],palettes.gold[2],1.9);}
        else{for(const s of [-1,1])flame(ctx,s*12,3,4.4,palettes.fire,s*.2);}break;
      }
      case 'Dragon Cheer':
        for(const s of [-1,1]){const x=s*(9+4*p);
          polygon(ctx,[[x,4],[x-s*5,-2],[x-s*9,-4],[x-s*6,-7],[x-s*2,-6],[x+s*6,-14],[x+s*4,-5],[x+s*8,-7],[x+s*6,-1]],c[1]);}
        for(let i=-1;i<=1;i++)star(ctx,i*8,-13-5*p+Math.abs(i)*3,3.5,4,.2,c[2]);break;
      case 'Defense Curl':
        for(let i=0;i<3;i++)arc(ctx,0,1,18-i*4-3*p,.71,-p*4+i*1.4,4.75,c[i],2.6);
        crystal(ctx,0,0,4,5,c,.5);break;
      case 'Rock Polish':
        for(let i=0;i<3;i++){const x=(i-1)*8;crystal(ctx,x,3-Math.abs(i-1)*2,4.4,7.4,c,-.4+i*.3);}
        star(ctx,-10+23*p,-7,6,4,0,palettes.gold[2]);break;
      case 'Hone Claws':
        for(let i=0;i<3;i++)edge(ctx,[[-12+i*6,7],[-9+i*6,-1],[-5+i*6,-10-5*p]],c,3);
        star(ctx,-10+20*p,-3,5.1,4,0,palettes.gold[1]);break;
    }
  }
  function tricks(ctx,e,age,c) {
    const p=ease((age+.022)/.37);
    switch(e.move){
      case 'Double Team':
        for(const s of [-1,1]){
          const x=s*(6+13*p);
          path(ctx,[[x-s*3,7],[x-s*5,3],[x-s*4,-5],[x-s*7,-11],[x-s,-9],[x+s*3,-13],[x+s*5,-7],[x+s*4,-1],[x+s*7,5]],c[1],2.2);
          path(ctx,[[x-s*6,8],[x+s*5,8]],c[2],1.4);
        }break;
      case 'Mimic':
        for(let i=0;i<2;i++){const x=(i?1:-1)*(10-5*p),y=i?-5:0;
          path(ctx,[[x-6,y+5],[x-7,y-6],[x-2,y-10],[x+5,y-8],[x+5,y-4],[x+8,y-1],[x+4,y],[x+3,y+5]],c[1+i],2.15);}
        break;
      case 'Metronome':{
        ctx.save();ctx.rotate(Math.sin(p*turn)*.65);
        const hand=[[-5,6],[-8,1],[-8,-3],[-4,-2],[-4,-13],[-2,-16],[0,-14],[0,-4],[3,-6],[5,-4],[7,-4],[8,-1],[6,5],[2,8]];
        polygon(ctx,hand,c[1]);path(ctx,hand.slice(3,9),c[2],1.5);ctx.restore();
        for(const s of [-1,1])arc(ctx,0,-4,12,.83,s>0?-1.36:Math.PI-.1,1,c[1],1.6);break;
      }
      case 'Encore':
        for(const s of [-1,1]){const x=s*(17-9*p);
          polygon(ctx,[[x-s*4,7],[x-s*6,1],[x-s*4,-4],[x,-3],[x+s*2,-9],[x+s*5,-6],[x+s*4,2],[x,8]],c[1]);
          path(ctx,[[x-s*3,-1],[x,-3],[x+s*1,-6]],c[2],1.5);}
        rays(ctx,0,-6,12,p,palettes.gold,5);break;
      case 'Recycle':
        for(let i=0;i<3;i++){
          const a=i*turn/3+p*2.1,r=13;arc(ctx,0,0,r,.82,a,1.45,c[1],2.8);
          const end=a+1.45,x=Math.cos(end)*r,y=Math.sin(end)*r*.82;
          polygon(ctx,[[x,y],[x+4*Math.sin(end),y-4*Math.cos(end)],[x-3*Math.cos(end),y-3*Math.sin(end)]],c[2]);
        }
        disc(ctx,0,1,3.5,'#de8780');leaf(ctx,3,-3,2.5,-.55,c);break;
      case 'Nature Power':
        leaf(ctx,-9+p*3,2,6,-.5+p*.4,c);crystal(ctx,7,-6,3.1,5.6,palettes.ice,.25);
        drop(ctx,7,6,3,palettes.water);star(ctx,0,0,4.1,4,age*4,palettes.gold[2]);break;
      case 'Feather Dance':
        for(let i=0;i<6;i++){const u=clamp((age+.03-i%3*.026)/.31),x=(i-2.5)*5+Math.sin(u*5+i)*4;
          feather(ctx,x,-17+23*u-i%2*5,4.7+i%2,Math.sin(u*5+i)*.7,c);}break;
      case 'Flash':
        star(ctx,0,-3,7+16*Math.sin(p*Math.PI),4,.1,c[1],.17);star(ctx,0,-3,5+7*p,4,.77,c[2],.22);
        rays(ctx,0,-3,25,p,c,6);break;
    }
  }
  function remedy(ctx,e,age,c) {
    const p=ease((age+.025)/.39),y=-10-3*Math.sin(p*Math.PI);
    switch(e.move){
      case 'Heal Bell':
        ctx.save();ctx.translate(0,y);ctx.rotate(Math.sin(p*turn)*.43);
        polygon(ctx,[[-8,6],[-6,3],[-5,-5],[-2,-8],[3,-8],[6,-4],[6,2],[9,6]],palettes.gold[0]);
        path(ctx,[[-6,4],[-4,-4],[-1,-6],[2,-6]],c[1],2);path(ctx,[[-8,6],[9,6]],c[2],1.9);disc(ctx,1,8,2.3,c[1]);ctx.restore();
        for(const s of [-1,1])arc(ctx,s*4,y,10+4*p,.88,s<0?2.45:-.69,1.35,c[1],1.6);break;
      case 'Aromatherapy':
        for(let i=0;i<6;i++){const a=i*turn/6+.25*p;leaf(ctx,Math.cos(a)*6,y+Math.sin(a)*6,4.4,a,palettes.mist);}
        disc(ctx,0,y,2.9,palettes.gold[1]);
        for(let i=0;i<3;i++){const pts=[];for(let j=0;j<=10;j++){const u=j/10;pts.push([(i-1)*7+Math.sin(u*5+p*3+i)*3,8-15*u]);}path(ctx,pts,c[1+i%2],1.45);}break;
      case 'Refresh':
      case 'Purify':
        for(let i=0;i<6;i++){const a=i*turn/6+p*1.13,r=e.move==='Purify'?16-8*p:9+8*p;
          drop(ctx,Math.cos(a)*r,Math.sin(a)*r*.68-4*p,2.8+i%2,palettes.water);}
        if(e.move==='Purify'){star(ctx,0,-2,4+4*p,4,0,c[2]);}
        else arc(ctx,0,3,16,.52,-.4+p,3.7,c[1],1.7);break;
      case 'Lunar Blessing':
        crescent(ctx,0,y,11,palettes.gold[1]);for(let i=0;i<6;i++){
          const a=i*turn/6+p*.48;star(ctx,Math.cos(a)*(13+4*p),y+4+Math.sin(a)*10,2.4+i%2,4,a,c[2]);}break;
      case 'Jungle Healing':
        for(const s of [-1,1]){const pts=[];for(let j=0;j<=12;j++){const u=j/12;pts.push([s*(3+Math.sin(u*Math.PI)*10),11-25*u*p]);}
          path(ctx,pts,c[0],2.8);for(const j of [3,7,11]){const [x,h]=pts[j];leaf(ctx,x+s*2,h,4.8,s<0?-.5:-2.6,c);}}
        star(ctx,0,-2,4,4,0,c[2]);break;
      case 'Take Heart':
        heart(ctx,0,y+6,6+3*Math.sin(p*Math.PI),palettes.mist[1]);ring(ctx,0,y+6,11+8*p,8+6*p,c[1],1.6);
        for(const s of [-1,1])chevron(ctx,s*11,y-1-5*p,3.9,0,c);break;
      case 'Soft Boiled':
        for(const s of [-1,1]){
          const x=s*(3+8*p);ctx.save();ctx.translate(x,y+4);ctx.rotate(s*p*.55);
          polygon(ctx,[[0,-8],[s*4,-5],[s*7,1],[s*6,6],[s*2,8],[0,6],[s*2,2],[-s,0],[s*2,-4]],'#fff3db');ctx.restore();
        }
        disc(ctx,0,y+2,4.6,c[1]);star(ctx,3,y-5,2.9,4,0,c[2]);break;
    }
  }
  function cloud(ctx,e,age,c,r){
    const p=ease((age+.024)/.39);
    for(let i=0;i<14;i++){
      const a=i*2.4+p*.33,rr=r*(.19+.68*Math.sqrt((i+.3)/14))*(.55+.45*p);
      const x=Math.cos(a)*rr,y=Math.sin(a)*rr*.74;
      switch(e.move){
        case 'Poison Gas':{
          const size=4+(i%4)*1.65+2*p;disc(ctx,x,y,size,'#9c61b64f');
          arc(ctx,x,y,size,.78,-2.57+.2*i,2.75,c[1],1.8);
          if(i%3===0)ring(ctx,x+2,y-5,2.2,2.2,c[2],1.1);break;
        }
        case 'Venom Drench':{
          const fall=ease((age+.03-(i%4)*.029)/.23);
          drop(ctx,x+4*(1-fall),y-(1-fall)*r*.32,2.7+i%3,c);
          if(fall>.65)ring(ctx,x,y+2,4+3*p,2,c[1],1.25);break;
        }
        case 'Haze':{
          const pts=[];for(let k=0;k<=10;k++){const u=k/10;pts.push([x+(u-.5)*(14+i%3*4),y+Math.sin(u*6+age*8+i)*2.4]);}
          path(ctx,pts,i%2?'#e0edf4d4':'#98afbcbf',3.3-i%2);break;
        }
        case 'Sweet Scent':
          leaf(ctx,x,y,4.5+1.3*(i%3),a+age*3,palettes.mist);
          if(i%2===0)arc(ctx,x-4,y+3,5,.51,a,3,c[2],1.3);break;
        case 'Captivate':
          heart(ctx,x,y-7*p,3.4+i%3,c[i%2+1]);if(i%4===0)star(ctx,x+5,y-5,2.4,4,.2,c[2]);break;
      }
    }
  }
  function ritual(ctx,e,age,c,r){
    const p=ease((age+.018)/.40);
    if(e.move==='Dark Void'){
      const radius=r*(.28+.49*Math.sin(Math.PI*(.1+.82*p)));
      ctx.beginPath();ctx.ellipse(0,0,radius,radius*.64,0,0,turn);ctx.fillStyle='#251a3ab0';ctx.fill();
      for(let i=0;i<4;i++){
        const pts=[];for(let j=0;j<=28;j++){const u=j/28,a=i*turn/4+u*4.3-age*7,d=radius*(.14+.86*u);pts.push([Math.cos(a)*d,Math.sin(a)*d*.64]);}
        path(ctx,pts,i%2?c[1]:'#bd82ad',1.95);
      }crescent(ctx,0,-2,6,c[2]);
    }else if(e.move==='Heal Block'){
      for(let i=0;i<7;i++){
        const a=i*2.4,rr=i===0?0:r*(.39+i%2*.22),x=Math.cos(a)*rr,y=Math.sin(a)*rr*.78,size=i===0?9:5;
        path(ctx,[[x-size,y],[x+size,y]],c[1],2.9);path(ctx,[[x,y-size],[x,y+size]],c[1],2.9);
        arc(ctx,x,y,size+3,.94,age*4,turn-.16,c[0],1.8);path(ctx,[[x-size,y+size],[x+size,y-size]],'#f59c9c',2.1);
      }
    }else{
      for(let i=0;i<12;i++){
        const a=i*turn/12+p*.84,rr=r*(i%2?.55:.40),x=Math.cos(a)*rr,y=Math.sin(a)*rr*.72;
        ctx.save();ctx.translate(x,y);ctx.rotate(a+(i%2?.78:-.20));
        polygon(ctx,[[-3,-5],[0,-7],[3,-6],[4,-3],[3,1],[0,2],[-3,1]],c[1+i%2]);disc(ctx,0,4,1.9,c[1+i%2]);ctx.restore();
      }
      for(let i=0;i<3;i++){const a=i*turn/3+age*4;star(ctx,Math.cos(a)*8,Math.sin(a)*5,4,5,a,palettes.gold[1]);}
    }
  }
  function splash(ctx,e,age,c,r) {
    const p=ease((age+.022)/.39);
    if(e.move==='Pyro Ball'){
      const travel=ease((age+.028)/.22);
      // This ground-anchored release shows the ball dropping straight into the impact.
      const x=-r*.39*(1-travel),y=-r*.46*(1-travel)-Math.sin(travel*Math.PI)*r*.14;
      for(let i=0;i<3;i++)flame(ctx,x-3-i*4,y-3-i*3,3.5+(2-i)*1.3,c,-.61);
      const size=6.2+2*Math.sin(p*Math.PI);disc(ctx,x,y,size,c[0]);disc(ctx,x-1,y-1,size*.73,c[1]);
      star(ctx,x-1,y-1,size*.44,5,p*6,c[2]);
      if(travel>.69){const impact=ease((age-.11)/.26),rr=r*(.15+.56*impact);
        ring(ctx,0,2,rr,rr*.55,c[1],2);for(let i=0;i<7;i++){const a=i*turn/7;flame(ctx,Math.cos(a)*rr,Math.sin(a)*rr*.55,3.8+i%2,c,a*.16);}}
    }else{
      for(let j=0;j<3;j++){const rr=r*(.14+.16*j+.21*p);arc(ctx,0,2,rr,.51,age*4+j,5.4,c[j],2.1);}
      for(let i=0;i<11;i++){const a=i*turn/11,rr=r*(.16+.54*p),x=Math.cos(a)*rr,y=Math.sin(a)*rr*.61-r*.15*Math.sin(p*Math.PI);
        drop(ctx,x,y,3+i%3,c);if(i%3===0)disc(ctx,x+3,y-6,1.6,c[2]);}
    }
  }
  function signal(ctx,e,age,c,length){
    const p=ease((age+.024)/.22),w=e.halfWidth || 12,head=length*p;
    ctx.beginPath();ctx.rect(0,-w,length,2*w);ctx.clip();
    for(const s of [-1,1]){
      const pts=[];for(let i=0;i<=36;i++){const u=i/36;pts.push([head*u,s*Math.sin(u*turn*2.5-age*13)*w*.37]);}
      path(ctx,pts,s<0?'#e87c96':'#74d8f1',3.6);
    }
    for(let i=0;i<6;i++){const x=head*(i+.45)/6;path(ctx,[[x,-w*.28],[x+2,w*.28]],c[2],1.6);}
  }
});
