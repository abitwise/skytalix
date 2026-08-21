---
id: 20260821T103000Z-architect-design-artifact-ref-what-this-hop-wrote-and-the-eleven-things-it-refused-2fa10c73
kind: artifact-ref
by: architect-design
at: 2026-08-21T10:30:00Z
verified_by:
confidence: high
refs:
  - G-QE115-3
  - N8-SPAWN
  - NFR-008
  - ABC-108
  - ABC-115
  - ADR-0017
  - AR-N8SPAWN-DRIFT
supersedes:
---

# WHAT THIS HOP WROTE, WHAT IT VERIFIED BY HASHING RATHER THAN PROMISING, AND THE ELEVEN THINGS IT REFUSED

Branch `grugops/residual-gqe115-3`, own `git worktree` off `main` @ `e4a5c48`. Nothing merged,
nothing deployed, nothing on `main`.

## Written

| file | change | shape |
|---|---|---|
| `memory-bank/50-decisions/ADR-0017-spawn-budget-time-clauses-are-non-mechanical.md` | **NEW** | house form from `ADR-template.md`: Status / Context / Decision / Alternatives / Consequences / Rollback |
| `plans/nfr-catalog.md` | **+37 / −0** | one section appended: *"`G-QE115-3` IS RULED"*. **Append-only — zero deletions.** |
| `plans/traceability.md` | **+3 / −1** | one `_Updated:` entry inserted; **one row (`ABC-108`), two cells (`NFRs`, `Status`), appended to in place** |
| `.grugops/context/residual-G-QE115-3-2026-08-21/notes/` | **NEW** | this note, the `decision` ruling, and the `observation` measurements |

## Verified by hashing, not asserted

- **Eight `NFR-001`–`NFR-008` rows: `63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`
  BEFORE and AFTER the write** — the `63f66795…ca31` the fence names. **8 matched lines both times.**
- **56 table lines in `plans/nfr-catalog.md` before and after.** `git diff --numstat` on that file is
  **37 insertions / 0 deletions** — nothing existing could have moved.
- **`plans/traceability.md`'s `ABC-108` row re-split from disk after the write: 12 raw `|`-fields =
  10 columns, unchanged.** The eight untouched fields compared byte-for-byte against `HEAD` and each
  reported UNCHANGED; the two touched fields each still start with their exact prior contents. **No
  raw pipe was introduced into any cell** (asserted on the appended text before writing it).
- **`src/`: `git status --porcelain -- src/` empty and `git diff --numstat -- src/` empty.** Zero
  files. No test added, deleted, trimmed, moved or re-titled.

**One correction, recorded rather than hidden.** My first traceability write went into the **wrong two
columns** — I used 1-based awk field numbers against a 0-based Python split, so `Code (PR/files)` and
the row's trailing empty field were appended to instead of `NFRs` and `Status`. It was caught by the
field-by-field re-split immediately after the write, **reverted with `git checkout --` to a verified
clean `numstat`**, and redone with the column identity asserted (`f[1] == "ABC-108"`, `f[5]` starts
`**\`NFR-008\``, `f[10]` starts `**RULED`) before any byte was written. **The delivered row is
correct; the error never left the worktree and never reached `main`.**

## The eleven things I refused

1. **I did not build the opt-in lane, the instrument or the paired-run harness.** Ruled not owed —
   `ADR-0017` clause 1 and alternative 1. It would cost ~166 s CPU against a 13 s clause **and be
   green on the mutant that matters.**
2. **I did not ship a source-level proxy guard** (grep for settles / un-hooked children). Third
   proxy-for-time on this project; the first two both misled. `AGENTS.md`: never ship a guard you
   have not watched go RED.
3. **I did not touch `src/`.** Not one file, not one test. The mutant lived and died in
   `/private/tmp`, outside the repository, and is not committed.
4. **I did not move any target, bar, level, floor, account, instrument, statistic, null control or
   `UNKNOWN - verify` marker** in `plans/nfr-catalog.md`. **Verified by hashing.**
5. **I did not touch `NFR-008`'s 3 s / 13 s level.** It is Olger Oeselg's, ratified in person
   2026-08-11. I ruled about how a clause under it is checked; I never edited it.
6. **I did not grade `NFR-008` and I claimed no `N8-LANE` line.** My two lane readings
   (4.68 / 4.55 real) are **reported** on a machine at load 4.30. That grading is `ABC-108`'s and it
   is open.
7. **I did not cut a ticket.** One is **named** — *record the `T2` trigger in the gate checklist and
   in future cuts' `## Security / NFR triggers` block*, `XS` / `P2`, owner BA/PM — and **no id was
   invented**, because inventing one fabricates a board state.
8. **I did not edit `AGENTS.md`.** One sentence is **owed** there (its `## Test` section lists four
   opt-in lanes and a reader may expect a fifth). `ABC-109` is live against that file under a byte
   cap, so the edit is named as owed with its owner and left alone. **Nothing in `AGENTS.md` is
   false today.**
9. **I did not move `ABC-115`, and I did not sign it.** It stays `Ready for UAT`, **unsigned**. No
   agent signs it. **I did not move `ABC-108` either** — still `Backlog`.
10. **I did not re-open `G-QE115-1`, `G-QE115-2`, the exit-code ruling, `ADR-0016`, `ABC-115`'s size
    or priority, or QE's PASS.** QE's disposition of `G-QE115-3` was correct for a QE hop; I answered
    it, I did not overturn it.
11. **I did not move a board column, merge, or deploy.** `plans/board.md` is untouched — I expected
    no board move and made none.

## And the thing I nearly got wrong, recorded so the next reader can check my reasoning rather than inherit it

**My first answer on the ADR question was "no ADR".** The ruling states an existing property rather
than changing a guarantee, and `## Hard limits` on my role page says keep design just enough. I
overturned it on two facts: `ABC-108`'s `OQ-1` ruling — the same class of budget ruling — wrote
`ADR-0014` **beside** its catalog section, so the house form is both; and this shape has now been
raised **twice by two different roles**, which is the "a future maintainer will curse you" test met
by observation rather than prediction. **A subsection at line 1492 of a 1528-line file does not stop
the third re-derivation.** If a later hop thinks that was gold-plating, the argument is here to
attack.
