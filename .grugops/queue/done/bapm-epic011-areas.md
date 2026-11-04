---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:31:10Z
subtask: bapm-epic011-areas
role: ba-pm
ref: .grugops/context/bapm-epic011-areas/
branch: new grugops/bapm-epic011-areas from main — worktree .claude/worktrees/bapm-epic011-areas
width: records only; nothing run.
---
# Cut the uncut EPIC-011 areas as tickets ABC-284 onward
Owner 2026-11-04 (…4c4cb03d ruling 3): "after cutting W1, start cutting EPIC-011 areas".
1. Go through every EPIC-011 § Phases row that is still a title-only stub. Cut each as a full ticket page (problem, scope, out of scope, AC, falsifiers, NFR triggers, DoR, the ADR owed, dependencies), numbered ABC-284 upward in the epic's phase order. Each page goes into Backlog.
   - Evaluation rows: E3 rest (king attack), E4b (connected, phalanx, backward), E5 (piece terms), E6 (threats, tempo), E7 rest. Under the tuner: state which weights come from the second pull.
   - Search rows: P1 (log LMR), P4, P5, P6, O2c, Q2 (delta pruning), X1, X2 (singular / IIR), V3 (staged movegen).
   - Readings R2 and R3.
   - A row whose ADR or ruling holds it (parked, premise-gated, or waiting on another ticket) still gets a page; state the hold and its re-open trigger on the page. Do not invent bars an ADR has not set: name them as owed to the Architect. Intent class (GAIN or NEUTRAL) only where the epic or ADR-0056 already states it.
   - Add a value estimate only where ADR-0056 D2 gives one; label it an estimate.
2. Fold in the owed EPIC-011 lines for ABC-271 from the Architect's note arch-ADR-0070-accept …212d6a4c:
   - row E4: E4a → ADR-0070 ACCEPTED, structure only at 0;
   - row E2: the second pull fits KD and FP eg ≥ 0, mg 0, and holds U at 0;
   - the Phase 4 order: ABC-271 → second pull, one read judging both;
   - the owner items still open: the d6 amendment and the B-T8 re-confirm.
3. Add one pointer line in memory-bank/40-contributing.md § Conventions to the R-281-a rule (ADR-0046, last dated section). This is the only memory-bank edit allowed.
4. EPIC-011: § Phases rows (point each stub at its new id), § Tickets rows, the ids line, and § Dependencies. In § Owner questions, list any area where cutting needs an owner choice.
5. Give a recommended pull order of the new tickets after ABC-271 → second pull and ABC-282, with a one-line why each.
Fences: plans/tickets (new pages; do NOT edit ABC-271's page — bapm-ABC-271-ready holds it), plans/epics/EPIC-011, the one 40-contributing line, your records. No board, ADR or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-epic011-areas, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

_by: ba-pm (claude-opus-5-5, bapm-epic011-areas) at 2026-11-04T13:33:31Z_. Records only. Nothing was run, built or timed
except the records path check. The edits are `plans/tickets` (new pages), `plans/epics/EPIC-011`, one line in
`memory-bank/40-contributing.md`, this task's notes, the trace row and the queue. No board, ADR or `src/` edit, and
`ABC-271`'s page was not touched. `main` moved to `b274711c` (`bapm-ABC-271-ready`, which did not touch EPIC-011)
and was merged into this branch at `9dc1644f` before the edits.

**16 pages, `ABC-284`–`ABC-299`, all in Backlog, in § Phases' order:**

| id | row | size | pri | DoR | hold / re-open trigger | owed |
|---|---|---|---|---|---|---|
| `ABC-284` | P1 log LMR | S–M | P2 | 9/10 | **Parked.** Re-opens on a new named premise with its own probe: E1's tree (on `main`; no re-probe on record), `ABC-283` merged, or the second pull | `ADR-0060` re-open; bars by reference; GAIN |
| `ABC-285` | P5 R by depth and margin | S | P3 | 9/10 | **Deferred** by the Orchestrator's ruling | `ADR-0050` amendment with a deep-depth bar; NEUTRAL |
| `ABC-286` | P4 move-count pruning | S | P3 | 9/10 | **Held:** `ABC-283` merged, then a joint probe over history | new ADR |
| `ABC-287` | P6 razoring | S | P3 | 9/10 | **Held:** re-measure after the second pull; fails again → dropped | re-measure, ADR |
| `ABC-288` | O2c | M | P3 | 9/10 | **Held:** `ABC-283` merged, or O2c named as O1h's premise | ADR or `ADR-0063` amendment |
| `ABC-289` | Q2 delta pruning | S | P3 | 9/10 | **Held:** `ADR-0024` d4 (**`Q-3K-10`, the owner's**) and a re-measure over Q1 | owner's word, re-measure, ADR |
| `ABC-290` | E3b king-zone attackers | M | P2 | 9/10 | After the second pull | ADR, form (a) or (b) |
| `ABC-291` | E4b connected / backward | S–M | P3 | 9/10 | After the second pull | ADR |
| `ABC-292` | E5 piece terms | M | P2 | 9/10 | After the second pull; split per term if forms differ | ADR (`ADR-0031` change) |
| `ABC-293` | E6 threats, tempo | M | P3 | 9/10 | After the second pull | ADR with tempo's relation rows |
| `ABC-294` | E7b endgame knowledge | M | P3 | 9/10 | **Premise-gated:** after `ABC-272`'s probe | probe, ADR |
| `ABC-295` | R2 | S | P2 | **10/10** | **Held** to Phase 4's close | none (ruled) |
| `ABC-296` | X1 check extension | S | P3 | 9/10 | The ADR only | new ADR |
| `ABC-297` | X2 singular + IIR | M | P3 | 9/10 | A premise probe on the stored entries first | probe, ADR |
| `ABC-298` | V3 staged generation | M | P3 | 9/10 | The ADR; after `ABC-283` on `orderMoves` | ADR (value-identical or not) |
| `ABC-299` | R3 | S | P3 | **10/10** | **Held** to Phase 5's close; C3′'s probe only if E > 2 600 | none (ruled) |

- **No bar invented.** Each page carries, by reference, the epic's per-change rule, `ADR-0064` d7's safety rows, `G4`,
  `G6` (as `Q-3K-4` (b)'s scope sets it), `NFR-008` and `NFR-009`. Every mechanism number is named as owed to the
  Architect.
- **Intent** is stated only where the records state it: P1 GAIN, P5 NEUTRAL.
- **Values** are `ADR-0056` D2's estimates, labelled. Pages run 94–125 lines.
- **Under the tuner:** no new weight in E3b, E4b, E5 or E6 comes from the second pull. Its free set is the first
  pull's plus E4a's KD / FP, eg only. The one exception is E5's shared mobility weight, which is already in that set.
  A later pull, which has no ticket yet, fits the new weights, and the emitter must learn each new export.
- **`ABC-271`'s owed EPIC-011 lines** (`…212d6a4c` § 5) are all written:
  - row E4 (E4a ACCEPTED, structure at 0);
  - row E2 (the second pull fits KD and FP, eg ≥ 0 and mg 0, and holds U at 0);
  - § Dependencies (`ABC-271` → the second pull, one read judging both);
  - § Owner questions (the d6 amendment and the B-T8 re-confirm, both open and the owner's).
  § Tickets row 23 is aligned to the merged page (S, Ready, 10/10).
- **`memory-bank/40-contributing.md` § Conventions:** one pointer paragraph to `ADR-0046`'s `R-281-a` rule.
- **EPIC-011 sections touched:**
  - a top block;
  - § Phases (17 rows, the stub-id rule, the Q2 line);
  - § "P1, parked";
  - § Tickets (row 23, new rows 36–51, the ids line);
  - § Owner questions (a header, plus `Q-3K-10`, the d6 amendment and the B-T8 rows);
  - § Dependencies.
- **Recommended pull order** (after `ABC-271` → the second pull and `ABC-282`; note `…4fe5d06c`):
  1. `ABC-284`: its probe needs no build, and its premise is already on `main`.
  2. `ABC-286` and `ABC-288`, as soon as `ABC-283` merges.
  3. `ABC-290`, `ABC-292`, `ABC-291`, `ABC-293`. Landed as structure at 0, all four can be fitted by one later pull in
     one read.
  4. `ABC-295`.
  5. `ABC-298`.
  6. `ABC-297`.
  7. `ABC-296`.
  8. `ABC-294`.
  9. `ABC-287`.
  10. `ABC-285`.
  11. `ABC-289`, only on a `Q-3K-10` yes.
  12. `ABC-299`.
- **Owner questions:**
  - **`Q-3K-10`, new:** open `ADR-0024` d4 for Q2's design. It is the only cut that needed his choice.
  - **Before the second pull** (recorded, not new): the `ADR-0067` d6 amendment, and whether the B-T8 approval
    carries to the second pull.
- **Owed:**
  - **Architect:** the ADRs and probes on the 14 engine pages.
  - **Owner:** `Q-3K-10`.
  - **Orchestrator:**
    - the board cards for `ABC-284`–`ABC-299` (Backlog);
    - a ticket for E2's second pull, which has no id yet;
    - which tickets close Phase 4 and Phase 5 (for R2 and R3);
    - the pull order.
- **Commits:**
  - claim `8a0bb876`;
  - `main` merged `9dc1644f` (git's default message; it has no attribution line and was not amended);
  - records `aebc9783`;
  - notes `319bf83c`.
  This Result, the trace row and the move to done/ are in the closing commit. Nothing was pushed or merged into `main`.
- **Notes** were sealed via `admitAndAppend`. `contextRoot` is this worktree's `.grugops/context`, and `at`
  2026-11-04T13:32:48Z comes from `date -u`. All 3 read back with `sealVerdict` ok:
  - decision `20261104T133248Z-ba-pm-decision-bc9942b7`: the cut;
  - decision `20261104T133248Z-ba-pm-decision-4fe5d06c`: the pull order and `Q-3K-10`;
  - observation `20261104T133248Z-ba-pm-observation-c4a24cac`: the artifacts, the `ABC-271` fold and what was
    observed. One slip: the note `…bc9942b7` says "about 110–130 lines" a page. The measured range is 94–125, as
    written here.

### Trace row (10 cells, header order)

Appended to `plans/traceability.md`, the row headed `bapm-epic011-areas`.
