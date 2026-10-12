---
id: 20261012T070924Z-ba-pm-observation-abc105-amend-re-measurements-sweep-cutover-malformed-94f479e1
kind: observation
by: ba-pm
task: bapm-amend-ABC-105
at: 2026-10-12T07:09:24Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A4
  - A6
  - QE-105-a
  - QE-105-b
  - QE-105-c
  - QE-105-e
  - QE-105-f
  - QE-105-k
  - plans/tickets/ABC-105-qe-hop-detector.md
  - 20261012T065553Z-qe-e2e-observation-abc105-recheck-sweep-table-and-data-premises-298a669e
supersedes:
---

# `ABC-105` amendment: what I re-measured, and the commands

I re-measured only the numbers the amendment changes or adds. Everything else on the page is cited from QE's
notes `…72ae8565` and `…298a669e`. This is a hand-authored note with no stamp, per `AGENTS.md`. No test suite was
run and no timing was read.

**Instrument.** I used a scratch script outside the repo, `sweep105b.mjs` in the session scratchpad. It uses
`node:` builtins only, was not committed, and is not the deliverable. It applies QE's rule as described in
`…298a669e`: the same `String.split` front matter, the same A5 regex `/(?<![a-z0-9])abc-?(\d+)(?!\d)/gi`, and the
same line-leading `^- \[(ABC-\d+)\]` parse of `## Done`. On top of that it does three things:
- it reads condition 3 both ways, as an exact element `=== 'ABC-xxx'` and as a token match under A5 on any refs element;
- it counts malformed front matter under the page's new `A6` definition;
- it takes the cutover set from a board file.

Runs: `node sweep105b.mjs <root> <cutover-board>`, with `<root>` being the worktree (`a37a4e12`) or a `git archive
<sha> .grugops/context plans/board.md | tar -x` copy, and the cutover board coming from `git show
9998a544:plans/board.md`.

## Cutover set (QE-105-a)

- `git log -1 9998a544`: "docs(governance): grug write down that every ticket pass through QE", 2026-08-17 21:34.
- `git show 9998a544:plans/board.md` parsed gives **38 ids, 304 B** (`wc -l`, `wc -c` of the id lines). This
  confirms QE's reading.
- `e23c8484` (23:00) is "grug close ABC-031 and ABC-076 on the owner word", which is the 40-id reading.
  `e908b8e6` (23:05) is the cut.
- All 38 ids are still in `Done` at `a37a4e12`: `comm -23` gives 0.

## Sweep under the amended rule (QE-105-b, -c)

| tree | Done | pre-cutover | qe-e2e | substitute | findings (token) | findings (exact) |
|---|---|---|---|---|---|---|
| `21980135` | 131 | 38 | **76** | 2 (ABC-072, ABC-147) | **15** | 16 (+ABC-076) |
| `a37a4e12` | 132 | 38 | **77** | 2 | **15** | 16 (+ABC-076) |

- **QE's suggested expected line "131 / 38 / 75 / 2 / 15" does not sum.** 75 is QE's exact-refs count, and 38 +
  75 + 2 + 15 = 130. Under the token reading `ABC-076` is covered, which gives 76. The page carries 76.
- The token findings at both trees are the same 15 ids: 038 044 060 070 073 074 085 092 100 108 110 111 112 113 150.
  They match QE's classified list less `ABC-076`.
- The tip adds `ABC-153` (moved to `Done` at `506f5799`, after QE's read). It is covered by
  `qe-ABC-153/20261012T065549Z-qe-e2e-decision-abc153-verdict-6b2eab82.md`.
- **QE-105-g reproduces at the tip.** `ABC-105` reads as covered by
  `qe-recheck-ABC-105/…-72ae8565` under the four conditions. At `21980135` it was not covered, because that note
  had not merged yet.

## "20 of 38" (QE-105-k)

At the cut tree `e908b8e6`, with an empty cutover set, the four-condition rule flags **30 of 38** under both the
exact and the token reading. That confirms QE's 30. The page now reads "~~20~~ 30". The 1292 notes there include
the cut's own 4.

## Malformed front matter (QE-105-e)

Under the page's new definition (no opening `---`; no closing `---`; or a non-blank block line that is neither
`key:` / `key: value` nor an indented `- item` after a key), the counts are:
- `21980135`: **0 of 2607** notes are malformed (0 / 0 / 0 lines);
- `a37a4e12`: **0 of 2618**;
- `e908b8e6`: **0 of 1292**.

Missing keys, which the definition does not count as malformed: at `a37a4e12`, 22 notes have no `kind` and 30 have
no `by`. 7 notes use an inline `refs: [...]`. A shell scan found 0 notes with a column-0 `- ` list item inside the
front matter.

## Other readings

- `wc -c AGENTS.md` = **24,545 B** at `a37a4e12`, last touched by `e1f23b8d`. `git diff --stat 21980135 a37a4e12 --
  AGENTS.md` is empty, so QE's 31 B headroom holds.
- Board § Conventions, line 1015: `XS=1, S=2, M=3, L=5, XL=8` (QE-105-m).
- `memory-bank/40-contributing.md` is 17 lines / 412 B and has a `## Conventions` heading. That is where `A7`'s
  paragraph now goes. `00-index.md` already describes this page as "the project conventions", so no index edit is
  needed.
- Context folders matching `recheck|prebuild`: `qe-recheck-ABC-105`, `security-nfr-ABC-042-recheck`, and
  `-recheck2`. A folder-form exclusion would reach one QE folder today. That is part of why `QE-105-g` is handled as
  a named ceiling and not as a rule (see the decision note).

## Page history moved off the ticket (QE-105-o)

The page's 2026-08-17 DoR table and its 2026-10-10, 2026-10-11 and QE re-check sections were condensed into a
§ History of pointers. The full prior text is `git show a37a4e12:plans/tickets/ABC-105-qe-hop-detector.md`, and
each section's notes are named there. The page went from 374 to 328 lines.
