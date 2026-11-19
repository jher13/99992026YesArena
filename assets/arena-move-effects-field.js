'use strict';
/* Move artwork for wild encounters, Trainer teams and Master Gyms. */
globalThis.ArenaMoveEffects.addPack(function fieldMoveEffects({
  technique,palettes,turn,ease,clamp,path,polygon,disc,ring,halo,star,crystal,leaf,flame,eye,note
}) {
  technique('target',trap,'water','Whirlpool');
  technique('target',trap,'mud','Sand Tomb');
  technique('target',trap,'rock','Rock Tomb','Salt Cure');
  technique('target',trap,'gold','Thunder Cage');
  technique('target',trap,'grass','Infestation');
  technique('link',missile,'mud','Mud Shot','Mud Slap');
  technique('link',missile,'venom','Poison Sting','Sludge','Shell Side Arm');
  technique('link',missile,'grass','Pin Missile','Bullet Seed');
  technique('link',missile,'ice','Icicle Spear','Ice Shard');
  technique('link',missile,'steel','Magnet Bomb');
  technique('link',missile,'aura','Triple Arrows');
  technique('link',missile,'rock','Smack Down');
  technique('link',gust,'wind','Gust');
  technique('link',gust,'mist','Fairy Wind');
  technique('link',gust,'silver','Silver Wind');
  technique('link',gust,'ghost','Ominous Wind');
  technique('link',gust,'aura','Vacuum Wave');
  technique('link',gust,'ice','Frost Breath');
  technique('link',gust,'psychic','Esper Wing');
  technique('link',channel,'prism','Tri Attack','Hidden Power','Terrain Pulse');
  technique('link',channel,'gold','Electro Shot','Shock Wave');
  technique('link',channel,'psychic','Luster Purge','Eerie Spell');
  technique('link',channel,'dragon','Fickle Beam');
  technique('link',channel,'fire','Mystical Fire');
  technique('link',channel,'grass','Matcha Gotcha');
  technique('link',channel,'water','Brine');
  technique('target',eruption,'gold','Rising Voltage');
  technique('target',eruption,'psychic','Stored Power','Expanding Force');
  technique('target',eruption,'ghost','Infernal Parade');
  technique('target',eruption,'mud','Scorching Sands');
  technique('target',eruption,'fire','Fiery Dance');
  technique('link',tether,'silver','Bind','Wrap');
  technique('link',tether,'venom','Lick');
  technique('link',tether,'fire','Fire Lash');
  technique('link',tether,'grass','Absorb','Horn Leech');
  technique('link',tether,'mist','Draining Kiss');
  technique('target',razor,'silver','False Swipe','Crush Claw','Fury Swipes');
  technique('target',razor,'steel','Metal Claw');
  technique('target',razor,'grass','Fury Cutter');
  technique('target',razor,'night','Ceaseless Edge','Kowtow Cleave');
  technique('target',razor,'aura','Cross Chop');
  technique('target',razor,'dragon','Dual Chop');
  technique('target',razor,'venom','Poison Tail');
  technique('target',razor,'ghost','Shadow Bone');
  technique('target',razor,'prism','Secret Sword');
  technique('target',striker,'ruby','Arm Thrust','Force Palm','Power Up Punch','Mega Punch','Counter');
  technique('target',striker,'silver','Fake Out','Double Hit','Slam');
  technique('target',striker,'gold','Spark','Nuzzle');
  technique('target',striker,'venom','Poison Fang');
  technique('target',striker,'grass','Fell Stinger');
  technique('target',striker,'steel','Smart Strike');
  technique('target',striker,'dragon','Dragon Hammer','Glaive Rush');
  technique('target',striker,'mist','Spirit Break');
  technique('target',striker,'rock','Rock Smash');
  technique('target',kick,'ruby','Low Sweep','Double Kick','Mega Kick');
  technique('target',kick,'silver','Stomp');
  technique('target',kick,'mud','Stomping Tantrum');
  technique('target',trick,'night','Knock Off','Payback','Assurance','Thief','Lash Out');
  technique('target',trick,'silver','Covet','Feint');
  technique('target',trick,'gold','Pay Day');
  technique('target',trick,'ghost','Shadow Sneak');
  technique('target',wings,'wind','Wing Attack','Dual Wingbeat','Drill Peck','Pluck');
  technique('target',wings,'steel','Steel Wing');
  technique('target',grapple,'ruby','Circle Throw','Vital Throw');
  technique('target',grapple,'silver','Vise Grip','Rapid Spin','Fury Attack');
  technique('target',grapple,'grass','Grassy Glide');
  technique('link',sound,'silver','Echoed Voice','Snore');
  technique('target',toxin,'venom','Smog','Clear Smog');
  technique('ground',fieldRings,'gold','Electroweb','Parabolic Charge');
  technique('ground',fieldRings,'grass','String Shot','Razor Leaf');
  technique('ground',fieldRings,'wind','Air Cutter');
  technique('ground',fieldRings,'prism','Diamond Storm');
  technique('ground',fieldRings,'night','Brutal Swing');
  technique('ground',fieldRings,'dragon','Breaking Swipe','Core Enforcer');
  technique('ground',spray,'water','Bubble','Steam Eruption','Octazooka');
  technique('ground',spray,'venom','Acid','Acid Spray');
  technique('ground',spray,'ice','Powder Snow');
  technique('ground',spray,'fire','Lava Plume','Burning Jealousy');
  technique('ground',spray,'mist','Disarming Voice');
  technique('ground',spray,'psychic','Mist Ball');
  technique('ground',spray,'steel','Techno Blast');
  technique('target',support,'psychic','Amnesia','Teleport','Cosmic Power','Transform');
  technique('target',support,'mist','Charm');
  technique('target',support,'steel','Harden');
  technique('target',support,'water','Splash');
  technique('target',support,'silver','Sketch');
  technique('target',support,'grass','Baton Pass');
  technique('link',supportLink,'gold','Helping Hand');
  technique('lane',rush,'water','Aqua Step','Jet Punch');
  technique('lane',rush,'mud','Drill Run');
  technique('lane',rush,'fire','Flame Wheel');
  technique('lane',rush,'silver','Headbutt','Horn Attack');
  technique('lane',rush,'ruby','Mach Punch');
  technique('lane',coil,'gold','Charge Beam');
  technique('fan',fanFire,'fire','Incinerate');

  function sweep(ctx, x, y, radius, squash, angle, amount, color, width=2) {
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius*squash, 0, angle, angle+amount);
    ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke();
  }

  function spiral(ctx, radius, squash, turns, phase, y, color, width) {
    const points=[];
    for(let i=0;i<=30;i++){
      const u=i/30, angle=phase+turn*turns*u, r=radius*(.12+.88*u);
      points.push([r*Math.cos(angle),y+r*squash*Math.sin(angle)]);
    }
    path(ctx,points,color,width);
  }

  function bolt(ctx, x1, y1, x2, y2, width, phase, c) {
    const dx=x2-x1, dy=y2-y1, d=Math.hypot(dx,dy)||1, points=[[x1,y1]];
    for(let i=1;i<=5;i++){
      const t=i/6, k=Math.sin(i*2.68+phase)*Math.sin(t*Math.PI)*width;
      points.push([x1+dx*t-k*dy/d,y1+dy*t+k*dx/d]);
    }
    points.push([x2,y2]);
    path(ctx,points,c[0],3.8);path(ctx,points,c[2],1.55);
  }

  function snow(ctx,x,y,r,phase,c) {
    for(let i=0;i<6;i++){
      const a=i*turn/6+phase, dx=r*Math.cos(a), dy=r*Math.sin(a);
      path(ctx,[[x,y],[x+dx,y+dy]],c[2],1.45);
      path(ctx,[[x+.72*dx-.2*dy,y+.72*dy+.2*dx],[x+.54*dx,y+.54*dy],
        [x+.72*dx+.2*dy,y+.72*dy-.2*dx]],c[1],1);
    }
  }

  function shard(ctx,x,y,r,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    const rim=[[-r,-r*.16],[-r*.58,-r*.8],[r*.28,-r],[r*.91,-r*.44],[r*.79,r*.62],[-r*.16,r*.84]];
    polygon(ctx,rim,c[0]);polygon(ctx,[rim[0],rim[1],rim[2],rim[3],[0,r*.15]],c[1]);
    path(ctx,[rim[1],rim[2],rim[3]],c[2],1.4);ctx.restore();
  }

  function burst(ctx,x,y,r,phase,c,rays=7) {
    for(let i=0;i<rays;i++){
      const a=i*turn/rays+.18, ox=Math.cos(a)*r, oy=Math.sin(a)*r;
      path(ctx,[[x+ox*(.16+.52*phase),y+oy*(.16+.52*phase)],
        [x+ox*(.27+.73*phase),y+oy*(.27+.73*phase)]],c[1+i%2],i%2?1.4:2.2);
    }
  }

  function feather(ctx,x,y,size,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    const s=size;
    polygon(ctx,[[-s,0],[-s*.45,-s*.36],[0,-s*.54],[s*.75,-s*.42],[s*.33,-s*.08],
      [s*.58,-s*.14],[s*.13,s*.18],[-s*.38,s*.29]],c[1]);
    path(ctx,[[-s*1.13,s*.14],[0,-s*.08],[s*.64,-s*.35]],c[2],1.35);ctx.restore();
  }

  // Direct multi-hit moves get one numbered event for each strike that actually lands.
  function strikeProgress(e,age,duration=.22) {
    return ease((age+.015-(e.strikeIndex??0)*.055)/duration);
  }

  function trap(ctx,e,age,c) {
    const p=ease((age+.02)/.4), spin=p*4.8;
    switch(e.move){
      case 'Whirlpool':
        for(let i=0;i<3;i++)spiral(ctx,25-i*3,.46,1.05,spin+i*turn/3,6-i*3,c[i],3.1-i*.65);
        for(let i=0;i<7;i++){
          const a=spin+i*turn/7;disc(ctx,21*Math.cos(a),4+9*Math.sin(a),1.6+i%2,c[2]);
        }
        break;
      case 'Sand Tomb':
        for(let level=0;level<4;level++){
          const r=23-level*3;
          sweep(ctx,0,8-level*6,r,.33,spin+level*.9,4.8,c[level%3],2.5);
          for(let i=0;i<4;i++){
            const a=spin+level+i*1.6;
            ctx.fillStyle=c[(i+level)%3];ctx.fillRect(Math.cos(a)*r,7-level*6+Math.sin(a)*r*.33,3,2);
          }
        }
        break;
      case 'Rock Tomb':
        for(let i=0;i<6;i++){
          const a=i*turn/6, lift=ease((age+.02-i*.018)/.23), d=26-8*lift;
          const x=Math.cos(a)*d, y=6+9*Math.sin(a)+12*(1-lift);
          const wall=[[x-6,y+4],[x-5,y-7*lift],[x,y-16*lift],[x+5,y-11*lift],[x+7,y+3]];
          polygon(ctx,wall,c[0]);polygon(ctx,[wall[1],wall[2],wall[3],[x+1,y+1]],c[1]);path(ctx,wall.slice(1,4),c[2],1.6);
        }
        break;
      case 'Thunder Cage': {
        const r=22-4*p;
        ring(ctx,0,9,r,5,c[1],2);ring(ctx,0,-21,r*.78,4,c[2],1.5);
        for(let i=0;i<6;i++){
          const a=i*turn/6+p*.3,x=Math.cos(a),y=Math.sin(a);
          bolt(ctx,x*r,9+y*5,x*r*.78,-21+y*4,3.3,p*13+i,c);
        }
        break;
      }
      case 'Infestation':
        for(let i=0;i<7;i++){
          const a=i*turn/7+spin,d=24-11*p,x=Math.cos(a)*d,y=Math.sin(a)*d*.72;
          disc(ctx,x,y,2.6,c[0]);disc(ctx,x-2,y-1,1.8,c[1]);
          for(const side of [-1,1])path(ctx,[[x-2,y],[x-4,y+side*(2+Math.abs(Math.sin(age*27+i))*2)],[x-6,y+side*3]],c[2],1);
        }
        break;
      case 'Salt Cure':
        for(let i=0;i<6;i++){
          const a=i*2.4,r=9+i%3*3,x=Math.cos(a)*r,y=Math.sin(a)*r*.55+5-21*(1-p);
          ctx.save();ctx.translate(x,y);ctx.rotate(.3+i*.65+p*.3);
          polygon(ctx,[[-4,-4],[3,-5],[5,1],[3,5],[-4,4]],'#f4ebde');
          path(ctx,[[-4,-4],[0,0],[5,1]],'#bba6aa',1.3);ctx.restore();
        }
        sweep(ctx,0,10,13+6*p,.26,.1,2.95,c[1],1.8);break;
    }
  }

  function missile(ctx,e,age,c,length) {
    const index=e.strikeIndex??0, p=strikeProgress(e,age,.29);
    if(!p)return;
    const x=length*p, arch=Math.sin(p*Math.PI), y=(index%2?-1:1)*index*4*arch;
    const tail=Math.max(0,x-Math.min(15,p*length));
    switch(e.move){
      case 'Ice Shard':case 'Icicle Spear': {
        const spear=e.move==='Icicle Spear',r=spear?14:8;
        path(ctx,[[tail,y],[x,y]],'#83c6e7',2);
        polygon(ctx,[[x-r,y-3],[x-r*.4,y-5],[x+6,y],[x-r*.6,y+4]],c[1]);
        path(ctx,[[x-r,y-3],[x+6,y],[x-r*.6,y+4]],c[2],1.55);break;
      }
      case 'Poison Sting':case 'Pin Missile': {
        const poison=e.move==='Poison Sting';
        path(ctx,[[tail,y],[x,y]],c[1],2.3);
        polygon(ctx,[[x-10,y-3],[x+5,y],[x-10,y+3],[x-6,y]],c[2]);
        if(poison)disc(ctx,x-4,y+1,2.3,c[1]);break;
      }
      case 'Bullet Seed': {
        const height=y-7*arch;
        path(ctx,[[tail,height+2],[x,height]],c[1],1.8);
        ctx.save();ctx.translate(x,height);ctx.rotate(-.5+index*.14);
        ctx.beginPath();ctx.ellipse(0,0,5.2,3.5,0,0,turn);ctx.fillStyle='#745331';ctx.fill();
        path(ctx,[[-3,1],[0,-.6],[3,-1.3]],'#f6d873',1.6);ctx.restore();break;
      }
      case 'Mud Shot':case 'Mud Slap':case 'Sludge':case 'Shell Side Arm': {
        const slap=e.move==='Mud Slap',shell=e.move==='Shell Side Arm',goo=e.move==='Sludge';
        const offset=-(slap?5:shell?2:15)*arch;
        path(ctx,[[tail,y+offset+2],[x,y+offset]],c[1],shell?4.2:2.5);
        if(shell)polygon(ctx,[[x-9,y+offset-4],[x+6,y+offset],[x-9,y+offset+4]],c[2]);
        else{
          const count=slap?6:goo?4:3;
          for(let i=0;i<count;i++)disc(ctx,x-i*2.7,y+offset+Math.sin(i*2.6)*(slap?7:3),i===0?5:2.7,c[i%2]);
          disc(ctx,x+1,y+offset-2,1.7,c[2]);
        }
        if(p>.82)burst(ctx,length,0,slap?17:10,(p-.82)/.18,c,5);break;
      }
      case 'Magnet Bomb':
        path(ctx,[[tail,y-2],[x,y-2]],c[1],2);disc(ctx,x,y,6.5,c[0]);disc(ctx,x-1.3,y-1.8,4,c[1]);
        sweep(ctx,x,y,9,.6,p*5,4.4,c[2],1.5);break;
      case 'Triple Arrows':
        for(let i=-1;i<=1;i++){
          const yy=i*(5+5*arch),xx=x-Math.abs(i)*5;
          path(ctx,[[xx-17,yy],[xx+3,yy]],c[1],2);
          polygon(ctx,[[xx-2,yy-3],[xx+6,yy],[xx-2,yy+3]],c[2]);
          path(ctx,[[xx-14,yy],[xx-18,yy-3]],c[0],2);
        }
        break;
      case 'Smack Down':
        shard(ctx,x,-21*arch,8,p*3,c);
        if(p>.7){const fall=ease((p-.7)/.3);path(ctx,[[length-7,-8],[length,6+8*fall],[length+6,0]],c[2],2.5);}break;
    }
  }

  function gust(ctx,e,age,c,length) {
    const p=ease((age+.02)/.30),x=length*p, airy=e.move==='Gust', vacuum=e.move==='Vacuum Wave';
    if(vacuum){
      for(let i=0;i<3;i++)sweep(ctx,x-7*i,0,7+4*i,.93,-1.13,2.26,c[2-i],2.5-i*.4);
      return;
    }
    const cold=e.move==='Frost Breath', silver=e.move==='Silver Wind', ghost=e.move==='Ominous Wind';
    const fairy=e.move==='Fairy Wind', esp=e.move==='Esper Wing', w=cold?12:airy?17:13;
    for(let j=0;j<3;j++){
      const ribbon=[];
      for(let i=0;i<=15;i++){
        const u=i/15,trail=Math.max(0,x-(1-u)*Math.min(48,length));
        ribbon.push([trail,Math.sin(u*6-age*12+j*2.1)*w*Math.sin(u*Math.PI)]);
      }
      path(ctx,ribbon,c[j],j===0?2.8:1.55);
    }
    for(let i=0;i<4;i++){
      const xx=x-Math.min(x,5+i*7),y=Math.sin(p*6+i*2.15)*(5+i*1.9);
      if(cold)snow(ctx,xx,y,3.6+i*.3,p+i,c);
      else if(fairy)star(ctx,xx,y,3.6,4,p+i,c[2]);
      else if(silver || esp)feather(ctx,xx,y,esp?8:5,p+i*.7,c);
      else if(ghost){disc(ctx,xx,y,3,c[0]);if(i%2===0)eye(ctx,xx,y,3,c,.8);}
      else sweep(ctx,xx,y,4+i,.6,i+p*4,3.2,c[2],1.25);
    }
    if(esp)eye(ctx,x,0,5.5,c,.85);
  }

  function channel(ctx,e,age,c,length) {
    const p=ease((age+.02)/.29), x=length*p, tail=Math.max(0,x-21);
    switch(e.move){
      case 'Tri Attack':
        for(let i=0;i<3;i++){
          const a=i*turn/3+p*2.4, orbit=17*(1-.59*p);
          const px=x+Math.cos(a)*orbit, py=Math.sin(a)*orbit;
          const palette=[palettes.fire,palettes.ice,palettes.gold][i];
          path(ctx,[[Math.max(0,px-21),py+Math.sin(a-.6)*5],[px,py]],palette[1],2.6);
          if(i===0)flame(ctx,px,py,7,palette,1.1);
          else if(i===1)crystal(ctx,px,py,4.2,7,palette,.9);
          else bolt(ctx,px-5,py+4,px+5,py-5,3,p*4,palette);
        }
        if(p>.85)star(ctx,length,0,7,6,p,c[2]);break;
      case 'Electro Shot':
        for(let i=-1;i<=1;i++)sweep(ctx,5+i*2,i*3,6+3*(1-p),.7,age*12+i,4.1,c[1],1.5);
        bolt(ctx,0,0,x,0,7,p*14,c);
        if(p>.7)star(ctx,x,0,8,4,p,c[2]);break;
      case 'Shock Wave':
        for(let i=0;i<4;i++){
          const xx=Math.max(0,x-i*8), r=6+i*1.7;
          sweep(ctx,xx,0,r,.95,-1.25,2.5,c[i%3],1.7);
          if(i%2===0)bolt(ctx,xx,-r*.55,xx+3,r*.55,2,p*10+i,c);
        }
        break;
      case 'Eerie Spell':
        for(let i=0;i<4;i++){
          const xx=Math.max(0,x-i*8),yy=Math.sin(p*6+i)*6;
          note(ctx,xx,yy,4+i%2,c,i*.2);
        }
        if(p>.55)eye(ctx,x,0,6,c,.45+.45*p);break;
      case 'Luster Purge': {
        const pts=[];
        for(let i=0;i<=16;i++){const t=i/16;pts.push([x*t,Math.sin(t*8-age*9)*4]);}
        path(ctx,pts,c[0],5);path(ctx,pts,c[2],2.5);
        for(let i=-1;i<=1;i++)star(ctx,x-6*Math.abs(i),i*6,4.4,4,p,c[1]);
        break;
      }
      case 'Fickle Beam':
        for(let i=-2;i<=2;i++){
          const startY=i*4;
          path(ctx,[[0,startY],[x*.34,startY*1.6],[x*.68,i*Math.sin(p*8+i)*3],[x,0]],c[(i+3)%3],1.7);
        }
        star(ctx,x,0,6,5,p,c[2]);break;
      case 'Hidden Power':
        for(let i=0;i<6;i++){
          const a=i*turn/6+age*9,r=13-8*p,xx=x+Math.cos(a)*r,yy=Math.sin(a)*r;
          disc(ctx,xx,yy,3.5,[palettes.fire,palettes.water,palettes.grass,palettes.ice,palettes.psychic,palettes.gold][i][1]);
          disc(ctx,xx-.6,yy-.7,1.3,c[2]);
        }
        break;
      case 'Terrain Pulse':
        for(let i=0;i<5;i++){
          const xx=Math.max(0,x-i*9),r=5+i*1.7;
          path(ctx,[[xx-r*.6,7],[xx,-r],[xx+r*.6,7]],i%2?c[1]:e.color??c[2],2.1);
          sweep(ctx,xx,8,r,.3,0,Math.PI,c[0],1.35);
        }
        break;
      case 'Mystical Fire':
        for(let i=0;i<4;i++){
          const xx=Math.max(0,x-i*7), yy=Math.sin(p*7+i*1.5)*7;
          flame(ctx,xx,yy,6-i*.6,i%2?[c[0],palettes.mist[1],c[2]]:c,1.1);
        }
        break;
      case 'Matcha Gotcha':
        for(let i=0;i<3;i++){
          const lip=[];
          for(let j=0;j<=14;j++){const u=j/14;lip.push([x*u,(i-1)*3-16*Math.sin(u*Math.PI)+Math.sin(u*9+age*8)*2]);}
          path(ctx,lip,c[i],i===0?3.4:1.8);
        }
        for(let i=0;i<5;i++){const a=i*turn/5+p;disc(ctx,x+Math.cos(a)*6,Math.sin(a)*4,1.8,c[2]);}
        break;
      case 'Brine':
        path(ctx,[[tail,-4],[x-5,1],[x,0]],c[1],3);
        for(let i=0;i<6;i++){const a=i*2.4+p*3, r=4+4*p;crystal(ctx,x+Math.cos(a)*r,Math.sin(a)*r,1.9,3.5,c,a);}
        break;
    }
  }

  function eruption(ctx,e,age,c) {
    const p=ease((age+.025)/.37), r=8+17*p;
    if(e.move==='Fiery Dance' || e.move==='Infernal Parade'){
      const parade=e.move==='Infernal Parade',n=parade?5:6;
      for(let i=0;i<n;i++){
        const a=i*turn/n+age*(parade?4:10),x=parade?-23+i*11:Math.cos(a)*r,y=parade?-5+Math.sin(a)*7:Math.sin(a)*r*.65;
        flame(ctx,x,y,5+i%2,c,parade?Math.sin(a)*.3:a+.7);
        if(parade){disc(ctx,x-1.1,y-.4,.8,c[2]);disc(ctx,x+1.4,y-.4,.8,c[2]);}
      }
    }else if(e.move==='Rising Voltage'){
      ring(ctx,0,8,r,4+3*p,c[1],2);
      for(let i=-2;i<=2;i++){const x=i*8,h=(29-Math.abs(i)*5)*Math.sin(p*Math.PI*.88);
        bolt(ctx,x,8+Math.abs(i),x+2,8-h,4,p*16+i,c);}
    }else if(e.move==='Scorching Sands'){
      for(let i=0;i<12;i++){const a=i*2.4+p*1.3,d=r*(.5+.15*(i%3)),x=Math.cos(a)*d,y=Math.sin(a)*d*.55;
        shard(ctx,x,y+3,2.4+i%3,a,c);if(i%3===0)flame(ctx,x,y-5,5,palettes.fire,.2);}
    }else if(e.move==='Expanding Force'){
      for(let i=0;i<3;i++){const u=clamp((age+.03-i*.055)/.29);if(u)ring(ctx,0,0,3+28*u,3+17*u,c[i],2.3,.2);}
      star(ctx,0,0,5+3*Math.sin(p*Math.PI),4,p,c[2]);
    }else{
      for(let i=0;i<6;i++){const a=i*turn/6+2*p,d=21-17*p;crystal(ctx,Math.cos(a)*d,Math.sin(a)*d,2.7,5,c,a);}
      eye(ctx,0,0,5+4*p,c,.35+.6*p);
    }
  }

  function tether(ctx,e,age,c,length) {
    const p=ease((age+.02)/.25),w=Math.sin(p*Math.PI);
    if(e.move==='Absorb'||e.move==='Horn Leech'||e.move==='Draining Kiss'){
      const kiss=e.move==='Draining Kiss',horn=e.move==='Horn Leech',back=ease((age-.035)/.39);
      if(kiss){
        const x=length*(1-back),y=-7*Math.sin(back*Math.PI);
        ctx.beginPath();ctx.moveTo(x,y+4);ctx.bezierCurveTo(x-13,y-4,x-5,y-12,x,y-5);
        ctx.bezierCurveTo(x+7,y-12,x+12,y-4,x,y+4);ctx.fillStyle=c[1];ctx.fill();
        if(age<.2)sweep(ctx,length,0,9,.62,0,Math.PI,c[2],1.4);
      }else if(horn){
        path(ctx,[[length-16,4],[length-2,-10],[length+5,-15]],c[0],4);
        path(ctx,[[length-9,-3],[length-11,-10]],c[1],2.5);
      }
      for(let i=0;i<4;i++){const u=ease((age+.02-i*.035)/.38),x=length*(1-u),y=Math.sin(u*Math.PI)*Math.sin(i*2.4+u*5)*8;
        if(horn)leaf(ctx,x,y,3.7,u*3+i,c);else if(!kiss||i%2)disc(ctx,x,y,2.45+i%2,c[1+i%2]);}
    }else if(e.move==='Lick'){
      const x=length*p*(1-.7*ease((age-.2)/.28)),pts=[];
      for(let i=0;i<=14;i++){const u=i/14;pts.push([u*x,Math.sin(u*Math.PI)*(8+4*w)-5*u]);}
      path(ctx,pts,'#ad5479',7);path(ctx,pts,'#f193a8',4.7);
      const [ex,ey]=pts.at(-1);disc(ctx,ex,ey,3,'#ffc4c6');
    }else if(e.move==='Fire Lash'){
      const lash=[];
      for(let i=0;i<=18;i++){const u=i/18;lash.push([u*length*p,Math.sin(u*8-p*6)*Math.sin(u*Math.PI)*14]);}
      path(ctx,lash,c[0],4);path(ctx,lash,c[1],2);flame(ctx,length*p,0,6,c,1.15);
    }else{
      const wrap=e.move==='Wrap',x=length*p,pts=[];
      for(let i=0;i<=20;i++){const u=i/20;pts.push([u*x,Math.sin(u*10+p*4)*Math.sin(u*Math.PI)*5]);}
      path(ctx,pts,c[0],3.7);path(ctx,pts,c[2],1.4);
      for(let i=0;i<(wrap?3:2);i++)sweep(ctx,x,5-i*7,16-4*p,.44,p*4+i,5.5,c[1+i%2],2);
    }
  }

  function cut(ctx,x,y,size,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(-size,-size*.2);ctx.quadraticCurveTo(0,size*.75,size,-size*.18);
    ctx.quadraticCurveTo(0,size*.28,-size,-size*.2);ctx.fillStyle=c[1];ctx.fill();
    ctx.strokeStyle=c[2];ctx.lineWidth=1.1;ctx.stroke();ctx.restore();
  }

  function razor(ctx,e,age,c) {
    const idx=e.strikeIndex??0, p=strikeProgress(e,age,.24);
    if(!p)return;
    const heavy=['Kowtow Cleave','Crush Claw'].includes(e.move),r=heavy?25:20;
    switch(e.move){
      case 'Ceaseless Edge':
        for(let i=0;i<3;i++){
          const x=(i-1)*10;
          polygon(ctx,[[x-4,9],[x+2,8-15*p],[x+5,7]],c[0]);path(ctx,[[x-3,8],[x+2,8-15*p]],c[1],1.5);
        }
        cut(ctx,0,-4,r,-.6+1.4*p,c);break;
      case 'Kowtow Cleave':
        path(ctx,[[-15,-22],[-7,-19],[3*p,4*p]],c[0],7);
        cut(ctx,3,-4,25,-1.3+2.4*p,c);
        if(p>.58)burst(ctx,5,3,21,p,c,5);break;
      case 'Secret Sword':
        ctx.save();ctx.rotate(-1.22+1.94*p);
        polygon(ctx,[[-2,13],[-3,-8],[0,-27],[3,-9],[2,13]],c[1]);
        path(ctx,[[0,5],[0,-23]],c[2],1.5);path(ctx,[[-6,6],[6,6]],palettes.gold[1],2.3);
        ctx.restore();star(ctx,8,-12,3.8,4,p,c[2]);break;
      case 'Shadow Bone': {
        const a=-1.4+2.3*p;
        ctx.save();ctx.rotate(a);path(ctx,[[-13,0],[0,-2],[12,-4]],c[0],6);
        for(const x of [-13,12]){disc(ctx,x,-3,3.6,c[1]);disc(ctx,x+1,1,3.3,c[1]);}ctx.restore();
        sweep(ctx,0,0,19,.75,-1.8,2*p+.12,c[1],2);break;
      }
      case 'Poison Tail':
        for(let i=0;i<7;i++){
          const a=-2.5+i*.32+1.4*p,x=Math.cos(a)*18,y=Math.sin(a)*13+5;
          disc(ctx,x,y,4.6-i*.32,c[i%2]);if(i===6)crystal(ctx,x+2,y-4,2.7,7,c,a);
        }
        break;
      case 'Cross Chop':
        cut(ctx,-3,0,r,-1.1+1.9*p,c);cut(ctx,3,0,r,1.1-1.9*p,c);break;
      case 'Dual Chop':
        cut(ctx,idx%2?5:-5,idx%2?4:-4,r,(idx%2?1:-1)*(-1.2+1.9*p),c);break;
      case 'False Swipe':
        cut(ctx,-9+8*p,7,15,-.38+.42*p,c);
        path(ctx,[[7,-1],[12,-4],[15,-4]],c[0],1.6);break;
      case 'Fury Cutter':
        cut(ctx,-3,0,21,-1.5+2.3*p,c);leaf(ctx,9*p,-8,5,-1+p,c);break;
      default: {
        const crush=e.move==='Crush Claw',metal=e.move==='Metal Claw',side=idx%2?-1:1;
        for(let j=-1;j<=1;j++){
          const x=j*(crush?7:5), y=(metal?-16:-12)+j*2;
          path(ctx,[[x-side*8,y],[x+side*5*p,y+20*p],[x+side*8*p,y+25*p]],c[0],crush?4.6:3.2);
          path(ctx,[[x-side*8,y],[x+side*5*p,y+20*p]],c[2],1.45);
        }
        if(crush)burst(ctx,2,8,17,p,c);if(metal)star(ctx,8,-6,3.7,4,p,c[2]);break;
      }
    }
  }

  function fist(ctx,x,y,angle,scale,c,open=false) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
    const rim=open?[[-7,5],[-7,-1],[-10,-6],[-7,-7],[-4,-4],[-5,-12],[-2,-13],
      [0,-6],[1,-14],[4,-13],[4,-5],[6,-11],[8,-9],[7,1],[4,6]]:
      [[-8,4],[-8,-3],[-5,-7],[-2,-8],[1,-7],[4,-8],[7,-5],[8,0],[4,5],[-1,6]];
    polygon(ctx,rim,c[0]);ctx.save();ctx.scale(.77,.77);polygon(ctx,rim,c[1]);ctx.restore();
    path(ctx,[[-5,-3],[-3,-5],[0,-4],[3,-5]],c[2],1.35);ctx.restore();
  }

  function striker(ctx,e,age,c) {
    const idx=e.strikeIndex??0,p=strikeProgress(e,age);
    if(!p)return;
    const dx=-19+23*p;
    switch(e.move){
      case 'Arm Thrust':case 'Force Palm':
        fist(ctx,dx,idx%2?4:-3,.82,1.05,c,true);
        if(e.move==='Force Palm')ring(ctx,5,0,4+16*p,3+12*p,c[1],2.1);
        break;
      case 'Mega Punch':case 'Power Up Punch':case 'Counter':
        fist(ctx,dx,3-7*p,e.move==='Power Up Punch'?-.62:.16,e.move==='Mega Punch'?1.55:1.14,c);
        if(e.move==='Counter'){
          path(ctx,[[-17,-9],[-5,-15],[8,-7],[3,-7],[9,0]],c[2],2.2);
        }else if(e.move==='Power Up Punch'){
          for(let i=-1;i<=1;i++)path(ctx,[[i*7-3,11],[i*7-3,-2],[i*7-6,2]],c[1],1.8);
        }else burst(ctx,5,0,24,p,c);break;
      case 'Fake Out':
        for(const side of [-1,1])fist(ctx,side*(22-16*p),-3,side*.9,.9,c,true);
        if(p>.45)star(ctx,0,0,8,7,p,c[2]);break;
      case 'Double Hit':case 'Slam':
        if(e.move==='Double Hit'){
          const side=idx%2?1:-1;
          cut(ctx,side*(15-11*p),side*5,12,side*.75,c);
          burst(ctx,side*3,side*3,13,p,c,5);
        }else{
          path(ctx,[[-6,-25],[-2,-15],[4*p,7*p]],c[0],6);
          ring(ctx,2,9,4+19*p,2+4*p,c[1],2.5);
        }break;
      case 'Spark':case 'Nuzzle':
        if(e.move==='Nuzzle'){
          for(const side of [-1,1]){disc(ctx,side*(10-4*p),2,4.6,palettes.mist[1]);bolt(ctx,side*7,0,side*16,-6,3,p*8,c);}
        }else for(let i=0;i<6;i++){
          const a=i*turn/6+p*.6;bolt(ctx,1,0,Math.cos(a)*(10+13*p),Math.sin(a)*(10+13*p),3.4,p*12+i,c);
        }break;
      case 'Poison Fang':
        for(const s of [-1,1]){
          const y=s*(14-10*p);
          for(const x of [-7,7])polygon(ctx,[[x-3,y],[x+3,y],[x+1,y-s*8]],c[2]);
          sweep(ctx,0,y,10,.43,s===1?0:Math.PI,Math.PI,c[1],2);
        }
        disc(ctx,8,6+4*p,2.6,c[1]);break;
      case 'Fell Stinger':case 'Smart Strike':
        ctx.save();ctx.translate(dx,0);ctx.rotate(e.move==='Smart Strike'?-.72:-.23);
        polygon(ctx,[[-15,-4],[-8,-6],[11,0],[-7,5]],c[0]);path(ctx,[[-13,-3],[11,0],[-6,2]],c[2],1.8);ctx.restore();
        if(e.move==='Smart Strike')star(ctx,8,-6,4.2,4,p,c[2]);break;
      case 'Dragon Hammer':
        for(let i=0;i<5;i++){const a=-2.1+1.45*p+i*.23;shard(ctx,Math.cos(a)*16,Math.sin(a)*17+6,7-i*.6,a,c);}
        if(p>.6)burst(ctx,4,7,20,p,c);break;
      case 'Glaive Rush': {
        const x=-21+28*p,y=-13+17*p;
        ctx.save();ctx.translate(x,y);ctx.rotate(-.38+.53*p);
        for(const side of [-1,1])path(ctx,[[-24,side*9],[-7,side*4],[9,0]],c[1],2.6);
        polygon(ctx,[[-10,3],[-4,-12],[4,-18],[3,-9],[16,0],[-5,4]],c[0]);
        path(ctx,[[-4,-12],[4,-18],[3,-9],[16,0]],c[2],2);
        ctx.restore();if(p>.68)burst(ctx,7,4,20,(p-.68)/.32,c,6);break;
      }
      case 'Spirit Break':
        for(let i=0;i<5;i++){const a=i*turn/5,d=7+12*p;crystal(ctx,Math.cos(a)*d,Math.sin(a)*d,3.4,6,c,a+p);}
        path(ctx,[[-6,-13],[1,-5],[-3,0],[6,11]],c[2],2.1);break;
      case 'Rock Smash':
        for(let i=0;i<4;i++){const a=i*turn/4+.4,d=3+15*p;shard(ctx,Math.cos(a)*d,Math.sin(a)*d,6.5-i*.35,p+i,c);}
        fist(ctx,dx,-5,.5,.9,palettes.ruby);break;
    }
  }

  function kick(ctx,e,age,c) {
    const idx=e.strikeIndex??0,p=strikeProgress(e,age,.245);if(!p)return;
    const stomp=e.move==='Stomp'||e.move==='Stomping Tantrum',sweepLow=e.move==='Low Sweep',twin=e.move==='Double Kick';
    const side=twin&&idx%2?-1:1, x=stomp?0:side*(-13+19*p),y=stomp?-20+28*p:sweepLow?10:2-8*p;
    ctx.save();ctx.translate(x,y);ctx.rotate(stomp ? 0.06 : side*(-.65+.7*p));
    const shoe=[[-8,-11],[-1,-11],[0,-3],[8,1],[9,5],[3,7],[-7,4]];
    polygon(ctx,shoe,c[0]);path(ctx,[shoe[0],shoe[1],shoe[2],shoe[3]],c[1],2.4);path(ctx,shoe.slice(4),c[2],1.8);ctx.restore();
    if(stomp){
      ring(ctx,0,10,4+18*p,1.5+4*p,c[1],2);
      if(e.move==='Stomping Tantrum')for(const s of [-1,1])path(ctx,[[s*3,9],[s*9,5],[s*13,10],[s*(15+9*p),6]],c[0],2);
    }else if(sweepLow)sweep(ctx,0,5,20,.38,.2,Math.PI*p+.25,c[1],2.6);
    else burst(ctx,x,y,e.move==='Mega Kick'?24:13,p,c,6);
  }

  function trick(ctx,e,age,c) {
    const p=ease((age+.02)/.32),x=-20+29*p;
    switch(e.move){
      case 'Pay Day':
        for(let i=0;i<5;i++){
          const u=clamp((age+.03-i*.025)/.32),xx=(i-2)*11*u,yy=-Math.sin(u*Math.PI)*(15+3*(i%2))+4*u;
          const rx=1.2+3.4*Math.abs(Math.cos(u*7+i));
          ring(ctx,xx,yy,rx,5,c[0],2.6);ring(ctx,xx,yy,rx,5,c[1],1.5);path(ctx,[[xx,yy-2],[xx,yy+2]],c[2],1.2);
        }break;
      case 'Knock Off':case 'Thief':case 'Covet': {
        const steal=e.move!=='Knock Off',off=(steal?-1:1)*15*p,yy=-12*Math.sin(p*Math.PI);
        fist(ctx,x,3,-.3,.78,c,true);
        if(e.move==='Covet')star(ctx,off,yy-6,5.7,5,p,c[2]);
        else{polygon(ctx,[[off-4,yy-4],[off+2,yy-5],[off+6,yy],[off,yy+5],[off-5,yy+1]],c[1]);}
        path(ctx,[[off-6,yy+4],[off-11,yy+5]],c[2],1.5);break;
      }
      case 'Shadow Sneak':
        sweep(ctx,0,7,17,.30,0,turn,c[0],4);
        for(const s of [-1,1]){const x=s*4;path(ctx,[[x-2,-2-4*p],[x+2,-3-4*p]],c[2],1.7);}
        for(let i=0;i<3;i++)cut(ctx,-12+i*6,3-10*p,7,-1.3,c);break;
      case 'Feint':
        cut(ctx,-13+4*p,-7,12,-.55,c);cut(ctx,10-7*p,5,14,.38,c);break;
      case 'Lash Out':
        for(let i=0;i<5;i++){const a=i*turn/5+.35;path(ctx,[[0,0],[Math.cos(a+.3)*10,Math.sin(a+.3)*10],
          [Math.cos(a)*(11+13*p),Math.sin(a)*(11+13*p)]],c[i%2],2.7);}break;
      default: {
        const payback=e.move==='Payback';
        sweep(ctx,0,0,19,.7,payback?-2.6:-.6,p*4.4+.2,c[1],2.5);
        if(payback){cut(ctx,x,2,14,-.9+p,c);path(ctx,[[-12,-7],[-17,-7],[-15,-12]],c[2],2);}
        else{fist(ctx,2,7-9*p,.5,.96,c);burst(ctx,3,0,12,p,c,5);}break;
      }
    }
  }

  function wings(ctx,e,age,c) {
    const idx=e.strikeIndex??0,p=strikeProgress(e,age,.23);if(!p)return;
    if(e.move==='Drill Peck'){
      const x=-15+22*p;
      polygon(ctx,[[x-8,-6],[x+11,0],[x-8,6]],c[1]);
      for(let i=0;i<3;i++)sweep(ctx,x-6+i*4,0,5.5-i,.72,age*20+i,4.4,c[2],1.3);
    }else if(e.move==='Pluck'){
      polygon(ctx,[[-12,-5],[4+5*p,0],[-12,4],[-4,0]],c[0]);
      feather(ctx,4+11*p,-3-9*Math.sin(p*Math.PI),7,-.8+p*1.3,c);
    }else{
      const steel=e.move==='Steel Wing',s=idx%2?-1:1;
      ctx.save();ctx.rotate(s*(-1.15+2.1*p));
      for(let i=0;i<4;i++)feather(ctx,(i-1)*5,-5+i*2.5,12-i,steel?-.45:-.60+i*.15,c);
      if(steel)path(ctx,[[-13,-6],[1,-12],[16,-7]],c[2],2.7);
      ctx.restore();if(e.move==='Dual Wingbeat')sweep(ctx,0,0,20,.66,idx%2?0:Math.PI,2.4*p+.1,c[1],1.6);
    }
  }

  function grapple(ctx,e,age,c) {
    const p=strikeProgress(e,age,.29);if(!p)return;
    switch(e.move){
      case 'Circle Throw':case 'Vital Throw': {
        const circle=e.move==='Circle Throw',a=-2.5+(circle?4.5:2.8)*p;
        const x=Math.cos(a)*16,y=Math.sin(a)*13;
        sweep(ctx,0,0,18,circle ? 0.8 : 1,-2.5,(circle?4.5:2.8)*p+.1,c[1],2.6);
        fist(ctx,x,y,a+.9,.9,c,true);
        if(!circle)path(ctx,[[8,-12],[15,-14],[13,-7]],c[2],1.9);break;
      }
      case 'Vise Grip':
        for(const s of [-1,1]){
          const x=s*(21-13*p);polygon(ctx,[[x+s*6,-8],[x-s*6,-5],[x-s*3,-1],[x-s*6,3],[x+s*6,7]],c[0]);
          path(ctx,[[x+s*5,-7],[x-s*5,-4],[x-s*2,-1]],c[2],2.2);
        }break;
      case 'Rapid Spin':
        for(let i=0;i<3;i++)sweep(ctx,0,5-i*4,18-i*3,.4,p*8+i,4.9,c[i],2.5-i*.4);
        burst(ctx,0,5,22,p,c,5);break;
      case 'Grassy Glide':
        for(let i=0;i<5;i++){const x=-20+i*8+7*p;leaf(ctx,x,6-Math.sin(i*1.7)*4,5.6,.8-i*.3+p,c);}
        path(ctx,[[-20,9],[-3,5],[15,2]],c[2],1.8);break;
      case 'Fury Attack': {
        const idx=e.strikeIndex??0,off=(idx%3-1)*5,x=-15+23*p;
        polygon(ctx,[[x-10,off-3],[x+6,off],[x-11,off+3]],c[1]);
        path(ctx,[[x-9,off-2],[x+6,off]],c[2],1.45);break;
      }
    }
  }

  function sound(ctx,e,age,c,length) {
    const snore=e.move==='Snore';
    for(let i=0;i<4;i++){
      const p=clamp((age+.03-i*.044)/.31);if(!p)continue;
      const x=length*ease(p),r=6+p*(snore?9:13);
      sweep(ctx,x,0,r,.96,-1.12,2.24,c[1+i%2],2.1);
      if(snore)path(ctx,[[x-8,-r-3],[x-2,-r-3],[x-7,-r+1],[x-1,-r+1]],c[2],1.25);
      else if(i%2===0)note(ctx,x-5,Math.sin(p*7)*6,4,c,-.15);
    }
  }

  function toxin(ctx,e,age,c) {
    const clear=e.move==='Clear Smog',p=ease((age+.02)/.40);
    for(let i=0;i<7;i++){
      const a=i*2.4+p*.65,d=clear?8+19*p:6+8*p;
      const x=Math.cos(a)*d,y=Math.sin(a)*d*.52-8*p, r=clear?6-3*p:5.6+i%3;
      disc(ctx,x,y,r,clear?'rgba(191,159,207,.58)':'rgba(123,77,151,.72)');
      sweep(ctx,x,y,r*.8,.8,-2.8,1.4,clear?'#f0e8fa':c[1],1.3);
    }
    if(clear)sweep(ctx,0,2,8+16*p,.65,-2.6,4.8,c[2],1.7);
  }

  function fieldRings(ctx,e,age,c,r) {
    const p=ease((age+.025)/.37),d=r*(.12+.74*p);
    switch(e.move){
      case 'Electroweb':case 'String Shot': {
        const electric=e.move==='Electroweb', spokes=electric?7:5;
        for(let i=0;i<spokes;i++){
          const a=i*turn/spokes+.13, x=Math.cos(a)*d,y=Math.sin(a)*d*.82;
          if(electric)bolt(ctx,0,0,x,y,Math.min(4,r*.06),p*8+i,c);
          else path(ctx,[[0,0],[x*.45,y*.46+Math.sin(i+p*5)*3],[x,y]],'#eeeccc',1.8);
        }
        if(electric){
          for(const fraction of [.5,.88]){
            const pts=[];for(let i=0;i<=spokes;i++){const a=i*turn/spokes+.13;pts.push([Math.cos(a)*d*fraction,Math.sin(a)*d*.82*fraction]);}
            path(ctx,pts,c[1],1.5);
          }
        }else spiral(ctx,d*.85,.80,1.8,age*8,0,'#f6f3de',1.8);
        break;
      }
      case 'Parabolic Charge':
        for(let i=0;i<7;i++){
          const a=i*turn/7, x=Math.cos(a)*r*.76,y=Math.sin(a)*r*.76;
          bolt(ctx,x,y,x*(1-p),y*(1-p),5,age*18+i,c);
        }
        ring(ctx,0,0,5+9*p,5+9*p,c[1],2);break;
      case 'Razor Leaf':case 'Air Cutter':
        for(let i=0;i<7;i++){const a=i*turn/7+age*.8,x=Math.cos(a)*d,y=Math.sin(a)*d;
          if(e.move==='Razor Leaf'){leaf(ctx,x,y,6.8,a+p,c);path(ctx,[[x*.77,y*.77],[x,y]],c[1],1.4);}
          else cut(ctx,x,y,8.5+i%2,a+1.35,c);}
        break;
      case 'Diamond Storm':
        for(let i=0;i<10;i++){
          const a=i*2.4+p*.35,f=(.28+(i%5)*.14),x=Math.cos(a)*d*f,y=Math.sin(a)*d*f;
          crystal(ctx,x,y-(1-p)*10,3.8+i%3,7+i%4,c,a);
          if(i%3===0)star(ctx,x+3,y-6,3.3,4,p,c[2]);
        }break;
      case 'Brutal Swing':case 'Breaking Swipe': {
        const brutal=e.move==='Brutal Swing',w=brutal ? 0.84 : 0.58;
        for(let i=0;i<3;i++)sweep(ctx,0,0,d*(1-i*.12),w,p*5+i*1.5,brutal?2.65:1.8,c[i],3-i*.5);
        if(!brutal)for(let i=0;i<4;i++){const a=p*4+i*.2;shard(ctx,Math.cos(a)*d,Math.sin(a)*d*w,4+i*.7,a,c);}
        break;
      }
      case 'Core Enforcer':
        for(let i=-2;i<=2;i++){
          const y=i*d*.24,span=d*Math.sqrt(Math.max(0,1-(y/d)**2));
          const hex=[];for(let j=0;j<=6;j++){const a=j*turn/6;hex.push([Math.cos(a)*7,Math.sin(a)*6+y]);}
          path(ctx,[[-span,y],[0,y-2],[span,y]],c[1],i===0?4:1.6);
          path(ctx,hex,palettes.emerald[1],1.6);
        }break;
    }
  }

  function spray(ctx,e,age,c,r) {
    const p=ease((age+.025)/.38),d=r*(.12+.74*p);
    switch(e.move){
      case 'Bubble':case 'Octazooka':case 'Acid':case 'Acid Spray': {
        const bubble=e.move==='Bubble',ink=e.move==='Octazooka',acidSpray=e.move==='Acid Spray';
        const n=acidSpray?12:ink?7:9;
        for(let i=0;i<n;i++){
          const a=i*2.4,frac=.38+.13*(i%5),x=Math.cos(a)*d*frac,y=Math.sin(a)*d*frac-(bubble?6*p:0);
          if(bubble){
            const size=2.9+i%4;
            ring(ctx,x,y,size,size,c[1+i%2],1.6);sweep(ctx,x,y,size*.65,1,-2.6,1.1,c[2],1);
          }else{
            if(acidSpray)path(ctx,[[x*.55,y*.55],[x,y]],c[1],1.8);
            const shade=ink?['#282636','#534861','#a79bb5']:c;
            disc(ctx,x,y,ink?5+i%4:2.8+i%4,shade[i%2]);disc(ctx,x-1,y-1,1.3,shade[2]);
          }
        }
        if(e.move==='Acid')ring(ctx,0,2,d*.68,d*.46,c[1],1.8);break;
      }
      case 'Steam Eruption':case 'Lava Plume':case 'Burning Jealousy': {
        const steam=e.move==='Steam Eruption',jealous=e.move==='Burning Jealousy';
        if(e.move==='Lava Plume'){
          for(let i=-2;i<=2;i++){
            const height=Math.min(r*.63,42)*(1-.12*Math.abs(i)), arc=[];
            for(let j=0;j<=12;j++){
              const t=p*j/12;
              arc.push([i*t*r*.22,-height*4*t*(1-t)-4+t*9]);
            }
            path(ctx,arc,c[0],3.7);path(ctx,arc,c[1],1.85);
            const [x,y]=arc.at(-1);shard(ctx,x,y,3.6+i%2,p*4+i,[palettes.rock[0],c[1],c[2]]);
          }
        }
        for(let i=0;i<(jealous?6:9);i++){
          const a=i*2.4,f=.25+.17*(i%4),x=Math.cos(a)*d*f,y=Math.sin(a)*d*f;
          if(steam){
            const cloudY=y-15*p,s=4.2+i%3;
            disc(ctx,x,cloudY,s,'rgba(202,235,241,.78)');sweep(ctx,x,cloudY,s*.82,1,-2.7,1.6,c[2],1.4);
            path(ctx,[[x,y+3],[x-1,y-6]],c[1],1.8);
          }else{
            const flameColor=jealous?[palettes.night[0],c[1],palettes.mist[2]]:c;
            flame(ctx,x,y,6+i%3+(jealous?0:3)*p,flameColor,Math.sin(i)*.4);
          }
        }
        if(jealous)eye(ctx,0,-3,8,c,.65);else ring(ctx,0,4,d*.7,d*.44,c[1],1.6);break;
      }
      case 'Powder Snow':
        for(let i=0;i<11;i++){
          const a=i*2.4,rad=d*(.27+.14*(i%5)),x=Math.cos(a)*rad,y=Math.sin(a)*rad+5*p;
          if(i%2)snow(ctx,x,y,3.6+i%3,p*.9+i,c);else disc(ctx,x,y,2+i%3,c[2]);
        }break;
      case 'Disarming Voice':
        for(let i=0;i<5;i++){const a=i*turn/5-.7;note(ctx,Math.cos(a)*d*.8,Math.sin(a)*d*.78,4.7+i%2,c,a*.21);}
        for(let i=0;i<2;i++)sweep(ctx,0,0,d*(.9-.23*i),.76,p*3+i*3,3.3,c[1+i],1.6);break;
      case 'Mist Ball':
        for(let i=0;i<8;i++){const a=i*2.4+p*.6,x=Math.cos(a)*d*.63,y=Math.sin(a)*d*.48;
          disc(ctx,x,y,5+i%3,'rgba(226,169,207,.58)');feather(ctx,x+3,y-4,5.7,a+p,c);}
        ring(ctx,0,0,d*.64,d*.48,c[2],1.45);break;
      case 'Techno Blast':
        for(let i=0;i<6;i++){
          const a=i*turn/6,x=Math.cos(a)*d,y=Math.sin(a)*d;
          path(ctx,[[0,0],[x*.42,y*.42],[x*.54-y*.09,y*.54+x*.09],[x,y]],i%2?c[1]:e.color??c[2],2.1);
          ctx.fillStyle=c[2];ctx.fillRect(x-2,y-2,4,4);
        }
        ring(ctx,0,0,5+5*p,5+5*p,c[0],2.5);break;
    }
  }

  function support(ctx,e,age,c) {
    const p=ease((age+.025)/.38);
    switch(e.move){
      case 'Teleport':
        for(let i=0;i<3;i++){
          const y=9-i*11-7*p, w=(21-i*2)*(1-.68*p);
          ring(ctx,0,y,w,3.5,c[(i+1)%3],1.9);
        }
        for(let i=-2;i<=2;i++)path(ctx,[[i*6,7-i%2],[i*6,-9-15*p]],c[1+i*i%2],1.4);
        break;
      case 'Baton Pass': {
        const x=-12+27*p,y=-8-10*Math.sin(p*Math.PI);
        ctx.save();ctx.translate(x,y);ctx.rotate(-1.1+p*2.8);
        path(ctx,[[-9,0],[9,0]],c[0],6);path(ctx,[[-8,-1],[8,-1]],c[1],3.5);
        for(const end of [-8,8])disc(ctx,end,0,2.5,c[2]);
        ctx.restore();
        for(let i=0;i<3;i++)star(ctx,x-5-i*5,y+2+(i%2)*3,2.6,4,p,c[2]);break;
      }
      case 'Sketch': {
        const corners=[[-16,2],[-14,-14],[-3,-20],[9,-12],[13,-1],[-1,4],[-16,2]];
        const step=p*(corners.length-1),idx=Math.min(corners.length-2,Math.floor(step)),f=step-idx;
        const [ax,ay]=corners[idx],[bx,by]=corners[idx+1],x=ax+(bx-ax)*f,y=ay+(by-ay)*f;
        const drawn=[...corners.slice(0,idx+1),[x,y]];
        path(ctx,drawn,'#443752',3.6);path(ctx,drawn,'#c9a8cd',1.25);
        path(ctx,[[x+2,y-3],[x+12,y-17]],'#9b6b44',4.8);
        path(ctx,[[x+5,y-8],[x+11,y-16]],'#f3d2a1',1.6);
        polygon(ctx,[[x,y],[x+1,y-7],[x+6,y-6]],'#3f6470');disc(ctx,x,y,1.9,c[1]);break;
      }
      case 'Transform':
        for(let i=0;i<3;i++){
          const a=p*5+i*turn/3;cut(ctx,Math.cos(a)*12,Math.sin(a)*11,9,a+.8,c);
        }
        ring(ctx,0,3,8+15*Math.sin(p*Math.PI),4+9*p,c[1],2.2);
        for(const s of [-1,1])star(ctx,s*(18-8*p),-9-8*p,4,4,p,c[2]);break;
      case 'Amnesia':
        for(let i=0;i<3;i++){const x=2+i*5,y=-7-i*5-5*p;ring(ctx,x,y,2+i,2+i,c[1+i%2],1.4);}
        sweep(ctx,12,-25-3*p,4.8,1.03,-2.8,4.05,c[2],2);disc(ctx,11,-17-3*p,1.4,c[2]);break;
      case 'Cosmic Power':
        for(let i=0;i<2;i++){
          ring(ctx,0,-2,19,5,c[1+i],1.55,(i?1:-1)*.55);
          const a=age*7+i*Math.PI;star(ctx,Math.cos(a)*17,-2+Math.sin(a)*8,3.1,4,p,c[2]);
        }
        star(ctx,0,-5,6,4,p,c[2]);break;
      case 'Charm':
        for(let i=0;i<3;i++){
          const x=(i-1)*10,y=-3-(6+i*3)*p-i%2*6;
          ctx.beginPath();ctx.moveTo(x,y+5);ctx.bezierCurveTo(x-12,y-4,x-4,y-10,x,y-4);
          ctx.bezierCurveTo(x+5,y-10,x+11,y-4,x,y+5);ctx.fillStyle=c[1+i%2];ctx.fill();
        }break;
      case 'Harden':
        for(let i=0;i<6;i++){
          const a=i*turn/6,d=22-9*p,x=Math.cos(a)*d,y=Math.sin(a)*d*.82;
          ctx.save();ctx.translate(x,y);ctx.rotate(a);
          polygon(ctx,[[-4,-6],[2,-7],[6,0],[2,7],[-4,6]],c[0]);path(ctx,[[2,-7],[6,0],[2,7]],c[2],1.8);ctx.restore();
        }
        break;
      case 'Splash':
        for(let i=-2;i<=2;i++){
          const x=i*(4+7*p),y=8-Math.sin(p*Math.PI)*(19-3*Math.abs(i))+3*p;
          ctx.beginPath();ctx.ellipse(x,y,2.3,4,.26*i,0,turn);ctx.fillStyle=c[1+i*i%2];ctx.fill();
        }
        ring(ctx,0,9,5+22*p,2+3*p,c[1],1.7);break;
    }
  }

  function supportLink(ctx,e,age,c,length) {
    const p=ease((age+.015)/.30);
    // Helping Hand follows the ally that actually received the boost.
    const x=length*p;
    for(let i=0;i<3;i++)star(ctx,Math.max(0,x-i*8),-3-i%2*3,3.4-i*.4,4,age+i,c[2]);
    fist(ctx,x,-3-7*Math.sin(p*Math.PI),.55,.85,c,true);
    if(p>.6)for(const side of [-1,1])path(ctx,[[length+side*9,1],[length+side*14,-6]],c[1],2.1);
  }

  function rush(ctx,e,age,c,length) {
    const p=ease((age+.018)/.19),x=length*p,tail=Math.max(0,x-37);
    switch(e.move){
      case 'Flame Wheel':
        ring(ctx,x,0,8,8,c[0],2.8);
        for(let i=0;i<5;i++){
          const a=i*turn/5+p*5;flame(ctx,x+8*Math.cos(a),8*Math.sin(a),4.4,c,a+1);
        }
        for(let i=1;i<=3;i++)disc(ctx,x-(x-tail)*i/3,(i%2?2:-2),3-i*.45,c[i%2]);break;
      case 'Drill Run':
        for(let i=0;i<4;i++){
          const xx=x-3-i*3,r=2.5+i*1.4;sweep(ctx,xx,0,r,.95,age*18+i,4.6,c[1+i%2],1.8);
        }
        polygon(ctx,[[x-5,-3],[x+8,0],[x-5,3]],c[1]);path(ctx,[[tail,3],[x-12,3]],c[0],2);break;
      case 'Horn Attack':
        polygon(ctx,[[x-14,-5],[x+7,-1],[x-11,5]],c[1]);
        path(ctx,[[x-12,-4],[x+7,-1]],c[2],1.7);path(ctx,[[tail,1],[x-12,1]],c[0],2);break;
      case 'Aqua Step':
        for(let i=0;i<5;i++){
          const xx=tail+(x-tail)*i/4,y=(i%2?1:-1)*5;
          ring(ctx,xx,y,4+i*.4,1.9,c[1+i%2],1.5);
        }
        cut(ctx,x,-3,10,-.54+p*.78,c);break;
      case 'Jet Punch':case 'Mach Punch': {
        const jet=e.move==='Jet Punch';
        for(let i=-1;i<=1;i++)path(ctx,[[tail,i*(jet?6:4)],[x-5,i*2]],c[1+Math.abs(i)],jet?2.6:1.8);
        if(jet)sweep(ctx,x-5,0,7,.95,1.5,3.5,c[2],2.2);
        fist(ctx,x,0,0,.88,c);break;
      }
      case 'Headbutt':
        for(let i=0;i<3;i++)sweep(ctx,x-i*6,0,7+i*1.5,.95,-1.15,2.30,c[2-i],2.2-i*.3);
        path(ctx,[[tail,0],[x-9,0]],c[1],2);break;
    }
  }

  function coil(ctx,e,age,c,length) {
    // The beam event supplies its real lane dimensions, including in replays.
    const width=e.halfWidth||6,head=length*ease((age+.015)/.19);
    ctx.beginPath();ctx.rect(0,-width,length,2*width);ctx.clip();
    const wave=[];
    for(let i=0;i<=40;i++){const u=i/40;wave.push([head*u,Math.sin(u*turn*4-age*20)*width*.66]);}
    path(ctx,wave,c[1],2.5);path(ctx,[[0,0],[head,0]],c[2],1.6);
    for(let i=1;i<=4;i++){const x=head*i/5;bolt(ctx,x-3,-width*.6,x+3,width*.6,2,age*12+i,c);}
  }

  function fanFire(ctx,e,age,c,length) {
    const p=ease((age+.017)/.28),angle=e.sector.halfAngle;
    for(let i=-2;i<=2;i++){
      const a=i*.36*angle, reach=length*(.13+.79*p)*(1-.10*Math.abs(i));
      const width=Math.min(9,reach*.16)*(1+.2*Math.sin(age*19+i));
      ctx.save();ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,0);
      ctx.bezierCurveTo(reach*.31,-width*.5,reach*.56,-width*1.6,reach*.67,-width*.37);
      ctx.quadraticCurveTo(reach*.76,-width*.22,reach,-width*.67);
      ctx.bezierCurveTo(reach*.86,width*.7,reach*.51,width*1.65,0,0);
      ctx.fillStyle=i%2?c[0]:c[1];ctx.fill();
      ctx.beginPath();ctx.moveTo(reach*.14,0);ctx.quadraticCurveTo(reach*.48,-width*.44,reach*.72,width*.12);
      ctx.strokeStyle=i%2?c[1]:c[2];ctx.lineWidth=1.8;ctx.stroke();
      if(age>.12){disc(ctx,reach+3,-width,1.9,c[1]);disc(ctx,reach*.84,width*1.23,1.3,c[2]);}
      ctx.restore();
    }
  }
});
