---
id: 20261019T084831Z-architect-design-decision-adr0038-add2-reporter-verbose-b7e2c915
kind: decision
by: architect-design
at: 2026-10-19T08:48:31Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: arch-ABC-166-a5
refs: [ABC-166, ABC-146, ADR-0038]
---

# ADR-0038 addendum 2, item 1: the command takes `--reporter=verbose` (noted, no decision changes)

- **Ruling: yes.** Item 1 now carries one dated line: `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose`.
- **Why:** vitest 4.1.11's default reporter drops `console.log` from a passing test. Run 1 used item 1's command as written. It passed 17/17 and printed no `LADDER` line, so it gave no score (`…75f37904`). Without the line, a re-take under the staleness rule would repeat run 1.
- **Scope:** the flag changes output only. Step, seeds, game counts, runner, scheduling and every decision stay as they were. Route V stands.
- **Pointer:** a second dated line records that run 2 used this form and is the route's reading (`…4c1d8e27`, commit `e68a4327`). Evidence for the form: main's `plans/board.md` records run 2 as started with `--reporter=verbose`, and `raw/verdict-run2.out.txt` has per-test lines and 180 `LADDER GAME` lines. The meta file does not record the command.
- **Records only:** no test, vitest or timing ran at this hop. Only the ADR-0038 file and this note were touched.
