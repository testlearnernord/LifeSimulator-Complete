import { execFileSync } from 'node:child_process';
import { mkdirSync, cpSync, copyFileSync, rmSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import {createHash} from 'node:crypto';
import {join,relative} from 'node:path';
rmSync('dist', {recursive:true,force:true});
mkdirSync('dist', {recursive:true});
execFileSync('tsc', ['-p', 'tsconfig.json'], {stdio:'inherit'});
cpSync('public','dist',{recursive:true});
copyFileSync('index.html','dist/index.html');
copyFileSync('src/styles.css','dist/styles.css');
const hash=createHash('sha256');
function walk(dir){for(const name of readdirSync(dir).sort()){const path=join(dir,name);if(statSync(path).isDirectory())walk(path);else if(name!=='sw.js'){hash.update(relative('dist',path));hash.update(readFileSync(path));}}}
walk('dist');
const version=JSON.parse(readFileSync('package.json','utf8')).version;
const worker=readFileSync('dist/sw.js','utf8').replace('__APP_VERSION__',`${version}-${hash.digest('hex').slice(0,12)}`);
writeFileSync('dist/sw.js',worker);
console.log(`Production build: dist/ (cache ${version})`);
