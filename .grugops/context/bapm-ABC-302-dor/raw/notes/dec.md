# bapm-ABC-302-dor decision: ABC-302 is DoR 10 of 10, Ready. Row 10 is met by Architect/Design's forms (six S, three W, R8 to `uci-session`'s `ENGINE_DEEP`, R9 option (ii)), written onto the page with no re-cut

BA/PM, task `bapm-ABC-302-dor`, records only, at `main` `bff22046`. Nothing was run, built or timed.

## Authoritative
- The ticket page `plans/tickets/ABC-302-…` (`## Scope`, `## Acceptance criteria`, `## Risks`, `## Definition of Ready`) is authoritative for the criteria. Where it differs from `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`) or from the SE build lines in `arch-ABC-302` `…bcadd41d`, those win.

## What was written (each page line marked "Row 10, 2026-11-04")
- **DoR row 10:** the Architect's line, verbatim: R1, R2, R4, R5, R8 S; R3, R6, R7 W; R8's full row to `src/uci-session.test.ts`'s `ENGINE_DEEP`; R9 S under option (ii); parity on 27 mutants (PREREG `…23abb6c5`); option (b) does not bind; no owner question. **10 of 10: Ready.** Front matter `ready` / `Ready`.
- **Title and H1:** nine rows to existing deep lanes, eight within their own files and one across (R8). Six keep a remnant (S), and three move whole (W).
- **§ Problem:** forecast about −0.50 s of wall (848 of 948 ms in-thread kept off the default lane), `main` near 9.3 s.
- **§ Scope:** a per-row form / lane / remnant table; R8 reads the real search; R9's new constant under an existing variable, with no lane line; placement after the constants; the futility "expected 48" corrected to 53.
- **A1:** eight test files plus `AGENTS.md` and the command log; the Part 2 targets are `uci-session` and R9's own file.
- **A2:** byte-identical once the nesting indent is removed (`qe-ABC-281`'s ruling); one `biome-ignore format` line allowed on R1's deep `it`; R9 waived by name; repeated fixtures are not the body; `STEP_MS` moves with R2.
- **A3:** lane total base − 3 = **2 684** at `fed3f2b4`'s 2 687; futility −1, levels −2; one name out and one in per S file; `cli` 109, `uci-session` default 230.
- **A4:** R8's and R9's `-t` lines (escaped; nine in all, to `ADR-0046`'s run-rule table); per-lane defined counts base → tip: null-move 45 → 46, futility 53 → 53, zobrist 33 → 34, engine 83 → 84, levels 58 → 58, uci-session 241 → 243, engine.capacity 1 → 2 (no `AGENTS.md` line). Passed counts are QE's.
- **A5:** null-move "45 rows" → 46; futility "47 tests" → 53; both 0 B.
- **A6:** the 27 frozen mutants (16 of the Architect's, `QE-244-a`'s five, the six other `ABC-241` sets); M1p out; each row's mutant with its named tip killer; R3 carries M3 / M3s as the holders' control, and its deep line is not read against them.
- **A8 and § NFR:** expected about 9.3 s (base − 0.50 s); the 9.4 s target and every trigger unchanged.
- **`R-302-a`:** closed (owner Architect/Design).
- **`EPIC-011` row 54:** Ready, 10/10. Its DoR cell needed it; the top block was not touched.

## Not done here
- The board (Orchestrator; the card already shows In Development at `bff22046`). No ADR, `src/`, `AGENTS.md` or command-log edit.
- R5's placement wording differs between two Architect sources (observation note of this task). BA/PM does not rule it.

## Owed
- SE `se-ABC-302`: build to the page and `…bcadd41d` § SE build lines 1–8.
- QE: A6 freeze (PREREG before any head run), A4 passed counts, A8 ALONE.
- Security/NFR: A9.
