---
task: ticket-to-pr-ABC-018
subtask: engineer-abc018-implement
role: software-engineer
claimed_at: 2026-08-09T08:45:11Z
claimed_by: software-engineer
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has **no `scripts/` directory at all** — re-checked at the source
rather than taken from the subtask file or from any prior note: `ls scripts` returns `No such file or
directory` in the repo, and `ls /Users/olgeroeselg/.grugops/agent-factory/scripts` returns the same
in the kit (whose top level is `_commit-convention.md`, `checklists/`, `config/`, `contracts/`,
`examples/`, `handoffs/`, `packaging/`, `README.md`, `roles/`, `seed/`, `VERSION`, `workflows/` —
no `scripts/`). So there is no `scripts/claim.js` and Workflow 17 step 2's atomic `claimTask` could
not be executed. The claim directory was created with a plain `mkdir` (still atomic, still `EEXIST`
on a second writer — `mkdir` exited 0, so this claim is the first) and this registry record written
into it; `pending/…md` → `claimed/…/…md` was a plain `mv` (atomic rename). Queue width is 1 and
`claimed/` was empty at the start, so no contention was possible and the claim is degenerate.
Recorded rather than glossed, exactly as every prior subtask on this board recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-018/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`. **No `finding` is written — none is admissible on this
task, because there is no §14 gate here to issue a `§14-gate#<id>` stamp and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

## Read before acting

`.grugops/context/ticket-to-pr-ABC-018/notes/` holds **five** notes and all five were read in full
at the source before any code was written:
`20260809T081615Z-orchestrator-decision-046a7d60` (the routing decision, the substrate ruling, the
`NFR-002` quoting rule), `20260809T083236Z-ba-pm-observation-f8026fb2` (the neutral facts: no width
anywhere in `src/`, `23`'s source, the sibling panels' constants),
`20260809T084500Z-ba-pm-decision-53b4877d` (the five corrections and their rejected alternatives),
`20260809T084800Z-ba-pm-claim-d45d16a4` (what the promotion does NOT establish — read, and its item
5 is why no existing number was quoted for `NFR-002`'s write half), and
`20260809T083704Z-orchestrator-decision-215adfeb` (the Definition-of-Ready gate at the pull, and the
open prompt-row cross-ticket obligation).

Then, and deliberately NOT on their authority:
`plans/tickets/ABC-018-frame-output-and-redraw.md` line by line including the correction block under
`## Acceptance`; `AGENTS.md` (commands, the 12 coding rules, the branching model);
`.grugops/factory.config.json` (`quality.mandatory_gates`, `gate_enforcement`, `self_fix_attempts`,
`tdd`, WIP limits); `memory-bank/00-index.md`; `plans/board.md` (`Columns`, `In Development`,
`In Review`); `plans/traceability.md` (row `ABC-018`); `plans/nfr-catalog.md` (`NFR-002`'s section
and its 2026-07-30 correction); and **merged code on this branch's base** — `src/render.ts`
(`renderBoard`, the 9x18 geometry) and `src/glyph-mode.ts` (`selectGlyphMode` /
`beginGlyphModeSession`, the `GlyphMode` seam `RISK-005`'s build obligation names), plus
`src/render.test.ts` for the suite's existing style.

---
completed_at: 2026-08-09T09:10:00Z
outcome: IMPLEMENTED AND MOVED In Development -> In Review — ABC-018 built on branch
  grugops/ticket-to-pr-ABC-018 in TWO new files (src/frame.ts, 222 lines / 94 of them code, and
  src/frame.test.ts, 20 tests) with NOT ONE existing file under src/ touched: `git diff --numstat
  main -- src/` is EMPTY, verified rather than asserted. In Development 1/3 -> 0/3, In Review
  0/3 -> 1/3; no limit approached, no override taken, no written reason owed.

  GATES AS THEY RAN, never a gate that was not run: npm install exit 0 (no dependency change,
  package-lock untouched); npm run lint exit 1 then exit 0 after ONE safe autofix pass on the one
  file (`npx biome check --write src/frame.test.ts` — import ORDER and formatting only, no rule
  violation; lint.autofix is true; self-fix attempt 1 of 2, the second not needed); npm run
  typecheck exit 0; npm test exit 0 at 297/297 on 14 files (277 on 13 BEFORE, MEASURED by running
  the suite without this file rather than subtracted); npm run build exit 0. Skip count 0 by the
  AGENTS.md command. E2E: UNKNOWN - verify (slot unknown, no UI surface, no runnable game until
  EPIC-006). Test-integrity checker: exit 2, "cannot read the registry file" — the checker COULD
  NOT RUN, recorded as an ERROR and NOT as a pass, and NO registry file was created. Auto-UAT
  oracles: UNKNOWN - verify (scripts/check-uat-oracles.js absent). src/frame.ts at 100% on all
  four coverage axes.

  RISK-005's BUILD OBLIGATION DISCHARGED AND CHECKED MECHANICALLY: the glyph mode is a required
  parameter with NO default; src/frame.ts imports exactly one thing (`import type { GlyphMode }`,
  erased at runtime); `process.` appears only in prose; the only isTTY/rows reads are of the
  INJECTED SINK; the only mode literal is the `mode === "ascii"` comparison inside the sanitizer.

  NFR-002 BOTH HALVES MEASURED SEPARATELY, WITH THE MACHINE AND THE PLY COUNT, AND NO NUMBER
  QUOTED FROM ANY EXISTING NOTE — the write half's first measurement ever. Apple M3 (Mac15,13) /
  Node v24.12.0 / Darwin 25.5.0 arm64, UNKNOWN - verify elsewhere; two independent samples; a
  23-row, 18-column, 418-character frame at 40/120/300 real plies. Compute 5.97-6.07 us; write
  0.64-0.65 us in-memory, 1.66-1.67 us to /dev/null, 2.43-2.48 us to a file. SUM 0.0084-0.0092 ms
  against the 16 ms bar — MET. The compute half is labelled a LOWER BOUND (two panels are stubs).

  18 MUTANTS RUN, ALL 18 KILLED, tree byte-identical after (md5 bb827f52fe537817e40020a29dfa0e6d).
  TWO of them SURVIVED THE SUITE AS FIRST WRITTEN and the SUITE was fixed, not the record: no
  acceptance criterion constructs a sink whose isTTY or rows is ABSENT, which is the real shape
  Node presents on a pipe. That is a gap in the CRITERIA, it is open, and it is handed to QE and
  BA/PM.

  FIVE STRUCTURAL CHOICES THE TICKET LEFT OPEN ARE DECIDED with their rejected alternatives named
  (W from the panel rows only; every row but the reserved prompt row padded to W; the packing
  search downward because N and the marker are coupled; the sanitizer over every string placed
  into the frame; widths in UTF-16 units).

  FIVE NOTES PUBLISHED, hand-written in the contract's exact shape, no `finding` among them (none
  is admissible on this task) and nothing self-stamped:
  20260809T090500Z-software-engineer-artifact-ref-f0614850,
  20260809T090600Z-software-engineer-decision-176a65c3,
  20260809T090700Z-software-engineer-observation-6b72e200,
  20260809T090800Z-software-engineer-observation-2bfbf80e,
  20260809T090900Z-software-engineer-claim-80508934.

  NOT DONE, DELIBERATELY: no panel content, no render trigger, no prompt text or input, no argv,
  no resize handling, no colour, no edit to any existing src/ file, no edit to plans/nfr-catalog.md
  (the Security/NFR gate owns that row), no index.md / index.jsonl hand-faked, and no wall-clock
  assertion anywhere in the suite. NOTHING MERGED, NOTHING DEPLOYED — a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-018-dev/ -> done/ticket-to-pr-ABC-018-dev/ — ALL BY HAND
  (no scripts/claim.js in this install or in the kit; the claim dir was created with a plain mkdir,
  still atomic and still EEXIST on a second writer).
