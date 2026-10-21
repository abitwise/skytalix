---
id: 20261021T090518Z-software-engineer-decision-78d30164
kind: decision
by: software-engineer
at: 2026-10-21T09:05:18Z
verified_by: 
confidence: high
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/ABC-163
  - 87d3897d
  - d8c073e2
  - ccccc6bb
  - plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
  - 341da4c1
  - .grugops/context/secnfr-ABC-095-s3/notes/20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7.md
supersedes: 
seal: sha256:f239f11b32f6c1775a4803d4a86f2a237440c6ed456fe0a0f5a93f69d0a04d3e
---

# ABC-163 SE decisions: Ruling 2 folded in place, as its own (b1) line, from the diff already read (tip `d8c073e2`)

- **In place, not a new path (Scope 3).** `.grugops/context/design-F-072-1/probe/clause-b.mjs` is edited in place in
  `87d3897d`. `ADR-0036`'s canonical pointer, the board, the tickets and about 30 notes name this path. A new path
  would need those pointers changed, and most of them are fenced from this hop. Old readings stay reproducible:
  the file at `341da4c1` (the same bytes as at `ccccc6bb`, sha-256 `433d0c50…`) is the pre-fold instrument. Its
  header says so, and `ADR-0036` § S1 records it.
- **Ruling 2 has its own output line under (b1), and only limb 1 prints it.** The occurrence count line
  `(b1) capability lines added or changed: N` is unchanged, so the recorded (b1) counts still compare. Limb 2 and
  limb 3 output is byte-identical to the old instrument on 9 of 9 pairs.
- **No pathspec diff is run.** Ruling 2 reads the `git diff -U0 --no-renames <base> <head> -- src` that the
  instrument already parses. It takes the holders from the two AST analyses it already runs, `<base>` and
  `<head>`. The empty-pathspec trap (`…b65b11b7`) cannot occur, because no pathspec is built. With no holder at
  either end, the line reads `no limb-1 holder at <base> or <head>; adds nothing`.
- **What fires.** A production file with at least one `+` line that holds limb 1 at `<base>` or `<head>`. A
  deletion-only hunk has no `+` line, so it does not fire under Ruling 2. The ruling's words are "a `+` line".
- **The verdict label counts Ruling 2 as FIRES, not "disputed".** The first plant run showed that the label still
  keyed on `b1`/`b2` only, and it printed "FIRES (disputed…)". This was fixed before the commit. See the readings note.
- **A3's pair, named here** (the page leaves the choice to the builder): **`dbaf972f^..dbaf972f`** (`ABC-042`, one of
  F-072-1's recorded pairs). It has 0 limb-1 holders at both ends, and 2 production files with `+` lines
  (`src/cli-options.ts` +156, `src/cli.ts` +93).
- **Role note.** The page names Architect/Design as the builder. The Orchestrator dispatched this to the Software
  Engineer (`ticket-to-pr-ABC-163`). The ADR line is a dated record of the fold and rules nothing new.
