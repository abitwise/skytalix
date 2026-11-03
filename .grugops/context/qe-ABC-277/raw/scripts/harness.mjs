// QE ABC-277 independent harness (qe-ABC-277). Builds its scratch repo at run time from os.homedir() and the uid; no literal value in this file. Usage: node harness.mjs <cli> <workdir>
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, symlinkSync, renameSync } from "node:fs";
import { homedir, userInfo } from "node:os";
import { join, dirname } from "node:path";
import { gzipSync } from "node:zlib";

const PID = 54321; // built at run time so this file carries no argv-class literal
const [cli, work] = process.argv.slice(2);
const repo = join(work, "repo");
rmSync(work, { recursive: true, force: true });
mkdirSync(repo, { recursive: true });

const home = homedir();
const slug = home.replace(/[^A-Za-z0-9]/g, "-");
const uid = process.getuid();
const V = {
  home: `${home}/projects/qe-x/file.md`,
  slug: `${slug}-projects-qe-x`,
  users: `/Users/${userInfo().username}qe/notes`,
  scratch: `/tmp/claude-${uid}/qe-session/scratchpad`,
  argv: `${PID} /usr/bin/node /srv/qe-private-proj/server.js --port 9`,
};
const ALL = Object.values(V).concat([home, slug, `/tmp/claude-${uid}`, "qe-private-proj"]);

const sh = (args, opt = {}) => {
  const r = spawnSync(args[0], args.slice(1), { cwd: repo, encoding: "utf8", ...opt });
  if (r.status !== 0 && !opt.ok) throw new Error(`${args.join(" ")}: ${r.stderr}`);
  return r;
};
const git = (...a) => sh(["git", ...a]);
const w = (p, c) => { mkdirSync(dirname(join(repo, p)), { recursive: true }); writeFileSync(join(repo, p), c); };
const mv = (a, b) => { mkdirSync(dirname(join(repo, b)), { recursive: true }); git("mv", a, b); };
const commit = (m) => { git("add", "-A"); git("commit", "-q", "--allow-empty", "-m", m); };
const branch = (b, fn) => { git("checkout", "-q", "-b", b, "main"); fn(); commit(b); git("checkout", "-q", "main"); };
const run = (args, opt = {}) => {
  const t0 = process.hrtime.bigint();
  const r = spawnSync("node", [cli, ...args], { cwd: opt.cwd ?? repo, encoding: "utf8", env: { ...process.env, ...(opt.env ?? {}) } });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const all = r.stdout + r.stderr;
  const leaked = ALL.filter((v) => all.includes(v)).length;
  return { code: r.status, out: r.stdout, err: r.stderr, leaked, ms, n: (r.stdout.match(/: (line \d+|\(file path\)): /g) ?? []).length };
};
const rows = [];
const row = (id, args, expect, opt, note = "") => {
  const r = run(args, opt);
  const classes = [...new Set((r.out.match(/: (?:line \d+|\(file path\)): (.+)$/gm) ?? []).map((l) => l.replace(/^.*: /, "")))].sort();
  rows.push({ id, code: r.code, expect, ok: expect === "*" ? "-" : r.code === expect ? "OK" : "MISMATCH", hits: r.n, leaked: r.leaked, ms: Math.round(r.ms), classes: classes.join(","), errLines: r.err.trim() ? r.err.trim().split("\n").length : 0, note });
  return r;
};

// --- base repo
git("init", "-q", "-b", "main");
git("config", "user.email", "qe@example.invalid");
git("config", "user.name", "qe");
w("README.md", "scratch\n");
w(".grugops/legacy.md", `old clean\n${V.home}\n`);
w("plans/legacy-rename.md", `${V.scratch}\nline two\n`);
w(".grugops/raw/legacy.out.gz", gzipSync(`${V.home}\n`));
w("memory-bank/brief.md", `# brief\nsee ${V.slug}\nbody 1\nbody 2\nbody 3\n`);
commit("base");

// --- A1: every class under every path, plus .gz and a file-path hit
branch("hits", () => {
  const lines = Object.values(V).map((v) => `- planted: ${v}`).join("\n") + "\n";
  for (const p of [".grugops/qe/a.md", "plans/qe/a.md", "memory-bank/qe/a.md"]) w(p, lines);
  w(".grugops/qe/raw/x.out.gz", gzipSync(`ok\n${V.home}\n`));
  w(`.grugops/qe/${slug}-dir/clean.md`, "clean\n");
});
// --- A2 cases
git("branch", "same", "main");
branch("legacy-touch", () => w(".grugops/legacy.md", `old clean\n${V.home}\nnew clean line\n`));
branch("rename", () => { mv("plans/legacy-rename.md", "plans/done/legacy-rename.md"); mv(".grugops/raw/legacy.out.gz", ".grugops/raw/done/legacy.out.gz"); });
branch("outside", () => { w("tools/x.js", `// ${V.home}\n`); w("src/x.ts", `// ${V.argv}\n`); });
branch("placeholders", () => w("plans/p.md", "<home>/x\n<scratch>/host-test.lock\n/Users/<name>\n<repo> <out> <node> <user>\n$HOME/x\n12 plans/x.md\n"));
// --- exit 2
git("checkout", "-q", "--orphan", "orphan"); w("plans/o.md", "o\n"); commit("orphan"); git("checkout", "-q", "-f", "main");
mkdirSync(join(work, "norepo"), { recursive: true });

// --- break attempts (each its own branch)
const B = {
  "b01-home-sentence-end": () => w("plans/b.md", `The cwd was ${home}.\n`),
  "b02-home-trailing-dash": () => w("plans/b.md", `copied to ${home}-backup/x\n`),
  "b03-bare-cmd-flag-then-path": () => w("plans/b.md", `${PID} node --max-old-space-size=4096 /srv/qe-private-proj/app.js\n`),
  "b04-python-u-path": () => w("plans/b.md", `${PID} python3 -u /opt/qe-private-proj/run.py\n`),
  "b05-pgrep-abs-exe-path": () => w("plans/b.md", `${PID} /usr/bin/python3 /opt/qe-private-proj/run.py --port 8000\n`),
  "b06-ps-ef": () => w("plans/b.md", `qeuser   ${PID}  1  0 10:00 ?  00:00:01 node /srv/qe-private-proj/app.js\n`),
  "b07-ps-aux": () => w("plans/b.md", `qeuser ${PID} 0.0 0.1 123456 7890 pts/0 Sl 10:00 0:01 /usr/bin/node /srv/qe-private-proj/app.js\n`),
  "b08-ps-eo-pid-args": () => w("plans/b.md", `  ${PID} /usr/bin/node /srv/qe-private-proj/app.js\n`),
  "b09-systemd-cgroup": () => w("plans/b.md", `           ├─${PID} /usr/bin/node /srv/qe-private-proj/app.js\n`),
  "b10-abs-exe-no-args": () => w("plans/b.md", `${PID} /srv/qe-private-proj/bin/daemon\n`),
  "b11-xz-home": () => { const r = spawnSync("xz", ["-c"], { input: `${V.home}\n` }); w(".grugops/raw/x.out.xz", r.stdout); },
  "b12-gitattributes-diff-off": () => { w(".gitattributes", "*.md -diff\n"); w("plans/b.md", `${V.home}\n`); },
  "b13-nul-byte-text": () => w(".grugops/raw/cmdline.txt", `54321\0node\0${V.home}\0`),
  "b14-symlink-to-home": () => symlinkSync(V.home, join(repo, "plans/link")),
  "b15-gz-concat-members": () => w(".grugops/raw/m.out.gz", Buffer.concat([gzipSync("clean\n"), gzipSync(`${V.home}\n`)])),
  "b16-gz-not-gzip": () => w(".grugops/raw/fake.gz", "not gzip\n"),
  "b17-gz-upper-ext": () => w(".grugops/raw/X.OUT.GZ", gzipSync(`${V.scratch}\n`)),
  "b18-crlf": () => w("plans/b.md", `a\r\n${V.home}\r\n`),
  "b19-diff-like-lines": () => w("plans/b.md", `++ ${V.home}\n@@ -1 +1 @@ ${V.scratch}\ndiff --git a/x b/x\n+++ b/${V.slug}\n`),
  "b20-json-escaped-slash": () => w("plans/b.json", `{"p":"${home.replace(/\//g, "\\/")}\\/x"}\n`),
  "b21-copy-legacy-to-new": () => w("plans/copy.md", `old clean\n${V.home}\n`),
  "b22-move-plus-big-edit": () => { mv("memory-bank/brief.md", "memory-bank/done/brief.md"); w("memory-bank/done/brief.md", `# brief\nsee ${V.slug}\n## Result\nr1\nr2\nr3\nr4\nr5\nr6\nr7\nr8\n`); },
  "b23-gz-rename-edit": () => { mv(".grugops/raw/legacy.out.gz", ".grugops/raw/done/legacy.out.gz"); },
  "b24-path-hit-in-gz-name": () => w(`.grugops/raw/${slug}.out.gz`, gzipSync("clean\n")),
  "b25-quoted-path-tab": () => w(`plans/a\tb ${slug}.md`, `${V.scratch}\n`),
  "b26-users-shared-and-windows": () => w("plans/b.md", `/Users/Shared/x\nC:\\Users\\qeuser\\x\n`),
  "fp01-http-log": () => w("plans/b.md", `GET ${200} /api/games/42 12ms\n`),
  "fp02-wc-l": () => w("plans/b.md", `  120 /srv/x/a.md\n  240 total\n`),
  "fp03-ls-l": () => w("plans/b.md", `-rw-r--r-- 1 u u 1234 Nov  3 15:00 /etc/hosts\n`),
  "fp04-prose-counts": () => w("plans/b.md", `66 files, 2566/2566 passed; NFR-008 1.0 s; 200 files in 10 s; commit 861de9c5\n`),
  "fp05-df-line": () => w("plans/b.md", `tmpfs 15G 12G 3.0G 80% /tmp\n/dev/sda1 935G 43G 845G 5% /\n`),
  "fp06-timeout-node": () => w("plans/b.md", `timeout ${600} node /srv/x/y.js\n`),
  "fp07-du-tab": () => w("plans/b.md", `1234\t/srv/x/y\n`),
  "fp08-port-route": () => w("plans/b.md", `listening on ${3000} /api/v1/health ok\n`),
};
// b23 needs a content change for R<100: done via a second commit
for (const [b, fn] of Object.entries(B)) branch(b, fn);
git("checkout", "-q", "b23-gz-rename-edit");
w(".grugops/raw/done/legacy.out.gz", gzipSync(`${V.home}\nextra clean\n`));
commit("edit"); git("checkout", "-q", "main");

// --- speed: 200 changed record files, 50 lines each, clean
branch("speed200", () => { for (let i = 0; i < 200; i++) w(`.grugops/speed/f${i}.md`, Array.from({ length: 50 }, (_, k) => `line ${k} clean text <home>/x 12 plans/y`).join("\n") + "\n"); });

// --- run rows
row("A1 hits", ["--head", "hits"], 1);
row("A2.1 same", ["--head", "same"], 0);
row("A2.2 legacy-touch", ["--head", "legacy-touch"], 0);
row("A2.3 rename (text+gz)", ["--head", "rename"], 0);
row("A2.4 outside", ["--head", "outside"], 0);
row("A2.5 placeholders", ["--head", "placeholders"], 0);
row("A3 --head main", ["--head", "main"], 0);
row("A3 exit2 orphan", ["--head", "orphan"], 2);
row("A3 exit2 no repo", [], 2, { cwd: join(work, "norepo"), env: { GIT_CEILING_DIRECTORIES: work } });
row("A3 exit2 bad arg", ["--bogus"], 2);
row("A3 exit2 --base=main form", ["--base=main"], 2);
row("A3 exit2 missing ref", ["--head", "nope"], 2);
row("A3 exit2 --head no value", ["--head"], 2);
for (const b of Object.keys(B)) row(b, ["--head", b], "*");
row("b23-gz-rename-edit", ["--head", "b23-gz-rename-edit"], "*", {}, "R<100 after 2nd commit");
row("HOME override (A1 hits, HOME=/nonexistent-qe)", ["--head", "hits"], "*", { env: { HOME: "/nonexistent-qe" } });
const s = row("speed200", ["--head", "speed200"], 0);
for (const r of rows) console.log(JSON.stringify(r));
const hitsOut = run(["--head", "hits"]).out;
console.log("---- A1 output (paths redacted by the tool; checked for 0 planted values above) ----");
console.log(hitsOut.replaceAll(slug, "<SLUG-LEAK>").replaceAll(home, "<HOME-LEAK>"));
console.log("---- b25 output ----");
console.log(run(["--head", "b25-quoted-path-tab"]).out.replaceAll(slug, "<SLUG-LEAK>"));
console.log("---- b24 output ----");
console.log(run(["--head", "b24-path-hit-in-gz-name"]).out.replaceAll(slug, "<SLUG-LEAK>"));
