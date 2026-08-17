---
id: 20260817T224000Z-software-engineer-artifact-ref-branch-commit-files-tests-1d59f7ea
kind: artifact-ref
by: software-engineer
at: 2026-08-17T22:40:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - EPIC-003
  - ADR-0004
  - src/san.ts
  - src/san.parse.test.ts
  - src/san.test.ts
supersedes:
---

# The delivered artifact

- **Branch:** `grugops/abc032-parse-san`, from `main` @ `bf371d7`.
- **Commit:** `c98b1e220da733b32d89813eb2e1c7c26004580a` (`c98b1e2`) —
  `feat(san): grug teach san module read back what it write, no second table`.
- **Not merged, not pushed** (this repo has no remote). `main` is untouched. The Orchestrator
  re-runs the gate and holds the merge.

## Files

| file | change | lines |
|---|---|---|
| `src/san.ts` | **pure append** — `parseSan`, `SanParseResult`, `SanRejectReason` and four module-level helpers. One `git diff -U0` hunk, `@@ -148,0 +149,132 @@` | +132 / −0 |
| `src/san.parse.test.ts` | **new** — the `A1`–`A7` acceptance table, 22 tests | +~250 / −0 |
| `src/san.test.ts` | `A20`'s expected module surface + 4 comment lines (see the `decision` note) | +6 / −2 |

Nothing outside `src/san.ts` carries a production line, and no file under `src/` other than
`src/san.ts` and the test files above was touched — the ticket's own security firing threshold
(*"the security half fires if the diff touches any file under `src/` other than `src/san.ts` and
this ticket's test file(s), or if it adds a runtime dependency"*) does **not** fire. No dependency
was added or changed; `package.json` is untouched.

## The delivered surface

```ts
export type SanRejectReason = "unreadable" | "no-such-move";

export type SanParseResult =
  | { readonly outcome: "move"; readonly move: Move }
  | { readonly outcome: "ambiguous"; readonly candidates: readonly Move[] }
  | { readonly outcome: "rejected"; readonly reason: SanRejectReason };

export function parseSan(position: Position, text: string, legal?: readonly Move[]): SanParseResult;
```

`SanRejectReason`'s two members are deliberately the same two, spelled the same way, as
`CoordinateRejectReason` in `src/coordinate-move.ts` — `ABC-033` dispatches over one shape at the
input seam. `src/coordinate-move.ts` was read for its reject vocabulary and its reference-identity
convention (`G1`, the Orchestrator's `Ready for Dev` note) and **was not edited**; the two modules
share no code and neither imports the other.

## Tests added — `src/san.parse.test.ts`, 22 tests, all green

`A1` seven rows (six positions plus the 178-move corpus total) · `A2` three rows · `A3` two rows ·
`A4` three rows (one of them PINNING the ticket's defective FEN) · `A5` three rows · `A7` four
structural rows. `A6` is not a test row: it is measured on the delivered diff and on the suite, and
its figures are in the `A1`–`A7` verdict note.

## Not done here, deliberately

Board and traceability were left alone — `plans/board.md` is the Orchestrator's, and this hop was
told not to touch it. `In Development → In Review` has NOT been recorded by this role.
