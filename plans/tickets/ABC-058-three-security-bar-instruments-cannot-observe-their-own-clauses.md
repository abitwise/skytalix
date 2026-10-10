---
id: ABC-058
title: Two of `ABC-042`'s security-bar instruments cannot observe their own clauses — a `U+007F` clause whose probe carries no `U+007F`, and a spawn pin a docblock sentence can red (the third, `S1`, closed by the tree since)
status: ready
column: Ready
size: XS
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
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2-2026-10-10`)
> against wave tip `f76e041`. `src/cli.test.ts` has grown from ~800 to 3174 lines, and the child
> pin from 10 to 27 (`ABC-043` +7, `ABC-115` +7, `ABC-045` +1, `ABC-046` +2). Every mutant was
> rebuilt on a `git archive` copy (control 66/66).
> **`S5` holds:** a prose `` `spawnSync(` `` reds the correct file (1 of 66 red).
> **`S4` holds:** `M3h` ships 66/66 green.
> **`S1` is CUT, because the tree moved:** `MS4` (`shell: true` on the one `spawnSync`) is now
> **RED, 18 of 66**, because the `/bin/sh -c` children `ABC-115` added break under a second shell.
> `ABC-115` also amended the concatenation clause at the site (`:19-29`, `:404-409`).
> `A3`/`A4` are struck, and the size goes `S` → `XS`. **DoR 10/10 → `Ready`.** Evidence:
> `.grugops/context/rescore-batch-2-2026-10-10/`.

## Problem

*User*: the reviewer and the owner reading these rows to decide whether the CLI can be trusted with
an argument, and the next hop that edits `src/cli.test.ts`.

*Pain*: **all four ASVS bars are MET on the delivered build — measured, twice. Three of the
instruments that report that are blind or brittle in ways their own text does not admit.**

| # | the instrument | what it cannot see | the mutant that proves it |
|---|---|---|---|
| ~~**`S1`**~~ | ~~bar 1b has no in-suite row of its own~~ | **CLOSED BY THE TREE, 2026-10-10.** `MS4` is now RED 18/66 as a side effect of `ABC-115`'s `/bin/sh` children, the same kind of side-effect kill the page accepted for `execSync`. The concatenation half was amended at the site by `ABC-115`: the `-c` scripts are built from `process.execPath`, `ENTRY_POINT` and literals, quoted by `shellWord` | ~~`MS4` survives~~ → **RED 18/66** |
| **`S4`** | bar 3's probe spawns **once** (`CHILDREN.escape`, `:675`), with a token containing a literal `\x1b[2J` — **ESC only**. The bar's clause (ii) forbids C0, `U+007F` **and** ESC | **the `U+007F` clause cannot fire**: no `U+007F` ever enters the child's argv | **`M3h`** (`printableOf`, `src/cli.ts:125`, narrowed to `code < 0x20 && code !== 0x7f`, **the same two numeric literals**, ESC still stripped) — **ships 66/66 GREEN, re-measured 2026-10-10** |
| **`S5`** | the spawn pin (`:1840-1845`) reads **raw source** (`sourceOf("cli.test.ts")`) and then counts `/\bspawnSync\s*\(/` | **a legal docblock sentence naming `` `spawnSync(` `` reds a correct file**. `ABC-115`'s comments avoid the paren by luck (`:21-22`, `:393`) | **RED on a correct build: 1 of 66, re-measured 2026-10-10** |

*Value*: **`S5` is the sharp one.** That row's own comment still says it is *"the instrument the
owner's decision rests on"* (`:1837-1838`). A **false RED** on the child counter reads as *"a child
was added past the ceiling"*, and four tickets have raised that ceiling with a written derivation
(10 → 27). `S4` is a drift guard, as `S1` was: the build is correct today, and the cheapest moment
to arm it is while the reasoning is written down. *(Value re-stated 2026-10-10. The 2.00× breach
and the `G1` hold it cited are history.)*

**Nothing here is a control failure.** `V1.2.5 [L1]` is MET by measurement, `V1.3.3` (terminal
escapes) is **L2 and above the active L1 floor**, and two of the three ways to weaken the byte filter
(`M3f`, `M3g` — change or delete a number) are killed by `A8`'s number transcription. That
compensating control is why `S4` is low rather than medium, and it must not be removed by this
ticket.

## Scope

Two sites, one file — `src/cli.test.ts` — **zero production lines and zero new child processes.**
*(Line numbers re-measured 2026-10-10 at `f76e041`.)*

- **`S5` — one identifier.** `const self = sourceOf("cli.test.ts")` → `executableCodeOf(...)` at
  `:1840`. Both the import-list match (`:1841`) and the call-site count (`:1845`) read `self`. The
  helper is defined at `:58-61`.
- ~~**`S1`**~~ — cut 2026-10-10; see the re-score note at the top.
- **`S4` — the probe token, in place.** `CHILDREN.escape` at `:675` is
  `run("--colour", "\u001b[2Jpurple")`. Put **`\x7f` and one further C0** into the **same argv
  token**, and keep the `[2Jpurple` substring that the row locates by (`:1731`, `:1736`) intact.
  Keep bar 3's existing assertion at `:1741` (`code < 0x20 || code === 0x7f`) unchanged. It is
  already correct; it has simply never been fed a `U+007F`.
- **The corrected bar wording, carried at the sites.** The spawn pin's comment says it counts over
  **executable code, comments stripped**, and bar 3's spawn clause says the probe token carries
  **one member of each class it forbids**. The pin's comment also says "an eleventh child"
  (`:1836`) and "`N8-LANE` is breached and escalated" (`:1837`), and the same block says no
  `N8-LANE` line is claimed (`:1758`, `:1803`). That is `ABC-114`'s defect class, in the two lines
  this ticket edits, so correct both to what is true at the build.

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
  constraint of this ticket: the pin at 27 is `ABC-115`'s ceiling, and a child that no criterion
  names is a finding (the pin's comment, `:1749-1832`).
- **`A8`'s number transcription row** (`numbersIn("cli.ts")` equals `["0","0x20","0x7f","1","2","70"]`
  at `:1637`, 2026-10-10).
  It is the compensating control that kills `M3f`/`M3g`. **Do not touch it.**
- **Widening bar 1b beyond `shell:` and concatenation**, and **C1/CSI** (`AR-1`, `L2`, outside the
  active set, owner BA/PM, standing ruling — requiring it here is gold-plating).
- **Any production module.** Every production module stays byte-identical (35 at `f76e041`).

## Acceptance (Given/When/Then)

- **`A1` (`S5` — the pin survives prose).** **Given** a docblock sentence added to
  `src/cli.test.ts` that names `` `spawnSync(` `` in prose, **when** the suite runs, **then** it is
  **GREEN**. *(Today: RED.)*
- **`A2` (`S5` — no kill traded).** **Given** `MS1` (one more child via a direct `spawnSync`, which `spawned` never counts) and
  `MS2` (a namespace import of `node:child_process`), **then** both are **RED**, each attributed to
  the pin. **Rebuilt and run, not reasoned about.**
- ~~**`A3`**, **`A4`** (`S1`)~~ — **struck 2026-10-10.** `MS4` is already RED (18/66), and
  `ABC-115` amended the concatenation clause. The ids are kept so that no criterion is renumbered.
- **`A5` (`S4` — the clause can fire).** **Given** the single probe child, **when** `M3h`
  (`printableOf` narrowed to `code < 0x20 && code !== 0x7f`) is rebuilt, **then** the suite is
  **RED**. *(Re-measured 2026-10-10: 66/66 green while `U+007F` reaches the terminal.)*
- **`A6` (`S4` — the compensating control is intact).** **Given** `M3f` and `M3g`, **then** both are
  still **RED** and still attributed to the number-transcription row, which is **byte-identical**.
  *(2026-10-10: that row is now `:1637` and reads `["0", "0x20", "0x7f", "1", "2", "70"]`. `ABC-043`
  added `70`.)*
- **`A7` (the lane pin does not move).** **Given** the delivered file, **then** `N8_SPAWN` is still
  `17 + 7 + 1 + 2`, `spawned` equals it (**27** at `f76e041`), `Object.keys(CHILDREN)` has the same
  length — **no new child** — and **this diff adds no new `it` block**. *(Stated as a delta: the
  control was 66 tests at `f76e041`. `ABC-059` adds a block to the same file, and the two must not
  red each other.)* The bar-3 row still locates its token by whitespace split and still asserts
  over every occurrence.
- **`A8` (nothing else changed).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path.** Every production module (35 at
  `f76e041`) byte-identical by blob SHA. Suite green, skip **0**.

## Dependencies

- ~~**`ABC-042` must merge first — OPEN and HELD.**~~ **`ABC-042` — `Done`** (`dbaf972`,
  2026-08-15). `G1` was answered the same day.
- **No dependency on `ABC-057`.** Different file, different guard; either order works.
- **Same file, so not in parallel (2026-10-10):** `ABC-059` (one new block), and the Backlog
  tickets `ABC-114` (comments) and `ABC-129` (cites at `:588`/`:744`). None of them is in flight.
  `ABC-129`'s sites and `ABC-114`'s comments do not overlap these two sites.

## Security / NFR triggers

- **Security IS the subject** — `V1.2.5 [L1]` (bar 1b, the spawn pin) and `V1.3.3 [L2]` (bar 3).
  **Both are MET on the delivered build and this ticket does not change that**; it arms the
  instruments that report it. **Falsifiable firing threshold**: the diff touches the file that
  spawns, so **Security/NFR reads it**. Against `ABC-041`'s four clauses: **(a)** no manifest touch.
  **(b)** The reading is unruled (`ABC-072`). Under STATE it fires: 3 production files read
  `process.` in executable code (`cli.ts`, `glyph-mode.ts`, `perft-bench.ts`), unchanged here.
  Under DELTA it does not: no non-test file is touched. **(c)** A test file adding network, a write
  outside a temp dir, or a **new** spawn: **no new spawn**, and the argv change is inside an
  **existing array literal** with no concatenation. **(d)** No blast radius beyond one path. **On a disputed reading it fires and
  the gate resolves it: (c) is arguable because the bytes handed to a child change, and that argument
  should be had at the gate, not pre-empted here.**
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  and 0 new child processes — the pin at 27 is a criterion (`A7`).** The added work is one regex
  scan over an already-read string and two extra bytes in one argv token. The pin's own comment
  says no `N8-LANE` line is claimed in this file (`ABC-108`'s `OQ-1`), so this ticket claims none
  either; `A7` is how "it does not move" is checked rather than asserted.
- **`NFR-002` not triggered.** No frame path; no production module opened.

## Test notes

1. **Five mutants, all specified by their author, none invented here**: `MS1`, `MS2`, `M3f`, `M3g`,
   `M3h` (`MS4` left with `S1`). **Rebuild and run each — Security/NFR explicitly said to re-run
   `MS1`/`MS2` "rather than taking my reasoning".** Run a control first: the unmutated file must be
   all green (**66/66** at `f76e041`) before any mutant verdict counts. One `src/cli.test.ts` run
   took a few seconds on 2026-10-10.
2. **`executableCodeOf` strips `//` to end of line, including inside string literals.** Check that
   the import line and the `spawnSync(` call survive the strip before trusting the pin's new
   counts.
3. **The `S4` token must keep `[2Jpurple` intact** — bar 3 locates the echoed token with
   `.includes("[2Jpurple")` and the non-vacuity assertion depends on it. Choose the added bytes so
   the located substring survives, and re-check the non-vacuity assertion still passes on the correct
   build **before** trusting any absence assertion.
4. **`S4`'s fix costs zero new spawns and that is the point.** Both extra bytes go into the **same
   argv token** of the existing `CHILDREN.escape` child. If a proposed implementation needs a second
   child, it is the wrong implementation: the pin at 27 is a ceiling.
5. **Do not confuse these `S4`/`S5` with the Scribe's.** The `AGENTS.md` Scribe published its own
   `S4`/`S5` at `agents-md-ABC-042-dev-run` (an E2E justification comment, and `ADR-0007`'s `D2`
   headline). **Different findings, same labels, different author.** The ones in this ticket are
   Security/NFR's, from `security-nfr-ABC-042-recheck2`.

## Lane cost — how many test FILES this ticket implies

**Zero, and zero new children.** All three sites are in one existing test file.

## Size and priority rationale

**Size `XS` (1), re-sized 2026-10-10 from `S`.** Two sites in one file. `S1`'s two-number assertion,
the hardest part, has left. Five mutants remain, each a one-line edit and a single-file run.
**Not `M`: nothing is designed here.**

**Priority `P2`, kept.** Both of the 2026-08-16 triggers fired: about ten hops opened this file,
and `G1` was answered while the child set grew from 10 to 27. No hop rode the fix along. **They are
not used to promote:** in 55 days the false RED never happened, the tree closed `S1` by itself, and
Security/NFR rated all three findings LOW. **New trigger:** promote to `P1` if any open ticket's
diff would add a `` `spawnSync(` `` in prose to this file. Pull this ticket with `ABC-059`, back to
back on the same file.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM at `f76e041`. Result: 10 of 10 — MET → `Ready`.** Was 9/10 at the
cut; the ⚠️ (`ABC-042` held on `G1`) is discharged. `S1` is cut, because the tree closed it.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two instruments, each re-measured today: `M3h` green 66/66, and the prose `` `spawnSync(` `` red 1/66 on a correct file |
| 2 | scope and out-of-scope clear | **✅** two sites in one file; `A8`'s number row and the spawn count are fenced |
| 3 | INVEST-shaped | **✅** small and testable by five existing mutant specs; serial with `ABC-059` on the same file, but neither depends on the other |
| 4 | acceptance testable and measurable | **✅** `M3h` RED; `MS1`/`MS2`/`M3f`/`M3g` still RED; `N8_SPAWN` unchanged (27); 0 new `it`; **1** path |
| 5 | dependencies known | **✅** `ABC-042` `Done`; same-file neighbours named (`ABC-059`, `ABC-114`, `ABC-129`) |
| 6 | security/NFR triggers with a measurable target | **✅** the subject; two ASVS rows with levels; four clauses answered, (b) under both readings; 0 new children |
| 7 | test notes present | **✅** five, including the control count and the strip caveat |
| 8 | size assigned | **✅** `XS` (1), was `S` |
| 9 | priority assigned | **✅** `P2`, with the fired triggers named and a new trigger |
| 10 | no major unresolved blocker | **✅** none |
