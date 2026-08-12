---
id: 20260812T073000Z-software-engineer-claim-criterion-verdicts-a2-in-part-9c8de0e2
kind: claim
by: software-engineer
at: 2026-08-12T07:30:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - RISK-ABC017-01
  - RISK-ABC028-01
  - NFR-008
  - N8-LANE
supersedes:
---

# The four verdicts — three MET, one MET IN PART, and the partial one is declared not rounded

> **Hand-authored `claim`, deliberately NOT a `finding`.** `context.human_admission` is `off`, there
> is **no `§14-gate` verdict record under this task** to issue a `§14-gate#<id>` stamp, and no named
> human has granted a `human:<name>` stamp. **`confidence: high` refers to the measurements, which are
> reproducible from the method stated in the sibling notes; it is not an admission status.** The gate
> results below are recorded as measurements, never as a stamped verdict.

## The gates on the branch tip, run by me in the worktree

```
lint       exit 0   (2 infos — biome config-migration hints, PRE-EXISTING: the baseline read the
                     same 2 before any edit, on 46 files then and now)
typecheck  exit 0
build      exit 0   (tsc --noEmit — honest naming, per AGENTS.md)
unit       750 passed (750) on 26 files   [744 -> 750, +6, every pre-existing test still green]
skip       0
```

Baseline verified on arrival before anything was written, so any red would be attributable to me:
lint 0, typecheck 0, **744/744 on 26 files**, skip 0, `src/history-pane.nfr.test.ts` md5
`e27a8387…`, `src/history-pane.ts` md5 `54fd4346…` — **all five matched the brief exactly.**

## `A1` — MET

The 20-ply black-anchored fixture, rendered, then `b8c6`, then `takeBack(history, 1)` and `g8f6`,
rendered again. Panes 2 and 3 differ, the last row moves `37. Nb1 Nc6` -> `37. Nb1 Nf6`, and
`history.moves.length` is **21 at both**. Reproduces the cutting hop's witnessed output line for
line. **Kills `WCACHE-LEN`**, which fails on `the third pane must not repeat the second`. Not folded
into `A14` (`## Test notes` 2); not weakened to a second `playMove` (the ticket's blockquote).

## `A2` — **MET IN PART, and it is stated as in part rather than rounded up**

**The measurement half is MET, in BOTH of `A2`'s forms**, which is more than the criterion asks:

- the **preferred** form — `vitest run src/history-pane.test.ts` alone, the nfr file not loaded at
  all: `WCACHE-LEN` **1 failed / 24** and naive `WCACHE` **2 failed / 24** (it survived 18/18 before);
- the **literal** `Given` — the `:113`+ fixtures rebuilt per test, full suite: both die, at
  **1 failed / 750** and **2 failed / 750**, and **every kill is in `src/history-pane.test.ts`, none
  in `src/history-pane.nfr.test.ts`**, which is `A2`'s `Then` word for word.

**The comment half is MET**: `:106-112` replaced, saying only what is true and naming
`src/history-pane.test.ts` as the owner of the property. md5 `e27a8387…` -> `65f4f29a…`.

**WHY IT IS ONLY IN PART.** `A2`'s literal `Given` is *"the fixtures at
`src/history-pane.nfr.test.ts:113` and following **rebuilt per test**"*, and that rebuild is measured
**OUT OF TREE and deliberately NOT LANDED** — `## Out of scope` refuses it (*"`A2` establishes that it
may be done; it does not ask for it"*) and the brief forbids it in terms. The consequence, stated
plainly: **the in-tree suite carries no standing guard for the claim the new comment now makes.** If a
later hop does rebuild those fixtures, nothing in the repository re-checks that `WCACHE-LEN` still
dies — the evidence lives in this note and in the ticket, not in a test. That is a real gap between
what `A2` says and what the tree can enforce, and it is the reason this is *in part* and not *met*.

## `A3` — MET

21 plies from the black-to-move anchor. Row 1's white cell holds **`Nc3`** (read positionally, and
its black cell `Nb8`); eight rows of `HISTORY_COLS`; numbers **30..37**; last row **FULL**,
`37. Nb1 Nc6`. **Kills `WLEAD-ODD`** at exactly the clause the ticket demanded be the one that
reports — `expected '' to be 'Nc3'` — and the ticket's warning was verified rather than trusted: at
21 plies `WLEAD-ODD` renders the SAME eight rows, the SAME numbers and the SAME full last row, so the
other three clauses genuinely cannot discriminate and are labelled context in the test itself.

## `A4` — MET, on all four clauses, all eight arming slots and the positive control

1. **zero writes recorded** — exactly `0` at all ten lengths;
2. **the board's 128 bytes never differ at a sampling point** — no sample differs at any length;
3. **the instrument LOOKED** — counter `5/40/135/763/832/982/1485/1896/3484/18677`, non-zero at every
   one of the ten lengths, asserted FIRST in the `it`;
4. **the tripwire** — rendering through the view is byte-identical to rendering the bare object, at
   20 plies.

**Arming per slot: all eight FIRE. Positive control: does not fire, samples 6.** Nineteen further
hostile shapes beyond the ticket's table were also reported, including the `castling` / `epSquare` /
`halfmoveClock` / `Move`-field coverage the ticket CLAIMS at no extra cost — now measured.

**All seven named discriminating builds die at all ten lengths**, `WSPLICE` stays dead, `WCLEAN` is
green. **`RISK-ABC028-01` re-run on this changed instrument as the standing obligation requires:
`WBOARDBLIND` still survives, `750 passed (750)`.**

## What I do NOT certify

- **That twelve is the complete set of wrong builds.** They were re-specified from the ticket's own
  definitions; `ABC-023`'s QE hop found fourteen where its ticket predicted two.
- **That `A4` catches everything.** It provably does not: `RISK-ABC028-01` is open by construction,
  and I widened its witness — a **`DataView`** over `board.buffer`, reverted with no intervening graph
  access, is equally silent. **The honest hole is *any buffer-level write reverted before the next
  sampling point*, which is broader than the `ArrayBuffer` alias the ticket names.** Reported to
  BA/PM; no ticket text edited.
- **That the `N8-LANE` TOTAL is met.** The **delta** (+131.4 ms, 0 files added) is inside the standing
  `<= 650 ms` per-ticket bar with room. The **total** measured from scratch reads ~850 ms net and read
  ~758 ms net **before this ticket**, and the ticket's ~575 ms running total is `UNKNOWN - verify`
  against that method. Three readings are published in the sibling `observation` note and **I did not
  pick one silently.** Owner: `ABC-026`.
- **Any figure on other hardware or another runner.**
- **That `ABC-028` may leave `In Review`** — that exit is QE/E2E's — or that it may move at all: the
  board is the Orchestrator's and I did not open it.
- **That this is gate-stamped.** No §14 gate ran under this task. Every number above is a measurement
  I took and recorded as `observation` / `claim`, never as a `finding`.

## Owed to others, not absorbed here

1. **BA/PM** — the `WCACHE-LEN` *"survives 744/744"* correction (it fails 2 of 744); `RISK-ABC028-01`'s
   wording widened to any buffer-level write; the `A4` lane figures `748` / `1 failed, 747 passed`
   restated for a six-`it` ticket (`750` / `1 failed, 749 passed`).
2. **Orchestrator** — the `In Development` -> `In Review` board move, which the brief reserved; and the
   board/ticket disagreement (board has `ABC-028` in `## Backlog`, front matter says
   `In Development`).
3. **`ABC-026`** — the lane total, which is over 650 ms by a from-scratch measurement and was over
   before this ticket.
4. **QE/E2E** — the `In Review` exit.
