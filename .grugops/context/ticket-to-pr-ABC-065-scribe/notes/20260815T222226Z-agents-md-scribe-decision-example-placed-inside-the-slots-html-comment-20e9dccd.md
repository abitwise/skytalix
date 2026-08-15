---
id: 20260815T222226Z-agents-md-scribe-decision-example-placed-inside-the-slots-html-comment-20e9dccd
kind: decision
by: agents-md-scribe
at: 2026-08-15T22:22:26Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - src/cli.test.ts
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
supersedes: 
---

# Where the separator example went, and why it went INSIDE the HTML comment

## The decision

The invocation was appended **inside the existing HTML comment** on the `- Dev / run:` list item —
not as a new bullet, not as a line after the comment closes.

## Why

1. **`ABC-065` § Scope says "beside the option list", and the option list lives inside that
   comment.** Placing it beside the list means placing it in the comment.
2. **It is inside the slot under BOTH readings of the slot.** Test note 1 defines the slot
   mechanically as *"the text from the `- Dev / run:` list item to the end of its HTML comment"*. Text
   inside the comment is unambiguously within that span; text placed **after** the comment closes is
   outside it under the literal reading, and `A1`/`A3` would then be scored against a span that does
   not contain what I wrote. The guard block is somebody else's hop and I will not hand them an
   ambiguity to resolve.
3. **It matches existing style** (coding rule 11). Every verification annotation in § Commands —
   `Coverage`, `Skip-count capture`, `Test-integrity check`, `Build` — is an HTML comment on its
   bullet. A bare prose line would be the odd one out.
4. **`AGENTS.md` is read raw.** Its audience is agents reading the file as text, per § How to work
   here; the HTML comment is not hidden from them.

## `A2` was checked, not assumed

`ABC-065` `A2` and the subtask both fence `src/cli.test.ts:193-204` as byte-identical, which requires
the substring ``- Dev / run: `npm run chess` `` to survive. **It did: the list item's first line is
untouched, byte for byte.** Every character I added lands after `ABC-043.` inside the comment.
Measured after the edit: `grep -c -- '- Dev / run: \`npm run chess\`' AGENTS.md` → **1**. No wording
I wanted required that literal to move, so the ticket's STOP-and-route condition was never reached.

## What I deliberately did NOT do

- **No second option was invented.** The example uses `--colour black`; `--colour`, `black` and the
  other four tokens of `ACCEPTED_ARGUMENTS` (`src/cli-options.ts:46-53`) are the only vocabulary in
  the slot, so `A3`'s set equality is not broken by a stray flag of mine.
- **`npx` is not mentioned.** § Out of scope forbids it; `ADR-0007` clause 5 leaves distribution open.
- **Nothing else in the file moved** — not the deployment posture, not the four `UNKNOWN - verify`
  slots, not § Process rules, not § Stack. One slot, as instructed.
- **No test was written.** That is the other half of `ABC-065`, scheduled after `ABC-066` lands. This
  ticket does not close on my hop and I made no board or traceability edit.

## Size

`AGENTS.md` is **21 638 bytes** after the edit — comfortably under the 32 KiB Codex cap the role file
names. The Scribe's "remove as much as you add" rule is why the addition is five lines and not a
section: I added the shortest text that carries the form, the proof it was run, and the reason not to
delete it.
