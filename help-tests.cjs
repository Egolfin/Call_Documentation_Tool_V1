// Tests real app/help handlers in the same DOM harness; not browser accessibility QA.
const assert=require('node:assert/strict');
const {boot,choose,fill,complete}=require('./workflow-tests.cjs');
async function key(app,event){
  let stopped=false;let prevented=false;
  const input={...event,preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;}};
  for(const callback of app.doc.listeners.keydown||[]){await callback(input);if(stopped)break;}
  await new Promise(resolve=>setImmediate(resolve));
  return {stopped,prevented};
}
(async()=>{
  const app=boot();const id=app.doc.ids;
  await complete(app);await choose(app,10,6);await fill(app,'Keep these details');
  const snapshot=()=>JSON.stringify({note:id.note.value,selections:app.guide.map((_,i)=>id['answer-'+i].value),other:id['other-10'].value,storage:app.storage,progress:id.progress.textContent,copyDisabled:id.copy.disabled});
  const before=snapshot();
  await id['help-button'].emit('click');assert(id['help-dialog'].open);assert(app.doc.body.classes.has('help-open'));assert.equal(app.doc.activeElement,id['help-close']);assert.equal(snapshot(),before);
  let prevented=false;
  await id['help-dialog'].emit('keydown',{key:'Tab',shiftKey:true,preventDefault(){prevented=true;}});
  assert(prevented);assert.equal(app.doc.activeElement,id['help-done']);
  prevented=false;
  await id['help-dialog'].emit('keydown',{key:'Tab',shiftKey:false,preventDefault(){prevented=true;}});
  assert(prevented);assert.equal(app.doc.activeElement,id['help-close']);
  for(const modifier of ['ctrlKey','metaKey']){
    const result=await key(app,{key:'Enter',[modifier]:true});assert(result.stopped);assert(result.prevented);assert.equal(app.copied,'');assert.equal(app.doc.activeElement,id['help-close']);
  }
  await id['help-close'].emit('click');assert(!id['help-dialog'].open);assert(!app.doc.body.classes.has('help-open'));assert.equal(app.doc.activeElement,id['help-button']);assert.equal(snapshot(),before);
  await id['help-button'].emit('click');await id['help-done'].emit('click');assert(!id['help-dialog'].open);assert.equal(app.doc.activeElement,id['help-button']);assert.equal(snapshot(),before);
  await id['help-button'].emit('click');prevented=false;
  await id['help-dialog'].emit('cancel',{preventDefault(){prevented=true;}});assert(prevented);assert(!id['help-dialog'].open);assert.equal(app.doc.activeElement,id['help-button']);assert.equal(snapshot(),before);
  await key(app,{key:'Enter',ctrlKey:true});assert.equal(app.copied,id.note.value);
  await key(app,{key:'Enter',metaKey:true});assert.equal(app.copied,id.note.value);
  await id.reset.emit('click');assert.equal(id.note.value,'');assert.equal(id['other-10'].value,'');
  console.log('PASS: help open/close/cancel, focus wrap and return, untouched selections/Other/draft, copy shortcut isolation while open, normal Windows/Mac shortcuts and New call after closing. Native modal behavior remains subject to browser QA.');
})().catch(error=>{console.error(error);process.exitCode=1;});
