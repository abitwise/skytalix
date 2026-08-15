---
id: 20260815T132100Z-ba-pm-observation-the-groupings-i-rejected-and-the-numbers-each-criterion-rests-on-a09f0f52
kind: observation
by: ba-pm
at: 2026-08-15T13:21:00Z
verified_by: 
confidence: high
refs:
  - ABC-061
  - ABC-062
  - ABC-063
  - ABC-064
  - ABC-065
  - src/cli.test.ts
  - src/cli-options.ts
  - src/cli.ts
  - AGENTS.md
  - plans/tickets/ABC-059-agents-md-runnability-guard-pins-a-spelling-not-a-fact.md
supersedes: 
---

# The groupings I rejected, and the numbers the five tickets' criteria actually rest on

`AGENTS.md` process rule 2 puts measurements and rejected alternatives HERE rather than in the ticket
prose. This note is that overflow. The five tickets run **159 / 159 / 141 / 159 / 173** lines —
median **159**, against the rule's budget of ≤ 300.

## The groupings I rejected

| rejected shape | why not |
|---|---|
| **One ticket, "harden `src/cli.test.ts`", all seven QE repairs** | `M`–`L` with at least four unrelated properties inside it. An oversized ticket hides unestimated risk, and a reviewer could not tell which half of it had failed |
| **Seven tickets, one per repair `R1`–`R7`** | Seven Backlog rows, seven DoR tables and seven merge conflicts in ONE file, for work that groups cleanly by which path it asserts. `ABC-050` and `ABC-058` are this project's own precedent for folding several findings that share ONE subject |
| **`R3` split across two tickets** (`--colour` with the usage line, `white` with the six verbs) | Reads better on paper and makes the mapping unfollowable. QE wrote `R3` as one unit — "the two argvs with no deterministic coverage anywhere" — and it stays one unit, in `ABC-062` |
| **`R6` cut separately from `R9`** | The guard is RED until the documentation is fixed. Split, one of the two reds on merge — the strongest possible argument for folding, and the reason `ABC-065` spans two files |
| **`R8` / `R10` / `--help` cut as tickets with a `⚠️` DoR** | Each would have had to choose a convention, a spawn budget, or a scope change inside acceptance criteria. A ticket that makes a ruling while looking like coverage work is worse than an open question, which is what they are now |

## The numbers each ticket's criteria rest on — all read from disk at the cut, none inherited

**`ABC-061`.** `src/cli.test.ts:359` asserts `resolveOptions(argv).ok === true` for exactly six
argvs — `[]`, `["--ascii"]`, `["--unicode"]`, and `--colour` with each of its three value words
(read at `:359-370`). Nothing else about the accepting path is asserted anywhere. QE's mutant at
`src/cli-options.ts:153` leaves `.ok` true, which is why 856/856 stays green.

**`ABC-062`.** `USAGE` is a module-private const in `src/cli.ts` (read: the rejection write is
`` `${resolution.problem}: ${…}\n${USAGE}\n` `` on **stderr**, `process.exitCode = 1`, no
`process.exit()`). The fallback QE mutated is `if (value === undefined) return reject(MISSING_VALUE,
next ?? token)` at `src/cli-options.ts:130`. Six of the ten spawned children take a refusal path
(`conflict`, `difficulty`, `shortFlag`, `bareWord`, `badColour`, `escape`), which is where `A3`'s
"6 of 6" comes from and why the ticket costs zero spawns.

**`ABC-063`.** `ACCEPTED_ARGUMENTS` is six elements (`src/cli-options.ts:46-53`). The resolver
returns on the FIRST unrecognised token (`:138`), which is why the ticket demands the offending token
be named per case rather than just `ok === false` — `["--move","e4"]` must blame `--move`.

**`ABC-064`.** The frame is 23 rows (`AGENTS.md` § Commands, verified 2026-08-14 at `ABC-042`); the
byte-exact tail and the append-strategy assertions are at `:162` and `:226`, both on `npmRun` only;
`:274` compares 9 board rows for the three non-default children. 23 − 9 = **14 unread rows per
child**, which is the ticket's headline number.

**`ABC-065`.** `grep -c 'npm run chess -- ' AGENTS.md` returns **0**. The slot is four lines
(`AGENTS.md:62-65`): a list item plus its HTML comment. **`src/cli.test.ts:201` is
`expect(agents).toContain("- Dev / run: \`npm run chess\`")` — a SUBSTRING of the line, not the whole
line.** That single fact is what makes the documentation fix non-invasive: an example added inside
the same slot leaves `ABC-042`'s `A1` row byte-identical and green. Had it been a whole-line
equality, this ticket would have needed a ruling instead of a criterion.

## Two facts about the environment that changed since `ABC-057`–`ABC-060` were cut

1. **The ordering hold those four carry is discharged for these five.** They read "`src/cli.test.ts`
   does not exist on `main`"; it does — `ABC-042` merged at `dbaf972` and `git ls-tree main src/`
   lists it. That is why four of my five score **10/10** where their four scored 9/10. **I did not
   edit their pages or their board rows to say so** — re-scoring another role's hop is not this
   hop's, and three of the four are the same BA/PM but a different task.
2. **`N8-LANE` is no longer the constraint it was.** It was re-graded **`MET` at 0.23× — 152.5 ms of
   the 650 ms bar** at `security-nfr-ABC-042-g1-regrade`. Every ticket here inherits it by name with
   0 new files and 0 new spawns, so none of them can move it; the number is quoted in each ticket so
   nobody re-measures it to find out.

## One thing I checked and did not act on

**`plans/board.md`'s `_Updated:` header is the Orchestrator's UAT header and I did not replace it.**
The file's rule bars appending a second narrative header and requires the outgoing one to be archived
verbatim to a ticket's `history/` file before replacement. Appending five one-line rows needs
neither. **The header is the Orchestrator's to replace at close, with the archive step it names.**
