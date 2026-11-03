// records-path-check.js — a branch cannot add a host path to the records unseen (ABC-277, ABC-278).
//
// WHAT IT CHECKS. The diff of a branch against its merge base with `main`, under the three record
// paths `.grugops/`, `plans/` and `memory-bank/` only:
//   - every other file: the ADDED lines only (`git diff -U0 --text`), so a line already on `main`
//     never fails. `--text` reads every file as text whatever `.gitattributes`,
//     `$GIT_DIR/info/attributes` or `core.attributesFile` say (`-diff`, `binary`) and whatever
//     bytes it holds (a NUL), so the verdict is the same from any checkout (ABC-278, QE-277-a);
//   - a `.gz` or `.xz` file the branch adds or changes: its whole decompressed content (`.gz` by
//     zlib, `.xz` by spawning `xz -dc` with no shell; 256 MiB cap each). A file that does not
//     decompress (corrupt, too big, `xz` missing) is one `UNKNOWN - verify` finding;
//   - renames are detected (`-M`), so a pure move (a queue brief going pending/ -> claimed/ ->
//     done/) adds no line and a pure `.gz` / `.xz` move (R100) is not opened.
// Five classes (ADR-0049 D4; sec-host-paths `…72b4070b`):
//   home-path     the literal home directory, not followed by a letter or digit (so `<home>.`,
//                 `<home>-old`, `<home>_bak` hit; `<home>2` does not). Read at run time from
//                 `os.homedir()` AND, when it differs and can be read, `os.userInfo().homedir`
//                 (the account home), so a `HOME` override does not narrow the check (QE-277-f)
//   home-slug     its slug form (`-home-<user>-`, the tool's session directory name), both homes
//   users-path    a `/Users/<name>` path (`/Users/Shared` is not personal and is not a hit)
//   scratch-path  the session scratch path, `/tmp/claude-<uid>` (any digits)
//   foreign-argv  a process line. A PID is 2-7 digits (1-7 in a `ps` table) not preceded by a
//                 letter, digit, `.`, `_`, `:`, `/`, `-` or `=`; ABS is an absolute path of 2+
//                 segments; CMD is a bare lower-case command name (`node`). Anywhere in the line,
//                 so `[<pid> node /…` inside a summary line is caught. Shapes:
//                   a. PID ABS <arg>            (`pgrep -a`)
//                   b. PID CMD ABS
//                   c. PID CMD <flags> ABS      flags `-x`, `--x`, `--x=<v>` (ABC-278)
//                   d. PID ABS                  at the end of the line or before `]` / a backtick
//                   e. `ps -ef`: PID PPID C STIME TTY [D-]HH:MM:SS then ABS or CMD ABS
//                   f. `ps aux`: PID %CPU %MEM VSZ RSS TTY STAT START M:SS then ABS or CMD ABS
//                 A HEURISTIC. Accepted false positives: `<n> /dev/<disk> mounted`, `<n> in
//                 /usr/<dir>/<x>`, `timeout <n> node /…` (a, b); `timeout <n> node --<flag> /…`
//                 (c); `size <n> /dev/<disk>` at a line end and `<cmd> <n> /usr/bin/<x>` closing a
//                 code span (d); a numeric table row shaped like a `ps` row (e, f). Excluded:
//                 `--max-old-space-size=<n> flock /…` (`=` before the number) and a count before a
//                 relative path (`<n> plans/x.md`). Not seen: a PID then a flag with a separate
//                 value before the path (`<pid> node -p <n> /…`), a relative executable. Measured
//                 over the 16 422 record files at `361a5af3` (ABC-278's base) by
//                 `.grugops/context/se-ABC-278/raw/fa-measure.mjs`: 77 lines before, 80 after; the
//                 3 new are 2 process lines (c) and 1 that is not (d, a code span); 0 lost.
// The owner-ruled hostname label (SEC-HP-3) is exempt: it is not a class.
//
// IT NEVER PRINTS A MATCHED VALUE. A hit prints the file, the line number and the class name. A
// file path is printed with any class match inside it replaced by `<class>`.
//
// WHAT IT DOES NOT SEE. Uncommitted changes (it reads `<base>..HEAD`, committed objects only);
// any other path (`src/`, `tools/`, `tests/`); other archive forms (`.bz2`, `.zst`, `.zip`,
// `.tar`); existing history (forward-only: the 816 tip files of SEC-HP-1 are an accepted risk).
//
// USAGE (run from inside the repository with the real `HOME`; node builtins only; spawns `git` and
// `xz`, never a shell; reads local git data, no network):
//   node tools/grugops/records-path-check.js [--base main] [--head HEAD]
//     exit 0 -> no finding           exit 1 -> at least one finding (each printed)
//     exit 2 -> could not run (bad arguments, not a git repository, no merge base, git failed)
// The Orchestrator runs it on the branch before each merge into `main`, beside the QE-hop check
// (`memory-bank/70-runbook.md`, `memory-bank/40-contributing.md` § Conventions).
import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { homedir, userInfo } from "node:os";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const RECORD_PATHS = [".grugops/", "plans/", "memory-bank/"];
const GZ_LIMIT = 256 * 1024 * 1024; // bytes of decompressed output before a .gz / .xz is UNKNOWN
const COMPRESSED = /\.(?:gz|xz)$/i;
const USAGE = "Usage: node tools/grugops/records-path-check.js [--base <ref>] [--head <ref>]";

/** @param {string} s */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The home directories the home classes test: `os.homedir()` and, when it differs and can be read,
 * the account home `os.userInfo().homedir` (QE-277-f). If `userInfo` throws, `os.homedir()` alone.
 * @param {{ home?: string, userInfo?: () => { homedir: string } }} [ctx]  test seams: `home` is
 *   the only home; `userInfo` replaces `os.userInfo`
 * @returns {string[]}  each without a trailing `/`, longest first; a home of `/` or empty dropped
 */
export function homes(ctx = {}) {
  const raw = [];
  if (ctx.home !== undefined) raw.push(ctx.home);
  else {
    raw.push(homedir());
    try {
      const account = (ctx.userInfo ?? userInfo)().homedir;
      if (typeof account === "string") raw.push(account);
    } catch {
      // os.userInfo() can throw (no passwd entry): os.homedir() alone, as before ABC-278.
    }
  }
  const out = [...new Set(raw.map((h) => h.replace(/\/+$/, "")))].filter((h) => h.length > 1);
  return out.sort((a, b) => b.length - a.length);
}

// foreign-argv building blocks (see the header for the shapes a-f).
const PID = "(?<![A-Za-z0-9._:/=-])";
const ABS = String.raw`\/[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+`;
const ABS_ARG = String.raw`\/[A-Za-z0-9._+-]+\/[A-Za-z0-9._+-]`;
const CMD = "[a-z][a-z0-9._+-]*";
const FLAG = String.raw`--?[A-Za-z0-9][^\s]*`;
const PS_CMD = `(?:${ABS}(?![A-Za-z0-9._+/-])|${CMD} +${ABS_ARG})`;
const FOREIGN_ARGV = new RegExp(
  [
    `${PID}\\d{2,7} +(?:${ABS} +\\S|${CMD} +(?:${FLAG} +)*${ABS_ARG}|${ABS}(?= *$|[\\]\`]))`,
    `${PID}\\d{1,7} +\\d{1,7} +\\d{1,3} +\\S+ +\\S+ +(?:\\d+-)?\\d+:\\d\\d:\\d\\d +${PS_CMD}`,
    `${PID}\\d{1,7} +\\d+\\.\\d +\\d+\\.\\d +\\d+ +\\d+ +\\S+ +\\S+ +\\S+ +\\d+:\\d\\d +${PS_CMD}`,
  ].join("|"),
  "g",
);

/**
 * The five class matchers. The home classes cover every home of `homes(ctx)`; with none (a home
 * of `/` or empty) there is no home-path or home-slug class.
 * @param {{ home?: string, userInfo?: () => { homedir: string } }} [ctx]
 * @returns {{ name: string, re: RegExp }[]}
 */
export function classes(ctx = {}) {
  const hs = homes(ctx);
  /** @type {{ name: string, re: RegExp }[]} */
  const list = [];
  if (hs.length > 0) {
    const alt = (/** @type {string[]} */ xs) => xs.map(escapeRe).join("|");
    list.push({ name: "home-path", re: new RegExp(`(?:${alt(hs)})(?![A-Za-z0-9])`, "g") });
    const slugs = [...new Set(hs.map((h) => h.replace(/[^A-Za-z0-9]/g, "-")))];
    list.push({ name: "home-slug", re: new RegExp(`(?:${alt(slugs)})(?![A-Za-z0-9])`, "g") });
  }
  list.push({ name: "users-path", re: /(?<![A-Za-z0-9._-])\/Users\/(?!Shared(?![A-Za-z0-9._-]))[A-Za-z0-9._-]+/g });
  list.push({ name: "scratch-path", re: /\/tmp\/claude-\d+(?![A-Za-z0-9])/g });
  list.push({ name: "foreign-argv", re: new RegExp(FOREIGN_ARGV.source, "g") });
  return list;
}

/**
 * The class names one line hits, each at most once, in class order.
 * @param {string} line
 * @param {{ name: string, re: RegExp }[]} list
 */
export function classify(line, list) {
  return list.filter((c) => {
    c.re.lastIndex = 0;
    return c.re.test(line);
  }).map((c) => c.name);
}

/** A path with every class match replaced by `<class>`, so printing it leaks nothing. */
function redactPath(/** @type {string} */ p, /** @type {{ name: string, re: RegExp }[]} */ list) {
  let out = p;
  for (const c of list) out = out.replace(new RegExp(c.re.source, "g"), `<${c.name}>`);
  return out;
}

/**
 * A `+++` header's name, unquoted: git ends the header with a TAB when the name holds a space or is
 * quoted (QE-277-e), so one trailing TAB is dropped first (a name ending in a TAB is always quoted,
 * so its own TAB is inside the quotes). Then git's C-style quoting (`"b/a\tb"`, `\"`, `\\`, octal
 * bytes) is undone; an unquoted name is returned as is.
 * @param {string} header
 */
export function unquote(header) {
  const s = header.endsWith("\t") ? header.slice(0, -1) : header;
  if (!s.startsWith('"') || !s.endsWith('"') || s.length < 2) return s;
  const bytes = [];
  const map = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34, "\\": 92 };
  const raw = Buffer.from(s.slice(1, -1), "utf8");
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] !== 92) {
      bytes.push(raw[i] ?? 0);
      continue;
    }
    const next = String.fromCharCode(raw[i + 1] ?? 0);
    if (/[0-7]/.test(next)) {
      bytes.push(Number.parseInt(raw.subarray(i + 1, i + 4).toString("latin1"), 8));
      i += 3;
    } else {
      bytes.push(/** @type {Record<string, number>} */ (map)[next] ?? raw[i + 1] ?? 0);
      i += 1;
    }
  }
  return Buffer.from(bytes).toString("utf8");
}

/**
 * Run git in `cwd`; returns stdout as a Buffer, or throws with a one-line reason.
 * @param {string} cwd
 * @param {string[]} args
 */
function git(cwd, args) {
  const r = spawnSync(
    "git",
    ["-c", "core.quotePath=false", "-c", "diff.renameLimit=32767", ...args],
    { cwd, maxBuffer: 1024 * 1024 * 1024 },
  );
  if (r.error) throw new Error(`cannot run git (${r.error.message}).`);
  if (r.status !== 0) {
    const why = r.stderr.toString("utf8").trim().split("\n")[0] ?? "";
    throw new Error(`git ${args[0]} failed${why ? `: ${why}` : ""}.`);
  }
  return r.stdout;
}

/**
 * Decompress one `.gz` / `.xz` blob, capped at `GZ_LIMIT` bytes of output; throws when it cannot.
 * `.xz` spawns `xz -dc` (no shell; `PATH` lookup, so a missing `xz` throws).
 * @param {string} p
 * @param {Buffer} blob
 */
function decompress(p, blob) {
  if (/\.gz$/i.test(p)) return gunzipSync(blob, { maxOutputLength: GZ_LIMIT });
  const r = spawnSync("xz", ["-dc"], { input: blob, maxBuffer: GZ_LIMIT, stdio: ["pipe", "pipe", "ignore"] });
  if (r.error || r.status !== 0) throw new Error("xz -dc failed");
  return r.stdout;
}

/**
 * The added lines of every file in `<base>..<head>` under the record paths.
 * @param {string} diffText  `git diff -U0` output with a/ and b/ prefixes
 * @returns {{ path: string, line: number, text: string }[]}
 */
export function addedLines(diffText) {
  const out = [];
  const lines = diffText.split("\n");
  let path = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i] ?? "";
    if (l.startsWith("diff --git ")) {
      path = null;
      continue;
    }
    if (l.startsWith("+++ ")) {
      const p = unquote(l.slice(4));
      path = p === "/dev/null" ? null : p.replace(/^b\//, "");
      continue;
    }
    const h = /^@@ -\d+(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(l);
    if (!h) continue;
    let oldLeft = h[1] === undefined ? 1 : Number(h[1]);
    let newLeft = h[3] === undefined ? 1 : Number(h[3]);
    let n = Number(h[2]);
    // Consume exactly the hunk's lines, so an added line reading `++ x` is never a header.
    while ((oldLeft > 0 || newLeft > 0) && i + 1 < lines.length) {
      const body = lines[++i] ?? "";
      if (body.startsWith("\\")) continue; // "\ No newline at end of file"
      if (body.startsWith("-")) oldLeft--;
      else if (body.startsWith("+")) {
        newLeft--;
        if (path !== null) out.push({ path, line: n, text: body.slice(1) });
        n++;
      } else {
        oldLeft--;
        newLeft--;
        n++;
      }
    }
  }
  return out;
}

/**
 * Check `<merge-base(base, head)>..<head>` in the repository holding `cwd`.
 * @param {{ cwd: string, base: string, head: string, home?: string, userInfo?: () => { homedir: string } }} o
 * @returns {{ hits: { path: string, line: number | null, cls: string, gz: boolean }[] }}
 */
export function check(o) {
  const top = git(o.cwd, ["rev-parse", "--show-toplevel"]).toString("utf8").trim();
  const r = spawnSync("git", ["merge-base", o.base, o.head], { cwd: top });
  if (r.error || r.status !== 0) {
    throw new Error(`no merge base between ${o.base} and ${o.head} (or a ref does not exist).`);
  }
  const mb = r.stdout.toString("utf8").trim();
  const list = classes({
    ...(o.home === undefined ? {} : { home: o.home }),
    ...(o.userInfo === undefined ? {} : { userInfo: o.userInfo }),
  });
  /** @type {{ path: string, line: number | null, cls: string, gz: boolean }[]} */
  const hits = [];
  const range = [mb, o.head, "--", ...RECORD_PATHS];
  const common = ["--no-color", "--no-ext-diff", "--no-textconv", "-M"];

  const status = git(top, ["diff", ...common, "--name-status", "-z", ...range]).toString("utf8");
  const f = status.split("\0");
  for (let i = 0; i < f.length - 1; ) {
    const s = f[i] ?? "";
    const p = s.startsWith("R") || s.startsWith("C") ? f[i + 2] : f[i + 1];
    i += s.startsWith("R") || s.startsWith("C") ? 3 : 2;
    // A file path itself can carry a class (a session slug as a folder name).
    if (p !== undefined && !s.startsWith("D")) {
      for (const cls of classify(p, list)) hits.push({ path: p, line: null, cls, gz: false });
    }
    if (p === undefined || !COMPRESSED.test(p) || s.startsWith("D") || s === "R100" || s === "C100") {
      continue;
    }
    let text;
    try {
      text = decompress(p, git(top, ["cat-file", "blob", `${o.head}:${p}`])).toString("utf8");
    } catch {
      hits.push({ path: p, line: null, cls: "UNKNOWN - verify (cannot decompress)", gz: true });
      continue;
    }
    for (const [k, line] of text.split("\n").entries()) {
      for (const cls of classify(line, list)) hits.push({ path: p, line: k + 1, cls, gz: true });
    }
  }

  const diff = git(top, [
    "diff",
    ...common,
    "-U0",
    "--text", // every file as text: no attribute, no NUL byte hides an added line (QE-277-a)
    "--src-prefix=a/",
    "--dst-prefix=b/",
    ...range,
  ]).toString("utf8");
  for (const a of addedLines(diff)) {
    if (COMPRESSED.test(a.path)) continue; // read whole, decompressed, above
    for (const cls of classify(a.text, list)) hits.push({ path: a.path, line: a.line, cls, gz: false });
  }
  return { hits: hits.map((h) => ({ ...h, path: redactPath(h.path, list) })) };
}

/**
 * @param {string[]} argv
 * @param {{ cwd?: string, home?: string, userInfo?: () => { homedir: string } }} [options]  test
 *   seams; the command line sets none
 * @returns {0 | 1 | 2}
 */
export function main(argv, options = {}) {
  let base = "main";
  let head = "HEAD";
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--base" || a === "--head") {
      const v = argv[++i];
      if (!v || v.startsWith("-")) {
        process.stderr.write(`Error: ${a} needs a ref.\n${USAGE}\n`);
        return 2;
      }
      if (a === "--base") base = v;
      else head = v;
    } else {
      process.stderr.write(`Error: unrecognised argument "${a}".\n${USAGE}\n`);
      return 2;
    }
  }
  let result;
  try {
    result = check({
      cwd: options.cwd ?? process.cwd(),
      base,
      head,
      ...(options.home === undefined ? {} : { home: options.home }),
      ...(options.userInfo === undefined ? {} : { userInfo: options.userInfo }),
    });
  } catch (e) {
    process.stderr.write(`Error: ${e instanceof Error ? e.message : String(e)}\n`);
    return 2;
  }
  const out = (/** @type {string} */ s) => process.stdout.write(`${s}\n`);
  for (const h of result.hits) {
    const where = h.line === null ? "(file path)" : `line ${h.line}`;
    out(`${h.path}${h.gz ? " (decompressed)" : ""}: ${where}: ${h.cls}`);
  }
  if (result.hits.length === 0) {
    out(`records-path-check: clean (${RECORD_PATHS.join(" ")} added lines, merge base of ${base}..${head}).`);
    return 0;
  }
  out(
    `records-path-check: ${result.hits.length} finding(s). Replace each value with a placeholder ` +
      "(<home> <repo> <scratch> <out> <node> <cutechess-cli> <stockfish> <user>).",
  );
  return 1;
}

const argv1 = process.argv[1];
if (argv1 && realpathSync(argv1) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
