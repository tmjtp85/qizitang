const { execSync } = require('child_process');
try {
  const out = execSync('npx vite --host', { cwd: 'C:\\Users\\ADMINI~1\\Desktop\\??\\frontend', timeout: 15000 });
  console.log('OUT:', out.toString());
} catch(e) {
  console.log('Code:', e.status);
  if (e.stdout) console.log('STDOUT:', e.stdout.toString().slice(0,2000));
  if (e.stderr) console.log('STDERR:', e.stderr.toString().slice(0,2000));
}
