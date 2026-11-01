---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T22:54:41Z
subtask: arch-adr0057-fix
role: architect-design
ref: .grugops/context/arch-adr0057-fix/
branch: new grugops/arch-adr0057-fix from main (worktree .claude/worktrees/arch-adr0057-fix)
width: records only, beside bapm-epic010-close (plans/ only).
---
# Architect: correct ADR-0057 before the owner rules, and refresh ADR-0056's lane figures
## Inputs
qe-ABC-263 gaps (.grugops/context/qe-ABC-263/ …5e4c6533): G1 MEDIUM — ADR-0057 calls ABC-253 "in flight"; it was dropped (…27ddb1fb; prototype patch in .grugops/context/se-ABC-253/raw/patch.py, 48/48 identity). D2.3 and the D6 threads row rely on its 32-bit key halves. G3–G8 LOW (round-trip µs for rows d/e or "n/a" with reason; fair-comparison "—" cell; ADR-0044 D5 reversal named under OQ-1; define V4 inline; "exceed" not "pass" 128 MiB; rename prototype ids to avoid ADR-0056's P1–P6; say what settles each UNKNOWN). Scribe list of stale lane figures in ADR-0056 (l.~812–834: Levels 57 tests / 577 s; ladder 18 / 23 s; UCI 241 / 291 s).
## Do
Dated corrections in ADR-0057 (keep PROPOSED): G1 — threads need their own key split (reuse se-ABC-253's prototype approach); re-estimate the threads effort honestly. G3–G8 fixes. ADR-0056: dated figure refresh only.
## Fences
memory-bank/50-decisions/ADR-0057*, ADR-0056* (figures only), your notes. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-adr0057-fix, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-adr0057-fix` from `main` `ff775417`. Records only. Nothing was run: no test, prototype, profile or host read.
- **ADR-0057: dated corrections, still PROPOSED.** A status block lists every fix, and each changed passage is marked *(corrected 2026-11-01)*. No verdict, recommendation or order moved.
  - **G1:** `ABC-253` was dropped at 20:51:36Z (`608ebfa4`, `…27ddb1fb`). The first text leaned on its halves in Context, D2.3 and D6.
    - Now the shared table splits the `bigint` key inside `probeTable(key)` and `storeEntry(key, …)`, and their signatures stay `bigint`.
    - From se-ABC-253's prototype (`raw/patch.py`), only the table half is reused: two `Uint32` key words a slot, `slot = keyLo & mask`, `probeHalves`/`storeHalves`.
    - Its hot-path half is not reused. That half read about 1.00×, and it is the half that collided with the ABC-081/122/208 rows.
    - Read, not run: those rows keep their `bigint` seams, so the page conflict does not arise.
    - `Threads 1` stays node-for-node equal to today, with the same slot, replacement and hit rule. One unsigned-compare trap is named.
  - **Threads effort:** was L, 30–60 h; now **L, 32–65 h**. The split costs 1–2 h and a `Threads 1` profile 1–3 h. If that profile shows a cost, the fallback is the full halves path: **42–85 h**, plus an `ADR-0026` ruling to re-point the rows.
  - **G3:** row (d) now gives the round trip per batch, 45–65/N µs a position (`estimate`). Row (e) reads n/a, with the reason.
  - **G4:** the fair-comparison cell of the D4 classical-path row is filled.
  - **G5:** OQ-1 now asks, by name, for `ADR-0044` D5's reversal. OQ-6 defines V4 inline (`ADR-0056`'s bitboards).
  - **G7:** the `onnxruntime-node` 1.31.1 EP list is marked `UNKNOWN - verify`. § Consequences now lists all 12 open UNKNOWNs, each with what settles it.
  - **G8:** "exceed (≈ 151 MiB)" replaces "pass". The prototype ids P1–P6 are now SP1–SP6, with the mapping in the status block.
  - **Not changed:** G2 (deletion required by A8) and G6 (already labelled).
- **ADR-0056: dated figure refresh only**, in R-TC part 2, with the old text kept in "was" markers. The source is QE `…388b3044`.
  - Levels: 57 tests, 577 s, about 10 min.
  - Ladder short mode: 18 tests, 23.4 s.
  - UCI session: 241 tests, 291 s.
  - Total: about 15 min (was about 30).
  - No rule changed.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`; `at` from `date -u`):
  - decision `20261101T230113Z-architect-design-decision-b09b24ff` (G1 and effort);
  - observation `…876f797a` (ADR-0056 refresh);
  - observation `20261101T230157Z-architect-design-observation-8cb32dc5` (G3–G8). It supersedes `…1ddaadaf`, which miscounted the UNKNOWNs as 13.
  - All read back sealed. No `finding` (`human_admission` off).
- **Commits:**
  - claim `ae4af939`;
  - ADR edits and notes `6f3682e6`;
  - this Result, the trace row and the move to done/ in the closing commit.
- **For the Orchestrator:**
  - The same stale lane figures sit in EPIC-010 l.79/81/83 and EPIC-011 l.292/295/296 (Scribe `…1fdc30f0`). They are BA/PM's (`bapm-epic010-close` may take them).
  - The threads tickets, if OQ-1 is yes, should carry D2.3's split and its `Threads 1` profile.
