---
id: 20260816T121700Z-uat-planner-artifact-ref-the-uat-pack-for-abc066-4d1c9a70
kind: artifact-ref
by: uat-planner
at: 2026-08-16T12:17:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - src/cli.test.ts
  - agent-factory/workflows/06-uat-pack.md
  - agent-factory/checklists/uat-checklist.md
supersedes: 
---

# `ABC-066` — the UAT pack (scenarios, data, pass/fail, signoff checklist)

This note is the PACK: what a person is asked to do and how they judge it. The conducted RESULT is
a separate `observation` note in this task. **Nothing here is a signature and nothing here moves the
ticket.**

## UAT goal, in the user's words

*"When the program refuses my command line, the line it prints back at me is a command I can actually
type — and typing it works."*

That is the whole of `ABC-066`. It is not "the error message is nicer": it is "the instruction the
product gives me is true". This is the first defect UAT has ever caught on this repository, and the
owner found it by hand, at a terminal, by doing what the program told him to do.

## Entry criteria (all checked before conducting — see the conducted note for figures)

| # | entry criterion | state |
|---|---|---|
| E1 | The change is merged to `main` | met — `aec9911`, board row and gate notes carry it |
| E2 | The mandatory gates were green both sides of the merge | met — per the gate notes; NOT re-derived here |
| E3 | The suite is green on the tree under test, skip 0 | met — re-measured at conduct time |
| E4 | The acceptance criteria exist and are unambiguous | met — `A1`–`A6` on the ticket page |
| E5 | The product is exercisable at a terminal | met — `npm run chess` exists since `ABC-042` |

## Test users and roles

**One role, and it is not an engineer.** *The user who mistypes a command line on a program whose
entire vocabulary is six words.* He has a shell, this checkout, and no knowledge of `src/`. He never
reads a test file, never exports anything, and cannot be told "well, the guard asserts it".

Everything below is judgeable by that person with no translator: he types a line, he sees a board or
he sees a refusal, and he reads the exit code his shell reports.

## Test data

No fixtures, no database, no accounts. The test data IS the command line. Two sets:

- **The wrong spellings** (what a person types when he does not know about `--`):
  `npm run chess --colour black`, and the argument-level refusals `--nonsense`, `--colour`,
  `--colour purple`, `--ascii --unicode`, `extra`.
- **The advertised spellings** (what the usage line offers, expanded as a person reads it — a
  bracketed group is optional, `|` is a choice): bare, `--colour white`, `--colour black`,
  `--colour random`, `--ascii`, `--unicode` — each after `npm run chess -- `.

## Business scenarios and pass/fail

Every row's pass/fail is written so a non-engineer can judge it without opening a source file.

| # | scenario (what the person does) | expected result | PASS if | FAIL if |
|---|---|---|---|---|
| `U1` | Types the natural, wrong spelling `npm run chess --colour black` — the owner's own transcript | A refusal that names what it did not understand, and a usage line | shell reports a non-zero exit, no board is drawn, the refusal names `black`, and a `usage:` line is printed | a board appears, or the exit is 0, or nothing tells him which word was wrong |
| `U2` | **The defect itself.** Reads the usage line `U1` printed and types that command back, verbatim, with no options | A board | exit 0, a drawn board on stdout, and **nothing on stderr** | the same refusal appears again — the user is in the loop `ABC-066` exists to break |
| `U3` | Reads the usage line and types it back **with the option he originally wanted** (`--colour black`) | The board he asked for | exit 0, empty stderr, and the board is drawn from black's side (rank 1 at the top, files running `h`→`a`) | exit non-zero, or a board that ignored his choice |
| `U4` | Types **every** form the usage line advertises, one at a time (6 forms) | Six boards | 6 of 6 exit 0 with empty stderr | any advertised form is refused — the line would still be advertising something that does not work |
| `U5` | Gets refused **six different ways** (bad option, missing value, bad value, conflicting pair, stray word, and the no-separator spelling) | Six refusals, each carrying a runnable instruction | every refusal's usage line contains the literal `npm run chess -- ` — 6 of 6 | any refusal path prints a usage line without the separator; a user who lands on that path is back in the loop |
| `U6` | Chooses `--unicode` and `--ascii` from the advertised list | Two boards that differ visibly in their pieces | exit 0 both times, and the glyphs actually change | an advertised option is accepted and then ignored |
| `U7` | Is pedantic and transcribes the line **including the square brackets** | A clean refusal, not a crash | non-zero exit, the offending token named, and the usage line printed again | a stack trace, or a silent success |
| `U8` | Writes an option the old way, without the separator: `npm run chess --ascii` | Documented as a KNOWN LIMITATION — not repaired by this ticket | the behaviour matches what § Known limitations says exactly | the behaviour is worse than documented |

## Known limitations — stated BEFORE signoff, not after a dispute

1. **The package runner still eats a flag written without `--`.** `npm run chess --ascii` exits 0,
   prints the DEFAULT board, and the flag is silently discarded with only an npm warning. `ABC-066`
   did not fix this and could not: it is npm's behaviour, not this program's. What `ABC-066` changed
   is that the program now TELLS the user the spelling that avoids it.
2. **The usage line uses conventional notation, not literal text.** `[...]` means optional and `|`
   means choose one. A user who types the brackets literally is refused (cleanly). This is standard
   POSIX usage grammar and is not treated as a defect.
3. **The guard in `src/cli.test.ts` proves what the line ADVERTISES RESOLVES — not that npm forwards
   it.** The end-to-end half (actually running the printed command through `npm` and seeing exit 0)
   is deliberately out of the ticket's lane and is exactly what `U2`/`U4` here do by hand. The ticket
   states this limit rather than hiding it, and this pack is where it is discharged.
4. **A repeated option is accepted, last one wins** (`--colour white --colour black` draws a black
   board, exit 0). Pre-existing `ABC-042` behaviour, not touched by `ABC-066`, not a refusal path,
   and no criterion here covers it. Named so it is not mistaken for a `U5` miss.
5. **This product prints one frame and exits.** No move can be typed; there is no game to accept.
   Everything in this pack is about the command line and the refusal message, which for this product
   is half of everything a user can see.
6. **Scope of the repair is one of two sites.** The documentation half (`AGENTS.md`) is `ABC-065`
   and is a different ticket with a different agent conducting its UAT concurrently.

## Rollback

Revert the one merge commit that carried `ABC-066` to `main`. The change is one string literal plus
a doc comment in `src/cli.ts` and one added `it` block in `src/cli.test.ts` — no data, no schema, no
migration, no artifact, nothing deployed anywhere (`ADR-0007`: this project runs from source,
locally). Rolling back restores the previous printed line and reds the added guard, which is the
intended, visible signal. **Rollback has NOT been rehearsed in this hop** — no revert was performed,
because performing one would put a production change on `main` for a test.

## Signoff checklist — the named human role who accepts

**The role that accepts is the PROJECT OWNER.** Not the UAT Planner, not the Orchestrator, not QE.
This is the person who found the defect by hand and whose sentence cut the ticket.

The owner is asked to confirm, in his own session:

- [ ] `U1`–`U7` PASSED as reported in the conducted note, and the evidence is what he would have
      measured himself.
- [ ] The known limitations above are **accepted as they stand** — in particular limitation 1, the
      silent-discard path, which remains and cannot be fixed from here.
- [ ] `ABC-066` may leave `In UAT`, and to which column.
- [ ] Whether an agent-conducted UAT report is, or is not, sufficient for the `In UAT` exit on this
      project — the question `AGENTS.md` § Test and UAT authority leaves **explicitly open** and
      forbids resolving by inference.

## Exit criteria

The `In UAT` exit is met when the owner (or a redefinition he issues) records acceptance. **The
conduct is done; the exit is not, and this pack does not claim it.**
