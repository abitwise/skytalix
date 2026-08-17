---
task: ticket-to-pr-ABC-064-2026-08-17
subtask: abc064-frame-shape-non-default-children
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-064-frame-shape-and-status-rows-on-non-default-children.md
ref: .grugops/context/ticket-to-pr-ABC-064-2026-08-17/
parent_ref: .grugops/context/sweep-ABC-063-064-2026-08-17/
enqueued_by: orchestrator
enqueued_at: 2026-08-17T16:02:00Z
branch: grugops/abc064-frame-shape-non-default-children
base: main @ 6aedb7e
---

# Subtask: `ABC-064` — the frame's shape and the status panel, on the three non-default children

Read `ticket:` for the work. Read the ONE `observation` note in `parent_ref:` before you open the
file — it is my `Ready for Dev` exit criteria review and it carries **first-hand measurements**, not
readings. Take them as given; do not re-derive them.

## What that note already settled

1. **No criterion of this ticket is already satisfied.** I read the tree myself: the byte-exact frame
   tail (with the eight named ranks) and the append-strategy block (zero `ESC [`, exactly one
   trailing newline) **both run on `CHILDREN.npmRun` alone**, and the per-colour block compares
   `boardRegionOf(...)`-length **prefixes only** for `white`, `black` and `random`. No non-default
   child has its row count, trailing newline, cursor-control absence or status rows asserted
   anywhere. **`A1`'s `0 of 3`, `A2`'s `0 of 3` and `A3`'s `0 of 2` all stand.**
2. **Every `:NNN` anchor on the page is STALE.** Corrected, measured — but note the file has grown
   again since (`ABC-063` merged at `6aedb7e`, +63 lines appended at the END, so these hold):
   - `:162` → **`:244`** (the byte-exact tail + the eight ranks, on `npmRun`)
   - `:226` → **`:308`** (the append strategy — zero `ESC [`, exactly one trailing newline)
   - `:274` → **`:356`** (the per-colour board-region comparison for the three children)
   - `:186` (test note 4's "names the child in the assertion message") → the rank loop at
     **`:266`–`:270`**
   - `:780` (the `spawned` pin) → **`:933`**
   **Re-verify each by reading the line before you cite it. Do not trust this table blindly and do
   not guess an anchor you cannot resolve** — say so instead. The `ABC-063` hop resolved its one
   unresolved anchor by reading `git show 56c5cea:src/cli.test.ts`; that technique works and is
   available to you.

## `A3` is the one that needs a MEASUREMENT before it is an assertion

The ticket says so and it is the most important instruction on the page: *"the claim 'colour changes
orientation only' is derived from the merged status panel's contract, not from a reading of the
`black` child. **If the delivered rows differ, stop and report**."*

Measure it first. **If the `black` or `random` status rows are NOT byte-identical to the default
child's, that is a RESULT you report to me — not a criterion you soften.** A criterion bent to fit an
unexpected measurement is the exact defect this whole follow-up set exists to prevent. I would rather
this ticket come back with `A3` unmet and a real finding than come back green and wrong.

## The commit-sequencing trap

`A5` requires `git diff --name-only <delivered>~1 <delivered>` to show **exactly**
`src/cli.test.ts`. It is worded **per delivered commit**, not per branch. So:

- **Commit 1 (the delivery): `src/cli.test.ts` and nothing else.** This is what `A5` measures.
- **Commit 2 (separate, same branch): the ticket page's anchor corrections**, with a dated line
  saying they were corrected and against which commit they were measured.
- **Commit 3: your Workflow 16 notes.**

## Fences

- **Zero production lines.** `src/cli.test.ts`, the ticket page, and your notes. Nothing else.
- **Zero new child processes.** All three children are already spawned at module scope; `spawned`
  stays **10** (`:933`). An eleventh is a defect.
- **`:244`, `:308`, `:356` byte-identical.** `ABC-042`'s `A1`, `A7`, `A8` keep their exact
  instruments; your assertions are separately named blocks over the same captured children.
- **No row-count literal.** Derive the expectation from the reference frame the file already
  composes per (glyph mode, orientation). Note that `CHILDREN.white` carries `--unicode` by design
  and the other two are `ascii` — the mode differs per child.
- **No pty.** Piped children only.
- **One block per property, not one per child** (test note 4) — name the child in the assertion
  message, as the rank loop already does.
- **`A4` must be asserted over the WHOLE of stdout**, not the board region — `random` could only
  appear in the status or message rows, which is precisely the region the existing block skips.
- **Do not re-open `ABC-042`, `ABC-061`, `ABC-062`, `ABC-063` or `ABC-066`.** All merged.
- **The twelve blank move-list rows are out of scope** — that is the pack's `B7`.

## Gate

`quality.gate_enforcement` is `blocking`. On the branch tip run `npm test`, `npm run lint`,
`npm run typecheck`, `npm run build`, and
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` with `<N>` from
the reporter. **Do not merge** — I hold the merge and re-run the gate on `main` after.

Report the real numbers: suite result and file count, skip count, integrity output, the four exit
codes, `spawned`, and for each of `A1`/`A2`/`A3`/`A4` the count met out of the count required
(`3 of 3`, `3 of 3`, `2 of 2`, and `random`'s zero occurrences). Say which anchors you re-verified
and which you could not.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `claim` / `observation` / `decision` / `artifact-ref`,
hand-authored per `agent-factory/contracts/context-note.md`. Take the claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/abc064-frame-shape-non-default-children`.

Commit on `grugops/abc064-frame-shape-non-default-children`, never on `main`.
