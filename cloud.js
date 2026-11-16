const arenaSaveKeys = [
 'team','moves','profiles','wild-progress','gym-badges','starter',
 'roguelit-progress','trainer-options','music','sfx'
].map(key=>'pokemon-arena-'+key);
const campaignSaveKeys=['pokemon-arena-gym-badges/master','pokemon-arena-gym-badges/clean-records'];
const cloudRedirect='https://jher13.github.io/PokeArena/';
let arenaCloudClient;
const rememberedEmailKey='arena-remembered-email';
// Remove the persistent session left by the old Remember me option.
function rememberedLoginEmail(value) {
 try {
  if(value===undefined)return localStorage.getItem(rememberedEmailKey);
  if(value)localStorage.setItem(rememberedEmailKey,value);
  else localStorage.removeItem(rememberedEmailKey);
 } catch {}
 return null;
}
try {
 localStorage.removeItem('arena-remembered-user');
 localStorage.removeItem('sb-ckgcuhaiuwlccyaxewbv-auth-token');
} catch {}
function clearCloudAccountMarker() {
 sessionStorage.removeItem('arena-cloud-revision');
 sessionStorage.removeItem('arena-online-user');
 sessionStorage.removeItem('arena-sync-reload');
}
function cloudClient() {
 return arenaCloudClient ??= import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
  .then(({createClient})=>createClient('https://ckgcuhaiuwlccyaxewbv.supabase.co',
   'sb_publishable_NftRvgvLu2zPCvsAcIUqGA_GzNcyYxz',{auth:{detectSessionInUrl:false,storage:sessionStorage}}))
  .catch(error=>{arenaCloudClient=null;throw error;});
}
function readArenaSave() {
 const entries=Object.fromEntries([...arenaSaveKeys,...campaignSaveKeys].map(key=>[key,playerStorage.getItem(key)]));
 entries[campaignSaveKeys[1]]=JSON.stringify(gymRematchRecords);
 return {version:2,entries};
}
function validateArenaSave(save){
 const keys=save?.version===2?[...arenaSaveKeys,...campaignSaveKeys]:arenaSaveKeys;
 if(![1,2].includes(save?.version) || !save.entries || !keys.every(key=>
  Object.hasOwn(save.entries,key) && (save.entries[key]===null || typeof save.entries[key]==='string')))
  throw new Error('This is not a supported Pokemon Arena save.');
 const decoded={};
 for(const key of keys){
  const value=save.entries[key];
  if(value===null || ['pokemon-arena-music','pokemon-arena-sfx'].includes(key))continue;
  const parsed=JSON.parse(value);
  const expectsArray=['pokemon-arena-team','pokemon-arena-gym-badges',campaignSaveKeys[0]].includes(key);
  if(!parsed || typeof parsed!=='object' || Array.isArray(parsed)!==expectsArray)
   throw new Error('The backup contains invalid '+key.replace('pokemon-arena-','')+' data.');
  decoded[key]=parsed;
 }
 return decoded;
}
function restoreArenaSave(save,writeKey=playerSaveKey) {
 validateArenaSave(save);
 const keys=save.version===2?[...arenaSaveKeys,...campaignSaveKeys]:arenaSaveKeys;
 const legacyPrefix=writeKey('pokemon-arena-gym-badges/clean/');
 const legacyKeys=save.version===2?Array.from({length:localStorage.length},(_,index)=>localStorage.key(index))
  .filter(key=>key?.startsWith(legacyPrefix)):[];
 const previous=Object.fromEntries(keys.map(key=>[key,localStorage.getItem(writeKey(key))]));
 const legacyValues=legacyKeys.map(key=>[key,localStorage.getItem(key)]);
 function write(entries) {
  for(const key of keys) {
   if(entries[key]===null) localStorage.removeItem(writeKey(key));
   else localStorage.setItem(writeKey(key),entries[key]);
  }
 }
 try {write(save.entries);for(const key of legacyKeys)localStorage.removeItem(key);}
 catch(error) {
  write(previous);
  for(const [key,value] of legacyValues)localStorage.setItem(key,value);
  throw error;
 }

}
let cloudAccount=null;
let cloudRevision=null;
let saveTimer;
let saving=false;
let dirty=false;
let leaseTimer;
const syncError=byId('arena-sync-error');
const saveState=element('span','Saved on this browser');
saveState.id='toolbar-save-state';
saveState.setAttribute('role','status');
byId('home-sync').prepend(saveState);
const homeScreen=byId('home');
const placeSyncError=()=>{
 if(homeScreen.hidden)document.body.append(syncError);
 else byId('home-sync').append(syncError);
};
new MutationObserver(placeSyncError).observe(homeScreen,{attributes:true,attributeFilter:['hidden']});
placeSyncError();
let localSaveFailed=false;
window.reportLocalSaveError=error=>{
 localSaveFailed=true;
 saveState.textContent='Local save failed';
 syncError.textContent='This browser could not save your latest progress. '+error.message;
 syncError.hidden=false;
};
window.arenaBackupControls=()=>{
 const download=element('button','Download local save');
 download.onclick=()=>downloadLocalSave();
 const file=element('input');
 file.type='file';
 file.accept='.json,application/json';
 file.setAttribute('aria-label','Select a Pokémon Arena backup');
 const preview=element('p');
 preview.setAttribute('role','status');
 if(onlineSaveId || cloudAccount){
  const load=element('button','Load cloud save');
  load.onclick=async()=>{
   if(saving || !window.confirm('Replace this browser’s progress with the latest cloud save?'))return;
   try{
    clearTimeout(saveTimer);
    const row=await fetchArenaSave(await cloudClient(),cloudAccount);
    if(!row)throw new Error('Cloud save unavailable.');
    restoreArenaSave(row.save_data);
    dirty=false;
    updatePendingSave();
    window.location.reload();
   }catch(error){window.reportLocalSaveError(error);}
  };
  return [element('h3','Save backup'),download,load,
   element('p','Importing a backup is available when playing offline.')];
 }
 const apply=element('button','Restore backup');
 apply.disabled=true;
 let backup=null;
 file.onchange=async()=>{
  const selected=file.files[0];
  backup=null;apply.disabled=true;preview.textContent='';
  if(!selected)return;
  try{
   const candidate=JSON.parse(await selected.text());
   const data=validateArenaSave(candidate);
   if(file.files[0]!==selected)return;
   const trainer=data['pokemon-arena-starter']?.ign ?? 'Unnamed trainer';
   const badges=data['pokemon-arena-gym-badges']?.length ?? 0;
   const caught=Object.keys(data['pokemon-arena-wild-progress']?.owned ?? {}).length;
   preview.textContent=trainer+' · '+badges+' badges · '+caught+' Pokémon registered in storage';
   backup=candidate;apply.disabled=false;
  }catch(error){if(file.files[0]===selected)preview.textContent=error.message;}
 };
 apply.onclick=()=>{
  if(!backup || saving || onlineSaveId || cloudAccount)return;
  if(!window.confirm('Restore this offline backup? Download your current save first if you want to keep a copy.'))return;
  try{
   restoreArenaSave(backup);
   clearTimeout(saveTimer);
   dirty=false;
   window.location.reload();
  }catch(error){
   window.reportLocalSaveError(error);
   preview.textContent=error.message;
  }
 };
 return [element('h3','Save backup'),download,file,preview,apply];
};
function downloadLocalSave(save=readArenaSave(),filename='PokeArena-save.json'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(save)],{type:'application/json'}));
 const link=element('a');
 link.href=url;
 link.download=filename;
 link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function fetchArenaSave(client,id) {
 const {data,error}=await client.from('arena_saves').select('save_data,updated_at').eq('user_id',id).maybeSingle();
 if(error) throw error;
 return data;
}
const pendingSaveKey=id=>'arena-pending-save:'+id;
function pendingSave(id){
 try{
  const pending=JSON.parse(localStorage.getItem(pendingSaveKey(id)));
  return pending && (pending.baseRevision===null || typeof pending.baseRevision==='string')?pending:null;
 }catch{return null;}
}
function updatePendingSave(){
 if(!cloudAccount)return;
 try{
  if(dirty)localStorage.setItem(pendingSaveKey(cloudAccount),JSON.stringify({baseRevision:cloudRevision}));
  else localStorage.removeItem(pendingSaveKey(cloudAccount));
 }catch(error){window.reportLocalSaveError(error);}
}
async function flushArenaSave() {
 if(!cloudAccount || !team.length || saving || !dirty) return;
 saving=true;
 saveState.textContent='Syncing…';
 dirty=false;
 try {
  const client=await cloudClient();
  const {data,error}=await client.rpc('arena_write_save',{payload:readArenaSave(),expected_revision:cloudRevision});
  if(error)throw error;
  if(data?.status==='conflict'){
   const conflict=new Error('Progress changed on another device.');
   conflict.saveConflict=true;
   throw conflict;
  }
  if(data?.status!=='ok'){
   const rejected=new Error('The server rejected invalid save data.');
   rejected.saveConflict=true;
   throw rejected;
  }
  cloudRevision=data.updated_at;
  sessionStorage.setItem('arena-cloud-revision',cloudRevision);
  updatePendingSave();
  if(!localSaveFailed)syncError.hidden=true;
  saveState.textContent=localSaveFailed?'Local save failed':dirty?'Saved locally · sync pending':'Cloud synced';
  if(dirty) window.queueArenaSave();
 } catch(error) {
  dirty=true;
  updatePendingSave();
  saveState.textContent='Saved locally · sync failed';
  syncError.textContent='Progress could not sync. '+error.message+' ';
  const retry=element('button',error.saveConflict?'Load cloud save':'Retry sync');
  retry.onclick=async()=>{
   if(!error.saveConflict){await flushArenaSave().catch(()=>{});return;}
   if(!window.confirm('Replace this browser’s progress with the latest cloud save?'))return;
   try{
    const client=await cloudClient();
    const row=await fetchArenaSave(client,cloudAccount);
    if(!row)throw new Error('Cloud save unavailable.');
    clearTimeout(saveTimer);
    dirty=false;
    try {restoreArenaSave(row.save_data);} catch(error){dirty=true;throw error;}
    updatePendingSave();
    window.location.reload();
   }catch(error){syncError.append(element('span',' '+error.message));}
  };
  const backup=element('button','Download local save');
  backup.onclick=()=>downloadLocalSave();
  syncError.append(retry,backup);
  if(error.saveConflict){
   const downloadCloud=element('button','Download cloud save');
   downloadCloud.onclick=async()=>{
    try{
     const row=await fetchArenaSave(await cloudClient(),cloudAccount);
     if(!row)throw new Error('Cloud save unavailable.');
     downloadLocalSave(row.save_data,'PokeArena-cloud-save.json');
    }catch(downloadError){syncError.append(element('span',' '+downloadError.message));}
   };
   syncError.append(downloadCloud);
  }
  syncError.hidden=false;
  throw error;
 } finally {saving=false;}
}
window.queueArenaSave=()=>{
 if(!cloudAccount) return;
 dirty=true;
 updatePendingSave();
 if(!localSaveFailed)saveState.textContent='Saved locally · sync pending';
 clearTimeout(saveTimer);
 saveTimer=setTimeout(()=>flushArenaSave().catch(()=>{}),350);
};
let leaseCheck=null;
async function checkArenaLease(){
 if(!cloudAccount || leaseCheck)return;
 const id=cloudAccount;
 leaseCheck=(async()=>{
  try{
   const client=await cloudClient();
   if(await claimArenaSession(client)){
    if(cloudAccount===id && !dirty && !saving && !localSaveFailed)saveState.textContent=cloudRevision?'Cloud synced':'Saved locally';
    return;
   }
   if(cloudAccount!==id)return;
   clearInterval(leaseTimer);
   clearTimeout(saveTimer);
   cloudAccount=null;
   const dialog=element('dialog',null,'client-update-dialog');
   const detail=dirty || saving?'Latest changes may exist only in this browser. Download a backup before signing in again.':'The last synced save is available when you sign in again.';
   const download=element('button','Download local backup');
   download.onclick=()=>downloadLocalSave();
   const leave=element('button','Return to sign-in');
   leave.onclick=async()=>{
    await client.auth.signOut({scope:'local'}).catch(()=>{});
    clearCloudAccountMarker();
    window.location.reload();
   };
   dialog.oncancel=event=>event.preventDefault();
   dialog.append(element('strong','Your online session ended.'),element('p','This account is now active in another session. '+detail),download,leave);
   document.body.append(dialog);
   dialog.showModal();
  }catch{if(cloudAccount===id)saveState.textContent='Waiting to verify online session…';}
 })();
 try{await leaseCheck;}finally{leaseCheck=null;}
}
window.collectServerRaidRewards=async()=>{
 if(!cloudAccount)throw new Error('Sign in to collect raid rewards.');
 if(saving)throw new Error('Waiting for cloud save. Try again.');
 await flushArenaSave();
 if(saving || dirty)throw new Error('Sync your save before collecting raid rewards.');
 saving=true;
 try {
  const {data,error}=await (await cloudClient()).rpc('arena_collect_raid_rewards',{expected_revision:cloudRevision});
  if(error)throw error;
  if(data?.status!=='ok')throw new Error('Cloud save changed. Sync or reload before collecting rewards.');
  cloudRevision=data.updated_at;
  for(const reward of data.rewards){
   if(!wildProgress.megaRaidRewards.includes(reward.mode))wildProgress.megaRaidRewards.push(reward.mode);
   wildProgress.coins+=reward.coins;
   wildProgress.balls[7]+=reward.master_balls;
   wildProgress.items[reward.pvp_item]=(wildProgress.items[reward.pvp_item] ?? 0)+1;
  }
  if(data.rewards.length)saveWildProgress();
  if(!localSaveFailed)sessionStorage.setItem('arena-cloud-revision',cloudRevision);
  return data.rewards;
 }finally{
  saving=false;
  if(dirty)window.queueArenaSave();
 }
};
async function claimArenaSession(client){
 const {data,error}=await client.rpc('arena_claim_session');
 if(error)throw error;
 return data===true;
}
async function enterCloudAccount(client,user,proceed){
 const id=user.id;
 if(!await claimArenaSession(client)){
  await client.auth.signOut({scope:'local'});
  throw new Error('This account is already active on another device. Sign out there or try again after three minutes.');
 }
 const row=await fetchArenaSave(client,id);
 const pending=pendingSave(id);
 if(onlineSaveId!==id){
  if(row && !pending)restoreArenaSave(row.save_data,key=>'arena-online:'+id+':'+key);
  sessionStorage.setItem('arena-online-user',id);
  sessionStorage.setItem('arena-sync-reload',id);
  if(row)sessionStorage.setItem('arena-cloud-revision',row.updated_at);
  window.location.reload();
  return;
 }
 cloudAccount=id;
 cloudRevision=pending?pending.baseRevision:row?.updated_at ?? null;
 // A pending local draft must survive a reload until the server accepts it or the player chooses the cloud copy.
 if(row && !pending && (sessionStorage.getItem('arena-sync-reload')!==id || sessionStorage.getItem('arena-cloud-revision')!==row.updated_at)){
  restoreArenaSave(row.save_data);
  sessionStorage.setItem('arena-sync-reload',id);
  sessionStorage.setItem('arena-cloud-revision',row.updated_at);
  window.location.reload();
  return;
 }
 saveState.textContent=row?'Cloud synced':'Saved locally';
 clearInterval(leaseTimer);
 leaseTimer=setInterval(checkArenaLease,30000);
 proceed();
 if(pending){
  // Submit against the original base revision. A newer server copy produces the normal conflict UI.
  window.queueArenaSave();
 }
}
window.addEventListener('online',async()=>{await checkArenaLease();await flushArenaSave().catch(()=>{});});
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='hidden')flushArenaSave().catch(()=>{});
 else if(document.visibilityState==='visible')void checkArenaLease();
});
let returnToAccountGate;
function installAccountGate() {
 const gate=byId('account-gate');
 const status=byId('account-status');
 const form=byId('account-form');
 const login=byId('account-login');
 const signup=byId('account-signup');
 const submit=byId('account-submit');
 const password=byId('account-password');
 const remember=byId('account-remember');
 const email=byId('account-email');
 const rememberedEmail=rememberedLoginEmail();
 if(remember) {
  remember.checked=Boolean(rememberedEmail);
  remember.onchange=()=>{if(!remember.checked)rememberedLoginEmail('');};
 }
 if(rememberedEmail && !email.value)email.value=rememberedEmail;
 let creating=false;
 function proceed() {
  gate.hidden=true;
  openMenu();
 }
 function selectMode(create) {
  creating=create;
  login.setAttribute('aria-pressed',String(!create));
  signup.setAttribute('aria-pressed',String(create));
  submit.textContent=create?'Sign up':'Log in';
  password.autocomplete=create?'new-password':'current-password';
  status.textContent='';
 }
 login.onclick=()=>selectMode(false);
 signup.onclick=()=>selectMode(true);
 byId('account-offline').onclick=async()=>{
  if(arenaCloudClient) {
   try {
    const client=await arenaCloudClient;
    if(cloudAccount)await client.rpc('arena_release_session');
    const {error}=await client.auth.signOut({scope:'local'});
    if(error) throw error;
   } catch(error) {status.textContent=error.message;return;}
  }
  clearInterval(leaseTimer);
  clearCloudAccountMarker();
  if(onlineSaveId) {window.location.reload();return;}
  proceed();
 };
 form.onsubmit=async event=>{
  event.preventDefault();
  if(submit.disabled) return;
  submit.disabled=true;
  status.textContent=creating?'Creating account…':'Signing in…';
  try {
   const client=await cloudClient();
   const credentials={email:email.value.trim(),password:password.value};
   const {data,error}=creating
    ? await client.auth.signUp({...credentials,options:{emailRedirectTo:cloudRedirect}})
    : await client.auth.signInWithPassword(credentials);
   if(error) throw error;
   password.value='';
   if(data.session) {
    rememberedLoginEmail(remember?.checked?credentials.email:'');
    status.textContent='Loading your save…';
    await enterCloudAccount(client,data.session.user,proceed);
   }
   else status.textContent='Confirm your email, then log in with your password.';
  } catch(error) {status.textContent=error.message || 'Could not sign in.';}
  finally {submit.disabled=false;}
 };
 returnToAccountGate=()=>{
  cancelWildRepeat();
  phase='login';
  showScreen('login');
  byId('login').hidden=true;
  gate.hidden=false;
  password.value='';
  selectMode(false);
 };
 byId('toolbar-logout').onclick=async()=>{
  try {
   if(saving) throw new Error('Wait for your cloud save to finish.');
   await flushArenaSave();
   if(arenaCloudClient) {
    const client=await arenaCloudClient;
    await client.rpc('arena_release_session');
    const {error}=await client.auth.signOut({scope:'local'});
    if(error) throw error;
   }
   clearInterval(leaseTimer);
   clearCloudAccountMarker();
   if(onlineSaveId) {window.location.reload();return;}
   returnToAccountGate();
  } catch(error) {
   openHomeDialog('Log out',element('p',error.message || 'Could not sign out.'));
  }
 };
 if(onlineSaveId) cloudClient().then(async client=>{
  const {data,error}=await client.auth.getUser();
  if(error || !data.user || data.user.id!==onlineSaveId) throw new Error('Log in again to load your cloud save.');
  await enterCloudAccount(client,data.user,proceed);
 }).catch(error=>{status.textContent=error.message;});
}
installAccountGate();
