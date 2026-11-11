// Read-only deployment health checks. Never creates users or modifies coursework.
const base=process.argv[2]||process.env.UNICONNECT_BASE_URL||'https://frontend-iota-gilt-81.vercel.app';
(async()=>{
 for(const path of ['/','/login','/signup','/catalog','/api/health','/api/ready','/api/catalog']){
  const r=await fetch(new URL(path,base));if(r.status!==200)throw new Error(path+' returned '+r.status);
  if(path==='/api/health'&&(await r.json()).status!=='ok')throw new Error('API is not healthy');
  if(path==='/api/ready'&&(await r.json()).status!=='ready')throw new Error('API database is not ready');
  if(path==='/api/catalog'&&!Array.isArray((await r.json()).courses))throw new Error('Course catalogue response is invalid');
 }
 const denied=await fetch(new URL('/api/stats/general',base));if(![401,403].includes(denied.status))throw new Error('Anonymous statistics access must be denied');
 console.log('Website pages, catalogue, API readiness, and anonymous access checks passed without modifying data. Signup/login are not exercised by this read-only check.');
})().catch(error=>{console.error(error.message);process.exitCode=1});
