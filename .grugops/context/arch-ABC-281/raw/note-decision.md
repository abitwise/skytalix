# arch-ABC-281 decision: ABC-281 DoR row 11 is met. Form S for R1, R2 and R3; option (b) does not bind; no owner question; forecast about −0.36 s of wall

Architect/Design, task `arch-ABC-281`. The readings are in this task's observation note. The authoritative text is `ADR-0046` § Dated 2026-11-04 (`arch-ABC-281`), with a Status pointer, and `ADR-0050`'s Status line of 2026-11-04.

## The forms
- **R1 `QE-208-a` position-6: S.** The remnant is `sweep` on `chooseMoveWithoutTaper` at readings 8 and 10, 0 mutated, insideNull ≥ 1. The full row goes to `SEARCH_DEEP`.
- **R2 `ABC-230` A4: S.** The remnant is `[]` vs absent, `figures` equal, on kr-corner, startpos and position-6. The full row goes to `ENGINE_DEEP`.
- **R3 levels A9: S.** The remnant is `QE-087-d`'s draw check on seed 1 over the first 10 of the thirty, with a blunder and an engine move asserted. The full describe goes to `ENGINE_DEEP` with " [deep]".

## Why
- **Not W.** Under W, M1, M2, M3c and M3d each lose their only default-lane killer. That fails `ADR-0046` § Consequences' kill parity, and it is option (b), the owner's.
- **S.** S keeps parity on all seven mutants (tip sketch), so (b) does not bind, and no owner question arises.
- **Not K.** K gives up about 94 % of the saving for kills the remnants already hold.
- **A correction to BA/PM's observation:** "the seed is used" (R3) has 15 other default-lane killers. The single-held property is the one draw per move.

## Forecast
- About −0.36 s of wall: 693 of 738 ms in-thread, scaled from the −0.38 s probe.
- `G8` head about 9.4–9.55 s, against the probe's 9.4 s.

## Binding conditions
These are condition 1–5 in the ADR section.
1. The remnants are as confirmed; a different subset needs the same kill evidence.
2. R1 keeps one byte-identical `sweep`, and the page's A4 `-t` prints "1 passed". A nested `if (RUN_DEEP)` describe is one shape that does both.
3. R2's remnant sits beside its sibling.
4. R3's remnant title names seed 1 and the first 10.
5. The counts:
   - the lane total equals base's (2 650), and so does each file's count;
   - each deep lane reads base + 1;
   - the null-move "44 rows" still becomes the tip's count.

## Recommended to QE's A6 freeze (not binding)
- R1: M1.
- R2: the M2c shape.
- R3: the `M5b` / M3c shape, not M3b.

## The DoR line, for BA/PM to write on the ABC-281 page
Row 11 does not say the Architect writes it.

> 11 ✅ 2026-11-04, Architect/Design (`arch-ABC-281`; `ADR-0046` § Dated 2026-11-04): R1 **S** (readings 8 and 10 on `chooseMoveWithoutTaper`), R2 **S** (kr-corner, startpos, position-6), R3 **S** (`QE-087-d`, seed 1, the first 10 of the thirty). Default-lane kill parity measured on seven mutants, so option (b) does not bind and there is no owner question. Row 10 ✅. DoR 10 of 10: Ready.

## Owed page lines (BA/PM)
- A3 under all-S: the lane total equals base's, and each file's count is equal.
- A4: each deep lane reads + 1. R1's line holds under the nested placement.
- A8's expected value: about 9.4–9.55 s (base − 0.36 s).
- `R-281-a`: closed for the measured mutants, carried to A6.
- The board move to Ready is the Orchestrator's.
