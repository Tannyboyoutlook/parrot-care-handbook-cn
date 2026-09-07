import assert from 'node:assert/strict';
import test from 'node:test';

test('server renders the real handbook wrapper rather than a starter skeleton', async () => {
  const {default: worker} = await import('../dist/server/index.js');
  const response = await worker.fetch(new Request('http://localhost/', {headers:{accept:'text/html'}}), {ASSETS:{fetch:async()=>new Response('Not found',{status:404})}}, {waitUntil(){},passThroughOnException(){}});
  assert.equal(response.status,200);
  assert.match(response.headers.get('content-type'),/^text\/html/);
  const html=await response.text();
  assert.match(html,/<iframe[^>]*src="\/鹦鹉饲养指南.html"/);
  assert.match(html,/虎皮与小太阳/);
  assert.doesNotMatch(html,/Your site is taking shape|react-loading-skeleton|codex-preview/);
});
