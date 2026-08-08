---
id: 20260808T201500Z-security-nfr-decision-187c3eae
kind: decision
by: security-nfr
at: 2026-08-08T20:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-014
  - ABC-018
  - EPIC-002
  - EPIC-006
  - NFR-007
  - RISK-005
  - src/glyph-mode.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - 20260807T121500Z-security-nfr-decision-373e915b
  - 20260808T200500Z-security-nfr-observation-89b14279
  - 20260808T201000Z-security-nfr-observation-ee58ca2c
supersedes: 
---

# `ABC-015` PASSES WITH RISKS — `In Security/NFR` → `Ready for UAT`. No required fix. Four accepted risks, and one PRIOR gate's accepted risk is corrected

The `In Security/NFR` exit is this role's and it is taken. **`In Security/NFR` 1/2 → 0/2,
`Ready for UAT` 0/4 → 1/4.** No limit approached, no override taken. **Nothing merged and nothing
deployed — a human holds both.**

`security.asvs_level` is `L1`, `security.block_on` is `high`, `compliance_regime` is `[]`.
**No required fix is outstanding and nothing blocks.**

## Why PASS and not a send-back, stated so the bar is visible

**A send-back was live and was rejected on one ground: nothing in the delivered code is wrong.** The
zero-I/O bar is met on three independent instruments this gate built; the security ruling holds; and
every property found is a **gadget with an unreachable precondition**, not a defect present in the
tree. `src/glyph-mode.ts` is byte-identical to what QE passed (`md5
9c1f4f4e957d4faf3c9cccc49a545185`) and this gate changed no production code and added no test.

**What would have earned a BLOCKED, stated so the bar is checkable:** an L1 requirement actually
failed (default severity `high`, which `block_on: high` blocks on); an I/O operation the bar forbids,
found on this gate's own instruments; a byte from the environment reachable in the module's output;
a secret or an ambient value emitted, logged or thrown; or an NFR budget missed. **None is present.**

**And a green-badge PASS was equally rejected.** The ticket's stated security reason is wrong three
times over, a prior gate's accepted risk names an owner that does not own it, and the module is the
first thing in `src/` to read `process.env`. All of that is recorded below rather than smoothed into
"no security trigger, as the ticket says".

## The gates, re-run by this role on the tip `8de5624` rather than inherited

| Gate | Result |
|---|---|
| `npm run lint` | exit **0** — "Checked 29 files. No fixes applied. Found 2 infos" (the pre-existing `biome.json` schema-version notice and the deprecated `recommended` field, neither this ticket's) |
| `npm run typecheck` | exit **0** |
| `npm run build` | exit **0** |
| `npm test` | exit **0** — **277 passed / 277, 13 files** |
| skip count (the `AGENTS.md` command) | **0** |
| `git status --short` | clean of `src/`; `git diff --stat main -- src/` is the three new files and nothing else; `src/render.ts` byte-identical to `main` |

**Arithmetic re-derived rather than accepted:** the thirteen per-file counts sum to 277, and removing
this ticket's two files (21 + 3) leaves **253 on 11 files**, which is what `main` carries. The
Engineer's, the Orchestrator's, QE's and BA/PM's figures all reproduce.

**Flakiness checked on this gate's own runs, not QE's:** three further full-suite runs with
`--sequence.shuffle`, **277/277 each**. The tests that rewrite the real `process.env` and
`process.stdout.isTTY` restore from module-load descriptors and did not leak.

**No `--coverage` run was made**, so the tracked-`coverage/` hazard never arose. The 100% figure for
`src/glyph-mode.ts` is **QE's and is not restated as this gate's**.

## The four accepted risks — each with a severity, a named owner AND a place

An accepted risk without a named owner is a finding nobody fixes.

| # | Risk | Severity | Owner | Place |
|---|---|---|---|---|
| 1 | **The environment prototype-chain gadget.** `src/glyph-mode.ts:87`'s `signals.env[name]` is an unguarded prototype lookup and the real `process.env` **falls through to `Object.prototype`** — measured with a live null control: a polluted `LC_ALL` **outranks a real UTF-8 `LANG`** and flips the session. Under pollution the rung may be a non-string, so `UTF8.test`'s `ToString` **runs attacker code** (measured), and a throwing `toString` escapes uncaught | **LOW** | Architect/Design | `ABC-018` / `EPIC-006` |
| 2 | **An uncaught exception can escape the session's ambient read — no log, no context, and it fails CLOSED rather than fail-safe.** No board at all is neither of `RISK-005`'s two directions | **LOW** | `EPIC-006` (startup) / `ABC-018` | `EPIC-006` |
| 3 | **The WHOLE environment crosses the call boundary.** `GlyphSignals.env` is the entire `Record<string, string \| undefined>` and `beginGlyphModeSession` hands it all of `process.env`, when **three named keys** are all that is ever read | **LOW** | Software Engineer | `EPIC-006`, when a caller and a logger exist |
| 4 | **Every figure here is one machine and one Node version** — Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. The real-terminal measurement is one pty on that machine; Windows conhost, Windows Terminal, iTerm2 and tmux stay `UNKNOWN - verify` | **LOW** | Security/NFR | `EPIC-004`'s already-scheduled non-M3 spike (`RISK-002`); `RISK-005` for the terminals |

### Why each is LOW rather than higher

**(1)** is a *gadget*, not a *sink*: its precondition is an already-polluted `Object.prototype`, and
**no pollution sink exists anywhere in `src/`** (re-verified with comments stripped — the only
computed writes in the codebase are `position.board[i] = n` into a `Uint8Array`). Its reachable
effect is bounded to **flipping which of two glyph tables is used** — the return domain under
pollution is still exactly `{ascii, unicode}`, measured. A real environment cannot carry a
non-string, so the code-execution half needs the pollution too. Under ASVS L1 no requirement is
*failed*: `V2.2.1` **passes** on the environment input, and the flags half is `NOT ENGAGED` with its
counterfactual named. Same class, same bound and the same owner and place `ABC-014`'s gate gave the
sibling gadget in `GLYPHS[mode]`.

**(2)** The *decision* not to guard is right and **is not re-opened**: there is no logger and no
caller at this layer, and wrapping a read that can only fail under a polluted prototype is the
impossible-scenario handling `AGENTS.md` rule 8 forbids. What is carried forward is narrower and is
`EPIC-006`'s: that is where a throw out of session start meets a user who wanted a chessboard.

**(3)** is a **blast-radius** statement, not a leak. Measured today: at most 3 named keys read, zero
enumerations, zero reads at all on a non-TTY sink, nothing emitted. **Narrowing the parameter now
was considered and REJECTED as gold-plating** — the ticket did not ask for it, the measurement shows
no exposure, and `AGENTS.md` rules 5 and 10 apply. What is recorded is the counterfactual: a future
debug line inside `selectGlyphMode` prints a developer's entire shell environment rather than three
locale strings.

**(4)** is this project's standing marker and is unchanged.

## AN AUDITOR MAY OVERRIDE A DEFAULT SEVERITY — this gate overrode NOTHING, and restated one prior override

**No default severity was overridden in either direction. Nothing was demoted to keep the gate green
and nothing was inflated to look thorough.** The four risks above are not failed requirements at
all; they are properties recorded with their bounds.

One **prior** override is restated with its evidence re-checked rather than re-taken:
`V15.1.1`/`V15.2.1` (documented remediation timeframes for third-party components) are **not met at
project level**, severity overridden from the L1 default `high` to **`low`** on the ground of **zero
runtime dependencies** — verified here: `dependencies` is `{}` and `package.json` and the lockfile
are **untouched on this branch**. Owner **Architect/Design at `EPIC-006`**. `V13.4.1` remains
**DEFERRED, not passed** (packaging, `EPIC-006`) and is **not relaxed** by anything in this ticket.

## A PRIOR GATE'S ACCEPTED RISK NAMES AN OWNER THAT DOES NOT OWN IT — corrected here

`ABC-014`'s gate (`20260807T121500Z-security-nfr-decision-373e915b`) recorded accepted risk **3**:

> **A non-`"white-bottom"` orientation silently renders BLACK-bottom** … Owner: **`ABC-015` /
> `EPIC-006` (they own the value)**.

**`ABC-015` has now shipped and it produces no orientation value at all.** Its entire scope is the
**glyph mode**: `selectGlyphMode` returns `GlyphMode`, `beginGlyphModeSession` returns a
`GlyphModeSession`, and the word *orientation* appears nowhere in the ticket. Checked at the source
rather than inferred: **no ticket in `EPIC-002` other than `ABC-014` mentions orientation**, and
`EPIC-002`'s own `## Dependencies` says the human's colour — *"which fixes board orientation"* — is
**`EPIC-006`'s startup scope**.

**Ruled: that risk's sole owner is `EPIC-006`. The `ABC-015` half is struck.**

**The mechanism, because it is the reusable part:** `ABC-014`'s gate correctly found that
`renderBoard`'s two string parameters are both erased unions, then assigned **both values'
ownership** to the same pair — but only one of the two, `mode`, is this ticket's. A correct
observation about two parameters became a wrong ownership on one of them.

**Recorded here rather than by `supersedes`, deliberately.** That note carries three other accepted
risks that are correct and still live; superseding it would fold all four out of replay to fix one
cell. The `supersedes` field overrides a whole note, and three-quarters of this one is right.

## UAT is recorded as DEFERRED, explicitly NOT passed

`src/glyph-mode.ts` has **zero runtime importers** — verified, not assumed — returns a value,
writes nothing and prompts for nothing, and `AGENTS.md`'s `Dev / run` is `UNKNOWN - verify` because
there is no CLI entry point until `EPIC-006`. **There is no surface a human can exercise, so a UAT
pass would be a fabrication.** The cell is filled with the deferral and its reason rather than left
blank, so nobody reads a blank as an omission.

`ABC-018` is the first ticket that puts this rule in front of a human; `EPIC-006` owns the runnable
game. Same posture this column recorded on `ABC-012` and `ABC-014`, ruled here on this ticket's own
evidence rather than by precedent — and the subtask asked for exactly that honesty.

**The one thing that came closer to UAT than any prior ticket:** this gate ran the module inside a
**real pty** and observed the true terminal path in both directions. That is an instrument reading,
**not** a human exercising a product, and it is not offered as UAT.

## `compliance_regime` is `[]`

**No Compliance Officer hand-off is owed.** Recorded because Section 13 makes that hand-off
mandatory when a regime IS set, and a silent omission looks identical to a missed hand-off.

## What this gate REFUSED to do, each with its reason

- **No production code was changed and no test was added.** `git diff --stat -- src/` is empty and
  `src/glyph-mode.ts` still hashes `9c1f4f4e957d4faf3c9cccc49a545185`. No defect warranted a fix,
  and this gate does not add tests to a suite QE has already broken 29 mutants against.
- **The delivered `NFR-007` guard was neither cited nor widened.** It was re-derived around, not
  read. Widening it further — to `node:worker_threads`, to `process.binding` — was considered and
  **rejected**: the permission-model instrument already covers every specifier at once, and adding
  names to a list that fails by omission is treating the symptom.
- **No wall-clock assertion was added.** This project's standing rule; the nanoseconds live in
  `plans/nfr-catalog.md` with their machine.
- **The prototype gadget was NOT pinned by a test.** Pinning it means asserting behaviour under a
  deliberately polluted global — a test that damages the process it runs in, for a scenario with no
  reachable precondition. Recorded here instead, where a reader of `ABC-018` will find it. Same call
  `ABC-014`'s gate made for the same reason.
- **No acceptance criterion was amended and none was re-opened.** That exit is BA/PM's, they took it
  twice today, and nothing this gate found needs a criterion.
- **The `Boolean()` comment was not edited or re-adjudicated** (coding rule 9), and the
  empty-locale ruling, the both-flags-true ruling, the merge-order constraint and the pull order were
  not re-opened. None is a security or NFR question.
- **`ABC-014`'s note was not edited** — see the `supersedes` reasoning above. **No other role's
  published note was touched.**
- **`plans/metrics.md` was not swept** (the daily sweep's and the retro's), **`coverage/` was not
  refreshed or deleted** (rule 12 — still tracked, still stale by two merged tickets, still flagged),
  and **`ABC-012`'s stale ticket frontmatter and the self-healing snapshot net were not re-routed** —
  both already have owners.
- **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed**, as every ticket in this wave carried
  them.
- **Nothing was merged and nothing was deployed.** The owner's standing merge authority is approval
  to merge work that **PASSED**, and it is not deploy approval; per `ADR-0007` this project deploys
  nowhere at all. A human holds both.

## The merge-order constraint still binds, and this gate does not discharge it

`ABC-015` merges **with or before `ABC-018`**, never after — `RISK-005`'s own mitigation wording.
`ABC-018` is unstarted and in `Backlog`, so the constraint remains satisfiable and satisfied by
merging this now. Nothing in this gate changes it.

## Recorded honestly

This is a `decision`, not a `finding`. There is no §14 gate in this install to issue a
`§14-gate#<id>` stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists
either — **nothing is self-stamped and no verified result is claimed.** The gates and instruments
above are real commands with real output and are not dressed up as a gate verdict.
