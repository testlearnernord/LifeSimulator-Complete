import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {join,extname,resolve,sep} from 'node:path';
const root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.json':'application/json'};
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{
 const clean=decodeURIComponent((req.url||'/').split('?')[0]||'/');
 const requested=resolve(join(root,clean==='/'?'index.html':clean.replace(/^\//,'')));
 if(requested!==root&&!requested.startsWith(root+sep)){res.writeHead(403).end('Forbidden');return;}
 try {const info=await stat(requested);if(!info.isFile())throw Error('Not file');const bytes=await readFile(requested);res.writeHead(200,{'content-type':mime[extname(requested)]||'application/octet-stream','cache-control':requested.endsWith('sw.js')?'no-cache':'no-cache'});res.end(bytes);}catch{res.writeHead(404).end('Not found');}
}).listen(port, '0.0.0.0',()=>console.log(`Local server: http://localhost:${port}`));
