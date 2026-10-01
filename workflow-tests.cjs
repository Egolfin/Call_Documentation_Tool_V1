// Dependency-free logic checks with a DOM harness. This is not a browser or visual test.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
class Element {
  constructor(tag, doc) { this.tagName=tag; this.doc=doc; this.children=[]; this.listeners={}; this.attributes={}; this.value=''; this.hidden=false; this.disabled=false; this.open=false; this.classes=new Set(); this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)}; }
  set id(value) { this._id=value; this.doc.ids[value]=this; } get id(){return this._id;}
  append(...nodes){this.children.push(...nodes.flatMap(n=>n.tagName==='fragment'?n.children:[n]));}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  setAttribute(name,value){this.attributes[name]=value;}
  add(option){this.children.push(option);}
  addEventListener(type,callback){(this.listeners[type]??=[]).push(callback);}
  async emit(type,event={}){for(const callback of this.listeners[type]||[])await callback(event);}
  querySelector(tag){return this.children.find(n=>n.tagName===tag)||this.children.map(n=>n.querySelector?.(tag)).find(Boolean);}
  focus(){this.doc.activeElement=this;} select(){this.selected=true;}
  showModal(){this.open=true;} close(){if(!this.open)return;this.open=false;for(const callback of this.listeners.close||[])callback({});}
}
function boot(storage={},clipboardMode='success') {
  const doc={ids:{},listeners:{},execCommand:()=>clipboardMode==='fallback'};
  doc.createElement=tag=>new Element(tag,doc);
  doc.createTextNode=text=>({tagName:'text',textContent:text});
  doc.createDocumentFragment=()=>new Element('fragment',doc);
  doc.getElementById=id=>doc.ids[id];
  doc.addEventListener=(type,callback,capture)=>(doc.listeners[type]??=[])[capture?'unshift':'push'](callback);
  doc.body=new Element('body',doc);
  for(const id of ['fields','note','copy','status','reset-dialog','note-preview','storage-status','reset','progress','completion-ring','meter','readiness','cancel','confirm','help-button','help-dialog','help-close','help-content','help-done']){const n=new Element('div',doc);n.id=id;}
  const window={listeners:{},addEventListener(type,cb){this.listeners[type]=cb;}};
  let copied='';
  const context={window,document:doc,Option:function(text,value){return {text,value};},sessionStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>{storage[k]=v;}},navigator:{clipboard:{writeText:async text=>{if(clipboardMode!=='success')throw Error('Clipboard unavailable');copied=text;}}}};
  vm.createContext(context);
  for(const file of ['guide.js','app.js','help.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),context);
  return {doc,window,guide:JSON.parse(JSON.stringify(window.GUIDE)),get copied(){return copied;},storage};
}
async function choose(app,index,value){const n=app.doc.ids['answer-'+index];n.value=String(value);await n.emit('change');}
async function fill(app,text){const n=app.doc.ids['other-10'];n.value=text;await n.emit('input');}
async function complete(app){for(let i=0;i<app.guide.length;i++)await choose(app,i,0);}
module.exports={boot,choose,fill,complete};
if(require.main===module)(async()=>{
  const app=boot();const id=app.doc.ids;assert(id.copy.disabled);assert.equal(id.meter.max,11);
  assert.equal(id.progress.textContent,'0 of 11');assert.equal(id['completion-ring'].attributes['stroke-dashoffset'],'100');
  assert.equal(id.fields.querySelector('details'),undefined);
  assert.equal(id.fields.querySelector('summary'),undefined);
  for(let i=0;i<app.guide.length;i++){
    const field=id.fields.children[i];const guidance=field.children[2];const heading=guidance.children[0];const help=id['guidance-'+i];
    assert.equal(field.children[0].tagName,'label');assert.equal(field.children[1].querySelector('select'),id['answer-'+i]);
    assert.equal(guidance.className,'guidance');assert.equal(heading.className,'guidance-heading');
    assert.equal(heading.children[0].textContent,'ⓘ');assert.equal(heading.children[1].textContent,'When to use');
    assert.equal(guidance.children[1],help);assert(!guidance.hidden);assert(!help.hidden);
    assert.equal(help.textContent,'Choose a response above to see when to use it.');
    assert.equal(id['answer-'+i].attributes['aria-describedby'],help.id);
    assert.equal(id['answer-'+i].children.length,app.guide[i].options.length+1);
    for(let j=0;j<app.guide[i].options.length;j++){
      id['answer-'+i].focus();
      await choose(app,i,j);
      assert(!guidance.hidden);assert(!help.hidden);
      if(!(i===10&&j===6))assert.equal(app.doc.activeElement,id['answer-'+i]);
      assert.equal(id['answer-'+i].children[j+1].text,app.guide[i].options[j].response);
      assert.equal(id['guidance-'+i].textContent,app.guide[i].options[j].explanation||'No additional guidance yet.');
      if(!(i===10&&j===6))assert(id.note.value.split('\n').includes(app.guide[i].field+': '+app.guide[i].options[j].response));
    }
  }
  await complete(app);assert(!id.copy.disabled);
  assert.equal(id.progress.textContent,'11 of 11');assert.equal(id['completion-ring'].attributes['stroke-dashoffset'],'0');
  assert.equal(id.note.value,app.guide.map(g=>g.field+': '+g.options[0].response).join('\n'));
  await choose(app,10,6);assert(id.copy.disabled);assert.equal(id.progress.textContent,'10 of 11');assert(Number(id['completion-ring'].attributes['stroke-dashoffset'])>0);await fill(app,'   ');assert(id.copy.disabled);
  await fill(app,'  Requested another time  ');assert(!id.copy.disabled);assert(id.note.value.endsWith('If Not Achieved, What Stopped It?: Other: Requested another time'));
  const reloaded=boot(app.storage);assert.equal(reloaded.doc.ids.note.value,id.note.value);assert(!reloaded.doc.ids.copy.disabled);
  await id.copy.emit('click');assert.equal(app.copied,id.note.value);assert.equal(id.status.textContent,'Completed note copied.');
  await id.reset.emit('click');assert.equal(id.note.value,'');assert.equal(id['other-10'].value,'');assert(id.copy.disabled);
  assert.equal(id['completion-ring'].attributes['stroke-dashoffset'],'100');
  for(let i=0;i<app.guide.length;i++)assert.equal(id['guidance-'+i].textContent,'Choose a response above to see when to use it.');
  await choose(app,0,0);await id.reset.emit('click');assert(id['reset-dialog'].open);await id.cancel.emit('click');assert.equal(id['answer-0'].value,'0');
  await id.reset.emit('click');await id.confirm.emit('click');assert.equal(id.note.value,'');
  await complete(app);for(const callback of app.doc.listeners.keydown){callback({ctrlKey:true,key:'Enter',preventDefault(){}});}await new Promise(resolve=>setImmediate(resolve));assert.equal(app.copied,id.note.value);
  await choose(app,10,6);await fill(app,'Details');await choose(app,10,0);assert.equal(id['other-10'].value,'');
  const fallback=boot({},'fallback');await complete(fallback);await fallback.doc.ids.copy.emit('click');assert.equal(fallback.doc.ids.status.textContent,'Completed note copied.');
  const manual=boot({},'manual');await complete(manual);await manual.doc.ids.copy.emit('click');assert.equal(manual.doc.ids.note.hidden,false);assert(manual.doc.ids.note.selected);assert(manual.doc.ids.status.textContent.includes('Copy unavailable'));
  const stale=JSON.parse(app.storage['call-documentation-draft-v2']);stale.guideSignature='outdated';assert.equal(boot({'call-documentation-draft-v2':JSON.stringify(stale)}).doc.ids.note.value,'');
  const corrupt=boot({'call-documentation-draft-v2':'{broken'});assert.equal(corrupt.doc.ids.note.value,'');assert(corrupt.doc.ids.copy.disabled);
  console.log('PASS: always-visible guidance structure, neutral state, every response and exact guidance, normal selection focus, required selections, note output, Other validation/clearing, tab recovery, clipboard paths, shortcut handler, protected reset and stale/corrupt draft rejection. Browser UI behavior remains untested.');
})().catch(error=>{console.error(error);process.exitCode=1;});
