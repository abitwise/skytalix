---
id: 20260817T161800Z-software-engineer-artifact-ref-abc064-branch-and-its-three-commits-d53706c9
kind: artifact-ref
by: software-engineer
at: 2026-08-17T16:18:00Z
verified_by:
confidence: high
refs:
  - ABC-064
  - src/cli.test.ts
  - plans/tickets/ABC-064-frame-shape-and-status-rows-on-non-default-children.md
supersedes:
---

# `ABC-064` — the branch and its three commits

Branch **`grugops/abc064-frame-shape-non-default-children`**, off `main` @ `1a806ee`. **Unmerged**;
there is no git remote, so nothing is pushed and no PR exists (`AGENTS.md` § "Branching model" —
`autonomy: "pr"` has always meant "branch + gate" here).

| # | commit | paths | why separate |
| --- | --- | --- | --- |
| 1 | `9957ddf` `test(cli-test): grug assert frame shape and status rows on the three non-default children` | `src/cli.test.ts` **only** (+121) | **This is what `A5` measures.** One path, per delivered commit. |
| 2 | `de38f85` `docs(ticket): grug correct ABC-064's eight stale line anchors, measured at 1a806ee` | the ticket page | Folding it into commit 1 would break the very criterion it serves. |
| 3 | this note's commit | `.grugops/context/ticket-to-pr-ABC-064-2026-08-17/notes/` | Workflow 16. |

## What commit 1 contains

One `describe` appended at the end of `src/cli.test.ts` — `ABC-064 — the frame's shape and the status
panel, on the three non-default children` — holding **four `it` blocks, one per property** (`##
Test notes` 4), each looping over the children and naming the child in its message:

- `A1` row count + exactly one newline after the last row, over all three children;
- `A2` zero CSI introducers, over all three;
- `A3` status rows byte-identical to the default child's, over `black` and `random`;
- `A4` zero occurrences of `random` over the whole of the `random` child's stdout.

Plus two block-local helpers: the `NON_DEFAULT` table (child → glyph mode → admissible orientations)
and `statusRowsIn`, which LOCATES the status region by the board region's height rather than by a
written offset.

## What commit 2 contains

Eight `:NNN` citations across five distinct anchors, all re-read before being written:
`:162`→`:244`, `:226`→`:308`, `:274`→`:356`, `:780`→`:933`, and test note 4's `:186`→the rank loop at
`:266`-`:270`. Plus a dated blockquote on the page saying they were corrected, against which commit
they were measured, and that no criterion was re-worded, struck or added.

## Queue

Claimed by hand per `AGENTS.md`: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc064-frame-shape-non-default-children`. The claim directory is still in
place; moving the brief from `pending/` to `done/` is the Orchestrator's.
