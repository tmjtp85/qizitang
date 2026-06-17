const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const out = fs.openSync(path.join(__dirname, 'be.log'), 'a');
const err = fs.openSync(path.join(__dirname, 'be.err'), 'a');

const child = spawn('node', [path.join(__dirname, 'app.js')], {
  detached: true,
  stdio: ['ignore', out, err],
  cwd: __dirname
});

child.unref();

fs.writeFileSync(path.join(__dirname, '.pid'), String(child.pid));
console.log('Server launched with PID:', child.pid);
process.exit(0);