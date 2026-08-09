---
id: 20260809T164500Z-ba-pm-artifact-ref-a4d903f1
kind: artifact-ref
by: ba-pm
at: 2026-08-09T16:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-023
  - A13
  - EPIC-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/tickets/ABC-023-castling-precondition-net-hardening.md
  - plans/board.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-009-bapm5
supersedes: 
---

# Artifacts of the fifth BA/PM hop — four files, one of them new, and nothing under `src/`

**Edited**

- `plans/tickets/ABC-009-legalmoves-position-mutation.md` — `## Acceptance` and `## Definition of
  Ready` only. `A13`'s `⚠️ NOT YET SATISFIED BY THE SUITE` marker retired and replaced with a
  `SATISFIED BY THE SUITE` header; a retirement note added at the foot of `A13` carrying the 24-mutant
  campaign, the six-square domain re-derivation, the five suite-file corruptions and the new hole;
  three stale statements amended in place with a date (the `A1`–`A12` / 371 preamble, the *"second
  criterion carried unsatisfied"* paragraph, and `A13`'s *"no row in this suite exercises that"*); the
  reserved regions (ii)/(iii) now name `ABC-023`.
- `plans/board.md` — one `_Updated:` line, one **addition** to `Backlog` (`ABC-023`) and one comment
  under `Backlog` recording why it was cut and why it is not promoted. **No column moved**;
  `Ready for UAT` stays **1/4** and all 10 counted columns were re-verified, 0 wrong.
- `plans/traceability.md` — one `_Updated:` line, **one row edited** (`ABC-009`, the `Status` cell,
  appended) and **one row appended** (`ABC-023`). Every added string asserted to contain no unescaped
  pipe before writing; all 31 row lines re-counted at exactly 11 unescaped pipes after.

**Created**

- `plans/tickets/ABC-023-castling-precondition-net-hardening.md` — the follow-up **hardening** ticket.
  `Backlog`, `S` (2), `P2`, `EPIC-001`, `blocked-until: ABC-009 merged`. Five criteria (`A1` the joint
  occupant pair, `A2` the castle's destination square at the `generateMoves` layer, `A3` doubling that
  varies both axes, `A4` no production change, `A5` the rows proved load-bearing by mutation with
  `ABC-009`'s equivalence controls still surviving), each naming the discriminating mutant that must
  die. Definition of Ready assessed row by row at cutting: nine met, one amber for the ordering
  dependency.
- Four context notes under `.grugops/context/ticket-to-pr-ABC-009/notes/` — two `observation`, this
  `artifact-ref`, one `decision`, plus one `claim`. **No `finding`**: none is admissible on this task
  (no §14 gate in this install, `context.human_admission` is `off`), so nothing is self-stamped and no
  `index.md` / `index.jsonl` was hand-faked.

**NOT touched, and each was checked rather than assumed**

- Everything under `src/` — `git status --short -- src/` empty, `src/moves.ts` still md5
  `0e247853ab2c05887c76105ff83d8621`, all 14 pre-existing `main` test files diffed individually with
  0 modified. **No test row was written.**
- `ABC-022`, `ABC-010`, `ABC-011`, `ABC-018`, `plans/nfr-catalog.md`, and the `## Implementation`,
  `## QE`, `## Security / NFR`, `## Test notes` sections of `ABC-009`.

**Throwaway instruments, held outside the repository and never brought into it** — the 24-mutant
campaign, the six-square domain probe, the five suite-file corruptions, the sizing sweep and the
witness probes all ran against a copy of `src/` in the session scratch directory with `node_modules`
symlinked. They are not artifacts of this repository and were not committed; every number they
produced is in the two observation notes with its input printed.

**Queue** — `scripts/claim.js` does not exist in this install (re-checked: there is no `scripts/`
directory at all), so the subtask was claimed by hand with an atomic `mkdir` of
`.grugops/queue/claimed/ticket-to-pr-ABC-009-bapm5/`, a `claim.md` registry record, and atomic renames
pending → claimed → done, per Workflow 17 with the deviation recorded rather than hidden.
