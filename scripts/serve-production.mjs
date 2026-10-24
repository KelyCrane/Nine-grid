import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=createServer((req,res)=>{try{let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(path==='/'){res.writeHead(302,{Location:'/Nine-grid/'});return res.end();}if(!path.startsWith('/Nine-grid/')){res.writeHead(404);return res.end();}let file=resolve(root,'.'+path.slice('/Nine-grid'.length));if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);return res.end();}if(existsSync(file)&&statSync(file).isDirectory())file=resolve(file,'index.html');const stat=statSync(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store'});createReadStream(file).pipe(res);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(4173,'127.0.0.1',()=>console.log('Production preview http://127.0.0.1:4173/Nine-grid/'));
