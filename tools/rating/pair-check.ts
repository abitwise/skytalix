/**
 * `ABC-225` — the offline checks of `rating.ts rpair` (A1–A4); `ABC-247` adds its A1 (the
 * `Skill Level` 6 token on both builds, none on `r` or `d`); `ABC-255` adds `d` at 100 ms and `r` at
 * 500 ms, with today's prints unchanged; `ABC-275` adds `r` at 100 ms (R1), Stockfish at st=0.1, and
 * `--elo` above 2 600 refused there. Not a lane file (`NFR-008`): its
 * name is not `*.test.*`, so `npm test` never collects it, and nothing in the lane imports it.
 *
 *   node --test tools/rating/pair-check.ts
 *
 * No engine and no `cutechess-cli` is started: A1 and A2 read `--dry-run` prints, A3 reads the
 * committed `qe-epic008-close` r1/r2 records, and A4 writes fixture blocks to a temp directory.
 */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import {
  type Block,
  coverageCauses,
  cutechessElo,
  eloText,
  openingScores,
  pairDifference,
  pairSchedule,
  pentanomialPair,
  pgnGames,
  redact,
  stockfishNps,
} from "./pair.ts";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const REPO = fileURLToPath(new URL("../..", import.meta.url));
const RATING = join(HERE, "rating.ts");
const RECORDS = join(REPO, ".grugops/context/qe-epic008-close/raw");
const EPD = readFileSync(join(HERE, "openings.epd"), "utf8").split("\n");
const SCRATCH = mkdtempSync(join(tmpdir(), "abc225-check-"));
after(() => rmSync(SCRATCH, { recursive: true, force: true }));

// The harness reads both tool paths at load; any readable file will do when nothing is started.
process.env.CUTECHESS_CLI = RATING;
process.env.STOCKFISH = RATING;
const rating = await import("./rating.ts");

const git = (...args: string[]): string =>
  execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trim();
const harness = (...args: string[]) =>
  spawnSync(process.execPath, [RATING, ...args], { cwd: REPO, encoding: "utf8", env: process.env });

/** The argv lines of a dry-run print, one list per `cutechess-cli argv:` header. */
function argvBlocks(text: string): { header: string; argv: string[] }[] {
  const found: { header: string; argv: string[] }[] = [];
  for (const line of text.split("\n")) {
    if (line.endsWith("cutechess-cli argv:")) found.push({ header: line, argv: [] });
    else if (line.startsWith("  ") && found.length > 0) found.at(-1)?.argv.push(line.slice(2));
  }
  return found;
}

/** `ABC-247` A1: the one `Skill Level` token, and where it sits in r's skytalix group. */
const SKILL = "option.Skill Level=6";

/** An argv split at each `-engine`, so each engine's options can be read on their own. */
function engineGroups(argv: readonly string[]): string[][] {
  const groups: string[][] = [];
  for (const arg of argv) {
    if (arg === "-engine") groups.push([]);
    else if (arg.startsWith("-")) groups.push([arg]);
    else groups.at(-1)?.push(arg);
  }
  return groups.filter((g) => g[0]?.startsWith("name="));
}

describe("A1: rpair reads each build with r's argv, but for openings start/count, output paths and Skill Level 6", () => {
  const base = git("rev-parse", "--short=12", "HEAD~1");
  const candidate = git("rev-parse", "--short=12", "HEAD");
  const out = join(SCRATCH, "a1");
  const pair = harness("rpair", base, candidate, out, "--dry-run");

  test("the dry run exits 0 and writes nothing", () => {
    assert.equal(pair.status, 0, pair.stderr);
    assert.equal(existsSync(out), false);
  });

  test("every block of both builds differs from r's argv only where A1 allows", () => {
    const blocks = argvBlocks(pair.stdout);
    assert.equal(blocks.length, 20);
    for (const { header, argv } of blocks) {
      const [, index, build] = /^block (\d\d) (base|candidate) /.exec(header) ?? [];
      const sha = build === "base" ? base : candidate;
      const r = harness("r", sha, join(out, build as string), "--elo", "1910", "--dry-run");
      assert.equal(r.status, 0, r.stderr);
      const rArgv = argvBlocks(r.stdout)[0]?.argv ?? [];
      const start = (Number(index) - 1) * 10 + 1;
      // The two added tokens. `start=S` inside `-openings`, right after `order=sequential`, and
      // (ABC-247) `option.Skill Level=6` in the skytalix group, right after `restart=on`.
      const at = argv.indexOf(`start=${start}`);
      assert.equal(argv[at - 1], "order=sequential");
      const skill = argv.indexOf(SKILL);
      assert.equal(argv[skill - 1], "restart=on", header);
      const same = argv.filter((_, i) => i !== at && i !== skill);
      assert.equal(same.length, rArgv.length);
      const differ = same.flatMap((a, i) => (a === rArgv[i] ? [] : [[rArgv[i], a]]));
      // The print shows a path under the home directory as `<home>/…`.
      const shown = (p: string): string =>
        p.startsWith(homedir()) ? `<home>${p.slice(homedir().length)}` : p;
      const files = shown(join(out, build as string));
      const block = `${files}/b${index}`;
      assert.deepEqual(differ, [
        [`stderr=${files}/skytalix.stderr`, `stderr=${block}/skytalix.stderr`],
        [`stderr=${files}/stockfish.stderr`, `stderr=${block}/stockfish.stderr`],
        ["100", "10"],
        [`${files}/r.pgn`, `${block}/r.pgn`],
      ]);
    }
  });

  test("the pins are r's: Stockfish at E 1910, skytalix at 4 s, width 2, both colours", () => {
    const argv = argvBlocks(pair.stdout)[0]?.argv.join(" ") ?? "";
    for (const pin of [
      "option.UCI_Elo=1910",
      "option.UCI_LimitStrength=true",
      "st=4 timemargin=1000",
      "st=0.5 timemargin=2000",
      "-repeat -games 2",
      "-concurrency 2",
      "format=epd order=sequential start=1 -repeat",
    ])
      assert.ok(argv.includes(pin), pin);
  });

  test("ABC-247 (a): every block of both builds gives skytalix Skill Level 6 once, Stockfish none", () => {
    const blocks = argvBlocks(pair.stdout);
    assert.equal(blocks.length, 20);
    for (const { header, argv } of blocks) {
      assert.equal(argv.filter((a) => a === SKILL).length, 1, header);
      assert.equal(argv.filter((a) => /Skill Level/i.test(a)).length, 1, header);
      const groups = engineGroups(argv);
      assert.deepEqual(
        groups.map((g) => g[0]),
        ["name=skytalix", "name=stockfish"],
        header,
      );
      assert.ok(groups[0]?.includes(SKILL), header);
      assert.equal(
        groups[1]?.some((a) => /Skill Level/i.test(a)),
        false,
        header,
      );
    }
  });

  test("ABC-247 (a): the A5 shape (--rounds 10 --concurrency 1) carries it on both builds too", () => {
    const run = harness(
      "rpair",
      base,
      candidate,
      join(SCRATCH, "a1-a5"),
      "--rounds",
      "10",
      "--concurrency",
      "1",
      "--dry-run",
    );
    assert.equal(run.status, 0, run.stderr);
    const blocks = argvBlocks(run.stdout);
    assert.deepEqual(
      blocks.map((b) => b.header),
      ["block 01 base cutechess-cli argv:", "block 01 candidate cutechess-cli argv:"],
    );
    for (const { argv } of blocks) assert.equal(argv.filter((a) => a === SKILL).length, 1);
  });

  test("ABC-247 (c): the r and d argvs send no Skill Level and are main's, token for token", () => {
    const sha = git("rev-parse", "--short=12", "HEAD");
    const files = join(SCRATCH, "a1-c");
    const shown = (p: string): string =>
      p.startsWith(homedir()) ? `<home>${p.slice(homedir().length)}` : p;
    const f = shown(files);
    const sky = (name: string, st: string, margin: string): string[] => [
      "-engine",
      `name=${name}`,
      "cmd=<node>",
      `arg=${f}/clone-${name}/dist/uci.js`,
      `dir=${f}/clone-${name}`,
      `st=${st}`,
      `timemargin=${margin}`,
      "restart=on",
      `stderr=${f}/${name}.stderr`,
    ];
    const tail = (mode: string, rounds: string, width: string): string[] => [
      "-each",
      "proto=uci",
      "-openings",
      "file=<repo>/tools/rating/openings.epd",
      "format=epd",
      "order=sequential",
      "-repeat",
      "-games",
      "2",
      "-rounds",
      rounds,
      "-concurrency",
      width,
      "-maxmoves",
      "200",
      "-pgnout",
      `${f}/${mode}.pgn`,
      "-debug",
      "all",
    ];
    const r = harness("r", sha, files, "--dry-run");
    assert.equal(r.status, 0, r.stderr);
    const rArgv = argvBlocks(r.stdout)[0]?.argv ?? [];
    const d = harness("d", sha, sha, files, "--budget-ms", "1500", "--dry-run");
    assert.equal(d.status, 0, d.stderr);
    const dArgv = argvBlocks(d.stdout)[0]?.argv ?? [];
    for (const argv of [rArgv, dArgv])
      assert.equal(
        argv.some((a) => /Skill Level/i.test(a)),
        false,
        argv.join(" "),
      );
    const stockfishCmd = rArgv[rArgv.indexOf("name=stockfish") + 1] as string;
    assert.match(stockfishCmd, /^cmd=/);
    assert.deepEqual(rArgv, [
      "<cutechess-cli>",
      ...sky("skytalix", "4", "1000"),
      "-engine",
      "name=stockfish",
      stockfishCmd,
      "st=0.5",
      "timemargin=2000",
      "restart=on",
      "option.Threads=1",
      "option.Hash=16",
      "option.UCI_LimitStrength=true",
      "option.UCI_Elo=1650",
      `stderr=${f}/stockfish.stderr`,
      ...tail("r", "100", "2"),
    ]);
    assert.deepEqual(dArgv, [
      "<cutechess-cli>",
      ...sky("skytalix", "1.5", "3500"),
      ...sky("base", "1.5", "3500"),
      ...tail("d", "200", "3"),
    ]);
  });
});

describe("ABC-255: d at 100 ms (C2′, C3″) and r at 500 ms (S′); every other print as before", () => {
  const sha = git("rev-parse", "--short=12", "HEAD");
  const files = join(SCRATCH, "abc255");
  const f = files.startsWith(homedir()) ? `<home>${files.slice(homedir().length)}` : files;
  const sky = (name: string, st: string, margin: string): string[] => [
    "-engine",
    `name=${name}`,
    "cmd=<node>",
    `arg=${f}/clone-${name}/dist/uci.js`,
    `dir=${f}/clone-${name}`,
    `st=${st}`,
    `timemargin=${margin}`,
    "restart=on",
    `stderr=${f}/${name}.stderr`,
  ];
  const tail = (mode: string, rounds: string, width: string): string[] => [
    "-each",
    "proto=uci",
    "-openings",
    "file=<repo>/tools/rating/openings.epd",
    "format=epd",
    "order=sequential",
    "-repeat",
    "-games",
    "2",
    "-rounds",
    rounds,
    "-concurrency",
    width,
    "-maxmoves",
    "200",
    "-pgnout",
    `${f}/${mode}.pgn`,
    "-debug",
    "all",
  ];
  const argvOf = (...args: string[]): string[] => {
    const run = harness(...args, "--dry-run");
    assert.equal(run.status, 0, run.stderr);
    assert.equal(existsSync(files), false);
    return argvBlocks(run.stdout)[0]?.argv ?? [];
  };
  const stockfish = (argv: readonly string[], elo: string): string[] => [
    "-engine",
    "name=stockfish",
    argv[argv.indexOf("name=stockfish") + 1] as string,
    "st=0.5",
    "timemargin=2000",
    "restart=on",
    "option.Threads=1",
    "option.Hash=16",
    "option.UCI_LimitStrength=true",
    `option.UCI_Elo=${elo}`,
    `stderr=${f}/stockfish.stderr`,
  ];

  test("A1: d --budget-ms 100 gives both sides st=0.1 and timemargin=50, at 50 and at 200 rounds", () => {
    for (const rounds of ["50", "200"]) {
      const argv = argvOf(
        "d",
        sha,
        sha,
        files,
        "--budget-ms",
        "100",
        "--rounds",
        rounds,
        "--concurrency",
        "1",
      );
      assert.deepEqual(argv, [
        "<cutechess-cli>",
        ...sky("skytalix", "0.1", "50"),
        ...sky("base", "0.1", "50"),
        ...tail("d", rounds, "1"),
      ]);
    }
  });

  test("A1: the default and each of today's d budgets keep Q1's 5 000 − budget", () => {
    for (const [flags, st, margin] of [
      [[], "3", "2000"],
      [["--budget-ms", "3000"], "3", "2000"],
      [["--budget-ms", "2500"], "2.5", "2500"],
      [["--budget-ms", "2000"], "2", "3000"],
      [["--budget-ms", "1500"], "1.5", "3500"],
      [["--budget-ms", "1000"], "1", "4000"],
    ] as [string[], string, string][]) {
      assert.deepEqual(argvOf("d", sha, sha, files, ...flags), [
        "<cutechess-cli>",
        ...sky("skytalix", st, margin),
        ...sky("base", st, margin),
        ...tail("d", "200", "3"),
      ]);
    }
  });

  test("A2: r --budget-ms 500 is the S′ smoke: skytalix st=0.5 timemargin=50, Stockfish's pins as r's", () => {
    const argv = argvOf(
      "r",
      sha,
      files,
      "--budget-ms",
      "500",
      "--rounds",
      "5",
      "--concurrency",
      "1",
    );
    assert.deepEqual(argv, [
      "<cutechess-cli>",
      ...sky("skytalix", "0.5", "50"),
      ...stockfish(argv, "1650"),
      ...tail("r", "5", "1"),
    ]);
  });

  test("A2: r without --budget-ms is r's 4 s, and every rpair block keeps st=4 timemargin=1000", () => {
    const argv = argvOf("r", sha, files);
    assert.deepEqual(argv, [
      "<cutechess-cli>",
      ...sky("skytalix", "4", "1000"),
      ...stockfish(argv, "1650"),
      ...tail("r", "100", "2"),
    ]);
    const pair = harness(
      "rpair",
      sha,
      sha,
      files,
      "--rounds",
      "10",
      "--concurrency",
      "1",
      "--dry-run",
    );
    assert.equal(pair.status, 0, pair.stderr);
    for (const { argv: block } of argvBlocks(pair.stdout)) {
      const [skytalix] = engineGroups(block);
      assert.ok(skytalix?.includes("st=4") && skytalix.includes("timemargin=1000"));
      assert.ok(skytalix?.includes(SKILL));
    }
  });

  test("A6: the control reaches skytalix only as st= and timemargin= (no new option)", () => {
    const keys = (argv: readonly string[]): string[] =>
      (engineGroups(argv)[0] ?? []).map((a) => a.split("=")[0] as string);
    const plain = keys(argvOf("r", sha, files));
    assert.deepEqual(keys(argvOf("r", sha, files, "--budget-ms", "500")), plain);
    const d100 = argvOf("d", sha, sha, files, "--budget-ms", "100");
    assert.deepEqual(keys(d100), keys(argvOf("d", sha, sha, files)));
    for (const argv of [argvOf("r", sha, files, "--budget-ms", "500"), d100])
      assert.equal(
        argv.some((a) => a.startsWith("option.") && !/^option\.(Threads|Hash|UCI_)/.test(a)),
        false,
      );
  });

  test("timemarginMs: 50 at 100 and 500 ms, else 5 000 − budget", () => {
    assert.deepEqual(
      [100, 500, 1000, 1500, 2000, 2500, 3000, 4000].map(rating.timemarginMs),
      [50, 50, 4000, 3500, 3000, 2500, 2000, 1000],
    );
  });

  test("r refuses any --budget-ms but 500 and 100, d refuses 500, rpair refuses the flag", () => {
    const cases: [string[], RegExp][] = [
      [["r", sha, files, "--budget-ms", "4000"], /--budget-ms 4000: r takes only 500 or 100/],
      [["r", sha, files, "--budget-ms", "1000"], /--budget-ms 1000: r takes only 500 or 100/],
      [["r", sha, files, "--budget-ms", "50"], /--budget-ms 50: r takes only 500 or 100/],
      [["r", sha, files, "--budget-ms", "x"], /--budget-ms x: r takes only 500 or 100/],
      [["d", sha, sha, files, "--budget-ms", "500"], /--budget-ms 500: not one of/],
      [["d", sha, sha, files, "--budget-ms", "50"], /--budget-ms 50: not one of/],
      [["rpair", sha, sha, files, "--budget-ms", "500"], /usage/],
    ];
    for (const [args, message] of cases) {
      const run = harness(...args, "--dry-run");
      assert.equal(run.status, 1, args.join(" "));
      assert.match(run.stderr, message, args.join(" "));
      assert.equal(existsSync(files), false);
    }
  });
});

describe("ABC-275: r at 100 ms (R1): Stockfish at st=0.1, --elo above 2 600 refused; every other print as before", () => {
  const sha = git("rev-parse", "--short=12", "HEAD");
  const files = join(SCRATCH, "abc275");
  const f = files.startsWith(homedir()) ? `<home>${files.slice(homedir().length)}` : files;
  const argvOf = (...args: string[]): string[] => {
    const run = harness(...args, "--dry-run");
    assert.equal(run.status, 0, run.stderr);
    assert.equal(existsSync(files), false);
    const blocks = argvBlocks(run.stdout);
    assert.equal(blocks.length, 1);
    return blocks[0]?.argv ?? [];
  };
  /** R1's whole vector (`…8136b589` § 1 "Shape"); `cmd=` of Stockfish is read from the print. */
  const r1 = (argv: readonly string[], elo: string, rounds: string, width: string): string[] => [
    "<cutechess-cli>",
    "-engine",
    "name=skytalix",
    "cmd=<node>",
    `arg=${f}/clone-skytalix/dist/uci.js`,
    `dir=${f}/clone-skytalix`,
    "st=0.1",
    "timemargin=50",
    "restart=on",
    `stderr=${f}/skytalix.stderr`,
    "-engine",
    "name=stockfish",
    argv[argv.indexOf("name=stockfish") + 1] as string,
    "st=0.1",
    "timemargin=2000",
    "restart=on",
    "option.Threads=1",
    "option.Hash=16",
    "option.UCI_LimitStrength=true",
    `option.UCI_Elo=${elo}`,
    `stderr=${f}/stockfish.stderr`,
    "-each",
    "proto=uci",
    "-openings",
    "file=<repo>/tools/rating/openings.epd",
    "format=epd",
    "order=sequential",
    "-repeat",
    "-games",
    "2",
    "-rounds",
    rounds,
    "-concurrency",
    width,
    "-maxmoves",
    "200",
    "-pgnout",
    `${f}/r.pgn`,
    "-debug",
    "all",
  ];

  test("A1: R1's command prints the whole vector: both sides st=0.1, skytalix timemargin=50, Stockfish 2000", () => {
    const argv = argvOf(
      "r",
      sha,
      files,
      "--elo",
      "1810",
      "--budget-ms",
      "100",
      "--rounds",
      "100",
      "--concurrency",
      "1",
    );
    assert.match(argv[argv.indexOf("name=stockfish") + 1] as string, /^cmd=/);
    assert.deepEqual(argv, r1(argv, "1810", "100", "1"));
  });

  test("A1: at 100 the defaults hold: --elo 1650, --rounds 100, --concurrency 2", () => {
    const argv = argvOf("r", sha, files, "--budget-ms", "100");
    assert.deepEqual(argv, r1(argv, "1650", "100", "2"));
  });

  test("A4: at 100, --elo 2600 and 1320 print; at 500 and with no flag, 2601 and 3190 still print", () => {
    for (const elo of ["2600", "1320"]) {
      const argv = argvOf("r", sha, files, "--elo", elo, "--budget-ms", "100");
      assert.deepEqual(argv, r1(argv, elo, "100", "2"));
    }
    for (const budget of [["--budget-ms", "500"], []])
      for (const elo of ["2601", "3190"]) {
        const argv = argvOf("r", sha, files, "--elo", elo, ...budget);
        assert.ok(argv.includes(`option.UCI_Elo=${elo}`));
        assert.ok(argv.includes("st=0.5"));
        assert.equal(argv.includes("st=0.1"), false);
      }
  });

  test("A3: at 100, --elo 2601 and 3190 are refused, naming the flag, the value and 2600", () => {
    for (const elo of ["2601", "3190"]) {
      const args = ["r", sha, files, "--budget-ms", "100", "--elo", elo, "--dry-run"];
      const run = harness(...args);
      assert.equal(run.status, 1, args.join(" "));
      assert.match(run.stderr, new RegExp(`--elo ${elo}: above 2600 at --budget-ms 100`));
      assert.equal(run.stdout.includes("cutechess-cli argv:"), false);
      assert.equal(existsSync(files), false);
    }
  });

  test("A3: rpair --budget-ms 100 is still refused with the usage text", () => {
    const run = harness("rpair", sha, sha, files, "--budget-ms", "100", "--dry-run");
    assert.equal(run.status, 1);
    assert.match(run.stderr, /usage/);
    assert.equal(run.stdout.includes("cutechess-cli argv:"), false);
  });

  test("A5: at 100 the control reaches skytalix only as st= and timemargin= (no new option)", () => {
    const keys = (argv: readonly string[]): string[] =>
      (engineGroups(argv)[0] ?? []).map((a) => a.split("=")[0] as string);
    const r100 = argvOf("r", sha, files, "--budget-ms", "100");
    assert.deepEqual(keys(r100), keys(argvOf("r", sha, files)));
    assert.equal(
      (engineGroups(r100)[0] ?? []).some((a) => a.startsWith("option.")),
      false,
    );
  });
});

describe("A2: the schedule", () => {
  const blocks = pairSchedule(100);

  test("10 blocks per build, 10 openings each, alternating order", () => {
    assert.equal(blocks.length, 10);
    blocks.forEach((b: Block, i) => {
      assert.equal(b.rounds, 10);
      assert.deepEqual(b.order, i % 2 === 0 ? ["base", "candidate"] : ["candidate", "base"]);
    });
  });

  test("openings 1–100 exactly once per build", () => {
    const covered = blocks.flatMap((b) => Array.from({ length: b.rounds }, (_, k) => b.start + k));
    assert.deepEqual(
      covered,
      Array.from({ length: 100 }, (_, k) => k + 1),
    );
  });

  test("the dry run prints that schedule and runs each block for each build once", () => {
    const out = join(SCRATCH, "a2");
    const sha = git("rev-parse", "--short", "HEAD");
    const run = harness("rpair", sha, sha, out, "--dry-run");
    assert.equal(run.status, 0, run.stderr);
    const lines = run.stdout.split("\n").filter((l) => /^block \d\d openings/.test(l));
    assert.equal(lines.length, 10);
    assert.equal(lines[0], "block 01 openings 1-10: base, then candidate");
    assert.equal(lines[1], "block 02 openings 11-20: candidate, then base");
    assert.equal(lines[9], "block 10 openings 91-100: candidate, then base");
    const headers = argvBlocks(run.stdout).map((b) => b.header.slice(0, 18));
    assert.deepEqual(headers.slice(0, 4), [
      "block 01 base cute",
      "block 01 candidate",
      "block 02 candidate",
      "block 02 base cute",
    ]);
  });

  test("--rounds 10 is the A5 smoke: one block per build, 40 games", () => {
    assert.equal(pairSchedule(10).length, 1);
  });

  test("bad values stop before any work, naming the argument", () => {
    const sha = git("rev-parse", "--short", "HEAD");
    const cases: [string[], RegExp][] = [
      [["rpair", "HEAD", sha], /HEAD: not a sha/],
      [["rpair", sha, "ABCDEF0"], /ABCDEF0: not a sha/],
      [["rpair", sha, "abc;true"], /abc;true: not a sha/],
      [["rpair", sha, sha, "--rounds", "15"], /--rounds 15: not 10–100 in tens/],
      [["rpair", sha, sha, "--rounds", "110"], /--rounds 110/],
      [["rpair", sha, sha, "--concurrency", "9"], /--concurrency 9/],
      [["rpair", sha, sha, "--elo", "1000"], /--elo 1000/],
    ];
    for (const [args, message] of cases) {
      const out = join(SCRATCH, "bad");
      const [mode, a, b, ...flags] = args as [string, string, string, ...string[]];
      const run = harness(mode, a, b, out, ...flags);
      assert.equal(run.status, 1, args.join(" "));
      assert.match(run.stderr, message);
      assert.equal(existsSync(out), false);
    }
    assert.equal(harness("rpair", sha, sha, join(SCRATCH, "x"), "--budget-ms", "1500").status, 1);
  });
});

describe("A3: the arithmetic on qe-epic008-close r1 and r2", () => {
  const outText = (r: string): string =>
    gunzipSync(readFileSync(join(RECORDS, r, "r.out.gz"))).toString("utf8");
  const [out1, out2] = [outText("r1"), outText("r2")];
  const pgn1 = pgnGames(readFileSync(join(RECORDS, "r1/r.pgn"), "utf8"));
  const pgn2 = pgnGames(readFileSync(join(RECORDS, "r2/r.pgn"), "utf8"));
  const eloLine = (text: string) => {
    const m = [...text.matchAll(/^Elo difference: (\S+) \+\/- (\S+),/gm)].at(-1);
    return { x: m?.[1] as string, y: m?.[2] as string };
  };

  test("the pooling formula gives cutechess-cli's own recorded lines", () => {
    const cases: [number, number, number, string, string][] = [
      [146, 47, 7, "188.5", "54.8"], // qe-epic008-close r1
      [125, 66, 9, "105.6", "49.5"], // qe-epic008-close r2
      [31, 16, 53, "52.5", "46.8"], // qe-epic008-q4c d
      [132, 50, 18, "151.3", "50.3"], // ABC-204 A4 baseline
    ];
    for (const [w, l, d, x, y] of cases) {
      const e = cutechessElo(w, l, d);
      assert.deepEqual([eloText(e.x), eloText(e.y)], [x, y]);
    }
    assert.deepEqual(eloLine(out1), { x: "188.5", y: "54.8" });
    assert.deepEqual(eloLine(out2), { x: "105.6", y: "49.5" });
  });

  test("the pair difference reads −82.9 ± 73.8", () => {
    const p = pairDifference(eloLine(out1), eloLine(out2));
    assert.equal(p.x.toFixed(1), "-82.9");
    assert.equal(p.y.toFixed(1), "73.8");
  });

  test("the pentanomial reads −82.9 ± 64.3", () => {
    const p = pentanomialPair(
      openingScores(pgn1, 1, "skytalix"),
      openingScores(pgn2, 1, "skytalix"),
    );
    assert.ok(p !== undefined);
    assert.ok(Math.abs(p.x - -82.9) <= 0.1, String(p.x));
    assert.ok(Math.abs(p.half - 64.3) <= 0.1, String(p.half));
    assert.equal(p.openings, 100);
  });

  test("split into 10 blocks, the pair summary pools to the same figures", () => {
    const blocks = pairSchedule(100);
    const asBlocks = (games: ReturnType<typeof pgnGames>) =>
      blocks.map((block) => {
        const mine = games
          .filter((g) => g.round >= block.start && g.round < block.start + block.rounds)
          .map((g) => ({ ...g, round: g.round - block.start + 1 }));
        const wld = [1, 0, 0.5].map(
          (s) =>
            mine.filter(
              (g) =>
                (g.result === "1/2-1/2"
                  ? 0.5
                  : (g.result === "1-0") === (g.white === "skytalix")
                    ? 1
                    : 0) === s,
            ).length,
        ) as [number, number, number];
        const own = cutechessElo(...wld);
        return {
          block,
          games: mine,
          judged: { text: "", causes: [], wld, elo: { x: eloText(own.x), y: eloText(own.y) } },
        };
      });
    const base = rating.readBuild("base", blocks, asBlocks(pgn1), 1910, EPD);
    const candidate = rating.readBuild("candidate", blocks, asBlocks(pgn2), 1910, EPD);
    assert.deepEqual(base.causes, []);
    assert.deepEqual(base.elo, { x: "188.5", y: "54.8" });
    const text = rating.pairSummary(base, candidate, undefined);
    assert.match(text, /^pair: .* = -82\.9 ± 73\.8$/m);
    assert.match(text, /^pair state: LOSS$/m);
    assert.match(
      text,
      /^opening-paired \(pentanomial\), information only: -82\.9 ± 64\.3 \(95 %, 100 openings/m,
    );
  });

  test("Stockfish's median nps per reading matches arch-epic008-rd's an3", () => {
    assert.deepEqual(stockfishNps(out1)?.median, 1_643_068);
    assert.deepEqual(stockfishNps(out2)?.median, 1_623_258);
  });

  test("the recorded games cover openings 1–100 with both colours", () => {
    assert.deepEqual(coverageCauses(pgn1, 1, 100, EPD, "skytalix"), []);
  });
});

describe("A4: one faulted block makes its build and the pair UNRESOLVED", () => {
  const blocks = pairSchedule(20);
  /** A 10-opening block on disk: 12 wins, 6 losses, 2 draws, game `faultAt` ending in `fault`. */
  function blockDir(name: string, start: number, fault?: string): string {
    const dir = join(SCRATCH, "a4", name);
    mkdirSync(dir, { recursive: true });
    const finished: string[] = [];
    const pgn: string[] = [];
    for (let g = 1; g <= 20; g++) {
      const round = Math.ceil(g / 2);
      const skyWhite = g % 2 === 1;
      const kind = g <= 12 ? "win" : g <= 18 ? "loss" : "draw";
      const whiteWins = (kind === "win") === skyWhite;
      const result = kind === "draw" ? "1/2-1/2" : whiteWins ? "1-0" : "0-1";
      let text =
        kind === "draw" ? "Draw by 3-fold repetition" : whiteWins ? "White mates" : "Black mates";
      if (fault !== undefined && g === 5) text = fault;
      const [white, black] = skyWhite ? ["skytalix", "stockfish"] : ["stockfish", "skytalix"];
      finished.push(`Finished game ${g} (${white} vs ${black}): ${result} {${text}}`);
      const fen = `${EPD[start + round - 2]} 0 1`;
      pgn.push(
        `[Event "?"]\n[Round "${round}"]\n[White "${white}"]\n[Black "${black}"]\n[Result "${result}"]\n[FEN "${fen}"]\n\n1. a3 {+0.10/20 0.50s} a6 {-0.10/20 0.50s} ${result}\n`,
      );
    }
    const e = cutechessElo(12, 6, 2);
    writeFileSync(
      join(dir, "r.out"),
      `${finished.join("\n")}\nScore of skytalix vs stockfish: 12 - 6 - 2  [0.650] 20\nElo difference: ${eloText(e.x)} +/- ${eloText(e.y)}, LOS: 99.1 %, DrawRatio: 10.0 %\n`,
    );
    writeFileSync(join(dir, "r.pgn"), pgn.join("\n"));
    writeFileSync(join(dir, "skytalix.stderr"), "");
    writeFileSync(join(dir, "stockfish.stderr"), "");
    return dir;
  }
  const play = (dir: string, block: Block, stop?: string) => ({
    block,
    judged: rating.summarise({ mode: "r", out: dir, games: 20, elo: 1910 }, stop, [
      "skytalix.stderr",
      "stockfish.stderr",
    ]),
    games: pgnGames(readFileSync(join(dir, "r.pgn"), "utf8")),
  });
  const clean = (name: string) => [
    play(blockDir(`${name}-1`, 1), blocks[0] as Block),
    play(blockDir(`${name}-2`, 11), blocks[1] as Block),
  ];

  test("clean fixture blocks read a rating, not UNRESOLVED", () => {
    const b = rating.readBuild("base", blocks, clean("clean"), 1910, EPD);
    assert.deepEqual(b.causes, []);
    assert.match(b.lines.join("\n"), /state: rating E \+ X ± Y = 1910 \+ /);
  });

  const faults: [string, string | undefined, string | undefined][] = [
    ["illegal move", "Black makes an illegal move: e7e1", undefined],
    ["disconnect", "White disconnects", undefined],
    ["stall", "Black's connection stalls", undefined],
    ["time forfeit", "White loses on time", undefined],
    ["watchdog stall", undefined, "watchdog stop: no output for 600 s"],
  ];
  for (const [label, text, stop] of faults) {
    test(label, () => {
      const base = rating.readBuild("base", blocks, clean(label), 1910, EPD);
      const dir = blockDir(`${label}-bad`, 11, text);
      const candidate = rating.readBuild(
        "candidate",
        blocks,
        [play(blockDir(`${label}-ok`, 1), blocks[0] as Block), play(dir, blocks[1] as Block, stop)],
        1910,
        EPD,
      );
      assert.ok(candidate.causes.length > 0);
      assert.match(candidate.lines.join("\n"), /state: UNRESOLVED/);
      assert.deepEqual(base.causes, []);
      const summary = rating.pairSummary(base, candidate, `after block 02 candidate`);
      assert.match(summary, /^pair state: UNRESOLVED/m);
    });
  }

  test("a block never played (the run halted) is UNRESOLVED too", () => {
    const b = rating.readBuild("base", blocks, clean("halted").slice(0, 1), 1910, EPD);
    assert.ok(b.causes.includes("blocks: 1 of 2 played"));
  });
});

describe("ADR-0049 d4: records carry placeholders, not host paths", () => {
  test("paths longest first, then user and host as whole words", () => {
    const text = "/home/u1x/work/out/b01/r.pgn by u1x on box1 (Bu1x stays)";
    const red = redact(
      text,
      [
        ["/home/u1x", "<home>"],
        ["/home/u1x/work/out", "<out>"],
      ],
      [
        ["u1x", "<user>"],
        ["box1", "<host>"],
      ],
    );
    assert.equal(red, "<out>/b01/r.pgn by <user> on <host> (Bu1x stays)");
  });
});
