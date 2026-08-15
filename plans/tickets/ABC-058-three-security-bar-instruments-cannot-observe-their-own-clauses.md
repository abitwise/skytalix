---
id: ABC-058
title: Three of `ABC-042`'s security-bar instruments cannot observe their own clauses — `shell:`/concatenation asserted by nothing, a `U+007F` clause whose probe carries no `U+007F`, and a spawn pin a docblock sentence can red
status: backlog
column: Backlog
size: S
priority: P2
epic: —
feature: —
---

# ABC-058 — the bars are met; three of the instruments that say so cannot see what they claim to watch

> **Cut 2026-08-16 by BA/PM** (task `abc042-followups-2026-08-16`, subtask
> `refinement-ABC-042-followups`, Workflow 07) out of **Security/NFR's own re-check**
> (`security-nfr-ABC-042-recheck2`) — `S1`, `S4` and `S5`, all **LOW**, none blocking, **all three
> found by the bars' author attacking its own bar text**. `Q5` / `B4` is the same instrument as `S1`
> and rides with it. **`ABC-042`'s page is NOT edited by this ticket** — see § How the wording is
> repaired without touching a gated page.

## Problem

*User*: the reviewer and the owner reading these rows to decide whether the CLI can be trusted with
an argument, and the next hop that edits `src/cli.test.ts`.

*Pain*: **all four ASVS bars are MET on the delivered build — measured, twice. Three of the
instruments that report that are blind or brittle in ways their own text does not admit.**

| # | the instrument | what it cannot see | the mutant that proves it |
|---|---|---|---|
| **`S1`** | bar 1b has **no in-suite row of its own**. The spawn-pin row catches an added `execSync` import and call site as a side effect | **a `shell:` key on the one spawn, and an argv built by string concatenation, are asserted by nothing** | **`MS4`** (`shell:` added, import list and call count unchanged) — **survives 29/29** |
| **`S4`** | bar 3's probe spawns **once**, with a token containing a literal `\x1b[2J` — **ESC only**. The bar's clause (ii) forbids C0, `U+007F` **and** ESC | **the `U+007F` clause cannot fire**: no `U+007F` ever enters the child's argv | **`M3h`** (`printableOf` narrowed to `code < 0x20 && code !== 0x7f`, **the same two numeric literals**, ESC still stripped) — **ships 29/29 GREEN while `U+007F` reaches the terminal** |
| **`S5`** | the spawn pin at `:787` reads **raw source** (`sourceOf("cli.test.ts")`) and then counts `/\bspawnSync\s*\(/` | **a legal docblock sentence naming `` `spawnSync(` `` reds a correct file** — the exact shape this file's own docblock already uses for `` `exec(` `` | measured by Security/NFR at the re-check: **RED on a correct build** |

*Value*: **`S5` is the sharp one.** That row's own comment says it is *"the instrument the owner's
decision rests on"* — `N8-LANE` is breached at 2.00× and escalated, and a **false RED** on the child
counter reads as *"an eleventh child appeared"* on a ticket held at the merge over a spawn-driven
bar. `S1` and `S4` are drift guards: the build is correct today, and the cheapest moment to arm them
is while the reasoning is written down.

**Nothing here is a control failure.** `V1.2.5 [L1]` is MET by measurement, `V1.3.3` (terminal
escapes) is **L2 and above the active L1 floor**, and two of the three ways to weaken the byte filter
(`M3f`, `M3g` — change or delete a number) are killed by `A8`'s number transcription. That
compensating control is why `S4` is low rather than medium, and it must not be removed by this
ticket.

## Scope

Three sites, one file — `src/cli.test.ts` — **zero production lines and zero new child processes.**

- **`S5` — one identifier.** `sourceOf("cli.test.ts")` → `executableCodeOf("cli.test.ts")` at `:787`.
  The helper is defined at `:45-48` and this file already calls it at **seven** sites.
- **`S1` — two assertions appended to the row that already reads the file** (`N8-LANE` pin,
  `:775-793`), over `executableCodeOf`: **`/shell\s*:/` count 0**, and **no `+` inside the
  `spawnSync` argument text**. Not a new `it` block.
- **`S4` — the probe token, in place.** `CHILDREN.escape` at `:158` is
  `run("--colour", "\u001b[2Jpurple")`. Put **`\x7f` and one further C0** into the **same argv
  token**, keeping the `[2Jpurple` substring the row locates by intact, and keep bar 3's existing
  assertion at `:769` (`code < 0x20 || code === 0x7f`) unchanged — it is already correct; it has
  simply never been fed a `U+007F`.
- **The corrected bar wording, carried at the sites.** Bar 1b's regexes say **which text they apply
  to** (the delivered test file's **executable code, comments stripped**), and bar 3's spawn clause
  says the probe token carries **one member of each class it forbids**.

## How the wording is repaired without touching a gated page — read this before objecting

`ABC-042`'s page carries bar 1b at `:247-253` and bar 3 at `:254-263`. **Both gates have passed
against that page and it is not edited — not one line — by this ticket or by the hop that builds
it.** A criterion edited after gating means the gates were run against a page that no longer exists.

So the corrected wording lands in the only two places that can still take it: **this ticket's
criteria**, and **the instrument's own comment at the site**, where the next reviewer actually runs
the regexes. `ABC-042`'s page keeps the un-clarified wording permanently, and the record of why is
this section plus Security/NFR's ruling note. **That is the honest cost of gating a page, and it is
cheaper than a gate that means nothing.**

## Out of scope

- **`ABC-042`, its page, its criteria, its verdicts and its hold.** Not re-opened. Nothing here
  changes a bar's **verdict**: all four were MET at `d011df4` and stay MET.
- **`G1` / `N8-LANE`.** Not re-opened, not re-measured, not re-graded. **Zero new spawns** is a hard
  constraint of this ticket precisely because `G1` is live and with the owner.
- **`A8`'s number transcription row** (`numbersIn("cli.ts")` equals `["0","0x20","0x7f","1","2"]`).
  It is the compensating control that kills `M3f`/`M3g`. **Do not touch it.**
- **Widening bar 1b beyond `shell:` and concatenation**, and **C1/CSI** (`AR-1`, `L2`, outside the
  active set, owner BA/PM, standing ruling — requiring it here is gold-plating).
- **Any production module.** All 18 merged modules and the two delivered ones stay byte-identical.

## Acceptance (Given/When/Then)

- **`A1` (`S5` — the pin survives prose).** **Given** a docblock sentence added to
  `src/cli.test.ts` that names `` `spawnSync(` `` in prose, **when** the suite runs, **then** it is
  **GREEN**. *(Today: RED.)*
- **`A2` (`S5` — no kill traded).** **Given** `MS1` (an eleventh child via a direct `spawnSync`) and
  `MS2` (a namespace import of `node:child_process`), **then** both are **RED**, each attributed to
  the pin. **Rebuilt and run, not reasoned about.**
- **`A3` (`S1` — the two unguarded clauses are guarded).** **Given** `MS4` (`shell: true` added to
  the one `spawnSync` call, import list and call count unchanged), **then** the suite is **RED**;
  and **given** a build whose argv token is assembled with `+`, **then** RED. *(Today: `MS4`
  survives 29/29.)*
- **`A4` (`S1` — the assertions run over the right text).** **Given** the delivered, correct file,
  **then** the new assertions read **`executableCodeOf`**, and over that text `shell:` counts **0**
  while over **raw** source it counts **1** — the file's own docblock. **The two numbers are both
  asserted, so the test states why raw would be wrong.**
- **`A5` (`S4` — the clause can fire).** **Given** the single probe child, **when** `M3h`
  (`printableOf` narrowed to `code < 0x20 && code !== 0x7f`) is rebuilt, **then** the suite is
  **RED**. *(Today: 29/29 green while `U+007F` reaches the terminal.)*
- **`A6` (`S4` — the compensating control is intact).** **Given** `M3f` and `M3g`, **then** both are
  still **RED** and still attributed to `A8`'s number transcription, which is **byte-identical**.
- **`A7` (the lane pin does not move).** **Given** the delivered file, **then** `spawned` is **10**
  and `Object.keys(CHILDREN)` has length **10** — **no new child** — and **this diff adds no new
  `it` block**, so the file's test count is whatever it was before this ticket, unchanged by it.
  *(Stated as a delta, not as the absolute `29`: `ABC-059` may add a block to the same file and the
  two tickets must not red each other.)* The bar-3 row still locates its token by whitespace split
  and still asserts over every occurrence.
- **`A8` (nothing else changed).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path.** All 20 production modules
  byte-identical by blob SHA. Suite green, skip **0**.

## Dependencies

- **`ABC-042` must merge first — OPEN and HELD.** `src/cli.test.ts` **does not exist on `main`**
  (verified); it is delivered by `ABC-042`, which is **held at the merge on `G1`, with the project
  owner**. Not this ticket's to move.
- **No dependency on `ABC-057`.** Different file, different guard; either order works.

## Security / NFR triggers

- **Security IS the subject** — `V1.2.5 [L1]` (bar 1b) and `V1.3.3 [L2]` (bar 3). **Both are MET on
  the delivered build and this ticket does not change that**; it arms the instruments that report it.
  **Falsifiable firing threshold**: the diff touches the file that spawns, so **Security/NFR reads
  it** — and it fires on any of `ABC-041`'s four clauses: **(a)** manifest touch — none, **(b)** a
  non-`.test.ts` file under `src/` gaining a builtin / `process.` read / `spawn` / `exec` / `fetch` /
  `eval` — none, **(c)** a test file adding network, a write outside a temp dir, or a **new** spawn —
  **no new spawn**, and the argv change is inside an **existing array literal** with no
  concatenation, **(d)** blast radius beyond one path — none. **On a disputed reading it fires and
  the gate resolves it: (c) is arguable because the bytes handed to a child change, and that argument
  should be had at the gate, not pre-empted here.**
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  and 0 new child processes — the pin at ten is a criterion (`A7`).** The added work is two regex
  scans over already-read strings and two extra bytes in one argv token. **`N8-LANE` is currently
  NOT MET at 2.00× and that figure is the owner's; this ticket must not move it, and `A7` is how
  that is checked rather than asserted.**
- **`NFR-002` not triggered.** No frame path; no production module opened.

## Test notes

1. **Six mutants, all specified by their author, none invented here**: `MS1`, `MS2`, `MS4`, `M3f`,
   `M3g`, `M3h`. **Rebuild and run each — Security/NFR explicitly said to re-run `MS1`/`MS2` "rather
   than taking my reasoning".** Run a control first: the unmutated tree must be **29/29** before any
   mutant verdict counts.
2. **`S1` cannot be written over raw source and this is measured, not argued**: `shell:` occurs
   exactly once in the file's own docblock, so a raw-text row asserting zero **cannot be green on the
   correct file**. That is also the whole of `Q5`.
3. **The `S4` token must keep `[2Jpurple` intact** — bar 3 locates the echoed token with
   `.includes("[2Jpurple")` and the non-vacuity assertion depends on it. Choose the added bytes so
   the located substring survives, and re-check the non-vacuity assertion still passes on the correct
   build **before** trusting any absence assertion.
4. **`S4`'s fix costs zero new spawns and that is the point.** Both extra bytes go into the **same
   argv token** of the existing `CHILDREN.escape` child. If a proposed implementation needs a second
   child, it is the wrong implementation while `G1` is unanswered.
5. **Do not confuse these `S4`/`S5` with the Scribe's.** The `AGENTS.md` Scribe published its own
   `S4`/`S5` at `agents-md-ABC-042-dev-run` (an E2E justification comment, and `ADR-0007`'s `D2`
   headline). **Different findings, same labels, different author.** The ones in this ticket are
   Security/NFR's, from `security-nfr-ABC-042-recheck2`.

## Lane cost — how many test FILES this ticket implies

**Zero, and zero new children.** All three sites are in one existing test file.

## Size and priority rationale

**Size `S` (2).** The edits are ~10 lines across three sites in one file — `XS` of typing. The `S` is
the verification: six mutants rebuilt and run against a green control, plus the two-number assertion
in `A4` that has to be got right in both directions. **Not `M`: nothing is designed here, every
mechanism and site is named by the role that found it.**

**Priority `P2`.** No live defect and nothing blocks: the delivered build is correct on all three
counts. **Promotion triggers, named**: **(a)** any hop that opens `src/cli.test.ts` for another
reason — `S5`'s one-identifier fix should ride along with it; **(b)** the moment `G1` comes back with
an answer that touches the child set, because `S5`'s false RED lands hardest exactly there.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — NOT MET.** ⚠️×1, and the ⚠️ is an ordering, not an unknown.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three instruments, three named mutants, two of them measured green on builds that misbehave and one measured red on a build that does not |
| 2 | scope and out-of-scope clear | **✅** three sites in one file; five fences, including `A8`'s number row and `G1` explicitly |
| 3 | INVEST-shaped | **✅** small, testable by six existing mutant specs; the three share a file, an author and one review |
| 4 | acceptance testable and measurable | **✅** `M3h`/`MS4` RED, `MS1`/`MS2`/`M3f`/`M3g` still RED, `shell:` **0** stripped vs **1** raw, `spawned` **10**, `it` count **29**, **1** path in the diff |
| 5 | dependencies known | **✅** `ABC-042` first (the file does not exist on `main` — verified), independent of `ABC-057` |
| 6 | security/NFR triggers with a measurable target | **✅** the subject; two ASVS rows named with levels, four clauses answered individually, `N8-LANE` ≤ 650 ms with the spawn pin asserted at **10** |
| 7 | test notes present | **✅** five, including the control run, the located-substring trap, and the `S4`/`S5` label collision with the Scribe's findings |
| 8 | size assigned | **✅** `S` (2), with the reason it is not `XS` (six mutants) and not `M` (nothing designed) |
| 9 | priority assigned | **✅** `P2` with two named promotion triggers |
| 10 | no major unresolved blocker | **⚠️** `ABC-042` must merge first and is **held on `G1`, with the project owner**. Real, external, and not this ticket's to resolve — scored as a blocker rather than written off |
