---
task: gate-abc041-2026-08-13
subtask: refinement-ABC-041-a4
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-041-a4/
parent_ref: .grugops/context/quality-gate-ABC-041/
also_read: .grugops/context/ticket-to-pr-ABC-041/, .grugops/context/security-nfr-ABC-041/
ticket: plans/tickets/ABC-041-render-seam-closure.md
enqueued_by: orchestrator
enqueued_at: 2026-08-13T22:05:00Z
branch: grugops/refinement-ABC-041-a4
worktree: ../cli-chess-bapm041
base: grugops/quality-gate-ABC-041 @ 1d67f8f
---

# Subtask: repair `A4`. You wrote it, the gate refuted it, and the code is FINE — it is the criterion that is broken.

`ABC-041` is **`BLOCKED_NEEDS_FIX`** and you own the blocker. Read `parent_ref:` (QE, 5 notes) first,
then `also_read:` (the build's 5 and Security's 5, plus my 3 entry-review notes under
`ticket-to-pr-ABC-041`). **Eighteen notes. Do not re-derive any of it.**

## The state, verified by the Orchestrator — not taken from any agent

`src/render-seam.ts` is **correct and untouched by the gate**. Every mandatory gate is green on the QE
tip: lint 0, typecheck 0, build 0, **828/828 on 29 files**, skip 0, test-integrity exit 0. **No code
work is owed.** `ABC-041` stays in `In Review` — it was NOT moved backward, because a backward move
here would be false and would corrupt the very control `AGENTS.md` rule 1 is measured by.

## The blocker

**`A4` cannot be satisfied by any build on this tree, and its stated purpose is false.** Both halves
are the gate's, both are evidenced in `parent_ref:`, and I independently confirmed the mechanism
myself (`src/frame.ts:204` — `assembleFrame` pads every row with `padEnd(width)`, so the frame's board
region is always `renderBoard`'s rows *plus trailing blanks*).

**There is a contradiction between two notes and you must rule on it, not average it.** The Engineer
recorded that its substitute is *"strictly stronger"*. QE refuted that: `A4` as written rejects every
build, so nothing can be stronger than it — **the build the literal criterion kills and the substitute
admits is the delivered one**. Read both and rule. The Engineer's *premise* is sound; its
*characterisation* is what QE killed.

## What the repair must survive

`A4`'s purpose clause says *"byte-equality against the merged renderer is what forbids a second board
implementation."* **QE built that second implementation — `renderBoard`'s algorithm copied into its own
module — and it ships 824/824 green with `tsc` exit 0 and `renderBoard` never called.** So do not
re-word `A4` around a property byte-equality does not have. If forbidding a second implementation is
still wanted, it needs a different instrument and that is Architect/Design's, not a wording fix.

## Also yours on this page (gaps, not blockers — the delivered build satisfies all three honestly)

- **`A3`'s "no row-count literal"** is a no-digit grep; `23` written as a string length evades it.
- **`A6`'s `process.` check** is a substring grep; `globalThis["process"]` evades it.
- **The scope mismatch behind both**: the criteria say *"over the diff"*, the instruments read one
  **file** — so both are evaded outright by moving the text one module away.
- **Security/NFR's four-clause threshold repair is drafted and homed to you** (in
  `security-nfr-ABC-041`). Its finding is sharper than the Engineer's: the trigger's predicate was
  **already true of `main`**, so it measured the repo rather than the change. Note that the real
  invariant — 0 of 47 production files import a builtin — **breaks at `ABC-042`, which spawns.**

## Cut, do not fold, these follow-ups

Four items are homed elsewhere and must NOT be smuggled into this page: two Architect/Design rulings
(the probe's load-time reach vs `NFR-002`'s per-frame claim; the inline-type-specifier blind spot that
makes `A8` a false green and the merged licence guard a false red — one ruling); the board's **three
missing column headings** (`In Analysis`, `In Design`, `Ready for Dev` — my note under
`ticket-to-pr-ABC-041`); and **`AR-1`'s drift** (owner Release Manager — `nanoid`/`postcss` are outside
its stated reason). Cut tickets, sized and prioritised. **The ≤300-line prose budget applies to
anything you cut.**

## Hard limits

- Commit on `grugops/refinement-ABC-041-a4` in `../cli-chess-bapm041` only. **Never `main`, never any
  other agent's branch.** `node_modules` is symlinked; **remove the symlink before you finish.**
- **Do not touch `src/`.** Not the module, not the test file. The test change that follows your new
  wording is the Engineer's next hop, and it must be written against YOUR text, not ahead of it.
- Record under `ref:` as `claim` / `observation` / `decision` / `artifact-ref`. **No `finding` is
  admissible on this install**; never invent a `§14-gate#<id>` stamp.
- **Do not merge, do not deploy.** Do not re-score DoR — this ticket is in flight, not being pulled.

## Stop condition

If the honest repair of `A4` changes what the module must **do** rather than what the ticket must
**say**, stop and say so. That would make this a scope change on merged-adjacent work, and it is mine
to sequence, not yours to absorb.
