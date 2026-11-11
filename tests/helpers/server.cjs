// Starter `python3 -m http.server` i repo-roden på en ledig port. Til e2e-tests.
const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

const rod = path.resolve(__dirname, '../..');

function ledigPort() {
  return new Promise((ok, fejl) => {
    const s = net.createServer();
    s.unref();
    s.on('error', fejl);
    s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); });
  });
}

async function startServer() {
  const port = await ledigPort();
  const proc = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: rod, stdio: 'ignore' });
  const base = 'http://127.0.0.1:' + port + '/';
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(base + 'index.html'); if (r.ok) return { base, stop: () => proc.kill() }; } catch (e) {}
    await new Promise(r => setTimeout(r, 100));
  }
  proc.kill();
  throw new Error('http.server startede ikke');
}

module.exports = { startServer };
