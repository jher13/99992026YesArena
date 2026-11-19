/* Persistent battle conditions. All positions and animation phases are derived from the displayed actor. */
(() => {
  'use strict';
  const turn=Math.PI*2,iceFrames=[];
  const limit=(value,min,max)=>Math.max(min,Math.min(max,value));
  const fraction=x=>x-Math.floor(x);

  // Tint the cropped pose in isolation so its transparent pixels stay transparent over any arena.
  function frozenFrame(ctx,image,sx,sy,w,h,dx,dy,dw,dh) {
    let entry=iceFrames.find(f=>f.image===image && f.x===sx && f.y===sy && f.w===w && f.h===h);
    if(!entry){
      const surface=document.createElement('canvas');surface.width=w;surface.height=h;
      const tint=surface.getContext('2d');tint.drawImage(image,sx,sy,w,h,0,0,w,h);
      tint.globalCompositeOperation='source-atop';tint.fillStyle='rgba(48,147,247,0.58)';tint.fillRect(0,0,w,h);
      entry={image,x:sx,y:sy,w,h,surface};iceFrames.push(entry);
      if(iceFrames.length>48)iceFrames.shift();
    }
    ctx.drawImage(entry.surface,0,0,w,h,dx,dy,dw,dh);
  }
  function shape(ctx,pts,fill,edge,width=1) {
    ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.closePath();
    ctx.fillStyle=fill;ctx.fill();if(edge){ctx.lineWidth=width;ctx.strokeStyle=edge;ctx.stroke();}
  }
  function stroke(ctx,pts,color,width) {
    ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  function dot(ctx,x,y,r,color) {
    ctx.beginPath();ctx.arc(x,y,r,0,turn);ctx.fillStyle=color;ctx.fill();
  }
  function fire(ctx,b,t,front) {
    for(let i=0;i<5;i++){
      const a=i*turn/5+t*.85,depth=Math.sin(a);if((depth>=0)!==front)continue;
      const x=Math.cos(a)*b.rx*.88,y=b.h*.38+depth*b.ry*.48;
      const f=b.unit*(.76+.22*Math.sin(t*8+i*1.7)),lean=Math.sin(t*5+i)*2;
      ctx.save();ctx.translate(x,y);ctx.scale(f,f);
      shape(ctx,[[-4,1],[-5,-3],[-3,-7],[-2,-5],[lean,-13],[lean+2,-9],[2,-4],[4,-7],[5,-3],[4,1],[1,3],[-2,3]],'#ed6730','#963e32',1);
      shape(ctx,[[-2,1],[-2,-3],[0,-2],[1,-7],[2,-4],[3,-2],[2,1],[0,2]],'#ffd661');
      const u=fraction(t*1.1+i*.29);
      ctx.fillStyle=u<.63?'#ffba49':'#ffe68f';ctx.fillRect(lean+1+Math.sin(u*4),-7-8*u,1.7,2.1);
      ctx.restore();
    }
  }
  function staticArcs(ctx,b,t,front) {
    for(let i=0;i<4;i++){
      if((i%2===0)!==front)continue;
      const s=i<2?-1:1,beat=fraction(t*1.15+i*.28),tick=Math.floor(beat*7);
      const y=b.h*(-.26+(i%2)*.36)+Math.sin(t*4+i)*2;
      const x=s*(b.rx*.84+(tick%3)*b.unit);
      const j=b.unit*(.81+(tick%2)*.28);
      const points=[[x,y-7*j],[x+s*4*j,y-3*j],[x+s*j,y],[x+s*6*j,y+2*j],[x+s*2*j,y+7*j]];
      ctx.save();ctx.globalAlpha*=beat<.58 ? .96 : .52;
      stroke(ctx,points,'#9a622a',3.6*j);stroke(ctx,points,'#ffdf4f',2.2*j);stroke(ctx,points.slice(1,4),'#fffbd2',.85*j);
      if(beat<.28)stroke(ctx,[points[2],[x-s*2*j,y+2*j],[x-s*3*j,y+j]],'#ffefa1',1.4*j);
      ctx.restore();
    }
  }
  function bubbles(ctx,b,t,front) {
    for(let i=0;i<7;i++){
      if((i%2===0)!==front)continue;
      const u=fraction(t*.73+i/7),s=i%3===1?-1:1,side=i%2?s:-s;
      const x=side*(b.rx*(.57+.29*Math.sin(i*1.9)**2)+Math.sin(u*turn+i)*2*b.unit);
      const y=b.h*(.45-u*.84),r=(2.1+2*u+i%2*.55)*b.unit;
      ctx.save();ctx.globalAlpha*=Math.min(1,(1-u)*10,.35+u*6);
      ctx.beginPath();ctx.arc(x,y,r,0,turn);
      if(u<.86){ctx.fillStyle='#9845b8';ctx.fill();dot(ctx,x-r*.3,y-r*.34,Math.max(.8,r*.26),'#f7c8ff');}
      ctx.lineWidth=1.4*b.unit;ctx.strokeStyle=u<.86?'#642b88':'#d68deb';
      ctx.beginPath();ctx.arc(x,y,r,0,turn);ctx.stroke();
      if(u>.86){dot(ctx,x+r+2,y-2,b.unit,'#e2a4f0');dot(ctx,x-r-1,y+2,b.unit*.8,'#cd8be7');}
      ctx.restore();
    }
  }
  function shell(ctx,b,t,front) {
    const w=b.rx,h=b.h,pts=[[-w*.9,h*.35],[-w,-h*.09],[-w*.68,-h*.45],[-w*.18,-h*.53],
      [w*.39,-h*.51],[w*.90,-h*.30],[w,h*.12],[w*.71,h*.48],[-w*.33,h*.50]];
    if(!front){
      for(const s of [-1,1]){
        const x=s*w*.82;shape(ctx,[[x,h*.4],[x-s*w*.12,-h*.08],[x+s*w*.14,-h*.38],[x+s*w*.24,h*.08],[x+s*w*.13,h*.4]],'#79caf4a6','#cefcffb0',1);
      }
      shape(ctx,pts,'#73bff945');return;
    }
    shape(ctx,pts,'#94dbff29','#b9f3ffe0',1.5*b.unit);
    shape(ctx,[pts[1],pts[2],[-w*.37,-h*.22],pts[0]],'#a9eaff50');
    shape(ctx,[pts[5],pts[6],pts[7],[w*.52,h*.15]],'#72beed80');
    shape(ctx,[pts[0],[-w*.12,h*.32],pts[7],pts[8]],'#b5f8ff67');
    stroke(ctx,[pts[2],[-w*.37,-h*.22],[-w*.45,-h*.05]],'#d6fbffbd',1.4*b.unit);
    stroke(ctx,[pts[5],[w*.54,-h*.14],[w*.58,-h*.02]],'#e4ffffad',1.1*b.unit);
    const u=fraction(t*.62);
    // A narrow reflection travels across the ice face while the silhouette stays still.
    ctx.save();
    ctx.beginPath();ctx.moveTo(...pts[0]);for(const point of pts.slice(1))ctx.lineTo(...point);ctx.closePath();ctx.clip();
    const gloss=w*(-1.25+2.5*u);
    ctx.globalAlpha*=.42*Math.sin(Math.PI*u)**2;
    stroke(ctx,[[gloss-w*.25,h*.53],[gloss+w*.25,-h*.53]],'#e8ffff',3.2*b.unit);
    ctx.restore();
    const x=-w*.50,y=-h*.34,gleam=(2.2+3.1*Math.sin(Math.PI*u)**4)*b.unit;
    stroke(ctx,[[x-gleam,y],[x+gleam,y]],'#f4ffff',1.1*b.unit);
    stroke(ctx,[[x,y-gleam],[x,y+gleam]],'#f4ffff',1.1*b.unit);
  }
  function sleep(ctx,b,t,mirror) {
    const roomRight=ctx.canvas.width-b.x,roomLeft=b.x;
    // Keep each Z readable, even on the mirrored guest board or beside a wall.
    const side=roomRight<b.rx+23*b.unit?-1:roomLeft<b.rx+23*b.unit?1:mirror;
    for(let i=0;i<3;i++){
      const u=fraction(t*.58+i/3),s=(2.8+2.8*u)*b.unit;
      const worldX=limit(b.x+side*(b.rx*.67+(5+12*u)*b.unit),s+1,ctx.canvas.width-s-1);
      const x=(worldX-b.x)*mirror,y=Math.max(s+2-b.y,-b.h*.16-(4+14*u)*b.unit);
      ctx.save();ctx.translate(x,y);ctx.scale(mirror,1);ctx.globalAlpha*=Math.min(1,(1-u)*6,.3+5*u);
      const z=[[-s,-s*.72],[s,-s*.72],[-s,s*.72],[s,s*.72]];
      stroke(ctx,z,'#3f355b',3.1*b.unit);stroke(ctx,z,'#f1e6ff',1.55*b.unit);
      ctx.restore();
    }
  }
  function stars(ctx,b,t,front) {
    const base=Math.max(8-b.y,-b.h*.43),r=b.rx*.91;
    for(let i=0;i<4;i++){
      const a=t*3.65+i*turn/4,depth=Math.sin(a);if((depth>=0)!==front)continue;
      const x=r*Math.cos(a),y=base+depth*(4*b.unit),size=(4.1+.75*depth)*b.unit,pts=[];
      for(let k=0;k<10;k++){const ang=k*turn/10-Math.PI/2+.21*Math.sin(a),len=size*(k%2 ? .44 : 1);pts.push([x+Math.cos(ang)*len,y+Math.sin(ang)*len]);}
      const trail=[];for(let k=0;k<=5;k++){const ang=a-.65+k*.08;trail.push([r*Math.cos(ang),base+Math.sin(ang)*4*b.unit]);}
      stroke(ctx,trail,'#655273a3',1.9*b.unit);
      stroke(ctx,trail,'#ffe2a0',.85*b.unit);
      shape(ctx,pts,i%2?'#ffdc56':'#fff5a1','#614367',1.3*b.unit);
    }
  }
  function draw(ctx,b,t,front,mirrored=false) {
    const mirror=mirrored?-1:1;
    ctx.save();ctx.translate(b.x,b.y);ctx.scale(mirror,1);ctx.lineCap='round';ctx.lineJoin='round';
    switch(b.ailment){
      case 1: staticArcs(ctx,b,t,front);break;
      case 2: if(front)sleep(ctx,b,t,mirror);break;
      case 3: shell(ctx,b,t,front);break;
      case 4: fire(ctx,b,t,front);break;
      case 5: bubbles(ctx,b,t,front);break;
    }
    if(b.ailment===6 || b.puppeted)stars(ctx,b,t,front);
    ctx.restore();
  }
  function bounds(x,y,width,height,ailment,puppeted) {
    return {x,y,h:Math.max(20,height),rx:Math.max(11,width*.5+2),
      ry:limit(width*.19,4,21),unit:limit(Math.sqrt(Math.max(20,height)/38),.86,1.85),ailment,puppeted};
  }
  globalThis.ArenaStatusEffects={bounds,draw,frozenFrame};
})();
