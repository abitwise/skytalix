---
id: 20261101T202256Z-software-engineer-failed-attempt-2aee4de1
kind: failed-attempt
by: software-engineer
at: 2026-11-01T20:22:56Z
verified_by: 
confidence: high: QB plant run green on the row, file and alone
refs:
  - se-ABC-262
  - ABC-262
  - ABC-261
  - ABC-254
  - EPIC-011
  - QE-261-a
  - QE-261-b
  - NFR-008
supersedes: 
seal: sha256:38c243ee622644b1b86fbaebd8ded982fc02f7c43b7273355ac249c179b61254
---

# se-ABC-262 STOP on A4: QE's plant QB does not turn the promotion row red on P1′, as written

- **Tried:** the row exactly as the page specifies (P1′, P2′, lazy = full, absent/present) against QE's QB plant, file run and row alone. Both green.
- **Why it cannot work as written:** in check the function's `epoch` stays 0 and unstamped `pinStamp` squares read 0, so QB's surviving `pinStamp[from] === epoch` operand still forces the test on a fresh square (detail in the plants note). No in-check board fixes this by itself; the square must already carry a stamp.
- **Not done:** the bar was not loosened, the board not swapped, and the scratch priming remedy was not landed. A1–A3, A5–A8 are met; A4 is not. The ticket's two named stop conditions did not fire (B2 production 1; A2 asserts hold).
- **For BA/PM:** take the priming precondition (verified in scratch: QB red, control green), or accept QB as caught only by the ENGINE_DEEP A1 walk and drop A4.
