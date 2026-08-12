---
task: abc029-dev-2026-08-12
subtask: ticket-to-pr-ABC-029-dev
role: software-engineer
by: software-engineer
at: 2026-08-12T07:44:38Z
method: MANUAL-BY-HAND
completed_at: 2026-08-12T08:08:36Z
moved: pending/ -> claimed/ticket-to-pr-ABC-029-dev/ -> done/ticket-to-pr-ABC-029-dev/ — ALL BY HAND
outcome: |
  `ABC-029` BUILT. **TWO FILES, and `src/history-pane.ts` is ONE LINE — the only production line this
  ticket was permitted.** md5 `54fd4346dcc1a0060c4e66ae0149265d` -> `c4653c4c263c4c417ea34969164ccd86`,
  expected and correct. `src/history-pane.nfr.test.ts` +147/-44 (338 -> 441 lines), **test count
  UNCHANGED at 8 — nothing added, weakened, narrowed or deleted.** No new file, no new dependency,
  lane file count stays TWO. **I did NOT conclude a second production line was owed.**

  GATES on the branch tip: lint **0** (2 pre-existing infos, baseline read the same 2), typecheck
  **0**, build **0**, **750/750 on 26 files**, skip **0**. Baseline verified on arrival first — all
  four of the brief's stated values matched exactly.

  **`A1` MET, `A2` MET, `A3` MET, `A4` MET, `A5` MET ROW BY ROW ON BOTH TREES. Nothing rounded up.**
  `A1` counted: exclusion-literals **2 -> 0**, cited declaration/licence entries **0 -> 6** (5
  frame-path + 1 licence), each at exactly one site, **no third hand-maintained filename created**.

  **`A5` verified OUT OF TREE with the REAL instrument under REAL vitest**, `ABC-019`'s tip
  reconstructed from the git object database (`turn-loop.ts` md5 `bd793612…` reproduced; 16 shared
  files `cmp`-identical; **`../cli-chess-ABC-019` never opened**). A5.1 BASE 16-file green/green;
  A5.2 BASE 17-file green/green; A5.3 `WSTALELICENCE` regex RED; A5.4 `WPERFT-STATIC` and
  `WOFFFRAME-STAT` regex RED on both; A5.5 `WLOOPINFRAME` probe RED. The rig was validated against the
  record first: the delivered instrument reproduces green/green here and **RED/RED on the tip with the
  recorded messages verbatim**.

  **THE THREE FORBIDDEN BUILDS WERE WRITTEN FIRST AND EACH DIED AT ITS OWN ROW.** `W1` (`toEqual([])`)
  RED at A5.2 and blind at A5.3; `W2` (`toEqual(["turn-loop.ts"])`, cl. 3 read literally) **RED at
  A5.1 — on this ticket's OWN blocking gate, so it never merges and the `P0` stays blocked forever**;
  `W3` (subset) green everywhere **except A5.3**, silently dropping `WSTALELICENCE`. `W3` is the build
  `A1`-`A4` alone would have produced and it differs from the kept one by one `filter`.

  **EXACTLY ONE KILL IS GIVEN UP AND IT IS A LOSS, NOT A SUMMARY LINE: `WOFFFRAME-DYN`** — a
  non-static pull in an unlicensed, off-frame-path module (`zobrist.ts`) — measured **green/green on
  both trees**, caught by nothing. The static form is still caught. Gains confirmed by construction:
  **`WLOOPINFRAME`** (probe RED) and **`WSTALELICENCE`** (regex RED).

  **`A2` measured before and after:** `WSTDOUT` was the sole red with
  `Unexpected token 'g', "glyph-mode"... is not valid JSON`; after moving the report to **fd 3** with
  the child's stdout discarded it is **green/green on both trees**. `WSTDERR` still survives — no
  over-reach onto stderr. Determinism **12/12, 0 flaky**. All three controls still falsifiable
  (`roots = []` fails BOTH positive controls; the arming control still reports `history.ts`).

  **THE HONEST QUESTION ANSWERED BY MEASUREMENT RATHER THAN REASONING.** The post-rebase tree is fully
  reconstructible (the branches differ only by the three `turn-loop` files and two `history-pane` test
  files `ABC-028` already superseded). Built and gated out of tree: **802/802 on 28 files, skip 0,
  typecheck 0, lint 0 — BOTH named instruments GREEN.** It is NOT a run of `ABC-019`'s gate and it is
  a snapshot of a moving ref; both caveats are recorded.

  **`N8-LANE`:** mechanism-level delta **-0.6 ms** on the probe child (n=24 interleaved), reproducing
  the design hop's -0.3 ms. Whole-lane CPU session 2 reads -100 ms (-1.09%) against a null control of
  -24 ms with the SAME 6/9 sign ratio, **so I do NOT claim it as a real reduction** — only that the
  lane did not get more expensive. **Session 1 is reported, not dropped: it failed on its own null
  control.** `ADR-0008` both clauses hold with room (1.76-2.03 s wall, 8.97-9.08 s CPU).

  SEVEN NOTES PUBLISHED, hand-written in `agent-factory/contracts/context-note.md` shape: one
  `decision`, four `observation`, one `artifact-ref`, one `claim`. **NO `finding`** — none is
  admissible. Nothing self-stamped; no `index.md` / `index.jsonl` faked. TRACE: one row, three cells,
  39 table lines before and after, 11 pipes, other 38 rows byte-identical by md5.

  **BOARD NOT OPENED — the brief reserved it, so `In Development` -> `In Review` was NOT taken.**
  `ABC-028`'s inherited comment block and the `AT_*` fixtures verified BYTE-IDENTICAL to HEAD by `cmp`
  on the exact ranges; the six pre-existing assertions likewise. NOTHING MERGED, NOTHING PUSHED,
  NOTHING DEPLOYED, no `git checkout main`, none of the four live worktrees entered.

  FLAGGED NOT FIXED: `ABC-028`'s board row (`In Development`) still disagrees with its ticket front
  matter (`Backlog`); the ticket's `~102 ms` `RF-1` figure does not reconcile with its own recorded
  56.9-70.0 ms range (I measure ~57 ms) — an input for `ABC-026`; and `ABC-019`'s recorded tip count
  has moved from 791 to 796 with the two failures identical.
---

# Claim record — the now-running registry entry

Queue claim taken **BY HAND**. The deviation is recorded rather than presented as compliance.

**`scripts/claim.js` does not exist in this install**, re-checked at source at this hop rather than
inherited from the brief or from the prior claim records under `done/`: there is no `scripts/`
directory in this worktree at all, and no `claim*` / `context-io*` file anywhere in the repository
(outside `node_modules`, `.git` and the queue's own `claim.md` registry records) or under the kit root
`/Users/olgeroeselg/.grugops/agent-factory`.

**`scripts/context-io.ts` (Workflow 16's sanctioned writer) is likewise absent**, and the structured
`mcp__grugops__propose_note` tool is **not** in this session's tool set — checked against the tools
actually available, not assumed. Notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-029-dev/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, as every prior note on this board was. No `index.md` /
`index.jsonl` is hand-faked — the tool that renders them does not exist, so `notes/` is the source of
truth and stands alone.

**No `finding` will be written on this hop.** None is admissible: there is no `§14-gate` verdict
record under this task to issue a `§14-gate#<id>` stamp, and `context.human_admission` is `off` in
`.grugops/factory.config.json`, so no `human:<name>` stamp exists either. Gate results are recorded as
`observation` — the honest degrade Workflow 16 step 4 names.

The claim IS the atomic `mkdir(2)` of this directory — the same primitive `claimTask` relies on — so
the exactly-once property is unchanged. It exited **0**, so this hop was the first writer; a second
writer would have taken `EEXIST`. The parent `.grugops/queue/claimed/` did not exist (prior hops
released it), so it was created with `mkdir -p` first; **the parent create is not the claim** — the
claim is the bare, non-`-p` `mkdir` of the task directory, which is where `EEXIST` would land.

`pending/` held **one** file when this hop started — this subtask, and nothing else — and `claimed/`
did not exist, so no contention was possible. No stale-claim sweep was owed (`claimed/` was empty) and
the sweep is the coordinator's in any case.

`at` is taken from `date -u`, never from a local clock or a test runner's `Start at` line. This machine
is UTC+3: `date -u` read `07:44:38Z` against local `10:44:38 EEST`. **That is EARLIER than this
subtask's own `enqueued_at: 2026-08-12T10:45:00Z`** — the brief's front-matter clock runs ahead of this
machine's `date -u`. Recorded rather than smoothed; `at` is the real reading, not one adjusted to look
monotonic. (The same skew was recorded on `ticket-to-pr-ABC-025-dev` and `ticket-to-pr-ABC-028-dev`.)
