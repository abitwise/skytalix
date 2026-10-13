---
id: 20261013T121300Z-qe-e2e-decision-abc101-a11-recheck-verdict-pass-with-gaps-4da1976a
kind: decision
by: qe-e2e
task: qe2-ABC-101
at: 2026-10-13T12:13:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - plans/tickets/ABC-101-difficulty-selection.md
  - ABC-014
  - N8-LANE
  - QE2-101-a
  - QE2-101-b
  - QE2-101-c
  - 20261012T212000Z-qe-e2e-decision-abc101-verdict-pass-with-gaps-2fa04d14
  - 20261013T121000Z-qe-e2e-observation-abc101-a11a-f-u0-merge-cli-deep-gates-b51fa1c4
  - 20261013T121100Z-qe-e2e-observation-abc101-a11-plants-9-of-9-caught-104a2f24
  - 20261013T121200Z-qe-e2e-observation-abc101-a11-n8-lane-render-met-5b5aa819
  - 20261013T121400Z-qe-e2e-artifact-ref-abc101-a11-branch-probe-commands-cb994968
  - 20261013T112345Z-frontend-ui-artifact-ref-abc101-piece-polarity-contract-1c687529
supersedes:
---

# QE re-check of `ABC-101` after `A11` (delivered tip `36378ccf`, code `d22a709f`, merge `081c3715`): **PASS_WITH_GAPS**. `A11a`–`A11f` and the widened `A9` are MET, all 9 plants are caught, and `N8-LANE` is MET. The new gaps are INFO only. The owner's UAT word (now with `A11g`) is owed

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). It is an agent
`decision`, not a stamp. The readings are in the three observation notes it cites and are not restated.

**Scope of this verdict.** It covers the delta since `98ea0a84`: the merge `081c3715` (0 `src/` lines) and the `A11` commit
`d22a709f`. **`qe-ABC-101`'s verdict `…2fa04d14` (PASS_WITH_GAPS on `98ea0a84`) stands for the difficulty work and is not
re-read.** Its gaps `QE-101-a` (LOW, SE), `QE-101-b` (LOW, BA/PM), `QE-101-c`/`-d`/`-e` (INFO) are carried, still open.
Together the two verdicts are ABC-101's QE record.

- **Criteria (`…b51fa1c4`):** `A11a` (330/330 cells on the contract table), `A11b` (14/14 strings, parsed from the
  ticket), `A11c` (24/24), `A11d` (QE's own `.snap` parse: 24 = 24 keys, 12 `unicode` bodies changed, 12/12 `ascii`
  byte-identical, and the text outside the entries identical), `A11e` (unedited, green), `A11f` (exactly 8 re-pins at equal strength, 0 deleted,
  skipped or loosened, skip 0), `A9` as widened (`-U0`: 2 / 4 / 20 hunks): **MET**. `A11g` is the owner's.
- **Merge:** `git diff --stat 98ea0a84 081c3715 -- src` is empty. **`CLI_DEEP` 10/10**, with 0 `abc095-book-absent-*` before
  and after.
- **Plants (`…104a2f24`):** 9 planted plus a green control. **9 caught, 0 caught by nothing.** One pair back, ASCII case swapped,
  a variation selector, an astral code point, an ESC in place of a piece and on a piece, and orientation flipped with the old or the new table.
- **`N8-LANE` (`…5b5aa819`):** `src/render.test.ts` H−B **+0.005 s** (−0.010..+0.010), **MET**. It was pre-registered at `ee688564`
  before any run. w1 was clean but inadmissible, and w2 was graded.
- **Gates** on the QE tree (src = `d22a709f`): lint, typecheck and build exit 0; `npm test` 58 files, 1792/1792;
  `last-run.json` `success: true`; skip-integrity `--skip-count 0` reads `No findings.`
- **UAT waiver:** `3ea3e352...36378ccf` lists 5 paths, including `src/render.ts`. **It is not empty, so the waiver does not apply.**

## Gaps (new at this hop)

| id | sev | gap | owner |
|---|---|---|---|
| `QE2-101-a` | INFO | `N8-LANE`: `src/render.test.ts`'s first 4.1 twin reading is R 0.030 s CPU / 0.020 s wall. It is a candidate to replace the provisional 16 % (0.102 s). w1 was clean but inadmissible (+2-tick twin median on a 0.64 s base) and was read once more, as allowed. No state moves | Architect/Design |
| `QE2-101-b` | INFO | The zero-production-lines waiver's filter (`grep -v '\.test\.ts$' \| grep '^src/'`) passes `src/__snapshots__/*.snap` as production. A test-only ticket that regenerates a snapshot would therefore be denied the waiver. This fails safe (UAT is asked for, never skipped), and it changes nothing here | the owner's rule; the Orchestrator raises it if wanted |
| `QE2-101-c` | INFO | The record says something different from the activation. The SE's aside (`…1c89fdcb`) calls the three idle `node src/cli.ts` processes "most likely the owner's own sessions". The Orchestrator's activation of this hop says they are its own pty probes. QE logged them and did not touch them. Whoever owns them may end them | Orchestrator |

**No gap blocks, and none asks for a production-code change.**

## Owed elsewhere (not QE gaps)

- **The owner's UAT word**, which now includes `A11g` (a dark UTF-8 TTY, `--colour black` and `--colour white`, plus `--ascii`).
  The SE's pty frames in `…1c89fdcb` are a pre-view, not a substitute.
- **The Orchestrator:** the board move. For `A11`, the ticket's own 2026-10-13 trigger re-read says Security is not
  triggered and `NFR-002` is not re-triggered, so the next column is the Orchestrator's call. It also owns the stale front matter, and the merge of
  this branch and `grugops/qe-ABC-101` (whose `§ QE` section is not on the delivered branch). QE did not touch `plans/board.md`.
