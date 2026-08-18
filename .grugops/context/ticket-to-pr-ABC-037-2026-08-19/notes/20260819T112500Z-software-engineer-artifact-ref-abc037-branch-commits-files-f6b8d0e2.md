---
id: 20260819T112500Z-software-engineer-artifact-ref-abc037-branch-commits-files-f6b8d0e2
kind: artifact-ref
by: software-engineer
at: 2026-08-19T12:25:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - src/line-input.ts
  - src/line-input.test.ts
  - plans/tickets/ABC-037-the-real-prompt-input-seam.md
supersedes:
---

# What was produced, and where

## Branch

`grugops/abc037-the-real-prompt`, cut from `main` at **`e9a61ae`**.

The subtask brief names `4c28f89` as the base. `e9a61ae` is its direct descendant and adds board and
queue files only — no `src/` change — so the branch was taken from the tip. Every measurement in
these notes is against `e9a61ae`, and every anchor the orchestrator measured at `4c28f89` reproduced
unchanged here.

## Commits, in order

| commit | what |
|---|---|
| `69bb1e3` | `feat(line-input)` — the module, 232 lines, plus the hand-taken queue claim |
| `be86350` | `test(line-input)` — the suite: eight criteria, three security bars, the three-layer `A6` guard |
| `f040178` | `test(line-input)` — the prompt-precedes-the-wait row (mutant `M14`) |
| `0eff5ea` | `test(line-input)` — the three survivor repairs, and the deletion of the dead memory guard |
| **`fa21662`** | **`docs(ticket)` — the stale anchors. SEPARATE ON PURPOSE: `A8` is measured against the delivery diff and this must not land in it** |
| `…` | `docs(trace)` — the `ABC-037` row, three cells and a header paragraph |
| `…` | `docs(agents)` — the `INPUT_DEEP` lane and its trap |
| `…` | `test(line-input)` — the `node:` token, closing the side-effect-import hole (`M17`) |

## Files

- **`src/line-input.ts`** — new, 232 lines. `createLineInputSeam`, `PROMPT`, `MAX_LINE_LENGTH`,
  `LINE_TOO_LONG_MESSAGES`, `LineSource`, `PromptOutput`, `LineInputOptions`.
- **`src/line-input.test.ts`** — new. 23 default-lane tests, 26 under `INPUT_DEEP=1`.
- **`plans/tickets/ABC-037-the-real-prompt-input-seam.md`** — four anchors corrected, nothing else.
  The DoR table is untouched.
- **`plans/traceability.md`** — the `ABC-037` row, `Code` / `Tests` / `Status`, plus one header
  paragraph. 10 columns before and after, verified by re-splitting the row from disk (12 raw
  `|`-fields).
- **`AGENTS.md`** — one command slot added under `### Test`, with the figure that was RUN.

## The anchor commit, spelled out

`fa21662` corrects four anchors on the ticket page:

```
InputSeam            src/turn-loop.ts:127 -> :135    (+8 drift)
the eof arm          src/turn-loop.ts:123 -> :131    (the union head is :125)
INPUT_ENDED_NOTICE   src/turn-loop.ts:168 -> :176    (+8 drift)
the frame sanitizer  src/frame.ts:202     -> :123    (the 79-line drift ABC-033 also carried)
```

Three are the orchestrator's. **The fourth is mine and it is flagged rather than slipped in:** that
note says of the `eof` arm "re-read the union at `:125`; do not cite `:123`", so leaving a
known-wrong `:123` on the page was not an option. Measured: the `eof` arm is at `:131`, inside the
`PromptOutcome` union whose head is `:125`. `PromptOutcome` `:125` and `PROMPT_ROWS`
`src/frame.ts:53` were re-measured as exact and are untouched.

## Not done, deliberately

Not merged. Not deployed. **No board column moved** — `In Development` → `In Review` is this role's
transition in the kit, and the subtask brief withholds it on this hop; it is the Orchestrator's to
write. The **DoR table is untouched**: the page still reads 9/10 ⚠️×2 and re-scoring is BA/PM's pen.
No QE hop has run — `ABC-037` may not reach `Done` without one.
