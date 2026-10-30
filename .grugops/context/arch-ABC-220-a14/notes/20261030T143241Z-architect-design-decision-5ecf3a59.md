---
id: 20261030T143241Z-architect-design-decision-5ecf3a59
kind: decision
by: architect-design
at: 2026-10-30T14:32:41Z
verified_by: 
confidence: high: records-only ruling inside ADR-0052 D7's intent; bound, order, count unchanged; code 68ba364c read with git show, nothing run
refs:
  - arch-ABC-220-a14
  - ABC-220
  - EPIC-009
  - ADR-0052
  - ADR-0044
  - ABC-173
  - ABC-168
  - ABC-119
  - NFR-011
  - NFR-004
  - AR-NFR004-A
  - se-ABC-220
  - 68ba364c
  - f22e31b3
  - src/uci.real-engine.test.ts
  - src/uci-session.ts
supersedes: 
seal: sha256:881756509d0e8831a820f407bed8b144d7d66142aeb7eb1e13b2f9079e77d11e
---

# Architect/Design decision, arch-ABC-220-a14: A14 split into a lane row and a QE hand reading; two confirmations

Records only, at `main` `f22e31b3`, on branch `grugops/arch-ABC-220-a14`. Input: the SE's F1 and F2 (`se-ABC-220` `…a76bc514`, `…80ed6a2f`) and code `68ba364c` (read with `git show`). Nothing was built, run or timed.

## Ruling on F1 (A14 cannot be read as written): both routes
- **The cause.** The real-child lane's child is synchronous (`spawnSync`; `ABC-173` `C2` bars every asynchronous `child_process` form in `src/**/*.test.ts`). Its stdin script is written whole at spawn, and its stdout comes back whole at exit. The lane can send nothing "100 ms later" and has no time for any one line.
- **A14a, the lane row** (`UCI_DEEP`, `src/uci.real-engine.test.ts`): exactly 2 `readyok` and 1 `bestmove`; the busy `readyok` is the line straight after the `bestmove` and is the last line; no line lost or refused; the `bestmove` is legal; spawn to exit ≥ 2 000 ms; M4; exit 0, empty stderr. It reads no time between lines. `68ba364c` already asserts exactly this, so no SE hop is owed.
- **A14b, the QE hand reading** (the ≤ 100 ms bound): one asynchronous probe under `.grugops/context/qe-ABC-220/probe/`, run with plain `node`, never through vitest. This is the `ABC-168` `A6` / `NFR-011` precedent. The probe writes `isready` 100 ms after `go movetime 2000`. R1: `bestmove` arrival → `readyok` arrival ≤ 100 ms. R2: the `isready` was written before `bestmove` arrived (else "not busy", missed). R3: one `readyok` per `isready`, one `bestmove`, and the busy `readyok` is the first line after it. 10 000 ms with no reply is a miss. One counted run. Host, Node, load1 (`os.loadavg()[0]`), tip sha. Any miss makes A14 NOT MET. It runs in QE's ALONE window, never alongside A11 or A12. The protocol is on the ticket (A14b, test note 5).
- **Rejected:** opening `C2` for one async child in the lane. That is `ABC-168`'s route (1), which reopens an addendum the owner accepted. Also rejected: dropping the 100 ms bound, which would move D7's requirement and need the owner.
- **No requirement moved.** D7's bound, order, count and "no line lost" all stand. So there is no owner item.

## Confirmations
- **Refusal text: confirmed.** `info string TimeMode takes level or simple-tournament, got <v>; kept <old>` is D1's rule spelled for the values offered at this build, from the same frozen tuple as the `combo` line. An empty value reads `got nothing`. At `ABC-221` the same code gives D1's three-value text with no edit. (`ADR-0052` D1 dated line; `ABC-220` A10.)
- **A14a in `src/uci.real-engine.test.ts`: confirmed.** That file is the "opt-in real-child lane" D7 and D9 name. `src/uci-session.test.ts` has no spawn site, so spawning there would add one. What D8 guards holds: no new file, no new delivery file, no new spawn site (`runDialogue` stays the only `spawnSync`). (`ADR-0052` D8 dated line; ticket Scope 6.)

## Where it is written
`ADR-0052`: a § Status bullet plus dated lines in D1, D7 (the two instruments, and the bound reading), D8 and D9. `ABC-220`: a dated header block, A14 re-worded into A14a/A14b with the old text struck, A10 confirmed, Scope 6, test note 2, a new test note 5, and a § NFR triggers line.
