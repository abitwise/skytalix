---
id: 20261010T092602Z-qe-e2e-observation-abc069-plants-six-red-four-green-781576a3
kind: observation
by: qe-e2e
at: 2026-10-10T09:26:02Z
verified_by:
confidence: high
refs:
  - ABC-069
  - ABC-065
  - ABC-067
  - ABC-071
  - N15
  - N16
  - AGENTS.md
  - src/cli.test.ts
  - 20261010T092602Z-qe-e2e-decision-abc069-verdict-pass-with-gaps-a12310aa
supersedes:
---

# `ABC-069`: the two written rules were planted against the live guard. 6 violations red, 4 honest edits green

**Where.** A scratch copy of the tip tree (`git archive 6ce9655`, with `node_modules` symlinked) in QE's
private scratchpad, not the worktree. Each plant rewrote only the copy's `AGENTS.md`. It was applied by
exact-string replacement that had to match exactly once. Each run was the WHOLE of `src/cli.test.ts`
(66 tests), the only test file that reads `AGENTS.md`. After each run the copy was restored and `cmp`'d
against the tip's bytes. The worktree was never planted; `git diff --quiet HEAD` holds there.
Control (no plant): exit 0, 66/66.

**Why re-plant, against the page's `## Test notes` 3.** The page says not to re-create `N15`/`N16`, and
`qe-ABC-069`'s task file says to plant them. QE followed the task. The deviation is cheap (≈1 min) and
earns its cost: `N15`/`N16` were measured before `ABC-071`/`ABC-067` changed the guard's window. These
runs are against the window that ships today.

| plant | edit (inside the slot unless stated) | rule | expected | result |
|---|---|---|---|---|
| `P1a` | backticks removed from `npm run chess -- --colour black` (the `N15` shape) | (1) | red | **red**: exit 1, 65/1, `ABC-065 A1` only: `documented token —` |
| `P1b` | closing backtick moved past `— the separator is load-bearing` (prose inside the fence) | (1) | red | **red**: `ABC-065 A1` only: `documented token —` |
| `P1c` | an unfenced `npm run chess -- then the option` mention placed before the fenced invocation | (1) | red | **red**: `ABC-065 A1` only: `documented token then`. The first separator form wins |
| `P2a` | `There is no \`--help\`.` appended in the slot (the `N16` shape) | (2) | red | **red**: `ABC-065 A3` only; collected set adds `--help` |
| `P2b` | the rule written with a forbidden example: `(never \`--verbose\`)` | (2) | red | **red**: `ABC-065 A3` only; adds `--verbose` (`## Test notes` 1's trap) |
| `P2c` | unfenced prose `--depth is not an option.` | (2) | red | **red**: `ABC-065 A3` only; adds `--depth` |
| `G1` | `--help`/`--version` denial written in its own list item AFTER the slot (rule 2's "elsewhere") | — | green | **green**: 66/66; collected set unchanged |
| `G2` | `For a plain terminal: \`npm run chess -- --ascii\`; the bare \`--\` belongs to npm.` added in the slot | — | green | **green**: 66/66; a second fenced invocation is safe; bare `--` 5 → 7, filtered |
| `G3` | invocation changed to `` `npm run chess -- --colour white --unicode` `` | — | green | **green**: 66/66; fenced `--colour white --unicode` resolves |
| `G4` | comment re-wrapped (line break moved, 2-space indent kept) | — | green | **green**: 66/66 |

Every red named the offending token in its failure line. That is the "diagnosable in one line" property
the page relies on, re-confirmed.

**Edge probes at the boundary of the written rules** (these feed the gap register `…8c2f6eb3`):

| probe | edit | result |
|---|---|---|
| `E1` | ` ---` appended in the slot (not an option, just a dash run) | **red** `ABC-065 A3`: collected `---` |
| `E2` | one wrapped comment line unindented so that it begins `- the guard reads…` | **red** ×4: `A1`, `A3`, `ABC-071`, `ABC-067` all fail on "slot comment does not close before the next list item" |
| `E3` | `load-bearing -- without it` (a bare `--` used as a dash) | **green** 66/66: the page's `## Test notes` 2 holds |

Scripts and raw JSON results are in QE's scratchpad and are not committed. The table above is the record.
