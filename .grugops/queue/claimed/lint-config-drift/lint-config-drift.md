---
task: hygiene-2026-08-16
subtask: lint-config-drift
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/lint-config-drift/
parent_ref: .grugops/context/hygiene-2026-08-16/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T21:10:00Z
branch: grugops/lint-config-drift
base: main @ TIP — branch by NAME, not by sha
---

# Subtask: the two lint diagnostics the owner sees are both about `biome.json`, and the gate has been green the whole time

## Read the parent note first — do not re-measure what is already measured

`parent_ref:` holds one `observation` note with every exit code taken by hand at `c732fe2`.
**Do not re-derive it.** The short form, so you can check the note rather than trust this file:
`npm run lint` exits **0**; `npm run typecheck` exits **0**; `npm test` exits **0** at 856/856
over 30 files. `biome check .` prints `Found 2 infos.` — and Biome does not fail on `info`.

**The owner reported "linter has few errors". There are none.** What exists is two `info`
diagnostics, both pointing at `biome.json` itself, neither at a line of source. Say so plainly in
your notes; do not quietly fix them as though they were the errors he described.

## The two diagnostics

1. **`biome.json:2:14` — schema/CLI version drift.** `"$schema"` names `2.3.0`; the installed CLI
   is **2.5.5**. `devDependencies` pins `"@biomejs/biome": "^2.3.0"`, which admits 2.5.5 — the
   drift arrived by an ordinary caret resolve, not an edit. Biome names its own remedy:
   `biome migrate`.
2. **`biome.json:12:13` — `linter.rules.recommended` is DEPRECATED**, "will be removed in the next
   major version of Biome"; use `preset`. This is a dated fuse: the next major breaks the config.

## Acceptance — verifiable, and the third one is the one that matters

- **A1.** `npm run lint` exits `0` **and its output contains zero `infos` and zero diagnostics** —
  i.e. the line reads `Found 0 infos`/no findings block, not `Found 2 infos`. Paste the real
  output into a note.
- **A2.** `npm run typecheck` exits `0` and `npm test` is **856/856 over 30 files** — the same
  numbers as before your diff, not merely "green". A changed test count means the lint config
  moved something it had no business moving; stop and report it.
- **A3. THE RULE SET DID NOT SILENTLY CHANGE.** `recommended` → `preset` is a rule-set edit
  wearing a rename's clothes. **Before and after your diff, capture the enabled-rule set**
  (`npx biome explain` / `biome check --verbose` / `biome rage` — find the one that actually
  reports it on 2.5.5; if none does, say `UNKNOWN - verify` and record what you tried) and state
  in a note whether the set is identical. If it is NOT identical, that is a finding to report —
  **it is not a licence to edit source.**
- **A4.** If the migration surfaces NEW findings in `src/**`, **do not fix them.** Coding rules 9,
  10 and 12 bind: preserve adjacent code, do not refactor working code, flag don't delete. Record
  each one, leave the source untouched, and report — the Orchestrator will route them to a ticket.
- **A5.** The diff is `biome.json` and, only if the migration requires it, `package.json`'s biome
  pin. **Zero lines under `src/`.** State the file list and the line count in a note.

## Scope fence

- **`biome.json` is yours for this hop.** Nothing else in the repo is.
- Do not "improve" the formatter block, the `files.includes` globs, or any rule that is not one of
  the two diagnostics above. `includes` is `["src/**/*.ts", "spike/**/*.ts", "*.json"]` and it
  stays that way — 54 files are checked today and 54 should be checked after.
- Do not upgrade, add or remove a dependency to make this easier. If `biome migrate` wants a
  version bump to succeed, **stop and report** rather than taking it.
- Do not touch `plans/`, `memory-bank/`, `AGENTS.md`, or the board. The Orchestrator owns those
  this hop, and it is concurrently merging two branches into `main`.

## How to work — the constraints this repository actually has

- **Claim by hand.** `scripts/claim.js` does not exist here or in the kit. `mkdir -p
  .grugops/queue/claimed` for the parent, then a **bare** `mkdir` (no `-p`) of
  `.grugops/queue/claimed/lint-config-drift/` — that bare `mkdir` is the atomic act; `EEXIST`
  means you lost the claim. Write `claim.md` inside it. Then `git mv` this file from `pending/`
  to `claimed/lint-config-drift/`. This is stated so you do not re-derive it; `AGENTS.md`
  § Role / workflow files is the authority.
- **No `finding` is admissible on this install.** `context.human_admission` is `off` and
  `scripts/context-io.ts` is absent, so no `§14-gate#<id>` stamp can be emitted. Record results as
  `claim` / `observation` / `decision` / `artifact-ref`, hand-authored per
  `agent-factory/contracts/context-note.md`, under `.grugops/context/lint-config-drift/notes/`.
  **Do not invent a stamp.**
- **Use your own `git worktree`** (e.g. `../cli-chess-lintcfg`) branched from `main` by NAME. The
  main worktree's `HEAD` is moving under a concurrent Orchestrator merge hop — do not check out a
  branch there.
- **Commit on `grugops/lint-config-drift`, never on `main`. Do not merge.** The Orchestrator takes
  the merge at the close of this hop, after re-running the gate on your tip.
- Stage **explicit paths only**. Never `git add -A`.

## Report back

Your final message must state, in this order: the file list and line count of your diff; the real
`npm run lint` output after it; the before/after rule-set answer from A3 (including
`UNKNOWN - verify` if that is the honest one); any new `src/**` findings you left untouched; and
the note filenames you wrote.
