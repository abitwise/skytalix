---
id: 20260809T232404Z-security-nfr-claim-eb9c945a
kind: claim
by: security-nfr
at: 2026-08-09T23:24:04Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-022
  - ABC-010
  - ABC-023
  - ADR-0005
  - NFR-001
  - NFR-003
  - plans/nfr-catalog.md
supersedes: 
---

# The soft edges of this hop — everything here is `UNKNOWN - verify` and none of it is load-bearing

Recorded so the merge/close hop does not mistake a soft edge for a measured result.

1. **The V15.1.1 / V15.2.1 severity override is a JUDGEMENT, and it is the one place this verdict
   could be wrong in a way that matters.** An L1 fail defaults to **high** and `block_on` is
   `high`, so on the default severity this gate would have **BLOCKED**. The evidence under the
   override is measured (runtime `dependencies` `{}`, manifests byte-identical to `main`, no `bin`,
   no `main`, no published artifact) but "therefore the risk has no delivery path today" is a
   reading of the requirement, not a measurement of it. A reviewer who holds that an L1 documentation
   requirement is unmet regardless of delivery path is disagreeing with a judgement. **Flagged as the
   place to push back**, and the same override has now been taken twice on this board, which makes it
   a precedent worth someone re-examining rather than inheriting a third time.

2. **The candidate eleventh instrument-limit correction rests on a SMALLER sample than the figure it
   questions.** The twin's 3.91% aggregate peak-to-peak comes from **four rounds on one machine**,
   and one low reading (6,030,890) drives most of it. The catalog's ~±1% aggregate figure came from
   a 12-round gate. My number is the more alarming and the less well-supported; it is **routed as a
   candidate, not asserted as a correction**, and the catalog was not edited.

3. **The arithmetic pricing the change is arithmetic, and the ns-per-operation figure is assumed, not
   measured.** `ABC-009`'s gate isolated the guard on an exported function to measure +1.30/+1.73 ns
   against a ±0.22 ns null floor. **This gate did not do that** — `addPawnMoves` is module-private,
   isolating it would mean exporting it or building a harness against a mutated tree, and the
   conclusion does not need it: at any cost per evaluation between 1 ns and a deliberately absurd
   10 ns the answer is the same three orders of magnitude below resolution. **The 1-10 ns band is an
   assumption**, and the conclusion is robust to it rather than derived from it.

4. **The `epSquare` sweep is exhaustive over `epSquare`, on TWO base boards.** 514 states covers the
   whole `epSquare` value range including every off-board and out-of-range value, but it varies one
   axis on two positions. It says nothing about other board populations, other move types, kingless
   boards, or interactions with castling rights. It closes the axis BA/PM's soft-edge note named; it
   does not close the space.

5. **The off-board `epSquare` states were written DIRECTLY onto the position**, because `parseFen`
   cannot produce one. That is the same direct-write instrument limit BA/PM's byte sweeps recorded,
   and it means those 386 states are reachable by no code path in the product — they test the guard's
   robustness, not a live exposure.

6. **`NFR-003`'s untouchedness is argued from a measured bound, not from a fresh timing run.** The
   per-call bound (<= 1 evaluation) is mine and exact; the tens-of-microseconds figure it is compared
   against is the catalog's, transcribed. I did not re-measure `gameStatusOf`.

7. **The downstream map is read from the import graph and from `grep`, not from a call-graph tool.**
   `generateMoves`' only non-test caller being `src/legal.ts:46` is a grep result over `src/*.ts`
   excluding test files. Dynamic dispatch would defeat it; there is none in this codebase that I saw,
   but I did not prove its absence.

8. **`ADR-0005` 133-138: I named an owner, I did NOT adjudicate the ADR.** Whether it should be
   amended, how, and whether the trigger I attached (this ticket's merge) is the right one are
   Architect/Design's. Naming an owner for an unowned accepted risk is inside this role's hard limit;
   deciding the ADR's content is not.

9. **I did not re-derive QE's or BA/PM's evidence.** The fourteen-tree campaign, the three surviving
   builds, the 120 hardening rows, the 8-vs-23 disjoint split, the 512-state and 131,072-state
   sweeps, and the `A1`-`A9` / `A11` verdicts are carried as theirs. If any of those is wrong, nothing
   at this hop would have caught it. **`A10` is the only criterion this gate re-derived.**

10. **`A5`'s enemy-occupant axis, the castling present-tense pair, and `ABC-023`'s stale hash pin were
    NOT re-measured here** — I accepted the routing and the prior measurements. If those attributions
    are wrong, this hop did not check them.

11. **All throughput figures are one machine** — Apple M3 / Node v24.12.0 / darwin-arm64, four scored
    rounds. `UNKNOWN - verify` anywhere else. **No per-cell and no per-run cost figure should be
    quoted from my numbers by anyone, including the merge hop.**

12. **UAT is deliberately not ruled on and this note does not imply a ruling either.** Prior gates on
    this board recorded "UAT deferred -> `EPIC-006`, explicitly NOT passed", and that is very likely
    where this lands — but it is the Orchestrator's to state, and me predicting it in a note would be
    the same overreach as writing the cell.

13. **Queue and note plumbing deviate from the workflows as written, and the deviation is recorded
    rather than presented as compliance.** `scripts/claim.js` and `scripts/context-io.ts` do not
    exist in this install — **re-checked at the source rather than trusted from the brief or from the
    six prior claim records: `ls scripts` in the repository exits "No such file or directory", the
    same for `/Users/olgeroeselg/.grugops/agent-factory/scripts`, and a `find` for `claim.js` and
    `context-io.*` across both trees returns nothing.** `mcp__grugops__propose_note` is not in this
    session's tool set. The claim was a plain atomic `mkdir` (exit 0, so first writer) and these
    notes are hand-written in the exact shape of `agent-factory/contracts/context-note.md`. **No
    `finding` is written** — none is admissible: no §14 gate exists here to issue a `§14-gate#<id>`
    stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists either. **Nothing
    is self-stamped and no `index.md` / `index.jsonl` was hand-faked.** `at` was taken from `date -u`;
    this machine is **UTC+3** and the local clock had already rolled to 2026-08-10 while UTC was still
    2026-08-09, so every timestamp and date in this hop is the UTC one.
