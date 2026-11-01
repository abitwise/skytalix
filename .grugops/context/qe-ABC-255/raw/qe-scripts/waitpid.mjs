// Wait on a PID with kill -0 (process.kill(pid, 0)), polling every 10 s, up to <maxSec>. Prints "gone" or "alive".
// usage: node waitpid.mjs <pid> <maxSec>
const [pid, maxSec] = process.argv.slice(2).map(Number);
const t0 = Date.now();
const alive = () => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };
while (alive() && Date.now() - t0 < maxSec * 1000) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10_000);
console.log(alive() ? `alive after ${maxSec} s` : `gone after ${((Date.now() - t0) / 1000).toFixed(0)} s`);
