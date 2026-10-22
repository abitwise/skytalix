---
id: 20261022T193034Z-software-engineer-decision-11628f2f
kind: decision
by: software-engineer
at: 2026-10-22T19:30:34Z
verified_by: 
confidence: high (built and gated at the tip; the one deviation in form is stated with its reason)
refs:
  - ABC-200
  - EPIC-006
  - G6
  - ABC-037
  - ABC-178
  - ADR-0009
  - ADR-0011
  - ADR-0015
  - ADR-0016
  - ADR-0036
  - ADR-0042
  - ADR-0044
  - ADR-0045
  - NFR-007
  - NFR-008
  - bd745ac9
  - 1efd2cee
  - 20261022T191404Z-architect-design-decision-f612277c
  - 20261022T191359Z-architect-design-observation-0d7cbff3
  - 20261022T185856Z-ba-pm-decision-2fddb7fa
  - 20261022T191000Z-orchestrator-decision-de0099fa
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - 20261022T193009Z-software-engineer-observation-f274160a
  - 20261022T193009Z-software-engineer-observation-3ccb839a
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
supersedes: 
seal: sha256:137296134935c62ced442bc60c949a3f92e346a11f92543f561cc040e0a5762d
---

# ABC-200 built inside the Architect's ruling: no STOP, no ADR touched, no criterion moved. One deviation in form, recorded: an empty answer keeps the parsed flag-less value rather than re-importing the default

Software Engineer, task `ticket-to-pr-ABC-200`, 2026-10-22. Branch `grugops/ABC-200`, worktree `../wt-ABC-200`, from `main` `bd745ac9`. Code `1efd2cee`; this note's commit is the tip. Not pushed, not merged. Readings: `…f274160a` (criteria, red-first, plants) and `…3ccb839a` (gates).

## Decisions
1. **No STOP.** Every change is one the ruling names (R1–R6). No ADR is new, changed or reversed; no acceptance criterion moved; no file outside the Build notes' list was touched (no `package*.json`, `tools/`, `AGENTS.md`, board or trace).
2. **The empty answer keeps `parsed.options`' value, which is the flag-less default.** The question is asked only when its flag was absent, and then `resolveOptions` has already set `white` (no coin) and `DEFAULT_DIFFICULTY`. Reading it from there spells neither default a second time, which is the ruling's intent ("imported and never re-spelled"); it does not import `DEFAULT_DIFFICULTY` by name. `P2` reds `A2` either way. If the Architect wants the literal import, it is a two-line change.
3. **`line-input.ts` imports from `./line-reader.ts` once** (`lineReaderOf`, `MAX_LINE_LENGTH`, `type LineSource`) and re-exports the two by an export list, so its import-set row gains exactly one specifier.
4. **`startup-questions.ts` has one runtime export,** `askAbsentOptions`. Its output type is module-private; the source type is `LineSource & { readonly isTTY?: boolean }` inline. `absent` on `Resolution`'s ok branch is an inline type, as ruled; `AbsentFlags` was briefly a named export and was inlined before the commit.
5. **The question and rejection texts** are `colour (white|black|random) [white]: `, `difficulty (1|2|3|4|5) [5]: ` and `"<echo>" is not one of <accepted>\n`, built from `COLOUR_VALUES` / `DIFFICULTY_VALUES` and the parsed defaults. The questions carry no newline; the terminal echoes the user's Enter.
6. **`cli.ts` header** gains one `ABC-200` paragraph and its handles paragraph now says `process.stdin` goes to the seam and the questions. The two `resolution` usage-path references are renamed `parsed`, as ruled.
7. **P1 reds A6 by a hang** (the colour question waits on a line that is not an accepted answer) and is caught by the test timeout. That is a red, not a timing reading.
8. **`INPUT_DEEP` was also run** (34/34) because the reader's code moved; the brief did not list it.

## Owed
- **QE:** the plants P1–P6 again, and `A8` on a real pseudo-terminal (spelling `UNKNOWN - verify`, for example `script -q /dev/null npm run chess`). The reading should cover:
  - `black`, then `1` → the engine moves first as White and the human plays Black, from Black's side;
  - two empty lines → the human plays White against level 5;
  - a wrong answer (`purple`, `6`) → one rejection line, then the same question;
  - pasting `black\n1\ne5\n` at the colour question → no question is asked twice and `e5` is played after the engine's first move;
  - **Ctrl-D at the colour question, and separately at the difficulty question** → the process exits promptly with status 0, with no frame, no result screen and no stack trace. Whether it exits promptly on a real TTY is `UNKNOWN - verify` (Architect residual 3);
  - `--colour black --difficulty 3` → no question;
  - the first frame overwrites the question lines cleanly (the in-place writer starts at `CURSOR_HOME`, by `ADR-0009`);
  - `npm run chess < file` and `… | cat` → no question (pipe unchanged).
- **Security/NFR:** `ADR-0036` (b1) fires on `const sink = process.stdout;` and `const stdin = process.stdin;`, so the hop is owed. Whether an `N8-LANE` reading is owed for the +1 file is theirs to rule.
- **UAT is not waived:** production lines changed. QE's verdict against A1–A9 signs UAT under the owner's delegation (`…5aaf7cec`, item 2).
- **Merge order:** after `ABC-178`. When `ABC-178` lands, `main` should be merged into this branch (a merge, not a rebase) and the gates re-read before the gate run. `main` gained only records (`0cf13982`) while this ran.
