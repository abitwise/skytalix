# Two owed ADR text items done: `ADR-0046` § Status records BA/PM's word on `ABC-244`'s page, and `ADR-0052` D7's "if the owner rejects it" is struck as history

Commit `1b142ea0`, records only. Only `memory-bank/50-decisions/ADR-0046*` and `ADR-0052*` changed.

- **`ADR-0046` § Status** gains a dated line (2026-10-31). It says:
  - BA/PM gave R1–R4 its word on `ABC-244`'s page, § BA/PM ruling, on 2026-10-30 (`bapm-g8-headroom-cut`, merged
    `de02f8c2`), as `ABC-177`'s page did for D2(b), with `ABC-177`'s three conditions;
  - R1–R4 bind from that cut, and no owner word was owed;
  - tranche 1 is `ABC-244`, merged `24b22339`, with `G8` head 9.25 s;
  - this line wins over the addendum's "needs BA/PM's word".

  `ABC-244`'s page § Dependencies named this as owed.
- **`ADR-0052` D7.** The sentence "If the owner rejects it, only the text of this entry and `A11`'s bound move" is
  struck through. A dated line says the whole-second reading is accepted.
  - **The facts are more precise than the brief.** The sentence is about the whole-second reading, which
    `arch-ABC-220-a14` added after the owner accepted the ADR (`…3dd61448`, 2026-10-30).
  - The owner then confirmed that reading on its own, the same day: *"Whole-second reading of "≤ 22 s" - confirm"*
    (`orch-2026-10-30a` `…f4673b9f`, a transcription, not a stamp). The line cites `…f4673b9f`.
  - Nothing moves: not the entry text, not `A11`'s bound, and no code. `bapm-ABC-242-225-owner` `…2fe3fa79` flagged it
    for the next Architect hop.
