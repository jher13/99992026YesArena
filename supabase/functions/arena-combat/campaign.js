import {campaignContractMatch,campaignEngineVersion,simulateOnline} from './engine.js';

export function prepareCampaignContract(run){
 return {run_id:run.id,definition:run.definition,match:campaignContractMatch(run.entries,run.definition,run.id),version:campaignEngineVersion};
}
export function verifyCampaignContract(run){
 let state=run.verification_state?structuredClone(run.verification_state):null;
 for(let batch=0;batch<32;batch++){
  const next=advanceCampaignVerification({...run,verification_state:state});state=next.state;
  if(next.complete)return {won:next.won,duration:next.duration,version:campaignEngineVersion};
 }
 throw Error('Contract simulation did not finish.');
}
export function advanceCampaignVerification(run){
 const match=campaignContractMatch(run.entries,run.definition,run.id);
 const next=simulateOnline(match,run.verification_state??null,600,null,'host');
 return {state:next.state,complete:Boolean(next.result),won:next.result==='host' && next.state.enemies.every(actor=>actor.hp<=0),duration:next.state.clock};
}
