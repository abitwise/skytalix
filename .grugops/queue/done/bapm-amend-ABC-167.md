---
done_at: 2026-10-18T20:26:00Z
branch: grugops/bapm-amend-ABC-167 (worktree ../wt-bapm-amend-ABC-167, from main 86e8be75)
commit: df3ac9db
result: AMENDED (records only); DoR 10/10; size S
---

BA/PM amended ABC-167's page for QE-167-a..h and SE choices 1–5. **Records only.** The commit touches the ticket page
and `.grugops/context/bapm-amend-ABC-167/` (two notes and a probe). Nothing under `src/`, `plans/board.md`,
`plans/traceability.md` or ADR-0044 was touched, and neither `../wt-ABC-167` nor `../wt-ABC-146` was. The branch
merges clean against main `c3388dbe`. Nothing was pushed or merged. No test, vitest, build or timing run was made.

**The notes are hand-authored and unsealed** (this install has no `context-io.ts`):
- the decision, `…7d2e41b9`;
- the artifact-ref, `…3b9c5a60`.

**The figures.** Every expected figure was read on tip `4dbbfbd8`'s `src/`, copied to the scratchpad, on
`virtualClock`. The scripts and their output are in `probe/rows.ts`, `probe/rows2.ts` and `probe/rows.out`.

## Rulings
| gap | ruling | authority |
|---|---|---|
| QE-167-b MEDIUM | `A5-b1`..`b5`: increment, the other side's increment, `movestogo`, and `movetime` beating the clock in both token orders. Each is on step 1, with `G ≤ time ≤ G + 2` | D4.1 |
| QE-167-c LOW | `A5-c1` pins the 50 ms overhead (G 50; overhead 0 gives 100). The 1 ms row is kept. M09/M10 are accepted as equivalent | D4.1 |
| QE-167-a MEDIUM | `A4-a1`/`a2`: the printable check runs on two echoing inputs, and each asserts the ESC-dropped echo | D3 + `printableOf` |
| QE-167-d LOW | `A6-d1`: `go ponder` holds (time 3 000), and `ponderhit` releases once | D4.1, D4.3 |
| QE-167-e LOW | A held `bestmove` is never dropped. `stop`, `ponderhit`, `go`, `position`, `ucinewgame` and `quit` write it first; `isready` and ignored lines keep it held (`A6-e1`..`e5`) | e1: D5. **e2, e3, e4: owner may overrule** |
| QE-167-f LOW / choice 2 | The time-token value rules are ratified, and **a keyword is never a value** (`A7-f1`..`f3`) | **owner may overrule** |
| choice 4 | `searchmoves` consumes up to the next keyword (`A7-h1`) | **owner may overrule** |
| choice 5 | `nps = round(N × 1000 / max(1, T))` (`A3-h1`) | **owner may overrule** |
| choice 1 | A new session starts at the start position (`A9-h1`) | D3 (implicit) |
| QE-167-h (A8) | The constants-only row counts for nothing. No change is required | — |
| QE-167-g LOW | `A11-g1`: the banned-module check matches every import form (closes M47–M51). Bracket access to globals (M40, M42) goes to the `In Security/NFR` hop, with no follow-up ticket unless that hop asks for one | — |

## Rows the SE fix hop must make green
- **These need a code change, because the tip fails them:**
  - `A6-e2`: a held `bestmove` is written at `position`;
  - `A6-e3`: the same at `ucinewgame`;
  - `A6-e4`: the same at `quit`;
  - `A7-f1`: the valueless-keyword boundary.
- **These are test rows only, because the tip passes them:**
  - `A3-h1`;
  - `A4-a1`, `A4-a2`;
  - `A5-b1`–`b5`, `A5-c1`;
  - `A6-d1`, `A6-e1`, `A6-e5`;
  - `A7-f2`, `A7-f3`, `A7-h1`;
  - `A9-h1`;
  - `A11-g1`, which widens the test's import regex.

The exact text of each row is on the page, under each criterion, marked *Amended 2026-10-18*.

## Trace row (for the Orchestrator to append; BA/PM did not edit `plans/traceability.md`)
| ABC-167 (bapm-amend-ABC-167) | EPIC-007 / ADR-0044 D3–D5, D12 | `grugops/bapm-amend-ABC-167` @ `df3ac9db` (from `main` `86e8be75`) | ticket page only | none run (records only); figures read on `4dbbfbd8` via the scratch probe `probe/rows.out` | AMENDED for QE-167-a..h: 21 new rows (A3-h1, A4-a1/a2, A5-b1..b5/c1, A6-d1/e1..e5, A7-f1..f3/h1, A9-h1, A11-g1); tip fails A6-e2/e3/e4 and A7-f1 (SE fix hop); owner may overrule A3-h1, A6-e2/e3/e4, A7 time tokens, A7-h1; QE-167-g bracket access → In Security/NFR; DoR 10/10, size S |
