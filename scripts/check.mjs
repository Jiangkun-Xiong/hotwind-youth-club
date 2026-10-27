// Check the site’s local navigation, asset files and media records.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const errors=[];let links=0;
for(const file of files){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${file}: expected one h1`);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)[^"]*"/g)){
  const raw=match[1];if(/^(https?:|data:|mailto:)/.test(raw))continue;
  const asset=raw.split('#')[0].split('?')[0];links++;
  if(!fs.existsSync(path.join(root,asset)))errors.push(`${file}: missing ${asset}`);
 }
}
const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/media.js'),'utf8'),scope);
for(const [key,m]of Object.entries(scope.window.HOTWIND_MEDIA)){
 for(const prop of ['src','thumb'])if(m[prop]&&!fs.existsSync(path.join(root,m[prop])))errors.push(`${key}: missing ${prop}`);
 for(const prop of ['alt','caption'])if(!m[prop]?.en||!m[prop]?.zh)errors.push(`${key}: missing bilingual ${prop}`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${files.length} HTML pages, ${links} local links/assets and ${Object.keys(scope.window.HOTWIND_MEDIA).length} bilingual image records.`);
