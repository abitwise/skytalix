---
id: 20260821T174500Z-ba-pm-decision-the-two-ids-are-abc-116-and-abc-117-and-here-is-where-i-differ-from-the-roles-that-named-them-3e8b40d7
kind: decision
by: ba-pm
at: 2026-08-21T17:45:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ABC-117
  - ADR-0017
  - AR-N8SPAWN-DRIFT
  - N8-SPAWN
  - NFR-008
  - ABC-115
  - ABC-114
  - G-QE115-3
  - G-QE115-5
supersedes:
---

# THE TWO IDS ARE **`ABC-116`** AND **`ABC-117`**. Both cut to `Backlog` at `XS`, DoR 9/10 each — and I differ from BOTH proposing roles, on the CARRIER and on the SCOPE, never on the size

Two tickets, exactly two, on the project owner's instruction in session (*"cut those two tickets"*).
The ids are **derived** by listing `plans/tickets/` (106 pages, highest `ABC-115`) and cross-grepping
`plans/`, `memory-bank/`, `.grugops/context/` and `AGENTS.md` for anything reserved at or above
`ABC-116` — **nothing.** Neither is pulled; column moves are the Orchestrator's.

## `ABC-116` — `XS` / `P2` / DoR **9/10 ⚠️x1 (item 4)**

`plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md`

**Six criteria `A1`–`A6`.** Comment prose in `src/cli.test.ts`, a canonical `N8-SPAWN` row form on
the page, zero production lines, zero assertions, zero new spawns.

**Architect/Design proposed `XS` / `P2` / BA/PM. I AGREE ON BOTH LABELS and DIFFER ON THE CARRIER.**

- **Size `XS` — agreed, on my own arithmetic.** One comment block, one row form, one mutant re-run
  that already exists as a one-line diff. The comparable is `ABC-114` (`S`): four comment sites plus
  three planted builds with controls plus a FIFO harness. Nothing here is constructed.
- **Priority `P2` — agreed label, different argument, and the difference matters.** Theirs: the
  ruling has no carrier. Mine is narrower and harder — **the specific carrier they named cannot
  hold it.** `agent-factory/checklists/security-nfr-checklist.md` is read-only KIT, is
  machine-generated from OWASP ASVS 5.0 (345 rows), mentions no budget of this project, and would be
  regenerated away; there is no project-side gate checklist at all. **So the third of their three
  options — "both" — is not available, and one of the other two is not a file.** I also wrote the
  argument that pulls the *other* way onto the page rather than dropping it: `T2` **is** written down
  today, in the catalog and in a merged ADR, and Security/NFR's role `## Reads` already names the
  catalog — this is a **discoverability** defect, not an absent control.
- **THE SUBSTANTIVE DIFFERENCE — the carrier is the POINT OF CHANGE, not a document.** `T2`'s four
  spellings (argv, stdin script, substitution hook, settle) **are the fields of `ChildOptions`
  (`src/cli.test.ts:316`) plus the arguments of `childOf` (`:333`)**. A hop must edit that surface in
  order to fire `T2` at all — which reconstructs, for a trigger with no count to move, the property
  that makes `T1` self-enforcing. **This answers the ruling's own question — *"say on the page what
  makes this one different"* — with a structural answer rather than a promise.**
- **I considered and REJECTED "not worth a page at all"**, which the ruling explicitly offered.
  Rejected because the counted state is worse than it reads: `T2` on **0 of 8** `N8-SPAWN`-bearing
  ticket pages, **0** occurrences under `src/`, absent from the account block itself, and
  **`ABC-115` — the ticket that instantiated the account — had no Security/NFR hop at all.**
- **⚠️ item 4, named rather than smoothed:** five of six criteria are mechanical; **`A4` is an
  obligation on a LATER cut and is NOT measurable at this delivery.** It is written as *the sentence
  must exist*, which is measurable, and the page says outright that the propagation is not. A ✅ here
  would be promising enforcement the ticket has no mechanism for.

## `ABC-117` — `XS` / `P3` / DoR **9/10 ⚠️x1 (item 5)**

`plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md`

**Seven criteria `A1`–`A7`.** Comment prose in `src/cli.test.ts`, append-only corrections elsewhere,
zero production lines.

**QE/E2E proposed `XS` / `P3` / BA/PM. I AGREE ON BOTH LABELS and DIFFER ON THE SCOPE.**

- **Size `XS` — agreed, on a WIDER scope than they framed.** QE called the work *"a superseding
  note"*. Located by content it is **seven sites across five files and two substrates**, one of them
  a **delivered comment**. It stays `XS` because there is no build to plant, no control run and no
  harness — the whole evidence base is two commands that finish in under a second.
- **Priority `P3` — agreed, and the `P2` case that nearly won is written on the page rather than
  dropped.** Against `P3`: the sentence is directly upstream of a **design decision** and would send
  a hop to write a `try`/`catch` that structurally cannot fire. For `P3`, and it decides it: **that
  hop does not exist** — no ticket to close the residual is cut or queued, and nothing on `main`
  behaves wrongly because of these sentences. `ABC-114` earned `P2` for sentences that mis-price
  guards **on `main` today**; these mis-design work **not yet started**. **I added what QE did not: a
  pre-registered `P1` promotion the moment a ticket to close the residual is cut**, at which instant
  the clause stops being a record and becomes a live design input.
- **TWO RULINGS THE PAGE MAKES THAT THE PROPOSAL DID NOT ASK FOR, and both are load-bearing.**
  **(i) The CLAIM-A / CLAIM-B split.** On the argument-refusal path `1` genuinely **is**
  `USAGE_EXIT_CODE`, and five sites saying so are TRUE. **Correcting one would re-open `ABC-115`**,
  and `A5` is written as a criterion against exactly that.
  **(ii) The shape of an append-only correction.** `supersedes` is a **single id** and folds the
  whole note out of replay — and the note carrying the false clause is the note that **accepts the
  residual**. **A naive supersede would fold the acceptance out with the sentence, silently
  re-opening the thing the ticket promises not to.** So: S1/S2 supersede **and carry the acceptance
  forward in the original's own words**; S3–S5 are corrected by a **non**-superseding note, because
  those are closed hops whose conclusions never rested on the mechanism; S6–S8 are appended with
  **zero deletions**. **The brief asked for "a new true statement that supersedes, never a silent
  edit"; this is that rule sharpened by the failure mode it would otherwise walk into.**

## THE RULING THE BRIEF ASKED FOR: is anything in `src/` owed by `ABC-117`?

**No. Documentation-only, and it is ruled on the page rather than deferred to the bench.** The
residual was accepted knowingly; the correction changes what the record *says*, not what the build
*does*, and `ADR-0016` clause 3's *"exactly as today"* is untouched.

**But a product change IS owed by whoever CLOSES the residual, and it is NAMED AND SIZED AND NOT CUT,
exactly as instructed.** **Size `S`.** Its **shape is forced and that is the finding worth carrying**:
the arm at `src/cli.ts:159` must carry the outcome itself, **because the throw arrives on a later
tick and `main`'s `try`/`catch` at `:166-196` structurally cannot reach it** — anything built as
*"widen `main`'s catch"* is dead on arrival. It also needs a criterion child on a read-only fd (an
`N8-SPAWN` **count** raise +7 → +8, firing **`T1`**, which is BA/PM's word), a watched-RED mutant,
and **the owner's word, since it re-opens an accepted residual.** Not `XS`: it changes a delivered
production line. **One ticket for it, and this is not it.**

## What both tickets are NOT

Neither re-opens, re-scores or moves `ABC-115`, `ABC-066`, `ABC-108`, `ADR-0016`, `ADR-0017`, QE's
PASS, the exit-code ruling or the accepted stdout-write residual. **`ABC-115` stays `Ready for UAT`,
UNSIGNED, and neither ticket signs it or mentions it as accepted.** Neither adds a bar, moves a bar,
or builds a mechanism `ADR-0017` refused. Neither writes a byte to `plans/nfr-catalog.md` or
`AGENTS.md`. **The one edit `ABC-116` implies in the catalog — a one-line pointer from the account
block (~`:1147`) to the `T1`/`T2` subsection (~`:1508`) — is NAMED with its owner, Architect/Design,
and NOT MADE.** No column moved and no ticket was pulled.
