(() => {
 const dialog=byId('home-dialog'),content=byId('home-dialog-content');
 const state={tab:'search',requestView:'browse',page:0,filters:{},inventory:null,token:0,message:''};
 const money=value=>Number(value ?? 0).toLocaleString()+' coins';
 const node=(tag,text,cls)=>element(tag,text,cls);
 function button(text,action){
  const b=node('button',text);b.type='button';
  b.onclick=async()=>{b.disabled=true;try{await action();}catch(error){feedback(error.message,true);}finally{b.disabled=false;}};
  return b;
 }
 function feedback(message,error=false){
  state.message=message;const target=content.querySelector('.market-feedback');
  if(target){target.textContent=message;target.classList.toggle('is-error',error);}
 }
 function field(label,type='text',value=''){
  const wrapper=node('label',label),input=node('input');input.type=type;input.value=value;input.setAttribute('aria-label',label);wrapper.append(input);return {wrapper,input};
 }
 function select(label,options,value=''){
  const wrapper=node('label',label),input=node('select');input.setAttribute('aria-label',label);
  for(const entry of options){const [key,text]=Array.isArray(entry)?entry:[entry,entry];const option=node('option',text);option.value=key;input.append(option);}
  input.value=value;wrapper.append(input);return {wrapper,input};
 }
 function sourceLabel(row){return row.selector.slot===0?'Active':'Copy '+(row.selector.slot+1);}
 function identity(meta){return meta.name+' · Lv. '+meta.level+' · '+meta.nature+' · '+meta.personality;}
 function pokemonPanel(meta){
  const card=node('div',null,'market-pokemon');
  const art=pokemonPortrait(meta.name,null,false,0,meta.shiny?spriteVariants(meta.name).shiny:null);
  const text=node('div');text.append(node('strong',(meta.shiny?'★ ':'')+meta.name),node('small','#'+meta.number+' · Gen '+meta.generation+(meta.level?' · Lv. '+meta.level:'')));
  const tags=node('div',null,'market-tags');
  for(const type of meta.types ?? []){const chip=node('span',type,'market-tag');chip.style.setProperty('--tag-color',moveColors[type] ?? '#a5bcae');tags.append(chip);}
  text.append(tags,node('small',(meta.nature ?? 'Any nature')+' · '+(meta.personality ?? 'Any personality')));
  card.append(art,text);
  if(Array.isArray(meta.ivs)){
   const details=node('details',null,'market-stats');details.append(node('summary','IV '+meta.iv_total+'/186 · View IVs and EVs'));
   for(let i=0;i<6;i++)details.append(node('div',statLabels[i]+': IV '+meta.ivs[i]+' · EV '+(meta.evs?.[i] ?? 0)));
   card.append(details);
  }
  return card;
 }
 async function inventory(refresh=false){
  if(refresh || !state.inventory){await window.arenaMarketPrepare();state.inventory=(await window.arenaMarketRead('inventory')).rows;}
  return state.inventory;
 }
 function picker(rows,onPick){
  const root=node('section',null,'market-picker'),search=field('Find a PC Pokémon'),list=node('div',null,'market-picker-list');
  const summary=node('p','Choose Active or a specific PC copy.','market-selection');let selected=null,limit=12;
  const render=()=>{
   const query=search.input.value.trim().toLowerCase();
   const matches=rows.filter(row=>(identity(row.pokemon)+' '+sourceLabel(row)).toLowerCase().includes(query));
   list.replaceChildren(...matches.slice(0,limit).map(row=>{
    const entry=node('div',null,'market-picker-row');
    const choose=button(identity(row.pokemon)+' · '+sourceLabel(row),()=>{
     selected=row;summary.textContent='Selected: '+identity(row.pokemon)+' · '+sourceLabel(row);onPick(row);render();
    });choose.setAttribute('aria-pressed',String(selected===row));entry.append(choose);return entry;
   }));
   if(!matches.length)list.append(node('p','No matching PC copies.'));
   if(matches.length>limit)list.append(button('Show more Pokémon',()=>{limit+=12;render();}));
  };
  search.input.oninput=()=>{limit=12;render();};root.append(search.wrapper,summary,list);render();return root;
 }
 async function mutate(action,args){
  const result=await window.arenaMarketMutate(action,args);state.inventory=null;state.message=result.message ?? 'Trade completed.';await render();return result;
 }
 function filters(kind,onSearch){
  const form=node('form',null,'market-filters');
  const definitions=[['query','Pokémon name','text'],['dex','Pokédex number','number'],['ign','Player IGN','text']];
  for(const [key,label,type] of definitions){const f=field(label,type,state.filters[key] ?? '');if(type==='number'){f.input.min=1;f.input.max=980;}f.input.oninput=()=>state.filters[key]=f.input.value.trim();form.append(f.wrapper);}
  const choices=[['generation','Generation',[['','Any generation'],...Array.from({length:9},(_,i)=>[String(i+1),'Generation '+(i+1)])]],
   ['element','Element',[['','Any element'],...Object.keys(moveColors).filter(type=>typeChart[type])]],
   ['nature','Nature',[['','Any nature'],...natureNames]],['personality','Personality',[['','Any personality'],...personalityTraits.flat().toSorted()]],
   ['shiny','Appearance',[['','Any appearance'],['true','Shiny'],['false','Standard']]],
   ['sort','Sort by',[['newest','Newest'],['ending','Ending soon'],['price_low','Lowest price'],['price_high','Highest price'],['dex','Pokédex number'],['level','Highest level'],['ivs','Highest IV total']]]];
  if(kind==='request')choices.unshift(['side','Search requests for',[['wanted','What players want'],['offered','What players offer']]]);
  for(const [key,label,options] of choices){const f=select(label,options,state.filters[key] ?? (key==='side'?'wanted':key==='sort'?'newest':''));state.filters[key]=f.input.value;f.input.onchange=()=>state.filters[key]=f.input.value;form.append(f.wrapper);}
  const submit=node('button','Search');submit.type='submit';form.append(submit,button('Clear filters',()=>{state.filters={};state.page=0;return render();}));
  form.onsubmit=event=>{event.preventDefault();state.page=0;void onSearch();};return form;
 }
 function timeLabel(date){const milliseconds=Date.parse(date)-Date.now();return milliseconds<=0?'Ended':Math.ceil(milliseconds/3600000)+'h remaining';}
 function listingCard(listing){
  const card=node('article',null,'market-listing');
  card.append(pokemonPanel(listing.pokemon),node('p','By '+listing.seller+' · '+(listing.status==='open'?timeLabel(listing.ends_at):listing.status)));
  if(listing.tags?.length){const tags=node('div',null,'market-tags');for(const tag of listing.tags)tags.append(node('span',tag,'market-custom-tag'));card.append(tags);}
  const actions=node('div',null,'market-actions');
  if(listing.kind==='request'){
   const want=listing.want;const requirement=node('div',null,'market-wanted');
   requirement.append(node('strong','Wants: '+want.name),node('small',(want.nature ?? 'Any nature')+' · '+(want.personality ?? 'Any personality')+(want.shiny===undefined?'':want.shiny?' · Shiny':' · Standard')));
   card.append(requirement);
   if(!listing.mine && listing.status==='open')actions.append(button('Offer a matching Pokémon',async()=>{
    const rows=(await inventory(true)).filter(row=>matchesWanted(row.pokemon,want));
    const panel=node('section',null,'market-offer');let chosen=null;
    const offer=button('Complete this trade',async()=>{
     if(!chosen)return;
     if(!confirm('Trade '+identity(chosen.pokemon)+' ('+sourceLabel(chosen)+') for '+identity(listing.pokemon)+' from '+listing.seller+'?'))return;
     await mutate('fulfill',{id:listing.id,selector:chosen.selector});
    });offer.disabled=true;
    panel.append(node('h4','Choose your matching copy'));
    if(rows.length)panel.append(picker(rows,row=>{chosen=row;offer.disabled=false;}),offer);
    else panel.append(node('p','You do not have a matching Pokémon in your PC.'));
    card.querySelector('.market-offer')?.remove();card.append(panel);
   }));
  }else{
   card.append(node('p',listing.current_bid>0?'Current bid: '+money(listing.current_bid):listing.minimum_bid?'Starting bid: '+money(listing.minimum_bid):'Buy now only'));
   if(listing.my_bid)card.append(node('small','You are the highest bidder. Your bid is reserved.'));
   if(listing.buy_now)card.append(node('strong','Buy now: '+money(listing.buy_now)));
   if(!listing.mine && listing.status==='open'){
    if(listing.minimum_bid){const bid=field('Your bid','number',String(Math.max(listing.minimum_bid,listing.current_bid+1)));bid.input.min=Math.max(listing.minimum_bid,listing.current_bid+1);bid.input.max=1000000000000;bid.input.step=1;
     actions.append(bid.wrapper,button('Place bid',async()=>{
      const amount=Number(bid.input.value);if(!Number.isSafeInteger(amount) || amount<Number(bid.input.min))throw Error('Enter a valid bid above the current bid.');
      if(!confirm('Reserve '+money(amount)+' to bid on '+identity(listing.pokemon)+'?'))return;
      await mutate('bid',{id:listing.id,amount});
     }));}
    if(listing.buy_now)actions.append(button('Buy now',async()=>{if(confirm('Buy '+identity(listing.pokemon)+' for '+money(listing.buy_now)+'?'))await mutate('buy',{id:listing.id});}));
   }
  }
  if(listing.mine && listing.status==='open'){
   const cancel=button('Cancel listing',()=>mutate('cancel',{id:listing.id}));cancel.disabled=Boolean(listing.current_bid);actions.append(cancel);
   if(listing.current_bid)card.append(node('small','Auctions with bids cannot be cancelled.'));
  }
  card.append(actions);return card;
 }
 function matchesWanted(meta,want){return meta.name===want.name && (!want.nature || meta.nature===want.nature) &&
  (!want.personality || meta.personality===want.personality) && (want.shiny===undefined || meta.shiny===want.shiny);}
 async function board(root,kind,mine=false){
  const token=state.token,list=node('div',null,'market-listings'),pager=node('div',null,'market-pagination');
  const load=async()=>{
   list.replaceChildren(node('p','Loading listings…'));
   try{
    const result=await window.arenaMarketRead(mine?'mine':'search',{...state.filters,kind,page:state.page});
    if(token!==state.token)return;
    list.replaceChildren(...result.rows.map(listingCard));if(!result.rows.length)list.append(node('p',mine?'You have no listings here yet.':'No matching listings. Try different filters.'));
    const previous=button('Previous',()=>{state.page--;return load();});previous.disabled=state.page===0;
    const next=button('Next',()=>{state.page++;return load();});next.disabled=(state.page+1)*20>=result.total;
    pager.replaceChildren(previous,node('span',result.total+' listings · Page '+(state.page+1)),next);
   }catch(error){if(token===state.token){feedback(error.message,true);list.replaceChildren();}}
  };
  if(!mine)root.append(filters(kind,load));root.append(list,pager);await load();
 }
 async function publishForm(root,request=false){
  const token=state.token;root.append(node('p','Loading your PC…'));
  const rows=await inventory();if(token!==state.token)return;root.replaceChildren();let chosen=null;
  root.append(node('h3',request?'Create a trade request':'Sell a PC Pokémon'),node('p','Your selected Active Pokémon or copy is held securely until the listing ends. Held items stay in your bag.'));
  const selection=node('div');root.append(picker(rows,row=>{chosen=row;selection.replaceChildren(pokemonPanel(row.pokemon));}),selection);
  const form=node('form',null,'market-publish-form');
  const tags=field('Tags (comma separated, up to 8)');tags.input.maxLength=200;
  const controls={};
  if(request){
   const name=field('Pokémon you want');name.input.setAttribute('list','market-species-options');name.input.required=true;
   const list=node('datalist');list.id='market-species-options';for(const name of dexNames){const option=node('option');option.value=name;list.append(option);}
   const nature=select('Wanted nature',[['','Any nature'],...natureNames]),personality=select('Wanted personality',[['','Any personality'],...personalityTraits.flat().toSorted()]),shiny=select('Wanted appearance',[['','Any appearance'],['true','Shiny'],['false','Standard']]);
   controls.name=name.input;controls.nature=nature.input;controls.personality=personality.input;controls.shiny=shiny.input;
   form.append(name.wrapper,list,nature.wrapper,personality.wrapper,shiny.wrapper,node('p','A matching offer completes the exchange automatically, even when you are offline. Requests expire after 7 days.'));
  }else{
   const minimum=field('Starting bid (optional)','number'),buy=field('Buy now price (optional)','number');
   for(const entry of [minimum,buy]){entry.input.min=1;entry.input.max=1000000000000;entry.input.step=1;}
   const duration=select('Auction duration',[['1','1 hour'],['6','6 hours'],['24','24 hours'],['48','48 hours']],'24');
   controls.minimum=minimum.input;controls.buy=buy.input;controls.hours=duration.input;
   form.append(minimum.wrapper,buy.wrapper,duration.wrapper,node('p','Set a bid, a Buy now price, or both. Bids reserve coins. Payments transfer the listed amount without reward multipliers.'));
  }
  const useTags=button('Use selected Pokémon’s tags',()=>{if(chosen)tags.input.value=[...chosen.pokemon.types,chosen.pokemon.nature,chosen.pokemon.personality].join(', ');});
  const submit=node('button',request?'Publish trade request':'Publish auction');submit.type='submit';
  form.append(tags.wrapper,useTags,submit);
  form.onsubmit=async event=>{
   event.preventDefault();if(!chosen){feedback('Choose an Active Pokémon or PC copy first.',true);return;}
   submit.disabled=true;
   try{
    const args={selector:chosen.selector,tags:tags.input.value.split(',').map(x=>x.trim()).filter(Boolean).slice(0,8)};
    if(request){const name=dexNames.find(name=>name.toLowerCase()===controls.name.value.trim().toLowerCase());if(!name)throw Error('Choose a Pokémon from the name list.');
     args.want={name,...(controls.nature.value?{nature:controls.nature.value}:{}),...(controls.personality.value?{personality:controls.personality.value}:{}),...(controls.shiny.value?{shiny:controls.shiny.value==='true'}:{})};
    }else{
     for(const [input,key] of [[controls.minimum,'minimum_bid'],[controls.buy,'buy_now']])if(input.value){const value=Number(input.value);if(!Number.isSafeInteger(value)||value<=0)throw Error('Prices must be positive whole coins.');args[key]=value;}
     if(!args.minimum_bid&&!args.buy_now)throw Error('Set a starting bid or Buy now price.');
     if(args.minimum_bid&&args.buy_now&&args.buy_now<args.minimum_bid)throw Error('Buy now must be at least the starting bid.');args.hours=Number(controls.hours.value);
    }
    await mutate(request?'create_request':'create_auction',args);
   }catch(error){feedback(error.message,true);}finally{submit.disabled=false;}
  };
  root.append(form);
 }
 async function render(){
  const token=++state.token;dialog.classList.add('collection-dialog','trade-hub-dialog');byId('home-dialog-title').textContent='Trading Hub';
  const top=node('div',null,'market-toolbar'),status=node('p',state.message,'market-feedback');status.setAttribute('role','status');
  top.append(node('strong',money(wildProgress.coins)),button('Refresh',async()=>{state.inventory=null;await render();}),button('Receive completed trades',()=>mutate('claim',{})));
  const tabs=node('div',null,'market-tabs');tabs.setAttribute('role','tablist');
  for(const [tab,label] of [['search','Search'],['sell','Sell'],['request','Request']]){const b=button(label,()=>{state.tab=tab;state.page=0;state.filters={};return render();});b.setAttribute('role','tab');b.setAttribute('aria-selected',String(state.tab===tab));tabs.append(b);}
  const body=node('section',null,'market-body');content.replaceChildren(top,status,tabs,body);
  if(!dialog.open)dialog.showModal();
  if(state.tab==='search')await board(body,'auction');
  else if(state.tab==='sell'){
   const form=node('section',null,'market-publish'),mine=node('section');mine.append(node('h3','My auctions'));body.append(form,mine);
   await publishForm(form);if(token===state.token)await board(mine,'auction',true);
  }else{
   const actions=node('div',null,'market-request-views');
   for(const [key,title] of [['browse','Browse requests'],['mine','My requests'],['create','Create request']]){const b=button(title,()=>{state.requestView=key;state.page=0;state.filters={};return render();});b.setAttribute('aria-pressed',String(state.requestView===key));actions.append(b);}
   const view=node('section');body.append(actions,view);
   if(state.requestView==='create')await publishForm(view,true);else await board(view,'request',state.requestView==='mine');
  }
 }
 dialog.addEventListener('close',()=>{state.token++;dialog.classList.remove('trade-hub-dialog');});
 window.openTradingHub=async()=>{
  byId('home-dialog-title').textContent='Trading Hub';content.replaceChildren(node('p','Syncing your PC…'));dialog.classList.add('collection-dialog','trade-hub-dialog');if(!dialog.open)dialog.showModal();
  const token=++state.token;
  try{await window.arenaMarketPrepare();if(token!==state.token || !dialog.open)return;state.inventory=null;await render();}
  catch(error){content.replaceChildren(node('p',error.message),button('Retry Hub sync',()=>window.openTradingHub()));}
 };
 window.arenaMarketMatchesWanted=matchesWanted;
})();
