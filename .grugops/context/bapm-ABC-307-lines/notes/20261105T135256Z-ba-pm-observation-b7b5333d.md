---
id: 20261105T135256Z-ba-pm-observation-b7b5333d
kind: observation
by: ba-pm
at: 2026-11-05T13:52:56Z
verified_by: 
confidence: high for what raw files and git show; F1 and its counts are predictions, UNKNOWN - verify; nothing was run
refs:
  - bapm-ABC-307-lines
  - ABC-307
  - EPIC-011
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - NFR-008
  - T-QEHOP-GROWTH
  - R-N8H-1
  - R-N8H-2
  - R-307-a
  - R-307-b
  - R-307-c
  - ADR-0046
  - ADR-0035
  - arch-ABC-307-reads/20261105T134134Z-architect-design-decision-727e0d0c
  - arch-ABC-307-reads/20261105T134134Z-architect-design-observation-f8c13d49
  - arch-ABC-307/20261105T125815Z-architect-design-decision-838ecf31
  - orch-2026-10-30a/20261105T134300Z-orchestrator-decision-db111535
  - orch-2026-10-30a/20261105T125927Z-orchestrator-decision-f86e0257
  - 91c21a9f
supersedes: 
seal: sha256:1aa4896e8ac615de5d83b201e362069f6c582ac516d28670924c59f7d2a79779
---

# bapm-ABC-307-lines observation: where `…727e0d0c`'s page lines and the raw reads differ, and what the page carries instead

BA/PM, task `bapm-ABC-307-lines`, at `main` `91c21a9f`. Reads and git only. Nothing was run. Each line below was checked against `arch-ABC-307-reads`' `raw/` or the file it names.

- **A4's counts are not passed counts.** `…727e0d0c` says "passed counts"; `…f8c13d49` says `vitest list`, and no whole deep lane ran. The page says so, and A4 gives the first passed counts.
- **P2b has five holders, not four.** `raw/kills/tip-P2b.sum` holds `ABC-259`, `ABC-220` A6, `ABC-220` A13, `ABC-221` A7 and `ABC-221` A11. `…727e0d0c`'s line and the ADR leave out `ABC-220` A13; `…f8c13d49` has it. The page lists five.
- **Six memo plants read 0 in the tip's default lane.** Taken as written, "every plant the base file kills, the tip file kills" holds for them only under the flag, and A7's default-lane leg would miss. The PREREG expected this, and `raw/plants.tsv` shows it. The page names them as the exception and gives the three re-anchored plants as their default-lane read.
- **`F3`'s set is wider than the read.** `own` holds three random-half plants that the PREREG left out as unstable, and the deep leg was read only where a trio row kills at base. The page leaves those three to QE's PREREG.
- **`F1` is unbuilt.** `F2`'s red at head and the 36 are predictions. By `readNotes`' source, `F1`'s two counts agree when no note is dropped: it pushes every `*.md` under every non-symlink `notes/`, and a symbolic link throws.
- **A4's formula needed a term.** Base plus S remnants plus rows moved in gives 35 on `qe-hop`, so the page adds `F1`.
- **The remnants' titles** on the page match `raw/tip.py`. The nine `-t` lines were copied from `ADR-0046` by script, not retyped.
- **`main` reads 5 441 note files at `91c21a9f`,** by `git ls-tree`: under 5,500, and 459 short of the 5,900 backstop.
- **Arithmetic on recorded figures, not a read:** 9.815 − 0.219 = 9.596 s; 569 × 0.37 = 0.211 s; 592 − 581 = 11 ms in-thread, or 0.004 s realised.
