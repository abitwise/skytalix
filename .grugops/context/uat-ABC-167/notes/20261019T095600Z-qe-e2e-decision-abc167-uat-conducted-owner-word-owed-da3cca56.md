---
id: 20261019T095600Z-qe-e2e-decision-abc167-uat-conducted-owner-word-owed-da3cca56
kind: decision
by: qe-e2e
task: uat-ABC-167
at: 2026-10-19T09:56:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - ABC-168
  - ABC-171
  - ADR-0044
  - NFR-004
  - NFR-008
  - R-167-1
  - R-167-2
  - UAT-167-a
  - UAT-167-b
  - UAT-167-c
  - grugops/ABC-167
  - grugops/uat-ABC-167
  - 20261019T095300Z-qe-e2e-artifact-ref-abc167-uat-pack-af06cf1f
  - 20261019T095400Z-qe-e2e-observation-abc167-uat-run-thirteen-scenarios-4da0ace4
  - 20261019T095500Z-qe-e2e-observation-abc167-not-observable-until-abc168-abc171-19c7115a
  - 20261019T095550Z-qe-e2e-observation-abc167-gates-fences-controls-530eb78c
  - 20261019T094500Z-orchestrator-decision-owner-word-qe146a-qe166a-r1672-uat167-by-qe-5d7c2e18
  - 20261019T085800Z-security-nfr-decision-abc167-pass-with-risks-99713c0e
supersedes:
---

# UAT `ABC-167` conducted: PASS_WITH_GAPS on the observable half. NOT accepted; the owner's word is owed

This note is hand-authored and unsealed. `human_admission` is `off`, so this is a `decision` by an agent and never
a stamp.

> **Read this first.** "The UAT run passed" means that **an agent ran the scenarios and they came back green**.
> It does **not** mean the owner accepted `ABC-167`. Under `AGENTS.md` § Test and UAT authority, the owner's own
> word in session is the only `In UAT` signature, and a green agent report is explicitly not that word. Until he
> gives it, `ABC-167` is **UAT conducted, owner's word owed**.

## Result: PASS_WITH_GAPS

| criterion | UAT verdict | basis |
|---|---|---|
| A1 handshake | **PASS** | S1, and S2's four handshakes: exactly `id name skytalix`, `id author Olger Oeselg`, `uciok` |
| A2 ready | **PASS** | S1, S6, S7, S8: `readyok` every time, also while a `bestmove` is held |
| A3 a move from a position (+ A3-h1) | **PASS** | S1, S2 (100 game answers), S3, S11, S12: two lines, pv = bestmove, legal, nps rule on every one of 242 answers |
| A4 bad input, stalemate (+ A4-a1, A4-a2) | **PASS** | S8: 11 refused positions, one printable `info string` each, ESC echo dropped, then `bestmove 0000`. S9: stalemate → `0000` |
| A5 the D4 time rule (+ b1–b5, c1) | **PASS** | S5: 17 GUI lines in their windows, white and black, never above 3 000 + 2·step. S2: 100 moves on falling clocks. No side flagged on its virtual clock |
| A6 infinite / ponder / held (+ d1, e1–e5) | **PASS** | S6, S7. The rulings marked "owner may overrule" (A6-e2, e3, e4) are observed as the page states; checklist row 2 asks the owner |
| A7 the D12 limits and value rules (+ f1–f3, h1, i) | **PASS** | S4 (`depth`, `nodes`, `mate`, the smaller wins), S8 (27 value lines, "a keyword is never a value") |
| A8 mate scores | **PASS** | S4 `mate 2`, `mate 1`; S9 `mate -1`, `mate 1` |
| A9 ignored lines and reset (+ h1) | **PASS** | S8's 19 ignored lines write nothing; S11 |
| A10 quit | **PASS** | S10, S7, S2 |
| A11 capability-free, M4 | **PASS (observable half)** | S13: all 648 lines prefixed and printable. The text half was confirmed by reading at entry, and it is pinned in the lane. R-167-1 stays accepted |
| A12 fences | **PASS (re-measured)** | merge base `32f8fc4a` → tip lists exactly the two files (`…530eb78c`) |
| NFR-004 | **PASS (virtual)** | no `time` above 3 000 + 2·step anywhere. Control C3, the cap removed, is caught |
| NFR-008 N8-LANE | **OWED** | R-167-2, accepted by the owner (`…5d7c2e18`). No timing reading was taken |

- **13 of 13 scenarios PASS, 2876 of 2876 checks**, twice and byte-identical, at `660a0d50` (`…4da0ace4`).
- **The gaps are what cannot be observed yet, not failures** (`…19c7115a`): the binary, real stdin/stdout, a real
  GUI and real timing are `ABC-168`'s, and options, book and levels are `ABC-171`'s.
- **Defects found: 0.** There are three INFO items. `UAT-167-a` is my own fixture error in RUN-0, disclosed; the
  engine was right. `UAT-167-b` is repetition, by design under D6. `UAT-167-c` is a promotion with no letter being
  refused, which conforms to UCI.

## The question the owner answers to sign

> **Do you accept ABC-167, the capability-free UCI session, on this UAT? 13 of 13 GUI-style dialogues pass on the
> virtual clock. They cover the handshake, two full games on a clock, FENs, `go depth` / `nodes` / `mate`, every
> time control under the 3 s cap, `infinite` / `ponder`, held answers, bad input, mate, stalemate and `quit`. The
> binary, real stdin/stdout, a real GUI and real timing are left for ABC-168, the options and book for ABC-171,
> and N8-LANE stays OWED under R-167-2. Accept or reject?**

## What happens next (none of it is QE's)

- **Accept:** the Orchestrator transcribes the owner's word and owns the board move out of `In UAT`.
- **Reject:** the reason goes to the Orchestrator for routing.
- QE has not merged, has not pushed and has not moved the board. `src/`, `plans/board.md` and
  `plans/traceability.md` are untouched. The trace row is in the handoff.
