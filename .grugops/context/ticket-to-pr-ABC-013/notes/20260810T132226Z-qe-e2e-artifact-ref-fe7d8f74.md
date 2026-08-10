---
id: 20260810T132226Z-qe-e2e-artifact-ref-fe7d8f74
kind: artifact-ref
by: qe-e2e
at: 2026-08-10T13:22:26Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - EPIC-002
  - src/san.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-013-san-rendering.md
  - plans/tickets/history/ABC-013-board-history.md
supersedes: 
---

# What this hop changed, and what it deliberately did not

## Changed

| artifact | change |
|---|---|
| `plans/board.md` | `ABC-013` moved `In Review` → `In Security/NFR`; In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; `_Updated:` header replaced (one line). Exactly one `_Updated:` line and exactly one `ABC-013` row before and after, asserted by machine |
| `plans/tickets/history/ABC-013-board-history.md` | the `In Review → In Security/NFR` entry appended, and the outgoing `_Updated:` header appended **verbatim BEFORE** the board header was replaced — the file grew by exactly the entry (8,714 chars) + the archive block (3,603 chars), the `in` test confirmed, and everything preceding the append proved byte-identical |
| `plans/tickets/ABC-013-san-rendering.md` | front matter only: `status: in-review → in-security-nfr`, `column: In Review → In Security/NFR`. Asserted by machine that the file's length changed by **exactly** the two token deltas — **no criterion, FEN, expected string, NFR bar or test note was edited** |
| `plans/traceability.md` | ONE row (`ABC-013`), TWO cells (`Tests`, `Status`); 33 table lines before and after; the row at exactly 11 unescaped pipes before and after; every OTHER table row asserted byte-identical; both added strings asserted pipe-free and newline-free before writing; one `_Updated:` line added (29 → 30, the file's accumulate convention) |
| `.grugops/queue/` | `pending/ticket-to-pr-ABC-013-qe.md` → `claimed/…/` → `done/…/`, by hand, with the claim record |
| `.grugops/context/ticket-to-pr-ABC-013/notes/` | these notes |

## NOT changed, deliberately

- **No file under `src/`.** `src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959` before the first
  mutation and after the last; `git diff --name-status main..HEAD -- src/` is still three `A` lines
  and `--numstat` is still `109/0`, `371/0`, `148/0` — **628 insertions, zero deletions**. Every
  mutant was restored from a byte copy.
- **No test added and no test changed.** This is the one place this hop stopped short of what QE
  would normally do, and it is deliberate: the subtask fixed the delivered diff at three new files
  and required that property to stay true. The five criteria gaps are reported with a recipe instead
  of closed — see the verdict note.
- **No dependency added to the repository.** `chess.js@1.4.0` was installed into this session's
  scratchpad with `npm install` run from that directory; `package.json` and `package-lock.json` are
  byte-unchanged (`git diff --stat` empty) and the repo's `node_modules` holds no chess package.
- **No criterion amended, no expected string edited, no FEN changed.** I dispute none of them, and
  the one number I do dispute (52 vs 68) is a description of the table, not a row in it — recorded
  in a note rather than corrected in place.
- **`memory-bank/50-decisions/ADR-0004-san-ownership.md`** — not opened, not amended. No `parseSan`
  written; the out-of-tree SAN matcher this hop used to run the clause-2b round trip lives in the
  scratchpad, is not committed, and is not proposed for `src/`.
- **`plans/nfr-catalog.md`** — not edited, no catalog target moved. `A21`'s wall-clock bars were not
  re-measured here; that is Security/NFR's step and the ticket is now in its column.
- **`ABC-016`, `ABC-017`, `ABC-024`, `EPIC-002`, `EPIC-003`** — not edited. No new ticket cut; the
  minimality gap is written up as a recommendation for BA/PM, not filed as scope by QE.
- **`memory-bank/30-architecture.md`** — still owed `san.ts` and `history.ts` per `ADR-0004`'s
  Consequences, still not fixed here. The Engineer flagged it and the debt predates both hops.
- **No branch merged, nothing deployed, no other board column touched.** The `In Security/NFR` exit
  is Security/NFR's.

## The harness

Read-only against the repository, in this session's scratchpad, **not committed** — the same
position BA/PM and the Engineer took with theirs:

| file | what it is |
|---|---|
| `oracle.ts` | the independent renderer (minimal-unique-qualifier search), the SAN matcher, and the corpus builders |
| `check.ts` | the 68 expected strings vs the oracle, the ticket↔test transcription check, the wide differential, and 19 hand-derived corner cases |
| `external.ts` | `chess.js@1.4.0` vs the ticket's table, and vs `src/san.ts` over the corpus in both call forms |
| `mutants.ts` / `mutate.ts` | the 40 mutants and the mutate → score → restore runner |
| `survivors.ts` / `ext-survivors.ts` | the whole 652-test suite, and the external oracle, run against each survivor |
| `diff-only.ts` | the equivalent-vs-wrong discriminator the runner calls per mutant |
| `update-state.ts` | the board / ticket / traceability writes, with every byte check above made by machine |

**One instrument fault of my own, recorded because it was mine.** The first mutation pass reported
`Q02` (rivals from the pseudo-legal list) as behaviourally EQUIVALENT, which is false. My
discriminator was supplying the `legal` list on every call, so it never entered the
`legal ?? legalMoves(position)` branch the mutant lives in. Fixed to compare **both call forms**, and
the whole 40-mutant pass was re-run from scratch; the numbers reported anywhere in these notes are
from the re-run. A harness that answers the wrong question proves nothing, and this board has that
failure mode on the record twice already.
