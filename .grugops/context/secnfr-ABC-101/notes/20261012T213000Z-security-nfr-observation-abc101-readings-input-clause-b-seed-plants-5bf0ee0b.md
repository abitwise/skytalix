---
id: 20261012T213000Z-security-nfr-observation-abc101-readings-input-clause-b-seed-plants-5bf0ee0b
kind: observation
by: security-nfr
task: secnfr-ABC-101
at: 2026-10-12T21:30:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-042
  - ABC-087
  - ADR-0036
  - ADR-0037
  - AR-095-L1UNIT
  - V2.2.1
  - V2.2.2
  - V1.3.2
  - SEC-101-a
  - 20261012T212000Z-qe-e2e-decision-abc101-verdict-pass-with-gaps-2fa04d14
  - 20261012T211800Z-qe-e2e-observation-abc101-plants-and-abc065-a3-value-check-9b0ef449
  - 20261012T151900Z-security-nfr-observation-s3-readings-clause-b-items-2-8-cwd-children-c24fec8e
supersedes:
---

# `ABC-101` Security/NFR readings on `3ea3e352..98ea0a84` (QE tip `dee6562a`): input handling, clause (b), Ruling 2, the seed, plants

This note is hand-authored and unsealed. No `finding` is admissible on this install. Everything was read on
`grugops/secnfr-ABC-101` (worktree `../wt-secnfr-ABC-101`, off `dee6562a`, `node_modules` symlinked at the worktree
root only). **No timing was read.** Raw output is in `../probe/`. `src/` at `dee6562a` equals `98ea0a84`, because
clause (b) on `98ea0a84..dee6562a` reports 0 production files changed.

## 1. Input handling (`probe/input-handling.out.txt`, `probe/battery.out.txt`, `probe/esc.txt`)

The page's firing threshold: it fires if the level is parsed anywhere other than `resolveOptions`, or if the accepted
set becomes open.

- **Parsed in one place.** Every production line naming `difficulty` is in `src/cli-options.ts` (the resolver), in
  `src/cli.ts` (the destructure at `:150`, the `createLevelSeam(difficulty, …)` call at `:193`, the `USAGE` string, the
  header comment), or a comment. `LEVELS` is imported and indexed only in `src/level-seam.ts` (`:10`, `:15`).
  `parseInt`, `parseFloat`, `new RegExp`, `.test(` and `.match(` occur 0 times in the three production files. The one
  `Number(` is `cli-options.ts:160`, `Number(value)`. It runs on a `value` that `DIFFICULTY_VALUES.find(candidate =>
  candidate === next)` has already matched exactly, so it converts a member of the set and parses nothing.
- **Closed set, read by a battery** (delivered modules imported read-only from the worktree):
  - `--difficulty <v>` over 36 hostile values: **0 accepted.** The values were `__proto__`, `constructor`,
    `toString`, `valueOf`, `hasOwnProperty`, `isPrototypeOf`, `__defineGetter__`, `length`, fullwidth `３`, Arabic-Indic
    `٣`, `3\0`, `3\n`, `3 `, `\t3`, `0x3`, `3e0`, `0b11`, `0o3`, `Infinity`, `NaN`, `-0`, `1,2`, `3` + ZWSP, an
    ESC sequence + `3`, `""`, `3.`, `03`, `+3`, `3.0`, `0`, `6`, `-1`, `3.5`, `three`, `1 2` and `１`.
  - Refused with the token named: `3` alone, `1` alone, `--difficulty=3`, `--DIFFICULTY 3`, `-d 3`,
    `--difficulty --difficulty 3`, `--difficulty 3 3`, `--colour 3`, `--difficulty white`, `--difficulty --ascii`.
  - `--difficulty 3 --difficulty 5` gives 5, and `5 … 1` gives 1 (last wins, `QE-101-d`).
  - Exactly 5 of `ACCEPTED_ARGUMENTS` are accepted after `--difficulty`, and they equal `Object.keys(LEVELS)`.
- **The echo (bar 3).** `node src/cli.ts --difficulty $'\e]0;pwned\a\e[2J7'` exits **1**, writes **0 B** to stdout and
  151 B to stderr, with **0** ESC bytes and **0** BEL bytes. `printableOf` filters the offending token as before.
- **The forward rule.** `createLevelSeam` builds levels `1`–`5` (and the own key `"3"`, which is the same level). It
  throws `RangeError` for `0`, `6`, `-0`, `3.5`, `NaN`, `Infinity`, `-1`, `"constructor"`, `"__proto__"`,
  `"toString"`, `"valueOf"`, `"hasOwnProperty"`, `"03"` and `" 3"`. By bracket, `LEVELS["constructor"]` is a function
  and `LEVELS["__proto__"]` an object, and `hasOwn` is `false` for both. `LEVELS` is frozen.

## 2. Plants (`probe/plants.mjs`, `probe/plants.out.txt`)

**Method.** QE's method (`…9b0ef449`): a fresh `git archive 98ea0a84` per plant under the session scratchpad
(`secnfr101/<name>`), outside the repository. Exact-string edits, each old string asserted to occur once. One
`node_modules` link inside the copy. `npx tsc --noEmit`, then the full `npx vitest run` with every `*_DEEP` unset.
The copy is removed by the exact path the runner made. **Plant directories: 0 before and 0 after every plant.
`abc095-book-absent-*` in the tmpdir: 0 before and 0 after the run.** `tsc` exits 0 on every plant.

| plant | edit | rows red (of 1789) |
|---|---|---|
| control | none | 0 (1789 passed) |
| S1 `parseInt` range | `Number.parseInt(next ?? "", 10)`, 1..5 | 3: `ABC-101` `A3` (`"3.5"`), `ABC-042` `A6`(i) (literal `""`), `ABC-042` `A8` (new `10`) |
| S2 anchored regex, with a literal | `/^[1-5]$/.test(next ?? "")` | 1: `ABC-042` `A6`(i) (literal `""`) |
| **S2b anchored regex, no literal** | `next !== undefined && /^[1-5]$/.test(next)` | **0.** It accepts exactly the delivered set, so there is no exposure |
| **S2c `/m` regex, no literal** | `next !== undefined && /^[1-5]$/m.test(next)` | **0.** It accepts `3\nx`. A real child `--difficulty $'3\nx' --ascii` exits **70**, writes 0 B to stdout, and prints the generic internal-error line. The seam's `hasOwn` throws on `NaN` (`SEC-101-a`) |
| S3 unanchored regex | `/^[1-5]/.test(next ?? "")` | 2: `A3` (`"3.5"`), `ABC-042` `A6`(i) |
| S8 `--difficulty=N` form | a `startsWith(\`${DIFFICULTY}=\`)` arm | 1: `ABC-042` `A6`(i) (literal `${DIFFICULTY}=`) |
| S4 second parser in `cli.ts` | `process.argv.indexOf("--difficulty")`, `Number(argv[at+1])` | 3: `ABC-042` `A9` (argv ×3), `ABC-042` `A8`, `ABC-101` `A8′` destructure |
| S5 guard removed | the `Object.hasOwn` line deleted | 1: `ABC-101` `A8′` own-key row |
| S6 seed from env | `Number(process.env.CHESS_SEED ?? …)` | 3: `ABC-042` `A9` census, `ABC-043` `A1` `engine:` pin, `ABC-086` `A5`(i′) |
| S7 seed from input | `{ seed: difficulty }` | 4: `ABC-042` `A8`, `ABC-043` `A1`, `ABC-101` `A8′` read-once count, `ABC-086` `A5`(i′) |

**Not repeated:** QE's P2 (`in` for `hasOwn`), P3 (a `Number()` range), P8–P8c (constant seeds) and P10 (first-only).
All were red at QE.

## 3. `ADR-0036` clause (b), canonical instrument (`probe/clause-b.out.txt`)

`node .grugops/context/design-F-072-1/probe/clause-b.mjs 3ea3e352 98ea0a84 <limb>`. Production files changed: 3
(`src/cli-options.ts`, `src/cli.ts`, `src/level-seam.ts`).

| limb | (b1) | new edges | edges reaching a holder | word hits | unresolved | holders at head | verdict |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 2 | 0 | 0 | 0 | 1: `book-file.ts` | does not fire |
| 2 | 0 | 2 | 0 | 0 | 0 | 3: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts` | does not fire |
| 3 | 0 | 2 | 0 | 0 | 0 | 0 | does not fire |

- **The new edges, both reaching no holder:** `src/cli.ts -> src/level-seam.ts` and `src/level-seam.ts -> src/levels.ts`.
  The edge `cli.ts -> engine.ts` is gone; the instrument does not count removals.
- **Holder set at the tip: 4**, the same as at `ABC-095`'s S3. Production files: 39 at base, 40 at head.
- **The QE tip** (`98ea0a84..dee6562a`): 0 production files changed on all three limbs.

## 4. `ADR-0036` § S1 Ruling 2, by hand (`probe/ruling2-by-hand.out.txt`)

- Limb-1 holders: base `3ea3e352` = `src/book-file.ts` (from `clause-b.mjs 3ea3e352 3ea3e352 1`); head `98ea0a84` =
  `src/book-file.ts`. Union: `src/book-file.ts`. **The pathspec is non-empty, so the empty-pathspec trap
  (`secnfr-ABC-095-s3`) does not apply.**
- `git diff --name-only --no-renames 3ea3e352 98ea0a84 -- src/book-file.ts` prints nothing and exits 0. There are 0
  `+` lines. The blob is `5f0ea29d` at both ends. **Ruling 2 does not fire.**
- For contrast, not used as a reading: an empty pathspec would list all 20 changed paths.
- **`AR-095-L1UNIT` is still open.** `clause-b.mjs` is still not folded, and the rule was applied by hand here.

## 5. The seed (`probe/seed.out.txt`)

- **Randomness sources in production** (`Math.random|randomUUID|randomBytes|randomInt|getRandomValues|node:crypto|"crypto"|performance.now|hrtime`,
  comments included): **8 at base and 9 at head.** The one addition is `src/cli.ts:193`,
  `createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })`. It is also the only added line that
  matches.
- **Nothing reads the seed from input.** `seed` appears only on that line and its comment (`:190`). `process.env` and
  `process.argv` reads at head are unchanged: `cli.ts:138` (`resolveOptions(process.argv.slice(2))`) and
  `glyph-mode.ts:118`. S6 and S7 show that an env or input seed reds 3 to 4 rows.
- **The value is always admissible.** `Math.random()` is in [0, 1), so the seed is an integer in [0, 2^32 − 1], and
  `seededRandom` accepts it without throwing.
- `Math.random` is not a CSPRNG. ASVS `V11.5.1` is [L2], outside the active L1 set, and this seed guards nothing secret.

## Clean-up

- Scratchpad top level: 387 entries before this hop. During the hop it also held `secnfr101/` and `secnfr101-scripts/`.
  Both are removed by exact path at the end of the hop (see the artifact-ref note).
- Nothing was written in the main checkout except the queue claim.
