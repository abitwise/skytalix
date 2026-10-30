---
subtask: arch-adr-accept-0052-0053-0054
role: architect-design
ref: .grugops/context/arch-adr-accept-0052-0053-0054/
branch: new grugops/arch-adr-accept-0052-0053-0054 from main, own worktree
---

# Architect: record the owner's acceptance of ADR-0052 (amended), ADR-0053 and ADR-0054

Source of truth: the owner-decision note `orch-2026-10-29g/…3dd61448`, which holds the owner's words verbatim.

## Do
- ADR-0052: Status → ACCEPTED 2026-10-30 by the owner, **with his amendment**. simple-tournament spends T = 22 000 ms
  under a 22 000 ms ceiling (was 22 500). Whole seconds; no sub-second budget or ceiling. Update D3, the constants, the
  examples and any arithmetic that used 22.5 s (e.g. the move-40 margin) to match. D4/D6 are unchanged. Close OQ-0052-1 by
  pointing to the note.
- ADR-0053: Status → ACCEPTED 2026-10-30 as written. Record OQ-228-1's answer: build the full design. If decision 9's
  forecast still misses G6, the owner said "increase 3s to 4s". Record those words verbatim. Mark the reading
  (G6 budget vs level-5 time) **pending the owner** and invent no meaning. Point out that the re-forecast runs first,
  on main with ABC-235/240 merged.
- ADR-0054: Status → ACCEPTED 2026-10-30 as written.
- On acceptance, add the dated pointer lines each ADR says it owes to the ADRs it amends (e.g. ADR-0002 cl. 3,
  ADR-0044 D2/D3/D6, ADR-0024 d4, ADR-0045 where named). Pointer lines only, no rewrites.
- ADR-0020 stays as it is (Q3 is still open).

## Fences
- memory-bank/50-decisions and your context only. No src/, tools/, data/, plans/ or board edits.
- Never push, force, amend or rebase. Never merge into main. No host paths in any commit. Never bare `npx`.

## Publish
- Seal notes (task `arch-adr-accept-0052-0053-0054`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus
  a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-adr-accept-0052-0053-0054`, cut from `main` `a046e839`. Commits `83ac150a` (records) and `d0fe0649` (note); tip `d0fe0649`. Not pushed and not merged.

- **ADR-0052: proposed → ACCEPTED 2026-10-30, with the owner's amendment** (verbatim in § Status).
  - `simple-tournament` spends T = 22 000 ms under a **22 000 ms** ceiling (was 22 500). `SIMPLE_TOURNAMENT_CEILING_MS` = 22 000, and `SIMPLE_TOURNAMENT_BUDGET_MS` = the ceiling. The names are kept because ABC-220 cites them. Everything is in whole seconds.
  - Updated in place: the amends list, D3 (heading, constants and the "why 22 000" bullets), D5's margin row (0 ms / 500 ms), D6's parenthesis, D7 and its accepted-risk text (≤ 22 s), D9's ENGINE_DEEP row, and § Consequences' NFR-004 text (22 s) and its AR-NFR004-A line.
  - D1, D2, `min(T, C)`, D4 (59.5 under 60), D6's clamp rule and D8 are unchanged.
  - **Arithmetic:** no period figure moved, because T was already 22 000. `C` starts at 22 375 at 40/15, 18 760 ms are left after move 40, the period use is 97.9 % (83.2 % with 6 book moves), and the closest call is ≥ 1 069 ms. Three things moved: the ceiling margin (500 → 0 ms), the busy latency (22.5 → 22 s) and the NFR-004 text (22.5 → 22 s).
  - The ≤ ~31 ms abort overshoot past 22 s is stated as AR-NFR004-A, the level-5 precedent (3 000 ms budget against ≤ 3 s). Security/NFR re-reads it at 22 s.
  - OQ-0052-1 is closed. In force at ABC-220's merge (`simple-tournament`) and ABC-221's merge (`uci-clock-mode`).
- **ADR-0053: PROPOSED → ACCEPTED 2026-10-30, as written.**
  - OQ-228-1's answer is recorded verbatim in § Status and decision 10. The full design is built, and (b) is not taken.
  - "Increase 3s to 4s" applies only if decision 9's re-forecast still misses G6. The re-forecast runs first, on main with ABC-235 `baf99a7c` and ABC-240 `5311f5bd` merged.
  - The reading (G6's budget, or level 5's per-move time) is **pending the owner**. No meaning is chosen.
- **ADR-0054: PROPOSED → ACCEPTED 2026-10-30, as written.** In force at ABC-230's merge. ADR-0020 is untouched, because Q3 is open.
- **Pointer lines (dated 2026-10-30, pointers only):**
  - ADR-0002: § Status, and after clause 3.
  - ADR-0024: § Status, and after d4.
  - ADR-0044: § Status ×2 (ADR-0052 on D3/D4/D5/D11; ADR-0054 on D2/D6), D2's import list, and D6's repetition row.
  - ADR-0045: § Status (A3's clamp, 32 000 → 60 000 at ABC-221).
  - ADR-0052's in-place folds stay BA/PM's at each build merge, as ADR-0052 assigns them.
- **Checks:**
  - `node tools/grugops/reference-check.js` printed `No findings.` (exit 0) on all 7 ADRs.
  - `git diff --stat main...HEAD -- src tools data plans package.json` was empty.
  - The host-path and IPv4 scan of the added lines found 0 hits.
- **Note:** `.grugops/context/arch-adr-accept-0052-0053-0054/notes/20261030T042437Z-architect-design-decision-90b9d283.md` (decision). It was sealed by grugops 2.2.0 `admitAndAppend` with `at` from `date -u`, read back by `readContext` (1 note), and its index was rendered.
- **For BA/PM (`bapm-owner-adr-fold`):** ABC-220:62/64 still read `22 500 − 500` and a 22 500 ceiling. Both now read 22 000, and the constant names are unchanged.
- **For the owner, only on a re-forecast miss:** what "increase 3s to 4s" means (G6's measurement budget, or level 5's per-move time).

### Trace row (10 cells, header order)

| EPIC-009 / EPIC-010 (arch-adr-accept-0052-0053-0054) | ADR-0052 ACCEPTED with the owner's 22 s amendment (T = ceiling = 22 000 ms, whole seconds); ADR-0053 ACCEPTED, OQ-228-1 answered (build fully; 3s→4s reading pending owner on a miss); ADR-0054 ACCEPTED; dated pointers in ADR-0002/0024/0044/0045 | EPIC-009, EPIC-010 | — | NFR-004 text 22.5 → 22 s (Security/NFR places; AR-NFR004-A re-read at 22 s); NFR-005 per OQ-228-1 | `grugops/arch-adr-accept-0052-0053-0054` @ `d0fe0649` (on a046e839)<br>ADR-0052/0053/0054, ADR-0002/0024/0044/0045 + note …90b9d283 | records only: fenced diff empty; reference-check No findings ×7; host-path scan 0 | — | — | ADR-0052/0053/0054 ACCEPTED; in force at ABC-220/221, ABC-228/229, ABC-230 merges |
