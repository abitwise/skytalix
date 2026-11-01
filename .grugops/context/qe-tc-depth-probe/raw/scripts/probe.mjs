// qe-tc-depth-probe search driver. One JSON line per search on <out.jsonl>.
// usage:
//   node probe.mjs fresh  <clone> <positions.json> <named.json> <out.jsonl>   one process per search, 25 pos x 5 controls
//   node probe.mjs warm   <clone> <positions.json> <named.json> <out.jsonl>   per pos: cold 100 ms, 10 warm-ups, warm 100 ms
//   node probe.mjs repeat <clone> <positions.json> <named.json> <out.jsonl>   the 5 named positions x 3, fresh, 100 ms
//   node probe.mjs sf     <stockfish> <positions.json> <out.jsonl>            per E per SF position: go depth <pick depth>
// Wall time = hrtime from writing `go` to reading `bestmove` (the GUI's view). Host fields are read before `go`,
// outside the timed window. No path is written to the output.
import { spawn, execFileSync } from "node:child_process";
import { readFileSync, appendFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CONTROLS = [100, 250, 500, 1000, 4000];
const ELOS = [1910, 2000, 2100, 2200, 2300, 2400, 2500, 2600];

function host() {
  let vitest = 0;
  try {
    vitest = execFileSync("pgrep", ["-f", "[/]vitest"], { encoding: "utf8" }).trim().split("\n").filter(Boolean).length;
  } catch { vitest = 0; }
  let tctl = null;
  for (const h of readdirSync("/sys/class/hwmon")) {
    try {
      if (readFileSync(`/sys/class/hwmon/${h}/name`, "utf8").trim() === "k10temp")
        tctl = Number(readFileSync(`/sys/class/hwmon/${h}/temp1_input`, "utf8")) / 1000;
    } catch {}
  }
  const load1 = Number(readFileSync("/proc/loadavg", "utf8").split(" ")[0]);
  return { vitest, tctl, load1 };
}

class Engine {
  constructor(cmd, args, cwd) {
    this.p = spawn(cmd, args, { cwd, stdio: ["pipe", "pipe", "pipe"] });
    this.buf = "";
    this.lines = [];
    this.waiter = null;
    this.stderr = "";
    this.p.stderr.on("data", (d) => { this.stderr += d; });
    this.p.stdout.on("data", (d) => {
      const t = process.hrtime.bigint();
      this.buf += d;
      let i;
      while ((i = this.buf.indexOf("\n")) >= 0) {
        const line = this.buf.slice(0, i).trimEnd();
        this.buf = this.buf.slice(i + 1);
        this.lines.push({ line, t });
        this.check();
      }
    });
    this.exited = new Promise((r) => this.p.on("exit", (code, sig) => r({ code, sig })));
  }
  check() {
    if (!this.waiter) return;
    const idx = this.lines.findIndex((l) => this.waiter.pred(l.line));
    if (idx >= 0) {
      const got = this.lines.splice(0, idx + 1);
      const w = this.waiter; this.waiter = null; clearTimeout(w.timer);
      w.resolve({ hit: got[got.length - 1], seen: got });
    }
  }
  send(s) { this.p.stdin.write(`${s}\n`); }
  wait(pred, ms = 20000) {
    return new Promise((resolve, reject) => {
      this.waiter = { pred, resolve, timer: setTimeout(() => reject(new Error(`timeout waiting; last: ${this.lines.slice(-3).map((l) => l.line)}`)), ms) };
      this.check();
    });
  }
  async quit() {
    this.send("quit");
    const t = setTimeout(() => this.p.kill("SIGTERM"), 5000);
    const r = await this.exited; clearTimeout(t); return r;
  }
}

async function skyStart(clone) {
  const e = new Engine(process.execPath, [join(clone, "dist/uci.js")], clone);
  e.send("uci"); await e.wait((l) => l === "uciok");
  e.send("setoption name OwnBook value false");
  e.send("isready"); await e.wait((l) => l === "readyok");
  return e;
}

async function skySearch(e, fen, ms) {
  e.send(`position fen ${fen}`);
  e.send("isready"); await e.wait((l) => l === "readyok");
  const h = host();
  const t0 = process.hrtime.bigint();
  e.send(`go movetime ${ms}`);
  const { hit, seen } = await e.wait((l) => l.startsWith("bestmove"), ms + 30000);
  const wall = Number(hit.t - t0) / 1e6;
  const info = seen.map((s) => s.line).filter((l) => l.startsWith("info depth")).pop() ?? "";
  const num = (k) => { const m = info.match(new RegExp(` ${k} (-?\\d+)`)); return m ? Number(m[1]) : null; };
  const book = seen.some((s) => s.line === "info string book");
  return { budget: ms, depth: num("depth"), nodes: num("nodes"), engine_ms: num("time"), nps: num("nps"),
    wall_ms: Math.round(wall * 100) / 100, over_ms: Math.round((wall - ms) * 100) / 100, best: hit.line.split(" ")[1], book, ...h };
}

function loadPositions(posFile, namedFile) {
  const named = JSON.parse(readFileSync(namedFile, "utf8")).map((p) => ({ id: p.name, fen: p.fen }));
  const sampled = JSON.parse(readFileSync(posFile, "utf8")).skytalix.map((p, i) => ({ id: `S${String(i + 1).padStart(2, "0")}`, fen: p.fen, ply: p.ply }));
  return [...named, ...sampled];
}

const [mode, ...a] = process.argv.slice(2);
const out = a[a.length - 1];
const write = (row) => appendFileSync(out, `${JSON.stringify({ at: new Date().toISOString(), ...row })}\n`);

if (mode === "fresh" || mode === "repeat") {
  const [clone, posFile, namedFile] = a;
  const all = loadPositions(posFile, namedFile);
  const list = mode === "fresh" ? all : [...all.slice(0, 5), ...all.slice(0, 5), ...all.slice(0, 5)];
  const controls = mode === "fresh" ? CONTROLS : [100];
  for (const p of list) for (const ms of controls) {
    const e = await skyStart(clone);
    const r = await skySearch(e, p.fen, ms);
    const x = await e.quit();
    write({ mode, pos: p.id, ...r, exit: x.code, stderr_bytes: e.stderr.length });
  }
} else if (mode === "warm") {
  const [clone, posFile, namedFile] = a;
  const all = loadPositions(posFile, namedFile);
  for (let i = 0; i < all.length; i++) {
    const e = await skyStart(clone);
    const cold = await skySearch(e, all[i].fen, 100);
    for (let k = 1; k <= 10; k++) await skySearch(e, all[(i + k) % all.length].fen, 100);
    const warm = await skySearch(e, all[i].fen, 100);
    const x = await e.quit();
    write({ mode, pos: all[i].id, phase: "cold", ...cold });
    write({ mode, pos: all[i].id, phase: "warm", ...warm, exit: x.code, stderr_bytes: e.stderr.length });
  }
} else if (mode === "sf") {
  const [sf, posFile] = a;
  const pos = JSON.parse(readFileSync(posFile, "utf8")).stockfish;
  const pick = (E) => {
    const e = (E - 1320) / 1870;
    const level = Math.min(19, Math.max(0, ((37.2473 * e - 40.8525) * e + 22.2943) * e - 0.311438));
    return { level, depth: 1 + Math.floor(level) };
  };
  for (const E of ELOS) {
    const { level, depth } = pick(E);
    for (let i = 0; i < pos.length; i++) {
      const e = new Engine(sf, [], undefined);
      e.send("uci"); await e.wait((l) => l === "uciok");
      for (const o of ["Threads value 1", "Hash value 16", "UCI_LimitStrength value true", `UCI_Elo value ${E}`]) e.send(`setoption name ${o}`);
      e.send("isready"); await e.wait((l) => l === "readyok");
      e.send("ucinewgame");
      e.send(`position fen ${pos[i].fen}`);
      e.send("isready"); await e.wait((l) => l === "readyok");
      const h = host();
      const t0 = process.hrtime.bigint();
      e.send(`go depth ${depth}`);
      const { hit, seen } = await e.wait((l) => l.startsWith("bestmove"), 60000);
      const wall = Number(hit.t - t0) / 1e6;
      const infos = seen.map((s) => s.line).filter((l) => / depth \d+ /.test(l) && / pv /.test(l));
      const maxDepth = Math.max(0, ...infos.map((l) => Number(l.match(/ depth (\d+)/)[1])));
      const atPick = infos.filter((l) => Number(l.match(/ depth (\d+)/)[1]) === depth);
      const sfTime = atPick.length ? Math.max(...atPick.map((l) => Number((l.match(/ time (\d+)/) ?? [0, NaN])[1]))) : null;
      const multipv = Math.max(1, ...infos.map((l) => Number((l.match(/ multipv (\d+)/) ?? [0, 1])[1])));
      const x = await e.quit();
      write({ mode, E, level: Math.round(level * 1000) / 1000, pick_depth: depth, pos: `F${String(i + 1).padStart(2, "0")}`,
        wall_ms: Math.round(wall * 100) / 100, sf_time_ms: sfTime, max_depth: maxDepth, multipv, best: hit.line.split(" ")[1], exit: x.code, ...h });
    }
  }
} else {
  console.error("unknown mode"); process.exit(2);
}
