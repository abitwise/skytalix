---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T20:32:09Z
subtask: se-ABC-239
role: software-engineer
ref: .grugops/context/se-ABC-239/
branch: new grugops/ABC-239 from main — worktree .claude/worktrees/se-ABC-239
width: wrap EVERY test/build/engine/fit run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Each fit ≤ 30 min (data-stage stop); hop total host ≤ 2 h without asking. The Lichess export (2.2 GB) is downloaded once into <scratch>/lichess/ (never committed, never in the repo tree) and checked with sha256 before use. No game reads in this hop — B-T7 and B-T8 are QE's. Host paths only as placeholders in anything committed.
---
# Build ABC-239: tools/tune/ (ADR-0067 ACCEPTED + its 2026-11-03 Lichess data-pin addendum) and the first fitted src/evaluate-params.ts
Read plans/tickets/ABC-239*.md (DoR 10/10; A1–A6, test notes, "What happens on a miss"), ADR-0067 in full (decisions, B-T0–B-T8, F1–F8, the addendum), ADR-0048 (provenance), ADR-0064 (E1 table), the ABC-274 packed blend on main, QE-274-b (ticket test note 3: widen ABC-274's A3 rows before the first fit).
- Build the tool exactly as ADR-0067 rules: reader (comments dropped unread, test-proven), filters, quiet filter via main's own quiescence rules record (ADR-0069 is PROPOSED; your filter must name the rules record it uses so a later Q1 merge does not move it), dedupe, split (validation own-only), K per source, Newton on cross-entropy, material frozen, sign bounds, integer emission into src/evaluate-params.ts only, manifest with URL + bytes + sha256 (refuse on mismatch), byte-reproducible.
- Run the first fit; graded offline bars per the ADR (B-T0…B-T6 as applicable). Any data-stage stop → stop and return to Architect (via your Result), do not tune around it.
- Gates: lint, typecheck, unit, build; npm test green; the deep lanes AGENTS.md names for evaluation changes.
- Hand the candidate to QE with its sha frozen. Orchestrator ruling: B-T8 runs as one `rpair` (paired, same session); the freeze for B-T7/B-T8 waits on the owner's ADR-0069 answer (Q1 merges first if accepted).
## Fences
src/evaluate-params.ts, tools/tune/**, their tests, package scripts if needed, your records. No other src edits (ask). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-239, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
