// Read-only deployment health checks. Never creates users or modifies coursework.
const base=process.argv[2]||'https://unicomnect-test.vercel.app';
(async()=>{
 for(const path of ['/','/login','/signup','/catalog','/api/health','/api/catalog']){
  const r=await fetch(new URL(path,base));if(r.status!==200)throw new Error(path+' returned '+r.status);
  if(path==='/api/health'&&(await r.json()).status!=='ok')throw new Error('API is not healthy');
  if(path==='/api/catalog'&&!(await r.json()).courses?.length)throw new Error('Course catalogue is empty');
 }
 const denied=await fetch(new URL('/api/stats/general',base));if(![401,403].includes(denied.status))throw new Error('Anonymous statistics access must be denied');
 console.log('Website, registration, catalogue, API, and anonymous access checks passed without modifying data.');
})().catch(error=>{console.error(error.message);process.exitCode=1});
