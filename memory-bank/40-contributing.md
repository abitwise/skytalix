# Contributing
_Updated: <date>_

<!--
  FORMAT — read before you fill this in. (clear voice; this is a technical file, not a role prompt.)

  How to contribute and the conventions the project holds to. Ships EMPTY — fill per-project
  during bootstrap. Keep it short; point to longer docs rather than copying them in.
-->

## Getting set up

## Conventions

**Where QE files its verdict, and what the check on it proves (`ABC-105`).** QE's verdict note for ticket
`T` is a `kind: decision` note, authored `by: qe-e2e`, that names `T` in `refs:` (a bare id, a ticket path or
a note id). It sits in a context task folder that is not `T`'s own `ticket-to-pr-*` folder, and whose name
spells `T` as `ABC-xxx` or `abcxxx` (for example `qe-ABC-153`; `residual-G-QE115-5-*` spells `QE115` and is
not seen). `node tools/grugops/qe-hop-integrity.js --ticket ABC-xxx` checks for such a note before a row moves
into `Done`: the Orchestrator runs it at every move to `Done` (the practice from `ABC-105`, merged `f6400877`,
on). Exit 0 no finding, 1 a finding, 2 could not run; `--json` for machine output. `--sweep` reports on every
`Done` row after the 2026-08-17 cutover. A verdict filed as an
`observation`, or only in the ticket's own `ticket-to-pr-*` folder, does not count. The tool's
rule is not loosened to count it. **The presence of such a note is not proof that a QE hop ran.** `by:
qe-e2e` is self-declared metadata in a hand-authored file, and the tool has no signal from outside that
record. It is a completeness check on the record: it catches a verdict that was silently never filed, and it
does not catch a forged one. A pre-build QE note satisfies it as well as a post-build verdict does. QE's
pre-build re-check in `qe-recheck-ABC-105` already meets all four conditions for `ABC-105` itself. The tool
prints the covering note's path so that the human at the `Done` exit can see which note it was.

Moved from `AGENTS.md` § Commands (the QE-hop check's comment) by `ABC-164` (2026-10-21), word for word, comment delimiters
dropped:

exit 0 clean / 1 finding / 2 cannot run;
  `--json`. Orchestrator runs `--ticket` at every move to `Done`.

**No host path in the records; the check before each merge (`ABC-277`, 2026-11-03).** Nothing a branch adds under
`.grugops/`, `plans/` or `memory-bank/` may carry the home path, its slug form, a `/Users/<name>` path, the session scratch
path or a foreign process's argv; write the placeholders instead (the rule: `memory-bank/45-standing-rulings.md` §
Dated entries (2026-11-03)). The Orchestrator runs `node tools/grugops/records-path-check.js` on the branch before each
merge into `main` (from another checkout: `--head grugops/<task>`), beside the QE-hop check. It reads the branch's
committed diff against its merge base with `main` (`--base`): the added lines of text files, and the whole decompressed
content of each `.gz` the branch adds or changes; a pure rename adds nothing. Exit 0 clean, 1 a finding (the file, line
and class are printed, never the value), 2 cannot run (not a git repository, no merge base, bad argument). **A finding
blocks the merge** until the branch replaces the value with a placeholder in a new commit. Proof:
`node --test tools/grugops/records-path-check.proof.js` (outside the lane).

## Branch and review flow

## Definition of done
