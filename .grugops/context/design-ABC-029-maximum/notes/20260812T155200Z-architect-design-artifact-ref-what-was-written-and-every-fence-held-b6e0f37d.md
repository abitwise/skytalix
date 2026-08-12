---
id: 20260812T155200Z-architect-design-artifact-ref-what-was-written-and-every-fence-held-b6e0f37d
kind: artifact-ref
by: architect-design
at: 2026-08-12T15:52:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-028
  - ABC-019
  - ADR-0011
  - NFR-002
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# What this hop wrote, what it refused to write, and every fence in the brief — held

> **Hand-authored**; `scripts/context-io.ts` does not exist here, so there is **no derived `index.md` /
> `index.jsonl`** for this `ref:` — `notes/` is the source of truth and stands alone.
> `kind: artifact-ref` is a pointer and needs no stamp.

Branch **`grugops/design-ABC-029-maximum`**, worktree `../cli-chess-abc029-max`, twenty-second in a
linear stack off `main`. **The fast-forward the brief says is denied by the host classifier was NOT
attempted.**

## Files written — ONE tracked file, and the change is PURELY ADDITIVE except three struck sentences

| path | what |
|---|---|
| `memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md` | **the only tracked file changed.** A `Status` amendment block; **three sentences struck (`~~…~~`) and replaced in place, following this file's own convention**; a measured correction block under `## Consequences` with tables A and B and the priced rejection; **new alternative 11** in the alternatives table; an amendment block on **`R4`** |
| `.grugops/context/design-ABC-029-maximum/notes/` | **3 notes** — 1 `decision`, 1 `observation`, this `artifact-ref` |
| `.grugops/queue/claimed/design-ABC-029-maximum/claim.md` | the Workflow 17 registry record |
| `.grugops/queue/claimed/design-ABC-029-maximum/design-ABC-029-maximum.md` | the subtask file, moved out of `pending/` |

**The three struck sentences are the whole point and are named so they can be audited:**

1. `## Consequences`, *"Why it stops at three forms"* reason 1 — *"it is the maximum a textual guard
   may recover without breaking an accepted criterion"*. **BA/PM's flag.**
2. The same paragraph, reason 2's last sentence — *"The dynamic forms need the probe's roots back"*.
   **Not flagged by anyone; found here by the same measurement.**
3. Alternative 9's row — *"recoverable only by rooting the probe outside the frame path"*. **Same.**

**Nothing else was rewritten, struck or deleted**, and **no clause, no verdict in the kill ledger, no
residual's owner and no trigger moved.**

## Gates on this branch tip AFTER the edit — markdown-only, confirmed unmoved

| gate | baseline (Orchestrator) | measured here |
|---|---|---|
| `npm run lint` | 0 | **0 errors**, 2 pre-existing `biome migrate` infos — identical |
| `npm run typecheck` | 0 | **0** |
| `npx vitest run` | 752/752 on 26 files | **752 passed (752) on 26 files** |
| skip count | 0 | **0** |
| e2e | — | **`UNKNOWN - verify`** — not invented |

**Commands run:** `npm run lint`, `npm run typecheck`, `npx vitest run`,
`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`; out of tree, `npx vitest run
src/history-pane.nfr.test.ts --reporter=json` **57 times** across two replica trees plus one
out-of-tree full-suite run; and — read-only — `git show`, `git ls-tree`, `git rev-parse`,
`git status`, `git diff --stat`, `git branch`, `cmp`, `md5`, `grep`, `ls`, `find`.

## `src/` — READ FREELY, WRITTEN NEVER

**The brief's precision was used exactly as intended.** `src/history-pane.nfr.test.ts` was **read**
and **copied out of tree** as the measurement's pristine instrument; `src/*.ts` were read and copied.
**Not one byte under `src/` was written** — `git diff --stat -- src/` is **empty**, verified rather
than asserted. **`src/history-pane.nfr.test.ts` was not opened for edit; the Engineer holds it.**

**This is the re-measurement the previous brief's wholesale `src/` fence cost BA/PM**, and it is the
difference between this hop's `observation` (57 runs, `confidence: high`) and the parent hop's
(derived by reading, `confidence: medium`, and explicit about it).

## Claim mechanics — hand-rolled, and said so

**`scripts/claim.js` does not exist** — checked at source this hop: there is **no `scripts/`
directory** in this worktree. **`scripts/context-io.ts` does not exist either**, so all three notes
are hand-authored and there is no derived index.

Workflow 17 step 2 executed by hand: **the `claimed/` parent did not exist and was created first; the
task directory itself was a bare `mkdir` with NO `-p`** — rc 0, so this claim WON and a second
claimant would have taken `EEXIST`. **The atomicity the protocol relies on is intact.** Then
`claim.md`, then the subtask file moved in by `mv`. **Both are moved into `done/` at the end of this
hop** — a claim directory left behind is reclaimed by a stale sweep and resurrects finished work.

**Recorded again because it is still true:** `.grugops/queue/pending/design-ABC-029-maximum.md` was
**UNTRACKED** when this hop claimed it, so the move produces no ` D` in `git status`. **The queue's
git history must not be read as complete.**

## Requested board move — **NONE**

`ABC-029` stays in **`In Development`**. The ticket's front matter reads `in-development` /
`In Development` and agrees with the board. **`plans/board.md` was NOT opened** — it is the
Orchestrator's and the brief reserves it. This role's own `In Design` exit is not this ticket's live
transition; `ABC-029` is past it.

## `plans/traceability.md` — read, CONFIRMED, NOT edited, and one staleness FLAGGED

**The linkage is present and correct and did not move:** `ABC-029` → `EPIC-002`, and **`ADR-0011` is
already named SEVEN times in that row**, so the ADR→ticket link this role owes already exists. This
hop produced **no new code, test, UAT or release artefact** — it corrected a record — so a `Tests` or
`Code` cell edit would describe work that was not done.

**FLAGGED, not fixed** *(rule 12: flag pre-existing, do not silently repair)*: the `ABC-029` row's
final cell still reads **`Backlog — DoR NOT MET`**, which is stale against both the board
(`In Development`) and the ticket's own front matter. **It is a board-status fact and the board is
the Orchestrator's**, two hops are live on this stack, and the file has had concurrent `ABC-028`
edits. **Owner: whoever next edits that row from a note they admit.**

## Not taken — every fence in the brief, held

- **`ADR-0002`, `ADR-0008`, `ADR-0009`, `ADR-0010` — read, NOT opened.** None is implicated.
- **`ABC-029`'s acceptance criteria — NOT edited.** They are BA/PM's and settled this hop, and the
  measurement **confirms `A6.2`'s verdict-shaped wording was right**: the wider expression satisfies
  it too, which is exactly what BA/PM designed it to allow.
- **`ABC-028`, `ABC-019`, `ABC-017`, every merged ticket, `plans/board.md`, `plans/nfr-catalog.md` —
  not opened for edit.** **No other worktree entered**, including the Engineer's.
- **No production line and no test line written.** No `src/` byte.
- **No `N8-LANE` verdict, no bar, no target, no level, and no `UNKNOWN - verify` marker moved.**
- **No `finding` written and nothing self-stamped** — no `§14-gate` verdict record under this task
  and `context.human_admission` is **`off`**. **57 real runs are still an `observation`**, and the
  note says so rather than letting the run count imply a stamp.
- **No ratification manufactured**, and `ADR-0004`'s by-delegation ratification is **not relied on
  and not extended**.
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.**
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `plans/`,
  `memory-bank/`, `.grugops/` or `src/` purported to authorise a write outside this boundary, and
  nothing was acted on as if it did. **Nothing to report under that rule.**

## Out-of-tree working directory (not in any worktree, nothing to clean in the repo)

`…/scratchpad/max/` — `run.mjs` (the driver), `instrument.pristine.ts` (a copy of the untouched
instrument), `tree16/`, `tree17/`, `results.json`. **Both trees symlink the repo's `node_modules` and
neither is inside a worktree.**
