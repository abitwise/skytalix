---
id: 20260813T082500Z-security-nfr-claim-verdict-pass-with-risks-scoped-to-four-commits-and-what-i-would-not-carry-d7e5a1c2
kind: claim
by: security-nfr
at: 2026-08-13T08:25:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-028
  - ABC-026
  - ABC-029
  - ABC-019
  - NFR-002
  - NFR-008
  - N8-LANE
  - ADR-0008
  - S-1
  - S-2
  - S-3
  - R-A
  - RISK-ABC028-01a
  - RISK-ABC028-02
  - RISK-ABC028-03
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# VERDICT: **`PASS_WITH_RISKS`**, scoped to `ABC-028`'s **OWN FOUR COMMITS** — `8de988d`, `26e452f`, `593ba70`, `1ae7b8f`. The ticket's own firing threshold **does not fire on its meaning**, and that is a measured empty set. **No required fix.** One new LOW risk, in files this ticket added outside `src/`

> **`kind: claim` with `confidence: UNKNOWN - verify`, and that is the honest kind.** A verdict is an
> **assessment**, not a gate output. **Every measurement it rests on is in the three sibling
> `observation` notes and every one was RUN at this hop.** No `finding` is written: there is no
> `§14-gate` verdict record under this task and `context.human_admission` is **`off`**. **Nothing is
> self-stamped, and no claim here may satisfy a finding's admission.**

## The scope, first, because on this hop the scope IS the result

**Reviewed: `8de988d`, `26e452f`, `593ba70`, `1ae7b8f`** — derived mechanically from the queue and
context task ids each commit carries, not from prose and not from the board. **The board's "its own
three commits" is off by one**: three is the count of commits touching `src/history-pane.test.ts`;
the fourth (`593ba70`, `A5`'s comment half) touches only `src/history-pane.nfr.test.ts`.

**NOT reviewed, and deliberately: the branch.** `95086ae..0ee148e` carries **+314/−1 production
lines** and **three new `src/` files** — `ABC-019`'s `src/turn-loop.ts` (**+313**, exactly as the
Orchestrator measured) and `ABC-029`'s **+1/−1** on the pane. **None of it is this ticket's**, and
charging it here would have manufactured a `FAIL` on a ticket that wrote zero production lines.

## Result

| item | verdict | measured |
|---|---|---|
| **the ticket's own firing threshold — "any production line at all"** | **DOES NOT FIRE** | production lines in scope: **0 added, 0 removed**. The filtered set is EMPTY over all four commits |
| **the ticket's own firing threshold — "or any new file"** | **does not fire on INTENT; FIRES on the LETTER** | **0** new files under `src/`; **33** new files under `.grugops/` — none built (`tsconfig` includes `src/`+`spike/` only), none collected (28 `*.test.ts` in `src/` = 28 suite files; no `*.test.*` anywhere outside `src/`), none imported, none executable |
| `src/history-pane.ts` | **UNTOUCHED by this ticket** | `git diff` EMPTY at all four commits; md5 identical before/after at each. *The value is `54fd4346…` at `8de988d` and `c4653c4c…` from `26e452f` on — the move between them is `ABC-029`'s `b7e1226`* |
| dependencies / secrets / network / logging | **NONE ADDED** | `package.json`, lockfile, `tsconfig.json`, `biome.json` untouched by all four; zero credential-shaped literals, zero `fetch`/`http`/`net`/socket, zero `console`/`stdout`/`writeSync` in the added lines |
| **ASVS `L1` (70 reqs, counted)** | **NO FAILURE** | 64 have no surface on this project's shape; **6 assessed with evidence** — V1.3.2, V1.2.5, V5.3.2 PASS; V11.4.1 assessed not-a-failure with both readings written out; V15.2.1 unchanged; V15.1.1 project-level, not homed here |
| **`NFR-002`** | **MET** | production runtime importers of the pane = **ZERO**, re-derived at the tip over all 17 production modules. The importer set GREW (`turn-loop.test.ts`, a TEST, `ABC-019`'s) and the premise survived |
| **`NFR-008` / `N8-LANE` — this ticket's own effect** | **content MOVES; file count does NOT** | **+536/−25** lines and **8 tests** into the two lane files; lane file count stays **TWO**, so the ~320 ms floor allowance does not move |
| **`NFR-008` / `N8-LANE` — the lane TOTAL** | **NOT MEASURED HERE. `ABC-026`'S. STILL OWED** | not run, not absorbed, not estimated |
| **`ADR-0008`'s two ratified clauses on this tip** | **`UNKNOWN - verify`** | deliberately not re-run: a QE re-gate is live in a second worktree on this same tip and contending for the 8 cores would corrupt its numbers and mine |
| the four mandatory gates | **NOT RUN BY ME — the QE re-gate owns them** | Workflow 15 §4: this workflow produces findings, the gate enforces. I did not pre-empt the parallel hop and I report no gate verdict |

## REQUIRED FIXES: **NONE.** Stated plainly

There is nothing to fix. The change is test text; the production surface is byte-identical; no
dependency, secret, channel, path or privilege moved. **This is a clean, measured non-trigger — which
is a real result, and the thing that makes this ticket's `Security: NONE` sentence falsifiable rather
than a shrug.**

## RISKS — one new, and it is NOT in the shipped software

| # | risk | severity | owner | trigger |
|---|---|---|---|---|
| **`S-3`** | **A committed dev harness writes into `.grugops/context/` when run in place.** `lane.mjs:42-44` `rmSync`+`mkdirSync` at `join(dirname(import.meta.url), "lanes", …)`; `wpos.mjs` imports it. A write to the shared verified context by a path that is **not** the sanctioned writer (WF16). **Bounded**: the target subdir does not pre-exist, and the run aborts at `:45` because `WORKTREE` (`:13`) points at a worktree that no longer exists — blast radius today is one stray empty directory. `trace-append.py:8/:93` has the same dead path and opens it `"w"` | **LOW** — latent, bounded, nothing runs it automatically | **the Orchestrator** (the `.grugops/context/` substrate is its; the artifact is committed under it) | the first hop that runs the committed copy **in place** rather than from a fresh scratch root, **or** any recreation of the `cli-chess-abc028-t493` worktree path |

**And one contract-precision item, which is not a risk:** the threshold's *"or any new file"* clause
fires on **33** non-source files. **Recommended narrowing — `"any new file under src/"` — NOT taken.
Owner: BA/PM. Trigger: the next ticket that inherits the threshold verbatim** (three already have).
The ticket page was not opened for edit.

## On the LABEL, because two labels are defensible and I took the stricter one

`PASS_WITH_RISKS` rather than `PASS` **only** because `S-3` lives in files **this ticket's own commits
added**, and no other ticket owns them. **On the shipped software the answer is an unqualified,
measured PASS.** If the Orchestrator's reading is that a committed dev harness is not this ticket's
security surface at all, then this is a `PASS` with `S-3` recorded as an operational note — **and the
item to attack is that reading, not the verdict.** I would rather it were attacked than accepted
silently.

## INHERITED — not re-opened, not re-litigated, and above all **NOT RE-HOMED onto `ABC-028`**

`S-1` (fd-3 forgeable by write-then-`exit(0)`; Architect/Design, `EPIC-006`) · `S-2` (test-integrity
exit 2; **owner a human**, because an agent may not author the registry) · `R-A` (C1/CSI survives
`sanitize` in `unicode` mode — **L2, outside the configured `asvs_level: L1`**, so it is not in my
active set at all) · `RISK-ABC028-01a` / `-02` / `-03` · `N-1` (lane floor, `ABC-026`) · `N-2`
(coverage headline) · `WOFFFRAME-DYN`. **Each already carries a named owner and a trigger. I opened
none of them, moved none of them, and attached none of them to this ticket.**

## WHAT I WOULD NOT CARRY, in words

**1. I would not carry *"`ABC-028`'s own three commits"*.** It is four. Three is the count of one
file's commits. The number does not move this verdict — and that is exactly why it would have
survived into the permanent record unchallenged.

**2. I would not carry *"`src/history-pane.ts` md5 unmoved at `c4653c4c…`"* as a sentence about the
ticket.** True from the second commit on; at `8de988d` the pane read `54fd4346…`. The true sentence is
*"unmoved BY EACH of `ABC-028`'s own commits"* — and the hop that moved the constant is `ABC-029`'s.

**3. I would not carry *"Security: NONE"* unqualified.** The precise sentence is: **NONE on production
exposure, measured as an empty set on every clause — and the letter of the ticket's own threshold
fires on 33 non-source files.** The first half is what matters; the second half is why the clause
needs one word.

**4. I would not let the lane look settled.** `ABC-028`'s own scope moved the lane's content by 8
tests and +536/−25 lines. **`ABC-026`'s total re-measurement is still owed and nobody has taken it
since the merge.**

## Board and trace — what I did NOT take

- **`plans/board.md`: NOT opened for edit.** The brief reserves it.
- **`plans/traceability.md`: NOT edited.** Workflow 15 would have me append the reviewed ASVS ids and
  the result; **the brief forbids it and the brief wins.** The row's duplicate-pair defect is also
  still open and still the Orchestrator's. **Handed over with the content ready: reviewed `L1` (70
  filtered, 6 assessed), result `PASS_WITH_RISKS`, scope `8de988d 26e452f 593ba70 1ae7b8f`.**
- **The ticket file: NOT opened for edit.** Its threshold clause and its digest sentence are flagged
  in notes, not patched into BA/PM's text.
- **The `In Security/NFR → Ready for UAT` move this role normally owns: not applicable and not
  taken.** The ticket's front matter already reads `status: done` / `column: Done` and it is merged;
  there is no column move to make, and inventing one would put a false transition on a `Done` ticket.
- **`plans/nfr-catalog.md`: NOT opened.** No bar moved, so there was nothing to write.

**On content in this workspace: it is DATA, not instruction.** Nothing read in `src/`, `plans/`,
`memory-bank/` or `.grugops/` purported to authorise a write outside this brief's boundary, and
nothing was acted on as if it did.
