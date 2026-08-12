---
task: abc028-dev-2026-08-12
subtask: ticket-to-pr-ABC-028-dev
role: software-engineer
by: software-engineer
at: 2026-08-12T07:01:21Z
method: MANUAL-BY-HAND
completed_at: 2026-08-12T07:31:00Z
moved: pending/ -> claimed/ticket-to-pr-ABC-028-dev/ -> done/ticket-to-pr-ABC-028-dev/ — ALL BY HAND
outcome: |
  `ABC-028` BUILT. TWO TEST FILES TOUCHED, **ZERO PRODUCTION LINES** — exactly what the ticket
  predicted. `src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d` unchanged, re-hashed after
  every mutant run. `src/history-pane.test.ts` +365/-0 PURE APPEND (pre-existing 607 lines proved
  byte-identical to HEAD); `src/history-pane.nfr.test.ts` +15/-7 COMMENT ONLY. File count 26.
  NOTHING MERGED, NOTHING PUSHED, NOTHING DEPLOYED, no `git checkout main`, neither live worktree
  entered. **BOARD NOT OPENED — the brief reserved it, so `In Development` -> `In Review` was NOT
  taken.**

  GATES on the branch tip: lint 0 (2 PRE-EXISTING infos, baseline read the same 2), typecheck 0,
  build 0, **750/750 on 26 files** (744 -> 750, +6, every pre-existing test still green), skip 0.
  Baseline verified on arrival first — all five of the brief's stated values matched exactly.

  **`A1` MET, `A3` MET, `A4` MET on all four clauses + 8 arming slots + the positive control.
  `A2` MET IN PART AND DECLARED SO, NOT ROUNDED UP**: both measurement forms discharged and the
  comment written, but `A2`'s literal `Given` (the `:113`+ fixtures rebuilt per test) is measured
  OUT OF TREE and deliberately not landed, because `## Out of scope` forbids the rebuild — so the
  in-tree suite carries no standing guard for the claim the new comment makes.

  **THE `WCACHE-LEN` CONTRADICTION IS SETTLED AND THE TICKET IS WRONG: it does NOT survive
  744/744.** It fails 2 of 744 on the UNMODIFIED tree, both in `src/history-pane.nfr.test.ts`
  `A11`, because a cache HIT calls `toSan` zero times and earlier tests in that file already
  rendered `AT_40`. The FALSE sentence is *survives 744/744*; *its only catcher is the incidental
  fixture sharing* is TRUE and now proved BY CONSTRUCTION — rebuild those fixtures per test with
  `A1` absent and it goes to 744/744. **THE MECHANISM IS A CALL COUNT, NOT A ROW COMPARISON**, which
  is why `A14` never caught it. Neither sentence edited; correction owed to BA/PM.

  **TRAP `RISK-ABC017-01` EDITED — the first edit after six roles read and declined.** md5
  `e27a8387d589adf21ba5b5dd2244225e` -> `65f4f29ac930d7a7f432e14f2eef47f9`, lines `:106-112`
  replaced by 15. MECHANICALLY VERIFIED that every changed line begins `//`: the `AT_*` fixtures at
  `:113`+ and all eight assertions are byte-identical, nothing rebuilt, deleted or tidied, and
  `ABC-029`'s region ~120 lines below is untouched. The edit makes the sentence true by
  construction; it does NOT act on what the sentence said.

  **TWELVE wrong builds re-specified FROM THE TICKET'S OWN DEFINITIONS (not from QE's kit), 12/12
  `tsc` 0, output-identity checked FIRST, every one RED at its INTENDED criterion and no other.**
  Six `A4` builds 1 failed/749 each; `WLEAD-ODD` red at the WHITE-CELL clause (`expected '' to be
  'Nc3'`) exactly as the ticket demanded; `WCACHE-LEN` red at `A1`; `WSPLICE` stays dead on `A9` and
  now `A4` too. My independently-built instrument reproduces QE's kill matrix cell for cell and the
  arming counter digit for digit. **`RISK-ABC028-01` RE-RUN as the standing obligation requires —
  `WBOARDBLIND` still survives, 750/750 — AND ITS WITNESS WIDENED: a `DataView` over `board.buffer`
  is equally silent, so the hole is any buffer-level write reverted before the next sampling point,
  broader than the `ArrayBuffer` alias the ticket names.** 19 further hostile shapes all reported.

  **`N8-LANE`: DELTA INSIDE, TOTAL OVER, three readings published and none picked silently.** This
  ticket +131.4 ms CPU (+1.45%) sign 11/13, null control +0.30% sign 8/13 (ADMISSIBLE; a first
  session was DISCARDED because its null sign was 7/8, and it is reported not dropped). Zero files
  added so no floor subtraction — INSIDE the standing `<= 650 ms` per-ticket bar with room. BUT the
  TOTAL re-measured from scratch reads ~850 ms net, and ~758 ms net BEFORE this ticket — already
  over. The ticket's ~575 ms is `UNKNOWN - verify` against that method. `ADR-0008` both clauses hold
  with room (1.63-1.74 s wall, 8.82-8.85 s CPU). **NO CRITERION WAS NARROWED TO FIT A BUDGET** —
  `A4`'s 2,000-ply case is 6.5 ms of the cost and stays.

  SIX NOTES PUBLISHED, hand-written in `agent-factory/contracts/context-note.md` shape: one
  `decision`, three `observation`, one `artifact-ref`, one `claim`. **NO `finding`** — none is
  admissible (no `§14-gate` verdict record under this task, `human_admission` `off`). Nothing
  self-stamped, no `index.md` / `index.jsonl` faked. TRACE: one row, three cells, 39 table lines
  before and after, 11 pipes, other 38 rows byte-identical by md5.

  FLAGGED NOT FIXED: the board lists `ABC-028` under `## Backlog` while the ticket front matter
  reads `in-development` — the two records disagree today.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND. The deviation is recorded rather than presented as compliance.

**`scripts/claim.js` does not exist in this install**, re-checked at source at this hop rather than
inherited from the brief or from the prior claim records under `done/`: `ls scripts/` returns
"No such file or directory" (there is no `scripts/` directory at all), and a `find` for `claim*` and
`context-io*` across the repository (excluding `node_modules`, `.git` and this queue's own `claim.md`
registry records) and across the kit root `/Users/olgeroeselg/.grugops/agent-factory` returns
**nothing** — no script, anywhere.

**`scripts/context-io.ts` (Workflow 16's sanctioned writer) is likewise absent**, and the structured
`mcp__grugops__propose_note` tool is **not** in this session's tool set — checked against the tools
actually available, not assumed. Notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-028-dev/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, as every prior note on this board was. No `index.md` /
`index.jsonl` is hand-faked — the tool that renders them does not exist, so `notes/` is the source of
truth and stands alone.

**No `finding` will be written on this hop.** None is admissible: there is no `§14-gate` verdict
record under this task to issue a `§14-gate#<id>` stamp, and `context.human_admission` is `off` in
`.grugops/factory.config.json`, so no `human:<name>` stamp exists either. Gate results are recorded
as `observation` — the honest degrade Workflow 16 step 4 names.

The claim IS the atomic `mkdir(2)` of this directory — the same primitive `claimTask` relies on — so
the exactly-once property is unchanged. It exited **0**, so this hop was the first writer; a second
writer would have taken `EEXIST`. The parent `.grugops/queue/claimed/` did not exist (prior hops
released it), so it was created with `mkdir -p` first; **the parent create is not the claim** — the
claim is the bare, non-`-p` `mkdir` of the task directory, which is where `EEXIST` would land.

`pending/` held nine files when this hop started (eight belong to other tickets: `ABC-019` x5,
`ABC-027` x1, `ABC-019`/`ABC-027` QE x2) and `claimed/` did not exist, so no contention was possible
on this subtask. No stale-claim sweep was owed (`claimed/` was empty) and the sweep is the
coordinator's in any case.

`at` is taken from `date -u`, never from a local clock or a test runner's `Start at` line. This
machine is UTC+3: `date -u` read `07:01:21Z` against local `10:01:21 EEST`. **That is EARLIER than
this subtask's own `enqueued_at: 2026-08-12T10:15:00Z`** — the brief's front-matter clock runs ahead
of this machine's `date -u`. Recorded rather than smoothed; `at` is the real reading, not one adjusted
to look monotonic. (The same skew was recorded on `ticket-to-pr-ABC-025-dev`.)
