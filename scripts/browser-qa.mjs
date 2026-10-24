import { chromium } from 'file:///D:/workspace/Projects/Personal_Blog/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root='D:/workspace/Projects/Nine-grid';
const out=root+'/.storage/qa';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,downloadsPath:root+'/.storage/tmp',args:['--disk-cache-dir='+root+'/.storage/cache/browser','--disable-breakpad','--disable-crash-reporter']});
const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
const page=await ctx.newPage();
const errors=[]; const failures=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url());});
const base=process.env.QA_BASE || 'http://127.0.0.1:5173/';
const checks=[];
async function sweep(){await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});const height=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<height;y+=650){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(160);}await page.waitForTimeout(900);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(450);await page.evaluate(()=>{document.documentElement.style.scrollBehavior='';});}
async function record(name,fn){await fn();checks.push(name);}
try{
await page.goto(base,{waitUntil:'networkidle'});
await page.waitForTimeout(1400);
await record('五格按上二下三排列，右上方为孔玲',async()=>{
 const tiles=page.locator('.team-tile');assert.equal(await tiles.count(),5);
 const boxes=await tiles.evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,href:el.getAttribute('href')};}));
 assert.ok(Math.abs(boxes[0].y-boxes[1].y)<2);
 assert.ok(Math.abs(boxes[2].y-boxes[4].y)<2);
 assert.ok(boxes[2].y>boxes[0].y);
 assert.equal(boxes[1].href,'#/people/kong-ling');
 assert.ok(boxes[1].x>boxes[0].x);
});
await sweep();await page.screenshot({path:out+'/home-desktop.png',fullPage:true});
await record('聚焦展板抬升并显示个人信息',async()=>{
 const tile=page.locator('.team-tile').nth(1);
 await tile.focus();await page.waitForTimeout(550);
 assert.equal(await tile.locator('.tile-label').evaluate(el=>getComputedStyle(el).opacity),'1');
 assert.notEqual(await tile.evaluate(el=>getComputedStyle(el).transform),'none');
 await page.screenshot({path:out+'/focused-member.png'});
 await tile.press('Enter');await page.waitForURL('**/#/people/kong-ling');
 await page.waitForTimeout(1000);assert.equal(await page.locator('main h1').textContent(),'孔玲');
});
await sweep();await page.screenshot({path:out+'/profile-desktop.png',fullPage:true});
await record('个人相册、单张切换、键盘和关闭可用',async()=>{
 await page.getByRole('button',{name:'摄影',exact:true}).click();
 assert.equal(await page.locator('.album-cover').count(),4);
 await page.getByRole('button',{name:'全部',exact:true}).click();
 await page.locator('.album-cover').filter({hasText:'栖霞山'}).click();
 await page.locator('dialog[open]').waitFor();assert.equal(await page.locator('.dialog-grid button').count(),18);
 await page.locator('.dialog-grid button').first().click();
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);
 assert.match(await page.locator('.gallery-controls p').textContent(),/2 \/ 18/);
 await page.screenshot({path:out+'/photo-viewer.png'});
 await page.keyboard.press('Escape');
 await page.locator('dialog[open]').waitFor({state:'detached'});
 assert.match(page.url(),/#\/people\/kong-ling$/);
});
await record('个人主页项目图库有八张图',async()=>{
 await page.locator('.profile-project').click();await page.locator('dialog[open]').waitFor();
 assert.equal(await page.locator('.dialog-grid button').count(),8);
 await page.getByRole('button',{name:'关闭图库'}).click();
});
await record('其他四个入口均可访问占位主页',async()=>{
 for(const id of ['member-a','member-c','member-d','member-e']){
  await page.goto(base+'#/people/'+id);await page.waitForTimeout(250);
  assert.ok(await page.locator('.pending-layout').isVisible());
  assert.match(await page.locator('main').textContent(),/成员姓名、介绍与作品正在整理中/);
 }
});
await record('深层相册地址刷新后仍能打开',async()=>{
 await page.goto(base+'#/people/kong-ling/albums/snow-2013');await page.locator('dialog[open]').waitFor();
 await page.reload();await page.locator('dialog[open]').waitFor();
 assert.equal(await page.locator('.dialog-grid button').count(),9);
 await page.keyboard.press('Escape');
});
await record('移动端菜单、人物入口与相册可用且无横向溢出',async()=>{
 await page.setViewportSize({width:390,height:844});await page.goto(base);await page.waitForTimeout(1400);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await sweep();await page.screenshot({path:out+'/home-mobile.png',fullPage:true});
 await page.getByRole('button',{name:/菜单/}).click();assert.equal(await page.getByRole('button',{name:/收起/}).getAttribute('aria-expanded'),'true');
 await page.getByRole('link',{name:'团队',exact:true}).click();
 await page.locator('.team-tile').nth(1).click();await page.waitForTimeout(800);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await sweep();await page.screenshot({path:out+'/profile-mobile.png',fullPage:true});
});
await record('减少动态效果时内容可见且展板不抬升',async()=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);await page.waitForTimeout(300);
 const tile=page.locator('.team-tile').nth(1);await tile.focus();
 assert.equal(await tile.evaluate(el=>getComputedStyle(el).transform),'none');
 assert.ok(await page.locator('h1').isVisible());
 await page.screenshot({path:out+'/reduced-motion.png'});
});
await record('所有已渲染图片均成功加载',async()=>{
 const broken=await page.locator('img').evaluateAll(els=>els.filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.src));assert.deepEqual(broken,[]);
});
assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
await writeFile(out+'/functional-report.json',JSON.stringify({passed:checks,errors,failedRequests:failures},null,2));
console.log(JSON.stringify({passed:checks.length,checks,errors,failedRequests:failures},null,2));
}catch(e){await page.screenshot({path:out+'/failure.png',fullPage:true});await writeFile(out+'/functional-report.json',JSON.stringify({passed:checks,error:String(e),errors,failedRequests:failures},null,2));throw e;}finally{await ctx.close();await browser.close();}
