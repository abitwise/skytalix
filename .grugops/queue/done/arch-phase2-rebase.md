---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:48:54Z
subtask: arch-phase2-rebase
role: architect-design
ref: .grugops/context/arch-phase2-rebase/
branch: new grugops/arch-phase2-rebase from main (at dispatch) — worktree .claude/worktrees/arch-phase2-rebase
width: records; probes ≤ 5 min each, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, deterministic node counts only, no timing (se-ABC-265 is running tests).
---
# ABC-264 retry ruling + re-base ADR-0060 on main
## Read
qe-ABC-264-p2 verdict (…4a487d20) and figures (…3af11ebd), ADR-0059 (accepted; F5 fired), ABC-264 page, qe-ABC-264 INFO (firing 0.3–4.8 % at 100 ms; QE-264-e stalemate cut returns beta), ADR-0060 (PROPOSED, measured on 4d1c0616 = ABC-264 head), arch-phase2-p1 notes (…35bd3967, …6a0f09ce) and raw/probe.
## Do
1. ADR-0059: dated "accepted, not in force" line (F5 fired: 44.0/100). Name QE-264-e. Give the retry ruling: drop, or a new ticket (e.g. F1's 150 cp fallback, other guards) — with the reason a ~0.6× node cut lost ≈ −42 ± 58 Elo (what does the evidence say: noise, margin, a bug class such as stalemate/eval-bound, or 100 ms depth too shallow to gain?). If you recommend a retry, give its pre-registered bars; do not loosen any old bar.
2. ADR-0060: re-measure every A4/A3/G1 figure on **main** (no reverse futility), state the new door counts, and confirm or adjust nothing about the bars (bars stay unless a figure on main misses one — then say so plainly; F-rules apply). Update ADR-0060's base line so the build can start now from main.
3. Name what BA/PM needs to cut the P1 page.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't touch ADR-0025. No push, force, amend, rebase, merge into main. Leave nothing running; delete scratch copies.
## Publish
Sealed notes (task arch-phase2-rebase, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-phase2-rebase` from `main` `5ffbae25`. Records
  only. Probes ran on scratch `git archive`s of `main` (`src/` = `0b73f51d`) and `4d1c0616`, outside the repository.
  Every batch ran under `flock <host-test.lock> timeout 300`, with deterministic counts only and no timing. Two
  batches waited for the lock behind se-ABC-265's runs, which were left alone. The scratch copies are deleted, and the
  patch, drivers and outputs are under `.grugops/context/arch-phase2-rebase/raw/probe/`.
- **1. ADR-0059: ACCEPTED, NOT IN FORCE ON `main`** (dated status block). F5 fired at 44.0 / 100. `QE-264-e` is
  named (stalemate at a cut node returns beta; INFO, null-move class).
  - **Retry ruling: DROP.** No re-play of `4d1c0616`, and no re-cut with F1's 150 cp, on today's `main`.
  - **Noise:** P(≤ 44 | +30) = 0.010, P(≤ 44 | 0) = 0.095. D2's +30–60 is contradicted at about 99 %.
  - **Bug class:** none indicated (stalemate, eval bound, time, wiring and colour each checked).
  - **Not "too shallow":** the rule buys +0.70 ply at 47 000 nodes (measured), twice P1's reach, and still lost.
  - **Likeliest cost:** the depth-1 guess under a piece's value (judgement, `UNKNOWN - verify`).
  - **150 cp:** the wrong lever. It was pre-chosen for a drift red, it is still below a piece, and it buys less
    (+0.61 ply).
  - **Re-cut** only as a new ticket under a new premise (E1/E2, O1h, an owner-asked 500 ms read, or a changed form),
    with every `ABC-264` bar unchanged, plus reach ≥ +0.25 ply and `QE-264-e` guarded or carried.
- **2. ADR-0060 re-measured on `main`: two bars MISSED, re-opened (F1), and the build does not start on this text.**
  - The door reproduces `main`'s counts to the node: 1 116 785 / 1 602 457 / 1 575 537 / 476 244.
  - A4 (a): 0.7605 / 0.7385 (`search()`), 0.7334 / **0.8699** (`chooseMove`), bar ≤ 0.85.
  - A4 (b): +0.2526 (5.558 → 5.811), bar ≥ +0.25, met by 0.0026.
  - A3: `search()` 99.47 %, **max 63 cp** against the 27 cp cap; `chooseMove` 100 %, max 18. Mate +1 0 / 163.
    Zugzwang 7 / 7.
  - G1: 54 / 58.
  - New head counts: 849 358 / 1 183 439 / 1 155 460 / 414 286.
  - No measured variant meets both missed bars on `main`. A PV −2 diagnostic removes the 63 cp row but saves nothing
    on position-6.
  - **No bar moved.** The owner is not asked to accept this text.
- **3. BA/PM inputs for the P1 page:** observation `…e4680ed2`. The page can be stubbed, but not made Ready until the
  re-open. The bar numbers carry over. The base is `main` (no reverse futility, no `ABC-264` re-points). Also owed:
  close `ABC-264` as dropped, and drop P2 from the Phase 2 list.
- **ADR-0056 D2:** dated line. Row P2 is dropped. Row P1 is re-opened. The order is P1 (re-opened) → P4 → P3 → P5 →
  P6, and P3-first is the Orchestrator's call.
- **Open:**
  - **Owner:** may the 27 cp cap be re-derived on `main` (a loosening by number)? Without that word, the re-open may
    find no form that meets every bar.
  - **Orchestrator:** dispatch the ADR-0060 re-open, or take P3 first.
- **Commits:** claim `95b95b57`; ADRs + notes + raw `80886cdb`. This Result, the trace row and the move to done/ are
  in the closing commit. Not pushed, not merged. ADR-0025 is untouched.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at`
  2026-11-02T15:18:39Z from the seal-time UTC clock; 3 of 3 read back, index rendered):
  - observation `20261102T151839Z-architect-design-observation-d5870a7a` (the probe);
  - decision `20261102T151839Z-architect-design-decision-f9f440c9` (the retry ruling, the ADR-0060 re-open, bars);
  - observation `20261102T151839Z-architect-design-observation-e4680ed2` (artifacts, BA/PM inputs, open questions).

### Trace row (10 cells, header order)

| arch-phase2-rebase | ABC-264 retry ruling DROP (44.0/100; P(≤44 \| +30) 0.010; no bug class; +0.70 ply at 47k nodes yet −42 Elo; 150 cp wrong lever, +0.61 ply); ADR-0059 accepted, not in force, QE-264-e named; ADR-0060 re-measured on main: door to the node, A4 (a) chooseMove pos-6 0.8699 > 0.85 and A3 search() max 63 > 27 cp MISSED, A4 (b) +0.2526 met, mate 0/163, zugzwang 7/7, G1 54/58; F1 re-open, build not started, bars unchanged | EPIC-011 | ADR-0059 (accepted, not in force); ADR-0060 (PROPOSED, re-opened); ADR-0056 D2 dated line | NFR-005 (A4, unchanged bars), NFR-008 (deep rows); no NFR file | `grugops/arch-phase2-rebase` (records only; claim `95b95b57`, ADRs + notes `80886cdb`) | scratch measurements only (deleted; raw kept); main door reproduces ADR-0059's door counts to the node | — (records) | — | Records done (Architect); awaits the owner (27 cp cap question), the Orchestrator (P1 re-open or P3), BA/PM (ABC-264 close, P1 stub) |
