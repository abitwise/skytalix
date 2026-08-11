---
id: 20260812T165000Z-qe-e2e-decision-verdict-secgate-and-board-9f4d2b68
kind: decision
by: qe-e2e
at: 2026-08-12T16:50:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-narrow
  - ABC-017
  - ABC-019
  - NFR-002
  - NFR-008
  - plans/board.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
  - 20260812T140000Z-orchestrator-decision-merge-call-d71b3e05
  - 20260812T145000Z-ba-pm-decision-size-priority-lane-and-board-9b5c31a7
  - 20260812T154000Z-software-engineer-observation-lane-cost-measured-a20f5c73
supersedes:
---

# VERDICT `PASS_WITH_RISKS`; Security/NFR need NOT re-open, and that is MEASURED; board move requested `In Review` → `In Security/NFR`

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, and no
> self-attested stamp — the §14 gate machinery does not exist in this repo.

# VERDICT: **PASS_WITH_RISKS**

**All 14 criteria are met as written**, on the delivered tree: lint / typecheck / build exit 0,
**744/744 on 26 files**, skip **0**, `src/history-pane.ts` md5
`54fd4346dcc1a0060c4e66ae0149265d`, 0 behind `main`.

**Not `PASS`**, because four wrong builds survive the whole project inside the four criteria this
ticket just cut to close four gaps, and one of them — `WLEAD-ODD` — reproduces `WLEAD-B`'s phantom
empty white cell one parity over, passing the criterion added for it.

**Not `FAIL`**, and the reason is unchanged from my first pass and re-measured here: **every survivor
is a gap in what the criteria ASK, not a defect in what the Engineer BUILT.** The delivered pane is
correct on all of them, verified case by case. A `FAIL` routes to the Engineer, who has nothing to
fix — the pane needed no production line and still does not.

**The four gaps closed, with the measurement, in the order the brief asked:**

| gap | closed? | measurement |
|---|---|---|
| **`G1`** | **YES for all three named builds** — class narrowed, not eliminated | `WLEAD-A` ×2, `WLEAD-B` ×1, `WLEAD-C` ×2, all on `A6`'s fourth anchor. **Residual: `WLEAD-ODD` survives 744/744** |
| **`G2`** | **YES for both named builds** — class narrowed, not eliminated | `WFREEZE` ×1 and `WCACHE` ×3 on `A14`. **Residual: `WCACHE-LEN` survives `A14` entirely** |
| **`G3`** | **YES for both named builds** — class narrowed, not eliminated | `WFENSET` ×1 on the anchor clause, `WSPLICE` ×1 on the during-render freeze. **Residual: `WFENMID`, `WPOSMID`, `WBOARDMID`, `WMOVESWAP` all survive 744/744** |
| **`G4`/`RF-1` reach** | **YES, and wider than specified** | `WDYNIMP` and `WBAREIMP` dead, plus `WQUERY`, `WREEXPORT`, `WINDIRECT`. **Residual: `WPERFT-DYN` survives — a root the probe excludes** |

**The probe is SOUND and DETERMINISTIC** — 12/12 identical, no wall-clock assertion, three controls
proven falsifiable by standalone re-execution, and the `?arming` fix verified on the two builds that
caused the original defect. Its two wrong-reason-RED routes and its one wrong-reason-PASS are
measured in the probe note; the pass route and the `perft-bench.ts` gap are the same fact seen from
two sides.

**The risks, in the order I would spend on them** — all four route to **BA/PM**, none to the Engineer:

1. **`A14` does not own freshness alone** (`WCACHE-LEN`). The ticket now asserts that it does, and the
   delivered file carries a signed comment inviting the deletion of the only actual catcher. Highest
   priority because the record is now *actively wrong in a way that instructs a future hop*.
2. **`A6`'s fourth anchor pins one parity** (`WLEAD-ODD`). Same blast radius as `G1` had: a
   phantom cell and a dropped ply on every odd black-anchored slid window.
3. **`A9`'s during-render clause covers `moves`-contents only** (four survivors). Low present harm —
   all four restore before returning and nothing observes the interval today — but it is `D26`'s own
   class surviving `D26`.
4. **`A11`'s "production module" is undefined** (`WPERFT-DYN`). One clause; the ruling may
   legitimately be to exclude the benchmark harness explicitly.

# Does the Security/NFR gate have to RE-OPEN? **NO — and I measured the premise rather than agreeing with it**

The brief asked me to say plainly, and said it would act on the answer. **I agree with the brief, and
here is what I checked rather than assumed:**

| the gate's figure | rests on | verified how |
|---|---|---|
| `A12`'s three parts | production compute | **all 16 production modules byte-identical to the gate's own tree at `c656df7`** — md5-compared file by file, not inferred from a diff summary |
| the replay-coefficient band | production compute | same |
| the importer closure (`ZERO` production importers) | the import graph | **re-derived independently, a fourth count: FOUR total, ZERO production**, statement-scoped, with the textual surface swept exhaustively first — zero re-exports, zero bare imports, zero extensionless paths |
| the security byte audit | the pane's output bytes | same production tree; the pane's output is unchanged because the module is |

`git diff --numstat c656df7..HEAD -- src/` lists **no non-test file at all**. The hop that ran between
the gate and now wrote **zero production lines**, and I confirmed that against the commit rather than
against the note claiming it.

**So there is nothing for that gate to re-measure, and re-opening it would be ceremony.**

**But the narrow `A11`-only re-gate the Orchestrator already scheduled should carry three items it
does not yet know about**, all of which are properties of the instrument **that gate itself
specified**:

1. **`N8-LANE`'s running total moved on that gate's own NFR surface.** The Engineer measured
   +164–182 ms warm / +167 ms cold, taking the total to **~575 ms of a 650 ms allowance (~88%)**, of
   which **~102 ms is the `RF-1` child process** — over half the delta, on the instrument `RF-1`
   asked for. `N8-LANE` **HOLDS**, the file count is still **TWO**, and **I am not re-deriving the bar
   and did not** (the ticket forbids it). It is named because the gate that owns NFR bars should see
   the number, not discover it.
2. **The probe's stdout channel is shared with the modules under test**, with a dated trigger
   (`EPIC-006`'s CLI entry point) and a same-day reproduction (`perft-bench.ts` as a root).
3. **`perft-bench.ts` is outside the probe's roots**, so `A11`'s structural property is unguarded
   there in four of its five forms.

**On the cost lever that gate and the Engineer both flagged:** narrowing the probe's roots saves
**3.6 ms of 55.7 ms** and loses a measured kill; the dominant term is process spawn at 19.0 ms. **The
probe is near the floor of its instrument class and cannot be made meaningfully cheaper without
losing what it catches.** That is a measurement, and it is offered so the "revisit `RF-1` first"
flag is not acted on as though it were free.

# What I explicitly did NOT do

- **I did not re-litigate the `A11` per-test-fixture ruling as a preference.** The brief said to judge
  the **measurement**, and I did: the Engineer's measurement is **right and reproduced exactly**
  (`1 failed | 17 passed (18)`), and the **generalisation drawn from it is wrong**. I ask for the
  opposite of the tidy-up — the sharing is still load-bearing and the comment saying otherwise is the
  defect.
- **`G5`/`AR-4` stays OPEN and UNOWNED.** `WCOLS24R` not rebuilt, `HISTORY_COLS` **HOLDS at 21**, no
  widening, no criterion here or anywhere, no constant-FRAME-width criterion, `ADR-0009` and
  `ADR-0010` **not re-opened**. Every reason on the ticket still holds and I checked them.
- **I did not re-run the 22 mutants.** Zero production lines changed and the module md5 is identical,
  exactly as the brief said.
- **I did not decide the merge.** `ABC-017` merges third of four; sequencing is the Orchestrator's and
  authorising it is a human's. Nothing was merged, pushed or deployed, and `git checkout main` was
  never run.
- **I wrote no production line and no test line.** All 28 mutation cycles ran out of tree with the
  md5 re-asserted after each. No existing test was weakened, skipped or deleted; **skip count is 0**.

# BOARD MOVE REQUESTED — NOT TAKEN

**`ABC-017`: `In Review` → `In Security/NFR`.** `plans/board.md` is the Orchestrator's and was **not**
written; the ticket frontmatter `column` was not written either, for the same reason.

The QE exit is earned: the ticket is broken-tested against the new criteria, the result and the gaps
are reported, and the gaps are recorded for BA/PM rather than held as a block.

**WIP consequence, stated rather than assumed:**

| column | before | after if granted | limit |
|---|---|---|---|
| `In Review` | 2/3 (`ABC-017`, `ABC-019`) | **1/3** (`ABC-019`) | 3 |
| `In Security/NFR` | 0/2 | **1/2** | 2 |
| `In Development` | 0/3 | 0/3 — unchanged | 3 |

**Both inside their WIP limits.** This assumes the Engineer's requested `In Development` → `In Review`
move was granted; if it was not, `ABC-017` is still in `In Development` and the move requested here is
`In Development` → `In Review` → `In Security/NFR` collapsed into one, with the same end state and
the same limits respected. **The board is the Orchestrator's and I did not read the branch's copy as
authoritative** — it is one commit stale by BA/PM's own measurement and `main`'s is correct.

**The destination is a judgment, not a formality, and here is the alternative I considered and
rejected.** The four gaps route to BA/PM, so `In Review` → `In Analysis` would also be defensible. I
am not requesting it, for three reasons: none of the four is blocking (the pane is correct on all of
them and both prior gates found zero code defects); the narrow Security/NFR re-gate on `A11` is
**already owed and already scheduled**, and three of the items I found land precisely on it; and this
ticket has now taken two backward moves, each of which cost `ABC-019` a hop it is genuinely blocked
on. **Whether to spend a further BA/PM hop on these four before merging third, or to merge and carry
them, is the Orchestrator's call and I do not make it** — but unlike last time I will say which way
the evidence leans: **risk 1 is the one I would not carry**, because the ticket and the delivered test
file now both assert something measurably false in a form that instructs the next hop to delete a
guard.
