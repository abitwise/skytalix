---
subtask: arch-qehop-threshold
role: architect-design
ref: .grugops/context/arch-qehop-threshold/
branch: new grugops/arch-qehop-threshold from main (worktree .claude/worktrees/arch-qehop-threshold)
width: records only (no vitest, no engine, no games). qe-ABC-223 holds the host STRICTLY ALONE for ~5 h of games.
---
# Architect: write T-QEHOP-GROWTH's MET reading and set the next threshold (ADR-0035 B3)
## Read
- qe-qehop-growth notes: decision …4c3f34a2, reading …625483bc, threshold …21479114, findings …f0c3f8db; probe/preregistration.txt (blob 3aab3adc).
- ADR-0035 A1/A3/B1–B4 and § Addendum 2026-10-30 (host change); plans/nfr-catalog.md § "N8-LANE at ABC-105" (Closure, floors).
## Do
1. Write the reading (MET at 37a93b76, 4 272 notes: +0.455 s CPU (+0.440..+0.490), twin +0.010 s, R 0.030 s, n 8) where B3 says the record lives.
2. Set the next threshold. QE-QHG-d: "the same arithmetic" (75 % of bound) puts it at ~4 640–4 700, firing again within a week at today's 74–104 notes/day. Decide the rule on its merits (the bound is reached at ~6 230–6 660); record your reasoning. If the change is a rule change rather than arithmetic, say whether it needs anyone's word; nothing goes to the owner unless the rule's own text says so.
3. QE-QHG-b: rule whether the host change starts a new F series (F stays, or F = 0.030 s CPU / 0.020 s wall).
4. QE-QHG-c: name the Linux port (qe-qehop-growth probe/*-qeg.*) as the method for the next read, or say why not.
5. QE-QHG-a: note A1's one-tick floor dependence (no action unless you see one).
## Fences
- memory-bank/50-decisions/ADR-0035* and plans/nfr-catalog.md (insertions / dated lines; no NFR level moves) plus your notes. No board, trace, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main. Run nothing.
## Publish
Sealed notes (task `arch-qehop-threshold`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, Architect/Design. Done, records only. Branch `grugops/arch-qehop-threshold` (worktree `.claude/worktrees/arch-qehop-threshold`, from `main` `28e46464`). Records commit `b5bb0ce4` (ADR-0035 +189 / −0, catalog +54 / −0); notes commit `9a035b48`. Nothing run, built or timed (`qe-ABC-223` holds the host). Not pushed, not merged. Only ADR-0035, `plans/nfr-catalog.md`, own context and this brief edited. All twelve `NFR-` rows hash `39291dcf…9d83` before and after; no level moved.**

- **1. The reading (C1).** Written in `ADR-0035` § Addendum 2026-11-01 (after qe-qehop-growth) C1 and in the catalog § "`N8-LANE` at `ABC-105`", new subsection "`T-QEHOP-GROWTH`, 2026-11-01". **MET** at `37a93b76`, 4 272 notes: H−B +0.455 s CPU (+0.440..+0.490), twin +0.010 s, R 0.030 s, n 8. Recomputed from QE's raw TSV; agrees on every figure. The 4,000 trigger is discharged.
- **2. Next threshold (C2, `QE-QHG-d`): 5,500 note files.** B3's "same arithmetic" is replaced by a lead-time rule: the largest multiple of 100 not above N0 + (0.650 − hi)/s − 7 × r (one week of the fastest recent growth short of the projected upper-end crossing). Today 6 229 − 7 × 104 = 5 501. Fires ~12–16 days out (4 287 at `28e46464`); projects +0.555 / +0.590 s; leaves 7–10 days to the upper-end crossing. The 75 % point (≈ 4 670) would re-fire within a week on a near-certain MET. A rule change, but B3 is this role's text and its only owner route is NOT MET: **no one's word needed; nothing to the owner.**
- **3. `QE-QHG-b` (C3).** The host change starts a new `F` series (per-file cost moved: B 0.575 → 0.370 s). **`F` = 0.030 s CPU / 0.020 s wall on `oeselg-dev`**; M3 0.020 / 0.020 kept as history. Same figures either way; the ruling sets the basis. Floors block dated sub-bullet added.
- **4. `QE-QHG-c` (C4).** The next read's method is `qe-qehop-growth`'s Linux port: pre-registration `833192d7` + `8dfbabf5` (blob `3aab3adc`), harness named by sha256; each read still writes its own pre-registration (B1).
- **5. `QE-QHG-a` (C5).** Noted, no action. Watch: if the next read's interval comes within 0.030 s of 650 ms, A1's timer route is owed before the read after it.
- **For the Orchestrator:** re-arm `T-QEHOP-GROWTH` at 5,500 (the count `find .grugops/context -path '*/notes/*.md' | wc -l` on `main`). Nothing owed to any other role or the owner.
- **Notes** (task `arch-qehop-threshold`, contextRoot = worktree; 3/3 sealed, read back): decision `20261101T085240Z-architect-design-decision-338f0ed6`, observation `…observation-d8ca62f3` (reading and recompute), observation `…observation-c59429e2` (artifacts; no `gate_run`, so not an `artifact-ref`).

### Trace row (10 cells, header order)

| T-QEHOP-GROWTH (records) | MET at 37a93b76, 4 272 notes (H−B +0.455 s CPU, +0.440..+0.490; twin +0.010; R 0.030); re-armed at 5 500 by a lead-time rule (QE-QHG-d); F new series on oeselg-dev 0.030/0.020 (QE-QHG-b); method = qe-qehop-growth Linux port (QE-QHG-c); A1 floor noted (QE-QHG-a) | — | ADR-0035 § Addendum 2026-11-01 (after qe-qehop-growth) C1–C5 + § Status pointer | NFR-008 / N8-LANE 650 ms unchanged; no NFR moves | grugops/arch-qehop-threshold @ b5bb0ce4: memory-bank/50-decisions/ADR-0035-…, plans/nfr-catalog.md (records only) | none run (records only; recompute of qe-qehop-growth w1 TSV) | n/a | — | threshold set; no board move |
