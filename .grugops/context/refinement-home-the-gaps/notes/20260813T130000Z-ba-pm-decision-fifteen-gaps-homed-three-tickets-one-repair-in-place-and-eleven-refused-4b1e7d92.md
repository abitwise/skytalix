---
id: 20260813T130000Z-ba-pm-decision-fifteen-gaps-homed-three-tickets-one-repair-in-place-and-eleven-refused-4b1e7d92
kind: decision
by: ba-pm
at: 2026-08-13T13:00:00Z
verified_by:
confidence: high
refs:
  - ABC-050
  - ABC-051
  - ABC-052
  - ABC-035
  - ABC-030
  - ABC-021
  - ABC-026
  - ABC-040
  - quality-gate-ABC-021
  - quality-gate-ABC-026
  - refinement-cut-039-040
  - plans/tickets/ABC-050-lane-runner-config-has-no-guard.md
  - plans/tickets/ABC-051-turn-loop-records-false-and-per-ply-bar-blind.md
  - plans/tickets/ABC-052-trace-status-currency.md
supersedes:
---

# Fifteen gaps, one landmine, one refused defect: **THREE new tickets, ONE ticket repaired in place, and TWELVE dispositions that are not tickets**

> **Hand-authored, no stamp.** No `scripts/context-io.ts`, no `mcp__grugops__propose_note`,
> `context.human_admission` is `off`, no `§14-gate` verdict exists under this task — **no `finding` on
> this hop**, and none was invented. `confidence: high` because every disposition below was verified
> at the file and line named, not relayed. See the substrate note for the ruling on why that is so.

## The count, before the dispositions

**Fifteen recorded gaps are FOURTEEN distinct gaps.** `quality-gate-ABC-021`'s `G-7` and
`quality-gate-ABC-026`'s row 6 are **the same gap** — `.grugops/test-skips.md` absent, test-integrity
exit `2`, `H2`, a named human's — recorded once by each gate. Nothing is wrong with recording it
twice; it is worth saying once that the backlog is not as long as it counts.

**And one source contradicts itself about its own total.** `quality-gate-ABC-026`'s `artifact-ref`
note is headed *"with six gaps named"* and requests a board row saying *"six gaps"*, while its own
table numbers **1–8** and its prose reads *"None of gaps 1–8"*. **Eight is right**; the headline is
wrong. The brief's "eight" matched the table.

## The dispositions, one row per gap

| gap | source | disposition |
|---|---|---|
| `vitest.config.ts` read by NO static tool | 026 #1 | **TICKET `ABC-050`** |
| `vitest.config.ts:52` *"share a worker"* | 026 #2 | **FOLDED into `ABC-050`** — same file, same hop |
| silent-leak blind spot, `glyph-mode.nfr.test.ts:96` | 026 #3 | **FOLDED into `ABC-050`** — same subject: the lane config's containment |
| `G-1` the per-ply bar cannot see `keyHistory` | 021 | **TICKET `ABC-051`** (NOT `ABC-030` — see below) |
| `G-3` `turn-loop.ts` contradicts itself | 021 | **FOLDED into `ABC-051`** — same two files, same cause |
| `G-2` `ABC-035` contradicts itself | 021 | **REPAIRED IN PLACE, no ID spent.** Six statements, not three |
| status-currency, `Done` vs the trace | cut-039-040 | **TICKET `ABC-052`** |
| `G-4` `traceability.md` header numbers | 021 | **NOT HOMED** — already corrected in-file |
| `G-5` no criterion pins transition 16 | 021 | **NOT HOMED** — the boundary is asserted in the merged tree |
| `G-6` the human as black claiming | 021 | **NOT HOMED** — measured correct; a row buys no regression net |
| `G-7` / 026 #6 `test-skips.md` absent | both | **NOT HOMED** — `H2`, a named human's, and correctly so |
| 026 #4 `~7` is a mean | 026 | **NOT HOMED** — a reading instruction, published, not a defect |
| 026 #5 `A1`'s raw values unpublished | 026 | **NOT HOMED** — the hop that held them is closed |
| 026 #8 `ADR-0008` says *"four"* | 026 | **NOT HOMED** — already corrected 100 lines below, in a DISCHARGED decision |
| 026 #7 the substrate gap | 026 | **NOT AN `ABC-` TICKET** — install/kit, a named human's. Own note |
| THE LANDMINE — `coverage/` tracked | 021 | **NOT A TICKET** — a `.gitignore` change. Own note |

**Three new tickets from fifteen gaps.** If the count had been fifteen, that would itself have been
the finding: the delivery audit's headline on this board is that **the record is this factory's
waste** — 142 ticket-lines per production line against 0.46:1 at `ABC-001`–`008` — and a factory that
converts every gap into a page is that number's engine.

## The three tickets, and why each is one

**`ABC-050` — the lane runner config has no guard, statically or dynamically. `S`, `P2`, DoR 10/10.**
Three gaps, one sentence: *the mechanism all 816 tests rely on is asserted by nothing.* Verified at
source: `biome.json` `files.includes` is `["src/**/*.ts","spike/**/*.ts","*.json"]` and
`tsconfig.json` `include` is `["src/**/*.ts","spike/**/*.ts"]` — a root-level `.ts` matches
**neither**. **Three of the four `mandatory_gates` cannot see the file that governs how every test
executes**, and the mistakes it is there to prevent (`isolate: false`, a mistyped key) are exactly
the ones that leave the suite green. The gate hop wrote *"Architect/Design to route; fixing it is a
repo-wide config change no single ticket owns."* **"No single ticket owns it" is an argument for
minting one, not for leaving it unowned** — this board's own words, on `ABC-030`: *an unnamed owner
is not an owner; this page is the owner.* `P2` with a written promotion trigger: `P1` the moment
anyone opens `vitest.config.ts` for an option change.

**`ABC-051` — `ABC-021` left the turn loop's own records false, and its per-ply bar blind. `S`,
`P2`, DoR 10/10.** Six sites in two files, **two of which nobody reported**: the false sentence
*"the loop derives nothing on its own"* appears at `src/turn-loop.nfr.test.ts:23` **and again at
`:131`**, and the test **name** at `:136` — *"derives ZERO times on a non-advancing prompt outcome"*
— is false for the refused claim, which is non-advancing and derives `keyHistory` once. That is the
sibling-instance pattern this board keeps producing, which is why the ticket is written over the two
FILES and not over the three reported LINES.

**`ABC-052` — the trace `Status` column goes stale on every merge. `S`, `P2`, DoR 8/10 NOT MET.**
See the measurement note: the prior hop's `10 of 25` reproduces **exactly** and is now **12 of 27**,
the two new members being the two tickets that merged this morning. **It is not a backlog of stale
cells; it is one stale cell per merge**, so the ticket is written over the mechanism with the census
as a one-time discharge. Its DoR is **8/10 and NOT MET** — two ⚠️ for one genuinely open ordering
dependency on `ABC-040`, which merges the `ABC-029` row pair that this ticket would otherwise repair
first.

## `G-2` cost NO id, and that is the point of it being unpulled

`ABC-035` is in `Backlog` and unpulled, so the correct disposition for a self-contradicting ticket is
**to repair it**, not to write a second ticket about the first. **Repaired at this hop.**

**And the gate reported three contradictions; at source, against MERGED code, it is six** — the two
nobody reported being the ones that would have broken the build:

- the `## Scope` table says `claim` returns the **`command`** outcome. **False.** `PromptOutcome` has
  a dedicated **payload-free `{ kind: "claim" }`** arm (`src/turn-loop.ts:130`) and the LOOP
  adjudicates it (`:319`). **A parser returning `command` for `claim` never reaches transition 16.**
- `## Dependencies` carries the *"this ticket produces … the unavailable message"* sentence a **third**
  time, and cites `PromptOutcome` at `:118`, a doc-comment line; the declaration is `:125`.

**The ruling did not rest on precedence.** `plans/board.md:100` does side with the scope table, but
that became beside the point once `ABC-021` merged: `claimShortfall` (`src/turn-loop.ts:234`) writes
the teaching message, `ABC-021`'s `A3` asserts it, and it is running on `main`. **Ownership was
decided by the tree, not by two pages arguing.** `A5` and `A6` were rewritten — the old `A5`
specified a build that cannot reach the merged claim path, which is an acceptance criterion for the
wrong product.

**Size `S` and priority `P1` both HOLD, re-derived rather than restated**, and the DoR was re-scored
item by item at **9/10, unchanged** — with the honest addition that items 2 and 4 were **over-scored
on 2026-08-12**, when the page's claims were not yet checkable against a tree.

## The QE's suggested home for `G-1` and the silent leak was `ABC-030`. It does not hold, mechanically

Both gate hops named `ABC-030` as the candidate. **Refused, and the refusal is not a preference.**
`ABC-030`'s own criteria forbid it: `A2` requires *"zero lines changed that are not inside a
comment"* and *"exactly four files, every one `*.nfr.test.ts`"*; `A3` requires every file's test count
**identical before and after**. Both gaps need a **test assertion**. **Folding either would falsify
three of `ABC-030`'s own criteria.** `ABC-030`'s `## Out of scope` was amended at this hop to say so
by name, so this page is not re-routed here a third time. The three `*.nfr.test.ts` file sets are
**disjoint**: `ABC-030` holds `zobrist`/`status-panel`/`gameend`/`san`, `ABC-050` holds `glyph-mode`,
`ABC-051` holds `turn-loop`.

## The five I refused, each with its reason

**`G-4` — NOT HOMED, already discharged.** The two wrong figures survive only in the Software
Engineer's `_Updated:` header, and the QE's own append **already corrects both in the same file**,
naming the measured `3 insertions, 1 deletion` and the correct `+89/−10`. The file is append-only by
its own convention, so the wrong header is a **dated record**, not a live error — `ABC-040`'s `R5`
exactly. **Nothing is owed.**

**`G-5` — NOT HOMED.** The criterion gap is real and it is closed **in the tree**: the QE's `A8`
clause (iv) asserts `keyHistory` at **0** on an allowed claim, which is the only assertion anywhere
pinning *the loop adjudicates, the seam asks* — and it is merged. `ABC-021` is `Done` and may not be
edited. The rule is also already on the page that needs it: `ABC-035`'s `## Out of scope` says the
parser asks and does not derive. **A ticket to add a criterion to a shipped ticket for a boundary
already asserted is pure record work.**

**`G-6` — NOT HOMED, and this is a deliberate refusal rather than an oversight.** Verified at source:
inside `describe("ABC-021 acceptance")` (`src/turn-loop.test.ts:1634-1860`) the only
`humanColour: "black"` is `A4`'s, where the claim sits on the ENGINE's side — so the gap is real. But
the path was **driven by hand and measured CORRECT** (`{draw, threefold-repetition, 0}` at 8 plies),
the loop's claim arm is colour-agnostic by construction (it runs only when the side to move is the
human, and `claimable.by` is deliberately unread — `src/turn-loop.ts:326-327`), and a new row spends
`N8-LANE` budget for a path with no plausible regression source. **The QE's own words — "not worth a
hop of its own" — and I am not overriding them to look thorough.** If a colour-dependent defect is
ever suspected, the row costs one hop then.

**`G-7` / 026 #6 — NOT HOMED, and correctly owned already.** `H2` is a **named human's**. Workflow 05
forbids the agent authoring the justification that clears its own gate, the skip count is a real
measured **0** so there is nothing to justify, and exit `2` is honestly recorded as *could not run*
by three separate gates. **Note the trap in the tempting fix:** "make `tools/grugops/test-skip-integrity.js`
exit 0 when the registry is absent and skips are 0" is an agent clearing its own gate by editing the
checker. **Worse than the exit-2. Not proposed.**

**026 #5 `A1`'s raw per-round values — NOT HOMED.** Everything downstream of them reproduces exactly
(the gate hop recomputed all eight figures) and independent readings bracket them. The remedy is one
sentence from a hop that is **closed**, and the only completable outcome of such a ticket is *"they
were not retained"*. **Treat `A1`'s medians as sound for use and `UNKNOWN - verify` for
recomputation; if anyone ever needs to recompute, re-measure — the protocol is published.**

**026 #8 `ADR-0008` says "four" — NOT HOMED.** Verified at source: the stale sentence is Decision 8
at `:116`, and the **same file** corrects it at `:228-232` — *"Decision 8's sentence is left standing;
read it as 'every `*.nfr.test.ts` file'"* — inside the addendum that records **Decision 8 as
DISCHARGED**. So the census is stale, disclosed, reinterpreted, and attached to a decision that is
closed. **The ADR is owner-ratified and may only be amended, never edited: minting an amendment that
adds lines to a 300-line ratified ADR to fix one word already corrected 100 lines below it is the
waste loop with a ceremony attached.** Left standing, deliberately, for the fourth time.

## What this hop did NOT do

No `plans/board.md`, no `plans/traceability.md`, no ADR, no `plans/metrics.md`, no
`plans/nfr-catalog.md`, no `vitest.config.ts`, **nothing under `src/`**, no `Done` ticket, no
`EPIC-006` file, no id outside `ABC-050`–`ABC-052`. Nothing merged, nothing pushed, nothing deployed;
`main` never checked out.
