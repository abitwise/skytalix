---
subtask: bapm-rule-QE-194
role: ba-pm
tickets: [ABC-194]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-194/
width: 2 (beside qe-ABC-195)
---

# BA/PM (records only): rule QE-194-a (LOW proposed) and QE-194-b/-c/-d (INFO) from ABC-194's QE gate. ABC-194 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-194/notes/20261021T201352Z-qe-e2e-decision-ac075665.md`, mutants `…2412ce70`; the `## QE` section on ABC-194's page.
- Your own `bapm-rule-QE-192` notes (`…09a201ba`: QE-192-b accepted because a parser check cannot resolve bindings or off-switches keyed outside its reach); ABC-173's page; `ADR-0008`; `tools/grugops/heap-guard.js`.

## Do
- **QE-194-a** (an off-switch on the guard's *inputs* — e.g. `env ? { heap_size_limit: 0 } : v8.getHeapStatistics()`, overwriting `v8.getHeapStatistics`, `if (env) return;` inside `guard` — passes every gate): rule cut / fold / accept. Weigh it against the QE-192-b precedent: each closure pins one more spelling while a switch keyed on a file or `argv` stays out of a parser's reach. If you lean to a cut, say what a closure must hold and measure it at base on a scratch copy outside the repository; if you need a Security/NFR rating first, say so and stop there rather than guess one.
- **QE-194-b** (two weakenings of the check survive its own plant table; two more plants close it), **QE-194-c** (`npm test` exit 0 alone does not prove a run happened; `last-run.json` does), **QE-194-d**: rule each.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card; next free id ABC-196. Otherwise only a dated line on ABC-194's page.

## Fences
- Only `plans/` (board, any new ticket page, a dated line on ABC-194's page) and your notes. No `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing. A QE agent works in `../wt-qe-ABC-195`; touch nothing of theirs.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-194`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-rule-QE-194.md` + `.claim.md`, main's tree, uncommitted).

## Result (ba-pm, 2026-10-21T20:20:18Z): **Nothing cut and no ticket opened. QE-194-a, -b, -c and -d are ACCEPTED, each with an owner and a reopen trigger. QE-194-a's owner rule folds into QE-192-b's; QE-194-b's two plants fold into QE-192-c's. No Security/NFR rating is needed to rule. Board untouched; next free id stays ABC-196.**

Records only, uncommitted on `main` (`0d05f252` at start and finish). Notes are in `.grugops/context/bapm-rule-QE-194/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, with this checkout's `.grugops/context` passed explicitly, and both read back through `readContext`:
- `20261021T201955Z-ba-pm-decision-54e03439`: the ruling per gap, with owners and triggers;
- `20261021T201955Z-ba-pm-observation-de421667`: the readings (the check parses heap-guard.js only, line 4259; ADR-0008's sentence; no last-run line in AGENTS.md) and the files touched.

| gap | ruling |
|---|---|
| QE-194-a (LOW proposed, unrated) | **ACCEPT, folded into QE-192-b's owner rule.** QE's closure closes the env spelling only. A key on `argv`, a file or `globalThis`, the same key inside `admit`/`guard`, or a `v8` patch outside `heap-guard.js` stays open; the check parses that one file only. Unlike QE-192-a's bounded control-flow class, each pin here closes one spelling of an unbounded class, and the diff read covers the class. ADR-0008's "never runs uncapped" is said of a prefix-less lane and holds. **Owner:** QE on any diff touching `heap-guard.js`, `globalSetup` or a vitest preload. QE reads it for a switch on the guard's inputs or decision, and on a hit runs QE's probe with the key set; it must refuse. **Reopen:** such a switch in a diff; the probe admits; an escape hatch is proposed (an ADR-0008 amendment, the owner's call); or a Security/NFR rating of MEDIUM or above. |
| QE-194-b (INFO) | **ACCEPT, folded into QE-192-c's owner rule.** A3's literal is met. W5 and W6 are edits to `guardStreamFaultOf` itself, which arrive only at a hop that edits the check. **Owner:** that hop's builder and QE also run `if (false) return;` + the call (red as 1 return) and `do { break; } while (guard(…))` (red as DoStatement), and record both. **Reopen:** such a hop lands without both, or either goes green. Then cut the two plants (XS, test-only). |
| QE-194-c (INFO) | **ACCEPT.** Nothing runs uncapped, and every A5 already reads `last-run.json` + counts. **Owner:** the Orchestrator and QE as gate readers. `npm test` exit 0 alone is no evidence of a run; cite `success`, `runState` and counts. **Reopen:** a verdict cites exit 0 alone, or the result-file reporter leaves the `test` script. Then cut an AGENTS.md gate line, which holds none today. |
| QE-194-d (INFO) | **ACCEPT.** Expected by ABC-194's test note 2 and covered by QE-192-c; that owner and trigger are unchanged. |

**Security/NFR rating: not needed.** The ruling turns on parser reach, not severity. `block_on` is high, and the gap is a deliberate edit with no new surface on a local-only project. No rating was set.

Files: `plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md` (+2 lines: a blank line and one dated ruling block at the end). Not touched: `plans/board.md`, `plans/traceability.md` (the row is below, for the Orchestrator), `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, `../wt-qe-ABC-195`, the pending file, the claim directory, git config, `node_modules/`. No scratch copy and no run: nothing was cut. No stop.

### Trace row (10 cells, header order)

| ABC-194 (BA/PM QE-194 ruling) | ruled QE-194-a ACCEPTED (input off-switch; parser-unreachable class, QE-192-b precedent; owner rule folded into QE-192-b's: QE reads heap-guard.js/globalSetup/preload diffs, probe with the key set must refuse), QE-194-b ACCEPTED (two plants folded into QE-192-c's owner rule), QE-194-c ACCEPTED (gate readers cite last-run.json, not exit 0), QE-194-d ACCEPTED (QE-192-c covers it); no Security/NFR rating needed; nothing cut | — | — | QE-194-a, QE-194-b, QE-194-c, QE-194-d; QE-192-b, QE-192-c; ADR-0008; ABC-173; notes …ac075665, …2412ce70, …09a201ba, …54e03439, …de421667 | main @ 0d05f252 (uncommitted, records only)<br>plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md | — (records only; no run; QE's 59/1994 at 0fd86eb4 stands) | — (ABC-194 UAT waived, 0 production lines; not a signature) | — | ABC-194 stays Done; no column move; no new ticket (next free ABC-196) |
