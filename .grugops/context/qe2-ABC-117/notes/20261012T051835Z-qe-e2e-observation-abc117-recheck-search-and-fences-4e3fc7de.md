---
id: 20261012T051835Z-qe-e2e-observation-abc117-recheck-search-and-fences-4e3fc7de
kind: observation
by: qe-e2e
task: qe2-ABC-117
at: 2026-10-12T05:18:35Z
verified_by:
confidence: medium
refs:
  - ABC-117
  - ABC-115
  - A4
  - A5
  - A6
  - A7
  - S10
  - S11
  - QE-117-a
  - QE-117-c
  - 20260821T051000Z-qe-e2e-observation-i-audited-the-guard-by-mutating-the-guard-and-the-trap-points-the-other-way-8d7cad3b
  - 20261012T051500Z-software-engineer-observation-abc117-content-search-finds-no-claim-b-site-beyond-s1-s11-9016b077
supersedes:
---

# QE re-check `ABC-117`: the shapes, QE's own content search, and the fences against `3537fe48`

## S10, S11, page correction and QE-117-c (subtask items 2–4)

- **S10 is appended at the END.** At `7bf4c61e`, `plans/traceability.md` has 1035 lines and S10 is
  the last one. At the tip, the base file (1032 lines) is a byte prefix of the tip file (1036 lines).
  The `ABC-115` row is `:676` at base and at tip, and `cmp` says the two copies are **equal**
  (45252 B). The table has 11 pipes outside backticks, the same as every neighbouring row. The row
  names the `ABC-115` row and quotes the exact clause (*"the non-`EPIPE` path still exits `1` (=
  `USAGE_EXIT_CODE`)"*), which `grep -c` finds once in the original row. The row re-opens nothing.
- **S11.** One new `observation`, `…3429abce`, with an empty `supersedes`. Its `refs` carry the full
  ids of `…0391186e` and `…92514474`. `git diff --numstat 3537fe48..86bf76b5 -- .grugops/context`
  shows 13 files, all `N 0`. `--diff-filter=MDR` is empty, so only added files.
- **Page.** On `ABC-117`'s page, `/usr/bin/diff` of `## Out of scope` (base vs tip) shows only lines
  14-18 added and nothing removed. The original bullet is kept. The dated correction is TRUE:
  the row carries the CLAIM-B clause, the clause the cut quoted (*"flips from exit `1` + 1542 bytes
  of stack to SILENT exit `0`"*) is present in the same row, S10 is at the END, and the row is
  unedited.
- **QE-117-c.** The `A10` comment now reads *"a collision `ABC-115` neither fixes nor endorses and
  which `ABC-115`'s `## Residual ruling` accepts"*. That heading exists at `ABC-115`'s page `:249`.
  The delta under `src/` is +3/−3, all `//`, and only the referent changed ("this ticket" and "its"
  became `ABC-115`). The wrap moved "A". Nothing new is said. **Resolved.**

## Content search of QE's own design (item 5)

The method differs from the Engineer's: theirs was `USAGE_EXIT_CODE` file co-occurrence plus token
lists. Over all 5598 tracked `md`/`ts`/`json`/`txt`/`jsonl` files I ran two passes.

1. **Proximity pass.** A path term (`EBADF|ENOSPC|EIO|non-EPIPE|unwritable|read-only fd|1</dev/null|other errno|failed write`)
   within ±3 lines of a code term (`USAGE_EXIT|usage code/exit/status|refusal code/exit/status|reserved for|same code as|collid|collision|as if refused`).
   This gave 62 hits.
2. **Predication pass.** `is`/`=`/`which is`/`means`/`as`/`being` followed by `USAGE_EXIT_CODE`,
   `USAGE_EXIT_CODE` `was`/`gets` `assigned`/`set`, and `exits with the usage/refusal code`, each
   tested across a line join. This gave 61 hits.

**Result: no CLAIM-B site beyond S1–S11.** Each hit is S1–S11, one of their corrections, a quotation
or negation of the clause, one of the five named CLAIM-A sites, a mutant diff, or a `src/cli.ts`
probe listing. Two lines are not named in `…9016b077`, and both are value statements, not sites:
trace `:117` (an `_Updated:` header: *"the non-`EPIPE` exit-`1` collision recorded as a KNOWINGLY
ACCEPTED residual"*) and `ABC-115` page `:449` (A10's criterion: *"the delivered status here is `1`,
a collision this ticket neither fixes nor endorses"*). Neither says the `1` was assigned, and `:449`
is a closed ticket's criterion. Board `:873`'s first clause (*"`1` is `USAGE_EXIT_CODE`
(`src/cli.ts:90`) … the collision is real today"*) concerns the pre-`ABC-115` `EPIPE` path. It is
nearly identical to CLAIM-A `ABC-115:62` and is CLAIM-A-register. **I agree with the Engineer and
leave it fenced.** Limit: regex plus reading in context. A paraphrase that avoids every token would
be missed, so confidence is `medium`.

**`…8d7cad3b:80`: NOT a site. QE agrees with `…9016b077`.** *"A future fix of the exit-code
collision leaves this row green and needs no re-cut"* uses "collision" in the value sense, which is
TRUE (1 == 1). It makes no mechanism claim. It is also TRUE about `A10`: routing to `70` writes the
`internal error` line, so the status is non-zero and stderr non-empty. Its shape is S2's (true, and
silent on `try`/`catch`). S2 was in scope only because it is a clause of the acceptance note that
`A2` supersedes. The fact that note omits is now carried by `…0081a95a` (ii).

## Fences against `3537fe48` (item 6)

- **A4:** board +2/−0, `ABC-115` page +14/−0. `8e679aed..86bf76b5` touches neither (numstat empty).
- **A5:** `ADR-0016` numstat empty. 0 removed lines on the `ABC-115` page. The only
  `USAGE_EXIT_CODE` lines touched are inside the added block `+313,14`.
- **A6:** `src/` lists only `src/cli.test.ts`. Non-test `src/` numstat is empty. 0 non-`//` lines
  changed. `nfr-catalog.md` and `AGENTS.md` numstat are empty. The NFR 8-row sha256 is
  `c74e742698b59da90b67e101942f20406a20c8aee54da7f518df39da9eae0d3b` at base **and** tip, on 8 lines.
- **A7:** `npm test` at base (a detached temporary worktree, since removed) **56 files / 1741 tests
  / 0 pending / 0 todo**, exit 0, `success: true`. The tip gives the same 56 / 1741 / 0 / 0, exit 0,
  `success: true`. The sha256 of the `const N8_SPAWN` line (n=1), the `spawned` lines (n=13) and the
  `Object.keys(CHILDREN)` line (n=1) is equal at base and tip. `it(`/`expect(` count is 393 at both.
  0 diff lines touch `N8_SPAWN|spawned|CHILDREN|childOf|spawn`. **`T2` NOT FIRED:** the diff is
  comment-only, so no child's argv, stdin script, substitution hook or settle changes. No timing
  reading was taken, because a parallel QE hop was running.
