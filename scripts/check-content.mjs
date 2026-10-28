// Focused regression checks for the source and translation corrections.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
const extra=JSON.parse(fs.readFileSync(path.join(root,'content/additional-projects.json'),'utf8'));
for(const p of [...data.projects,...extra]){
  for(const key of ['evidence','evidenceNote','actionsHeading'])assert(p[key]?.length===2&&p[key].every(Boolean),`${p.id}: missing bilingual ${key}`);
}
assert(data.projects.find(p=>p.id==='peer').title[0].includes('top-ranked'));
assert(!JSON.stringify(data).includes('Medical Mystery Night'));
assert(!JSON.stringify(data).includes('I designed the interactive'));
assert(data.metrics[1].value==='~20');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/media-rules.js'),'utf8'),scope);
const {normalise,safeImagePath}=scope.window.HOTWIND_MEDIA_RULES;
for(const bad of ['https://example.com/pixel.png','//example.com/pixel.png','javascript:alert(1)','assets/images/../private.jpg','assets/images/x.jpg" onerror="alert(1)'])assert(!safeImagePath(bad),bad);
const safe=normalise({photo:{src:'assets/images/team/team.webp',thumb:'https://example.com/pixel.png',position:'center;background:url(https://example.com)',width:'1" onload="x',height:-1,category:'<script>'}}).photo;
assert.equal(safe.thumb,safe.src);assert.equal(safe.position,'center');assert.equal(safe.width,1600);assert.equal(safe.height,1200);assert.equal(safe.category,'evidence');
assert.equal(Object.keys(normalise({external:{src:'https://example.com/pixel.png'}})).length,0);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('Content-Security-Policy'));assert(html.includes("connect-src 'none'"));
assert(!html.includes('<form'));
console.log('PASS: seven bilingual source notes, corrected labels and contribution wording, restricted media URLs and site CSP.');
