// QE ABC-278 independent harness (qe-ABC-278). Builds its scratch repo at run time from os.homedir(),
// os.userInfo() and the uid; no literal host value is in this file. Every value it plants is replaced
// before printing, and each row counts how many planted values reached stdout/stderr (`leaked`).
// Usage: node harness.mjs <path-to-records-path-check.js> <workdir>   (workdir is deleted first)
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { homedir, userInfo } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const [cli, work] = process.argv.slice(2);
const mod = await import(pathToFileURL(cli).href);
const repo = join(work, "repo");
const mainWt = join(work, "main-wt");
rmSync(work, { recursive: true, force: true });
mkdirSync(repo, { recursive: true });

const home = homedir().replace(/\/+$/, "");
const account = userInfo().homedir.replace(/\/+$/, "");
const slug = home.replace(/[^A-Za-z0-9]/g, "-");
const aslug = account.replace(/[^A-Za-z0-9]/g, "-");
const uid = process.getuid();
const P = 40000 + (process.pid % 9000); // a pid-shaped number built at run time
const S = `/tmp/claude-${uid}`;
const V = {
  home: `${home}/projects/qe-y/file.md`,
  slug: `${slug}-projects-qe-y`,
  users: `/Users/${userInfo().username}qe/notes`,
  scratch: `${S}/qe-session/scratchpad`,
  argv: `${P} /usr/bin/node /srv/qe-priv-proj/server.js --port 9`,
};
const ALL = [...new Set([...Object.values(V), home, account, slug, aslug, S, "qe-priv-proj"])];
const scrub = (s) =>
  [...ALL].sort((a, b) => b.length - a.length).reduce((o, v) => o.replaceAll(v, "<LEAK>"), s);

const sh = (args, opt = {}) => {
  const r = spawnSync(args[0], args.slice(1), { cwd: opt.cwd ?? repo, encoding: "utf8", ...opt });
  if (r.status !== 0 && !opt.ok) throw new Error(`${args.join(" ")}: ${r.stderr}`);
  return r;
};
const git = (...a) => sh(["git", ...a]);
const w = (p, c) => {
  mkdirSync(dirname(join(repo, p)), { recursive: true });
  writeFileSync(join(repo, p), c);
};
const xz = (text, args = ["-c"]) => execFileSync("xz", args, { input: text });
const commit = (m) => {
  git("add", "-A");
  git("commit", "-q", "--allow-empty", "-m", m);
};
const branch = (b, fn, from = "main") => {
  git("checkout", "-q", "-b", b, from);
  fn();
  commit(b);
  git("checkout", "-q", "main");
};
const run = (args, opt = {}) => {
  const t0 = process.hrtime.bigint();
  const r = spawnSync(opt.node ?? process.execPath, [cli, ...args], {
    cwd: opt.cwd ?? repo,
    encoding: "utf8",
    env: opt.envExact ?? { ...process.env, ...(opt.env ?? {}) },
  });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const all = r.stdout + r.stderr;
  const findings = r.stdout.split("\n").filter((l) => / (?:line \d+|\(file path\)): /.test(l)).sort();
  return { code: r.status, out: r.stdout, err: r.stderr, leaked: ALL.filter((v) => all.includes(v)).length, ms, findings };
};
const rows = [];
const row = (id, args, expect, opt = {}, check = null) => {
  const r = run(args, opt);
  const classes = [...new Set(r.findings.map((l) => l.replace(/^.*: /, "")))].sort();
  let ok = expect === "*" ? "-" : r.code === expect ? "OK" : "MISMATCH";
  let extra = "";
  if (check) {
    const c = check(r);
    extra = c.note;
    if (!c.ok) ok = "MISMATCH";
  }
  rows.push({ id, code: r.code, expect, ok, hits: r.findings.length, leaked: r.leaked, ms: Math.round(r.ms), classes: classes.join(","), errLines: r.err.trim() ? r.err.trim().split("\n").length : 0, note: extra });
  return r;
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------------- base repo
git("init", "-q", "-b", "main");
git("config", "user.email", "qe@example.invalid");
git("config", "user.name", "qe");
w("README.md", "scratch\n");
w(".grugops/raw/legacy.out.xz", xz(`clean\nclean\n${V.home}\n`));
w("tmp-outside/leak.out.xz", xz(`clean\n${V.home}\n`));
w("memory-bank/brief.md", "# brief\nbody\n");
commit("base");

// ---------------- A1: attributes cannot blind it
const planted = `- planted: ${V.home}\n- planted: ${V.scratch}\n`;
branch("a1-diff", () => { w(".gitattributes", "*.md -diff\n"); w(".grugops/q/a.md", planted); w("plans/q/b.md", planted); });
branch("a1-binary", () => { w(".gitattributes", "*.md binary\n"); w(".grugops/q/a.md", planted); w("plans/q/b.md", planted); });
branch("a1-nested", () => { w(".grugops/.gitattributes", "* -diff\n"); w("plans/.gitattributes", "* binary\n"); w(".grugops/q/a.md", planted); w("plans/q/b.md", planted); });
branch("a1-nul", () => w(".grugops/raw/cmdline.md", Buffer.concat([Buffer.from("ok\0x\n"), Buffer.from(`${V.home}\n`), Buffer.from([0, 1, 2, 10])])));
branch("a1-plain", () => { w(".grugops/q/a.md", planted); w("plans/q/b.md", planted); });
branch("a1-driver", () => { w(".gitattributes", "*.md diff=qeconv\n"); w(".grugops/q/a.md", planted); });
branch("a1-utf16", () => w(".grugops/q/u16.md", Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(`${V.home}\n`, "utf16le")])));
branch("a1-gz-as-md", () => w(".grugops/q/packed.md", gzipSync(`${V.home}\n`)));
git("worktree", "add", "-q", "--detach", mainWt, "main");

const four = (b) => {
  git("checkout", "-q", b);
  const r1 = run([]);
  const r2 = run(["--head", b]);
  git("checkout", "-q", "main");
  const r3 = run(["--head", b]);
  const r4 = run(["--head", b], { cwd: mainWt });
  return [r1, r2, r3, r4];
};
for (const b of ["a1-diff", "a1-binary", "a1-nested"]) {
  const rs = four(b);
  const ref = run(["--head", "a1-plain"]).findings.filter((l) => !l.includes(".gitattributes"));
  const ok = rs.every((r) => r.code === 1 && same(r.findings, rs[0].findings)) && same(rs[0].findings, ref);
  rows.push({ id: `${b} x4 checkouts`, code: rs.map((r) => r.code).join("/"), expect: "1/1/1/1", ok: ok ? "OK" : "MISMATCH", hits: rs.map((r) => r.findings.length).join("/"), leaked: rs.reduce((n, r) => n + r.leaked, 0), ms: 0, classes: [...new Set(rs[0].findings.map((l) => l.replace(/^.*: /, "")))].sort().join(","), errLines: 0, note: `sets equal to each other and to the no-attribute branch: ${ok}` });
}
row("a1-nul", ["--head", "a1-nul"], 1, {}, (r) => ({ ok: r.findings.some((l) => / line 2: home-path$/.test(l)), note: "expects line 2: home-path" }));
writeFileSync(join(repo, ".git/info/attributes"), "*.md -diff\n");
git("checkout", "-q", "a1-plain");
row("a1-info-attributes (own checkout)", [], 1);
git("checkout", "-q", "main");
row("a1-info-attributes (--head)", ["--head", "a1-plain"], 1);
writeFileSync(join(repo, ".git/info/attributes"), "");
writeFileSync(join(work, "attrfile"), "* binary\n");
git("config", "core.attributesFile", join(work, "attrfile"));
row("a1-core.attributesFile", ["--head", "a1-plain"], 1);
git("config", "--unset", "core.attributesFile");
git("config", "diff.qeconv.textconv", "true");
git("config", "diff.qeconv.binary", "true");
row("a1-driver binary+textconv(true) in local config", ["--head", "a1-driver"], 1);
git("config", "--remove-section", "diff.qeconv");
row("a1-utf16 (no claim in ticket)", ["--head", "a1-utf16"], "*");
row("a1-gzip-bytes-under-.md (no claim)", ["--head", "a1-gz-as-md"], "*");

// ---------------- A2: .xz
branch("a2-add", () => w(".grugops/qe/raw/x.xz", xz(`clean one\nclean two\n${V.home}\nclean four\n`)));
branch("a2-r100", () => { mkdirSync(join(repo, ".grugops/raw/done"), { recursive: true }); git("mv", ".grugops/raw/legacy.out.xz", ".grugops/raw/done/legacy.out.xz"); });
branch("a2-modify", () => w(".grugops/raw/legacy.out.xz", xz(`clean\nclean\n${V.home}\nmore\n`)));
branch("a2-from-outside", () => { mkdirSync(join(repo, ".grugops/raw/in"), { recursive: true }); git("mv", "tmp-outside/leak.out.xz", ".grugops/raw/in/leak.out.xz"); });
branch("a2-upper", () => w(".grugops/qe/raw/Y.OUT.XZ", xz(`${V.scratch}\n`)));
branch("a2-not-xz", () => w(".grugops/qe/raw/fake.xz", "plain text, not xz\n"));
branch("a2-multistream", () => w(".grugops/qe/raw/m.xz", Buffer.concat([xz("clean\n"), xz(`${V.home}\n`)])));
branch("a2-lzma-alone", () => w(".grugops/qe/raw/l.xz", xz(`${V.home}\n`, ["-c", "--format=lzma"])));
branch("a2-symlink-xz", () => { mkdirSync(join(repo, ".grugops/qe"), { recursive: true }); symlinkSync("target", join(repo, ".grugops/qe/raw-link.xz")); });
branch("a2-bomb", () => w(".grugops/qe/raw/bomb.xz", xz(Buffer.alloc(300 * 1024 * 1024, 0x61), ["-c", "-0", "-T1"])));
row("a2-add", ["--head", "a2-add"], 1, {}, (r) => ({ ok: r.findings.length === 1 && /x\.xz \(decompressed\): line 3: home-path$/.test(r.findings[0]), note: "exactly `x.xz (decompressed): line 3: home-path`" }));
row("a2-r100", ["--head", "a2-r100"], 0);
const nox = join(work, "noxz-bin");
mkdirSync(nox, { recursive: true });
symlinkSync(execFileSync("sh", ["-c", "command -v git"], { encoding: "utf8" }).trim(), join(nox, "git"));
row("a2-add PATH without xz", ["--head", "a2-add"], 1, { env: { PATH: nox } }, (r) => ({ ok: r.findings.length === 1 && /x\.xz \(decompressed\): \(file path\): UNKNOWN - verify \(cannot decompress\)$/.test(r.findings[0]), note: "exactly one UNKNOWN" }));
row("a2-modify (M)", ["--head", "a2-modify"], 1);
row("a2-move from outside the 3 paths", ["--head", "a2-from-outside"], 1);
row("a2-upper .XZ", ["--head", "a2-upper"], 1);
row("a2-not-xz", ["--head", "a2-not-xz"], 1, {}, (r) => ({ ok: r.findings.length === 1 && r.findings[0].endsWith("UNKNOWN - verify (cannot decompress)"), note: "one UNKNOWN" }));
row("a2-multistream", ["--head", "a2-multistream"], 1);
row("a2-lzma-alone named .xz", ["--head", "a2-lzma-alone"], "*");
row("a2-symlink named .xz", ["--head", "a2-symlink-xz"], "*");
row("a2-bomb 300 MiB", ["--head", "a2-bomb"], 1, {}, (r) => ({ ok: r.findings.some((l) => l.endsWith("UNKNOWN - verify (cannot decompress)")), note: "over the 256 MiB cap -> UNKNOWN" }));

// ---------------- A3 / A5: classify rows (direct, synthetic home seam)
const synthHome = ["", "home", "qesynth"].join("/");
const list = mod.classes({ home: synthHome });
const C = (s) => mod.classify(s, list);
const abs = "/srv/qe-priv-proj/lib/app.js";
const exe = "/srv/qe-priv-proj/bin/worker";
const crow = (id, line, want) => {
  const got = C(line);
  rows.push({ id, code: JSON.stringify(got), expect: JSON.stringify(want), ok: same(got, want) ? "OK" : "MISMATCH", hits: 0, leaked: 0, ms: 0, classes: "", errLines: 0, note: "" });
};
const FA = ["foreign-argv"];
crow("A3.1 pid node --max-old-space-size=N abs", `${P} node --max-old-space-size=${4096} ${abs}`, FA);
crow("A3.1b pid node --inspect --trace-warnings abs", `[${P} node --inspect --trace-warnings ${abs} --port 1]`, FA);
crow("A3.2 pid python3 -u abs", `${P} python3 -u ${abs}`, FA);
crow("A3.3 pid abs-exec end of line", `${P} ${exe}`, FA);
crow("A3.3b pid abs-exec trailing spaces", `${P} ${exe}   `, FA);
crow("A3.3c pid abs-exec in [..]", `children: [${P} ${exe}] ok`, FA);
crow("A3.3d pid abs-exec in backticks", `see \`${P} ${exe}\` there`, FA);
const psUser = "qeuser";
crow("A3.4 ps -ef abs-exec arg", `${psUser}  ${P}  ${P - 7}  0 15:01 pts/1    00:00:02 ${exe} --x`, FA);
crow("A3.4b ps -ef CMD abs, ? tty, days", `${psUser}  ${P}  1  3 Nov03 ?   2-03:04:05 node ${abs}`, FA);
crow("A3.5 ps aux node abs", `${psUser} ${P} 0.0 0.1 ${123456} ${7890} pts/1 S+ 15:01 0:00 node ${abs}`, FA);
crow("A3.5b ps aux abs-exec, Ssl, Nov03, 12:34", `${psUser} ${P} 12.5 3.1 ${123456} ${7890} ? Ssl Nov03 12:34 ${exe}`, FA);
crow("A3 excl count + relative path", "12 plans/x.md changed", []);
crow("A3 excl NODE_OPTIONS flock", "NODE_OPTIONS=--max-old-space-size=400 flock /opt/a/b x", []);
crow("A3 home + argv", `${P} node ${synthHome}/x/y.js`, ["home-path", "foreign-argv"]);
// probes: what the wider class now also hits (recorded as-is, no expectation)
const probes = {
  "fp-http-log": `GET ${200} /api/games/42 12ms`,
  "fp-size-dev-eol": `size ${4096} /dev/sda1`,
  "fp-code-span-exe": `ran \`timeout ${600} /usr/bin/true\``,
  "fp-wc-l": `  ${120} /srv/x/a.md`,
  "fp-du": `${1234}\t/srv/x/y`,
  "fp-du-space-eol": `${1234}  /srv/x/y`,
  "fp-ls-l": `-rw-r--r-- 1 u u ${1234} Nov  3 15:00 /etc/hosts`,
  "fp-df": `/dev/sda1 935G 43G 845G 5% /`,
  "fp-md-table": `| ${12} | /srv/x/y |`,
  "fp-prose-n-flag": `use ${2} cores -j /srv/x`,
  "fp-list-numbered": `${10} /usr/local/bin`,
  "fp-grep-count": `${3} matches --in /srv/x/y`,
  "miss-node-p-n": `${P} node -p ${1} ${abs}`,
  "miss-sudo-u": `${P} sudo -u bob ${exe}`,
  "miss-relative-exe": `${P} ./bin/worker ${abs}`,
  "miss-ps-ef-flags": `${psUser}  ${P}  1  0 15:01 ?   00:00:02 node --x ${abs}`,
  "miss-ps-aux-flags": `${psUser} ${P} 0.0 0.1 ${123456} ${7890} pts/1 S+ 15:01 0:00 node --x ${abs}`,
  "miss-pid-1digit": `${7} ${exe}`,
  "miss-abs-exec-then-paren": `(${P} ${exe})`,
  "miss-abs-exec-then-comma": `${P} ${exe}, then`,
};
for (const [k, s] of Object.entries(probes)) rows.push({ id: `probe ${k}`, code: JSON.stringify(C(s)), expect: "*", ok: "-", hits: 0, leaked: 0, ms: 0, classes: "", errLines: 0, note: "" });

const HP = ["home-path"];
crow("A5 home. end", `cwd was ${synthHome}.`, HP);
crow("A5 home. space", `cwd was ${synthHome}. Then`, HP);
crow("A5 home-old", `${synthHome}-old/x`, HP);
crow("A5 home_bak", `${synthHome}_bak/x`, HP);
crow("A5 home2 (non-hit)", `${synthHome}2/x`, []);
crow("A5 homeX letter (non-hit)", `${synthHome}x/y`, []);
crow("A5 home~ ", `${synthHome}~/x`, HP);
crow("A5 home: ", `PATH=${synthHome}:/usr/bin`, HP);
crow("A5 home end of line", `${synthHome}`, HP);
crow("A5 slug-dot", `${synthHome.replace(/[^A-Za-z0-9]/g, "-")}.`, ["home-slug"]);

// ---------------- A6: quoted names
const tabName = `.grugops/q/a\tb ${slug}.md`;
const spName = `.grugops/q/sp ace ${slug}.md`;
const qName = `.grugops/q/q"uo\\te ${slug}.md`;
const uName = `.grugops/q/café ${slug}.md`;
branch("a6-names", () => { for (const n of [tabName, spName, qName, uName]) w(n, `${V.scratch}\n`); });
row("a6-names", ["--head", "a6-names"], 1, {}, (r) => {
  const bad = r.findings.filter((l) => /^"|"(?: \(decompressed\))?: |\t(?: \(decompressed\))?: /.test(l));
  const pathOf = (l) => l.replace(/: (?:line \d+|\(file path\)): .*$/, "");
  const groups = {};
  for (const l of r.findings) (groups[pathOf(l).replace(/ \(decompressed\)$/, "")] ??= new Set()).add(l.includes("(file path)") ? "fp" : "line");
  const paired = Object.values(groups).filter((s) => s.has("fp") && s.has("line")).length;
  const expect = [tabName, spName, qName, uName].map((n) => n.replaceAll(slug, "<home-slug>")).sort();
  const got = Object.keys(groups).sort();
  return { ok: bad.length === 0 && paired === 4 && same(got, expect), note: `4 names, each path printed identically on its (file path) and line hit: ${paired}/4; equals expected names: ${same(got, expect)}; stray quote/TAB lines: ${bad.length}` };
});
const uq = [
  ['"b/a\\tb"\t', "b/a\tb"],
  ['"b/\\303\\251.md"', "b/é.md"],
  ['"b/a\\"b"', 'b/a"b'],
  ['"b/a\\\\b"', "b/a\\b"],
  ["b/plain.md", "b/plain.md"],
  ["b/sp ace.md\t", "b/sp ace.md"],
  ['"', '"'],
  ['""', ""],
  ['"b/\\001x"', "b/\u0001x"],
];
const uqf = mod.unquote ?? (() => "<not exported>");
for (const [i, o] of uq) rows.push({ id: `A6 unquote ${JSON.stringify(i)}`, code: JSON.stringify(uqf(i)), expect: JSON.stringify(o), ok: uqf(i) === o ? "OK" : "MISMATCH", hits: 0, leaked: 0, ms: 0, classes: "", errLines: 0, note: "" });

// ---------------- A7: both homes
const aplant = `- ${account}/projects/qe-y/f.md\n- ${aslug}-projects-qe-y\n- ${V.users}\n- ${V.scratch}\n- ${V.argv}\n`;
branch("a7-account", () => {
  for (const p of [".grugops/qe/a.md", "plans/qe/a.md", "memory-bank/qe/a.md"]) w(p, aplant);
  w(".grugops/qe/raw/x.out.gz", gzipSync(`ok\n${account}/x\n`));
});
const realRun = run(["--head", "a7-account"]);
const emptyHome = join(work, "empty-home");
mkdirSync(emptyHome, { recursive: true });
for (const [id, env] of [["HOME=empty temp dir", { ...process.env, HOME: emptyHome }], ["HOME=/", { ...process.env, HOME: "/" }], ["HOME unset", Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== "HOME"))], ["HOME=<home>/ (trailing slash)", { ...process.env, HOME: `${home}/` }]]) {
  row(`a7 ${id}`, ["--head", "a7-account"], 1, { envExact: env }, (r) => ({ ok: same(r.findings, realRun.findings), note: `set equals real-HOME set (${realRun.findings.length} findings): ${same(r.findings, realRun.findings)}` }));
}
const boom = () => { throw new Error("no passwd entry"); };
let code;
let out = "";
const ow = process.stdout.write.bind(process.stdout);
const ew = process.stderr.write.bind(process.stderr);
process.stdout.write = (s) => { out += s; return true; };
process.stderr.write = (s) => { out += s; return true; };
try { code = mod.main(["--head", "a7-account"], { cwd: repo, userInfo: boom }); } finally { process.stdout.write = ow; process.stderr.write = ew; }
rows.push({ id: "a7 userInfo throws (seam)", code, expect: 1, ok: code === 1 ? "OK" : "MISMATCH", hits: (out.match(/: (?:line \d+|\(file path\)): /g) ?? []).length, leaked: ALL.filter((v) => out.includes(v)).length, ms: 0, classes: "", errLines: 0, note: "not 2" });

// ---------------- speed: 200 changed record files incl. 2 .xz
branch("speed200", () => {
  for (let i = 0; i < 198; i++) w(`.grugops/speed/f${i}.md`, Array.from({ length: 50 }, (_, k) => `line ${k} clean <home>/x 12 plans/y`).join("\n") + "\n");
  w(".grugops/speed/a.out.xz", xz(Array.from({ length: 20000 }, (_, k) => `row ${k} clean`).join("\n")));
  w(".grugops/speed/b.out.xz", xz("clean\n"));
});
row("speed200 (2 .xz)", ["--head", "speed200"], 0);

for (const r of rows) console.log(scrub(JSON.stringify(r)));
console.log("---- a2-add output ----");
console.log(scrub(run(["--head", "a2-add"]).out));
console.log("---- a6-names output (TAB shown as \\t) ----");
console.log(scrub(run(["--head", "a6-names"]).out).replaceAll("\t", "\\t"));
console.log("---- a1-diff own-checkout output ----");
git("checkout", "-q", "a1-diff");
console.log(scrub(run([]).out));
git("checkout", "-q", "main");
git("worktree", "remove", "--force", mainWt);
rmSync(work, { recursive: true, force: true });
