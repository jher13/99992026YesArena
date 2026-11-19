'use strict';
/* Arena attack artwork. Each strike and zone is painted from an actual combat event. */
globalThis.ArenaMoveEffects.addPack(function attackEffects({
  technique,palettes,turn,ease,clamp,path,polygon,disc,ring,star,crystal,leaf,flame,note
}) {
  const green=palettes.grass,metal=palettes.steel,amber=palettes.gold;
  const cosmic=['#473062','#f06cbd','#c0faff'];
  const blood=['#562a4c','#ec6364','#ffdb98'];
  const rainbow=['#f18793','#ffc566','#e9e88b','#82dfa8','#83d9fc','#c7a2f7'];

  technique('target',edgeWeapon,'steel','Behemoth Blade','Gigaton Hammer');
  technique('target',edgeWeapon,'rock','Mighty Cleave','Stone Axe');
  technique('target',edgeWeapon,'fire','Bitter Blade');
  technique('target',edgeWeapon,'water','Aqua Cutter');
  technique('target',edgeWeapon,'psychic','Psyblade');
  technique('target',edgeWeapon,'gold','Sunsteel Strike');
  technique('target',machinery,'steel','Behemoth Bash','Metal Burst','Meteor Mash','Gear Grind','Spin Out');
  technique('target',machinery,'psychic','Mirror Coat');
  technique('target',jaws,'gold','Bolt Beak');
  technique('target',jaws,'fire','Beak Blast');
  technique('target',jaws,'water','Clamp','Crabhammer','Fishious Rend');
  technique('target',jaws,'silver','Hyper Fang','Guillotine');
  technique('target',jaws,'night','Jaw Lock');
  technique('target',jaws,'grass','Snap Trap');
  technique('target',blow,'ruby','Karate Chop','Sky Uppercut','Final Gambit','Rolling Kick','Triple Kick');
  technique('target',blow,'night','Wicked Blow','Hyperspace Fury','Comeuppance','Punishment','Feint Attack');
  technique('target',blow,'ghost','Rage Fist');
  technique('target',blow,'grass','Trop Kick','Needle Arm');
  technique('target',blow,'water','Surging Strikes');
  technique('target',scrap,'silver','Double Slap','Chip Away','Hold Back','Flail','Head Charge','Population Bomb');
  technique('target',scrap,'mud','Bone Club','Bone Rush');
  technique('target',garden,'grass','Drum Beating','Grav Apple','Flower Trick','Leaf Tornado');
  technique('target',garden,'gold','Attack Order');
  technique('target',apparition,'ghost','Bitter Malice','Last Respects');
  technique('target',apparition,'psychic','Heart Stamp');
  technique('target',apparition,'prism','Revelation Dance');
  technique('target',apparition,'wind','Floaty Fall');
  technique('target',apparition,'ice','Mountain Gale');
  technique('target',apparition,'water','Triple Dive');

  technique('link',binding,'steel','Anchor Shot');
  technique('link',binding,'ghost','Spirit Shackle');
  technique('target',binding,'grass','Constrict');
  technique('target',binding,'silver','Wring Out');
  technique('link',wheel,'fire','Blazing Torque');
  technique('link',wheel,'ruby','Combat Torque');
  technique('link',wheel,'mist','Magical Torque');
  technique('link',wheel,'venom','Noxious Torque');
  technique('link',wheel,'night','Wicked Torque');
  technique('link',wheel,'gold','Aura Wheel');
  technique('link',partner,'night','Baddy Bad');
  technique('link',partner,'water','Bouncy Bubble');
  technique('link',partner,'psychic','Glitzy Glow');
  technique('link',partner,'grass','Sappy Seed');
  technique('link',partner,'ice','Freezy Frost');
  technique('link',partner,'mist','Sparkly Swirl');
  technique('link',partner,'silver','Veevee Volley');
  technique('link',partner,'gold','Pika Papow','Zippy Zap');
  technique('link',projectile,'dragon','Dragon Darts','Order Up');
  technique('link',projectile,'water','Water Shuriken','Snipe Shot');
  technique('link',projectile,'venom','Barb Barrage');
  technique('link',projectile,'silver','Barrage','Spike Cannon','Spit Up','Present','Trump Card');
  technique('link',projectile,'steel','Mirror Shot');
  technique('link',projectile,'grass','Syrup Bomb');
  technique('link',lightRay,'ghost','Moongeist Beam');
  technique('link',lightRay,'ruby','Blood Moon');
  technique('link',lightRay,'mist','Light of Ruin');
  technique('link',lightRay,'prism','Lumina Crash');
  technique('link',lightRay,'psychic','Twin Beam');
  technique('link',lightRay,'steel','Tachyon Cutter');
  technique('link',current,'gold','Thunderclap','Double Shock');
  technique('link',current,'water','Hydro Steam');
  technique('link',current,'silver','Sonic Boom');
  technique('link',current,'fire','Torch Song');

  technique('lane',rush,'ruby','Jump Kick');
  technique('lane',rush,'psychic','Psyshield Bash');
  technique('lane',rush,'silver','Raging Bull');
  technique('lane',rush,'grass','Steamroller');
  technique('lane',rush,'gold','Zing Zap');
  technique('lane',longRange,'dragon','Eternabeam');
  technique('lane',longRange,'ice','Glacial Lance');
  technique('ground',downpour,'gold','Make It Rain');
  technique('ground',downpour,'ghost','Astral Barrage');
  technique('ground',downpour,'steel','Clanging Scales');
  technique('ground',detonate,'fire','Armor Cannon','Flame Burst','Mind Blown');
  technique('ground',detonate,'mud','Mud Bomb');
  technique('ground',field,'mud','Magnitude');
  technique('ground',field,'ice','Ice Ball');
  technique('ground',field,'venom','Mortal Spin');
  technique('ground',field,'psychic','Synchronoise');

  // Combat can resolve several hits in one tick. Space only the indices that the engine reported.
  function beat(e,age,duration=.23) {
    return ease((age+.012-(e.strikeIndex??0)*.038)/duration);
  }
  function outline(ctx,points,c,w=3) {
    path(ctx,points,c[0],w+2);path(ctx,points,c[1],w);path(ctx,points,c[2],Math.max(.9,w*.27));
  }
  function arc(ctx,x,y,r,squash,from,sweep,color,width=2) {
    ctx.beginPath();ctx.ellipse(x,y,r,r*squash,0,from,from+sweep);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  function radial(ctx,x,y,n,r1,r2,angle,c,w=2) {
    for(let i=0;i<n;i++){
      const a=angle+i*turn/n,dx=Math.cos(a),dy=Math.sin(a);
      path(ctx,[[x+r1*dx,y+r1*dy],[x+r2*dx,y+r2*dy]],c[i%2+1],w);
    }
  }
  function flash(ctx,x,y,size,c,angle=0) {
    star(ctx,x,y,size+2,6,angle,c[0],.24);star(ctx,x,y,size,6,angle,c[1],.27);
    star(ctx,x,y,size*.55,4,angle+.45,c[2],.24);
  }
  function crescent(ctx,x,y,r,c,angle=0) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(r*.55,-r);ctx.bezierCurveTo(-r*.95,-r*.76,-r*1.08,r*.65,r*.37,r);
    ctx.bezierCurveTo(-r*.13,r*.34,-r*.17,-r*.37,r*.55,-r);ctx.fillStyle=c[1];ctx.fill();
    path(ctx,[[r*.5,-r],[-r*.18,-r*.53],[-r*.36,.02*r]],c[2],1.5);ctx.restore();
  }
  function heart(ctx,x,y,r,c){
    ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,r);
    ctx.bezierCurveTo(-r*1.85,-r*.05,-r*.72,-r*1.45,0,-r*.49);
    ctx.bezierCurveTo(r*.78,-r*1.48,r*1.85,0,0,r);ctx.fillStyle=c[1];ctx.fill();ctx.strokeStyle=c[0];ctx.lineWidth=1.5;ctx.stroke();
    path(ctx,[[-r*.59,-r*.36],[-r*.37,-r*.48]],c[2],1.4);ctx.restore();
  }
  function claw(ctx,x,y,r,c,a=0){
    ctx.save();ctx.translate(x,y);ctx.rotate(a);
    polygon(ctx,[[-r,.68*r],[-r*.92,-r*.24],[-r*.76,-r*.7],[-r*.33,-r],[r*.18,-r*.8],[-r*.35,-r*.19],[r*.31,-r*.39],[r*.96,-r*.87],[r*.78,r*.14],[r*.27,r*.58],[-r*.32,r*.75]],c[0]);
    path(ctx,[[-r*.65,r*.40],[-r*.64,-r*.28],[-r*.37,-r*.69]],c[1],r*.26);
    path(ctx,[[-r*.30,r*.45],[r*.40,r*.19],[r*.72,-r*.37]],c[2],r*.17);ctx.restore();
  }
  function fist(ctx,x,y,r,angle,c) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    polygon(ctx,[[-r,-r*.12],[-r*.63,-r*.22],[-r*.55,-r*.73],[r*.15,-r*.73],[r*.18,-r],[r*.56,-r],[r*.59,-r*.69],[r*.93,-r*.54],[r*.98,.22*r],[r*.53,.61*r],[-r*.1,.64*r],[-r*.54,.38*r],[-r,.43*r]],c[0]);
    polygon(ctx,[[-r*.48,-r*.43],[r*.5,-r*.53],[r*.75,-r*.32],[r*.69,r*.18],[r*.32,r*.4],[-r*.41,r*.21]],c[1]);
    for(const i of [-.23,.08,.39])path(ctx,[[i*r,-r*.45],[i*r,-r*.07]],c[2],1.25);
    ctx.restore();
  }
  function bolt(ctx,x1,y1,x2,y2,spread,phase,c) {
    const dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy)||1,points=[];
    for(let i=0;i<=8;i++){
      const u=i/8,off=Math.sin(i*2.23+phase)*spread*Math.sin(Math.PI*u);
      points.push([x1+u*dx-off*dy/length,y1+u*dy+off*dx/length]);
    }outline(ctx,points,c,2.9);
  }
  function cog(ctx,x,y,r,a,c){
    const teeth=[];for(let i=0;i<32;i++){const t=a+i*turn/32,d=r*(i%4===1||i%4===2?1:.78);teeth.push([x+Math.cos(t)*d,y+Math.sin(t)*d]);}
    polygon(ctx,teeth,c[0]);ring(ctx,x,y,r*.61,r*.61,c[1],r*.23);disc(ctx,x,y,r*.2,c[2]);
  }
  function blade(ctx,r,w,c,serrated=false){
    const pts=serrated?[[0,0],[-w,-r*.24],[-w*.54,-r*.4],[-w*.9,-r*.46],[-w*.18,-r*.64],[-w*.64,-r*.66],[w*.57,-r],[w*.78,-r*.36],[w*.53,-r*.1]]:
      [[0,0],[-w,-r*.23],[-w*.60,-r*.68],[w*.48,-r],[w*.76,-r*.35],[w*.39,-r*.08]];
    polygon(ctx,pts,c[0]);polygon(ctx,[[0,-2],[-w*.42,-r*.31],[w*.46,-r*.91],[w*.43,-r*.34]],c[1]);
    path(ctx,[[0,-2],[w*.46,-r*.91]],c[2],1.4);outline(ctx,[[-w*1.1,0],[w*.9,0]],c,2.1);
    path(ctx,[[0,1],[0,7]],c[0],3.5);
  }
  function edgeWeapon(ctx,e,age,c) {
    const p=beat(e,age,.28),s=Math.sin(p*Math.PI),a=-.96+1.9*p,x=-8+13*p;
    switch(e.move) {
      case 'Gigaton Hammer':
        ctx.save();ctx.translate(4,10);ctx.rotate(-1.13+1.65*p);
        outline(ctx,[[0,3],[0,-18]],c,3.2);
        polygon(ctx,[[-16,-27],[9,-28],[15,-22],[12,-12],[-13,-13],[-18,-18]],c[0]);
        polygon(ctx,[[-14,-25],[8,-25],[11,-21],[-14,-19]],c[1]);path(ctx,[[9,-25],[12,-21],[10,-15]],c[2],2);ctx.restore();
        if(p>.45)radial(ctx,4,0,7,7,12+8*s,.2,c);break;
      case 'Stone Axe':
        ctx.save();ctx.translate(x,8);ctx.rotate(a);path(ctx,[[0,4],[0,-21]],'#875943',4.5);
        polygon(ctx,[[-3,-23],[8,-25],[17,-18],[10,-10],[0,-13],[-4,-17]],c[0]);
        polygon(ctx,[[7,-24],[14,-18],[9,-12],[6,-16]],c[2]);ctx.restore();
        arc(ctx,0,0,14+3*s,.78,-2.8,1.1+1.5*p,c[1]);break;
      case 'Mighty Cleave':
        ctx.save();ctx.translate(x+2,8);ctx.rotate(a);blade(ctx,33,8,c,true);ctx.restore();
        for(let i=0;i<4;i++)crystal(ctx,-9+i*6,-1+Math.sin(i*2)*5-7*s,2,4,c,a+i);break;
      case 'Behemoth Blade':
        arc(ctx,0,0,18+8*s,.58,-2.9,1+p*2.7,'#77d9ff',2.4);
        ctx.save();ctx.translate(x,8);ctx.rotate(a+.21);blade(ctx,38,7,['#345982','#88d9ff','#fff2a0']);ctx.restore();
        star(ctx,x+8,-11,4.2,4,a,c[2]);break;
      case 'Bitter Blade':
        ctx.save();ctx.translate(x,5);ctx.rotate(a);blade(ctx,30,6.5,['#713557','#c583e3','#fff0cb']);
        for(let i=0;i<4;i++)flame(ctx,-4,-7-i*5,2.7+i*.3,c,-.3);ctx.restore();
        for(let i=0;i<3;i++)disc(ctx,-17*p-i*3,-8+Math.sin(p*5+i)*3,1.9,'#f7a984');break;
      case 'Aqua Cutter':
        crescent(ctx,-6+13*p,-4,15+6*s,c,a+.75);
        for(let i=0;i<5;i++)disc(ctx,-12+i*5,-9+Math.sin(p*4+i)*7,1.6+i%2,c[i%2+1]);break;
      case 'Psyblade':
        ctx.save();ctx.translate(x,9);ctx.rotate(.52+p*.82);
        blade(ctx,36,6,c);path(ctx,[[-7,-4],[-7,-16],[-3,-26]],'#a0eafb',1.8);ctx.restore();
        for(let i=0;i<3;i++)star(ctx,x-7+i*6,2-i*6-4*s,2+i*.5,4,a,c[2]);break;
      case 'Sunsteel Strike':
        ring(ctx,0,-5,10+9*s,10+9*s,c[1],2);radial(ctx,0,-5,10,11+6*s,16+9*s,p*.62,amber,2.5);
        flash(ctx,-7+14*p,-5,10+5*s,amber,p*.4);break;
    }
  }
  function machinery(ctx,e,age,c){
    const i=e.strikeIndex??0,p=beat(e,age,.24);if(!p)return;
    const s=Math.sin(p*Math.PI),x=-9+14*p;
    switch(e.move){
      case 'Behemoth Bash':
        ctx.save();ctx.translate(x,-3);ctx.rotate(-.16+.22*p);
        polygon(ctx,[[-13,-11],[-5,-10],[0,-17],[5,-10],[15,-12],[14,2],[8,10],[0,15],[-9,9],[-14,2]],'#425987');
        polygon(ctx,[[-10,-8],[-3,-7],[0,-12],[4,-7],[11,-8],[10,2],[0,11],[-9,4]],'#e8bb68');
        polygon(ctx,[[-6,-5],[0,-6],[6,-4],[5,2],[0,7],[-5,1]],'#728dbe');
        path(ctx,[[0,-8],[0,9]],'#fff1bc',1.8);ctx.restore();
        arc(ctx,x+4,-2,12+6*s,1,-1.15,2.4,c[2]);break;
      case 'Gear Grind':
        cog(ctx,-10+5*p,-6+i*3,10,age*11+i,c);cog(ctx,10-5*p,5-i*3,9,-age*11+i+.34,c);
        flash(ctx,i?4:-3,-1,4+3*s,amber,i);break;
      case 'Spin Out':
        ring(ctx,x,-3,12,8,c[0],5,-.23);
        for(let k=0;k<5;k++){const a=k*turn/5+p*5;path(ctx,[[x,-3],[x+Math.cos(a)*10,-3+Math.sin(a)*6]],c[1],1.9);}
        for(let k=0;k<3;k++)path(ctx,[[x-3,4+k*3],[x-8-14*p,6+k*3]],k%2?c[0]:'#a5a9b4',2);break;
      case 'Meteor Mash':
        for(let k=0;k<3;k++)path(ctx,[[x-20-k*3,-24+k*4],[x-5,-8+k*3]],amber[1+k%2],2.1);
        star(ctx,x,-6,13,5,p*1.4,amber[1]);fist(ctx,x+2,-5,9,.61,c);break;
      case 'Metal Burst':
        for(let k=0;k<10;k++){const a=k*turn/10,d=5+p*18;crystal(ctx,Math.cos(a)*d,Math.sin(a)*d*.73,2.4+k%2,5+k%3,c,a+.3);}
        flash(ctx,0,-1,9*s+3,c,p*.75);break;
      case 'Mirror Coat':
        ctx.save();ctx.translate(x,-2);ctx.rotate(.12-.27*p);
        polygon(ctx,[[-10,-13],[6,-16],[13,-8],[11,10],[-4,15],[-12,7]],'#70518a');
        polygon(ctx,[[-7,-10],[5,-13],[10,-6],[8,8],[-3,11],[-8,6]],'#bce5f0');
        path(ctx,[[-7,3],[4,-9]],'#fff4fd',2.8);ctx.restore();
        for(let k=0;k<3;k++)star(ctx,x+11+5*k*p,-7+k*5,2.7+k*.4,4,p,c[2]);break;
    }
  }
  function jaws(ctx,e,age,c){
    const p=beat(e,age,.25),s=Math.sin(p*Math.PI),gap=3+11*(1-p)+2*s;
    switch(e.move){
      case 'Bolt Beak': case 'Beak Blast':{
        const electric=e.move==='Bolt Beak',x=-8+17*p;
        if(electric)bolt(ctx,x-14,-11,x+6,2,5,age*14,c);
        else for(let k=0;k<4;k++)flame(ctx,x-9-k*3,-2+Math.sin(k+p*6)*4,4+k*.4,c,-.88);
        polygon(ctx,[[x-7,-8],[x+14,-1],[x-6,1]],c[1]);polygon(ctx,[[x-5,2],[x+12,0],[x-4,7]],c[0]);
        path(ctx,[[x-6,-8],[x+13,-1]],c[2],1.6);
        if(p>.58)flash(ctx,x+12,0,5+s*3,electric?c:amber);break;
      }
      case 'Clamp':
        for(const side of [-1,1]){
          ctx.save();ctx.scale(1,side);ctx.translate(0,-gap*.56);
          ctx.beginPath();ctx.moveTo(-12,0);ctx.bezierCurveTo(-15,-13,-1,-16,10,-9);ctx.lineTo(14,0);ctx.closePath();
          ctx.fillStyle='#987b9f';ctx.fill();for(let k=-2;k<=2;k++)path(ctx,[[k*2,-1],[k*4.9,-7+Math.abs(k)]],c[2],1.25);ctx.restore();
        }disc(ctx,0,0,3.1,'#ffead3');break;
      case 'Crabhammer':
        ctx.save();ctx.translate(-5+9*p,-7+6*p);ctx.rotate(-.8+1.4*p);
        path(ctx,[[-15,13],[-6,6],[0,0]],'#8e493d',5);claw(ctx,0,0,14,['#99473f','#ed7a53','#ffd69a']);ctx.restore();
        arc(ctx,1,4,12+6*s,.46,.12,2.8,c[1],2.6);break;
      case 'Guillotine':
        for(const side of [-1,1]){ctx.save();ctx.translate(side*(7+9*(1-p)),-1);ctx.scale(side,1);
          claw(ctx,0,0,12,c,-1.04);ctx.restore();}
        if(p>.64)flash(ctx,0,-2,7*s+3,c,.75);break;
      case 'Snap Trap':
        for(const side of [-1,1]){
          ctx.save();ctx.translate(side*gap*.75,0);ctx.scale(side,1);ctx.rotate(.42*(1-p));
          leaf(ctx,5,1,12,-1.12,c);
          for(let k=0;k<4;k++)polygon(ctx,[[0,-7+k*5],[-4,-6+k*5],[1,-3+k*5]],'#f9efbc');
          ctx.restore();
        }break;
      case 'Hyper Fang': case 'Jaw Lock': case 'Fishious Rend':{
        const locked=e.move==='Jaw Lock',fish=e.move==='Fishious Rend';
        for(const side of [-1,1]){
          ctx.save();ctx.scale(1,side);ctx.translate(0,-gap);
          path(ctx,[[-14,2],[-8,-3],[0,-5],[9,-3],[15,2]],c[0],3.3);
          for(const k of [-1,0,1]){const x=k*9,h=fish?8+k:locked?5:Math.abs(k)*6+4;
            polygon(ctx,[[x-3,-1],[x+3,-1],[x+(fish?2:0),h]],c[2]);}ctx.restore();
        }
        if(fish)for(let k=0;k<4;k++)arc(ctx,-8+k*5,7+k%2*2,3+4*s,.6,.3,2,c[1],1.5);
        if(locked){ring(ctx,8,2,4,6,'#be9bc5',2.4,.7);ring(ctx,13,5,4,5,'#80678b',2,.7);}
        break;
      }
    }
  }
  function boot(ctx,x,y,r,angle,c){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    polygon(ctx,[[-r*.6,-r],[-r*.04,-r],[r*.15,-r*.27],[r*.78,-r*.07],[r,.20*r],[r*.71,.46*r],[-r*.42,.46*r],[-r*.65,.14*r]],c[0]);
    polygon(ctx,[[-r*.41,-r*.85],[-r*.13,-r*.81],[0,0],[r*.68,.09*r],[r*.74,.25*r],[-r*.4,.24*r]],c[1]);
    path(ctx,[[-r*.4,.36*r],[r*.66,.36*r]],c[2],1.4);ctx.restore();
  }
  function blow(ctx,e,age,c){
    const i=e.strikeIndex??0,p=beat(e,age,.19);if(!p)return;
    const s=Math.sin(p*Math.PI),x=-12+19*p,y=(i%3-1)*4;
    switch(e.move){
      case 'Rage Fist':
        for(let k=0;k<3;k++)flame(ctx,x-7-k*4,y+Math.sin(k+p*5)*3,5-k*.7,c,-.91);
        fist(ctx,x,y,12,-.08,c);break;
      case 'Wicked Blow':
        polygon(ctx,[[-22,-8],[-7,-1],[-14,-7],[8,2],[-10,5],[-4,3]],'#a4425a');
        fist(ctx,x,y,11,.14,['#35253d','#b65466','#ffd5b2']);
        if(p>.45)star(ctx,x+8,y,7,4,-.3,c[2],.19);break;
      case 'Feint Attack':
        paw(ctx,-13+3*p,-4,5,['#665b77','#9781a2','#cdbbd6'],.42);
        path(ctx,[[-10,1],[-5,5],[3,4],[11,-2]],c[1],1.7);
        for(let k=0;k<3;k++)path(ctx,[[11+k*2,-8+k*2],[11+k*2-9*p,1+k*2]],c[2],1.45);break;
      case 'Hyperspace Fury':
        ring(ctx,-11,-5,5,12,'#eaa957',3,-.23);ring(ctx,9,4,4,7,'#ffd981',2,.31);
        fist(ctx,x-4,-5,8,-.27,c);fist(ctx,12-7*p,5,6,2.8,c);break;
      case 'Comeuppance':
        for(const side of [-1,1])outline(ctx,[[side*(17-4*p),-9],[side*(6+5*s),0],[side*(17-4*p),9]],c,2.6);
        flash(ctx,0,0,5+6*s,['#673548','#d56578','#ffd7a2'],.79);break;
      case 'Punishment':
        for(let k=0;k<3;k++){const y=-9+k*7;ring(ctx,0,y,16-6*p,3,c[k],2.1,-.28+.09*k);}
        for(const dir of [-1,1])polygon(ctx,[[dir*15,-3],[dir*(12-4*p),0],[dir*15,2]],c[1]);break;
      case 'Karate Chop':
        ctx.save();ctx.translate(x,-3);ctx.rotate(.48+p*.8);
        polygon(ctx,[[-4,-15],[1,-18],[4,-14],[4,-7],[7,-4],[5,10],[-3,12],[-6,6]],c[0]);
        path(ctx,[[-2,-14],[0,-8],[-1,7]],c[2],2.1);ctx.restore();
        outline(ctx,[[x-15,-17],[x+4,6]],c,2);break;
      case 'Sky Uppercut':
        for(let k=0;k<3;k++)arc(ctx,-4,3,8+k*4,1.2,.6,1.8+1.15*p,c[k],1.6);
        fist(ctx,x*.45,11-27*p,10,-1.19,c);break;
      case 'Final Gambit':
        for(let k=0;k<4;k++){const a=k*turn/4+.7;const d=22*(1-p)+5;
          outline(ctx,[[Math.cos(a)*(d+6),Math.sin(a)*(d+6)],[Math.cos(a)*d,Math.sin(a)*d]],c,2.8);}
        flash(ctx,0,0,4+12*s,c,-.37);break;
      case 'Rolling Kick': case 'Triple Kick': case 'Trop Kick':{
        const tropical=e.move==='Trop Kick',rolling=e.move==='Rolling Kick',a=rolling?p*3.5-1.8:i*.6-.65;
        if(tropical){for(let k=0;k<4;k++)leaf(ctx,-12+k*6,-9+Math.sin(k+p*3)*5,4.3,p+k,c);}
        else arc(ctx,0,y,11+(rolling?8:2*i),.72,a-1.9,2.1+p*.6,c[1],2.1);
        boot(ctx,x,y+2-5*s,10+(rolling?1:i),a,c);break;
      }
      case 'Needle Arm':
        fist(ctx,x,y,11,.08,c);
        for(let k=0;k<4;k++)polygon(ctx,[[x-8+k*4,y-4],[x-9+k*4,y-13-k%2*3],[x-5+k*4,y-5]],'#eddc96');break;
      case 'Surging Strikes':
        arc(ctx,x-3,y,11+i*2,.65,-2.7+i*.2,3+p,c[1],3);
        for(let k=0;k<5;k++)disc(ctx,x-8+k*3,y-4-Math.sin(k*.8+p*2)*5,1.4+k%2,c[2]);
        fist(ctx,x+2,y,8.5,.28-i*.2,c);break;
    }
  }
  function paw(ctx,x,y,r,c,angle=0){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    disc(ctx,0,r*.28,r*.61,c[0]);disc(ctx,0,r*.22,r*.41,c[1]);
    for(const k of [-1,0,1]){const a=k*.8;disc(ctx,Math.sin(a)*r*.76,-Math.cos(a)*r*.64,r*.26,c[2]);}
    ctx.restore();
  }
  function scrap(ctx,e,age,c){
    const i=e.strikeIndex??0,p=beat(e,age,.18);if(!p)return;
    const s=Math.sin(p*Math.PI),x=-7+12*p,y=(i%3-1)*4;
    switch(e.move){
      case 'Population Bomb':{
        // Each landed hit sends one mouse through. The first mice have left before the last ones arrive.
        const elapsed=age-i*.038;
        if(elapsed>=.22)return;
        const side=i%2?-1:1,a=i*2.4,r=7+(i%3)*3;
        ctx.save();ctx.globalAlpha*=1-ease((elapsed-.135)/.085);
        ctx.translate(Math.cos(a)*r+side*(-13+26*p),Math.sin(a)*r*.8-1.8*Math.sin(Math.PI*p));ctx.scale(side,1);
        path(ctx,[[-4,1],[-8,0],[-10,-3]],'#987d92',1.4);
        disc(ctx,0,0,4.6,'#6d6675');disc(ctx,0,0,3.6,'#f5ece3');
        disc(ctx,3,-2,3.5,'#f7f5ef');disc(ctx,3,-5,1.8,'#aa8c9d');disc(ctx,5,-2,.9,'#4b495a');ctx.restore();break;
      }
      case 'Double Slap':
        ctx.save();ctx.translate(x+(i%2?-4:4),y);ctx.scale(i%2?-1:1,1);
        paw(ctx,0,0,9,c,.48);for(let k=0;k<3;k++)arc(ctx,-7+k*3,0,7,1.16,2.33,1.72,c[1],1.35);ctx.restore();break;
      case 'Chip Away':
        for(let k=0;k<5;k++)crystal(ctx,-10+5*k+4*p,-2-(k%3)*4-7*s,2+k%2,4,c,k+p);
        outline(ctx,[[-13,-8],[x+4,3]],c,2.9);break;
      case 'Hold Back':
        paw(ctx,x-3,-2,8,c,-.5);path(ctx,[[6,-10],[6,9]],c[1],2.4);
        for(let k=0;k<3;k++)disc(ctx,11,-5+k*5,1.6*s+.5,c[2]);break;
      case 'Flail':
        for(let k=0;k<3;k++){const a=p*5+k*turn/3;arc(ctx,0,0,10+k*3,.78,a,1.8,c[k],2);
          paw(ctx,Math.cos(a)*14,Math.sin(a)*9,4,c,a);}break;
      case 'Head Charge':
        for(const side of [-1,1]){ctx.save();ctx.translate(x,side*5);ctx.scale(1,side);
          polygon(ctx,[[-7,-2],[-4,-7],[1,-11],[8,-12],[4,-7],[2,-3],[-2,1]],'#edd6ab');ctx.restore();}
        for(let k=0;k<4;k++)path(ctx,[[x-19,3*k-5],[x-6,2*k-4]],c[1+k%2],1.6);break;
      case 'Bone Club': case 'Bone Rush':{
        const multi=e.move==='Bone Rush',a=-1.08+1.95*p+(multi?i*.57:0),size=multi?9:14;
        ctx.save();ctx.translate(x,y);ctx.rotate(a);
        outline(ctx,[[0,-size],[0,size*.65]],['#916f54','#e6c8a0','#fff3d2'],4);
        for(const t of [-1,1]){const pos=t<0?-size:size*.65;for(const side of [-1,1])disc(ctx,side*2.9,pos+t,3.5,'#f3dec1');}
        ctx.restore();arc(ctx,0,y,size+4,.75,a-2,1.8,c[1],2);break;
      }
    }
  }
  function apple(ctx,x,y,r,c){
    ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,-r*.55);
    ctx.bezierCurveTo(-r*1.15,-r*1.17,-r*1.2,r*.25,-r*.37,r*.84);
    ctx.quadraticCurveTo(-r*.15,r,.06*r,r*.7);ctx.bezierCurveTo(r*.88,r*1.13,r*1.50,-r*.98,0,-r*.55);
    ctx.fillStyle=c[1];ctx.fill();ctx.strokeStyle=c[0];ctx.lineWidth=1.5;ctx.stroke();
    path(ctx,[[0,-r*.56],[r*.15,-r*1.1]],'#705741',1.8);leaf(ctx,r*.39,-r*.98,r*.31,-.35,green);
    disc(ctx,-r*.39,-r*.25,r*.17,c[2]);ctx.restore();
  }
  function blossom(ctx,x,y,r,c,angle){
    for(let i=0;i<5;i++){const a=i*turn/5+angle;disc(ctx,x+Math.cos(a)*r*.61,y+Math.sin(a)*r*.61,r*.43,c[1]);}
    disc(ctx,x,y,r*.33,c[0]);disc(ctx,x-.4,y-.5,r*.15,c[2]);
  }
  function garden(ctx,e,age,c){
    const p=beat(e,age,.29),s=Math.sin(p*Math.PI);
    switch(e.move){
      case 'Drum Beating':
        polygon(ctx,[[-10,-2],[-9,8],[5,11],[11,5],[11,-3]],'#895a42');ring(ctx,0,-2,11,5,'#f0c887',2.8);
        for(const dir of [-1,1]){
          outline(ctx,[[dir*16,-18+6*p],[dir*5,-4-7*s]],['#724d36','#d1a964','#fff2af'],2.3);
          path(ctx,[[dir*5,9],[dir*10,7],[dir*15,10],[dir*(17+7*p),6]],c[1],2.2);
        }break;
      case 'Grav Apple':
        for(let i=0;i<3;i++)path(ctx,[[-6+i*5,-24],[-6+i*5,-14+9*p]],c[i],1.5);
        apple(ctx,0,-22+26*p,8.3,['#914643','#e97365','#ffdc94']);
        if(p>.61)ring(ctx,0,7,3+12*p,3,c[1],1.7);break;
      case 'Flower Trick':
        for(let k=0;k<3;k++)leaf(ctx,-7+k*6,-8+5*p,5,k+.7,green);
        blossom(ctx,0,-18+18*p,8.5,['#d5a64e','#f8b2cc','#fff2c0'],p);
        for(let k=0;k<7;k++){const a=k*turn/7+p*.72,d=4+p*15;
          leaf(ctx,Math.cos(a)*d,Math.sin(a)*d*.70-3,3+k%2,a+.7,palettes.mist);}break;
      case 'Leaf Tornado':
        for(let k=0;k<3;k++)arc(ctx,0,7-k*7,6+5*k,.31,age*11+k*2,4.5,c[k],1.65);
        for(let k=0;k<9;k++){const u=k/9,a=age*12+u*turn*2;leaf(ctx,Math.cos(a)*(4+u*14),8-u*23+Math.sin(a)*2,3+u*2,a,c);}break;
      case 'Attack Order':
        for(let k=0;k<4;k++){
          const a=k*turn/4+p*2,r=18-9*p,x=Math.cos(a)*r,y=Math.sin(a)*r*.70;
          ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI);
          disc(ctx,-2,-3,2.4,'#e5faf7');disc(ctx,1,-3,2,'#d8e7ff');
          polygon(ctx,[[-6,-1],[-3,-3],[2,-3],[5,0],[2,3],[-3,2]],'#44343d');
          path(ctx,[[-2,-2],[-2,2]],'#ffda5d',2);path(ctx,[[1,-2],[1,2]],'#ffcb49',1.7);ctx.restore();
        }
        star(ctx,0,0,4+3*s,6,p,'#ffe69a',.78);break;
    }
  }
  function ghost(ctx,x,y,r,c,a){
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.moveTo(-r,r*.51);
    ctx.bezierCurveTo(-r*1.15,-r*1.53,r*.99,-r*1.43,r*.95,-r*.02);ctx.lineTo(r,r*.7);
    ctx.lineTo(r*.41,r*.32);ctx.lineTo(0,r*.79);ctx.lineTo(-r*.45,r*.29);ctx.closePath();ctx.fillStyle=c[1];ctx.fill();
    disc(ctx,-r*.31,-r*.19,Math.max(1,r*.14),c[0]);disc(ctx,r*.25,-r*.19,Math.max(1,r*.14),c[0]);ctx.restore();
  }
  function apparition(ctx,e,age,c){
    const i=e.strikeIndex??0,p=beat(e,age,.27);if(!p)return;
    const s=Math.sin(p*Math.PI);
    switch(e.move){
      case 'Bitter Malice':
        for(let k=0;k<6;k++){const a=k*turn/6+p*.25,r=17-10*p;
          crystal(ctx,Math.cos(a)*r,Math.sin(a)*r*.8-4,2.4,5.8,['#56527c','#9fb7dd','#e6edff'],a+.4);}
        flame(ctx,0,-3,7+2*s,c,.2);break;
      case 'Last Respects':
        for(let k=0;k<3;k++){const u=clamp(p*1.28-k*.14),x=-12+k*11;
          arc(ctx,x,6,5,.32,0,turn,c[0],1.8);ghost(ctx,x+Math.sin(u*4+k)*2,3-u*(11+k*2),4+k*.74,c,-.18+k*.14);}break;
      case 'Heart Stamp':
        heart(ctx,0,-14+16*p,11+3*s,['#a25683','#f78bae','#ffe7c7']);
        if(p>.45){ring(ctx,0,5,7+10*p,3.8,c[1],1.7);for(const d of [-1,1])heart(ctx,d*(9+5*p),-5-5*p,3.1,c);}break;
      case 'Revelation Dance':
        for(let k=0;k<6;k++){const a=k*turn/6+p*2,r=14+3*s;
          const fc=['#635975',rainbow[k],'#fff4d5'];leaf(ctx,Math.cos(a)*r,Math.sin(a)*r*.72-4,6.4,a+.6,fc);}
        star(ctx,0,-4,4+3*s,4,p*2,'#fffbd8');break;
      case 'Floaty Fall':
        for(const k of [-1,1]){
          const y=-17+9*p,x=k*(7+2*s);
          ctx.beginPath();ctx.ellipse(x,y,4.8,6.4,k*.2,0,turn);ctx.fillStyle=k<0?'#ef8da1':'#addcf1';ctx.fill();
          path(ctx,[[x,y+6],[k*3,-4+9*p]],c[1],1.2);
        }paw(ctx,0,-8+16*p,6.5,palettes.gold,.10);if(p>.61)arc(ctx,0,9,12,.35,.2,2.7,c[2],2);break;
      case 'Mountain Gale':
        for(let k=0;k<4;k++){
          const x=-18+(k*9+23*p)%36,y=-10+k*5;
          path(ctx,[[x-9,y+2],[x-4,y-1],[x+4,y-2]],c[1+k%2],1.8);
          crystal(ctx,x+4,y-2,2+k%2,5+k%3,c,.96);
        }break;
      case 'Triple Dive':{
        const x=(i-1)*7;
        arc(ctx,x-4,-3,8+3*p,1.05,Math.PI,2.9*p+.1,c[1],2.6);
        for(let k=0;k<5;k++){const a=-2.7+k*.56,rr=4+10*s;disc(ctx,x+Math.cos(a)*rr,3+Math.sin(a)*rr,1.7+k%2,c[1+k%2]);}
        ring(ctx,x,4,3+11*p,2.1+2*p,c[2],1.7);break;
      }
    }
  }
  function binding(ctx,e,age,c,length){
    const p=beat(e,age,.27),s=Math.sin(p*Math.PI);
    if(e.move==='Anchor Shot'){
      const x=length*p;
      for(let d=3;d<x-4;d+=7)ring(ctx,d,Math.sin(d*.09)*2*s,4.1,1.9,c[1],1.7,(Math.floor(d/7)%2)*.62);
      ctx.save();ctx.translate(x,0);ctx.rotate(Math.PI/2-.24*s);
      ring(ctx,0,-8,2.2,2.2,c[2],1.6);outline(ctx,[[0,-5],[0,7]],c,2.3);
      outline(ctx,[[-7,2],[-5,6],[0,9],[6,6],[8,1]],c,2.2);ctx.restore();
    }else if(e.move==='Spirit Shackle'){
      const x=length*p;
      path(ctx,[[length*.09,1],[x*.45,-4*s],[x,0]],c[1],2);
      polygon(ctx,[[x+5,0],[x-6,-3],[x-3,0],[x-6,3]],c[2]);
      for(let k=0;k<3;k++)flame(ctx,x-9-k*5,-1+k%2*3,2.5,c,-1.3);
      if(p>.6)ring(ctx,length,2,4+5*s,3,c[1],2.1);
    }else if(e.move==='Constrict'){
      for(let k=0;k<3;k++){const y=-7+k*7;
        arc(ctx,0,y,16-6*p,.32,-1.1+k,5.45,c[0],3.4);arc(ctx,0,y,16-6*p,.32,-.9+k,3.1,c[1],1.5);}
      leaf(ctx,11-4*p,-8,4,-.88,c);
    }else{
      for(const d of [-1,1]){const pts=[];for(let k=0;k<=16;k++){const u=k/16;pts.push([d*Math.cos(u*turn+p*2)*(12-4*s),-13+26*u]);}
        outline(ctx,pts,c,2.2);}
      radial(ctx,0,0,6,11,16+2*s,p,c,1.4);
    }
  }
  function wheel(ctx,e,age,c,length){
    const p=beat(e,age,.24),x=length*p,r=8+2*Math.sin(p*Math.PI),phase=age*13;
    for(const side of [-1,1])path(ctx,[[Math.max(0,x-21),side*(r*.6)],[x-2,side*(r*.43)]],c[1],1.6);
    ring(ctx,x,0,r,r,c[0],3.9);ring(ctx,x,0,r*.64,r*.64,c[1],1.9);
    for(let k=0;k<5;k++){const a=k*turn/5+phase;path(ctx,[[x,0],[x+Math.cos(a)*r*.70,Math.sin(a)*r*.70]],c[2],1.25);}
    switch(e.move){
      case 'Blazing Torque':for(let k=0;k<3;k++)flame(ctx,x-r-k*4,2*Math.sin(k+phase),5-k*.65,c,-1.15);break;
      case 'Combat Torque':fist(ctx,x+3,-1,6.3,.04,c);for(const d of [-1,1])path(ctx,[[x-r-7,d*7],[x-r-2,d*4],[x-r-7,d*2]],c[2],1.75);break;
      case 'Magical Torque':for(let k=0;k<4;k++){const a=k*turn/4+phase;star(ctx,x+Math.cos(a)*(r+3),Math.sin(a)*(r+3),3,4,a,c[1+k%2]);}break;
      case 'Noxious Torque':for(let k=0;k<4;k++){const y=(k%2?1:-1)*(4+k);disc(ctx,x-r-k*3,y,2+k%3,c[1]);ring(ctx,x-r-k*3,y,2+k%3,2+k%3,c[2],.8);}break;
      case 'Wicked Torque':crescent(ctx,x-2,-1,6,c,phase*.32);for(const d of [-1,1])polygon(ctx,[[x-4,d*r],[x-10,d*(r+6)],[x+3,d*r]],c[1]);break;
      case 'Aura Wheel':for(let k=0;k<3;k++){const a=k*turn/3+phase*.5;bolt(ctx,x+Math.cos(a)*r,Math.sin(a)*r,x+Math.cos(a+.8)*(r+5),Math.sin(a+.8)*(r+5),3,a,c);}break;
    }
  }
  function snowflake(ctx,x,y,r,c,a){
    for(let k=0;k<6;k++){const d=a+k*turn/6,cs=Math.cos(d),sn=Math.sin(d);
      path(ctx,[[x,y],[x+cs*r,y+sn*r]],c[1+k%2],1.55);
      for(const side of [-1,1])path(ctx,[[x+cs*r*.6,y+sn*r*.6],[x+cs*r*.72-sn*r*.20*side,y+sn*r*.72+cs*r*.20*side]],c[2],1.15);}
  }
  function partner(ctx,e,age,c,length){
    const p=beat(e,age,.27),s=Math.sin(p*Math.PI),x=length*p;
    switch(e.move){
      case 'Baddy Bad':
        for(const side of [-1,1]){ctx.save();ctx.translate(x,-2);ctx.scale(side,1);
          polygon(ctx,[[0,0],[3,-6],[10,-9-4*s],[9,-2],[14,0],[8,1],[6,5],[3,3],[0,7]],c[0]);
          path(ctx,[[1,3],[5,-2],[10,-8-4*s]],c[1],1.8);ctx.restore();}
        crescent(ctx,x-11,0,4,c,.7);break;
      case 'Bouncy Bubble':{
        const y=-Math.abs(Math.sin(p*Math.PI*2))*12,r=6+2*s;
        for(let k=0;k<3;k++){const u=Math.max(0,p-.11*k),rr=r-k*1.7,bx=length*u,by=-Math.abs(Math.sin(u*Math.PI*2))*12;
          ring(ctx,bx,by,rr,rr,c[1],1.7);disc(ctx,bx-rr*.35,by-rr*.33,1.4,c[2]);}
        if(y>-3)ring(ctx,x,4,5+7*p,2,c[2],1.3);break;
      }
      case 'Glitzy Glow':
        crystal(ctx,x,-3,6,12,c,p*.65);for(let k=0;k<4;k++){const a=k*turn/4+age*4;star(ctx,x+Math.cos(a)*11,-3+Math.sin(a)*8,3.5,4,a,c[2]);}
        path(ctx,[[Math.max(0,x-17),-4],[x-6,-3]],c[1],2.3);break;
      case 'Sappy Seed':
        leaf(ctx,x,-11*s,6.3,-.75+p*2,c);if(p>.43){
          const h=12*p;outline(ctx,[[length,3],[length-3,-h*.45],[length+1,-h]],c,1.9);
          leaf(ctx,length-4,-h*.58,4.5,-2.6,c);leaf(ctx,length+4,-h*.8,4,.2,c);}
        break;
      case 'Freezy Frost':
        for(let k=0;k<4;k++){const u=Math.max(0,p-.095*k);snowflake(ctx,length*u,Math.sin(u*5+k)*4,6.5-k*.88,c,age*4+k*.5);}break;
      case 'Sparkly Swirl':
        for(let k=0;k<2;k++){const pts=[];for(let j=0;j<=16;j++){const u=p*j/16;pts.push([length*u,Math.sin(u*turn*1.4+k*Math.PI)*(2+u*6)]);}
          path(ctx,pts,k?'#aaeff3':c[1],2.2);}
        star(ctx,x,-1,6.3,5,age*4,c[2]);break;
      case 'Veevee Volley':
        ctx.save();ctx.translate(x,-8*s);
        for(const dir of [-1,1]){polygon(ctx,[[dir*1,-2],[dir*6,-13],[dir*8,-11],[dir*5,-2]],'#b88955');}
        paw(ctx,0,1,7,['#986446','#dca96b','#fff0c7']);heart(ctx,-10,4,3.4,palettes.mist);ctx.restore();break;
      case 'Pika Papow':
        bolt(ctx,Math.max(0,x-28),0,x,0,6,age*16,c);
        polygon(ctx,[[x-3,-2],[x-8,-8],[x-3,-8],[x-9,-14],[x+4,-10],[x+1,-6],[x+6,-4],[x+2,1]],c[1]);
        flash(ctx,x,0,5+2*s,c);break;
      case 'Zippy Zap':
        for(const d of [-1,1])outline(ctx,[[x-17,d*2],[x-8,d*6],[x-9,d*2],[x+3,0]],c,1.7);
        star(ctx,x+2,0,6,4,.68,c[2],.19);break;
    }
  }
  function dart(ctx,x,y,size,c,angle){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    polygon(ctx,[[size,0],[-size*.43,-size*.35],[-size,-size*.70],[-size*.74,0],[-size,size*.62],[-size*.38,size*.31]],c[0]);
    path(ctx,[[-size*.66,.5],[size*.82,0]],c[2],1.45);ctx.restore();
  }
  function projectile(ctx,e,age,c,length){
    const i=e.strikeIndex??0,p=beat(e,age,.23);if(!p)return;
    const s=Math.sin(p*Math.PI),x=length*p,offset=(i%3-1)*4*s;
    switch(e.move){
      case 'Dragon Darts':{
        const y=(i%2?1:-1)*8*s;
        path(ctx,[[x-20,y+3],[x-13,y-1],[x-5,y]],'#6cbac0',2.1);
        ctx.save();ctx.translate(x,y);ctx.rotate((i%2?1:-1)*.22*s);
        polygon(ctx,[[-11,0],[-3,-2],[-8,-7],[0,-5],[8,-3],[12,0],[5,3],[-2,2],[-7,5]],'#3a787b');
        polygon(ctx,[[-6,-6],[1,-4],[5,-2],[-1,-2]],'#b1d6bf');disc(ctx,6,-1,1.5,'#ff9a88');ctx.restore();break;
      }
      case 'Water Shuriken':
        ctx.save();ctx.translate(x,offset);ctx.rotate(age*18+i*.7);
        for(let k=0;k<4;k++){ctx.rotate(turn/4);polygon(ctx,[[0,0],[3,-3],[10,-2],[5,3],[0,3]],c[1]);path(ctx,[[4,1],[9,-2]],c[2],1.3);}
        disc(ctx,0,0,2.5,c[0]);ctx.restore();
        for(let k=0;k<3;k++)disc(ctx,x-8-k*4,offset+(k%2?2:-2),1.8-k*.35,c[2]);break;
      case 'Snipe Shot':
        path(ctx,[[Math.max(0,x-29),0],[x,0]],c[1],2.9);path(ctx,[[Math.max(0,x-16),0],[x+3,0]],c[2],1.1);
        for(let k=0;k<4;k++)arc(ctx,length,0,6+3*(1-p),1,k*turn/4+.21,.82,c[1],1.4);
        disc(ctx,x,0,2.8,c[2]);break;
      case 'Barb Barrage':
        for(let k=0;k<3;k++){const u=clamp(p-.08*k),y=(k-1)*5;
          dart(ctx,length*u,y,6,c,.08*(k-1));for(let j=0;j<2;j++)path(ctx,[[length*u-j*3,y],[length*u-j*3-3,y-3]],c[1],1.4);}
        break;
      case 'Spike Cannon':
        outline(ctx,[[Math.max(0,x-16),offset],[x,offset]],c,1.5);dart(ctx,x,offset,9+i%2,c,.1*(i%3-1));break;
      case 'Barrage':{
        const y=-s*(9+(i%3)*3)+offset;
        ctx.save();ctx.translate(x,y);ctx.rotate(p*2+i);
        ctx.beginPath();ctx.ellipse(0,0,4.3,6,0,0,turn);ctx.fillStyle='#eacba5';ctx.fill();ctx.strokeStyle='#9f745c';ctx.lineWidth=1.4;ctx.stroke();
        disc(ctx,-1.3,-2,1.2,'#fff2cf');ctx.restore();break;
      }
      case 'Spit Up':
        for(let k=0;k<4;k++){const u=clamp(p-.07*k),r=6.3-k*1.1;disc(ctx,length*u,Math.sin(u*4+k)*3,r,k%2?'#c4ab7c':'#daccaa');}
        arc(ctx,x,0,7,.85,-1.3,2,c[2],1.5);break;
      case 'Present':{
        ctx.save();ctx.translate(x,-s*12);ctx.rotate(-.35+.62*p);
        ctx.fillStyle='#cf6379';ctx.fillRect(-7,-3,14,10);ctx.fillStyle='#f5d48d';ctx.fillRect(-1.4,-3,2.8,10);
        const h=p>.64?7*ease((p-.64)/.36):0;
        ctx.fillStyle='#a54363';ctx.fillRect(-8,-5-h,16,3.8);ring(ctx,-2.2,-6.7-h,2.7,1.8,'#fff3b5',1.4,-.38);ring(ctx,2.2,-6.7-h,2.7,1.8,'#fff3b5',1.4,.38);
        if(h>0)star(ctx,0,-4,3.7,4,age*3,'#fff2bc');ctx.restore();break;
      }
      case 'Trump Card':
        ctx.save();ctx.translate(x,-6*s);ctx.rotate(-.8+2.1*p);
        ctx.fillStyle=c[0];ctx.fillRect(-6,-9,12,18);ctx.fillStyle='#fff2d4';ctx.fillRect(-5,-8,10,16);
        polygon(ctx,[[0,-4],[3,0],[0,4],[-3,0]],'#a24d64');disc(ctx,-3,-6,1,'#a24d64');disc(ctx,3,6,1,'#a24d64');ctx.restore();break;
      case 'Mirror Shot':
        for(let k=0;k<3;k++){const u=clamp(p-k*.09);crystal(ctx,length*u,Math.sin(u*6+k)*3,3.7-k*.6,7-k,metal,age*7+k);}
        star(ctx,x,0,4.8,4,.45+p,c[2]);break;
      case 'Order Up':
        ctx.save();ctx.translate(x,-13*s);ctx.rotate(p*.5-.24);
        ctx.fillStyle='#fff0d4';ctx.beginPath();ctx.ellipse(0,2,8,4,0,0,turn);ctx.fill();
        polygon(ctx,[[-8,0],[-6,-4],[3,-5],[8,-3],[7,0],[-4,1]],'#eb987b');
        for(const d of [-1,1])path(ctx,[[d*3-1,-4],[d*3+2,-1]],'#ffe5ba',1.35);
        ctx.restore();for(let k=0;k<2;k++)arc(ctx,x-2+k*4,-10-13*s,2,1.3,-1.9,2.5,c[1],1.2);break;
      case 'Syrup Bomb':
        apple(ctx,x,-12*s,7.7,['#8b6638','#cf9949','#ffe6a5']);
        for(let k=0;k<4;k++){const u=clamp(p-.08*k);disc(ctx,length*u,-11*Math.sin(u*Math.PI)+3+k%2,1.8+k*.35,'#eead49');}
        if(p>.69){for(const d of [-1,1])path(ctx,[[length,3],[length+d*6,4],[length+d*9,8]],'#ecac48',2.5);}break;
    }
  }
  function lightRay(ctx,e,age,c,length){
    const i=e.strikeIndex??0,p=beat(e,age,.23);if(!p)return;
    const s=Math.sin(p*Math.PI),x=length*p;
    switch(e.move){
      case 'Moongeist Beam':
        crescent(ctx,Math.min(9,length*.12),-2,8+2*s,c,-.32);
        polygon(ctx,[[0,-2],[x*.27,-6-s],[x*.76,-4],[x,0],[x*.70,4],[x*.26,6+s],[0,3]],'#453460');
        for(const side of [-1,1])path(ctx,[[0,0],[x*.27,side*(5+s)],[x*.72,side*3],[x,0]],side<0?'#aa88e6':'#829ee6',1.9);
        path(ctx,[[0,0],[x*.56,-.77],[x,0]],'#f3e6ff',2.25);
        crescent(ctx,x,-1,7+3*s,['#63568a','#c5c8ff','#fff5e2'],.28);break;
      case 'Blood Moon':{
        const y=-17*s-5,r=10+5*s;disc(ctx,x,y,r,blood[0]);disc(ctx,x-.7,y-1,r*.83,blood[1]);
        for(const [dx,dy,rr] of [[-.3,-.2,.19],[.2,.2,.17],[.37,-.3,.12]])disc(ctx,x+dx*r,y+dy*r,r*rr,'#aa4e5b');
        if(p>.46)outline(ctx,[[x,y+4],[length,2]],blood,2.6);
        arc(ctx,x,y,r+3,.95,p*3,3.5,blood[2],1.4);break;
      }
      case 'Light of Ruin':
        for(let k=0;k<3;k++){const side=k-1;
          path(ctx,[[0,side*4],[x*.43,side*(4+4*s)],[x,0]],k===1?'#fff7d7':c[1],k===1?3.1:2);}
        blossom(ctx,x,0,5.8+3*s,['#d6a462','#f5c0de','#fff9d7'],age*4);
        for(let k=0;k<3;k++)leaf(ctx,x*(k+.4)/3,Math.sin(k+age*7)*5,2.8,k+p,c);break;
      case 'Lumina Crash':
        for(let k=0;k<5;k++){const y=(k-2)*2.4;
          path(ctx,[[0,y-4],[x*.57,y-7*s],[x,y*.34]],rainbow[k],1.9);}
        for(let k=0;k<3;k++)leaf(ctx,x-4+k*3,-3-2*k,4.1,-1+p+k*.2,[c[0],rainbow[k],c[2]]);break;
      case 'Twin Beam':{
        const side=i%2?1:-1;ring(ctx,2,side*4,2.8,3.9,c[1],1.6);
        outline(ctx,[[2,side*4],[x*.55,side*(6+2*s)],[x,side*2]],c,2.35);
        star(ctx,x,side*2,4.5,4,.5+side*p,c[2]);break;
      }
      case 'Tachyon Cutter':{
        const side=i%2?1:-1;
        polygon(ctx,[[x-18,side*5],[x+5,side*2],[x-3,-side*3],[x-10,-side*2]],'#7dcad9');
        path(ctx,[[Math.max(0,x-23),side*6],[x+5,side*2]],'#efffff',1.6);
        path(ctx,[[Math.max(0,x-10),-side*5],[x+1,-side*2]],'#7ca3df',1.3);break;
      }
    }
  }
  function current(ctx,e,age,c,length){
    const p=beat(e,age,.26),s=Math.sin(p*Math.PI),x=length*p;
    switch(e.move){
      case 'Thunderclap':
        for(let k=0;k<3;k++)disc(ctx,x-5+k*4,-12-(k%2)*2,4.4,c[0]);
        bolt(ctx,x+1,-10,x,4,5,Math.floor(age*18),c);arc(ctx,x,2,6+7*s,.51,0,Math.PI,c[2],1.8);break;
      case 'Double Shock':
        for(const side of [-1,1])bolt(ctx,0,side*4,x,side*3,6,age*20+side*2,c);
        ring(ctx,x,0,4+3*s,7+2*s,c[2],1.45);break;
      case 'Hydro Steam':
        outline(ctx,[[0,2],[x*.47,1-3*s],[x,2]],c,3.5);
        for(let k=0;k<4;k++){const u=clamp(p-k*.10),y=-3-k%2*3;
          arc(ctx,length*u,y-4*s,3.6+k*.5,.78,-2.8+u,4.1,'#e7f6ee',1.65);}break;
      case 'Sonic Boom':
        for(let k=0;k<4;k++){const u=clamp(p-k*.105);if(u>0){
          const r=5+9*u;ctx.beginPath();ctx.ellipse(length*u,0,r*.47,r,0,-1.36,1.36);ctx.strokeStyle=c[k%2+1];ctx.lineWidth=2.2-k*.22;ctx.stroke();
        }}break;
      case 'Torch Song':
        for(let k=0;k<3;k++){const u=clamp(p-.12*k);note(ctx,length*u,-Math.sin(u*turn)*5,4.5-k*.5,c,-.3+u*.35);}
        flame(ctx,x,-4,7+s*2,c,.3);polygon(ctx,[[x+2,-5],[x+10,-7],[x+5,-2]],'#ffe0a0');break;
    }
  }
  function rush(ctx,e,age,c,length){
    const w=e.halfWidth||10,p=beat(e,age,.23),head=p*length;
    ctx.beginPath();ctx.rect(0,-w,length,2*w);ctx.clip();
    const tail=Math.max(0,head-Math.min(72,length*.7)),r=Math.min(w*.80,11);
    switch(e.move){
      case 'Jump Kick':
        for(let k=0;k<3;k++)path(ctx,[[tail,(k-1)*r*.24],[head-r,(k-1)*r*.56-r*.16]],c[k],1.4);
        boot(ctx,head-r*.35,-r*.12,r,.48,c);break;
      case 'Psyshield Bash':
        for(let k=0;k<3;k++){const x=Math.max(0,head-k*7);
          arc(ctx,x-r*.52,0,r*(1-k*.13),1,-1.38,2.76,c[2-k],2.1);}
        polygon(ctx,[[head-r*1.5,-r*.54],[head-r*.38,-r*.54],[head+r*.15,0],[head-r*.4,r*.56],[head-r*1.5,r*.46],[head-r*.72,0]],c[1]);break;
      case 'Raging Bull':
        for(const d of [-1,1]){
          polygon(ctx,[[head-r*1.3,d*r*.25],[head-r,d*r*.62],[head+r*.15,d*r*.90],[head-r*.33,d*r*.42],[head-r*.80,d*r*.16]],'#ffe4ba');
          path(ctx,[[tail,d*r*.60],[head-r*1.35,d*r*.32]],'#c2a082',2.3);}
        disc(ctx,head-r,0,r*.34,c[0]);break;
      case 'Steamroller':
        ring(ctx,head-r,0,r*.8,r*.8,c[0],3);
        for(let k=0;k<6;k++){const a=k*turn/6+age*13;
          path(ctx,[[head-r,0],[head-r+Math.cos(a)*r*.60,Math.sin(a)*r*.60]],c[1],1.7);}
        for(let k=0;k<4;k++)disc(ctx,tail+(head-tail)*k/4,(k%2?1:-1)*r*.48,1.8+k%2,'#cebc88');break;
      case 'Zing Zap':
        bolt(ctx,tail,0,head,0,r*.80,age*15,c);star(ctx,head-r*.3,0,r*.69,4,.72,c[2],.22);break;
    }
  }
  function longRange(ctx,e,age,c,length){
    const w=e.halfWidth||9,p=beat(e,age,.22),x=length*p;
    ctx.beginPath();ctx.rect(0,-w,length,w*2);ctx.clip();
    if(e.move==='Eternabeam'){
      const points=[[],[],[]];
      for(let j=0;j<=48;j++){const u=j/48,span=w*(.29+.22*Math.sin(u*Math.PI));
        for(let k=0;k<3;k++)points[k].push([x*u,Math.sin(u*turn*3.5-age*17+k*turn/3)*span]);}
      polygon(ctx,[[0,-w*.16],[x*.08,-w*.57],[x*.71,-w*.48],[x,-w*.10],[x,w*.10],[x*.71,w*.48],[x*.08,w*.57],[0,w*.16]],'#513765');
      for(let k=0;k<3;k++)path(ctx,points[k],['#e36caa','#8cd6ed','#f5aedc'][k],2.4);
      path(ctx,[[0,0],[x,0]],'#fef1ff',2.15);
      for(let j=1;j<=6;j++){
        const u=j/6,cx=x*u,r=w*(.54+.13*u);
        path(ctx,[[cx-r*.31,0],[cx-r*.13,-r],[cx+r*.13,-r],[cx+r*.31,0],[cx+r*.13,r],[cx-r*.13,r],[cx-r*.31,0]],cosmic[1+j%2],1.45);
      }
    }else{
      const headWidth=Math.min(x,Math.max(19,w*2.1)),base=x-headWidth;
      const shaft=Math.max(0,x-headWidth*2.3);
      polygon(ctx,[[shaft,-w*.07],[base+headWidth*.24,-w*.11],[base+headWidth*.24,w*.11],[shaft,w*.07]],'#77b5d7');
      polygon(ctx,[[x,0],[base,w*.55],[base+headWidth*.20,w*.12],[base,-w*.58]],c[0]);
      polygon(ctx,[[x,0],[base+headWidth*.26,-w*.06],[base,-w*.58]],c[1]);
      polygon(ctx,[[x,0],[base+headWidth*.31,-w*.11],[base+headWidth*.12,-w*.35]],'#bcf3ff');
      for(const side of [-1,1])polygon(ctx,[[base+headWidth*.19,side*w*.11],[base-headWidth*.13,side*w*.36],[base+headWidth*.04,side*w*.02]],'#91d6ec');
      path(ctx,[[shaft,0],[x,0]],c[2],1.8);
      for(let k=0;k<8;k++){const u=(k+.5)/8,d=x*u;crystal(ctx,d,Math.sin(k*2+p*4)*w*.45,1.3+k%2,3+k%2,c,1.2);}
    }
  }
  function downpour(ctx,e,age,c,r){
    const p=ease((age+.022)/.43);
    if(e.move==='Make It Rain'){
      for(let k=0;k<24;k++){
        const a=k*2.4,d=r*(.12+.73*Math.sqrt((k+.4)/24)),x=Math.cos(a)*d,y=Math.sin(a)*d*.72;
        const u=clamp((age+.04-(k%6)*.029)/.24),z=(1-u)*r*.50,rr=2.6+k%3,rx=rr*(.28+.72*Math.abs(Math.cos(u*7+k)));
        if(!u)continue;
        if(u>.86)ring(ctx,x,y+1,rr+3*p,1.7,c[1],1);
        ctx.beginPath();ctx.ellipse(x,y-z,rx,rr,-.22,0,turn);ctx.fillStyle='#d68f29';ctx.fill();ctx.strokeStyle='#fff1a1';ctx.lineWidth=1.15;ctx.stroke();
        path(ctx,[[x-rx*.34,y-z-rr*.45],[x+rx*.16,y-z+rr*.38]],'#fff3a9',1.1);
      }
    }else if(e.move==='Astral Barrage'){
      const remaining=1-p;
      for(let k=0;k<10;k++){
        const a=k*2.4,rho=r*(.23+.54*Math.sqrt((k+.4)/10)),tx=Math.cos(a)*rho,ty=Math.sin(a)*rho*.65;
        const u=ease((age+.025-(k%4)*.035)/.27),x=tx-15*(1-u),y=ty-r*.47*(1-u);
        if(!u)continue;
        path(ctx,[[x-12,y-13-6*remaining],[x-8,y-6],[x,y]],'#b493dc',2.4);
        if(k%3===0){
          ctx.save();ctx.translate(x,y);ctx.rotate(.46);
          polygon(ctx,[[-8,5],[-4,0],[-6,-1],[-3,-4],[-3,-9],[0,-6],[3,-7],[4,-3],[9,0],[7,3],[3,3],[0,6],[-7,8]],'#49315d');
          path(ctx,[[-8,5],[-4,0],[-5,-2],[-2,-4]],'#bf8ce8',2.1);disc(ctx,3,-2,1.2,'#e0f5ff');ctx.restore();
        }else{flame(ctx,x,y,4.6,c,-.69);}
        if(u>.73)ring(ctx,tx,ty,4.5+6.5*p,3.1,c[1],1.45);
      }
    }else{
      for(let k=0;k<14;k++){
        const a=k*turn/14+p*.38,d=r*(.26+.36*p)*(k%2 ? .68 : 1),x=Math.cos(a)*d,y=Math.sin(a)*d*.70;
        ctx.save();ctx.translate(x,y);ctx.rotate(a+1.2);
        polygon(ctx,[[-4,-5],[4,-5],[6,-1],[3,4],[0,7],[-4,4],[-6,0]],k%2?'#738aab':'#bf9d64');
        path(ctx,[[-4,-4],[3,-4],[4,-1]],k%2?'#e4f6ff':'#fff1bc',1.3);ctx.restore();
      }
      for(let k=0;k<3;k++){const rr=r*(.12+p*.54+k*.09);arc(ctx,0,0,rr,.7,k*2+p,2.5,c[1+k%2],1.8);}
    }
  }
  function detonate(ctx,e,age,c,r){
    const p=ease((age+.018)/.40),s=Math.sin(p*Math.PI);
    switch(e.move){
      case 'Armor Cannon':{
        const u=ease((age+.035)/.19),x=-r*.56*(1-u),y=-r*.22*(1-u);
        path(ctx,[[x-r*.21,y-r*.08],[x,y]],'#e6a565',3.1);
        ctx.save();ctx.translate(x,y);ctx.rotate(.34);
        polygon(ctx,[[-10,-4],[5,-4],[12,0],[4,4],[-10,4]],'#7e6489');path(ctx,[[-8,-3],[4,-3],[9,0]],'#ffdf9b',1.9);ctx.restore();
        if(u>.57){const impact=ease((age-.06)/.28);
          for(let k=0;k<10;k++){const a=k*turn/10,d=r*(.06+.61*impact);flame(ctx,Math.cos(a)*d,Math.sin(a)*d*.65,3+4*s,c,a*.30);}
          ring(ctx,0,0,r*(.10+.52*impact),r*(.06+.29*impact),'#fcba74',2);}
        break;
      }
      case 'Flame Burst':
        for(let k=0;k<12;k++){
          const a=k*turn/12+p*.28,d=r*(.10+.62*p)*(k%2 ? .78 : 1);
          flame(ctx,Math.cos(a)*d,Math.sin(a)*d*.72-4*s,4+k%3+3*s,c,a-.48);
        }
        flame(ctx,0,-3,7+6*s,c,.14);break;
      case 'Mind Blown':{
        const opened=ease((age-.055)/.245),y=-r*.25;
        if(opened<.62){
          const rr=6+7*(1-opened);disc(ctx,0,y,rr,'#eee2bf');
          for(let k=0;k<6;k++){const a=k*turn/6+p*3;disc(ctx,Math.cos(a)*rr*.65,y+Math.sin(a)*rr*.65,rr*.21,rainbow[k]);}
          star(ctx,0,y,rr*.42,4,p,'#d55a86');
        }
        if(opened>0){star(ctx,0,y,3+8*Math.sin(Math.PI*opened),8,p,'#fff4cf',.23);}
        if(opened>0)for(let k=0;k<24;k++){
          const a=k*turn/24+p*.17,reach=r*(.28+(k%4)*.15)*opened;
          const x=Math.cos(a)*reach,dy=Math.sin(a)*reach*.86,col=rainbow[k%6];
          path(ctx,[[x*.70,y+dy*.70],[x,y+dy]],col,1.9);
          if(k%3)star(ctx,x,y+dy,2.6+k%3,4,a+opened,col);else ring(ctx,x,y+dy,2.5,2.5,col,1.4);
        }
        break;
      }
      case 'Mud Bomb':{
        const u=ease((age+.04)/.18),x=r*.38*(1-u),y=-r*.48*(1-u);
        if(u<1){disc(ctx,x,y,8,'#795e48');disc(ctx,x-2,y-3,4.3,'#b59867');}
        for(let k=0;k<15;k++){
          const a=k*2.4,rho=r*(.14+.57*p)*(.56+(k%4)*.13),xx=Math.cos(a)*rho,yy=Math.sin(a)*rho*.71;
          disc(ctx,xx,yy-s*(k%3)*4,2.2+k%4,k%2?c[0]:c[1]);if(k%3===0)ring(ctx,xx,yy+2,5+2*p,2,'#c4ac79',1.4);
        }break;
      }
    }
  }
  function field(ctx,e,age,c,r){
    const p=ease((age+.024)/.42),s=Math.sin(p*Math.PI);
    switch(e.move){
      case 'Magnitude':
        for(let k=0;k<8;k++){
          const a=k*turn/8+.14,cs=Math.cos(a),sn=Math.sin(a),pts=[];
          for(let j=0;j<5;j++){const u=j/4,d=r*(.09+.70*p)*u,off=(j%2?1:-1)*r*.08*u;pts.push([d*cs-off*sn,(d*sn+off*cs)*.75]);}
          path(ctx,pts,'#604b42',3.4);path(ctx,pts.map(([x,y])=>[x,y-1.8]),'#e1b681',1.3);
          const d=r*(.21+.27*p);crystal(ctx,cs*d,sn*d*.72-s*3,3.8+k%3,4.8+k%3,c,a+.6);
        }break;
      case 'Ice Ball':{
        const x=r*(p-.55)*.92,y=2-5*s,rad=Math.min(14,6+r*.07);
        for(let k=0;k<7;k++){const u=k/7;crystal(ctx,x-4-r*.46*u,y+5+Math.sin(k*2)*3,1.6+k%2,3+k%3,c,1.0);}
        disc(ctx,x,y,rad,c[0]);disc(ctx,x-1,y-1,rad*.82,c[1]);
        for(let k=0;k<4;k++){const a=k*turn/4+age*11;
          path(ctx,[[x+Math.cos(a)*rad*.82,y+Math.sin(a)*rad*.82],[x+Math.cos(a+.6)*rad*.35,y+Math.sin(a+.6)*rad*.35]],c[2],1.45);}
        break;
      }
      case 'Mortal Spin':
        for(let k=0;k<4;k++){
          const pts=[];for(let j=0;j<=18;j++){const u=j/18,a=k*turn/4+age*10+2.2*u,d=r*(.13+.53*p)*(.36+.64*u);pts.push([Math.cos(a)*d,Math.sin(a)*d*.67]);}
          outline(ctx,pts,c,2.6);const [x,y]=pts[pts.length-1];claw(ctx,x,y,4.8,c,age*9+k);
        }
        disc(ctx,0,0,4.5,c[2]);break;
      case 'Synchronoise':
        for(const side of [-1,1]){const x=side*r*.22;
          for(let k=0;k<4;k++){const rr=r*(.08+.36*p+k*.07);
            arc(ctx,x,0,rr,.75,side*.4+k*.36,turn-.53,k%2?c[1]:'#8ed4dc',1.65);}
        }
        for(let k=0;k<3;k++)star(ctx,0,(k-1)*r*.23,3+3*s,4,p*.5,c[2]);break;
    }
  }
});
