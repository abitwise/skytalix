// records-path-check.proof.js — the committed proof for `ABC-277` A1–A3 (`records-path-check.js`).
//
//   node --test tools/grugops/records-path-check.proof.js
//     exit 0 -> every row held      exit 1 -> a row failed
//
// OUTSIDE THE LANE (`NFR-008`): a `.proof.js` under `tools/` is not collected by vitest, so this adds
// 0 lane rows and 0 lane wall. It builds one scratch git repository in the OS temp directory per run
// and removes it after. Every planted value is SYNTHETIC and built here at run time (a made-up home,
// user, uid and process); no real path is written to any file (A3). The real `os.homedir()` is read
// in memory only, by the one row that proves the default comes from it.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
import { classes, classify, main } from "./records-path-check.js";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "records-path-check.js");

// Isolate every git call (the fixture's and the check's) from the host's git config.
process.env.GIT_CONFIG_NOSYSTEM = "1";
process.env.GIT_CONFIG_GLOBAL = "/dev/null";
process.env.GIT_AUTHOR_NAME = process.env.GIT_COMMITTER_NAME = "proof";
process.env.GIT_AUTHOR_EMAIL = process.env.GIT_COMMITTER_EMAIL = "proof@example.invalid";

// The synthetic host: none of these is a real path on any machine this runs on.
const HOME = ["", "home", "synthuser277"].join("/");
const SLUG = `${HOME.replace(/\//g, "-")}-projects-x`;
const PLANT = {
  "home-path": `see ${HOME}/projects/x for it`,
  "home-slug": `session dir ${SLUG}/abc.jsonl`,
  "users-path": `on a mac: ${["", "Users", "synthmac"].join("/")}/repo`,
  "scratch-path": `lock at ${["", "tmp", "claude-4242"].join("/")}/scratchpad/host-test.lock`,
  "foreign-argv": "31337 /opt/synthapp/bin/node /opt/synthapp/server.js --port 9",
};
const VALUES = [HOME, SLUG, "synthmac", "claude-4242", "31337", "/opt/synthapp"];

let root = "";
let repo = "";
const g = (/** @type {string[]} */ ...args) =>
  execFileSync("git", ["-c", "commit.gpgsign=false", ...args], { cwd: repo, encoding: "utf8" });
const put = (/** @type {string} */ p, /** @type {string | Buffer} */ body) => {
  mkdirSync(dirname(join(repo, p)), { recursive: true });
  writeFileSync(join(repo, p), body);
};
const commit = (/** @type {string} */ m) => {
  g("add", "-A");
  g("commit", "-q", "--allow-empty", "-m", m);
};

/** Run `main` in-process on branch `b`, stdout and stderr captured. */
function run(/** @type {string} */ b, /** @type {string[]} */ argv = []) {
  g("checkout", "-q", b);
  let stdout = "";
  let stderr = "";
  const ow = process.stdout.write.bind(process.stdout);
  const ew = process.stderr.write.bind(process.stderr);
  process.stdout.write = (/** @type {any} */ s) => {
    stdout += String(s);
    return true;
  };
  process.stderr.write = (/** @type {any} */ s) => {
    stderr += String(s);
    return true;
  };
  try {
    return { code: main(argv, { cwd: repo, home: HOME }), stdout, stderr };
  } finally {
    process.stdout.write = ow;
    process.stderr.write = ew;
  }
}

before(() => {
  root = mkdtempSync(join(tmpdir(), "rpc-proof-"));
  repo = join(root, "repo");
  mkdirSync(repo);
  g("init", "-q", "-b", "main");
  put("plans/legacy.md", `# legacy\n${PLANT["home-path"]}\n`);
  put("memory-bank/move-me.md", `${PLANT["scratch-path"]}\n`);
  put(".grugops/context/t/raw/old.txt.gz", gzipSync(`${PLANT["home-path"]}\n`));
  put("README.md", "clean\n");
  commit("base");

  g("checkout", "-q", "-b", "same");

  g("checkout", "-q", "-b", "hits", "main");
  const body = `${Object.values(PLANT).join("\n")}\n`;
  for (const d of [".grugops/q", "plans", "memory-bank"]) put(`${d}/new.md`, `clean first\n${body}`);
  put(".grugops/context/t/raw/new.txt.gz", gzipSync(`clean\n${PLANT["home-path"]}\n`));
  put(`.grugops/context/t${SLUG}/a.md`, "clean\n");
  commit("hits");

  g("checkout", "-q", "-b", "legacy-touch", "main");
  put("plans/legacy.md", `# legacy\n${PLANT["home-path"]}\na clean added line\n`);
  commit("touch");

  g("checkout", "-q", "-b", "rename", "main");
  mkdirSync(join(repo, "memory-bank/done"));
  g("mv", "memory-bank/move-me.md", "memory-bank/done/move-me.md");
  g("mv", ".grugops/context/t/raw/old.txt.gz", ".grugops/context/t/raw/moved.txt.gz");
  commit("move");

  g("checkout", "-q", "-b", "outside", "main");
  put("tools/x.js", `// ${PLANT["home-path"]}\n`);
  put("src/x.ts", `// ${PLANT["users-path"]}\n`);
  commit("outside");

  g("checkout", "-q", "-b", "placeholders", "main");
  put("plans/p.md", "<home>/x\n<scratch>/host-test.lock\n/Users/<name>\n<pid> <node> <args>\n");
  commit("placeholders");

  g("checkout", "-q", "--orphan", "orphan");
  commit("orphan");
});

after(() => rmSync(root, { recursive: true, force: true }));

describe("ABC-277 A1 — each class fails, by class only", () => {
  it("exits 1 with 5 of 5 classes in each of the three paths and the .gz, and prints no value", () => {
    const r = run("hits");
    assert.equal(r.code, 1);
    for (const f of [".grugops/q/new.md", "plans/new.md", "memory-bank/new.md"]) {
      for (const [k, cls] of Object.keys(PLANT).entries()) {
        assert.ok(r.stdout.includes(`${f}: line ${k + 2}: ${cls}\n`), `${f} ${cls}\n${r.stdout}`);
      }
    }
    assert.ok(r.stdout.includes(".grugops/context/t/raw/new.txt.gz (decompressed): line 2: home-path\n"));
    assert.equal(r.stdout.split("\n").filter((l) => / line \d+: /.test(l)).length, 16);
    assert.ok(r.stdout.includes(".grugops/context/t<home-slug>-projects-x/a.md: (file path): home-slug\n"));
    for (const v of VALUES) assert.ok(!(r.stdout + r.stderr).includes(v), `leaked a planted value`);
  });

  it("the command line gives the same exit 1 (no seam: the real home plants nothing; the three other classes still hit)", () => {
    g("checkout", "-q", "hits");
    const r = spawnSync(process.execPath, [SCRIPT], { cwd: repo, encoding: "utf8" });
    assert.equal(r.status, 1);
    for (const v of VALUES) assert.ok(!(r.stdout + r.stderr).includes(v));
  });
});

describe("ABC-277 A2 — only the diff counts", () => {
  for (const [b, why] of [
    ["same", "1. no change from main"],
    ["legacy-touch", "2. a clean line added to a file whose base holds a planted line"],
    ["rename", "3. a pure rename of a planted text file and of a planted .gz"],
    ["outside", "4. planted lines under tools/ and src/ only"],
    ["placeholders", "5. placeholders only"],
  ]) {
    it(`${why}: exit 0`, () => {
      const r = run(/** @type {string} */ (b));
      assert.equal(r.code, 0, r.stdout + r.stderr);
      assert.match(r.stdout, /^records-path-check: clean/);
    });
  }
});

describe("ABC-277 A3 — cannot run is exit 2 with a one-line reason", () => {
  it("no merge base: exit 2", () => {
    const r = run("orphan");
    assert.equal(r.code, 2);
    assert.equal(r.stderr.trim().split("\n").length, 1);
    assert.match(r.stderr, /no merge base/);
  });

  it("outside a git repository: exit 2 (the command line)", () => {
    const bare = join(root, "not-a-repo");
    mkdirSync(bare);
    const r = spawnSync(process.execPath, [SCRIPT], {
      cwd: bare,
      encoding: "utf8",
      env: { ...process.env, GIT_CEILING_DIRECTORIES: root },
    });
    assert.equal(r.status, 2);
    assert.equal(r.stderr.trim().split("\n").length, 1);
  });

  it("a bad argument: exit 2", () => {
    assert.equal(run("same", ["--nope"]).code, 2);
  });
});

describe("ABC-277 the classes, in memory", () => {
  const list = classes({ home: HOME });
  it("the default home is os.homedir() (read in memory, never written)", () => {
    const real = homedir();
    if (real.length > 1) assert.deepEqual(classify(`${real}/x`, classes()), ["home-path"]);
  });
  it("a home-path prefix of a longer name is not a hit", () => {
    assert.deepEqual(classify(`${HOME}2/x`, list), []);
  });
  it("a file path carrying a class is a hit", () => {
    assert.deepEqual(classify(`.grugops/context${SLUG}/a.md`, list), ["home-slug"]);
  });
  it("/Users/Shared is not personal", () => {
    assert.deepEqual(classify("/Users/Shared/x", list), []);
  });
  it("foreign-argv: excluded — a count then a relative path; a flag value then a command", () => {
    assert.deepEqual(classify("12 plans/x.md changed", list), []);
    assert.deepEqual(classify("NODE_OPTIONS=--max-old-space-size=400 flock /opt/a/b x", list), []);
  });
  it("foreign-argv: accepted false positives — a number, a word or a path, a path", () => {
    assert.deepEqual(classify("4096 /dev/sda1 mounted", list), ["foreign-argv"]);
    assert.deepEqual(classify("about 120 in /usr/lib/x", list), ["foreign-argv"]);
  });
  it("foreign-argv: the SEC-HP-2 shape — a bare command name, then an absolute path, mid-line", () => {
    assert.deepEqual(classify("gate ok=1 foreign=[4242424 node /opt/synth/a/b.js x]", list), ["foreign-argv"]);
    assert.deepEqual(classify("ran 4242 /usr/bin/node a.js", list), ["foreign-argv"]);
  });
  it("foreign-argv: caught in a Markdown list or code span", () => {
    assert.deepEqual(classify("- `31337 /opt/a/b c`", list), ["foreign-argv"]);
  });
});
