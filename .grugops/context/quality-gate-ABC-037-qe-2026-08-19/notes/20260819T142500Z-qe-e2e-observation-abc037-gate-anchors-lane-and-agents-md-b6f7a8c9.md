---
id: 20260819T142500Z-qe-e2e-observation-abc037-gate-anchors-lane-and-agents-md-b6f7a8c9
kind: observation
by: qe-e2e
at: 2026-08-19T14:25:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-108
  - NFR-008
  - N8-LANE
  - AGENTS.md
  - plans/traceability.md
supersedes:
---

# The gate re-run in full, the four anchors verified, the lane cost reproduced, and `AGENTS.md` judged

## Gate — every step run by me, on the QE branch off the delivery tip

`ls -a .claude/` shows `settings.json` and `skills/` and **no `worktrees/` directory**, so the
recorded `npm test` and `npm run lint` commands are correct here and were run AS RECORDED. Node
v24.12.0, npm 11.7.0.

| step | engineer | **QE, re-run** |
|---|---|---|
| `npm test` | 39 files / 1175 tests, 0 failed | **39 files / 1175 tests, 0 failed** ✔ (2.34 s wall) |
| skip count (`--reporter=json`, `jq '.numPendingTests + .numTodoTests'`) | 0 | **0** ✔ |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` exit 0 | **`No findings.` exit 0** ✔ |
| `npm run lint` | exit 0, 70 files | **exit 0, 70 files** ✔ |
| `npm run typecheck` | exit 0 | **exit 0** ✔ |
| `npm run build` | exit 0 | **exit 0** ✔ |
| `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | 32/32, 37.62 s | **32/32, 38.49 s** ✔ |
| `INPUT_DEEP=1 npx vitest run src/line-input.test.ts` | 26 passed | **26 passed**, 0.24 s ✔ |
| default lane, that file alone | 23 | **23** ✔ |
| `A8` from git | 232/0 + 771/0, nothing else under `src/` | **identical**, both fenced files byte-identical by blob hash ✔ |

**Every published figure reproduced. None moved.** The gate was re-run once more at the end of the
mutation work, after the tree was restored, and was green again.

## The four stale anchors — all verified, including the fourth

The brief asked me to verify the one the engineer corrected beyond the Orchestrator's list. All four,
read from the files at the tip:

| anchor | cited | **measured** |
|---|---|---|
| `InputSeam` | `src/turn-loop.ts:135` | **`:135`** — `export type InputSeam = (history: GameHistory) => Promise<PromptOutcome>;` ✔ |
| **the `eof` arm** | `src/turn-loop.ts:131` (was `:123`) | **`:131`** — `| { readonly kind: "eof" }`, inside the `PromptOutcome` union whose head is **`:125`** ✔ |
| `INPUT_ENDED_NOTICE` | `src/turn-loop.ts:176` | **`:176`** — `export const INPUT_ENDED_NOTICE = "input ended";` ✔ |
| the frame sanitizer | `src/frame.ts:123` | **`:123`** — `function sanitize(text: string, mode: GlyphMode): string {` ✔ |

**The fourth is correct and the correction was necessary**: `src/turn-loop.ts:123` is a comment line
(`* to do it, which is the one implementation NFR-002 prices and forbids.`), so the old citation
pointed at prose. Flagging it rather than slipping it in was the right call.

Three more the page cites, checked while I was there and all exact: `PROMPT_ROWS = 1` at
`src/frame.ts:53`; `resolvePromptLine` at `src/command-input.ts:129`; `makeMove`/`unmakeMove` on the
live object at `src/legal.ts:47-51`; and `src/turn-loop.ts:45-47`'s "the stubs are not here". **Seven
anchors checked, seven exact.**

## Lane cost — `N8-LANE` REPORTED, **NOT RULED, and NOT GRANTED**

Reproduced independently from a different tree, paired and interleaved, **n = 4**, the two new files
moved out and back for the paired half of each round, user+sys around `npm test`:

```
round 0  WITH 14.43  WITHOUT 13.83        round 2  WITH 14.01  WITHOUT 13.83
round 1  WITH 14.21  WITHOUT 14.00        round 3  WITH 14.22  WITHOUT 13.98
```

- Median lane: **13.91 s CPU WITHOUT / 14.22 s WITH**. Wall: **2.65 s / 2.85 s**.
- Median paired delta **+0.225 s CPU**, **sign 4/4 positive** — the delta is real, not noise.
- The engineer measured +0.185 s over n = 7 with a higher absolute baseline (14.51/14.67). My
  absolute numbers are lower and my delta slightly higher; **the conclusion is identical and that is
  the part that reproduces.**

**`NFR-008`'s 13 s CPU clause is breached WITHOUT this ticket's files — 13.91 s.** That is
`ABC-108`'s finding, now measured from a third independent tree. The 3 s wall clause is intact at
2.85 s with the file, 0.15 s of headroom.

**I do not rule `N8-LANE` and I do not grant it.** The engineer did not claim it and was right not
to: a 650 ms slice of a budget that is already spent is not a slice. This is Security/NFR's bar and
`ABC-108`'s ticket. Reported, routed, not decided.

## `AGENTS.md` — is the content accurate and runnable?

Whether it should have been the Scribe's pen is the Orchestrator's to route. My half is the content,
and it splits:

**The command slot is accurate and runnable.** I ran every claim in it:

- `INPUT_DEEP=1 npx vitest run src/line-input.test.ts` — **exit 0, 26 passed**. ✔
- "26 passed (23 in the default lane)" — **23** in the default lane. ✔
- "0.24 s" — I measured 0.23–0.25 s across runs. ✔
- "NOT DEFINED rather than skipped, so the gate's skip count stays 0" — **skip count 0**, confirmed
  by the gate's own capture command. ✔ Same shape as `PERFT_DEEP`/`SEARCH_DEEP`/`ENGINE_DEEP`. ✔
- "+0.185 s CPU (paired, interleaved, n=7, 7/7 positive sign)" — reproduced in kind: **+0.225 s,
  4/4 positive**. ✔
- "`ABC-108` has the default lane at or over `NFR-008`'s 13 s CPU clause, so this ticket did not
  claim `N8-LANE`" — reproduced: **13.91 s without the change**. ✔
- "Run it after any change to `src/line-input.ts`" — **correct, and now justified**: two of my
  mutants (`M-QE2`, `M-QE3`) are killed by this lane and by nothing in the default one.

**The TRAP paragraph is where it goes wrong, and it is the consequential half.** It reads:

> a build retaining a 16,777,216-character line reports 0.01 MiB of heapUsed growth, so that
> assertion could never fire. The retention bound is a construction argument in absorb(), not a test.

- The **measurement** is right — I reproduced 0.11 MiB vs 0.10 MiB.
- The **mechanism** stated alongside it in the ledger note and the test header ("`heapUsed` does not
  account a V8 cons-string's referents") is **not what I measured**: `heapUsed` reports a *flattened*
  16 MiB string as **16.00 MiB**, exactly. The retained leaves here are external string data.
- The **conclusion** — that the bound cannot be a test — is therefore **false**, and this paragraph
  is precisely what would stop the next engineer finding that out. A 20-line guard on
  `process.memoryUsage().external` under `--expose-gc` kills `M6c` at 36 ms with a 32:1 margin.

**Recommendation:** the slot stays; the trap needs amending. Its purpose — stop somebody adding the
dead `heapUsed` row back — is right and should survive the amendment. Suggested substance is in the
`M6c` note. Whose pen: the Orchestrator's to route.

## `plans/traceability.md`

Row content is accurate and matches what I measured — `232/0` + `771/0`, the blob hashes, the gate
figures, `N8-LANE` not claimed, "19 named mutants, 16 killed" (correct after `M17` landed). Structure
is intact: 10 columns, no raw pipe in a cell.

**One drift, INFO:** the `_Updated: 2026-08-19_` **header paragraph** still says *"Three of
**eighteen** mutants survived"* while the row it introduces says nineteen. The engineer corrected the
`769` → `771` line count at `02e5c38` and did not carry the mutant count with it. Cosmetic; recorded
so the next reader does not treat it as two different ledgers.
