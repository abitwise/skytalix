---
id: 20261010T132830Z-software-engineer-decision-abc059-span-rule-command-read-floors-not-counts-084a3e0b
kind: decision
by: software-engineer
at: 2026-10-10T13:28:30Z
verified_by:
confidence: high
refs:
  - ABC-059
  - ABC-042
  - ABC-065
  - ABC-087
  - ABC-133
  - Q13
  - AR-058-STRIP
  - N8-SPAWN
  - src/cli.test.ts
  - 20261010T105420Z-ba-pm-decision-eight-august-pages-five-ready-one-drop-4fdfe525
supersedes:
---

# `ABC-059` build decisions: a terminator is punctuation followed by a space, the command is read from `ENTRY_POINT`, (ii) checks every `npm run` it names, and the test asserts floors rather than counts

Hand-authored and unsealed: no `finding` is admissible on this install (`AGENTS.md`). The page is
the contract, and these are the choices it left open.

1. **The sentence terminator is `.`, `!` or `?` followed by a space or the end of the text.** This
   applies to the whitespace-collapsed string.
   - BA/PM's probe (`rescore-batch-2-2026-10-10/probe/dev-run-spans.py`) ended a span at any `.`.
     That cuts the third span inside `src/cli.ts` (`…it runs \`src/cli.`).
   - The same cut makes a guard blind. Take a claim like `` `Dev / run` (see src/cli.ts) is
     `UNKNOWN - verify`. `` The span would end before the phrase.
   - The counts are unchanged under either rule: 3 occurrences, 0/3, 2/2 (`probe/spans.out.txt`).
     Only the third span's end moves, to `…from source, in place.`.
2. **The command is read, and both of its halves are derived.** The entry path is
   `ENTRY_POINT.slice(REPOSITORY.length)`, which is `src/cli.ts`. Both constants already exist in the
   file.
   - The script is the one `package.json` key whose whitespace-split value contains that path. The
     test asserts that exactly one key qualifies.
   - Neither `chess` nor `src/cli.ts` is spelled as a new literal (`A4`).
3. **Two readings of `A1`(ii) were possible, and the stricter one was taken.**
   - The loose reading: a span containing `npm run ` must contain `npm run <name>`. That is the
     probe's `in`.
   - The strict reading, the one built: every `npm run <word>` in the span (`/npm run [\w:-]*/g`)
     must equal `npm run <name>`.
   - Under the loose reading, a span naming both the right command and a wrong one would pass. On
     today's file the two readings agree: each command span names one command.
4. **The test asserts floors, not the measured counts.** The floors are at least 1 occurrence and
   at least 1 span naming the command.
   - The 3 / 0-of-3 / 2-of-2 / 8 figures are measurements at the base, recorded here and in the
     observation. They are not pins.
   - Pinning them would red on the next Scribe edit that adds a pointer. A guard that reads the
     fact and not a count is what `A1` and the subtask ask for.
   - The verdict is `toEqual([])` over the disagreeing spans, so a failure prints the span.
5. **`A2` is exercised in memory, and also on disk.** In memory, the exact `Q13` sentence, line
   break included (from `bf685784~1:AGENTS.md:184-185`), is inserted at three offsets: the head, the
   first blank line after the midpoint, and the tail. Each insertion must yield exactly one
   disagreeing span.
   - One more mutant witnesses `(ii)`: `replaceAll(command, npm run <another script>)` must make
     every command span disagree. The other script is read from `package.json` too.
   - On disk, out of tree, six mutants were run before and after (observation `…53346fff`).
6. **Shape and placement.** There is one `describe` named for the ticket and one `it`.
   - It is placed directly after `ABC-065`'s `describe` (test note 3), and nothing is reused from
     that block's slot locator.
   - The docblock records what the guard is for and why it must stay neither a substring test nor
     a per-line check.
   - It adds no spawn and no import. The diff is +76/−0 in one hunk.
7. **`AR-058-STRIP` did not fire.** No added non-comment line contains `//` or `/*`, and no
   `node:child_process` import form was added (`probe/a5-a6.out.txt`). The trigger that would
   promote `ABC-133` to P1 is not met. Its scope, the spawn pin's view, was not touched.
8. **Commit split, as for `ABC-058`.** The code commit `14c940ff` touches `src/cli.test.ts` alone,
   so `A6`'s `git diff --name-only <delivered>~1 <delivered>` is one path. The notes, trace and the
   ticket's § Delivery are in a second, docs-only commit.
