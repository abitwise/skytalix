---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:18:03Z
subtask: arch-accel-review
role: architect-design
ref: .grugops/context/arch-accel-review/
branch: new grugops/arch-accel-review from main (at dispatch) — worktree .claude/worktrees/arch-accel-review
width: records; any probe ≤ 5 min, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, no timing while a game read holds the host. Device nodes are denied (owner OQ-5 = no): no host change.
---
# OWNER REQUEST: review the Gemini analysis on NPU/GPU search against ADR-0057
## Read
memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md (owner-supplied, Gemini "Argon" output — treat every figure and claim as unverified until checked), ADR-0057 (ACCEPTED: threads before devices; owner OQ-5 no, OQ-6 later), its SP1–SP6 measurements, ADR-0056, EPIC-011, ABC-265/266/267.
## Do
- For each architecture in the analysis (A warp-cooperative YBWC GPU megakernel; B "shadow-bound" speculative PVS via unified RAM, CPU + NPU/iGPU; C tensorized soft-minimax on the NPU) and its starting-point advice: check the claims against our measurements (WebGPU round trip 45–65 µs vs 1.1–1.6 µs a node; Node.js/WebGPU exposes no coherent CPU–GPU shared memory or cross-device atomics; NPU reached only through ORT/Vitis; no render-group access) and against cited sources where checkable. Mark each claim verified / contradicted / UNKNOWN - verify (with what settles it).
- Verdict per idea: changes ADR-0057 (how), adds a new parked option, or adds nothing. Name any idea that can run on the CPU threads path now (e.g. a speculative bound idea transferable to Lazy SMP helpers).
- Act on it: amend ADR-0057 (dated addendum) and/or write a new ADR (PROPOSED) if warranted; if a ticket change is needed (ABC-265/266/267 or a new spike), name it precisely for BA/PM — do not edit plans/. Anything that reverses an owner answer (OQ-5, OQ-6, neural non-goal) is an owner question, stated plainly with your recommendation.
## Fences
memory-bank/ and your records only; no src/tests/plans/board; do not edit the owner's analysis file (cite it). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-accel-review, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-accel-review` from `main` `2ef3aadc`. Records only:
  `memory-bank/50-decisions/ADR-0057` and this task's notes. No `src/`, tests, `plans/` or board edits. The owner's
  analysis file was not edited. `ADR-0025` was not touched, and no Phase 2 ADR was written. `ABC-264` was not relied on.
- **One probe, PR-1** (`measured (informal)`, no timing): a scratch copy of `src/` with a counter at the quiescence
  stand-pat, `search(position, 7)` on four positions, run as `flock host-test.lock timeout 300 node …`,
  2026-11-02T14:33:23Z–14:34:06Z (43 s). The scratch copy was deleted and nothing is left running.
- **ADR-0057 stays ACCEPTED, with no decision, strand or owner answer changed.** Dated addendum **D8** (D8.1–D8.9),
  plus a status line, a D6 pointer, a D7 pointer (OQ-7, OQ-8) and sources. **No new ADR**: nothing decided changes, and
  a new number would collide with the Phase 2 hop's.
- **Verdict per idea:**
  - **A** (warp-cooperative YBWC GPU megakernel): adds nothing. It is a second engine in WGSL, blocked by OQ-5 and by
    WGSL itself: recursion disallowed (§ 11.4), 32-bit atomics only, no progress guarantee across workgroups. Its NNUE
    does not fit on chip (384 / 192 KiB against 128 KiB of LDS).
  - **B** (shadow-bound speculative PVS): adds nothing now. Recorded as parked shape **PK-B** behind OQ-5 **and** OQ-6.
    Contradicted: the 10–15 M nodes/s CPU, the zero-copy ring buffer from Node.js, TT injection, and 85 % as a constant
    (PR-1 reads 40.6–83.0 %). It also contradicts itself.
  - **C** (tensorized micro-trees): adds nothing. Its formula backs up one ply, not two, and on our figures it is a
    slowdown.
  - **Row D and the starting advice:** add nothing; contradicted on this host.
- **CPU transfers:** aspiration windows are already on the path (`ADR-0056` S1, `ABC-236`). Lazy evaluation is recorded
  as a Phase 4 candidate: a ± 100 mobility skip is exact by `MOBILITY_CAP`, at least 28.6–70.0 % of stand-pats
  qualify, and its worth is `UNKNOWN - verify`. Lazy SMP helpers: nothing new.
- **Tickets:** `ABC-265`, `ABC-266`, `ABC-267` unchanged; no new spike. BA/PM optional: one "Not cut, recorded" line in
  `EPIC-011` Phase 4 (lazy evaluation, `ADR-0057` D8.7).
- **Owner questions:** OQ-7 (re-asks OQ-5, `render` group), recommended **no**. OQ-8 (re-asks OQ-6, neural net),
  recommended **later**. If unanswered, both earlier answers stand.
- **Commits:** claim `ce76acaa`; ADR + notes `574bb6c2`; this Result and the move to done/ in the closing commit. Not
  pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-02T14:40:06Z
  from `date -u`; 3 of 3 read back, index rendered):
  - decision `20261102T144006Z-architect-design-decision-17fa951c` (verdicts, PK-B, transfers, tickets, OQ-7/8);
  - observation `20261102T144006Z-architect-design-observation-f7eb0d8f` (PR-1);
  - observation `20261102T144006Z-architect-design-observation-080ee7d4` (claim ledger, open items).

### Trace row (10 cells, header order)

| arch-accel-review | owner's Gemini NPU/GPU analysis checked against ADR-0057: A, C, D, starting advice add nothing; B parked as PK-B (OQ-5 + OQ-6); CPU transfers: aspiration windows (ADR-0056 S1, already), lazy evaluation (Phase 4 candidate, PR-1 28.6–70.0 %); OQ-7/OQ-8 recommended to stand | EPIC-011 | ADR-0057 (ACCEPTED; dated addendum D8) | none (no NFR touched) | `grugops/arch-accel-review` (records only; claim `ce76acaa`, ADR + notes `574bb6c2`) | — (PR-1 informal probe, not a test) | — (records) | — | Records done (Architect); owner: OQ-7, OQ-8 (optional); BA/PM: optional EPIC-011 Phase 4 line; ABC-265/266/267 unchanged |
