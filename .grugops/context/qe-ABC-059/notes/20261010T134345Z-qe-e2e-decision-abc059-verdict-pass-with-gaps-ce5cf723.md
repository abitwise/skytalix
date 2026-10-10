---
id: 20261010T134345Z-qe-e2e-decision-abc059-verdict-pass-with-gaps-ce5cf723
kind: decision
by: qe-e2e
at: 2026-10-10T13:43:45Z
verified_by:
confidence: high
refs:
  - ABC-059
  - ABC-042
  - ABC-065
  - ABC-087
  - Q13
  - N8-LANE
  - N8-SPAWN
  - ADR-0035
  - src/cli.test.ts
  - 20261010T134345Z-qe-e2e-observation-abc059-mutants-cost-gates-4abec244
  - 20261010T134345Z-qe-e2e-observation-abc059-gap-register-80ff0753
  - 20261010T132830Z-software-engineer-decision-abc059-span-rule-command-read-floors-not-counts-084a3e0b
  - 20261010T132830Z-software-engineer-observation-abc059-gates-mutants-a1-a6-cost-abc087-53346fff
supersedes:
---

# `ABC-059` QE verdict: **PASS_WITH_GAPS** at `4230d3ab`. `A1`–`A6` MET; the span rule and the floors are endorsed; three LOW gaps and two INFO, none blocks

This note is hand-authored and unsealed. It is a `decision`, not a `finding`: no `§14-gate`
verdict exists on this install (`AGENTS.md`).
- Under review: `0b6e1c25..4230d3ab` on `grugops/ABC-059-runnability-guard`. The code commit is
  `14c940ff`.
- Every reading is QE's own, from fresh `git archive` trees and QE's own mutants
  (`…4abec244`). The engineer's notes were used as pointers only.

| | QE's reading | result |
|---|---|---|
| `A1` | QE's own count on head: **3** occurrences; (i) **0/3** spans with `UNKNOWN - verify`; (ii) **2/2** `npm run` spans name only `npm run chess`; the third span is the pointer `Dev / run".`. The block's verdict is `toEqual([])` over disagreeing spans, so (i) and (ii) are both live: 14 head mutants that break (i) or (ii) red the row | **MET** |
| `A2` | `Q13` with its line break reds the row at **8 positions**: head, tail, § Deployment posture, one-line, CRLF, as a list item, inside an HTML comment, and mid-sentence. All 8 are GREEN at base. The real pre-repair file (`bf685784~1`) reds the row at head and leaves `ABC-042`'s row green at base | **MET** |
| `A3` | The unmutated file is 67/67 green with **8** `UNKNOWN - verify` present. `ABC-087`'s `AGENTS.md` (`8330651d`) reads the same 3 / 0 / 2 / 8 and is 67/67 green | **MET** |
| `A4` | `chess` is not spelled in the added code, and `src/cli.ts` appears only in the docblock. Renaming the script alone reds the row (on its floor). Renaming the script and the docs together keeps the row green, so the comparison really is read from `package.json` | **MET** |
| `A5` | One insertion-only hunk `@@ -2137,0 +2138,76 @@`. `ABC-042`'s `A1` row (11 lines) and `ABC-065`'s `describe` (184 lines) hash identically at base and head. The new block is `describe("ABC-059 — …")` | **MET** |
| `A6` | `git diff --name-only 14c940ff~1 14c940ff` = `src/cli.test.ts`. 0 production paths, 0 added `child_process`/`spawn`/`exec`. Suite 51 files / 1584 green, skip **0** | **MET** |

## The engineer's decisions, judged

- **Span rule: `.`/`!`/`?` followed by a space or the end. ENDORSED.** It is a correct mechanical
  reading of `A1`'s "next sentence terminator".
  - It is strictly better than the BA/PM probe's any-`.` rule, which would cut at `src/cli.` and go
    blind.
  - `!`/`?` with a wrong command both red.
  - Its residual blind spots are `QE-059-a`: abbreviations, a question before the claim, and the
    claim in the next sentence. They belong to the definition `A1` chose, not to the code.
- **Floors (≥ 1 occurrence, ≥ 1 command span), not counts. ENDORSED.**
  - Violations are caught by the verdict, whatever the counts. The floors only stop a vacuous
    green, and they do real work: `pkg-rename-runner` reds on `spans naming npm run play: 0 ≥ 1`.
  - Pinning 3 / 2 would red on the next benign pointer the Scribe adds, and it would detect nothing
    the verdict misses.
- **Strict reading of `A1`(ii) (every `npm run <word>` must be the command). ACCEPTED, with a
  cost.** It catches "`npm run chess` or `npm run perft`", which the loose reading misses. It also
  reds a correct contrastive sentence (`QE-059-c` (2)). That fails loud, and it is not on the page
  today.
- **`runners` must have exactly one entry.** A second script running `src/cli.ts` reds the row
  (and `ABC-042` A10). That is fail-loud on an ambiguous "delivered command", which is right.

## Cost

`N8-LANE`, narrow set `src/cli.test.ts`, on `ADR-0035`'s **proposed** protocol. Both sets are
**admissible**:
- twin −0.02 % and −0.74 %, sign 4/8 both, R 0.086 s and 0.129 s;
- at load1 3.56 and 4.08;
- head − base **+0.047 s** and **−0.063 s** against 650 ms: **MET** in both.

The line is MET on a proposed protocol, and the ADR's acceptance decides whether it is the
catalog's. `N8_SPAWN` is 27, unchanged. The engineer's two inadmissible sets stand as recorded.

## Verdict and next move

**PASS_WITH_GAPS.** All six criteria are MET. The gaps (`…80ff0753`) are LOW or INFO and name the
limits of `A1`'s own wording. No test was added, and the branch's code is unchanged by QE.

Recommend leaving `In Review`; the board move is the Orchestrator's. Security/NFR's triggers on
the page are `N8-LANE` (now with an admissible reading) and `N8-SPAWN` (unchanged). The page says
the UAT waiver applies at 0 production lines, and that is measured at 0.
