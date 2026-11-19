'use strict';
/* Status and support artwork. All positions and timings are derived from the cast event. */
globalThis.ArenaMoveEffects.addPack(function supportMoves({
  technique,palettes,turn,ease,clamp,path,polygon,disc,ring,star,crystal,leaf,eye,note
}){
  technique('ground',field,'ice','Chilly Reception');
  technique('ground',field,'venom','Corrosive Gas');
  technique('ground',field,'wind','Cotton Spore');
  technique('ground',field,'grass','Flower Shield','Rototiller');
  technique('ground',field,'ruby','Growl','Leer');
  technique('ground',field,'mud','Tail Whip');

  technique('target',guard,'prism','Barrier','Magic Coat');
  technique('target',guard,'mist','Crafty Shield');
  technique('target',guard,'gold','Kings Shield');
  technique('target',guard,'night','Obstruct');
  technique('target',guard,'grass','Mat Block','Spiky Shield');
  technique('target',guard,'silver','Silk Trap');
  technique('target',guard,'steel','Shelter');
  technique('target',guard,'rock','Wide Guard');
  technique('target',guard,'ruby','Quick Guard');
  technique('target',guard,'sludge','Acid Armor');
  technique('target',guard,'water','Withdraw');
  technique('target',guard,'wind','Cotton Guard');
  technique('target',guard,'sun','Defend Order');
  technique('target',guard,'ghost','Block');

  technique('target',restore,'gold','Wish','Healing Wish','Revival Blessing');
  technique('target',restore,'psychic','Lunar Dance');
  technique('target',restore,'water','Life Dew','Aqua Ring');
  technique('target',restore,'grass','Ingrain');
  technique('target',restore,'mud','Shore Up');
  technique('target',restore,'gold','Heal Order');
  technique('link',gift,'psychic','Heal Pulse');
  technique('link',gift,'grass','Floral Healing','Strength Sap');
  technique('link',gift,'gold','Bestow');
  technique('link',gift,'night','Switcheroo');
  technique('target',giftTarget,'mist','Aromatic Mist','Decorate');
  technique('target',giftTarget,'gold','After You');
  technique('target',giftTarget,'sun','Spotlight');
  technique('target',giftTarget,'steel','Gear Up','Magnetic Flux');

  technique('target',training,'ruby','Belly Drum','No Retreat','Victory Dance');
  technique('target',training,'dragon','Clangorous Soul');
  technique('target',training,'sludge','Coil','Acupressure');
  technique('target',training,'steel','Autotomize','Shift Gear','Sharpen');
  technique('target',training,'rock','Shell Smash');
  technique('target',training,'water','Fillet Away');
  technique('target',training,'grass','Shed Tail','Growth');
  technique('target',training,'prism','Geomancy');
  technique('target',training,'psychic','Meditate','Power Trick','Power Shift');
  technique('target',training,'sun','Tail Glow');
  technique('target',training,'wind','Minimize');
  technique('target',training,'emerald','Camouflage');

  technique('target',focus,'gold','Follow Me','Laser Focus','Foresight');
  technique('target',focus,'night','Mean Look');
  technique('target',focus,'psychic','Miracle Eye','Mind Reader','Kinesis','Disable');
  technique('target',focus,'ruby','Lock-On');
  technique('target',focus,'mud','Odor Sleuth');
  technique('target',focus,'ice','Baby Doll Eyes','Tearful Look');
  technique('target',focus,'mist','Play Nice');
  technique('target',focus,'wind','Tickle');

  technique('target',ritual,'silver','Howl');
  technique('target',ritual,'gold','Noble Roar','Lucky Chant','Happy Hour','Celebrate');
  technique('target',ritual,'ghost','Grudge','Perish Song','Memento','Trick-or-Treat');
  technique('target',ritual,'aura','Hold Hands','Instruct');
  technique('target',ritual,'ruby','Me First');
  technique('target',ritual,'mist','Fairy Lock');
  technique('target',ritual,'wind','Court Change','Copycat','Assist');
  technique('target',ritual,'gold','Teatime','Stockpile','Stuff Cheeks','Swallow');
  technique('target',ritual,'grass','Tidy Up');

  technique('target',element,'water','Soak','Water Sport');
  technique('target',element,'mud','Mud Sport','Sand Attack','Tar Shot');
  technique('target',element,'silver','Smokescreen','Spider Web');
  technique('target',element,'venom','Gastro Acid','Powder');
  technique('target',element,'ruby','Rage Powder','Spicy Extract','Octolock');
  technique('target',element,'grass',"Forest's Curse",'Worry Seed');
  technique('target',element,'prism','Magic Powder');
  technique('target',element,'gold','Electrify','Ion Deluge','Magnet Rise');

  technique('target',identity,'aura','Conversion');
  technique('link',exchange,'prism','Conversion 2','Reflect Type','Role Play');
  technique('link',exchange,'silver','Mirror Move','Doodle');
  technique('link',exchange,'psychic','Heart Swap','Guard Split','Power Split');
  technique('link',exchange,'aura','Entrainment','Simple Beam');
  technique('target',identity,'night','Topsy-Turvy');

  const pi=Math.PI;
  const progress=age=>ease((age+.025)/.43);
  const swing=p=>Math.sin(pi*p);
  function line(ctx,points,c,w=3.4){
    path(ctx,points,c[0],w);path(ctx,points,c[2],w*.4);
  }
  function arc(ctx,x,y,rx,ry,from,to,color,width=2,tilt=0){
    ctx.beginPath();ctx.ellipse(x,y,rx,ry,tilt,from,to);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  function tile(ctx,x,y,size,angle,draw){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(size,size);draw();ctx.restore();
  }
  function glint(ctx,x,y,r,c){star(ctx,x,y,r,4,0,c[1],.23);star(ctx,x,y,r*.56,4,0,c[2],.22);}
  function rays(ctx,x,y,r,p,c,n=8,start=0){
    for(let i=0;i<n;i++){
      const a=start+i*turn/n,dx=Math.cos(a)*r,dy=Math.sin(a)*r;
      path(ctx,[[x+dx*(.35+.23*p),y+dy*(.35+.23*p)],[x+dx*(.68+.32*p),y+dy*(.68+.32*p)]],c[1+i%2],1.9);
    }
  }
  function drop(ctx,x,y,r,c){
    ctx.beginPath();ctx.moveTo(x,y-r*1.45);ctx.bezierCurveTo(x-r*1.55,y+r*.24,x-r*.75,y+r,x,y+r);
    ctx.bezierCurveTo(x+r*.85,y+r,x+r*1.36,y+r*.24,x,y-r*1.45);ctx.fillStyle=c[1];ctx.fill();
    path(ctx,[[x-r*.44,y],[x-r*.27,y+r*.43]],c[2],1.3);
  }
  function heart(ctx,x,y,r,color){
    ctx.beginPath();ctx.moveTo(x,y+r);ctx.bezierCurveTo(x-r*1.8,y-r*.18,x-r*.77,y-r*1.45,x,y-r*.4);
    ctx.bezierCurveTo(x+r*.77,y-r*1.45,x+r*1.8,y-r*.18,x,y+r);ctx.fillStyle=color;ctx.fill();
  }
  function cloud(ctx,x,y,r,c){
    disc(ctx,x-r*.52,y+r*.13,r*.47,c[0]);disc(ctx,x+r*.52,y+r*.13,r*.46,c[0]);
    disc(ctx,x,y-r*.12,r*.65,c[1]);disc(ctx,x-r*.16,y-r*.34,r*.23,c[2]);
  }
  function blossom(ctx,x,y,r,c,a=0){
    for(let i=0;i<5;i++){
      const angle=i*turn/5+a;
      tile(ctx,x+r*.59*Math.cos(angle),y+r*.59*Math.sin(angle),1,angle,()=>{
        ctx.beginPath();ctx.ellipse(0,0,r*.55,r*.31,0,0,turn);ctx.fillStyle=c[1+i%2];ctx.fill();
      });
    }
    disc(ctx,x,y,r*.27,palettes.gold[1]);
  }
  function moon(ctx,x,y,r,c){
    ctx.beginPath();ctx.moveTo(x+r*.46,y-r);ctx.bezierCurveTo(x-r*1.27,y-r,x-r*1.38,y+r*.98,x+r*.61,y+r*.82);
    ctx.bezierCurveTo(x-r*.14,y+r*.29,x-r*.12,y-r*.54,x+r*.46,y-r);ctx.fillStyle=c;ctx.fill();
  }
  function arrow(ctx,x,y,r,angle,c){
    tile(ctx,x,y,r/10,angle,()=>line(ctx,[[-8,-6],[1,-6],[1,-10],[10,0],[1,10],[1,5],[-8,5]],c,2.6));
  }
  function crown(ctx,x,y,r,c){
    const pts=[[-1,-.57],[-.5,-.12],[0,-.83],[.48,-.12],[1,-.57],[.73,.6],[-.77,.6]];
    polygon(ctx,pts.map(([a,b])=>[x+a*r,y+b*r]),c[0]);
    line(ctx,[[x-r*.8,y-r*.35],[x-r*.46,y],[x,y-r*.58],[x+r*.46,y],[x+r*.82,y-r*.35]],c,2.1);
    path(ctx,[[x-r*.66,y+r*.43],[x+r*.66,y+r*.43]],c[1],2.4);
  }
  function gear(ctx,x,y,r,angle,c){
    const pts=[];
    for(let j=0;j<32;j++){const a=angle+j*turn/32,h=(j%4===0||j%4===3)?.73:1;pts.push([x+r*h*Math.cos(a),y+r*h*Math.sin(a)]);}
    polygon(ctx,pts,c[0]);ring(ctx,x,y,r*.58,r*.58,c[1],2);disc(ctx,x,y,r*.25,c[2]);
  }
  function hex(ctx,x,y,r,c){
    const pts=Array.from({length:6},(_,i)=>[x+r*Math.cos(i*pi/3),y+r*Math.sin(i*pi/3)]);
    polygon(ctx,pts,c[0]);path(ctx,[...pts,pts[0]],c[1],1.5);
  }
  function bee(ctx,x,y,r,c){
    tile(ctx,x,y,r/5,-.26,()=>{
      disc(ctx,-1,-3,2.6,palettes.ice[2]);disc(ctx,2,-3.6,2,palettes.ice[2]);disc(ctx,0,0,4.1,c[1]);
      path(ctx,[[-1,-3],[-1,3]],c[0],2);polygon(ctx,[[-3,-1],[-6,0],[-3,2]],c[0]);
    });
  }
  function bolt(ctx,x,y,r,c){
    const pts=[[-.08,-1],[-.67,.1],[-.13,.1],[-.33,1],[.7,-.2],[.13,-.2],[.39,-1]];
    polygon(ctx,pts.map(([a,b])=>[x+a*r,y+b*r]),c[1]);path(ctx,[[x,y-r*.74],[x-r*.32,y],[x+r*.17,y]],c[2],1.2);
  }

  function field(ctx,e,age,c,r){
    const p=progress(age),v=swing(p);
    switch(e.move){
      case 'Chilly Reception':
        cloud(ctx,-r*.30,-r*.63,r*(.32+.05*v),c);
        cloud(ctx,r*.13,-r*.73,r*.24,c);
        for(let i=0;i<10;i++){
          const x=((i*37%91)/100-.43)*r*1.85,y=(-.52+((i*.27+p*.87)%1)*1.20)*r;
          for(let j=0;j<3;j++){const a=j*pi/3,size=r*(i%3?.072:.10);
            path(ctx,[[x-size*Math.cos(a),y-size*Math.sin(a)],[x+size*Math.cos(a),y+size*Math.sin(a)]],c[2],1.7);}
        }
        for(let i=0;i<2;i++)arc(ctx,-r*.11,r*.04,r*(.70+.13*i),r*(.51+.13*i),pi*.65,pi*1.13,c[1+i],1.5);
        break;
      case 'Corrosive Gas':
        for(let i=0;i<7;i++){const a=i*turn/7+p*.24,x=r*(.49+.24*p)*Math.cos(a),y=r*(.49*Math.sin(a)-.12*p);
          cloud(ctx,x,y,r*(.17+.07*v),c);
          if(i%2===0)ring(ctx,x+r*.08,y-r*.17,r*.063,r*.063,palettes.sun[1],1.35);}
        for(let i=0;i<5;i++)drop(ctx,(i-2)*r*.29,r*(.39+.26*p+.08*(i%2)),r*.055,palettes.sun);
        break;
      case 'Cotton Spore':
        for(let i=0;i<8;i++){const a=i*2.4+p*.62,x=r*(.18+.53*p)*Math.cos(a),y=r*(.18+.53*p)*Math.sin(a);
          path(ctx,[[x,y],[x-r*.05,y+r*.1]],c[0],1.3);
          for(let j=0;j<5;j++){const b=j*turn/5;disc(ctx,x+r*.055*Math.cos(b),y+r*.055*Math.sin(b),r*.044,c[2]);}
        }break;
      case 'Flower Shield':
        for(let i=0;i<8;i++){const a=i*pi/4+p*.21,x=r*.79*Math.cos(a),y=r*.70*Math.sin(a);
          leaf(ctx,x*.89,y*.89,r*(.087+.035*v),a,palettes.grass);blossom(ctx,x,y,r*(.09+.07*p),palettes.mist,a);}
        ring(ctx,0,0,r*.81,r*.70,c[1],1.8);break;
      case 'Rototiller':
        for(let i=-2;i<=2;i++){
          const x=i*r*.28,y1=r*.72,y2=r*(.18-1.01*p);
          line(ctx,[[x-r*.1,y1],[x,y1-r*.18],[x-r*.03,(y1+y2)*.5],[x+r*.12,y2]],palettes.mud,4);
          for(const s of [-1,1])leaf(ctx,x+r*(.12+s*.053),y2-r*.04,r*.07,s*.8,c);
        }break;
      case 'Growl':
        for(let i=0;i<3;i++){const span=r*(.25+.14*i+.20*p);
          arc(ctx,0,-r*.18,span,span*.86,.15,pi-.15,c[i],2.8);}
        line(ctx,[[-r*.22,-r*.22],[-r*.09,-r*.03],[0,-r*.17],[r*.1,-r*.02],[r*.23,-r*.22]],c,3.3);break;
      case 'Leer':
        for(const side of [-1,1])tile(ctx,r*.39*side,-r*.51,1,side*.22,()=>{
          eye(ctx,0,0,r*.265,c,.48+.18*v);
          line(ctx,[[-r*.20,-r*.13],[0,-r*.10],[r*.20,-r*.17]],c,2.6);
        });
        for(const side of [-1,1])for(let i=0;i<2;i++){
          const x=side*r*(.47+i*.14);
          path(ctx,[[x,-r*.32],[x+side*r*.11,-r*(.17-.21*p)]],c[1+i],1.8);
        }
        break;
      case 'Tail Whip':{
        const a=-.73+1.9*p,pts=[];
        for(let i=0;i<=18;i++){const u=i/18,k=a-2.5*(1-u);pts.push([r*(.20+.52*u)*Math.cos(k),r*(.20+.52*u)*Math.sin(k)]);}
        line(ctx,pts,c,r*.095);const [x,y]=pts.at(-1);leaf(ctx,x,y,r*.16,a+pi*.48,c);
        for(let i=0;i<2;i++)arc(ctx,0,0,r*(.63+i*.14),r*(.58+i*.14),a-1.8,a-.38,c[2],1.6);
        break;
      }
    }
  }

  function guard(ctx,e,age,c){
    const p=progress(age),v=swing(p),r=13+5*v;
    switch(e.move){
      case 'Barrier':
        for(let i=0;i<3;i++){const x=(i-1)*11,y=-(i%2)*5-3;
          const pts=[[x-6,y-r*.7],[x+6,y-r],[x+6,y+r*.55],[x-6,y+r*.83]];
          polygon(ctx,pts,c[0]);path(ctx,[...pts,pts[0]],c[1+i%2],1.6);}
        glint(ctx,-8+16*p,-11,4,c);break;
      case 'Magic Coat':
        for(const s of [-1,1]){polygon(ctx,[[0,-r*.83],[s*r*.5,-r*.55],[s*r*1.1,r*.56],[s*r*.53,r*.35],[s*r*.25,r*.57],[0,r*.25]],c[0]);
          line(ctx,[[0,-r*.76],[s*r*.24,-r*.21],[s*r*.87,r*.46]],c,2.4);}
        glint(ctx,(-.72+1.4*p)*r,-r*.19,5,c);break;
      case 'Crafty Shield':
      case 'Kings Shield':{
        const royal=e.move==='Kings Shield',y=2-4*v;
        const pts=[[-13,y-10],[0,y-15],[13,y-10],[11,y+4],[0,y+13],[-11,y+4]];
        polygon(ctx,pts,c[0]);path(ctx,[...pts,pts[0]],c[1],2);
        if(royal){crown(ctx,0,y-4,8,c);line(ctx,[[0,y+2],[0,y+8]],c,2);glint(ctx,10,y-12,4,c);}
        else{star(ctx,0,y-2,7.5,4,p*.9,c[2]);for(const s of [-1,1])ring(ctx,s*16,y+2,3,5,c[1],1.4,s*.5);}
        break;
      }
      case 'Obstruct':
        for(const s of [-1,1]){const x=s*(3+5*(1-p));polygon(ctx,[[x-12,-s*11],[x-9,-s*16],[x+14,s*11],[x+10,s*16]],c[0]);
          line(ctx,[[x-10,-s*12],[x+11,s*12]],c,3.5);}
        break;
      case 'Mat Block':
        tile(ctx,0,3-8*p,1,-.18,()=>{
          polygon(ctx,[[-17,-10],[17,-10],[17,9],[-17,9]],palettes.mud[0]);
          for(let i=-15;i<=15;i+=5)path(ctx,[[i,-9],[i,8]],c[1],2.9);
          for(let i=-7;i<10;i+=5)path(ctx,[[-16,i],[16,i]],palettes.mud[2],1.5);
          line(ctx,[[-17,-10],[17,-10],[17,9],[-17,9],[-17,-10]],c,3);
        });break;
      case 'Spiky Shield':
        star(ctx,0,-1,r*1.18,13,p*.15,c[0],.69);star(ctx,0,-1,r*.96,13,p*.15,c[1],.76);
        for(let i=0;i<4;i++){const a=i*2.4;leaf(ctx,7*Math.cos(a),-1+7*Math.sin(a),4,a,c);}break;
      case 'Silk Trap':
        for(let i=0;i<8;i++){const a=i*pi/4;path(ctx,[[0,0],[r*1.24*Math.cos(a),r*Math.sin(a)]],c[1],1.4);}
        for(let j=1;j<=3;j++){const pts=[];for(let i=0;i<=16;i++){const a=i*pi/8,h=(i%2?.8:1)*j*r/3;
          pts.push([h*1.16*Math.cos(a),h*Math.sin(a)]);}path(ctx,pts,c[2],1.2);}
        break;
      case 'Shelter':
        for(let i=-1;i<=1;i++){const x=i*10,y=Math.abs(i)*5;crystal(ctx,x,y+4-5*p,7,15-Math.abs(i)*3,c,i*.22);}
        path(ctx,[[-17,10],[-9,7],[1,10],[9,6],[18,10]],c[2],1.7);break;
      case 'Wide Guard':
        for(let i=-2;i<=2;i++){const x=i*8,y=Math.abs(i)*3;
          polygon(ctx,[[x-4,y-r*.55],[x+4,y-r*.55],[x+3,y+5],[x,y+9],[x-4,y+4]],c[i%2===0?0:1]);}
        arc(ctx,0,6,23+4*p,18+3*p,pi+.12,turn-.12,c[2],2.5);break;
      case 'Quick Guard':
        for(let i=0;i<3;i++){const x=-13+i*10+4*p;line(ctx,[[x,-12+i],[x+8,0],[x,12-i]],c,4.4-i*.45);}
        path(ctx,[[-19,-5],[-9,-5]],c[1],1.8);path(ctx,[[-18,6],[-12,6]],c[2],1.7);break;
      case 'Acid Armor':
        for(let i=0;i<7;i++){const a=i*turn/7+p*.47;drop(ctx,r*Math.cos(a),r*.7*Math.sin(a),3.1+(i%2)*.8,c);}
        arc(ctx,0,3,r*1.05,r*.52,.15,pi-.11,c[1],3);break;
      case 'Withdraw':
        for(let i=0;i<7;i++){const a=pi+i*pi/6,radius=17-4*p;
          path(ctx,[[0,6],[radius*Math.cos(a),6+radius*Math.sin(a)]],c[1],2.3);}
        arc(ctx,0,6,17-4*p,17-4*p,pi,turn,c[2],2.4);ring(ctx,0,7,18-4*p,4,c[0],2.2);break;
      case 'Cotton Guard':
        for(let i=0;i<8;i++){const a=i*turn/8+p*.22;cloud(ctx,r*.86*Math.cos(a),r*.64*Math.sin(a),6+.9*v,c);}break;
      case 'Defend Order':
        for(let i=0;i<6;i++){const a=i*pi/3;hex(ctx,11*Math.cos(a),11*Math.sin(a)-1,5.4,c);}
        for(const s of [-1,1])bee(ctx,s*(13+4*p),-12+4*v,4.6,c);break;
      case 'Block':
        for(let i=-1;i<=1;i++){const x=i*9;line(ctx,[[x,-16+7*(1-p)],[x,13]],c,4);}
        line(ctx,[[-15,-8],[15,-8]],c,3);line(ctx,[[-15,7],[15,7]],c,3);break;
    }
  }

  function restore(ctx,e,age,c){
    const p=progress(age),v=swing(p);
    switch(e.move){
      case 'Wish':{
        const x=e.wishResolved?8*(1-p):-9+17*p, y=e.wishResolved?-40+38*p:-20-22*p;
        const tail=e.wishResolved?-1:1;
        for(let i=1;i<=3;i++)glint(ctx,x-i*2,y+tail*i*3.6,3.1-i*.45,c);
        star(ctx,x,y,8.3+v,5,-pi/2+p*.35,c[0]);star(ctx,x,y,6.9+v,5,-pi/2+p*.35,c[1]);glint(ctx,x,y,4.3,c);
        if(e.wishResolved)ring(ctx,0,6,6+14*p,2+4*p,c[2],2);break;
      }
      case 'Healing Wish':
        for(const s of [-1,1]){
          const pts=[];for(let i=0;i<=12;i++){const t=i/12,a=t*pi*1.35+p*1.4;
            pts.push([s*(4+t*10)*Math.cos(a),8-t*(17+11*p)]);}
          line(ctx,pts,c,2.8);
        }
        heart(ctx,0,-12-13*p,5.4,palettes.mist[1]);glint(ctx,0,-15-11*p,3,c);break;
      case 'Revival Blessing':
        for(const s of [-1,1])for(let i=0;i<3;i++){
          const x=s*(6+i*4.5),y=-5-i*2-8*v;
          polygon(ctx,[[x,y+8],[x+s*3,y],[x+s*(6-i),y-8],[x+s*(2-i),y-4],[x-s*2,y+5]],c[1+i%2]);}
        ring(ctx,0,-17-5*v,8.4,2.8,c[1],2);glint(ctx,0,1-7*p,7.2,c);break;
      case 'Lunar Dance':
        moon(ctx,0,-7-6*p,11,c[2]);
        for(let i=0;i<3;i++){const a=i*turn/3+p*2.15;
          arc(ctx,0,0,19,8,a,a+1.25,c[i],2.4,-.38);glint(ctx,17*Math.cos(a),8*Math.sin(a)-2,2.7,c);}
        break;
      case 'Life Dew':
        for(let i=-1;i<=1;i++){const u=clamp(p*1.28-Math.abs(i)*.22);
          drop(ctx,i*11,-22+20*u,4.2-Math.abs(i)*.6,c);
          if(u>.5)ring(ctx,i*11,4,2+8*(u-.5),1.5+(u-.5)*3,c[2],1.6);}
        break;
      case 'Aqua Ring':
        for(let i=0;i<2;i++){const a=p*3.2+i*pi;
          arc(ctx,0,-1+i*4,19,8,a,a+pi*1.55,c[1+i],2.8,-.24);
          drop(ctx,18*Math.cos(a),-1+i*4+8*Math.sin(a)-4*Math.cos(a),3,c);}
        break;
      case 'Ingrain':
        for(let i=-2;i<=2;i++){
          const x=i*5,y=6+8*p+Math.abs(i)*1.1;line(ctx,[[i*2,0],[x,6],[x+3,y-3],[x*1.5,y+1]],palettes.mud,2.8);
          path(ctx,[[x+2,y-3],[x-3,y+3]],palettes.mud[1],1.6);}
        for(const s of [-1,1])leaf(ctx,s*6,0-4*v,5.3,s*.72,c);break;
      case 'Shore Up':
        for(let row=0;row<3;row++)for(let i=0;i<5-row;i++){
          const x=(i-(4-row)/2)*7,y=9-row*5+(1-p)*row*3;
          polygon(ctx,[[x-5,y+2],[x-2,y-3],[x+3,y-4],[x+5,y+2]],c[(i+row)%2]);path(ctx,[[x-2,y-2],[x+2,y-3]],c[2],1);}
        for(let i=0;i<5;i++)disc(ctx,(i-2)*(8-3*p),-9+15*p-Math.abs(i-2)*2,1.4,c[1]);break;
      case 'Heal Order':
        for(let i=0;i<3;i++){const a=i*turn/3+p*2;bee(ctx,(18-5*p)*Math.cos(a),-4+11*Math.sin(a),4.7,c);}
        hex(ctx,0,-3,7.4,c);line(ctx,[[-3,-3],[3,-3]],c,2);line(ctx,[[0,-6],[0,0]],c,2);break;
    }
  }

  function parcel(ctx,x,y,r,c){
    polygon(ctx,[[x-r,y-r*.58],[x+r,y-r*.58],[x+r*.87,y+r*.76],[x-r*.87,y+r*.76]],c[0]);
    path(ctx,[[x-r,y-r*.44],[x+r,y-r*.44]],c[1],2.5);path(ctx,[[x,y-r*.58],[x,y+r*.63]],c[2],2);
    for(const s of [-1,1])ring(ctx,x+s*r*.33,y-r*.85,r*.36,r*.19,c[1],1.4,s*.4);
  }
  function gift(ctx,e,age,c,length){
    const p=progress(age),v=swing(p),travel=p*length;
    switch(e.move){
      case 'Heal Pulse':
        for(let i=0;i<3;i++){const u=clamp(p*1.38-i*.18),wave=4+3*Math.sin(pi*u);
          ring(ctx,length*u,0,wave*.47,wave+2,c[i],2.2);}
        heart(ctx,length,-8-3*v,4+2.8*p,c[1]);break;
      case 'Floral Healing':
        for(let i=0;i<6;i++){const u=clamp(p*1.45-i*.095);
          leaf(ctx,length*u,Math.sin(pi*2*u+i*.52)*5,2.2+(i%2)*.8,u*2,c);}
        blossom(ctx,length,-3,4+7*p,palettes.mist,p*.8);
        for(const s of [-1,1])leaf(ctx,length+s*5,5,3.9,s*.7,c);break;
      case 'Strength Sap':
        for(let j=0;j<2;j++){const points=[];
          for(let i=0;i<=14;i++){const u=i/14;points.push([length*u,Math.sin(u*pi*3-p*5+j*pi)*(2+3*Math.sin(pi*u))]);}
          path(ctx,points,c[j],1.8);}
        for(let i=0;i<3;i++){const u=(1.8-p-i*.26)%1;leaf(ctx,u*length,-2-3*Math.sin(pi*u),3.2,u*2,c);}
        ring(ctx,0,0,3+5*p,3+5*p,c[2],1.4);break;
      case 'Bestow':
        parcel(ctx,travel,-10*v,6.8,c);
        for(let i=0;i<3;i++){const u=Math.max(0,p-.1*(i+1));glint(ctx,length*u,-10*swing(u)+3,2.3-i*.3,c);}
        arc(ctx,length,1,9,6,0,pi,c[1],1.5);break;
      case 'Switcheroo':
        for(const s of [-1,1]){const u=s===1?p:1-p,x=length*u,y=s*(4+7*v),colors=s===1?c:palettes.gold;
          arrow(ctx,length*.5,s*10,4.3,s===1?0:pi,colors);
          if(s===1)parcel(ctx,x,y,4.7,colors);else crystal(ctx,x,y,3.9,5.6,colors,.3+p);}
        break;
    }
  }
  function giftTarget(ctx,e,age,c){
    const p=progress(age),v=swing(p);
    switch(e.move){
      case 'Aromatic Mist':
        for(let j=0;j<3;j++){const pts=[];
          for(let i=0;i<=12;i++){const u=i/12;pts.push([(j-1)*8+Math.sin(u*6+p*4+j)*3,6-23*u-4*p]);}path(ctx,pts,c[1+j%2],2);}
        blossom(ctx,-11,4,4.4,palettes.sun,p);break;
      case 'Decorate':
        for(let i=0;i<8;i++){const a=i*turn/8-.35,r=15+3*v,x=r*Math.cos(a),y=r*.73*Math.sin(a)-4;
          tile(ctx,x,y,1,a+p,()=>{if(i%2)star(ctx,0,0,3.8,5,0,palettes.gold[1]);else polygon(ctx,[[-3,-2],[3,-2],[0,3]],c[1]);});}
        arc(ctx,0,-2,14,11,.12,pi-.12,c[2],1.3);break;
      case 'After You':
        for(let i=0;i<2;i++)arrow(ctx,-5+i*10+2*p,-4,6.8-i*.8,0,c);
        arc(ctx,-5,-8,12,12,pi*.69,pi*1.8,c[1],1.7);
        path(ctx,[[-5,-16],[-5,-9],[0,-8]],c[2],1.9);break;
      case 'Spotlight':
        ctx.save();ctx.globalAlpha*=.36;polygon(ctx,[[-13,-34],[-7,-34],[16,9],[-15,9]],c[1]);ctx.restore();
        line(ctx,[[-13,-34],[-15,9]],c,1.7);line(ctx,[[-7,-34],[16,9]],c,1.7);
        ring(ctx,0,8,15+2*v,4,c[2],1.8);glint(ctx,-9,-30,4,c);break;
      case 'Gear Up':
        gear(ctx,-6,-3,9.8,p*1.3,c);gear(ctx,8,-11,6.7,-p*1.8,palettes.gold);
        arrow(ctx,11,2-6*p,4.2,-pi/2,c);break;
      case 'Magnetic Flux':
        for(const s of [-1,1]){
          arc(ctx,s*7,-3,7.5,7.5,0,pi,s===1?palettes.ruby[1]:palettes.aura[1],3.8);
          for(const d of [-1,1])line(ctx,[[s*7+d*7.5,-3],[s*7+d*7.5,-9]],c,3);}
        for(let i=0;i<2;i++)arc(ctx,0,-4,11+i*5+p*2,12+i*4,pi+.14,turn-.14,c[1+i],1.5);break;
    }
  }

  function drum(ctx,y,c){
    polygon(ctx,[[-12,y-3],[12,y-3],[10,y+7],[-10,y+7]],c[0]);ring(ctx,0,y-3,12,4,c[2],2.4);
    for(let i=-8;i<9;i+=6)path(ctx,[[i,y-1],[i+2,y+5]],c[1],1.6);
  }
  function training(ctx,e,age,c){
    const p=progress(age),v=swing(p);
    switch(e.move){
      case 'Belly Drum':
        drum(ctx,1,c);for(const s of [-1,1]){const beat=Math.sin(p*turn*1.6+s);
          line(ctx,[[s*16,-13-3*beat],[s*5,-4-3*beat]],palettes.mud,2.8);disc(ctx,s*5,-4-3*beat,2.3,palettes.gold[1]);}
        arc(ctx,0,4,17+3*v,8,0,pi,c[1],1.7);break;
      case 'No Retreat':
        for(const s of [-1,1]){const x=s*13;line(ctx,[[x,12],[x,-17]],c,2.6);
          polygon(ctx,[[x,-16],[x+s*8,-13+v],[x+s*5,-10],[x+s*8,-6],[x,-8]],c[1]);}
        for(let i=-1;i<=1;i++)polygon(ctx,[[i*7-3,12],[i*7,5-2*v],[i*7+3,12]],palettes.rock[1]);break;
      case 'Victory Dance':
        for(let i=0;i<4;i++){const a=i*pi/2+p*2.5,x=13*Math.cos(a),y=6*Math.sin(a)+4;
          tile(ctx,x,y,1,a+.55,()=>{disc(ctx,-2,0,2,c[1]);disc(ctx,1,-2,1.2,c[2]);});}
        crown(ctx,0,-9-4*v,9,palettes.gold);arc(ctx,0,4,18,7,p*4,p*4+2.6,c[1],1.7);break;
      case 'Clangorous Soul':
        for(let i=0;i<7;i++){const a=i*turn/7+p*.47;tile(ctx,14*Math.cos(a),11*Math.sin(a)-2,1,a,()=>{
          polygon(ctx,[[-3,-4],[4,-4],[5,0],[0,6],[-4,2]],i%2?c[1]:palettes.gold[1]);});}
        note(ctx,-3,-10-4*v,5,palettes.gold,-.23);note(ctx,6,-15-4*v,4,c,.13);break;
      case 'Coil':{
        const pts=[];for(let i=0;i<=52;i++){const u=i/52,a=u*pi*5.3+p*1.78;
          pts.push([(15-7*u-2*p)*Math.cos(a),8-21*u+4*Math.sin(a)]);}
        line(ctx,pts,c,4);const [x,y]=pts.at(-1);disc(ctx,x,y,3.5,c[1]);disc(ctx,x+.7,y-1,1,c[2]);break;
      }
      case 'Acupressure':
        for(let i=0;i<5;i++){const a=i*turn/5+p*.3,x=Math.cos(a),y=Math.sin(a);
          line(ctx,[[x*19,y*16-2],[x*(9-3*p),y*(8-2*p)-2]],c,2);
          glint(ctx,x*(9-3*p),y*(8-2*p)-2,2.4,palettes.gold);}
        ring(ctx,0,-2,4+3*v,4+3*v,c[1],1.3);break;
      case 'Autotomize':
        for(let i=0;i<6;i++){const a=i*turn/6,r=8+12*p;crystal(ctx,r*Math.cos(a),r*.7*Math.sin(a)+6*p,3,5.1,c,a+p);}
        for(const s of [-1,1]){path(ctx,[[s*7,3],[s*6,-8-5*p]],c[2],1.6);}break;
      case 'Shift Gear':
        gear(ctx,-5,0,10,p*2,c);gear(ctx,8,6,6,-p*3,c);
        line(ctx,[[5,-5],[5,-14],[12,-14]],palettes.gold,2.4);disc(ctx,12,-14,2.6,palettes.gold[1]);break;
      case 'Sharpen':
        polygon(ctx,[[-13,9],[8,-14],[6,-3],[-6,9]],c[0]);line(ctx,[[-11,8],[8,-14]],c,2.9);
        tile(ctx,-4+10*p,2-11*p,1,.62,()=>{polygon(ctx,[[-5,-2],[5,-2],[5,2],[-5,2]],palettes.rock[1]);});
        glint(ctx,-3+9*p,-3-8*p,4+v,palettes.gold);break;
      case 'Shell Smash':
      case 'Fillet Away':{
        const shell=e.move==='Shell Smash';
        for(const s of [-1,1])tile(ctx,s*(4+11*p),-4-v*5+5*p,1,s*(.17+.7*p),()=>{
          const pts=shell?[[0,-10],[s*7,-8],[s*10,1],[s*5,9],[0,7],[s*3,1],[-s,-1],[s*3,-5]]:[[0,-10],[s*7,-2],[s*3,4],[s*7,7],[0,8],[-s*2,1]];
          polygon(ctx,pts,c[0]);path(ctx,pts.slice(0,4),c[2],1.7);
          if(!shell)path(ctx,[[0,-3],[s*3,0],[0,2]],palettes.ruby[1],2);});
        if(shell)rays(ctx,0,0,15,p,palettes.gold,6,-.45);
        else line(ctx,[[-9+6*p,10-4*p],[7+5*p,-10-3*p]],palettes.silver,2.5);
        break;
      }
      case 'Shed Tail':{
        const pts=[];for(let i=0;i<=17;i++){const u=i/17;pts.push([-4+21*u+4*p,6+6*Math.sin(u*turn+p*4)*(1-u*.3)]);}
        line(ctx,pts,c,4);leaf(ctx,16+3*p,5,4.5,-.7,c);
        for(let i=0;i<3;i++)arc(ctx,-7-3*i-3*p,-2,7,9,pi*.6,1.35*pi,c[1+i%2],1.4);
        break;
      }
      case 'Growth':
        line(ctx,[[0,8],[0,-2],[-2,-8-11*p]],c,2.7);
        for(let i=0;i<4;i++){const s=i%2?1:-1;leaf(ctx,s*(4+2*p),3-i*(3+2*p),4.5+1.8*p,-s*.68,c);}
        glint(ctx,-2,-10-11*p,3.2,palettes.sun);break;
      case 'Geomancy':
        ring(ctx,0,6,18+3*v,6,c[1],1.7);
        for(let i=-1;i<=1;i++){const color=[palettes.grass,c,palettes.water][i+1];
          crystal(ctx,i*12,-1-8*p-(1-Math.abs(i))*3,3.5,7+2*v,color,i*.25);
          path(ctx,[[i*12,3],[i*12,10]],color[1],1.3);}
        break;
      case 'Meditate':
        for(let i=-1;i<=1;i++)tile(ctx,i*6,5,1,i*.54,()=>{leaf(ctx,0,0,7.2,-pi/2,c);});
        disc(ctx,0,-9-4*v,3.7,c[2]);ring(ctx,0,9,13+p*4,3.2,c[1],1.5);break;
      case 'Power Trick':
        for(const s of [-1,1]){const a=p*pi+s*pi/2;
          arrow(ctx,10*Math.cos(a),-2+8*Math.sin(a),5,a+pi/2,c);}
        line(ctx,[[-6,5],[4,-9]],palettes.ruby,2.2);
        polygon(ctx,[[3,-1],[9,-4],[13,-1],[12,4],[8,7],[4,4]],palettes.steel[1]);break;
      case 'Power Shift':
        for(const s of [-1,1]){const y=s*6;arrow(ctx,s*(-8+16*p),y,6,s===1?0:pi,s===1?palettes.ruby:c);}
        path(ctx,[[0,-14],[0,13]],c[1],1.3);break;
      case 'Tail Glow':
        for(let i=0;i<4;i++){const a=-.36+i*.27;arc(ctx,-5,2,12+i*2.4,7+i*1.5,a-1.4,a,c[1+i%2],1.3);}
        line(ctx,[[-9,7],[-3,8],[5,4],[8,-2],[9,-6]],palettes.grass,2.4);
        glint(ctx,9,-7,5+4*v,c);rays(ctx,9,-7,12,p,c,7);break;
      case 'Minimize':
        for(let i=0;i<3;i++){const r=15-i*4.5-2*p;
          ring(ctx,0,1,r,r*.67,c[i],1.45);}
        for(const s of [-1,1])arrow(ctx,s*(18-5*p),-8,3.8,s===1?pi*.84:.16*pi,c);break;
      case 'Camouflage':
        for(let i=0;i<7;i++){const a=i*turn/7+p*.32,x=13*Math.cos(a),y=10*Math.sin(a)-2;
          const color=[c,palettes.mud,palettes.grass][i%3];polygon(ctx,[[x-4,y-2],[x,y-5],[x+5,y-2],[x+3,y+3],[x-2,y+4]],color[1]);}
        arc(ctx,0,1,16,9,p*3,p*3+1.2,c[2],1.6);break;
    }
  }

  function pointingHand(ctx,x,y,angle,c){
    tile(ctx,x,y,1,angle,()=>{
      const pts=[[-5,6],[-6,1],[-9,-2],[-8,-4],[-4,-2],[-4,-10],[-2,-12],[0,-10],[0,-4],[2,-6],[4,-5],[7,-4],[8,0],[5,7],[0,8]];
      polygon(ctx,pts,c[1]);path(ctx,[...pts,pts[0]],c[0],1.5);path(ctx,[[-2,-10],[-2,-5]],c[2],1.4);
    });
  }
  function focus(ctx,e,age,c){
    const p=progress(age),v=swing(p),y=-8-3*v;
    switch(e.move){
      case 'Follow Me':
        pointingHand(ctx,0,y,.27*Math.sin(turn*p),c);
        for(const s of [-1,1])arc(ctx,0,y-2,14+2*v,12,s===1?-.85:pi-.8,s===1?.6:pi+.64,c[1],2);break;
      case 'Laser Focus':{
        const x=-12+22*p;path(ctx,[[-17,-4],[17,-4]],c[0],2.6);
        path(ctx,[[x,-15],[x,7]],c[2],1.3);glint(ctx,x,-4,4+2*v,c);
        for(const s of [-1,1])line(ctx,[[s*15,-8],[s*12,-4],[s*15,0]],c,2);break;
      }
      case 'Foresight':
        ring(ctx,-3+3*p,-7,9,9,c[0],3.6);ring(ctx,-3+3*p,-7,7.5,7.5,c[1],1.7);
        line(ctx,[[4+3*p,0],[11+3*p,7]],c,3.6);glint(ctx,-5+3*p,-10,3.7,c);break;
      case 'Mean Look':
        for(const s of [-1,1])tile(ctx,s*8,y,1,-s*.28,()=>{
          eye(ctx,0,0,7.5,c,.43+.12*v);path(ctx,[[-6,-4],[5,-6]],c[1],1.9);});
        for(let i=-1;i<=1;i++)path(ctx,[[i*7,y+7],[i*7,y+12+3*p]],c[0],1.7);break;
      case 'Miracle Eye':
        rays(ctx,0,y,17,p,palettes.gold,9,-pi/2);eye(ctx,0,y,10,c,.65+.18*v);glint(ctx,1,y,3,palettes.gold);break;
      case 'Mind Reader':
        for(let i=-1;i<=1;i++)arc(ctx,0,y+3,9+Math.abs(i)*4,9+i*2,-2.81,-.33,c[i+1],1.6);
        eye(ctx,0,y+4,8,c,.63);star(ctx,0,y-9,3.9,4,0,c[2]);break;
      case 'Kinesis':
        tile(ctx,0,y,1,-.35-p*.35,()=>{
          ring(ctx,-4,-5,4.5,6.6,c[1],2.2);line(ctx,[[-3,2],[-1,5],[4+5*p,5],[6+4*p,10]],c,2.7);
        });
        for(let i=0;i<2;i++)arc(ctx,0,y+2,11+i*4,7+i*3,-1.2,-.05,c[1+i],1.5);break;
      case 'Disable':
        tile(ctx,0,y,1,-.13,()=>{
          ring(ctx,0,0,9+2*v,9+2*v,c[1],2.8);
          line(ctx,[[-7,-7],[7,7]],c,3.7);});
        for(const s of [-1,1])path(ctx,[[s*13,y+5],[s*16,y+8],[s*14,y+11]],c[2],1.6);break;
      case 'Lock-On':
        for(let i=0;i<4;i++){const a=i*pi/2+p*.32;
          arc(ctx,0,-3,14-4*p,14-4*p,a+.13,a+.95,c[1],2.3);
          path(ctx,[[16*Math.cos(a),-3+16*Math.sin(a)],[9*Math.cos(a),-3+9*Math.sin(a)]],c[2],1.65);}
        disc(ctx,0,-3,2.2,c[2]);break;
      case 'Odor Sleuth':
        for(let i=0;i<3;i++){const u=(i+p)/3,x=-12+24*u,y0=4-11*u+2*Math.sin(turn*u);
          tile(ctx,x,y0,.69+i*.12,-.4,()=>{disc(ctx,0,1,3,c[1]);for(let j=-1;j<=1;j++)disc(ctx,j*2.5,-3+Math.abs(j),1.3,c[2]);});}
        for(let i=0;i<2;i++)arc(ctx,10,-8,5+i*3,5+i*3,-1.4,-.2,c[1],1.25);break;
      case 'Baby Doll Eyes':
        for(const s of [-1,1]){eye(ctx,s*8,y,6.5,c,.91);glint(ctx,s*8-1,y-1.4,2.6,c);}
        heart(ctx,0,y+9-2*p,3.1,palettes.mist[1]);break;
      case 'Tearful Look':
        for(const s of [-1,1]){arc(ctx,s*7,y,4.6,2.7,pi,turn,c[0],2);
          drop(ctx,s*10,y+4+8*p,3.1,c);}
        arc(ctx,0,y+10,3.8,2.3,pi,turn,c[1],1.4);break;
      case 'Play Nice':
        for(const s of [-1,1]){const x=s*(12-5*p);disc(ctx,x,y+2,5.5,c[0]);disc(ctx,x+s*2,y,1,c[2]);arc(ctx,x,y+3,2.5,1.5,0,pi,c[2],1.2);}
        heart(ctx,0,y-6-3*p,3.7,c[1]);break;
      case 'Tickle':
        for(const s of [-1,1]){const a=s*(.5+.25*Math.sin(p*turn*1.8));tile(ctx,s*(9+2*v),y+5,1,a,()=>{
          leaf(ctx,0,-3,8,-pi/2,c);path(ctx,[[0,7],[0,-8]],c[0],1.5);
          for(let i=0;i<3;i++)path(ctx,[[0,2-i*2],[3,-1-i*2]],c[2],1);});}
        for(let i=-1;i<=1;i++)glint(ctx,i*5,y+8,1.6,c);break;
    }
  }

  function cup(ctx,x,y,r,c){
    polygon(ctx,[[x-r,y-r*.5],[x+r,y-r*.5],[x+r*.72,y+r*.63],[x-r*.62,y+r*.63]],c[1]);
    arc(ctx,x+r*.91,y-r*.03,r*.47,r*.38,-pi*.55,pi*.55,c[2],1.6);
    path(ctx,[[x-r,y+r*.89],[x+r*.94,y+r*.89]],c[0],1.9);ring(ctx,x,y-r*.48,r,r*.24,c[2],1.2);
  }
  function berry(ctx,x,y,r,c){
    disc(ctx,x-r*.27,y,r*.68,c[0]);disc(ctx,x+r*.22,y+r*.15,r*.69,c[1]);
    leaf(ctx,x+r*.06,y-r*.67,r*.57,-.55,palettes.grass);disc(ctx,x-r*.28,y-r*.14,r*.17,c[2]);
  }
  function ritual(ctx,e,age,c){
    const p=progress(age),v=swing(p),y=-6-3*v;
    switch(e.move){
      case 'Howl':
        moon(ctx,-7,y-3,7,c[2]);
        for(let j=0;j<3;j++)arc(ctx,-1,4,8+j*4+2*p,8+j*4+2*p,-1.4,-.24,c[1+j%2],1.8);break;
      case 'Noble Roar':
        crown(ctx,0,y-3,8,c);
        for(const s of [-1,1])for(let i=0;i<2;i++)tile(ctx,s*(7+i*6+4*p),y+6,1,s===1?0:pi,()=>line(ctx,[[-2,-5],[2,0],[-2,5]],c,2.4));
        break;
      case 'Lucky Chant':
        for(let i=0;i<4;i++){const a=i*pi/2+p*1.3;heart(ctx,Math.cos(a)*3.5,-8+Math.sin(a)*3.5,3.3,palettes.grass[1]);}
        path(ctx,[[0,-5],[-2,2]],palettes.grass[2],1.4);
        for(const s of [-1,1])note(ctx,s*(10+3*p),y+3+3*s,4.9,c,s*.26);break;
      case 'Happy Hour':
        for(let i=0;i<6;i++){const a=(i+.55)*pi/7,x=Math.cos(a)*(16+3*p),yy=-Math.sin(a)*(11+10*v)+2;
          disc(ctx,x,yy,3.5,c[0]);ring(ctx,x,yy,2.5,2.9,c[1],1.4);path(ctx,[[x,yy-1.5],[x,yy+1.5]],c[2],1);}
        glint(ctx,0,1-3*p,4,c);break;
      case 'Celebrate':
        for(let i=0;i<16;i++){const a=-pi+.14+(i%8)*.40,r=11+(18+((i*7)%16))*p,x=Math.cos(a)*r,y0=-7+Math.sin(a)*r+7*p*p;
          tile(ctx,x,y0,1,a+p*(i%3+1),()=>{const color=[c[1],palettes.mist[1],palettes.water[1],palettes.grass[1]][i%4];
            if(i%3)polygon(ctx,[[-1.1,-2.4],[1.1,-2.4],[1.1,2.4],[-1.1,2.4]],color);else star(ctx,0,0,2.6,4,0,color);});}
        break;
      case 'Grudge':
        for(let i=-1;i<=1;i++){const pts=[];
          for(let j=0;j<=10;j++){const u=j/10;pts.push([i*8+Math.sin(u*5+p*5+i)*2.6,7-u*(14+7*p)+Math.abs(i)*2]);}
          line(ctx,pts,c,3.6);}
        for(const s of [-1,1])path(ctx,[[s*7,-5],[s*2,-3]],palettes.ruby[1],1.8);break;
      case 'Perish Song':
        for(let i=0;i<3;i++){const a=i*turn/3-p*1.65;
          note(ctx,19*Math.cos(a),-10+14*Math.sin(a),6.7,c,.18*Math.sin(a));}
        arc(ctx,0,0,17+4*p,8+2*p,.1,pi-.1,c[1],2);
        disc(ctx,0,-9,4.4,c[0]);for(const s of [-1,1])disc(ctx,s*1.7,-9.6,.85,c[2]);break;
      case 'Memento':
        for(const s of [-1,1])tile(ctx,s*(2+5*p),y+2*p,1,s*.20*p,()=>{
          polygon(ctx,[[0,-6],[s*4,-9],[s*9,-7],[s*10,-2],[s*5,4],[0,8],[s*2,2],[0,0]],c[0]);
          path(ctx,[[0,-5],[s*4,-7],[s*7,-5]],c[1],1.5);});
        for(let i=0;i<4;i++)disc(ctx,(i-1.5)*5,5+10*p+(i%2)*2,1.55,c[1]);break;
      case 'Trick-or-Treat':
        for(const s of [-1,0,1]){const x=s*4;ctx.beginPath();ctx.ellipse(x,y+3,s===0?5.7:5,7,0,0,turn);ctx.fillStyle=s===0?'#ff9d3d':'#d06c37';ctx.fill();}
        path(ctx,[[0,y-4],[1,y-8],[4,y-8]],palettes.grass[1],2);
        for(const s of [-1,1])polygon(ctx,[[s*6,y+2],[s*2,y+2],[s*4,y-1]],c[0]);
        path(ctx,[[-5,y+5],[-2,y+7],[0,y+5],[2,y+7],[5,y+5]],c[0],1.5);glint(ctx,11,y-8,3+v,c);break;
      case 'Hold Hands':
        for(const s of [-1,1])tile(ctx,s*(8-4*p),y+5,.7,s*pi/2,()=>pointingHand(ctx,0,0,0,c));
        heart(ctx,0,y-6-3*p,4,palettes.mist[1]);break;
      case 'Instruct':
        tile(ctx,-7+2*p,y+2,.74,.94,()=>pointingHand(ctx,0,0,0,c));
        for(let i=0;i<2;i++)arrow(ctx,8+i*5+p*2,y-i*3,3.6,0,palettes.gold);break;
      case 'Me First':
        for(let i=0;i<3;i++)path(ctx,[[-17+i*2,y+2+i*3],[-5+i*3,y+2+i*3]],c[1+i%2],1.6);
        tile(ctx,2+7*p,y,1,.12,()=>{polygon(ctx,[[-7,-6],[-1,-10],[4,-10],[4,6],[8,6],[8,9],[-5,9],[-5,6],[-1,6],[-1,-5],[-5,-3]],c[1]);});
        break;
      case 'Fairy Lock':
        arc(ctx,0,y-1,5.5,6,pi,turn,c[2],2.4);
        polygon(ctx,[[-8,y-1],[8,y-1],[8,y+9],[-8,y+9]],c[0]);star(ctx,0,y+4,3.2,4,0,c[1]);
        for(const s of [-1,1])for(let i=0;i<2;i++)ring(ctx,s*(10+i*4-2*p),y+4,3.5,2.2,c[1],1.4,s*.32);break;
      case 'Court Change':
        path(ctx,[[0,-13],[0,11]],c[2],1.3);
        for(const s of [-1,1]){const colors=s===1?palettes.ruby:palettes.aura,x=s*(12-24*p);
          polygon(ctx,[[x-3,s*4+5],[x,s*4-3],[x+3,s*4+5]],colors[1]);
          arrow(ctx,s*8,-s*9,4.5,s===1?pi:0,colors);}
        break;
      case 'Copycat':
      case 'Assist':{
        const assist=e.move==='Assist';
        for(let i=0;i<2;i++){const x=(i?1:-1)*(assist?8:5),yy=y+(i?1:-1)*(assist?1:4)-3*p;
          const colors=i?c:(assist?palettes.gold:palettes.psychic);
          tile(ctx,x,yy,i?.9:.7,i?.24:-.22,()=>{
            disc(ctx,0,3,4.7,colors[1]);for(let j=-1;j<=1;j++)disc(ctx,j*3.3,-2-Math.cos(j),1.9,colors[2]);});}
        if(assist)glint(ctx,0,y-7,4+v,palettes.gold);else arc(ctx,0,y,16,8,p*2,p*2+1.7,c[1],1.5);break;
      }
      case 'Teatime':
        cup(ctx,-3,y+7,8,c);berry(ctx,11,y+9,3.6,palettes.ruby);
        for(let i=0;i<2;i++){const pts=[];for(let j=0;j<=8;j++){const t=j/8;pts.push([-5+i*5+Math.sin(t*5+p*4+i)*1.7,y+1-t*(7+4*p)]);}path(ctx,pts,c[2],1.2);}
        break;
      case 'Stockpile':
        for(let i=0;i<6;i++){const row=i<3?0:i<5?1:2,col=i<3?i:i<5?i-3:0;
          const x=(col-(2-row)*.5)*7;berry(ctx,x,7-row*(5+p),3.7,[c,palettes.grass,palettes.ruby][row]);}
        break;
      case 'Stuff Cheeks':
        for(const s of [-1,1]){const x=s*(11-4*p);berry(ctx,x,y+5,4.4,palettes.ruby);
          arc(ctx,x+s*2,y+5,6,5,s===1?-1.15:pi-1.15,s===1?1.15:pi+1.15,c[1],1.5);}
        break;
      case 'Swallow':
        for(let i=0;i<3;i++){const r=10-2.2*i,y0=y+i*4+3*p;arc(ctx,0,y0,r,r*.55,.12,pi-.12,c[1+i%2],1.6);}
        berry(ctx,0,y-9+14*p,3.7,palettes.grass);break;
      case 'Tidy Up':
        tile(ctx,-6+12*p,y+3,1,.43-.6*p,()=>{
          line(ctx,[[0,-13],[0,3]],palettes.mud,2.5);
          polygon(ctx,[[-2,1],[2,1],[7,10],[-7,10]],palettes.gold[1]);
          for(let i=-1;i<=1;i++)path(ctx,[[i,4],[i*3,9]],palettes.mud[0],1);});
        for(let i=0;i<3;i++)glint(ctx,-12+i*8,8-(i%2)*5,2+i*.35,c);break;
    }
  }

  function element(ctx,e,age,c){
    const p=progress(age),v=swing(p);
    switch(e.move){
      case 'Soak':
        for(let i=-2;i<=2;i++){const u=clamp(p*1.4-Math.abs(i)*.13),x=i*5;
          path(ctx,[[x,-18+10*u],[x-1,-11+12*u]],c[1],2);
          drop(ctx,x-1,-10+14*u,2.9,c);}
        ring(ctx,0,7,8+10*p,2+3*p,c[2],1.8);break;
      case 'Water Sport':
        for(const s of [-1,1]){const pts=[];for(let i=0;i<=12;i++){const u=i/12;pts.push([s*(3+u*(8+8*p)),5-12*swing(u)+u*3]);}
          path(ctx,pts,c[1],2);drop(ctx,s*(11+8*p),6,2.6,c);}
        ring(ctx,0,8,10+7*p,3.6,c[2],1.8);break;
      case 'Mud Sport':
        for(let i=0;i<6;i++){const a=i*turn/6+.24,x=(7+8*p)*Math.cos(a),y=4+(4+5*p)*Math.sin(a);
          ctx.beginPath();ctx.ellipse(x,y,4.5+(i%2),2.5,.28*i,0,turn);ctx.fillStyle=c[i%2];ctx.fill();}
        for(let i=-1;i<=1;i++)drop(ctx,i*7,1-7*v+Math.abs(i)*2,2,c);break;
      case 'Sand Attack':
        for(let i=0;i<16;i++){const u=i/15,x=-17+u*(17+16*p),y=6-i%4-u*(3+(i*9)%16)-6*v*u;
          const r=1.1+i%3*.42;polygon(ctx,[[x-r,y],[x,y-r],[x+r,y+.2],[x,y+r*.65]],c[i%3]);}
        for(let i=0;i<2;i++)arc(ctx,-15,10,12+i*5,9+i*3,-1.26,-.32,c[1],1.25);break;
      case 'Tar Shot':
        for(let i=0;i<7;i++){const a=i*turn/7,x=8*Math.cos(a),y=4*Math.sin(a);
          disc(ctx,x,y-3,4+1.1*v,i%2?'#51424b':'#302e39');}
        for(let i=-1;i<=1;i++){const x=i*6;path(ctx,[[x,-3],[x,4+6*p-Math.abs(i)*2]],'#423642',3.5);}
        arc(ctx,-2,-4,7,4,pi+.25,turn-.4,c[1],1.5);break;
      case 'Smokescreen':
        for(let i=0;i<6;i++){const a=i*turn/6+p*.38,r=6+8*p;
          cloud(ctx,r*Math.cos(a),r*.56*Math.sin(a)-6*p,5+2*v,['#424657','#727785','#a7b1b9']);}break;
      case 'Spider Web':
        for(let i=-2;i<=2;i++){const x=i*8*(.55+.45*p);line(ctx,[[0,-13],[x,9-Math.abs(i)*2]],c,1.9);}
        for(let row=1;row<=3;row++){const pts=[];for(let j=-4;j<=4;j++){
          const t=row/3;pts.push([j*4*t*(.55+.45*p),-13+(21-Math.abs(j)*.9)*t+(j%2?1.4:0)]);}path(ctx,pts,c[1],1.35);}
        disc(ctx,0,2+9*p,2.2,c[0]);break;
      case 'Gastro Acid':
        for(let i=0;i<3;i++){const u=clamp(1.28*p-i*.14);drop(ctx,(i-1)*6,-18+18*u,3.1-i*.2,c);}
        arc(ctx,0,5,12,4,.05,pi-.05,c[1],2);
        for(const s of [-1,1])ring(ctx,s*8,-1-4*p,2.6,2.6,c[2],1.2);break;
      case 'Powder':
        for(let i=0;i<13;i++){const a=i*2.4,r=4+((i*3)%10)+4*p,x=r*Math.cos(a),y=r*.74*Math.sin(a)-5+7*p;
          if(i%3)disc(ctx,x,y,1.45+.2*(i%3),c[1]);else glint(ctx,x,y,2.5,c);}
        arc(ctx,0,5,12,3.8,.18,pi-.18,c[1],1.3);break;
      case 'Rage Powder':
        for(let i=0;i<9;i++){const a=i*2.4+p*.52,r=17-6*p,x=r*Math.cos(a),y=r*.78*Math.sin(a)-2;
          disc(ctx,x,y,2+(i%2)*.7,c[1]);path(ctx,[[x*1.22,y*1.22],[x,y]],palettes.mud[2],1);}
        line(ctx,[[-4,-10],[-3,-4],[1,-6],[4,-2],[4,-9]],c,2.3);break;
      case 'Spicy Extract':
        tile(ctx,0,-4,1,-.26+.35*p,()=>{
          ctx.beginPath();ctx.moveTo(-7,-4);ctx.bezierCurveTo(3,-9,9,-6,8,1);
          ctx.bezierCurveTo(7,7,0,9,-10,8);ctx.bezierCurveTo(-2,6,0,2,-7,-4);ctx.fillStyle=c[1];ctx.fill();
          path(ctx,[[6,-4],[5,-8],[8,-11]],palettes.grass[1],2.2);
          path(ctx,[[5,1],[2,5]],c[2],1.5);});
        for(const s of [-1,1])path(ctx,[[s*11,-3],[s*13,-7],[s*12,-11-3*p]],palettes.fire[1],1.5);break;
      case 'Octolock':
        for(let i=0;i<8;i++){const a=i*pi/4,r=17-4*p,pts=[];
          for(let j=0;j<=10;j++){const t=j/10,b=a+t*.71;
            pts.push([(r-8*t)*Math.cos(b),(r-8*t)*.78*Math.sin(b)]);}
          line(ctx,pts,c,3.2);const [x,y]=pts[7];disc(ctx,x,y,1.35,c[2]);}break;
      case "Forest's Curse":
        for(const s of [-1,1]){const pts=[[s*12,9],[s*(14-p*3),1],[s*11,-5],[s*9,-13-3*p]];
          line(ctx,pts,palettes.mud,3.2);
          for(let j=0;j<3;j++)leaf(ctx,s*(11+(j%2)*4),-1-j*4-2*p,3.4,-s*(.45+j*.28),c);}
        arc(ctx,0,10,13,4,0,pi,c[1],1.5);break;
      case 'Worry Seed':
        tile(ctx,0,-5-5*v,1,-.45+p*.6,()=>{
          drop(ctx,0,1,5,palettes.mud);leaf(ctx,3,-6,4.2,-.54,c);path(ctx,[[-2,3],[0,1]],c[2],1.2);});
        for(const s of [-1,1])arc(ctx,s*7,1,4,4,s===1?-.7:pi-.7,s===1?.6:pi+.6,c[1],1.4);break;
      case 'Magic Powder':
        for(let i=0;i<10;i++){const a=i*2.4+p*1.1,r=5+(i%4)*3+p*2;
          star(ctx,r*Math.cos(a),-5+r*.65*Math.sin(a)+4*p,1.8+i%3*.63,4,a,i%2?c[2]:palettes.psychic[1],.27);}
        arc(ctx,0,-3,15,7,2.4+p,4.3+p,c[1],1.5);break;
      case 'Electrify':
        bolt(ctx,0,-4,9+v*2,c);
        for(let i=0;i<5;i++){const a=i*turn/5+p*.5,x=13*Math.cos(a),y=-3+10*Math.sin(a);
          path(ctx,[[x*.72,y*.72],[x,y],[x+2,y-3],[x+3,y-2]],c[2],1.4);}break;
      case 'Ion Deluge':
        for(let i=0;i<8;i++){const a=i*pi/4+p*.43,x=16*Math.cos(a),y=10*Math.sin(a)-4;
          disc(ctx,x,y,2.6,c[i%2]);path(ctx,[[x-1.4,y],[x+1.4,y]],c[2],.8);
          if(i%2)path(ctx,[[x,y-1.4],[x,y+1.4]],c[2],.8);}
        bolt(ctx,0,-4,5,palettes.aura);break;
      case 'Magnet Rise':
        arc(ctx,0,-3-5*p,8,7,0,pi,c[0],4.5);
        for(const s of [-1,1]){path(ctx,[[s*8,-3-5*p],[s*8,-10-5*p]],s===1?palettes.ruby[1]:palettes.aura[1],4.4);}
        for(let i=0;i<2;i++){const y=5+i*5;arc(ctx,0,y,10+3*i,4,.07,pi-.07,c[1+i],1.6);}break;
    }
  }

  function mask(ctx,x,y,r,c,smile){
    const pts=[[-.9,-.67],[0,-.46],[.89,-.67],[.75,.29],[.32,.8],[-.28,.85],[-.75,.4]];
    polygon(ctx,pts.map(([a,b])=>[x+r*a,y+r*b]),c[0]);
    for(const s of [-1,1])path(ctx,[[x+s*r*.57,y-r*.13],[x+s*r*.2,y-r*.05]],c[2],1.4);
    arc(ctx,x,y+r*(smile?.23:.51),r*.28,r*.16,smile?0:pi,smile?pi:turn,c[1],1.25);
  }
  function identity(ctx,e,age,c){
    const p=progress(age);
    if(e.move==='Conversion'){
      for(let i=0;i<9;i++){const x=(i%3-1)*7+(1-p)*((i*13)%9-4),y=(Math.floor(i/3)-1)*7-4;
        const colors=[c,palettes.mist,palettes.gold][Math.floor(i/3)];ctx.fillStyle=colors[1];ctx.fillRect(x-2.7,y-2.7,5.4,5.4);}
      glint(ctx,-9+18*p,-14,3.6,c);
    }else{
      tile(ctx,0,-4,1,p*pi,()=>{
        polygon(ctx,[[-6,-8],[6,-8],[3,0],[0,3],[-3,0]],c[1]);
        polygon(ctx,[[-6,8],[6,8],[0,2]],palettes.mist[1]);});
      for(const s of [-1,1]){const a=p*pi+s*pi/2;arc(ctx,0,-4,13,13,a,a+1.6,c[1],1.45);
        arrow(ctx,13*Math.cos(a+1.6),-4+13*Math.sin(a+1.6),2.7,a+3.1,c);}
    }
  }
  function exchange(ctx,e,age,c,length){
    const p=progress(age),v=swing(p);
    switch(e.move){
      case 'Conversion 2':
        for(let i=0;i<5;i++){const u=clamp(1-p*1.27+i*.1),x=length*u,y=Math.sin(pi*u+i*.7)*3;
          ctx.fillStyle=[palettes.water[1],palettes.grass[1],c[2]][i%3];ctx.fillRect(x-2,y-2,4,4);}
        for(let i=-1;i<=1;i++)path(ctx,[[i*4-2,-6],[i*4+2,-6]],c[1],1.7);
        break;
      case 'Reflect Type':{
        const a=p*pi*.65;
        for(const s of [-1,1]){const x=s===1?length:0;
          tile(ctx,x,-3,1,s*a,()=>{polygon(ctx,[[-5,-1],[0,-7],[5,-1],[0,5]],c[0]);line(ctx,[[-4,-1],[0,-6],[3,-2]],c,1.6);});}
        for(let i=0;i<3;i++){const u=clamp(1-p*1.3+i*.14);glint(ctx,u*length,3*Math.sin(pi*u),2,c);}
        break;
      }
      case 'Role Play':
        mask(ctx,length,-4,6.2,palettes.ghost,false);mask(ctx,0,-4,5+3*p,c,true);
        for(let j=0;j<3;j++){const u=clamp(1-p*1.22+j*.12);disc(ctx,length*u,-4-6*swing(u),1.45,c[2]);}break;
      case 'Mirror Move':
        tile(ctx,length*.48,-2,1,-.28,()=>{
          const pts=[[-5,-9],[4,-9],[6,-6],[5,7],[2,9],[-5,8],[-7,5]];
          polygon(ctx,pts,c[0]);path(ctx,[...pts,pts[0]],c[2],1.45);
          path(ctx,[[-4,1],[2,-6]],c[1],1.6);});
        for(const s of [-1,1]){const x=length*(s===1?.75:.25);
          leaf(ctx,x,-2-4*v,4.2,s*(.5+p*.37),palettes.wind);}break;
      case 'Doodle':{
        const pts=[];for(let i=0;i<=17;i++){const t=i/17;
          pts.push([length*(1-p)*.18+length*.63*t,Math.sin(t*turn*1.4+p*1.4)*4]);}
        path(ctx,pts,c[0],2);const [x,y]=pts.at(-1);
        tile(ctx,x,y,1,.65,()=>{polygon(ctx,[[0,0],[-2,-3],[-2,-13],[2,-13],[2,-3]],palettes.gold[1]);
          polygon(ctx,[[0,1],[-2,-3],[2,-3]],c[0]);});
        break;
      }
      case 'Heart Swap':
        for(const s of [-1,1]){const u=s===1?p:1-p,x=length*u,y=s*(3+5*v);
          const colors=s===1?palettes.ruby:c,trail=[];
          for(let i=0;i<=8;i++){const t=s===1?Math.max(0,u-i*.022):Math.min(1,u+i*.022);
            trail.push([length*t,s*(3+5*swing(t))]);}
          path(ctx,trail,colors[0],2.5);heart(ctx,x,y,5.3+.6*v,colors[1]);glint(ctx,x-1,y-1,1.9,colors);}
        break;
      case 'Guard Split':
      case 'Power Split':{
        const guard=e.move==='Guard Split';
        for(const s of [-1,1]){const u=.5+s*(.42-.34*v),x=length*u,colors=s===1?c:(guard?palettes.steel:palettes.ruby);
          if(guard){const pts=[[x-5,-6],[x,-8],[x+5,-6],[x+4,0],[x,4],[x-4,0]];polygon(ctx,pts,colors[0]);path(ctx,[...pts,pts[0]],colors[1],1.45);}
          else{
            bolt(ctx,x,-3,7.4,colors);
            line(ctx,[[x,-9],[x+s*3,-12],[x+s*2,-15],[x+s*(5+2*p),-17]],colors,1.8);
          }}
        for(const s of [-1,1])path(ctx,[[length*.5-2,s*2+6],[length*.5+2,s*2+6]],c[2],1.4);
        break;
      }
      case 'Entrainment':
        for(let i=0;i<4;i++){const u=i/3,x=length*u,y=-3+3*Math.sin(p*turn+u*turn);
          tile(ctx,x,y,1,.18*Math.sin(p*turn),()=>{
            path(ctx,[[-3,-3],[0,0],[3,-3]],c[1],1.7);path(ctx,[[0,0],[0,3],[3,5]],c[2],1.5);disc(ctx,0,-4,1.7,c[1]);});}
        break;
      case 'Simple Beam':{
        const end=length*(.18+.82*clamp(p*2.1));line(ctx,[[0,1],[end,1]],c,4.3);
        ring(ctx,end,1,2.4+2*v,5.6,c[2],1.5);
        if(p>.24){const x=length;arc(ctx,x,-6,4.2,4.2,0,pi,c[1],1.4);for(const s of [-1,1])disc(ctx,x+s*2,-7,1,c[2]);}
        break;
      }
    }
  }
});
