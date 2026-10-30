---
subtask: arch-q3c-oq228ii
role: architect-design
ref: .grugops/context/arch-q3c-oq228ii/
branch: new grugops/arch-q3c-oq228ii from main, own worktree
---

# Architect: record Q3 (c) as an ADR-0020 amendment, and OQ-228-1 (ii) in ADR-0053

Source: the owner-decision note `orch-2026-10-29g/…c4ab73de` (owner verbatim: "QQ-228-1: ii ; Q3: c"). Your own Q3 table is
in `arch-ABC-230-reading/…90a3aa31` § 3.

## Do
- **Q3 (c):** write the design for "normalise for the game-history comparison only". One helper: the oldest key of the
  reversible window loses its ep file when that position has no ep capture. It is used by ABC-230's prior-key builder AND
  by history.ts's game-end count. The hash is unchanged. Choose the form: a dated amendment section in ADR-0020, or a new
  ADR that amends ADR-0020 d2's consequence. Either way it is **ACCEPTED 2026-10-30 on the owner's word** (cite the note).
  State: value-changing (10 D + 10 R smoke), size S, built after ABC-230 merges, the tests it owes, and the
  ADR-0011 / history.ts licence surface it touches.
- **OQ-228-1 (ii):** in ADR-0053 decision 10, replace "pending the owner" with his answer (ii). On a G6 re-forecast miss,
  level 5's per-move time becomes 4 000 ms. Spell out the consequences that build would carry: an ADR-0045 amendment,
  G9 waived for that ticket, the R mode's frozen 3 000 ms and EPIC-008/010 reference readings moving, and what must be
  re-read. Nothing changes if the forecast meets G6. Add a pointer line in ADR-0045 § Status ("conditional, see ADR-0053 d10").

## Fences
- memory-bank/50-decisions and your context only. No src/, tools/, data/, plans/ or board edits. An SE is building
  ABC-230 in parallel; don't touch its files.
- Never push, force, amend or rebase. Never merge into main. No host paths in any commit. Never bare `npx`.

## Publish
- Seal notes (task `arch-q3c-oq228ii`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.

## Result

Done, records only. Branch `grugops/arch-q3c-oq228ii`, from `main` `c0698ddd`. Records `7c14f719`, notes `1f3a6534`; this queue move is the branch head. Not merged and not pushed.

- **Q3 (c): a dated amendment section in ADR-0020** (§ AMENDMENT 2026-10-30), plus a § Status block and one line under d2's threefold bullet. **ACCEPTED 2026-10-30 on the owner's word (…c4ab73de).** It is not a new ADR: it amends one consequence bullet, and d1, d3 and the hash stand.
  - C1, the repetition key: `zobristKey` with the ep file XORed out when the ep square is set and `hasLegalEnPassant` is false. Only a window's oldest position can carry ep, so the per-position form is the "oldest key of the window".
  - C2, one helper, in `src/gameend.ts`, plus one `zobrist.ts` export (the ep component). No new `legal.ts` edges.
  - C3, both halves land together:
    - `keyHistory` stays the hash list;
    - a new history.ts repetition-key list feeds `repetitionCounts` (still the one supplier), and the `gameStatus` lookup uses the helper;
    - turn-loop `claimShortfall` counts the same list;
    - the cli.ts injection, UCI `parsePosition` and the blunder-path root key all produce repetition keys.
  - C4: in-tree double pushes and an ep-carrying root stay one late, in the safe direction.
  - Licence surface: `LICENSED_DRIVERS` is unchanged, the single supplier and ABC-081 A6 hold, and history.ts's imports do not change. uci-session.ts gains `gameend.ts`, which is one ADR-0044 D2 allowed-list entry, with a pointer.
  - Value-changing (10 D + 10 R smoke). Size S. Built after ABC-230 merges. The tests it owes are listed in the amendment.
- **OQ-228-1 (ii): recorded in ADR-0053 § Status, the d9 miss bullet, and a d10 2026-10-30 block.** "PENDING THE OWNER" is struck and kept. On a re-forecast miss, `LEVELS[5]` and `DEFAULT_BUDGET_MS` go 3 000 → 4 000 in ABC-228. Nothing changes if the forecast meets G6.
  - The re-forecast at 4 000 ms has a bar of ≤ 133 %. Above that, the question goes back to the owner.
  - G9 is waived for ABC-228 on `LEVELS[5]` only.
  - ADR-0045: D1, D2, and A3's level-5 margin (1 000 ms; the 5 s ceiling is kept).
  - NFR-004: ≤ 4 s. NFR-005's referent becomes 4 s.
  - Gates: G5 ≤ 4 s. G6 reads each build at its own `LEVELS[5]`. G11 is read at 4 s, and G8 reads the real-clock rows.
  - R moves to 4 000 ms through the `tools/rating/rating.ts:405` literal. The 3 000 ms references stay as history. The trend pool closes at the merge. Batches run both sides at 4 000 ms.
  - Re-reads: the ladder verdict (STALE, ADR-0038 d6), ABC-231 A1, any EPIC-009 fixed-budget reading, the AGENTS.md level line, and ADR-0044 D11.
- **Pointers (dated 2026-10-30):**
  - ADR-0045 § Status ("CONDITIONAL … see ADR-0053 decision 10");
  - ADR-0054 § Status, and its Q3 consequence;
  - ADR-0044 D2's allowed list (`gameend.ts`).
- **Checks:**
  - `node tools/grugops/reference-check.js` printed `No findings.` (exit 0) on all 5 ADRs.
  - `git diff --stat main...HEAD -- src tools data plans package.json package-lock.json` was empty.
  - The host-path, IPv4 and user-name scan of the added lines found 0 hits.
- **Notes**, sealed by grugops 2.2.0 `admitAndAppend` with `at` from `date -u`, read back by `readContext` (2 notes), index rendered:
  - `.grugops/context/arch-q3c-oq228ii/notes/20261030T044213Z-architect-design-decision-b86f7d93.md` (decision);
  - `.grugops/context/arch-q3c-oq228ii/notes/20261030T044205Z-architect-design-observation-54dd698c.md` (observation: file:line facts).
- **Queue:** claimed in the main checkout with `claimTask` and `transition` at 04:29:45Z. The worktree guard refused edits to the shared checkout, so the move to done/ is made on this branch (`git mv` of the tracked brief, plus this claim.md). **The Orchestrator removes the untracked `.grugops/queue/claimed/arch-q3c-oq228ii/` from the main checkout at merge.**
- **Next, for BA/PM (records):**
  - (1) Cut the Q3 (c) ticket from ADR-0020 § AMENDMENT 2026-10-30. It is S, value-changing, and waits on ABC-230's merge. Fold EPIC-010: Q3 answered (c), the § Out of scope ep line, the § B item 3 row, and the owner-questions table.
  - (2) Fold (ii) into ABC-228: the 133 % re-forecast, the conditional G9 waiver, G5/G6/G11 under (ii), the rating.ts R literal (ABC-228 or ABC-225), the trend-pool close, and the 4 000 ms batches. Fix EPIC-010's "pending the owner" line.
- **For the Orchestrator:** the ADR-0044 D2 `gameend.ts` entry is taken as a direct consequence of (c). If it needs its own owner word, the fallback home is `legal.ts`, which costs two new edges and a collision with ABC-229.

### Trace row (10 cells, header order)

| EPIC-010 (arch-q3c-oq228ii) | Q3 (c): ADR-0020 § AMENDMENT 2026-10-30 ACCEPTED on owner word (repetition key = ep file out when no legal ep capture; one helper in gameend.ts; history.ts count + prior keys together; hash unchanged); OQ-228-1 (ii): ADR-0053 d10, on a G6 re-forecast miss level 5 → 4 000 ms in ABC-228 with its consequences; pointers in ADR-0044/0045/0054 | EPIC-010 | — | NFR-004 ≤ 3 s → ≤ 4 s and NFR-005 referent → 4 s, conditional on (ii) (Security/NFR places); NFR-002 one hasLegalEnPassant per double push (UNKNOWN - verify) | `grugops/arch-q3c-oq228ii` @ `1f3a6534` (on c0698ddd)<br>ADR-0020/0053, ADR-0044/0045/0054 + notes …b86f7d93, …54dd698c | records only: fenced diff empty; reference-check No findings ×5; host-path scan 0 | — | — | Q3 (c) ACCEPTED, in force at its own ticket's merge (after ABC-230); (ii) conditional, in force only on an ABC-228 re-forecast miss |
