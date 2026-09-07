import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import {sections,checkGroups} from '../handbook/content.mjs';
const files=['../docs/index.html','../public/鹦鹉饲养指南.html','../鹦鹉饲养指南.html'];
const html=await readFile(new URL(files[0],import.meta.url),'utf8');

test('all delivery copies are generated identically and fit a modest offline size',async()=>{
  for(const f of files.slice(1)) assert.equal(await readFile(new URL(f,import.meta.url),'utf8'),html);
  assert.ok(Buffer.byteLength(html)<900_000);
});
test('16 chapters, scoped checklist groups, diagrams, and two embedded real photos',()=>{
  assert.equal(sections.length,16);
  assert.equal((html.match(/class="chapter /g)||[]).length,16);
  assert.equal((html.match(/<img /g)||[]).length,2);
  assert.equal((html.match(/src="data:image\/jpeg;base64,/g)||[]).length,2);
  assert.ok((html.match(/<figure class="diagram">/g)||[]).length>=6);
  const expectedDetails = sections.reduce((n,s)=>n+(s.body.match(/<details>/g)||[]).length,0);
  assert.ok(expectedDetails >= 35);
  assert.equal((html.match(/<details>/g)||[]).length,expectedDetails);
  assert.equal((html.match(/type="checkbox"/g)||[]).length,checkGroups.reduce((n,g)=>n+g.items.length,0));
});
test('no runtime CDN, original extracts, or unresolved placeholders',()=>{
  assert.doesNotMatch(html,/<(?:script|img)[^>]*src="https?:/);
  assert.doesNotMatch(html,/<link[^>]*href="https?:/);
  const withoutImages=html.replace(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g,'embedded-photo');
  assert.doesNotMatch(withoutImages,/\{\{PHOTO_|<blockquote|原文摘录|引用原文|\bOCR\b|\.pdf["#?]/);
  assert.doesNotMatch(html,/conic-gradient|约 60–70%|约 5–10%/);
});
test('ids are unique and every in-page destination exists',()=>{
  const ids=Array.from(html.matchAll(/\bid="([^"]+)"/g),m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  const anchors=Array.from(html.matchAll(/href="#([^"]+)"/g),m=>m[1]);
  for(const a of anchors) assert.ok(ids.includes(a),'missing '+a);
});
test('standalone script parses and mobile accessibility hooks remain',()=>{
  const script=html.match(/<script>([\s\S]+)<\/script>/)[1];
  assert.doesNotThrow(()=>new vm.Script(script));
  for(const fragment of ['viewport-fit=cover','safe-area-inset-bottom','prefers-reduced-motion','aria-modal="true"','role="status"','parrot-v2-check-','beforeprint','localStorage']) assert.ok(html.includes(fragment));
});
