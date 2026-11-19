/* Native pixel scenery for Arena. Decorative terrain never adds collision bodies. */
(()=>{
 'use strict';
 const themes={
  Grass:{base:'#829c53',light:'#8ca65a',dark:'#6f8a47',edge:'#3c583b',path:'#baad77',accent:'#cad989',kind:'grass',zone:'#477747',name:'Grassland Plains'},
  Water:{base:'#879c83',light:'#99ab8a',dark:'#758c77',edge:'#385f63',path:'#b7b394',accent:'#9fd4d5',kind:'wetland',zone:'#538e9c',name:'Flooded Wasteland'},
  Fire:{base:'#625b54',light:'#72695d',dark:'#514c48',edge:'#353739',path:'#8b7b65',accent:'#edac68',kind:'volcanic',zone:'#9f5540',name:'Volcanic Basin'},
  Normal:{base:'#a49d87',light:'#b6ae96',dark:'#938d7a',edge:'#5e6957',path:'#c7bfa3',accent:'#ddd3ac',kind:'court',zone:'#c4b69a',name:'Stone Court'},
  Electric:{base:'#9d9a5d',light:'#b1ad6a',dark:'#8d8d56',edge:'#4f5e4b',path:'#b6a676',accent:'#e6d884',kind:'storm',zone:'#b6a85b',name:'Storm Fields'},
  Ice:{base:'#c3d3cd',light:'#d7e1d9',dark:'#acbfc0',edge:'#647f89',path:'#b3c5c2',accent:'#e7f1e8',kind:'snow',zone:'#88b4c3',name:'Frozen Reach'},
  Fighting:{base:'#b6a47f',light:'#c7b58a',dark:'#a59473',edge:'#685e4f',path:'#d1bd94',accent:'#dec99b',kind:'dojo',zone:'#9f8969',name:'Training Grounds'},
  Poison:{base:'#727b62',light:'#81896e',dark:'#626d59',edge:'#3d514a',path:'#97967c',accent:'#b5be82',kind:'marsh',zone:'#807190',name:'Toxic Marsh'},
  Ground:{base:'#b89a73',light:'#c5aa80',dark:'#a78c69',edge:'#80654f',path:'#d1b78c',accent:'#e0c69b',kind:'desert',zone:'#b08461',name:'Badlands'},
  Flying:{base:'#9cae7f',light:'#b0bc8b',dark:'#889d74',edge:'#5c716c',path:'#bfc1a0',accent:'#d9d9af',kind:'cliffs',zone:'#9cae79',name:'Highland Cliffs'},
  Psychic:{base:'#858898',light:'#979aa7',dark:'#747b8e',edge:'#49576a',path:'#a5a6ad',accent:'#c8b9e1',kind:'astral',zone:'#9991b0',name:'Astral Ruins'},
  Bug:{base:'#6c8b50',light:'#7d995a',dark:'#5d7b44',edge:'#334d37',path:'#a89d70',accent:'#c1c57d',kind:'grove',zone:'#527843',name:'Overgrown Grove'},
  Rock:{base:'#a59b84',light:'#b6ac93',dark:'#938b77',edge:'#6b6e64',path:'#c1b393',accent:'#d1c7ac',kind:'quarry',zone:'#9b937e',name:'Quarry'},
  Ghost:{base:'#697a7b',light:'#7d8a88',dark:'#5b6b6e',edge:'#3a4d53',path:'#8a9691',accent:'#abbec0',kind:'haunted',zone:'#7a7c96',name:'Haunted Hollow'},
  Dragon:{base:'#82958c',light:'#94a69a',dark:'#70847c',edge:'#435e60',path:'#aeb6a0',accent:'#c0cfb0',kind:'spire',zone:'#829e99',name:'Dragon Spire'},
  Dark:{base:'#667769',light:'#758675',dark:'#58695e',edge:'#334a46',path:'#899181',accent:'#a9b59c',kind:'vale',zone:'#566a66',name:'Moonless Vale'},
  Steel:{base:'#899390',light:'#9da6a0',dark:'#76827f',edge:'#4b615f',path:'#acb3a8',accent:'#d1cfa8',kind:'factory',zone:'#a1aaa4',name:'Ironworks'},
  Fairy:{base:'#9daa87',light:'#afba96',dark:'#8a9b79',edge:'#5c7967',path:'#c4bea0',accent:'#e4d6c3',kind:'fairy',zone:'#a4b48f',name:'Fairy Glade'},
 };
 const cache=new Map();let builds=0;
 const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 function hash(text){let value=2166136261;for(const char of text)value=Math.imul(value^char.charCodeAt(0),16777619);return value>>>0;}
 const choose=(random,list)=>list[Math.floor(random()*list.length)];
 const rect=(ctx,x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,Math.max(2,Math.round(w/2)*2),Math.max(2,Math.round(h/2)*2));};
 function polygon(ctx,points,color,stroke=null,width=2){
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
 }
 function oval(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
 function stroke(ctx,points,color,width=2){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
 function trail(ctx,points,color,width){
  ctx.beginPath();ctx.moveTo(...points[0]);
  for(let i=1;i<points.length-1;i++)ctx.quadraticCurveTo(...points[i],(points[i][0]+points[i+1][0])/2,(points[i][1]+points[i+1][1])/2);
  ctx.lineTo(...points.at(-1));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();
 }
 function tuft(ctx,x,y,size,color,light){
  polygon(ctx,[[x-size,y],[x-size*.75,y-size*.65],[x-size*.2,y-size*.15],[x,y-size],[x+size*.25,y-size*.2],[x+size*.85,y-size*.6],[x+size,y]],color);
  rect(ctx,x-size*.15,y-size*.55,2,size*.4,light);
 }
 function shrub(ctx,x,y,size,colors,random){
  oval(ctx,x,y+size*.2,size*1.1,size*.44,colors[0]);
  for(let i=0;i<6;i++){
   const a=i*Math.PI/3,r=size*(.25+random()*.2);
   oval(ctx,x+Math.cos(a)*r,y-size*.18+Math.sin(a)*r*.55,size*(.44+random()*.2),size*(.32+random()*.14),i%2?colors[1]:colors[2]);
  }
  rect(ctx,x-size*.4,y-size*.45,4,2,colors[3]);rect(ctx,x+size*.3,y-size*.15,2,2,colors[3]);
 }
 function tree(ctx,x,y,size,random,blossom=false,pine=false){
  oval(ctx,x+5,y+size*.3,size*.85,size*.45,'#243c3338');
  rect(ctx,x-3,y-size*.1,6,size*.5,'#716148');
  if(pine){
   for(let layer=0;layer<3;layer++){
    const w=size*(.8-layer*.17),top=y-size*.9-layer*size*.23;
    polygon(ctx,[[x,top],[x+w,top+size*.75],[x-w,top+size*.75]],layer%2?'#4c7060':'#365b4d');
    if(blossom)stroke(ctx,[[x-w*.65,top+size*.55],[x,top+size*.4],[x+w*.55,top+size*.55]],'#d1dfd3',3);
   }
  }else shrub(ctx,x,y-size*.4,size,blossom?['#796477','#d3a3af','#bc899e','#e9c9c6']:['#2c4936','#507647','#41653e','#799354'],random);
 }
 function stone(ctx,x,y,size,random,color='#92988a'){
  polygon(ctx,[[x-size,y],[x-size*.7,y-size*.55],[x+size*.15,y-size*.75],[x+size,y-size*.3],[x+size*.8,y+size*.25],[x-size*.65,y+size*.3]],color,'#4a5b4b55',2);
  stroke(ctx,[[x-size*.6,y-size*.4],[x+size*.1,y-size*.55],[x+size*.65,y-size*.25]],'#e8dfbd55',2);
  if(random()>.5)rect(ctx,x-size*.4,y+size*.05,size*.6,2,'#4f625655');
 }
 function bloom(ctx,x,y,size,color){rect(ctx,x,y,2,size+2,'#5a784c');rect(ctx,x-size*.5,y-size*.3,size,size*.6,color);rect(ctx,x-size*.2,y-size*.6,size*.4,size*1.1,color);rect(ctx,x,y-size*.1,2,2,'#eadca6');}
 function zonePoints(zone){
  if(zone.vertices?.length)return zone.vertices.map(([x,y])=>[zone.x+x*(zone.w??zone.r),zone.y+y*(zone.h??zone.r)]);
  const w=zone.w??zone.r??65,h=zone.h??zone.r??55;
  if(zone.shape==='rectangle')return [[zone.x-w,zone.y-h],[zone.x+w,zone.y-h],[zone.x+w,zone.y+h],[zone.x-w,zone.y+h]];
  if(zone.shape==='diamond')return [[zone.x,zone.y-h],[zone.x+w,zone.y],[zone.x,zone.y+h],[zone.x-w,zone.y]];
  return Array.from({length:40},(_,i)=>{const angle=i*Math.PI/20;return [zone.x+Math.cos(angle)*w,zone.y+Math.sin(angle)*h];});
 }
 function traceZone(ctx,zone,grow=0){
  ctx.beginPath();
  if(zone.patches?.length){
   for(const [x,y,rx,ry] of zone.patches){
    const cx=zone.x+x*zone.w,cy=zone.y+y*zone.h,w=rx*zone.w+grow,h=ry*zone.h+grow;
    ctx.moveTo(cx+w,cy);ctx.ellipse(cx,cy,w,h,0,0,Math.PI*2);ctx.closePath();
   }
  }else {const points=zonePoints(zone);points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
 }
 function paving(ctx,t,random,width,height,metal=false){
  const tile=metal?62:34;
  for(let y=-tile;y<height+tile;y+=tile)for(let x=-tile;x<width+tile;x+=tile){
   const sx=x+(Math.floor(y/tile)%2?tile/2:0),sy=y;
   rect(ctx,sx,sy,tile-2,tile-2,choose(random,[t.base,t.base,t.base,t.light]));
   rect(ctx,sx+2,sy+2,tile-6,2,'#e2debd27');
   if(metal){for(const dx of [6,tile-8])for(const dy of [6,tile-8])rect(ctx,sx+dx,sy+dy,2,2,'#415c5588');}
   else if(random()<.23)stroke(ctx,[[sx+3,sy+tile*.6],[sx+tile*.38,sy+tile*.4],[sx+tile*.6,sy+tile*.5]],'#53675144',2);
  }
 }
 function landscape(ctx,t,random,width,height){
  rect(ctx,0,0,width,height,t.base);
  const built=['court','dojo','astral','factory','spire'].includes(t.kind);
  if(built && t.kind!=='dojo')paving(ctx,t,random,width,height,t.kind==='factory');
  else{
   // Broad tonal patches and fine pixel texture replace the old checkerboard.
   for(let i=0;i<130;i++)oval(ctx,random()*width,random()*height,15+random()*55,8+random()*24,choose(random,[t.dark+'22',t.light+'33',t.dark+'14']));
   for(let i=0;i<4700;i++)rect(ctx,random()*width,random()*height,2+random()*4,2,choose(random,[t.dark+'60',t.light+'88',t.light+'40',t.base]));
  }
  if(['grass','grove','fairy','cliffs','wetland','storm','marsh','vale','haunted'].includes(t.kind)){
   const mid=height*(.43+random()*.18);
   const points=[[-12,mid+36],[width*.2,mid+32],[width*.43,mid-34],[width*.66,mid-20],[width*.84,mid+32],[width+12,mid+48]];
   trail(ctx,points,t.dark+'55',27);trail(ctx,points,t.path+'80',21);trail(ctx,points,t.light+'44',9);
   for(let i=0;i<900;i++){
    const x=random()*width,y=random()*height;
    if(t.kind==='marsh' || t.kind==='wetland')tuft(ctx,x,y,3+random()*4,t.dark,t.light);
    else tuft(ctx,x,y,3+random()*5,t.dark+'bb',t.light);
    if(i%14===0 && ['grass','grove','fairy'].includes(t.kind))bloom(ctx,x,y,3,t.kind==='fairy'?'#ecc2d2':choose(random,['#e5deb3','#c8b77e','#cfbdc7']));
   }
  }
  if(['desert','quarry','volcanic','storm'].includes(t.kind)){
   for(let i=0;i<34;i++){
    const x=random()*width,y=random()*height;
    if(t.kind==='desert')stroke(ctx,[[x,y],[x+14,y-4],[x+36,y-3],[x+51,y-8]],t.light+'99',2);
    else if(t.kind==='volcanic')stroke(ctx,[[x,y],[x+8,y+7],[x+13,y+5],[x+25,y+13]],t.dark,2);
    else stone(ctx,x,y,2+random()*3,random,t.dark);
   }
  }
  if(t.kind==='snow'){
   for(let i=0;i<90;i++)oval(ctx,random()*width,random()*height,8+random()*24,2+random()*8,choose(random,['#e1e8dc88','#91b3bb44']));
  }
  if(t.kind==='dojo'){
   for(let y=50;y<height-30;y+=8)stroke(ctx,[[36,y],[width-36,y]],'#dac7a122',2);
   for(let i=0;i<18;i++){const x=40+random()*(width-80),y=45+random()*(height-90);stroke(ctx,[[x,y],[x+16,y]],'#897d6244',2);}
  }
  if(['astral','spire'].includes(t.kind)){
   for(let i=0;i<16;i++){const x=32+random()*(width-64),y=32+random()*(height-64);tuft(ctx,x,y,4,'#526d5c','#a6baa1');}
  }
  landmarks(ctx,t,random,width,height);
 }
 function landmarks(ctx,t,random,width,height){
  if(['grass','grove','fairy'].includes(t.kind))for(let i=0;i<16;i++){
   const x=40+random()*(width-80),y=40+random()*(height-80);
   for(let j=0;j<10;j++)bloom(ctx,x+(random()-.5)*30,y+(random()-.5)*16,3+random()*2,t.kind==='fairy'?choose(random,['#efbfd1','#e9d8e6','#f3deac']):choose(random,['#d3d395','#e8dfbb','#b5bf79']));
  }
  if(t.kind==='volcanic'){
   for(const edge of [1,-1]){
    const points=Array.from({length:25},(_,i)=>[i*width/24,edge===1?20+random()*18:height-20-random()*18]);
    stroke(ctx,points,'#413d3c',16);stroke(ctx,points,'#c67b4c',7);stroke(ctx,points,'#f1b46a',2);
   }
   for(let i=0;i<50;i++){const x=random()*width,y=random()<.5?25+random()*30:height-25-random()*30;stone(ctx,x,y,4+random()*5,random,'#544f4b');}
  }
  if(t.kind==='wetland' || t.kind==='marsh')for(let i=0;i<80;i++){
   const x=25+random()*(width-50),y=25+random()*(height-50);
   oval(ctx,x,y,7+random()*10,2,choose(random,[t.dark+'55',t.light+'66']));
   if(i%4===0){stroke(ctx,[[x,y],[x+17,y]],'#c3c7a477',3);tuft(ctx,x+4,y,7,t.dark,t.light);}
  }
  if(t.kind==='desert' || t.kind==='quarry'){
   for(let band=0;band<3;band++)for(const side of [0,1]){
    const y=side?height-7-band*9:7+band*9;
    const points=Array.from({length:25},(_,i)=>[i*width/24,y+Math.sin(i*.7)*5+random()*3]);
    stroke(ctx,points,t.kind==='desert'?['#8d7056','#b5916b','#d4b58b'][band]:['#6f7668','#8e927e','#b6b39a'][band],8);
   }
   if(t.kind==='desert')for(let i=0;i<20;i++){
    const x=30+random()*(width-60),y=random()<.5?27:height-25;
    rect(ctx,x,y-9,5,12,'#668154');rect(ctx,x-5,y-7,5,4,'#668154');rect(ctx,x-5,y-11,3,7,'#809766');rect(ctx,x+1,y-7,2,9,'#91a16b');
   }
  }
  if(t.kind==='haunted' || t.kind==='vale'){
   for(let i=0;i<22;i++){
    const x=35+random()*(width-70),y=random()<.5?22:height-22;
    if(t.kind==='haunted'){
     rect(ctx,x-5,y-10,11,13,'#889592');oval(ctx,x+.5,y-10,5.5,4,'#889592');rect(ctx,x-2,y-8,2,7,'#576e70');rect(ctx,x-4,y-6,6,2,'#576e70');
     rect(ctx,x-8,y+3,17,3,'#4e6361');
    }else {stroke(ctx,[[x-10,y],[x+9,y-2]],'#8a8b6b',4);stroke(ctx,[[x,y],[x+4,y-8]],'#7c8468',2);}
   }
  }
  if(t.kind==='astral' || t.kind==='spire')for(let i=0;i<22;i++){
   const x=25+random()*(width-50),y=random()<.5?23:height-23;
   polygon(ctx,[[x-4,y+2],[x-3,y-11],[x+2,y-16],[x+6,y-7],[x+4,y+2]],t.kind==='astral'?'#aba3bd':'#7da99c');
   stroke(ctx,[[x+2,y-14],[x+2,y]],t.accent,2);
  }
  if(t.kind==='factory')for(const y of [10,height-10]){
   stroke(ctx,[[25,y],[width-25,y]],'#4e6661',10);stroke(ctx,[[25,y-2],[width-25,y-2]],'#adb7a8',3);
   for(let x=40;x<width;x+=66)rect(ctx,x,y-7,6,14,'#687e73');
  }
 }
 function zoneScenery(ctx,zone,t,index){
  const random=rng((zone.seed??hash(JSON.stringify(zone)))+index*7919),w=zone.w??zone.r??65,h=zone.h??zone.r??55;
  const water=['wetland','marsh','snow','volcanic'].includes(t.kind);
  ctx.save();traceZone(ctx,zone,3);ctx.fillStyle=water?t.path:t.dark;ctx.fill();
  traceZone(ctx,zone);ctx.clip();
  rect(ctx,zone.x-w-8,zone.y-h-8,w*2+16,h*2+16,t.zone);
  if(water){
   const waterColor=t.kind==='volcanic'?'#b76843':t.kind==='snow'?'#97c2cd':t.zone;
   rect(ctx,zone.x-w,zone.y-h,w*2,h*2,waterColor);
   for(let i=0;i<65;i++){
    const x=zone.x+(random()*2-1)*w,y=zone.y+(random()*2-1)*h;
    if(t.kind==='snow')stroke(ctx,[[x,y],[x+10,y-5],[x+22,y-2]],'#e5f1e489',2);
    else rect(ctx,x,y,4+random()*15,2,t.kind==='volcanic'?choose(random,['#e6a05c','#dc8b4e','#894938']):choose(random,['#c2ddd066','#a8d1cc77','#32637533']));
   }
   if(t.kind==='wetland' || t.kind==='marsh')for(let i=0;i<18;i++){
    const x=zone.x+(random()*2-1)*w,y=zone.y+(random()*2-1)*h;
    if(i%3===0){oval(ctx,x,y,4,2,t.kind==='marsh'?'#9aab6a':'#8aa965');rect(ctx,x+2,y,2,2,t.zone);}
    else tuft(ctx,x,y,6,t.kind==='marsh'?'#8e9d68':'#638765','#b5bc86');
   }
  }else if(['grass','grove','fairy','vale','haunted'].includes(t.kind)){
   const colors=t.kind==='haunted'?['#586474','#7d829d','#6b7690','#a5b0bd']:t.kind==='vale'?['#435b53','#6e8271','#5e7565','#9caa85']:['#335c39','#5a8649','#48773f','#87a859'];
   if(zone.patches?.length)for(const [x,y,rx] of [...zone.patches].sort((a,b)=>a[1]-b[1]))
    shrub(ctx,zone.x+x*w,zone.y+y*h,rx*w*.98,colors,random);
   else for(let i=0;i<35;i++)shrub(ctx,zone.x+(random()*2-1)*w,zone.y+(random()*2-1)*h,10+random()*10,colors,random);
   for(let i=0;i<95;i++){
    const x=zone.x+(random()*2-1)*w,y=zone.y+(random()*2-1)*h;
    tuft(ctx,x,y,4,t.kind==='haunted'?'#768498':'#79a057','#a6bc75');
    if(t.kind==='fairy' && i%2===0)bloom(ctx,x,y,6,choose(random,['#edc0cd','#dcd5ed','#f3dfae']));
    if(t.kind==='grove' && i%6===0){rect(ctx,x,y,2,5,'#c6b793');oval(ctx,x,y,4,2,'#b78869');}
   }
  }else if(t.kind==='factory'){
   for(let y=-h;y<h;y+=10){rect(ctx,zone.x-w,zone.y+y,w*2,4,'#566e68');rect(ctx,zone.x-w,zone.y+y+4,w*2,2,'#bbc6b1');}
   for(let y=-h;y<h;y+=20)for(let x=-w;x<w;x+=18)rect(ctx,zone.x+x,zone.y+y,4,4,'#d2c99a');
  }else if(t.kind==='astral' || t.kind==='spire'){
   paving(ctx,{...t,base:t.zone,light:t.light,dark:t.dark},random,zone.x+w,zone.y+h);
   for(let i=-2;i<=2;i++){
    const x=zone.x+i*19,y=zone.y+(i%2)*12;
    stroke(ctx,[[x-5,y+8],[x-5,y-8],[x+4,y-8],[x+4,y],[x+10,y]],t.accent,2);
    rect(ctx,x-7,y+10,20,2,t.accent+'88');
   }
  }else if(t.kind==='cliffs' || t.kind==='storm'){
   for(let i=0;i<120;i++)tuft(ctx,zone.x+(random()*2-1)*w,zone.y+(random()*2-1)*h,6+random()*5,t.kind==='storm'?'#8e8750':'#7f9864',t.accent);
   if(t.kind==='storm')for(let i=0;i<5;i++){const x=zone.x+(random()*2-1)*w,y=zone.y+(random()*2-1)*h;polygon(ctx,[[x,y-7],[x+3,y],[x+1,y+7],[x-2,y]],'#d9cf8b');}
  }else{
   for(let i=0;i<95;i++){
    const x=zone.x+(random()*2-1)*w,y=zone.y+(random()*2-1)*h;
    rect(ctx,x,y,3+random()*7,2,choose(random,[t.light,t.dark,t.accent+'88']));
    if(t.kind==='desert' && i%8===0)stroke(ctx,[[x,y],[x+4,y-6],[x+12,y-4]],'#8b725c',2);
    if(t.kind==='quarry' && i%5===0)stone(ctx,x,y,3+random()*4,random,'#b7b39d');
   }
   if(t.kind==='court')for(let x=-2;x<=2;x++)for(let y=-1;y<=1;y++)rect(ctx,zone.x+x*21-5,zone.y+y*23-5,10,10,t.light);
  }
  ctx.restore();
 }
 function border(ctx,t,random,width,height){
  // Taller props sit outside the playable interior; there are no scenery hitboxes.
  if(['cliffs','spire','desert','quarry','volcanic'].includes(t.kind)){
   polygon(ctx,[[0,0],[width,0],[width,19],[0,19]],t.edge);
   polygon(ctx,[[0,height-19],[width,height-19],[width,height],[0,height]],t.edge);
   for(let x=0;x<width;x+=18){
    rect(ctx,x,8+random()*8,12,4,t.dark);rect(ctx,x,height-12-random()*8,14,4,t.light);
    if(t.kind==='cliffs' || t.kind==='spire')rect(ctx,x,height-8,8,6,'#c1d0c1');
   }
  }else{
   rect(ctx,0,0,width,16,t.edge);rect(ctx,0,height-16,width,16,t.edge);
  }
  rect(ctx,0,0,18,height,t.edge);rect(ctx,width-18,0,18,height,t.edge);
  const vegetation=['grass','grove','fairy','wetland','marsh','vale','haunted','snow','cliffs','storm'].includes(t.kind);
  for(let x=18;x<width;x+=37+random()*18){
   const top=random()<.5,y=top?5:height+3;
   if(vegetation){
    if(['vale','haunted'].includes(t.kind)){
     stroke(ctx,[[x,y+5],[x-2,y-16],[x-12,y-24],[x-2,y-17],[x+8,y-29]],'#495b50',4);
    }else if(['wetland','marsh','cliffs','storm'].includes(t.kind))tuft(ctx,x,top?17:height-3,10,t.dark,t.light);
    else tree(ctx,x,y,15+random()*5,random,t.kind==='fairy' || t.kind==='snow',t.kind==='snow');
   }else if(t.kind==='factory'){
    rect(ctx,x,top?3:height-14,26,10,'#657b71');rect(ctx,x+2,top?3:height-14,22,2,'#bdc3ac');
   }else stone(ctx,x,top?12:height-6,7+random()*6,random,t.kind==='volcanic'?'#4b4945':t.dark);
  }
  for(let y=30;y<height-20;y+=39){
   if(['grass','grove','fairy','snow'].includes(t.kind)){
    tree(ctx,4,y,13+random()*5,random,t.kind==='fairy' || t.kind==='snow',t.kind==='snow');
    tree(ctx,width-2,y+12,15+random()*4,random,t.kind==='fairy' || t.kind==='snow',t.kind==='snow');
   }else if(vegetation){tuft(ctx,8,y,10,t.dark,t.light);tuft(ctx,width-7,y+13,10,t.dark,t.light);}
   else {stone(ctx,9,y,9,random,t.dark);stone(ctx,width-9,y+14,9,random,t.dark);}
  }
  if(t.kind==='dojo'){
   for(const y of [9,height-14]){
    rect(ctx,20,y,width-40,5,'#765d47');rect(ctx,20,y+5,width-40,2,'#d1b582');
    for(let x=30;x<width-20;x+=46)rect(ctx,x,y-6,5,16,'#84684d');
   }
  }
  if(t.kind==='factory')for(const x of [23,width-33])for(let y=28;y<height-25;y+=23){
   rect(ctx,x,y,8,15,'#c5b66b');stroke(ctx,[[x,y+12],[x+8,y+3]],'#5b6855',3);
  }
 }
 function canonical(map,width){
  if(!map.viewMirror)return map;
  return {...map,viewMirror:false,zones:(map.zones??[]).map(zone=>({...zone,x:width-zone.x,
   vertices:zone.vertices?.map(([x,y])=>[-x,y]),patches:zone.patches?.map(([x,y,rx,ry])=>[-x,y,rx,ry])}))};
 }
 function keyFor(map,width,height){return JSON.stringify([map.type,map.seed??0,width,height,(map.zones??[]).map(zone=>[zone.x,zone.y,zone.w,zone.h,zone.r,zone.shape,zone.seed,zone.vertices,zone.patches])]);}
 function draw(ctx,map,width,height){
  const original=map??{type:'Grass',seed:742,zones:[]},scene=canonical(original,width),t=themes[scene.type]??themes.Grass;
  const key=keyFor(scene,width,height);let image=cache.get(key);
  if(!image){
   image=document.createElement('canvas');image.width=Math.round(width/2);image.height=Math.round(height/2);
   const target=image.getContext('2d');target.scale(image.width/width,image.height/height);
   const random=rng((scene.seed??hash(scene.type+JSON.stringify(scene.zones??[])))>>>0);
   landscape(target,t,random,width,height);
   for(const [index,zone] of (scene.zones??[]).entries())zoneScenery(target,zone,t,index);
   border(target,t,random,width,height);
   cache.set(key,image);builds++;if(cache.size>4)cache.delete(cache.keys().next().value);
  }
  ctx.save();ctx.imageSmoothingEnabled=false;
  if(original.viewMirror){ctx.translate(width,0);ctx.scale(-1,1);}
  ctx.drawImage(image,0,0,width,height);ctx.restore();
 }
 function drawZone(ctx,type,zone){zoneScenery(ctx,zone,themes[type]??themes.Grass,0);}
 globalThis.ArenaMapRenderer={draw,drawZone,themes,zonePoints,clearCache(){cache.clear();builds=0;},cacheInfo(){return {builds,entries:cache.size};}};
})();
