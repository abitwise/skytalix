---
id: 20261026T122626Z-orchestrator-decision-836cb92d
kind: decision
by: orchestrator
at: 2026-10-26T12:26:26Z
verified_by: 
confidence: high
refs:
  - ABC-208
  - ADR-0050
  - EPIC-008
  - qe-ABC-208/…0477ac64
  - owner-word-2026-10-26/…58bcd17c
  - NFR-008
supersedes: 
seal: sha256:134b36d575fdc73ae569e55b393f8126450a81d6c8a734ff1ecd1a70e59d76b5
---

# ABC-208 merged on a QE PASS; ADR-0050 now in force; two records hops routed

- **Accepted qe-ABC-208 PASS (…0477ac64) at 3a87f9d7.** This was ABC-208's single reading under …4c3f7639, so it is final.
  - A1–A6 MET. QE-208-a/b/c are closed: each of the 6 plants turned its own row red.
  - G6 MET, one ply deeper on both boards. G2 is equal to base.
  - D GAIN +38.4 ± 23.3 over 400 games, so S1 is MET with no extension. The overlap-free (+40.2) and load-free (+30.3) cuts also read GAIN.
  - UAT is signed by the QE verdict (…5aaf7cec item 2).
  - QE's false D start (the driver was not executable, so nothing ran) is not a second reading, because no game was played.
- **Merged grugops/ABC-208 @ 2e9eb9a7 into main as b5c67ab7.**
  - `git diff 3a87f9d7 b5c67ab7 -- src tools data package*.json` is empty, so the code on main is the code that was measured.
  - Gates at b5c67ab7: npm ci, lint, typecheck and build all exit 0. npm test 2128/2128, success; skips 0; skip-integrity reports No findings.
  - NFR-008 sentinel: 8.48 s and 8.32 s, both ≤ 10 s, even though the host was not clean (load1 about 5–8).
- **QE records to main by path only:** .grugops/context/qe-ABC-208/. The QE branch carries a merge commit, so it is never merged.
  - Leak scan: 0 hits apart from QE's own leak-check pattern line. Host, user and email: 0.
- **ABC-208: In Review → Done.** In Review is now 0/3.
- **Routed, records only, width 2/3:**
  - `arch-adr0050-in-force`: ADR-0050 § Status gets a dated "in force on main at b5c67ab7" line.
  - `scribe-null-move-lane`: AGENTS.md gets the SEARCH_DEEP lane line for src/search.null-move.test.ts, per the QE run (44/44, 46.0 s).
- **Backlog note, INFO, kit/config:** QE-207-g again. The ALONE claim was held about 6.5 h against a 30-min stale TTL. No sweep ran, so nothing was harmed.
