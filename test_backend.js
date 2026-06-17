const { execSync } = require('child_process');
try {
  const out = execSync('node app.js', { cwd: 'C:\\Users\\Administrator\\Desktop\\??\\backend', timeout: 15000 });
  console.log('STDOUT:', out.toString());
} catch(e) { 
  console.log('Exit code:', e.status);
  if (e.stdout) console.log('STDOUT:', e.stdout.toString().slice(0,1000));
  if (e.stderr) console.log('STDERR:', e.stderr.toString().slice(0,1000));
}
