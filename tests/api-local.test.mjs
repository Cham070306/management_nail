import assert from 'node:assert/strict';
const base='http://127.0.0.1:4173';
const unauth=await fetch(base+'/api/workspace');assert.equal(unauth.status,401);
const login=await fetch(base+'/signin-with-chatgpt?return_to=/app.html',{redirect:'manual'});const cookie=login.headers.getSetCookie().map(s=>s.split(';')[0]).join('; ');assert.ok(cookie,'Local mock sign-in cookie');
const request=(method,body)=>fetch(base+'/api/workspace',{method,headers:{Cookie:cookie,'Content-Type':'application/json',Origin:base},...(body?{body:JSON.stringify(body)}:{})});
const prior=await (await request('GET')).json();assert.ok(prior.user);
const state={version:2,staff:['Nhân viên kiểm thử'],profiles:[{start:'09:00',end:'19:00',commission:30,days:[1,2,3,4,5],skills:[0]}],services:[{name:'Dịch vụ kiểm thử',price:100000,duration:60}],business:{name:'Tiệm kiểm thử API',type:'Nail / Mi'},bookings:[],customers:[],audit:[]};
const save=await request('PUT',{revision:prior.revision,state});assert.equal(save.status,200);const saved=await save.json();
const read=await (await request('GET')).json();assert.equal(read.state.business.name,'Tiệm kiểm thử API');assert.equal(read.revision,saved.revision);
const conflict=await request('PUT',{revision:prior.revision,state});assert.equal(conflict.status,409);
const invalid=await request('PUT',{revision:saved.revision,state:{...state,profiles:[]}});assert.equal(invalid.status,400);
const crossOrigin=await fetch(base+'/api/workspace',{method:'PUT',headers:{Cookie:cookie,'Content-Type':'application/json',Origin:'https://invalid.test'},body:JSON.stringify({revision:saved.revision,state})});assert.equal(crossOrigin.status,403);
if(prior.state){const restore=await request('PUT',{revision:saved.revision,state:prior.state});assert.equal(restore.status,200);console.log('PASS: auth, durable read/write, optimistic conflict, invalid data rejection, cross-origin rejection; original state restored.')}else{console.log('PASS: auth, durable read/write, optimistic conflict, invalid data rejection, cross-origin rejection. Cleanup test-only local_seedy revision '+saved.revision);}
