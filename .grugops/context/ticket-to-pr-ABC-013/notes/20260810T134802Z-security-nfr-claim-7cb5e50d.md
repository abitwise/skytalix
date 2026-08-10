---
id: 20260810T134802Z-security-nfr-claim-7cb5e50d
kind: claim
by: security-nfr
at: 2026-08-10T13:48:02Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-013
  - ABC-016
  - ABC-017
  - EPIC-003
  - EPIC-006
  - NFR-002
  - src/san.ts
supersedes: 
---

# What this gate does NOT establish — the list UAT and the next gate should start from, not the list they should trust

The verdict is `PASS_WITH_RISKS` and the four bars were re-derived rather than inherited. **That is
not "the non-functional behaviour of `toSan` is settled", and this note exists so the PASS cannot
later be read as though it were.**

| # | claim I am NOT making | who | how to attack it |
|---|---|---|---|
| 1 | **that `N2` / `N3` / `N4` hold on any other machine** | future Security/NFR | Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 only. Three wall-clock bars on one machine class remain `UNKNOWN - verify` everywhere else, exactly as the Engineer said. `N1` is a ratio and travels across hardware — but see row 2 |
| 2 | **that `N1`'s ratio has a floor of 4.33x** | future Security/NFR | Five positions is a sample, not a bound. Nothing here searched for the minimum, and a position with a higher pawn share and no checks would read lower still. What IS established is that the ratio is not position-independent and dips under its own bar; where the true floor sits is unmeasured |
| 3 | **that 14 µs is the right `N4` bar** | **a human**, advised by BA/PM | This gate established that the number the bar was derived FROM is a group mean rather than a worst, so the real margin is ~1.32x and not the 1.5x the derivation claims. It did **not** decide whether the bar should move, and deliberately did not move it. That is a target decision and a gate does not take one |
| 4 | **that the worst case at `P60` is the worst case anywhere** | `ABC-016` / `ABC-017` | Every figure here is at one pinned position. `ADR-0003` publishes a 1.8–5.4 µs range for `legalMoves`, and a checking piece move pays two of them, so a nastier position could plausibly reach ~11 µs. The 1.24 ms / 7.8%-of-a-frame ceiling in the frame note is **labelled arithmetic over the worst move measured here**, not a measured worst case over all positions |
| 5 | **that `NFR-002` holds for a real frame** | `ABC-016` / `ABC-017` / `ABC-018` | What was measured is the SAN COMPUTE component alone. There is no renderer that calls `toSan`, so the composition — board scan + status panel + history pane + the write half — was not measured on this hop and is not claimed. The three pieces have each been measured separately at three different gates and never together |
| 6 | **that the security half would still be untriggered if a caller changed** | `EPIC-003` | The whole security result rests on one structural fact: `toSan` takes no string. `EPIC-003` adds `parseSan` **to this same file**, and a parser takes a string from a user. **The module's security posture is re-opened by that hop, not inherited from this one**, and the ASVS L1 rows this gate found inert (`V1.3.2`, `V2.2.1`, and the injection chapter generally) become live questions there |
| 7 | **that the 68 expected strings conform to the FIDE/PGN specification** | future QE | Not re-opened here and not a security or NFR question. QE's external-oracle result is the strongest evidence on it and its own stated limit — agreement with a widely-used library is not the specification text — stands unchanged |
| 8 | **that the test-integrity step passed** | **a human** | It exited **2**: the checker exists, `.grugops/test-skips.md` does not. Recorded as an error and never as a pass, for the third hop running. Nothing is hidden on this ticket — the skip count is independently 0 — but a human owns that registry and it is now owed by three tickets |
| 9 | **that `ABC-013` is ready to merge** | the Orchestrator, with the owner | This gate returns a result. It does not merge, it has not been through UAT, and the owner's standing directive applies to work that passed the whole lane, not to a green gate. Nothing was merged and nothing was deployed |

## The one I would look at first if something here is still wrong

**Row 5.** Every non-functional number this project holds about `EPIC-002` was measured on a
*component in isolation* — the board scan at `ABC-014`'s gate, the write half at `ABC-018`'s, the SAN
compute here — and `NFR-002` is a budget over their **sum in one frame**. Each part is comfortably
inside it; nobody has yet measured the whole. That is not a defect in any of the three measurements,
and it is the shape of a bar that passes three times and fails once.

## Why this is a `claim` and not a `finding`

No `finding` is admissible on this task and nothing here is self-stamped. There is no `§14-gate`
verdict record under this task to issue a `§14-gate#<id>` stamp — `emitVerdict` lives in
`scripts/context-io.ts`, which does not exist in this install — and `context.human_admission` is
`off` in `.grugops/factory.config.json`, so no `human:<name>` stamp exists either. Per Workflow 16
step 4 the honest degrade is a `claim` carrying `confidence: UNKNOWN - verify`, which is what this is;
the measured results in the sibling notes are `observation`, which is their honest kind, and the
verdict is a `decision`. **No `index.md` / `index.jsonl` was hand-faked**, and the absence of the
sanctioned writer is on this task's record for the fourth hop in a row.
