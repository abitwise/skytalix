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
