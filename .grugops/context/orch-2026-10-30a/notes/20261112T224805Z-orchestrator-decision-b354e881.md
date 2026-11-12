---
id: 20261112T224805Z-orchestrator-decision-b354e881
kind: decision
by: orchestrator
at: 2026-11-12T22:48:05Z
verified_by: 
confidence: high
refs:
  - ABC-321
  - ABC-320
  - qe-ABC-320/20261111T222707Z-qe-e2e-decision-1d9e9a62
  - qe-ABC-320/20261112T045721Z-qe-e2e-decision-b1a03872
  - .grugops/context/qe-ABC-320/raw/scripts/night.sh
supersedes: 
seal: sha256:bf943f0098ab5a8e0d9a844e5f7ee564f97723b59babd9c497fa803c8ea1810a
---

Owner, 2026-11-12 at about 22:48Z: "start next partial run, about 7 hour window". Read as his W (held host) for one window tonight and his go for L5 night 2. This cuts ABC-321: L5 night 2, run on PREREG …1d9e9a62 exactly as sealed (E 2280, first start 31), on the sealed scripts after `sha256sum -c`, from a worktree whose tools/ is 2ae53ab1 and src/ b668b153 (gate 2 enforces both).

The window is about 7 h, the sealed cap 8 h. The script is not edited: a cap change after the seal would need a sealed addendum and lose a chunk. Night 1's measured rate (about 64 min a chunk, 6 launches, end at 6 h 21 min) puts tonight's expected end near 6.3–6.6 h, inside the window. A run past 7 h needs the last launch late (the guard allows up to 5 h 40 min) and a slow chunk. If the owner needs the host back first, the orchestrator stops the session on his word: the running chunk is then not clean and is not pooled, and its openings replay on a later night; clean chunks before it stand.

Out-root: a new dir under scratch, as the PREREG says, copied to the durable `skytalix-ratings/` after the run (QE's medium gap, …b1a03872). The read follows in a QE stage C hop. README and CHANGELOG wait for all 200 games.
