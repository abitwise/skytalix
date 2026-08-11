---
id: 20260812T000000Z-security-nfr-decision-a2f6b83c
kind: decision
by: security-nfr
at: 2026-08-12T00:00:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027
  - abc027-secnfr-2026-08-11
  - quality-gate-ABC-027-qe
  - ABC-027
  - ABC-018
  - ABC-019
  - ADR-0010
  - EPIC-002
  - EPIC-006
  - NFR-002
  - NFR-007
  - NFR-008
  - N8-LANE
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# `ABC-027` GATE RESULT: **FAIL** — one required fix, one expression, in the module every frame passes through. Board move requested: `In Security/NFR` → `In Development`.

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository or in the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`** — no
> `§14-gate#<id>` stamp is issuable to me, the §14 gate machinery does not exist in this repository,
> and I am not self-attesting one. `security.asvs_level` `L1`, `block_on` `high`,
> `compliance_regime` `[]` (nothing hands to the Compliance Officer).

## The verdict in one paragraph

**The risk QE routed here is not a risk any more. It is a measured regression.** Driven through a real
terminal emulator at a window exactly `W` wide, the delivered writer loses the last cell of every row
whose content reaches the last column — **the board's entire h-file plus its file label, 9 rows of
23, on every frame** — while the merged writer, measured on the same instrument in the same session,
loses nothing. **The remedy is one expression on the same line this ticket already changes, and this
gate MEASURED the remedy clean on the same instrument.** A measured regression in merged production
code with a measured three-character fix is a required fix, not an accepted risk. Everything else on
this ticket passes, and most of it passes well.

## What PASSED, so the FAIL is not read as a verdict on the work

- **The defect this ticket exists to fix is real and this ticket fixes it — confirmed on a real
  terminal, not a model.** Four-frame narrowing sequence at 80 columns: merged leaves
  `                  to move out of check` on a row the frame says is empty; delivered leaves it empty.
- **`NFR-002` MET with ~2,000–2,500x headroom**, re-derived on this gate's own instruments and not
  inherited from the Engineer or BA/PM. The +66 characters cost **+0.13 / +0.15 µs** on the write half
  — 0.0009% of the 16 ms budget. This gate's merged cell reproduces the `ABC-018` gate's figure for
  the same quantity (2.766–2.768 against its 2.711–2.772 µs).
- **`NFR-007` single-write MET**, on this gate's own counter: 120,000 writes for 120,000 frames.
- **`N8-LANE` MET at 0 ms** against ≤ 650 ms, with an admissible identity null control; **zero test
  files added, measured (22 test files in all three trees), so the floor allowance is 0 ms.**
  `NFR-008`'s own totals also MET (1.590 s wall / 7.360 s CPU against 3 s / 13 s).
- **`plans/nfr-catalog.md` is BYTE-IDENTICAL to `main`** (md5 `975005524024a3bcd87378cc364fd3b7` both
  sides). No bar was created, moved, loosened or re-derived by the ticket, and **this gate seeded no
  row either — the decision does not need one.**
- **The security half is triggered, was RUN, and is CLEAN**: 180 adversarial cases, **0 escape bytes
  from supplied data**, every `\x1b` accounted for by the module's own three constants, 0 C0/`U+007F`
  survivors, 0 above-`U+007F` in ASCII mode, row count constant. No user input reaches the escape
  sequence — verified at source and by measurement, not taken from the brief.
- **Gates re-run here**: 681/681 on 22 files, skip 0; lint 0 (2 infos); typecheck 0; build 0.

## REQUIRED FIX — one, and only one

**`RF-1` — `src/frame.ts`, the in-place branch of `beginFrameSession` (the single expression this
ticket already changes). Move the per-row erase from AFTER each row to BEFORE it, so it never fires at
the right margin.**

```
delivered : CURSOR_HOME + rows.join(EL + "\n")            <- EL fires AT the margin
required  : CURSOR_HOME + EL + rows.join("\n" + EL)       <- EL fires at COLUMN 0
            ... + ERASE_TO_END_OF_SCREEN in both
```

- **Why:** at column 0 the margin state cannot exist, so the emission stops depending on a terminal
  behaviour that differs between implementations — it is safe **by construction**, not merely by this
  gate's measurement.
- **Measured, not proposed** — same emulator, same session: at cols = `W` all 18 columns survive
  (h-file and label intact); at 80 columns the four-frame narrowing sequence is still clean, so the
  ticket's own value is preserved.
- **Cost: 494 characters against merged's 425 — `+69` = `H × 3`, three characters more per frame than
  the delivered `+66`.** Against `NFR-002` that is 0.00005% of budget; the bar does not move and no
  catalog row is owed.
- **Owner: Software Engineer.** This gate did not edit `src/` — `git status --porcelain -- src/` is
  empty and `src/` is byte-identical to the Engineer's delivery.

**`RF-1` has two consequences that are NOT the Engineer's and must land with it:**

1. **`A1` currently pins the unsafe emission byte for byte** (`\x1b[K` count `H − 1`, `\x1b` count
   `H + 1`, delta exactly `(H − 1) × 3`). The safe shape is `H`, `H + 2`, `H × 3`. **`A1` as written
   forbids the shape that survives a real terminal**, and QE measured `A1` as where 9 of the 14
   mutants die — so it cannot simply be relaxed, its numbers must be re-derived from `H`.
   **Owner: BA/PM.** Also to be decided there: the trailing `\x1b[K` on the reserved prompt row is
   redundant with the `\x1b[0J` that follows it, on the same argument the module already makes.
2. **The screen model's margin case is measurably wrong and should be corrected in the same hop** —
   see `AR-1`. With `RF-1` in place the model's error stops being load-bearing, which is the state the
   suite was in before this ticket; correcting it is what stops the next writer change from walking
   into the same hole.

**Explicitly NOT required, and each was considered:** no constant-frame-width criterion (`ADR-0010`
clause 5's prohibition is respected, and it would not address this — the trigger is
`terminal columns == W`, not `W` varying); no reading of the terminal's width (`src/frame.ts:25` and
`EPIC-002`'s SIGWINCH ruling forbid it, and `RF-1` does not need it); no change to `assembleFrame`; no
panel touched; nothing in `src/status-panel.*` or `src/turn-loop.*`; **`ADR-0009` and `ADR-0010` are
NOT re-opened** — `RF-1` delivers clause 1's ruling *"the in-place redraw emits a per-row erase"*
exactly, and only changes where in the row it is emitted.

## ACCEPTED RISKS — each with a NAMED OWNER and a TRIGGER

**`AR-1` — the suite's screen model is measurably wrong at the right margin.**
`src/frame.test.ts` lets `column` run to `columnCount` (`:250-256`), so `eraseToEndOfLine` (`:212-215`)
is a no-op at the margin; a real emulator keeps the cursor at `columnCount − 1` with wrap pending and
erases that cell. The model's four "assumptions stated rather than buried" (`:178-191`) are now three
stated assumptions and one **stated-and-false** assumption. With `RF-1` this stops being load-bearing,
but the model would still certify any future writer that fires an escape at the margin.
**Owner: Software Engineer at the `RF-1` hop** (correct the model's margin case and name it as
measured rather than assumed); **Architect/Design** if model fidelity is judged an ADR-level question.
**Trigger: the `RF-1` hop itself; and thereafter any writer change that emits an escape whose meaning
depends on the cursor's column.** Severity **medium** — it is a test-infrastructure defect that hid a
production regression once already.

**`AR-2` — one emulator was measured; the rest are still unmeasured.**
GNU screen 5.0.2 confirms the pending-wrap reading. `xterm`, Terminal.app, iTerm2, Alacritty, VS Code
and Windows Terminal were **not** measured and nothing is claimed about them; what is established is
that the terminfo entries for `xterm`, `xterm-256color`, `screen`, `vt100`, `vt220`,
`Apple_Terminal`, `tmux-256color` and `linux` all declare `xenl` — the same last-column state — and
all spell `el` as `\x1b[K`. **Owner: Security/NFR at `EPIC-006`**, the first runnable terminal
surface. **Trigger: `EPIC-006` shipping a CLI entry point, or any report of a missing rightmost
column.** Severity **low, and falling to nil once `RF-1` lands** — after `RF-1` the emission no longer
depends on any emulator's margin representation, which is the point of preferring `RF-1` over
"measure more emulators".

**`AR-3` — `beginFrameSession` does not sanitize; escape-freeness rests entirely on callers routing
rows through `assembleFrame`.** Measured: a hand-built frame array containing `\x1b[2J` reaches the
sink unaltered. **Pre-existing, unchanged by `ABC-027`, and no fix is required of this ticket** — but
`ABC-027` takes the per-frame escape count from 2 to 24, so a foreign sequence that used to stand out
in a stream of two now sits in a stream of twenty-four. **Owner: BA/PM at `ABC-019`**, the first thing
that composes frames in a loop. **Trigger: the first caller that builds a frame array by any path
other than `assembleFrame`.** Severity **low** — 180/180 clean through the sanctioned path.

**`AR-4` — `NFR-002`'s compute half is still a lower bound.** `ABC-016` and `ABC-017` are stubs here;
the real panels' compute is `UNKNOWN - verify` and no number was invented for either. The unbounded
supplied string remains the one way this bar can be busted, owner **BA/PM at `EPIC-003`** as recorded
at `ABC-018`'s gate, unchanged by this ticket. **Trigger: either panel merging, or `EPIC-003`
supplying message text.** Severity **low**.

## Why FAIL rather than PASS_WITH_RISKS — the argument, since every ticket on this board has returned PASS_WITH_RISKS

The case for accepting it was real and is recorded rather than dismissed: the trigger is a single
column value, `ABC-027` is a large net improvement, and `ABC-019` is waiting on it. **Three things
outweigh it.**

1. **It is measured, not projected.** QE handed over an `UNKNOWN - verify` and asked for a bound. The
   answer came back as a regression in merged production code, on a real emulator, with the merged
   baseline clean beside it. Accepting a measured regression is a different act from accepting an
   unmeasured risk, and this gate does not get to blur them.
2. **The harm is the harm this ticket exists to prevent.** The ticket's own `P1` argument is that a
   wrong material count and an expired draw claim are *"a misreported game state, not a smudge"*. A
   rook on h8 that is not drawn is a misreported game state by the same standard. Applying that
   standard to the defect being fixed and not to the one being introduced would be the gate choosing
   its answer.
3. **The remedy costs three characters and is already measured clean.** The reason to accept a risk is
   that closing it is expensive or unknown. Here it is neither. And the window is now: `ABC-027` is
   the second of four merges into a module `ABC-019` is being built against **right now** — the same
   argument BA/PM used to win the merge-order dispute cuts exactly this way.

**FAIL here is cheap; FAIL after this merges is not.** The Orchestrator wrote that if this gate could
not bound the risk, a legitimate stop was better found now than after merge. It could bound it, the
bound came back worse than either reading assumed, and the stop is the one the routing anticipated.

*(The role file's own vocabulary for this result is `BLOCKED`; the subtask asked for
PASS / PASS_WITH_RISKS / FAIL. They are the same verdict — the ticket does not proceed to
`Ready for UAT` on this gate.)*

## Board move REQUESTED, not written — `plans/board.md` is the Orchestrator's

**`In Security/NFR` → `In Development`**, backward, for `RF-1` — the same shape this board used for
`ABC-016`'s `D19b` and `ABC-019`'s `A9b`, both of which returned green in one hop. WIP: `In
Security/NFR` 1/2 → 0/2, `In Development` 1/3 → 2/3, both inside their limits.

**A `Blocked` move is NOT requested** and the distinction is deliberate: nothing here waits on a
decision or a dependency. One expression is owed and its shape is measured.

**Sequencing note for the Orchestrator, offered not decided:** `RF-1` is the Engineer's and `A1`'s
re-derivation is BA/PM's, and `A1` must not be relaxed without re-deriving it from `H`. Landing the
production change against a criterion that forbids it would leave the suite red at the criterion QE
measured as killing 9 of 14 mutants. **Merge order is unchanged and is not this gate's to move** —
`ABC-027` is still forced before `ABC-019`.

## What QE did that this gate wants on the record

**QE was right, and right for the right reason.** It marked the margin `UNKNOWN - verify`, refused to
fabricate a terminal, named the exact mechanism, predicted the exact 9 rows, and said plainly what it
was not claiming. **Every prediction in its `claim` note that a real emulator could test came back
true — including the 9-rows-per-frame figure and the identity of the rows.** It also called the
merged-scores-clean-under-both-models point correctly, which is what makes this a regression rather
than a pre-existing condition. This gate's only correction to it is upward: the class is not "a new
dependency on an unmeasured assumption", it is "a defect", and the difference was one installed
emulator away.
