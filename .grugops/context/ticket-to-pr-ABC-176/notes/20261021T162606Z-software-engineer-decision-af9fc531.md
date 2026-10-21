---
id: 20261021T162606Z-software-engineer-decision-af9fc531
kind: decision
by: software-engineer
at: 2026-10-21T16:26:06Z
verified_by: 
confidence: high
refs:
  - ABC-176
  - grugops/ABC-176
  - 01836fff
  - ffd53f41
  - plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
  - AGENTS.md
  - QE-173-f
  - SEC-173-1
  - ABC-109
  - ABC-187
  - ABC-173
  - A5
supersedes: 
seal: sha256:d47169dfe9ca67501a7502a95a7e21b4d65a549c5d1160c4b37e9300e6315a3a
---

# ABC-176: the proposed `AGENTS.md` text, for the Scribe to apply on `grugops/ABC-176` (A5)

The SE does not edit `AGENTS.md` (Orchestrator ruling in the brief). Two exact replacements, each found once, measured
byte-exact on a copy of `AGENTS.md` at `01836fff` (15,606 B). The skip-count COMMAND does not change.

## 1. `Test (all)` comment, line 72 (`QE-173-f`: it quoted the wrapper without its prefix). +38 B
- BEFORE: ``- Test (all): `npm test` <!-- `node tools/grugops/run-bounded.js 60000 vitest run` (ABC-122).``
- AFTER:  ``- Test (all): `npm test` <!-- `NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run` (ABC-122).``

## 2. Skip-count comment, line 105 (the history pointer, option b). +153 B
- BEFORE: ``Undeterminable → `UNKNOWN - verify`, never a silent 0. -->``
- AFTER:  ``Undeterminable → `UNKNOWN - verify`, never a silent 0. Run it as spelled: quotes without its prefix (before ABC-173) are history; refused by the heap guard, they print no integer and exit non-zero (ABC-176). -->``

## Byte delta and pins (read on the copy, not on the branch)
- 15,606 B -> 15,797 B (+191 B), against `AGENTS_MD_BUDGET_BYTES = 18_432` (`ABC-187`; the page's 24,576 is superseded): 2,635 B headroom left.
- `ABC-173` `A3`: both edits sit inside HTML comments, which its parser strips. It counts 17 vitest commands before and after. No new backticked `npx vitest` text. No re-pin is needed.
- `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "ABC-109|ABC-173|ABC-176"` on the copy: 15 passed.
- The words "print no integer and exit non-zero" are the tip's measured behaviour (see the arms observation): jq exit 5 and empty stdout.
- A5 itself is read after the Scribe applies the text. It is NOT read here.
