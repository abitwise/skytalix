---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:59:31Z
subtask: qe-ABC-279
role: qe-e2e
ref: .grugops/context/qe-ABC-279/
branch: grugops/ABC-279 (frozen 1feb7560, src tree 9e50717b; tip d00d00a8) — worktree .claude/worktrees/se-ABC-279; merge main into it first if needed
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. **Game reads ALONE: wrap each whole match (C2′ 100 games, S′ 10 games) in ONE flock so nothing else runs during it**; record uptime/load at start and end. Set CUTECHESS_CLI and STOCKFISH (QE-269-j). C2′ ~100 games at 100 ms is well under 1 h; any single run forecast > 1 h: stop and ask. Host paths only as placeholders.
---
# QE ABC-279 (Q1, ADR-0069 ACCEPTED): verify the build and run A6 — one read, final
Read plans/tickets/ABC-279*.md (A1–A6), ADR-0069 bars, se-ABC-279 notes (…821f0628, …a2b9d7c5, …f4c7c263 rows moved), ADR-0067/0064 B-T4-style re-pin rule (…42c82347 for the pin/bar line).
- Seal a PREREG before any game: C2′ = 100 games at 100 ms vs main's merge-base (rating tool `d` / per-change form), GAIN ≥ 50.0 / 100; S′ 10 games at 0.5 s vs Stockfish E 1 810; Levels deep lane. A miss is final — no re-play, no margin, no form change.
- Re-grade offline: A1 (incl. the A1 (b) wording point — rule it as a gap, not a bar move), A2/G4 cross-build node identity (out of tree), A3, A4, A5, G6, G2 by byte identity. Check the rows moved (re-pointed vs re-pinned) obey pin/bar: no zugzwang, mate floor, G1 or relation row re-pinned.
- Orchestrator ruling recorded here: the SE's edits to src/quiescence.ts and src/engine.ts at the seam are within scope (ticket Files line, ADR-0069 d6/d7/d9) — check they touch nothing else.
- Re-read N8-LANE (NFR-008 10 s) ALONE: base and head, ≥ 5 interleaved runs each; report vs bound; a pre-existing base breach is recorded as such.
- Verdict PASS / PASS_WITH_GAPS / FAIL; your verdict signs UAT (owner delegation).
## Fences
tests and your records on that branch; no production src edits (a defect goes back to SE). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-279, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result

**2026-11-04, QE/E2E. Verdict PASS_WITH_GAPS, with no blocking gap. Every ABC-279 bar (A1–A6, ADR-0069 d10–d13) is MET on the frozen build `1feb7560` (`src/` `fe6a0975`), so this verdict signs UAT (owner delegation). The PREREG (`…0ea488ab`) was sealed and committed at `109ecc25` before any game, and each read was taken once. Nothing was pushed or merged, and nothing is left running.**

- **A6 (verdict `…6e99201a`, A6 note `…d5ee89a8`):**
  - **C2′:** `rating.ts d 1feb7560 00e99db8 --budget-ms 100 --rounds 50 --concurrency 1`, the whole match in one lock. 100 / 100 complete, **W/L/D 42 / 34 / 24 = 54.0 ≥ 50.0, MET**. Elo +27.9 ± 60.0, 0 faults, 0 losses on time, max latency 105 ms.
  - **S′ at E 1 810:** 10 / 10 complete, **5 / 4 / 1 = 5.5 ≥ 3.0, MET**. 1 844.9 ± 237.0, 0 faults, 0 losses on time.
  - **Levels deep lane:** exit 0, **57 / 57**.
  - **G11** is reported: the head plays differently at 8.e5 and 13.d4 (it leaves game 1's d4).
- **Offline (note `…928cf0c1`):**
  - **A1:** 43 / 43 committed rows, plus QE's own 14 hand rows and the truth table, 22 / 22.
  - **A2 / G4, out of tree:** the new doors equal base shipped on 1 990 rows, and the 13 + 7 older doors equal their base selves on 13 244 rows, with 0 mismatches. Exports +1 / +1 / 3.
  - **A3 / A4 (a), (b):** the committed deep rows, 52 / 52, with exact instrument counts. Drift 96.26 % / 95.72 %, max 66 / 96, mate floor 0 / 190, zugzwang 7 / 7. d8 0.7208 / 0.2652 / 0.5909 / 0.2160, reach +0.837.
  - **G6 ALONE:** kiwipete 9 / 9 and position-6 10 / 12 (medians), with no run below 9.
  - **G2:** by byte identity.
  - **G1:** 54 / 58, none newly missed.
  - **Scope:** the edits to `src/quiescence.ts` and `src/engine.ts` are at the seam only.
  - **Rows moved:** they obey the pin / bar rule. No zugzwang, mate-floor, G1 or relation row was re-pinned.
- **N8-LANE (note `…40322a47`), ALONE, 5 + 5 interleaved:** base median 9.29 s, head median 9.42 s, max 9.50 s ≤ 10 s. No base breach, and the Engineer's 10.13 s did not reproduce.
- **Gaps (note `…c49b050d`):** 0 blocking, 0 high, 0 medium.
  - Low:
    - QE-279-a: A1 (b)'s wording cannot be met as written (the guard clauses are redundant at threshold 0). Architect, dated wording line.
    - QE-279-b: the Engineer's Result names `src/` tree `9e50717b`, but that is `cd9ccd10`'s. `1feb7560`'s is `fe6a0975`.
    - QE-279-c: `F9`'s margin on kiwipete is 0 (head nps about 0.80 ×).
    - QE-279-d: C2′'s interval spans 0.
    - QE-279-e: N8 headroom is about 0.5 s.
  - Information:
    - QE-279-f: the `ABC-122` oracle record gained `taper: true`.
    - QE-279-g: the AGENTS.md lane line for `src/see.test.ts` deep is owed (Orchestrator).
- **Owed:**
  - **Orchestrator:** the UAT `decision` naming `…6e99201a`; the merge on green before `ABC-239`'s B-T7 / B-T8 freeze (`main` `src/` is still `4cb84035`, so no re-base is owed); pool S′ on merge; QE-279-g.
  - **Architect:** QE-279-a.
