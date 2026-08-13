---
id: 20260813T223012Z-software-engineer-artifact-ref-the-a4fix-branch-and-exactly-what-is-on-it-34803f5c
kind: artifact-ref
by: software-engineer
at: 2026-08-13T22:30:12Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.test.ts
  - plans/traceability.md
  - .grugops/queue/claimed/ticket-to-pr-ABC-041-a4fix/claim.md
supersedes: 
---

# The branch, its one changed file, and where the correction lives.

**Branch:** `grugops/ticket-to-pr-ABC-041-a4fix`, in the worktree `../cli-chess-dev041b`, off BA/PM's
tip **`8dbe2b4`** (`docs(ticket): grug fix what A4 SAY, because the code already RIGHT`). No git
remote, so nothing is pushed and no PR is opened — `pr` autonomy means "branch + gate" here
(`AGENTS.md` § Branching model, Config trap). **Not merged. Not deployed.**

## The whole diff against the base

```
git diff --numstat 8dbe2b4
48   28   src/render-seam.test.ts
```

**One file. No production file, no ticket page, no board.** `src/render-seam.ts` is absent from the
diff (md5 `bc18d0830b84adaff123affce66561c5`, the base value).

What moved inside that file, all of it comment text except one expression and one title:

- the `A4` row's `const width = (frame[0] as string).length` → a `Math.max` over the rows of
  `renderBoard` + `renderStatusPanel` + `renderHistory`;
- `it("A4 (purpose) — …")` → `it("A11 — the merged four are each CALLED exactly once, never
  re-implemented", …)`, assertions unchanged;
- the file docblock's "STRICTLY STRONGER" paragraph, and three stale in-row comments, replaced by
  what was measured.

Test count unchanged: **12 in this file, 828 across 29 files, skip 0.**

## Notes recorded at this hop

Five, under `.grugops/context/ticket-to-pr-ABC-041-a4fix/notes/`:

| kind | subject |
|---|---|
| `observation` | **the supersession** — `499428bf`, `supersedes:` the first hop's `…-1d067874` |
| `observation` | `X2` rebuilt, the fix watched red, and the module byte-restored — `da3c6d05` |
| `decision` | four instrument choices, including the gate row I did not delete — `d5f95e4b` |
| `observation` | every mandatory gate plus test-integrity, with numbers — `158bbc7c` |
| `artifact-ref` | this note — `34803f5c` |

**No `finding` was recorded and no `§14-gate#<id>` stamp was invented** (`AGENTS.md` § Role /
workflow files — the substrate note, read rather than re-derived).

## Queue

Claimed **by hand** in the MAIN repo:
`.grugops/queue/claimed/ticket-to-pr-ABC-041-a4fix/` created with a **bare** `mkdir` (no `-p`) after
`mkdir -p` on the parent, per the substrate note; `claim.md` written inside it. The
`pending -> done` move is **the Orchestrator's** — `.grugops/queue/pending/ticket-to-pr-ABC-041-a4fix.md`
is committed on `main`, which is ahead of this branch's base, and this hop writes only its own branch.

## Owed to whoever comes next

- **QE re-gates narrowly and clears its own block.** The `BLOCKED_NEEDS_FIX` on `A4` is answered here;
  lifting it is QE's, not mine.
- **The `A4 (width)` / `A4` overlap** is flagged in the `decision` note and is QE's to dispose of.
- **`plans/board.md` was not opened.** `ABC-041` stays `In Review`.
- **FLAGGED, NOT FIXED — four rows in `plans/traceability.md` are not at 10 columns.** `ABC-009` and
  `ABC-011` / `ABC-015` / `ABC-019` split into 12 / 11 / 11 / 11 cells. **Verified pre-existing at the
  base `8dbe2b4`, so none of it is this branch's**, and `ABC-041`'s row is at 10 before and after this
  hop's edit (asserted by re-splitting, not by eye). Repairing another hop's rows is not this
  subtask's, and it sits inside `ABC-052`'s own subject (trace currency).
