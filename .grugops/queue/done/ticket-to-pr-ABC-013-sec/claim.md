---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-sec
by: security-nfr
at: 2026-08-10T13:35:59Z
completed_at: 2026-08-10T13:57:25Z
method: MANUAL-BY-HAND
outcome: |
  SECURITY/NFR VERDICT **PASS_WITH_RISKS**. NO REQUIRED FIX. Nothing high or medium, so nothing
  blocks at `security.block_on: high`. `ABC-013` MOVED `In Security/NFR` -> `Ready for UAT`
  (In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4); the `Ready for UAT` exit is the UAT
  Planner's and was NOT taken. NOTHING MERGED, NOTHING DEPLOYED.

  **THE GATE WAS SPLIT AND BOTH HALVES WERE RUN.**

  **SECURITY HALF: UNTRIGGERED — and confirmed by MEASUREMENT rather than by repeating the ticket.**
  All 628 new lines read for the one question (`san.ts` 148, `san.test.ts` 371, `san.nfr.test.ts`
  109). `toSan` **accepts no string parameter of any kind**, so no user-supplied string can reach it
  even in principle; no I/O, no network, no filesystem, no `process`, no `eval`/`Function`/dynamic
  import, no logging, no `try`/`catch`, no dependency — `package.json` and `package-lock.json`
  byte-identical to `main`, re-checked here. **THE EXPOSURE SURFACE WAS MEASURED: 351,644 SAN strings
  over 8,478 positions — MAX LENGTH 7 CHARACTERS, 27 distinct characters, code points 0x23-0x78,
  ZERO control bytes, ZERO ESC, ZERO C1, nothing above U+007E** — which closes for this module BOTH
  the unbounded-string frame-buster `NFR-002` names AND the escape-injection class `ABC-018` carries.
  Three candidate risks CHECKED and NOT reported as risks: the `makeMove`/`unmakeMove` window needs
  no `try`/`finally` because `grep -n throw` across `apply.ts`/`legal.ts`/`moves.ts`/`position.ts`
  returns NOTHING; the test file's one `readFileSync` reads its own source at a fixed URL; both
  regexes are linear (no ReDoS). ASVS filtered to L1 (70 of 345): nothing engaged, `V1.3.2` PASS,
  `V2.2.1` not a fail (a `Move` from this repo's own generator is not a security-decision input),
  and `V13.4.1` / `V15.1.1` / `V15.2.1` UNTOUCHED and NOT RELAXED.

  **NFR HALF: `N1`-`N4` RE-DERIVED INDEPENDENTLY AND ALL FOUR ARE MET. NO TARGET MOVED,
  `plans/nfr-catalog.md` NOT EDITED, NO NFR BAR IN THE TICKET EDITED.** Own harness outside the
  repository importing `src/` by absolute path; TWO BUILDS (delivered, plus a REFERENCE build that
  allocates a rivals array per call, proved string-identical on all 42 moves in both call forms
  BEFORE timing); TWO PROTOCOLS (per-move tight loop; per-call timing inside a 42-move sweep); 11
  rounds with round 0 discarded, medians of per-round means; TWO fully independent samples in
  separate OS processes; Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN -
  verify` elsewhere; null floor 0.0009 us. `P60` re-verified at 42 legal moves / 3 checks, `toFen`
  byte-identical before and after. **`N1` 8.82x / 8.80x against >= 5x (MET, 1.76x headroom) - `N2`
  0.480 / 0.482 us against <= 0.75 (MET) - `N3` 4.235 / 4.243 us against <= 6.5 (MET) - `N4` worst
  10.307 / 10.350 us unassisted and 5.649 / 5.677 supplied against <= 14 (MET, 0.74x).** All four
  hold under BOTH protocols in BOTH samples, and **the Engineer's four figures REPRODUCE to within
  0.4-1.5%**.

  **THE `N4` ATTRIBUTION WAS TESTED AND THE ANSWER IS SPLIT: HIS CONCLUSION HOLDS, HIS MECHANISM DOES
  NOT.** (1) The delivered build is NOT slower — on ONE instrument it is **1.2-1.9% FASTER** than the
  allocating reference build on every aggregate and its per-move worst is LOWER (10.307 / 10.350
  against 10.485 / 10.549), so his conclusion is now POSITIVELY ESTABLISHED rather than merely
  unrefuted. (2) The claimed cause — a tight loop against a warm 42-move sweep — is **REFUTED**: the
  sweep protocol reads the SAME OR HIGHER on the same build (10.392 / 10.629), never lower, so the
  direction is wrong. (3) **THE REAL CAUSE IS AN AGGREGATION, NOT AN INSTRUMENT: the reference's
  published `worst 9.34 / 9.25 us` IS A MEAN OVER THE THREE CHECKING PIECE MOVES** — byte-identical
  to the `checking PIECE moves only (3)` row in BA/PM's own bench note — and this gate's reference
  build reproduces that group mean at 9.353 / 9.383 us while its TRUE per-move worst is 10.485-10.603.
  On the delivered build the three checking moves read 10.307 / 8.917 / 8.462: mean 9.229, maximum
  10.307. So `N4`'s measured cell is MISLABELLED and the 14 us bar is ~1.32x of a true reference
  worst rather than the 1.5x its derivation implies — still MET at 0.74x, and a HUMAN decides whether
  it moves.

  **`N1` IS MACHINE-INDEPENDENT AND NOT POSITION-INDEPENDENT, MEASURED: 4.33x startpos, 4.94x
  perft-3, 8.94x `P60`, 21.5x perft-5, 24.65x kiwipete — BELOW ITS OWN 5x BAR AT TWO OF FIVE
  POSITIONS**, because a pawn move never builds a legal list. `N1` is MET because it PINS `P60`.

  **`NFR-002` RE-DERIVED AND INTACT: 107.9 / 106.1 us at 40 plies and 416.5 / 410.5 us at 120 plies =
  2.60% / 2.57% of a 16 ms frame** (the ticket's 395 / 392 reproduced to within 5%, inside
  `ADR-0004`'s band); the bounded 8-move-pair pane 90.9 us and REPLAY-dominated; labelled arithmetic
  ceiling 1.24 ms = 7.8% of a frame if all 120 plies were the worst move measured. **`NFR-003`:
  42 x 0.480 us = 20.2 us, ~4,950x under the 100 ms budget.**

  **GATE RE-RUN ON THE BRANCH TIP BY THIS ROLE:** lint exit 0, typecheck exit 0, build exit 0,
  `npm test` **652/652 on 20 files**, skip count **0**, `src/` diff still three added files
  **+628/-0**, `src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959` unchanged. **TEST-INTEGRITY
  CHECKER EXIT 2** — registry `.grugops/test-skips.md` absent, so it could not run; recorded as an
  ERROR and never as a pass, pre-existing, with the skip count independently 0.

  **ONE DEFECT FOUND AND REPAIRED OUTSIDE `src/`: `plans/traceability.md`'s `ABC-013` row was
  STRUCTURALLY BROKEN.** The previous hop's write put its Tests text into the **UAT** column and its
  Status text AFTER the trailing pipe, leaving the only row in that file without a closing pipe,
  eleven content cells against a ten-column header, and a Status cell still reading `In Review` two
  commits after the ticket left that column. That hop's guard ("the row at exactly 11 unescaped pipes
  before and after") was TRUE and blind — **a pipe COUNT cannot see a pipe MOVE**, the same class as
  the board-write fault it published against itself one commit later. Repaired here byte-for-byte
  (content moved, never rewritten) with every other table line asserted identical.

  **FOUR ACCEPTED RISKS, EVERY ONE WITH A NAMED OWNER AND A TRIGGER:** `RISK-ABC013-01` LOW — `N4`'s
  measured cell is a group mean labelled a worst (owner **BA/PM**, trigger: the next `N4`
  re-derivation or any argument about the 14 us bar). `RISK-ABC013-02` LOW — `N1` is not
  position-independent (owner **Security/NFR**, trigger: any re-derivation away from `P60`).
  `RISK-ABC013-03` LOW — `toSan` is silently wrong on a broken caller obligation, with no validation
  and no log; zero importers today (owner **BA/PM at `EPIC-003`**, trigger: the first caller).
  `RISK-ABC013-04` LOW — QE's five criteria gaps stay open and were WEIGHED here as bearing on
  NEITHER half (owner **BA/PM**, trigger: before `ABC-016`/`ABC-017` consume `toSan`).

  **WHAT I DO NOT CERTIFY:** that `N2`/`N3`/`N4` hold on any other machine; that `N1`'s floor is
  4.33x (five positions is a sample, not a bound); that 14 us is the right `N4` bar — this gate
  established that its derivation is wrong and deliberately did NOT move it; that `P60`'s worst case
  is the worst case anywhere; that `NFR-002` holds for a REAL frame, since every `EPIC-002` figure
  this project holds was measured on a component in isolation and nobody has measured the sum; that
  the security half survives `EPIC-003`, which adds a STRING-taking `parseSan` to this same file and
  RE-OPENS the posture; that the test-integrity step passed (exit 2, a human owns the registry); or
  that `ABC-013` may leave `Ready for UAT` — that exit is the UAT Planner's.

  **NO FILE UNDER `src/` WAS TOUCHED** — no module, no test, not one character. No criterion, FEN,
  expected string or NFR bar edited. `plans/nfr-catalog.md` not edited and no catalog target moved.
  `ADR-0004` not re-opened. `npm run perft` NOT run and no result reported for it.
moved: pending/ -> claimed/ticket-to-pr-ABC-013-sec/ -> done/ticket-to-pr-ABC-013-sec/ — ALL BY HAND.
---

Queue claim record (CLAIM-01/CLAIM-02). Atomic `mkdir` of this directory returned exit 0, so this
role is the first and only writer; a second writer would have taken `EEXIST`.

`scripts/claim.js` does not exist in this install — re-checked at the source rather than inherited
from the subtask brief or from the claim records already under `done/`. The claim was taken by hand
with a plain atomic `mkdir(2)`, the same primitive `claimTask` relies on, so the exactly-once
property is unchanged. The `pending/ → claimed/` transition was `rename(2)` (`git mv` refused — the
file was untracked — so plain `mv` was used, which is the same atomic rename Workflow 17 step 3
names).

`pending/` held exactly one file and `claimed/` was empty when this hop started, so queue width was
1 and no contention was possible: **the claim is degenerate**, recorded rather than glossed. No
stale-claim sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer `scripts/context-io.ts` is likewise absent, and the structured
`mcp__grugops__propose_note` tool is **not** in this session's tool set — checked against the tools
actually available rather than assumed. Notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-013/notes/` in the established layout. **No `finding` is
written**: none is admissible on this task, because there is no `§14-gate` verdict record under it to
issue a `§14-gate#<id>` stamp (`emitVerdict` lives in the absent `context-io.ts`) and
`context.human_admission` is `off` in `.grugops/factory.config.json`, so no `human:<name>` stamp
exists either. The measured results are recorded as `observation`, the verdict as `decision`, and the
limits as a `claim` carrying `confidence: UNKNOWN - verify` — the honest degrade Workflow 16 step 4
names. No `index.md` / `index.jsonl` is hand-faked. This is the fourth hop in a row to record that
gap on this task.

`at` and `completed_at` are taken from `date -u`, never from a local clock or a test runner's
`Start at` line. This machine is UTC+3: `date -u` read `13:35:59Z` against local `16:35:59 EEST` at
the start of this hop.
