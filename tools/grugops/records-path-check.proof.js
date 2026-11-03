// records-path-check.proof.js — the committed proof for `ABC-277` A1–A3 and `ABC-278` A1–A3, A5–A7
// (`records-path-check.js`).
//
//   node --test tools/grugops/records-path-check.proof.js
//     exit 0 -> every row held      exit 1 -> a row failed
//
// OUTSIDE THE LANE (`NFR-008`): a `.proof.js` under `tools/` is not collected by vitest, so this adds
// 0 lane rows and 0 lane wall. It builds one scratch git repository in the OS temp directory per run
// and removes it after. Every planted value is SYNTHETIC and built here at run time (a made-up home,
// user, uid and process); no real path is written to any committed file (A3). The real
// `os.homedir()` is read in memory by the row that proves the default comes from it; `ABC-278` A7
// also plants the account home (`os.userInfo().homedir`, read at run time) into the scratch
// repository only, which is removed after the run. `ABC-278` A2 needs `xz` on `PATH` to build its
// fixture: without it that row fails red, it never skips.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { homedir, tmpdir, userInfo } from "node:os";
import { dirname, join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
import { classes, classify, homes, main, unquote } from "./records-path-check.js";

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

/** `xz -c` of a string (fixture only); throws when `xz` is missing, so the row fails red. */
const xz = (/** @type {string} */ text) => execFileSync("xz", ["-c"], { input: text });
/** The `file: where: class` lines of a run, sorted (a finding set). */
const findings = (/** @type {string} */ out) =>
  out
    .split("\n")
    .filter((l) => / (?:line \d+|\(file path\)): /.test(l))
    .sort();
const ACCOUNT = (() => {
  try {
    return userInfo().homedir.replace(/\/+$/, "");
  } catch {
    return "";
  }
})();
const NAME_TAB = ".grugops/q/tab\there.md";
const NAME_SPACE = ".grugops/q/space here.md";

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
  return runIn(repo, argv);
}

/** Run `main` in-process in checkout `cwd` (synthetic home), stdout and stderr captured. */
function runIn(/** @type {string} */ cwd, /** @type {string[]} */ argv) {
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
    return { code: main(argv, { cwd, home: HOME }), stdout, stderr };
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

  // ABC-278 A1: attributes and a NUL byte cannot hide an added line.
  for (const [b, attr] of [
    ["attr-nodiff", "*.md -diff\n"],
    ["attr-binary", "*.md binary\n"],
  ]) {
    g("checkout", "-q", "-b", b, "main");
    put(".gitattributes", attr);
    put(".grugops/q/hidden.md", `clean\n${PLANT["home-path"]}\n`);
    commit(b);
  }
  g("checkout", "-q", "-b", "nul-byte", "main");
  put(".grugops/q/nul.md", Buffer.from(`clean\0x\n${PLANT["home-path"]}\n`));
  commit("nul");
  g("checkout", "-q", "-b", "plain-md", "main");
  put(".grugops/q/plain.md", `clean\n${PLANT["home-path"]}\n`);
  commit("plain");

  // ABC-278 A2: .xz like .gz.
  g("checkout", "-q", "-b", "xz-add", "main");
  put(".grugops/context/t/raw/x.xz", xz(`clean\nclean\n${PLANT["home-path"]}\n`));
  commit("xz");
  g("checkout", "-q", "-b", "xz-base", "main");
  put(".grugops/context/t/raw/old.xz", xz(`${PLANT["home-path"]}\n`));
  commit("xz base");
  g("checkout", "-q", "-b", "xz-rename");
  g("mv", ".grugops/context/t/raw/old.xz", ".grugops/context/t/raw/moved.xz");
  commit("xz move");

  // ABC-278 A6: git-quoted names (a TAB) and names git ends with a TAB (a space).
  g("checkout", "-q", "-b", "quoted", "main");
  put(NAME_TAB, `${PLANT["home-path"]}\n`);
  put(NAME_SPACE, `${PLANT["home-path"]}\n`);
  commit("quoted");

  // ABC-278 A7: ABC-277 A1's plants, built for the account home (scratch repository only).
  g("checkout", "-q", "-b", "account", "main");
  const aSlug = `${ACCOUNT.replace(/[^A-Za-z0-9]/g, "-")}-projects-x`;
  const aPlant = [
    ...(ACCOUNT.length > 1 ? [`see ${ACCOUNT}/projects/x`, `session dir ${aSlug}/abc.jsonl`] : []),
    PLANT["users-path"],
    PLANT["scratch-path"],
    PLANT["foreign-argv"],
  ];
  for (const d of [".grugops/q", "plans", "memory-bank"]) put(`${d}/new.md`, `clean\n${aPlant.join("\n")}\n`);
  put(".grugops/context/t/raw/new.txt.gz", gzipSync(`clean\n${aPlant.join("\n")}\n`));
  commit("account");

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

describe("ABC-278 A1 — attributes and a NUL byte cannot blind it (QE-277-a)", () => {
  const want = [".grugops/q/hidden.md: line 2: home-path"];
  for (const b of ["attr-nodiff", "attr-binary"]) {
    it(`${b}: exit 1 from its own checkout and from main's (--head), the same finding set`, () => {
      const own = run(b);
      const own2 = run(b, ["--head", b]);
      const fromMain = run("main", ["--head", b]);
      // A second checkout of main (a git worktree, no .gitattributes in it), --head the branch.
      const wt = join(root, `wt-${b}`);
      g("worktree", "add", "-q", "--detach", wt, "main");
      let fromWt;
      try {
        fromWt = runIn(wt, ["--head", b]);
      } finally {
        g("worktree", "remove", "--force", wt);
      }
      for (const x of [own, own2, fromMain, fromWt]) {
        assert.equal(x.code, 1, x.stdout + x.stderr);
        assert.deepEqual(findings(x.stdout), want);
        for (const v of VALUES) assert.ok(!(x.stdout + x.stderr).includes(v), "leaked a planted value");
      }
    });
  }
  it("a record holding a NUL byte: exit 1 with that line's hit", () => {
    const r = run("nul-byte");
    assert.equal(r.code, 1, r.stdout);
    assert.deepEqual(findings(r.stdout), [".grugops/q/nul.md: line 2: home-path"]);
  });
  it("*.md -diff in $GIT_DIR/info/attributes: exit 1", () => {
    const info = join(repo, ".git", "info");
    mkdirSync(info, { recursive: true });
    writeFileSync(join(info, "attributes"), "*.md -diff\n");
    try {
      const r = run("plain-md");
      assert.equal(r.code, 1, r.stdout);
      assert.deepEqual(findings(r.stdout), [".grugops/q/plain.md: line 2: home-path"]);
    } finally {
      rmSync(join(info, "attributes"));
    }
  });
});

describe("ABC-278 A2 — .xz like .gz (QE-277-b)", () => {
  it("an added .xz with a home path on line 3: exit 1, `x.xz (decompressed): line 3: home-path`", () => {
    const r = run("xz-add");
    assert.equal(r.code, 1, r.stdout + r.stderr);
    assert.deepEqual(findings(r.stdout), [".grugops/context/t/raw/x.xz (decompressed): line 3: home-path"]);
  });
  it("a pure rename (R100) of a planted .xz: exit 0", () => {
    const r = run("xz-rename", ["--base", "xz-base"]);
    assert.equal(r.code, 0, r.stdout + r.stderr);
  });
  it("no xz on PATH: exit 1 with exactly one UNKNOWN - verify (cannot decompress) for the file", () => {
    g("checkout", "-q", "xz-add");
    const bin = join(root, "bin-no-xz");
    mkdirSync(bin, { recursive: true });
    const gitBin = (process.env.PATH ?? "")
      .split(":")
      .map((d) => join(d, "git"))
      .find((p) => existsSync(p));
    assert.ok(gitBin, "git on PATH");
    if (!existsSync(join(bin, "git"))) symlinkSync(/** @type {string} */ (gitBin), join(bin, "git"));
    const r = spawnSync(process.execPath, [SCRIPT], { cwd: repo, encoding: "utf8", env: { ...process.env, PATH: bin } });
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.deepEqual(findings(r.stdout), [
      ".grugops/context/t/raw/x.xz (decompressed): (file path): UNKNOWN - verify (cannot decompress)",
    ]);
  });
});

describe("ABC-278 A3 — foreign-argv, wider (QE-277-c)", () => {
  const list = classes({ home: HOME });
  const abs = "/opt/synthapp/lib/server.js";
  const exe = "/opt/synthapp/bin/worker";
  it("(1) <pid> node --max-old-space-size=<n> <abs>", () => {
    assert.deepEqual(classify(`31337 node --max-old-space-size=512 ${abs}`, list), ["foreign-argv"]);
  });
  it("(2) <pid> python3 -u <abs>", () => {
    assert.deepEqual(classify(`31337 python3 -u ${abs}`, list), ["foreign-argv"]);
  });
  it("(3) <pid> <abs-exec> at the end of a line and inside […]", () => {
    assert.deepEqual(classify(`31337 ${exe}`, list), ["foreign-argv"]);
    assert.deepEqual(classify(`live=[31337 ${exe}] ok`, list), ["foreign-argv"]);
    assert.deepEqual(classify(`- \`31337 ${exe}\``, list), ["foreign-argv"]);
  });
  it("(4) a ps -ef line", () => {
    assert.deepEqual(classify(`synthuser 31337 1 0 15:04 pts/1 00:00:02 ${exe} --serve`, list), ["foreign-argv"]);
  });
  it("(5) a ps aux line", () => {
    assert.deepEqual(classify(`synthuser 31337 0.0 0.1 123456 7890 pts/1 S+ 15:04 0:00 node ${abs}`, list), [
      "foreign-argv",
    ]);
  });
  it("under the home, another class beside it", () => {
    assert.deepEqual(classify(`31337 node -u ${HOME}/x/y.js`, list), ["home-path", "foreign-argv"]);
  });
  it("the existing exclusions still classify as []", () => {
    assert.deepEqual(classify("12 plans/x.md changed", list), []);
    assert.deepEqual(classify("NODE_OPTIONS=--max-old-space-size=400 flock /opt/a/b x", list), []);
    assert.deepEqual(classify("took 1200 ms over 42 files", list), []);
  });
});

describe("ABC-278 A5 — home-path before punctuation (QE-277-d)", () => {
  const list = classes({ home: HOME });
  for (const [why, line] of [
    ["`.` at the end of a line", `it lives in ${HOME}.`],
    ["`.` before a space", `it lives in ${HOME}. Then more`],
    ["`-old`", `${HOME}-old/x`],
    ["`_bak`", `${HOME}_bak/x`],
  ]) {
    it(`${why}: ["home-path"]`, () => assert.deepEqual(classify(/** @type {string} */ (line), list), ["home-path"]));
  }
});

describe("ABC-278 A6 — quoted names printed clean (QE-277-e)", () => {
  it("a TAB name and a space name: each line hit prints the real name, no quote, no trailing TAB", () => {
    const r = run("quoted");
    assert.equal(r.code, 1, r.stdout);
    assert.deepEqual(findings(r.stdout), [`${NAME_SPACE}: line 1: home-path`, `${NAME_TAB}: line 1: home-path`].sort());
    assert.ok(!r.stdout.includes('"'), r.stdout);
    assert.ok(!r.stdout.includes("\t:"), r.stdout);
  });
  it("unquote: a quoted name ending in a TAB, an octal UTF-8 escape, \\\", \\\\, an unquoted name", () => {
    assert.equal(unquote('"b/a\\tb.md"\t'), "b/a\tb.md");
    assert.equal(unquote('"b/caf\\303\\251.md"'), "b/café.md");
    assert.equal(unquote('"b/say \\"hi\\".md"'), 'b/say "hi".md');
    assert.equal(unquote('"b/back\\\\slash.md"'), "b/back\\slash.md");
    assert.equal(unquote("b/space here.md\t"), "b/space here.md");
    assert.equal(unquote("b/plain.md"), "b/plain.md");
  });
});

describe("ABC-278 A7 — both homes (QE-277-f)", () => {
  it("the command line with HOME set to an empty temp dir gives the same finding set as the real HOME", () => {
    g("checkout", "-q", "account");
    const empty = mkdtempSync(join(root, "empty-home-"));
    const cli = (/** @type {string} */ h) =>
      spawnSync(process.execPath, [SCRIPT], { cwd: repo, encoding: "utf8", env: { ...process.env, HOME: h } });
    const real = cli(homedir());
    const over = cli(empty);
    assert.equal(real.status, 1, real.stderr);
    assert.equal(over.status, 1, over.stderr);
    assert.deepEqual(findings(over.stdout), findings(real.stdout));
    const homeHits = findings(real.stdout).filter((l) => / home-(?:path|slug)$/.test(l)).length;
    assert.equal(homeHits, ACCOUNT.length > 1 ? 8 : 0);
    if (ACCOUNT.length > 1) assert.ok(!(real.stdout + over.stdout).includes(ACCOUNT), "leaked the account home");
  });
  it("homes(): os.homedir() and the account home, deduplicated; the account home alone covers a HOME override", () => {
    assert.deepEqual(homes({ userInfo: () => ({ homedir: homedir() }) }), [homedir().replace(/\/+$/, "")].filter((h) => h.length > 1));
  });
  it("os.userInfo() throws (seam): os.homedir() alone, and the check runs (no exit 2)", () => {
    const boom = () => {
      throw new Error("no passwd entry");
    };
    assert.deepEqual(homes({ userInfo: boom }), [homedir().replace(/\/+$/, "")].filter((h) => h.length > 1));
    g("checkout", "-q", "hits");
    let out = "";
    const ow = process.stdout.write.bind(process.stdout);
    process.stdout.write = (/** @type {any} */ s) => {
      out += String(s);
      return true;
    };
    let code;
    try {
      code = main([], { cwd: repo, userInfo: boom });
    } finally {
      process.stdout.write = ow;
    }
    assert.equal(code, 1, out);
    for (const v of VALUES.slice(2)) assert.ok(!out.includes(v));
  });
});
