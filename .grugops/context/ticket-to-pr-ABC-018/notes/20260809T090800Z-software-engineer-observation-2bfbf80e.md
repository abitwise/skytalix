---
id: 20260809T090800Z-software-engineer-observation-2bfbf80e
kind: observation
by: software-engineer
at: 2026-08-09T09:08:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-015
  - EPIC-002
  - EPIC-006
  - src/frame.ts
  - src/frame.test.ts
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - 20260809T084500Z-ba-pm-decision-53b4877d
supersedes: 
---

# 18 mutants, all 18 killed — and the two that survived the suite as first written, which are a gap in the CRITERIA

Every mutant was applied to `src/frame.ts`, the suite run, and the file restored. The tree is
byte-identical after the campaign: `md5` **`bb827f52fe537817e40020a29dfa0e6d`** before and after.
Reported because a suite that has never been shown to fail is not evidence that it can.

## The mutants the corrections were written for all die

| Mutant | Killed by |
|---|---|
| `>` where the rule says `≥` (defect 3's first named mutant) | 1 test |
| a trailing newline after the frame's last row (defect 3's second) | 2 tests |
| the strategy **re-decided on every write** (defect 5's live mutant) | 1 test |
| `N` invented rather than counted from the input (defect 1) | 1 test |
| the reserved prompt row not reserved (defect 2) | 11 tests |

And the rest: no padding to `W` (4), `W` taken over the message rows (2), an item split across rows
(1), the marker emitted when nothing is hidden (2), a per-row erase-to-end-of-line instead of one
erase-to-end-of-screen (4), a cursor sequence in append mode (3), the C0 strip removed (2), the ASCII
strip removed (1), the message region grown to fit (8), two erase sequences (3).

**The screen model is what kills three of those.** A byte assertion cannot see a stale character; the
model can, because it applies the emitted sequences to a grid, scrolls when the cursor passes the
last row, defers the right-margin wrap the way a real terminal does, and **throws** on an escape
sequence it does not implement rather than ignoring it.

## Two mutants SURVIVED the suite as first written, and the SUITE was fixed rather than the record

Both are the same shape, and it is `ABC-015`'s QE finding a second time on the same class of gap:

- **an absent row count read as unlimited** (`sink.rows ?? Infinity`), and
- **an absent `isTTY` read as a terminal** (`sink.isTTY !== false`).

**Every one of the twelve acceptance criteria names a row count** — 24/23, 23/23, 10/23 — and the
non-TTY criterion says only *"stdout is not a TTY"*. **Node leaves both `isTTY` and `rows`
`undefined` on a stream that is not a terminal**, which is the shape `EPIC-006`'s pipe-driven
end-to-end test will present. So a writer that misreads an absent signal passes **all twelve
criteria** and fails in the one mode the epic's `4c` exists for.

The suite now writes to three sinks with missing signals (no signals at all; `isTTY` with no `rows`;
`rows` with no `isTTY`) and both mutants die. **The CRITERIA still do not cover it.** That is a gap in
the ticket, not in the delivered code, and it is handed to QE and BA/PM rather than closed here —
the same disposition `ABC-015` recorded for the same class, and the second time this board has seen
an acceptance set written entirely over signals that agree.

**Coverage found the first of the two, not inspection:** `src/frame.ts` sat at 97.87% branch with one
uncovered branch — the `?? 0` fallback — which is exactly the absent-signal path. Line coverage was
already 100%. Both are now at 100%, and the point worth keeping is that the missing branch was the
missing criterion.
