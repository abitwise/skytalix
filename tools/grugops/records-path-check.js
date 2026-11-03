// records-path-check.js — a branch cannot add a host path to the records unseen (ABC-277).
//
// WHAT IT CHECKS. The diff of a branch against its merge base with `main`, under the three record
// paths `.grugops/`, `plans/` and `memory-bank/` only:
//   - a text file: the ADDED lines only (`git diff -U0`), so a line already on `main` never fails;
//   - a `.gz` file the branch adds or changes: its whole decompressed content;
//   - renames are detected (`-M`), so a pure move (a queue brief going pending/ -> claimed/ ->
//     done/) adds no line and a pure `.gz` move (R100) is not opened.
// Five classes (ADR-0049 D4; sec-host-paths `…72b4070b`):
//   home-path     the literal home directory, read at run time from `os.homedir()`
//   home-slug     its slug form (`-home-<user>-`, the tool's session directory name)
//   users-path    a `/Users/<name>` path (`/Users/Shared` is not personal and is not a hit)
//   scratch-path  the session scratch path, `/tmp/claude-<uid>` (any digits)
//   foreign-argv  a `pgrep -a`-style process: a 2-7 digit PID (not preceded by a letter, digit,
//                 `.`, `_`, `:`, `/`, `-` or `=`), spaces, then EITHER an absolute executable path
//                 (2+ segments), spaces and any argument, OR a bare command name (`node`) and an
//                 absolute path argument (2+ segments). Anywhere in the line, so `[<pid> node
//                 /…` inside a summary line is caught. A HEURISTIC: it accepts the false positive
//                 `4096 /dev/sda1 mounted`, `120 in /usr/lib/x` and `timeout 600 node /…` (a
//                 number, a word or a path, a path); it excludes `--max-old-space-size=400 flock
//                 /…` (`=` before the number) and a count before a relative path (`12 plans/x.md`);
//                 it does not see a `ps aux` line (user first). Measured over the 16 173 text
//                 record files at `main` `b62e8049`: 77 lines in 7 files, 6 of them process
//                 listings or summaries, 1 a script whose 2 hits are `timeout <n> node /…`.
// The owner-ruled hostname label (SEC-HP-3) is exempt: it is not a class.
//
// IT NEVER PRINTS A MATCHED VALUE. A hit prints the file, the line number and the class name. A
// file path is printed with any class match inside it replaced by `<class>`.
//
// WHAT IT DOES NOT SEE. Uncommitted changes (it reads `<base>..HEAD`, committed objects only); a
// text file git calls binary (it shows no lines); any other path (`src/`, `tools/`, `tests/`);
// existing history (forward-only: the 816 tip files of SEC-HP-1 are an accepted risk).
//
// USAGE (run from inside the repository; node: builtins only; reads local git data, no network):
//   node tools/grugops/records-path-check.js [--base main] [--head HEAD]
//     exit 0 -> no finding           exit 1 -> at least one finding (each printed)
//     exit 2 -> could not run (bad arguments, not a git repository, no merge base, git failed)
// The Orchestrator runs it on the branch before each merge into `main`, beside the QE-hop check
// (`memory-bank/70-runbook.md`, `memory-bank/40-contributing.md` § Conventions).
import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const RECORD_PATHS = [".grugops/", "plans/", "memory-bank/"];
const GZ_LIMIT = 256 * 1024 * 1024; // bytes of decompressed output before a .gz is UNKNOWN
const USAGE = "Usage: node tools/grugops/records-path-check.js [--base <ref>] [--head <ref>]";

/** @param {string} s */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The five class matchers for one home directory. `home` defaults to `os.homedir()`; the test
 * seam passes a synthetic one. A home of `/` (or empty) has no home-path or home-slug class.
 * @param {{ home?: string }} [ctx]
 * @returns {{ name: string, re: RegExp }[]}
 */
export function classes(ctx = {}) {
  const home = (ctx.home ?? homedir()).replace(/\/+$/, "");
  /** @type {{ name: string, re: RegExp }[]} */
  const list = [];
  if (home.length > 1) {
    list.push({ name: "home-path", re: new RegExp(`${escapeRe(home)}(?![A-Za-z0-9._-])`, "g") });
    const slug = home.replace(/[^A-Za-z0-9]/g, "-");
    list.push({ name: "home-slug", re: new RegExp(`${escapeRe(slug)}(?![A-Za-z0-9])`, "g") });
  }
  list.push({ name: "users-path", re: /(?<![A-Za-z0-9._-])\/Users\/(?!Shared(?![A-Za-z0-9._-]))[A-Za-z0-9._-]+/g });
  list.push({ name: "scratch-path", re: /\/tmp\/claude-\d+(?![A-Za-z0-9])/g });
  list.push({
    name: "foreign-argv",
    re: /(?<![A-Za-z0-9._:/=-])\d{2,7} +(?:\/[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+ +\S|[a-z][a-z0-9._+-]* +\/[A-Za-z0-9._+-]+\/[A-Za-z0-9._+-])/g,
  });
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

/** Undo git's C-style path quoting (`"b/a\tb"`, octal bytes); an unquoted path is returned as is. */
function unquote(/** @type {string} */ s) {
  if (!s.startsWith('"')) return s;
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
 * The added lines of every text file in `<base>..<head>` under the record paths.
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
 * @param {{ cwd: string, base: string, head: string, home?: string }} o
 * @returns {{ hits: { path: string, line: number | null, cls: string, gz: boolean }[] }}
 */
export function check(o) {
  const top = git(o.cwd, ["rev-parse", "--show-toplevel"]).toString("utf8").trim();
  const r = spawnSync("git", ["merge-base", o.base, o.head], { cwd: top });
  if (r.error || r.status !== 0) {
    throw new Error(`no merge base between ${o.base} and ${o.head} (or a ref does not exist).`);
  }
  const mb = r.stdout.toString("utf8").trim();
  const list = classes(o.home === undefined ? {} : { home: o.home });
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
    if (p === undefined || !/\.gz$/i.test(p) || s.startsWith("D") || s === "R100" || s === "C100") {
      continue;
    }
    let text;
    try {
      text = gunzipSync(git(top, ["cat-file", "blob", `${o.head}:${p}`]), {
        maxOutputLength: GZ_LIMIT,
      }).toString("utf8");
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
    "--src-prefix=a/",
    "--dst-prefix=b/",
    ...range,
  ]).toString("utf8");
  for (const a of addedLines(diff)) {
    for (const cls of classify(a.text, list)) hits.push({ path: a.path, line: a.line, cls, gz: false });
  }
  return { hits: hits.map((h) => ({ ...h, path: redactPath(h.path, list) })) };
}

/**
 * @param {string[]} argv
 * @param {{ cwd?: string, home?: string }} [options]  test seam; the command line sets neither
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
