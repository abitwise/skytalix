---
id: 20260812T091500Z-security-nfr-decision-7bddcfad
kind: decision
by: security-nfr
at: 2026-08-12T09:15:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027-regate
  - security-nfr-ABC-027
  - ticket-to-pr-ABC-027-rf1
  - abc017-d23-2026-08-12
  - quality-gate-ABC-027-qe
  - refinement-ABC-027-a1
  - ABC-027
  - ABC-016
  - ABC-018
  - ABC-019
  - ADR-0009
  - ADR-0010
  - EPIC-002
  - EPIC-003
  - EPIC-006
  - NFR-002
  - NFR-007
  - NFR-008
  - N8-LANE
  - src/frame.ts
  - src/frame.test.ts
  - 20260812T000000Z-security-nfr-decision-a2f6b83c
supersedes:
---

# `ABC-027` RE-GATE RESULT: **PASS_WITH_RISKS**. `RF-1` answers the finding on the same instrument that produced it, and the safety is now STRUCTURAL rather than only measured. Board move requested: `In Review` → `Ready for UAT`.

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository or in the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`** — no
> `§14-gate#<id>` stamp is issuable to me, the §14 gate machinery does not exist in this repository,
> and I am not self-attesting one. `security.asvs_level` `L1`, `block_on` `high`,
> `compliance_regime` `[]` (nothing hands to the Compliance Officer).
>
> **This note does not supersede the FAIL decision** (`20260812T000000Z-security-nfr-decision-a2f6b83c`).
> That decision was true of the build it gated. This one gates a different build.

## The verdict in one paragraph

**I failed this ticket and the fix answers the finding.** Re-measured on GNU screen 5.0.2 — a probe
rebuilt from scratch at this hop, sizing verified by a wrap at exactly column 10 — the shipped writer
keeps **all 18 cells of every board row at a window exactly `W` wide**: the h-file and its file label
survive, where the shape I failed lost them on every frame. It holds at a second width (`W` = 37, a
live draw claim that the failed shape truncated) and in unicode mode. The ticket's own value is
intact: the four-frame narrowing sequence at 80 columns leaves row 11 EMPTY where merged leaves
`                  to move out of check`. **And the two halves are clean SIMULTANEOUSLY** — the same
sequence at a window exactly `W` wide is the only cell where a writer has to satisfy both, and only
`RF-1` does. **The reason to prefer this fix over measuring more emulators is now checked rather than
argued: all 25 escapes in the emission fire at column 0, verified by walking the real bytes** — so no
emulator's margin representation can reach it. Everything else passes, and the risks that remain each
have a named owner and a trigger.

## What was measured, not inherited

Every number the brief handed me was re-run. **All of them hold.**

| the brief's number | my measurement |
|---|---|
| baseline 717/717 on 24 files, skip 0, lint/typecheck 0 | **717/717 on 24 files, skip 0, lint exit 0 (2 pre-existing infos), typecheck 0, build 0 — correct in every cell** |
| the emission is 494 chars = `H × 3`, +69 not +66 | **494, `\x1b[K` 23 = `H`, `\x1b[0J` 1, `\x1b` 25 = `H + 2`, delta 69, both glyph modes, and 69 at `W` = 37 too** |
| `A1`'s byte-exact `toBe` MASKS the column-0 clause | **confirmed — the `toBe` fails first on the old writer, on `M2` and on merged; the clause never reports** |
| clause (b) alone passes MERGED vacuously; clause (a) alone kills all three | **confirmed, by reducing `A1` to each half alone out of tree. Neither half is redundant** |
| revert the model repair with `RF-1` in place → `A7` fails alone, 1 of 717 | **confirmed — 1 failed / 716 passed, one test file, nothing else moves** |
| zero test files added; `plans/nfr-catalog.md` needs no row | **confirmed — 24 test files and 39 `.ts` files in `pre`, `post` and `twin`; catalog byte-identical to `main`, md5 `96f0518d2f5ff0d9120225f143a3a4a8` both sides** |

**And one thing the brief did not ask for came back as a divergence and is reported rather than
smoothed: the instrument check FAILED to reproduce.** My previous cell reproduced `ABC-018`'s gate
band (2.711–2.772 µs) for the merged-to-regular-file quantity; this hop reads **2.209–2.238 µs**,
below the band, with every cell shifted by a uniform ~1.25x. A six-cell control matching the FAIL
hop's exact cell set reproduced the shift, so the cell set is not the cause; the machine is on AC
power with no thermal warning. **Cause `UNKNOWN - verify`.** It does not move this verdict, because
every conclusion rests on a PAIRED delta measured inside one process — but it does mean absolute
microseconds on this board are not comparable across hops without a same-session baseline, and that
is recorded as `AR-6`.

## What PASSED

- **The regression I failed the ticket for is GONE, on the instrument that produced it.** At
  `C == W` = 18: all 9 board rows 18 cells, `8 .r:n.b:q.k:b.n:r` / `   a b c d e f g h`, ascii and
  unicode. At `C == W` = 37: `White may claim: threefold repetition` intact at 37 cells, where the
  failed shape returned 36 — **a truncated live draw claim, which is the ticket's own `P1` harm.**
  Clean at 19 and 80; at `C < W` (12) byte-for-byte identical to merged, the wrapped shape
  `EPIC-002` accepts as cosmetic.
- **The ticket's own value survives the fix**, re-confirmed on the same emulator at 80 columns.
- **The safety is STRUCTURAL.** All 25 escapes fire at column 0 — `\x1b[H` 1, `\x1b[K` 23, `\x1b[0J`
  1 — checked by walking the real emission at `W` = 18 (both modes) and `W` = 37. Zero escapes fire
  at any other column.
- **`NFR-002` MET with ~3,100x headroom** at the ticket's denominator (write 2.37 µs + compute
  2.72 µs = 0.0051 ms against 16 ms = 0.032%) and ~2,290x at the wide fixture. The 69 characters cost
  **+0.127 to +0.176 µs**; the three characters `RF-1` costs over the failed shape are **below the
  instrument's resolution** — the sign flips between samples. The correctness fix is free at this bar.
- **`NFR-007` single-write MET**, on this gate's own counter: 132,000 writes for 132,000 frames.
- **`N8-LANE` MET**, two samples bracketing zero (−5 ms and +30 ms; largest is 4.6% of the ≤ 650 ms
  allowance, sign at chance in both), each with an ADMISSIBLE identity null control (−0.98% and
  −0.26%, inside the ≤ 1.5% floor, signs at chance). **Zero test files added, measured**, so the floor
  allowance is 0 ms. The bar was not re-derived.
- **`NFR-008` MET on the admissible sample** — 1.63 s wall / 7.87 s CPU against 3 s / 13 s. (Sample 1
  is recorded as inadmissible for the wall total with its reason: its identity null control differs
  from `pre` by 4.3%, larger than the 2.5% the reading sat over the bar. See `AR-5`.)
- **`plans/nfr-catalog.md` byte-identical to `main`.** No bar created, moved, loosened or re-derived
  by the ticket, and this gate seeded no row either.
- **The security half is triggered, was RE-RUN on the shipped build, and is CLEAN**: 180 adversarial
  cases, **0 escape bytes from supplied data**, every `\x1b` accounted for by the module's own three
  constants at the NEW counts, 0 C0/`U+007F` survivors, 0 above-`U+007F` in ASCII mode, row count
  constant. No user input reaches any escape sequence — verified at source and by measurement.
- **Gates re-run here**: 717/717 on 24 files, skip 0; lint 0 (2 pre-existing infos); typecheck 0;
  build 0.
- **The prohibitions hold.** No constant-frame-width criterion (`A7` read at source: no frame
  assembled, `H` and `W` absent, no width asserted constant); no terminal width read; `assembleFrame`
  untouched; both append branches untouched; no panel touched; `ADR-0009` and `ADR-0010` NOT
  re-opened — `RF-1` delivers clause 1's per-row erase and changes only where in the row it fires.

## NO REQUIRED FIX

`RF-1` was the one required fix and it is delivered, in the shape specified, measured clean on the
instrument that produced the finding. **I am not adding a second.** Nothing else on this ticket
reaches `high` under `L1`, and `block_on` is `high`.

**Explicitly considered and NOT required:** splitting `A1` so the masked clause reports (a criteria
change, BA/PM's, and the clause is enforced today — the masking costs diagnosability, not
enforcement); a criterion for the column-0 primitive (`\x1b[K` then a full-width row leaves all cells
intact) — I measured it and it is the positive control for `RF-1`, but `A1`'s two clauses already
pin the emission and `A7` pins the model, so adding it would be gold-plating; sanitizing inside
`beginFrameSession` (see `AR-3` — pre-existing, unchanged, and 180/180 clean through the sanctioned
path).

## THE HISTORICAL `+66` MEASUREMENTS — I AGREE WITH THE HANDLING, and say so on the record

The `RF-1` hop left my `+66` figures in `plans/traceability.md` **exactly as measured** and marked
them as taken on the old shape, putting the `+69` figures beside them rather than over them. The
row's own words are *"EVERY GATE MEASUREMENT QUOTED FURTHER DOWN THIS CELL WAS TAKEN ON THE `+66`
SHAPE AND IS LEFT EXACTLY AS MEASURED — a gate's record is not rewritten to agree with a later
build."*

**That is correct and I endorse it without reservation.** Those numbers were true of the code that
existed; editing them into agreement with a later build would have destroyed the only evidence that
the FAIL was measured rather than asserted, and would have made the trace describe a build that never
ran. **I have applied the same rule to myself in the other direction:** my FAIL-hop note gives the
catalog's md5 as `975005…` "on both sides", which no longer matches because `main` has moved
(`799adbf`, the `ABC-016` gate, edited the catalog). **I did not correct that note.** Today's value
is recorded beside it. A record states what it measured; a hash of a moving branch tip goes stale by
design rather than by error.

## ACCEPTED RISKS — every one disposed, with a named owner and trigger or an explicit close

### `AR-1` — the suite's screen model is measurably wrong at the right margin. **CLOSED.**

The model is repaired — `eraseFrom() => Math.min(column, columnCount - 1)`, taken by **both** erase
helpers — and `A7` gives the repair enforcement. **Measured here, not inherited: revert the repair
with `RF-1` in place and `A7` FAILS ALONE, 1 of 717, nothing else moves.** That is exactly the gap I
recorded: `AR-1` as a bare assignment had **zero enforcement** and could have been skipped or
silently undone with nothing anywhere going red. It cannot be now. `A7` is my own primitive with my
own two controls and the wrap probe, and all four of its assertions match this hop's fresh emulator
readings.

**One residue is named rather than left dangling, and it already has a home.** `A7` pins ONE of the
model's four stated assumptions; the other three (`\n` → column 0 of the next row, scroll below the
last row, throw on an unimplemented escape) remain unmeasured and must not be read as promoted by
standing next to a measured one. That is the ticket's own carried flag 4, **owner Architect/Design**,
already written into `## Definition of Ready`. **A second, smaller residue:** `A1`'s byte-exact `toBe`
masks the column-0 clause, so a failure there prints the wrong reason. The clause is enforced —
measured — but it is silent. **Owner: BA/PM at the next `A1` hop. Trigger: the next change to the
writer's emission.** Non-blocking; the Engineer documented it at the assertion.

### `AR-2` — one emulator measured. **CLOSED for `ABC-027`; the standing question is re-owned.**

The reason this can close rather than be carried is measured, not argued: **no escape in the shipped
emission fires anywhere but column 0**, so the emission no longer depends on any emulator's margin
representation — which is precisely why `RF-1` beat "measure more emulators". `xterm`, Terminal.app,
iTerm2, Alacritty, VS Code and Windows Terminal are still unmeasured and **nothing is claimed about
them**; nothing needs to be.

**The standing cross-emulator question is not this ticket's and is re-owned rather than dropped:
`AR-2'` — Owner: Security/NFR at `EPIC-006`, the first runnable terminal surface. Trigger:
`EPIC-006` shipping a CLI entry point, or any report of a missing rightmost column or visual
corruption. Severity: low.**

### `AR-3` — `beginFrameSession` does not sanitize. **OPEN. Severity low.**

Re-measured on the shipped build: a hand-built frame array containing `\x1b[2J` reaches the sink
**unaltered**. Escape-freeness rests entirely on callers routing rows through `assembleFrame`.
**Pre-existing, unchanged in kind by `ABC-027`, and no fix is required of it** — `main`'s
`frame.join("\n")` has the same property. What `ABC-027` changes is the inspection signal: a foreign
sequence used to sit in a stream of 2 escapes and now sits in a stream of **25**.

**Owner: BA/PM at `ABC-019`**, the first thing that composes frames in a loop. **Trigger: the first
caller that builds a frame array by any path other than `assembleFrame`.** Not raised: 180/180 clean
through the sanctioned path, `sanitize` untouched and verified on the shipped build, and no user
input path exists until `EPIC-003`.

### `AR-4` — `NFR-002`'s compute half is a lower bound. **OPEN, and NARROWED. Severity low.**

`ABC-016` has **merged**, so `src/status-panel.ts` is real code on `main` with its own suite. The
history pane does not exist yet. **And the structural half is now settled rather than assumed:
`assembleFrame` takes `readonly string[]` (`src/frame.ts:194`), so its own cost is panel-independent
by construction** — what is unbounded is the caller's cost of producing panel rows, which belongs to
those tickets and not to this module.

**Owner: BA/PM at `EPIC-003`** for the unbounded supplied string — still the one way this bar can be
busted, since `W` is a max over panel rows and `sanitize` strips but does not truncate. **Trigger:
`EPIC-003` supplying message text, or the history pane merging.** *(I did not import
`src/status-panel.*` even read-only, because the brief's limit names those paths; the narrowing above
rests on what is on `main` and on `assembleFrame`'s signature.)*

### `AR-5` — `NFR-008`'s wall clause is tight on `main` ITSELF. **NEW, and NOT `ABC-027`'s.**

In my loaded sample the lane's wall median read **2.92 s for `pre` — which is `main`, without this
ticket** — against a 3 s bar, and `post` read 3.075 s. **That sample is inadmissible and I say so**:
its identity null control differs from `pre` by 4.3%, larger than the margin in question. On the
admissible sample both read 1.63 s. **So nothing is breached and `ABC-027` is not implicated either
way.** What is worth carrying is that the lane grew to 717 tests when `ABC-016` merged and the wall
clause is a ~2x question being asked of a number that moves 2x with machine load.

**Owner: BA/PM at the next lane-touching cut, escalating to Architect/Design if the bar itself is in
question. Trigger: any admissible sample reading over 3 s wall, or the next ticket that adds a test
file.** Severity low. **This gate does NOT move that bar** — the catalog is explicit that a gate does
not, and I have not.

### `AR-6` — absolute microsecond figures are not comparable across hops on this board. **NEW, instrument-level.**

This hop's whole timing scale sits ~1.25x below the FAIL hop's and below `ABC-018`'s gate band, with
the shift uniform across every cell and a six-cell control ruling out the cell set. Cause
`UNKNOWN - verify`. **A future gate that compares its absolute number to a note's absolute number,
with no same-session paired baseline, will draw a wrong conclusion** — and this board's notes are
full of absolute microseconds.

**Owner: Security/NFR at the next `NFR-002`-touching gate. Trigger: any hop that reads a
microsecond figure out of a note and compares it to its own.** Severity low. The mitigation is
already this board's practice and costs nothing: run the comparison cell in your own session, paired,
as I did.

## Why PASS_WITH_RISKS and not PASS

Four risks remain live (`AR-2'`, `AR-3`, `AR-4`, plus the two carried items) and each has an owner
and a trigger rather than a close. **An accepted risk with an owner is not a defect** — but a gate
that returned a bare `PASS` over four owned risks would be describing a cleaner ticket than the one
in front of it. Nothing here reaches `high` under `L1`, so nothing blocks: `block_on` is `high` and
the highest severity on the register is low, with the one `medium` (`AR-1`) closed by a criterion.

*(The role file's vocabulary is `PASS` / `PASS_WITH_RISKS` / `BLOCKED`; the subtask asked for
PASS / PASS_WITH_RISKS / FAIL. `PASS_WITH_RISKS` is the same word in both — the ticket proceeds.)*

## Board move REQUESTED, not written — `plans/board.md` is the Orchestrator's

**`In Review` → `Ready for UAT`.** The gate has run and returned its result, which is the transition
this role owns; the ticket passes through `In Security/NFR` (0/2 → 1/2 while the gate runs, back to
0/2 on exit) rather than resting there. **WIP: `In Review` 2/3 → 1/3 (`ABC-019`), `Ready for UAT`
0/4 → 1/4** — both inside their limits.

**`Blocked` is NOT requested and no backward move is requested.** Nothing waits on a decision or a
dependency.

**Merge order is unchanged and is not this gate's to move** — `ABC-027` before `ABC-019` is still
forced by `ADR-0010` clause 7, and the `ABC-027`-vs-`ABC-017` preference remains the Orchestrator's.

## What the `RF-1` hop did that this gate wants on the record

**It verified the clause by FAILING it on the old emission rather than by passing it on the new one,
and it reported that the obvious way of asking was worthless.** The masking finding is worth more
than the fix: `A1` reddens on three unsafe writers and prints the `toBe` every time, so a build that
read the runner's output would have shipped believing a clause it never ran. It found that clause (b)
alone passes the merged writer vacuously — a result no brief predicted, mine included — and it
reported a correction to its own brief (`src/frame.ts:27-29` was NOT false) rather than absorbing it.
**And it closed my `AR-1` properly**: not by doing the repair, which I could not have enforced, but
by putting a criterion under it that fails alone when the repair goes away. **My one correction to
that hop is upward.**
