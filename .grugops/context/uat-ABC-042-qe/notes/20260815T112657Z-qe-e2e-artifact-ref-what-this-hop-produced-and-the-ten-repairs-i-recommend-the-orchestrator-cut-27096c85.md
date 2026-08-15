---
id: 20260815T112657Z-qe-e2e-artifact-ref-what-this-hop-produced-and-the-ten-repairs-i-recommend-the-orchestrator-cut-27096c85
kind: artifact-ref
by: qe-e2e
at: 2026-08-15T11:26:57Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - agent-factory/workflows/06-uat-pack.md
  - .grugops/context/uat-ABC-042-2026-08-15/notes/20260815T105600Z-orchestrator-decision-uat-abc042-ordered-routing-and-the-row-that-does-not-move-97f07fc1.md
  - 20260815T112418Z-qe-e2e-observation-the-test-bar-re-run-by-my-own-hand-the-commands-the-numbers-and-the-machine-241149f7
  - 20260815T112500Z-qe-e2e-decision-scenario-to-test-map-seventeen-rows-four-backed-ten-partial-three-on-the-uat-run-alone-b6b7f3b4
  - 20260815T112612Z-qe-e2e-observation-the-uncriterioned-behaviours-and-two-one-word-mutations-the-suite-cannot-see-ecf312e9
supersedes: 
---

# What this subtask produced, and the repairs I RECOMMEND — the Orchestrator cuts, not me

## The artifacts

| note | kind | what it is |
|---|---|---|
| `…112418Z-…-241149f7` | `observation` | **The test bar, re-run by my own hand.** The three `AGENTS.md` command lines, the actual numbers, the machine, and the tree-identity proof |
| `…112500Z-…-b6b7f3b4` | `decision` | **The scenario → test map.** All seventeen rows by name; 4 backed / 10 partial / 3 on the UAT run alone; and every scenario whose backing is weaker than it claims |
| `…112612Z-…-ecf312e9` | `observation` | **The uncriterioned behaviours**, graded by whether a regression would go red, and **two one-word mutations that ship 856/856 green while breaking a scenario for a human** |

## The headline, in one paragraph

**Seventeen scenarios; four are fully backed by an automated test at their own command surface, ten
are partially backed, and three — UAT-3, UAT-8, UAT-13 — rest on the agent's UAT run alone.** The suite
is 856/856 on 30 files, 0 skipped, integrity clean, re-measured on a tree byte-identical to `main`; no
number disagrees with anything recorded in this repository. **The gaps are gaps in the SUITE, not
defects: every scenario passed and the delivered product is correct on every point examined.** The two
things worth the Orchestrator's attention are that **`--ascii` reaches the renderer through no
assertion at all** (M1) and that **`--colour` with no value takes an untested branch** (M2).

## What I recommend be cut — ten items, ordered, with their cost

**I recommend; I do not cut, and I wrote no test.** `agent-factory/workflows/06-uat-pack.md`'s stop
condition and this task's parent decision both reserve that to the Orchestrator.

**The cost column matters more than usual here.** `src/cli.test.ts` is the heaviest file either epic
adds; its ten children are pinned mechanically at `:777`, `N8-LANE` is ≤ 650 ms CPU, and the owner
personally ratified `N8-SPAWN` to let `ABC-042` merge. **Nine of the ten items below need ZERO new
spawns.**

| # | repair | closes | new spawns |
|---|---|---|---|
| **R1** | Assert that `--ascii` reaches the glyph mode — the cheapest form is a resolver assertion on the RESOLVED OPTIONS: `resolveOptions(["--ascii"]).options.flags` equals `{ ascii: true, unicode: false }` | **M1**, UAT-8 | **0** |
| **R2** | Widen `:359` from `.ok` to the resolved value for **every** accepted argv (`[]`, `--ascii`, `--unicode`, `--colour white\|black\|random`) — today the accepting path is checked only for the boolean `ok` | UAT-8, half of UAT-6 and UAT-7 | **0** |
| **R3** | Pin the two argvs with no deterministic coverage anywhere: **`["--colour"]`** (the `?? token` fallback branch) and **`["white"]`** | **M2**, UAT-10 rows d and f | **0** |
| **R4** | Assert the **usage line** — that a refusal writes it, and that its text names exactly `ACCEPTED_ARGUMENTS`. The refusal children are already captured, so this reuses them | the unasserted clause in UAT-9, UAT-10, UAT-12; and behaviour 4's other half | **0** |
| **R5** | Pin UAT-16's six game verbs (`--move`, `e4`, `--new`, `--undo`, `--resign`, `--quit`) as a deterministic resolver case list | UAT-16 — the pack's most load-bearing scenario | **0** |
| **R6** | Assert `AGENTS.md`'s documented option list against `ACCEPTED_ARGUMENTS` — the `Dev / run` line's text is already pinned at `:193`; its option list is not | UAT-14's second half | **0** |
| **R7** | Pin the frame's shape (23 rows, one trailing newline, zero `ESC [`) on the **non-default** children, not only on `npmRun`; and assert the **status rows** for the `black` and `random` children | UAT-5's status clause, UAT-6's status clause, behaviour 5 | **0** |
| **R8** | Record the repeated-option convention — **last one wins** — as a deliberate BA/PM ruling, then pin it or reject it. Today it is an accident nobody has decided | behaviour 3 | **0** |
| **R9** | **Documentation only (Scribe):** record the `--` separator in `AGENTS.md`'s `Dev / run` line, because `npm run chess --ascii` prints a board, exits 0 and silently discards the flag | behaviour 2 — the trap the pack had to warn its human reader about | **0** |
| **R10** | A **pty**-attached check: the terminal half of the glyph default, and UAT-12's *"the screen is not cleared"*. **This is the only item that costs a child**, so weigh it against `N8-SPAWN` — it may belong in the UAT pack as a permanent manual step rather than in the suite | behaviour 1's terminal half, UAT-12's terminal half | **1 (or 0 if kept manual)** |

**Two more, named so they are not lost, that are not test work:** the **Node 22 floor is exercised by
nobody** (`engines.node >= 22`; every run has been on v24.12.0), and **UAT-13's timing has no automated
backing by the ticket's own deliberate design** (`A11`) — that is a decision to re-affirm, not a gap to
fill.

## What is NOT here, deliberately

- **No `finding` kind and no `verified_by` stamp.** `context.human_admission` is `off`; a green suite
  is not a stamp.
- **No test file created, no test edited, no production line touched.** The two mutations lived in a
  copy of the tree outside the repository. The `src/` tree object on this branch still hashes to
  `main`'s.
- **No row written into `.grugops/test-skips.md`** — read, and the integrity check run against it, but
  it is human-owned.
- **No board move, no traceability row, no metrics row, no edit to `ABC-042`'s ticket page**, and
  nothing written under `.grugops/context/uat-ABC-042-pack/`. This hop wrote only this notes folder
  and its own queue records.
- **No ticket cut, and no defect raised** — none is owed: nothing failed. The ten items above are
  coverage repairs and they are recommendations.
- **No signature.** `ABC-042`'s UAT state after this hop is *pack built and run by an agent, all
  seventeen scenarios passed, coverage mapped and its gaps named, **NOT accepted*** — which is a
  different and lesser thing than accepted, and must not be recorded as the latter.
