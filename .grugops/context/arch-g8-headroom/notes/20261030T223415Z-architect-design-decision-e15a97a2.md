---
id: 20261030T223415Z-architect-design-decision-e15a97a2
kind: decision
by: architect-design
at: 2026-10-30T22:34:15Z
verified_by: 
confidence: high on the mechanism (ADR-0027 cost model, ADR-0046 D2(b) precedent) and the SEC-REBASE-b reading; savings and queue costs are estimates, UNKNOWN - verify until the remedy ticket's QE gate reads them
refs:
  - arch-g8-headroom
  - NFR-008
  - QE-229-a
  - SEC-REBASE-b
  - ADR-0046
  - ADR-0035
  - ADR-0027
  - ADR-0040
  - ABC-229
  - ABC-220
  - ABC-228
  - ABC-230
  - ABC-241
  - ABC-242
  - ABC-243
  - ABC-221
  - ABC-177
  - G8
  - qe-ABC-229/20261030T202320Z-qe-e2e-observation-0b7fd4f6
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-58af5b6a
  - secnfr-catalog-rebase
  - d1b14662
supersedes: 
seal: sha256:2c6a942049969bd7440f62f783d478da0fa150974677dd757f93f066a490e76a
---

# Architect/Design decision, arch-g8-headroom: win the headroom back with option (a). Time-blind virtual-clock rows take the coarsest kill-set-preserving step (`ADR-0046` § Addendum 2026-10-30, PROPOSED), target `G8` ≤ 9.4 s. `load1 ≤ 8` stands on the 24-CPU reference (`SEC-REBASE-b`). No owner question

Records only, on branch `grugops/arch-g8-headroom` from `main` `d1b14662`. Nothing was run or timed. No `src/`,
`tools/`, `data/`, ticket or board file was touched. The cost evidence is this task's observation note (same seal).

## The problem (QE-229-a MEDIUM; SEC-REBASE-b LOW)
- `NFR-008` R-1 reads `npm test` wall ≤ 10 s at load1 ≤ 8.
- **`ABC-229`'s `G8`:** head 9.90 s and base 9.90 s, so the headroom is 0.10 s.
- **The spread is wider than the headroom:**
  - base's own runs span 9.64–10.09 s;
  - the same lane inputs read 9.73 s and then 9.90 s in two windows.
- **Three Ready tickets add default-lane rows:** `ABC-243`, `ABC-242` and `ABC-221`.

## Options weighed
- **(a) Make slow rows cheaper with no coverage loss: CHOSEN, as tranche 1.**
  - Why ≈ 2 s on a virtual clock:
    - a search costs about 1 024 × (budget ÷ step) nodes (`ADR-0027`, `NODES_PER_CLOCK_CHECK`);
    - at level 5 that is 40 reads at step 100, 60–70 ms per search;
    - `ABC-228` (ii)'s 3 000 → 4 000 ms raised every row that takes its budget from `LEVELS` by 33 %.
  - **The rows that read no time:** the `ABC-230` and `ABC-241` blocks in `src/cli.test.ts` and
    `src/uci-session.test.ts`, 1.43 s of in-thread time in all. Every one of them reads a move, a score (0, or
    not 0) or the keys handed, on 3–4-piece endgames where the repetition is 1 ply deep.
  - `ADR-0046` D2(b)'s rule (the coarsest step in {1, 10, 100, 1 000} with an identical kill set) is already
    accepted. It moved `ABC-167`'s class H rows to step 1 000 at `ABC-177`.
  - **Expected: −0.3 to −0.65 s of wall.** This is an estimate.
  - Rejected under (a):
    - `cli.test.ts`'s 28 children (≈ 3.4 slot-seconds). They are distinct and pinned by count, and they must be
      synchronous (`C2`).
    - The per-file overhead (≈ 7.8 slot-seconds), fenced by `ADR-0040`.
    - `search.null-move.test.ts` (1.44 s). It is fixed-depth and assertion-bearing, so any cheaper form changes the
      instrument. It goes to tranche 2.
- **(b) Move named rows to an opt-in lane: TRANCHE 2 ONLY**, behind a trigger and a BA/PM ruling.
  - **T2a:** UCI class P/C rows to `UCI_DEEP`.
    - Estimate −0.3..−0.45 s.
    - The default lane would lose the end-to-end D4 time-rule pins, which `ABC-221` is about to change. That is
      the wrong moment to blind them.
  - **T2b:** `QE-208-a`, `QE-208-b` and A2's depth-6 rows to `SEARCH_DEEP`.
    - Estimate ≈ −0.45 s.
    - The default lane would lose `ADR-0050`'s abort-restores-root and key-under-null guards.
  - **T2c:** sample `QE-208-a`'s sweep more sparsely, under parity. Estimate ≈ −0.1 s.
  - **`cli.test.ts` children to `CLI_DEEP`:** rejected, as at `ADR-0046` O4. The default lane would lose its
    delivered-command and security bars.
- **(c) Re-read the bar on the 24-CPU reference: RULED, and it buys nothing.**
  - `ADR-0035` § Addendum 2026-10-30 (SEC-REBASE-b) sets this out.
  - The lane's demand is fixed by value (2 workers, 1 synchronous child). Load1 8 on 24 logical CPUs leaves about
    16 idle, so the band is tighter relative to capacity than it was on the 8-core M3. **"load1 ≤ 8" stands as
    written, and nothing is re-graded.**
  - QE already reads `G8` at load1 ≤ 2 after a wait-clear, so no headroom hides in the qualifier.
  - One stale catalog sentence is routed to Security/NFR: "the wall clause is a function of CORE COUNT". Under the
    by-value cap the wall is a function of per-thread speed.
- **(d) Raise the 10 s level: NOT ASKED.** It is the owner's call, and (a) is available. It reaches him only if the
  lane is still over 9.7 s after tranche 2 (`ADR-0035` D6). The same applies to the other owner levers,
  `maxWorkers: 3` and the heap rows.

## Recommendation
- **Cut one test-only ticket (S, P1)**, called below "the remedy ticket". BA/PM gives the step word at the cut, as
  for D2(b). Its rules are `ADR-0046` § Addendum 2026-10-30 R1–R4:
  - **R1:** a census line per virtual-clock row in the build note, giving reads per search.
  - **R2:** time-blind rows take the coarsest kill-set-preserving step in {1, 10, 100, 1 000}.
  - **R3:** paired surfaces move together, so the step is one value on both the CLI and UCI:
    - `uci-session` `ABC-230` A2 with `cli` `ABC-230` A1;
    - `ABC-241` A5 with `ABC-241` A4.
  - **R4:** new rows obey R1–R3 at their own ticket.
- **Files:** `src/cli.test.ts` and `src/uci-session.test.ts` only.
  - In scope: the 18 rows of the four blocks, plus any other time-blind row added after `ABC-177` that the R1
    census finds in those two files.
  - Fixed: the row count, every assertion bound and every row title. No production file, config, `AGENTS.md` or
    `tools/` changes.
- **The checks (QE, at its gate):**
  - A node census per changed row, base against head.
  - Kill-set parity per changed row, using QE's `ABC-230` / `ABC-241` mutants plus the named wrong builds: a seam
    that ignores the injected keys, a session that hands untrimmed keys, and a repetition that scores non-zero.
  - `N8-LANE` on the two-file set.
  - `G8` interleaved b h h b b h after a wait-clear, as at `qe-ABC-229`.
- **Target: `G8` head median ≤ 9.4 s at the remedy ticket's gate.** That is 10 s − 3 × 0.17 s of window drift,
  rounded down. It is a design target, not an NFR level. `NFR-008` stays 10 s.
- **Triggers:**
  - over 9.4 s at that gate, or any later `G8` head median over 9.6 s, opens tranche 2;
  - still over 9.7 s after tranche 2 sends it to the owner.

## Tickets to cut or amend (BA/PM; text only for the amendments)
1. **NEW (S, P1, test-only):** "time-blind virtual-clock rows in `src/cli.test.ts` and `src/uci-session.test.ts`
   take the coarsest kill-set-preserving step (`ADR-0046` § Addendum 2026-10-30)".
   - **Pull order:** before `ABC-242`'s build and before `ABC-221`'s. Both edit `src/uci-session.test.ts`, and
     `ABC-242` also edits `src/cli.test.ts`.
   - `ABC-243` can go before or after. It is one in-place edit plus one row, about +0.03 s.
2. **`ABC-242` amendment (`NFR-008` line and Test notes).**
   - Its default-lane rows (`levels.test.ts` A1–A6, `cli.test.ts` / `uci-session.test.ts` A4) record their reads
     per search (R1).
   - Time-blind rows take R2. A4's three-way row takes R3.
   - **QE's probe set-up (rate 1, 2 000 ms, `virtualClock(1)`, about 2 000 reads per scored list) is not the lane
     form (R4).** Level 1's own 100 ms at the coarsest step with parity is.
   - Estimate +0.05..+0.15 s under the rule. It could add seconds if the probe form is copied.
3. **`ABC-221` amendment (A9).** Its real-engine default-lane rows (A8's parity rows, A11's lane row) record their
   reads (R1). The period rows A2–A4 stay on the stubbed `chooseMove`, as `ABC-220`'s do. Estimate about +0.1 s.
4. **`ABC-243`: no change.** Its bare `go` reads time (class P, 40 reads).

## Owner question
- **None.** No NFR level, bar, cap, pin, worker count, heap row or lane line moves. The step rule's extension needs
  BA/PM's word, as its precedent did.
- (d) and the owner-held levers are named, but not asked.

## Not done here
- No `NFR-008` catalog cell is edited. The stale core-count sentence is routed to Security/NFR at its next catalog
  hop.
- No board or ticket edit was made, and no `F` moved.
