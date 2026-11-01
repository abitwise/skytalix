# se-ABC-262 STOP on A4: QE's plant QB does not turn the promotion row red on P1′, as written

- **Tried:** the row exactly as the page specifies (P1′, P2′, lazy = full, absent/present) against QE's QB plant, file run and row alone. Both green.
- **Why it cannot work as written:** in check the function's `epoch` stays 0 and unstamped `pinStamp` squares read 0, so QB's surviving `pinStamp[from] === epoch` operand still forces the test on a fresh square (detail in the plants note). No in-check board fixes this by itself; the square must already carry a stamp.
- **Not done:** the bar was not loosened, the board not swapped, and the scratch priming remedy was not landed. A1–A3, A5–A8 are met; A4 is not. The ticket's two named stop conditions did not fire (B2 production 1; A2 asserts hold).
- **For BA/PM:** take the priming precondition (verified in scratch: QB red, control green), or accept QB as caught only by the ENGINE_DEEP A1 walk and drop A4.
