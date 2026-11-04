# bapm-ABC-281-dor decision: ABC-281 DoR 10 of 10, Ready. Row 11 met by Architect/Design (S, S, S); the page reads under all-S; this cut is BA/PM's word for the tranche carry

BA/PM, task `bapm-ABC-281-dor`, records only, at `main` `748d4fa3`. Nothing was run. Authoritative text: the `ABC-281` page's § Definition of Ready and the "all-S, 2026-11-04" lines, under `ADR-0046` § Dated 2026-11-04, which wins where they differ.

## DoR
- **10 of 10. Ready.** Row 11 is written verbatim from Architect/Design `arch-ABC-281` `…d7b2b02b`: R1 S (readings 8 and 10 on `chooseMoveWithoutTaper`), R2 S (kr-corner, startpos, position-6), R3 S (`QE-087-d`, seed 1, the first 10 of the thirty). Kill parity was measured on seven mutants, so option (b) does not bind, and there is no owner question. Row 10 ✅.
- No re-cut. The all-S lines fill in the page's own S variants. Size stays `S` and priority stays `P2`.
- The board shows the card In Development (Orchestrator, `748d4fa3`). This page records the `Backlog → Ready` exit only; the board is not edited.

## The all-S lines on the page
- **§ Scope:** a table of the three remnants. R1's describe and its `sweep` stay in the default lane, with one copy of `sweep`, byte-identical. The full row goes in a nested `if (RUN_DEEP)` describe titled the describe's title plus " [deep, SEARCH_DEEP=1]". R2's remnant sits beside its sibling. R3's remnant is a new describe whose title names seed 1 and the first 10.
- **A2:** the `sweep` stays. Comments may also cite `arch-ABC-281` and `ADR-0046`.
- **A3:** the lane total equals base's (2 650 at `ff07571f`, re-read at the build's base), with 0 skipped. Each file's count is equal. In each file, exactly one name goes out (the moved row) and one comes in (the remnant).
- **A4:** the three `-t` lines stand, each "1 passed". Each file's deep lane, as `AGENTS.md` spells it, reads base's count for the same command + 1. The null-move "44 rows" becomes the tip's count, 45 expected (`UNKNOWN - verify` at base).
- **A6, the freeze list as the Architect recommended:**
  - R1: M1;
  - R2: the M2c shape, with M2 optional;
  - R3: the M3c (`M5b`) shape, not M3b;
  - M3a dropped.
  - At the tip, the default lane must kill each one, **with the row's remnant among the named killers**. A kill by `QE-208-c`'s source-literal row alone does not count for M2c.
- **A8 and § NFR triggers:** expected about 9.4–9.55 s (base − 0.36 s). It is not a bar. The 9.6 s `Q-N8H-1` trigger is unchanged.
- **`R-281-a`:** closed for the measured mutants and carried to A6's list. What runs only deep is breadth.

## BA/PM's word
`ADR-0046` § Dated 2026-11-04 reads § Consequences' "only on the tranche-2 ticket" as carrying to `ABC-281`, under parity, for these three rows only, with the cut as BA/PM's word, as the `ABC-248` ruling was. **BA/PM gives that word on the page:** the cut carries form S, and A6 checks parity. No owner word is owed. No NFR level, bar, cap or lane command moves.

## Correction
"The seed is used" is not single-held. See this task's observation note. It corrects `bapm-nfr008-rows` `…d012231e`.

## Owed
- **Orchestrator:** the board (already In Development).
- **SE (`se-ABC-281`):** build to the all-S lines.
- **QE:** A6 freeze, A8 graded twin, ALONE.
- **Security/NFR:** A9 (`R-N8H-1`).
