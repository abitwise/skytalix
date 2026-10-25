---
id: 20261025T031626Z-qe-e2e-decision-f1bc80ed
kind: decision
by: qe-e2e
at: 2026-10-25T03:16:26Z
verified_by: 
confidence: high (verdict on the evidence in this task's observations)
refs:
  - ABC-204
  - EPIC-008
  - ABC-205
  - QE-204-a
  - QE-204-b
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - se-fix-ABC-204/20261025T030904Z-software-engineer-decision-86f9bb11
  - se-fix-ABC-204/20261025T030905Z-software-engineer-observation-39d453b2
  - qe-ABC-204/20261025T025833Z-qe-e2e-decision-b5f4d5a1
  - qe-ABC-204/20261025T030130Z-orchestrator-decision-f9d109ea
  - grugops/qe-fix-ABC-204
  - 64f29cdd
  - 2c8a84f2
  - 16c51d1c
  - tools/rating/rating.ts
  - tools/rating/dist-manifest.ts
  - QE-204-h
  - owner-delegation-2026-10-22/…5aaf7cec
supersedes: 
seal: sha256:10e4240216901ecbf907be6aa18f80d827d0d93bbcdacff00429feabd6c40073
---

# QE/E2E verdict: ABC-204 fix PASS_WITH_GAPS. QE-204-b and QE-204-a are closed; the readings stand; one new LOW (QE-204-h), pre-existing and not blocking

Task `qe-fix-ABC-204` re-checks `se-fix-ABC-204` (`2c8a84f2`, tip `64f29cdd`) against QE's findings in `qe-ABC-204/…b5f4d5a1` and the Orchestrator's order in `qe-ABC-204/…f9d109ea`.

- **QE-204-b (MEDIUM): CLOSED.** `artifacts.txt` now records each side's whole `dist/`: a sorted per-file sha256 manifest and a tree hash.
  - `8ccba739` gives `3798b8d1…` and `3497aad2` gives `726e5225…`.
  - 3 identical builds from 2 producers (QE and SE) are equal, and they match the shell pipeline.
  - Every mutation moves the hash: a 1-byte change, an added file, a nested file, a removed file. A symlink in `dist/` stops the run.
- **QE-204-a (LOW): CLOSED.** A leaf symlink into the checkout, to a subdir or to the root, is missed at base and refused at head, with nothing written. Real outside dirs and symlinks to them are not over-refused.
- **QE-204-h (LOW, new, pre-existing, not blocking):** a case-variant or `/System/Volumes/Data` alias path into the checkout gets through the guard at both base and head. Separate observation; route is the Orchestrator's.
- **Play code paths are unchanged** against `16c51d1c` (diff read). The change is recording-only, so **the readings stand**: baseline R = 2 061.3 ± 50.3 at E = 1 910, B = 1 500 ms, and A5 UNRESOLVED as ruled.
- **The page** gained one dated line under `## Reading`:
  - the readings ran with `rating.ts` `d4b16e20…35fa`;
  - the merged harness is `rating.ts` `d6b2a988…b172` + `dist-manifest.ts` `78b1528e…357f`;
  - the readings stand.
- **Gates:** lint, typecheck and build 0; `npm test` 62 files, 2073/2073, `last-run.json` success, 0 pending, 0 todo; skips 0, `No findings.`
- **UAT:** the waiver still applies (0 production lines, no `src/` change). This verdict signs under `owner-delegation-2026-10-22/…5aaf7cec` item 2, as the earlier QE verdict did.
- **Owed:**
  - the Orchestrator merges `grugops/qe-fix-ABC-204` into the ABC-204 line, and rules ABC-204 Done;
  - QE-204-h's route is the Orchestrator's;
  - Security/NFR still reads QE-204-d (unchanged).
