---
id: 20260815T112500Z-qe-e2e-decision-scenario-to-test-map-seventeen-rows-four-backed-ten-partial-three-on-the-uat-run-alone-b6b7f3b4
kind: decision
by: qe-e2e
at: 2026-08-15T11:25:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - src/cli.test.ts
  - src/cli.ts
  - src/cli-options.ts
  - src/glyph-mode.ts
  - agent-factory/workflows/06-uat-pack.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T110533Z-uat-planner-decision-the-abc042-uat-pack-seventeen-scenarios-a-non-engineer-can-run-and-judge-f43cd04c.md
supersedes: 
---

# The scenario → test map — all seventeen rows, by name: 4 backed, 10 partially backed, 3 resting on the UAT run alone

**The question this hop answers:** which of the pack's seventeen UAT scenarios are backed by an
automated test, and which rest only on the agent's UAT run. **Every scenario gets a row. A row with
no test is a COVERAGE GAP and is stated as such — it is not a defect, and nothing here is dressed as
one.** Every scenario in the pack's run passed; the delivered product behaves as the pack reports.

**This is a `decision`, not a `finding`; `verified_by` is empty.** No `finding` is admissible on this
install and a green suite is not a stamp. **No test file was created or edited on this hop**, and no
acceptance signature is recorded — that is the project owner's alone.

## The instrument

`src/cli.test.ts` is the ONE file that covers the two delivered modules: **29 test cases**, ten child
processes spawned once each at module scope with stdout AND stderr piped, `cwd` = the repository,
`stdio[0] = "ignore"`. The ten children, by argv:

| name | argv |
|---|---|
| `npmRun` | `npm run chess` |
| `white` | `--colour white --unicode` |
| `black` | `--colour black` |
| `random` | `--colour random` |
| `conflict` | `--ascii --unicode` |
| `difficulty` | `--difficulty 3` |
| `shortFlag` | `-x` |
| `badColour` | `--colour purple` |
| `bareWord` | `foo` |
| `escape` | `--colour <ESC>[2Jpurple` |

**`--ascii` is not among them, and neither is any argv with no `--colour`, no glyph flag and no
error.** That absence is the single most consequential fact in this note.

## The map

Grading rule, stated so the rows can be argued with: **BACKED** = the scenario's own property is
asserted by a named test case; **PARTIAL** = some clause of the scenario is asserted and at least one
named clause or the scenario's own command surface is not; **UNBACKED** = no test asserts the
scenario's property at all.

| # | scenario | test file → case (by name) | verdict |
|---|---|---|---|
| UAT-1 | one command, a board appears, exit 0 | `src/cli.test.ts:162` `A1 — \`npm run chess\` writes the start position and exits 0`; plus `:206` `A7 — no flags on a pipe…` and `:226` `A8 — the append strategy…` on the same child | **BACKED**, and stronger than the scenario: the frame is asserted as a **byte-exact TAIL** of the child's stdout, the eight ranks are named individually, and no frame row may precede the tail |
| UAT-2 | a correct brand-new game | `src/cli.test.ts:162` (same tail equality, against a reference frame composed from the merged modules using the test file's own hand-transcribed `START_FEN`) | **BACKED**. Rows 9–10 of the frame — `White to move  1.` and `material: 0` — are inside the asserted tail. The board's *content* is additionally covered by `src/render.test.ts`, `src/status-panel.test.ts`, `src/history-pane.test.ts` |
| UAT-3 | the same command twice draws the same picture | **none** | **UNBACKED**. No test runs any command twice and compares. Single-run byte-exactness at `:162` and `:274` bounds the property indirectly; the scenario's own command (`--colour white` with no glyph flag) is spawned by no test |
| UAT-4 | I can play White, board faces me | `src/cli.test.ts:274` `A4 — the running entry point draws each colour from the human's side` (child `white`, board region byte-exact); `:265` `A4 — the orientation follows the colour…` (unit) | **BACKED**. `renderBoard` returns **9 rows including the file-letter row** (measured), so `a b c d e f g h` is inside the byte-exact comparison. Surface note: the spawned child also carries `--unicode`; the scenario's command carries no glyph flag |
| UAT-5 | I can play Black, the board turns round | `src/cli.test.ts:274` (child `black`, argv exactly `--colour black`, board region byte-exact — the reversed file row `h g f e d c b a` is inside it) | **PARTIAL**. The clause *"It is still White's move"* is **unasserted**: the comparison covers the 9 board rows only, and **no test asserts the status panel for any non-default child** |
| UAT-6 | it can pick my side for me | `src/cli.test.ts:247` `A4 — \`--colour random\` resolves to white or black 1000 times, with zero spawns` (pure resolver); `:274` (child `random` is one of the two board regions) | **PARTIAL, and weaker than the scenario claims** — see § "Weaker than it claims", item 1 |
| UAT-7 | chess symbols on request | `src/cli.test.ts:274` pins all 32 figures byte-exactly (child `white`); `:215` `A7 — \`--unicode\` on a pipe puts real chess glyphs in the board region` asserts only `glyphs.length > 0` | **BACKED — by the `A4` row, not by the row named `A7`.** See § "Weaker than it claims", item 2 |
| UAT-8 | plain letters on request | `src/cli.test.ts:359` `A6(i) — every documented spelling resolves in its legal argv position` — which asserts **only `resolveOptions(["--ascii"]).ok === true`** | **UNBACKED.** No test spawns `--ascii`; no test asserts that `--ascii` produces letters. **Proven live by mutation — see the mutation note in this folder** |
| UAT-9 | both glyph flags at once is refused | `src/cli.test.ts:294` `A5 — \`--ascii --unicode\` is refused at the resolver, and selectGlyphMode is not called`; `:315` `A5 — end to end: both flags named, non-zero exit, and zero frame rows on either channel` | **PARTIAL**. The clause *"followed by a usage line showing the accepted options"* is **unasserted anywhere in the repository** — the word `usage` occurs in `src/cli.test.ts` exactly once, inside a comment |
| UAT-10 | nine wrong words, each refusal names the word | four of nine end to end at `:325` `A6(iii) — four unrecognised command lines: named, non-zero, and no frame anywhere` (rows a `--difficulty 3`, b `-x`, c `foo`, e `--colour purple`); rows h `--COLOUR white` and i `--colour WHITE` deterministically at the resolver only, via `:401` `A6(i) — the near-miss family, COMPLETE OVER POSITION…`; row g `--help` by class only (`:469` uses `--debug`, `:477` is randomised) | **PARTIAL.** **Rows d (`white` alone) and f (`--colour` with nothing after it) have NO deterministic coverage at any level** — neither is in the near-miss family, neither is a fixed case, and `:477`'s random corpus reaches them only by accident. Row f is proven live by mutation. The usage-line clause is unasserted for all nine |
| UAT-11 | a refusal never half-draws a board | `:315`, `:325`, `:750` assert `frameRowsIn(stdout) == []` **and** `frameRowsIn(stderr) == []` for 5 of the 10 command lines this scenario names (`conflict`, `difficulty`, `-x`, `foo`, `--colour purple`), plus the `escape` child | **PARTIAL** — 5 of 10. The five never spawned (`white`, `--colour`, `--help`, `--COLOUR white`, `--colour WHITE`) carry no such assertion. They share one early-return code path, which is why this is low risk; it is still uncovered and is recorded as coverage, not as risk |
| UAT-12 | a nasty argument cannot scramble my screen | `src/cli.test.ts:750` `bar 3 — an argument carrying an escape sequence is echoed, stripped of its control bytes` — non-vacuity FIRST, the token located by whitespace rather than by line position, zero C0/`U+007F`/`\x1b` in the echoed token, zero frame rows on both channels, non-zero exit | **PARTIAL**, with a stronger instrument than the scenario on the piped half. Two gaps: the test's argv `--colour <ESC>[2Jpurple` takes the **missing-value** reject branch while the scenario's bare token takes the **unrecognised** branch (same `printableOf` filter, different branch); and *"the screen is not cleared"* on a **real terminal** is unbacked — **no test runs the entry point under a pty** |
| UAT-13 | the board appears fast enough | **none, BY TICKET DESIGN** — `A11` is *"a recorded reading with its machine, never a suite assertion"* (`## Test notes` 5), because a wall clock in a shared lane is a flake generator | **UNBACKED.** Rests entirely on the UAT run (median 167 ms against a 1 000 ms bar) |
| UAT-14 | the documented command is the working command | `src/cli.test.ts:193` `A1 — AGENTS.md's \`Dev / run\` line is the command that was run` — asserts the exact line, the absence of the `UNKNOWN - verify` placeholder, and `scripts.chess === "node src/cli.ts"` | **PARTIAL.** The scenario's second half — *"and run it with each option it lists"* — is unbacked: `AGENTS.md`'s option list lives in an HTML comment and **no test compares it to `ACCEPTED_ARGUMENTS`**. A documented option that does not exist would ship green |
| UAT-15 | it draws once and stops; it does not wait | `src/cli.test.ts:604` `A9 — process.argv occurs EXACTLY once and only as the resolver's argument` **closes the entry point's whole `process` surface** to `argv` / `exitCode` / `stderr` / `stdout`, counts the bare identifier at exactly four, and bars `process[…]` and `globalThis` — so `process.stdin` would go red | **PARTIAL, structural only.** No test asserts the **behaviour**: every child runs with `stdio[0] = "ignore"`, so a build that read stdin would hit EOF and exit anyway, and nothing holds stdin open against a timeout. The pack's two methods are the only behavioural evidence |
| UAT-16 | there is no way to make a move, by any route | **none by name.** Class coverage only: `:477` `A6(ii) — 1000 generated tokens, 250 per shape, every one rejected and named` (its `--<word>` and `<word>` shapes are the shapes of all six verbs), plus `:353` `A6(i) — the exported enumeration EQUALS the table…` and `:372` `A6(i) — the enumeration is the ONLY argv literal…`, which together make a quietly-recognised fifth flag red | **PARTIAL — class only.** **None of `--move e4`, `e4`, `--new`, `--undo`, `--resign`, `--quit` is named in any test and none is spawned.** This is the scenario the pack calls its most important, and it has the least by-name backing of the seventeen |
| UAT-17 | it runs only from the project folder | `src/cli.test.ts:670` `A10 — package.json gains exactly one scripts key and nothing else` pins the **structural cause**: no `bin`, `main`, `files`, `publishConfig`, `dependencies`; `private` still `true` | **PARTIAL.** The **behavioural** half — run it from another folder and it fails — is unbacked: every spawn uses `cwd: REPOSITORY` |

### Tally

**4 BACKED** — UAT-1, UAT-2, UAT-4, UAT-7.
**10 PARTIALLY BACKED** — UAT-5, UAT-6, UAT-9, UAT-10, UAT-11, UAT-12, UAT-14, UAT-15, UAT-16, UAT-17.
**3 UNBACKED, resting on the agent's UAT run alone** — **UAT-3**, **UAT-8**, **UAT-13**.

## Where the backing test is WEAKER than the scenario claims

The pack's scenarios are product questions; `A1`–`A12` are engineering assertions. Where the two come
apart, it is named here. **The ticket itself draws this line and it is worth quoting: `A4`'s 1000
resolutions, `A5`'s spy and `A6`(i)/(ii) are *"unit tests with ZERO spawns"*, while `A1`, `A4`/`A5`/`A6`'s
end-to-end halves and `A7`–`A9` run the entry point as a child.** A unit test over a pure resolver
does not back a scenario that claims a human can run the program.

1. **UAT-6** — the scenario says *both sides appear over **ten runs of the program***. The strong
   assertion (`:247`) is **1000 calls to `resolveOptions`, zero spawns**; end to end there is exactly
   **one** `random` child, asserted to be one of two boards. Nothing end-to-end asserts both sides
   ever appear. Also: *"the word `random` never appears on the board **or in the status line**"* — the
   unit row checks the resolved options object, the board half follows from the byte-exact region,
   and **the status-line half is unasserted**.
2. **UAT-7** — the scenario says *"thirty-two of them"*. The row named `A7` (`:215`) asserts
   `glyphs.length > 0` — **a lower bound of one**. The byte-exact backing comes from `:274`, a
   different row, over the same child.
3. **UAT-8** — the scenario says *the pieces are letters*. The only assertion touching `--ascii` on an
   accepting path is `resolveOptions(["--ascii"]).ok === true`. **`.ok` is not "letters".** This is the
   weakest backing of the seventeen and it is demonstrably blind (see the mutation note).
4. **UAT-9, UAT-10, UAT-12** — all three scenarios require *"then the usage line"*. **No test in the
   repository asserts that a usage line is written, or what it says.** Removing `USAGE` from the
   rejection path would ship 856/856 green.
5. **UAT-10 rows h and i** — the pack calls these *"the ones that catch a program that quietly forgives
   spelling"*. They are backed **at the resolver only**; neither is ever spawned, so the scenario's
   claim (a person types a command and is refused) rests on the UAT run.
6. **UAT-12** — the scenario's verdict is *"the screen survives intact"*. The test asserts bytes in a
   **pipe**. No automated test attaches a terminal.
7. **UAT-15** — the scenario's verdict is *"the program has already finished before you type"*. The
   backing is a **textual assertion about which `process.*` names appear in one source file**. It is a
   good structural guard; it is not the behaviour.
8. **UAT-16** — six named commands, backed by a **randomised property** plus two structural rows.
   Sound as a class argument, silent on all six names.
9. **UAT-17** — the scenario's verdict is *"it fails outside the project folder"*. The backing is a
   **`package.json` key census**.
10. **UAT-5** — the scenario's verdict includes *"It is still White's move"*. The backing compares the
    board region only.

## What this map does NOT say

- **It does not say the product is wrong.** Every scenario the pack ran passed, and I re-ran the whole
  suite green on a tree proven byte-identical to `main`. The gaps above are gaps in the SUITE.
- **It is not a sign-off, and it is not a gate verdict.** No box in the pack's § 9 is ticked and none
  can be by an agent.
- **It cuts no ticket.** The recommendations are in the artifact note in this folder; the Orchestrator
  cuts.
