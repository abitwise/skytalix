---
subtask: security-nfr-ABC-163
role: security-nfr
ticket: plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
ref: .grugops/context/qe-ABC-163/
branch: grugops/qe-ABC-163 @ 2270c8fa (over SE dc4d4f15; base ccccc6bb); read only
width: 2 (beside arch-ABC-163-adr-text)
---

# Security/NFR: rule on ABC-163 (AR-095-L1UNIT close; QE G-1, G-2)

QE passed ABC-163 with gaps (`…8a60d7c8`); the edge plants are in `…7f56f339`. The Architect found the change faithful in `…c3568326`, and `…c7df0411` says AR-095-L1UNIT closes at the merge, given QE's A1–A3.

## Decide
1. **AR-095-L1UNIT.** Confirm it closes when ABC-163 merges. This is part of AR-180-VALIDATED's close condition (`…1b032e3f`, `…73eb06c5`).
2. **G-1 (proposed LOW, latent).** Deletion-only edits to a limb-1 holder fire nothing; the retired by-hand check caught them.
   - Choose one: accept as a named residual (owner, trigger: "a holder gains a guard or a multi-line read", close condition), or require that the by-hand `--name-only` check is kept alongside the instrument until fixed, or recommend a cut.
   - The Architect is landing ADR-0036 wording that names this gap (`…a7d9c818`).
3. **G-2 (LOW, pre-existing, every limb).** Deleting only the `/*` and `*/` around an import makes it live with no `+` line. Rule on it the same way.
4. **Security surface.** The change touches the instrument and the ADR only, with 0 `src/` lines. Confirm.

## Fences
- Records only, plus risk records where AR-095-L1UNIT lives.
- No `src/`, instrument, ADR, `AGENTS.md`, board or worktree edits.
- No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (task `security-nfr-ABC-163`).
- Write `.grugops/queue/done/security-nfr-ABC-163.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result (security-nfr, 2026-10-21 09:36Z): **PASS_WITH_RISKS**. Records only, uncommitted on `main`

- **Notes** (task `security-nfr-ABC-163`). Both were sealed by `context-io.js` `admitAndAppend` (grugops 2.1.0 plugin
  cache) and read back by `readContext`:
  - `20261021T093522Z-security-nfr-observation-3b895278`: the readings;
  - `20261021T093522Z-security-nfr-decision-3e4b4a08`: the rulings.
- **Risk record:** a dated addendum at the end of the `ABC-095` page's `## Security/NFR` section, where
  `AR-095-L1UNIT` lives.
- **Untouched:** no `src/`, instrument, ADR, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or worktree
  edits. The instrument was only run, read-only. No timing was taken, and nothing was pushed or merged.

### 1. `AR-095-L1UNIT`: **closes at the merge, as written**
- **QE read the written condition** with its own plants (`…8a60d7c8`):
  - P2b and P2c FIRE (`A1`);
  - the comment edit FIRES (`A2`);
  - the empty-holder case adds nothing and runs no pathspec diff (`A3`).
- **The close lands at the owner's merge of `87d3897d` to `main`.** The Orchestrator records it. If `clause-b.mjs`
  changes again before the merge, QE re-reads `A1`–`A3`.
- **G-1 neither holds nor re-opens it.** The deletion-only case is outside the risk's words.
- **`AR-180-VALIDATED` stays open.** The merge meets its close part (i); part (ii), the G-2 pin with TMO red, is
  still owed.

### 2. G-1: **ACCEPTED** as new residual **`AR-163-DELONLY`**
- **Rating:** LOW, latent. **Owner:** the Orchestrator. **Fix by:** Architect/Design.
- **Re-planted.** QE's plant needed a parameter. My **no-parameter** guard drop (G-1b, `AR-095-READ`'s cap shape,
  `V5.2.1`) also fires nothing. So § Decision 3's trigger does not cover the gap.
- **Trigger.** A limb-1 holder gains any of:
  - (i) a guard, with or without a parameter;
  - (ii) a parameter or caller-supplied value reaching the read;
  - (iii) a multi-line read;
  - (iv) a second limb-1 holder appears.

  Each of these is `+` lines in a holder, so the ticket routes itself.
- **When it fires, owed before that ticket merges:**
  - Ruling 2's unit widens to any changed line, `+` or `−`;
  - the instrument fix lands: drop the `!lines.size` skip, about 3 lines;
  - QE reads it with G-1b and the import drop.
  - **Until then,** the Orchestrator runs the by-hand `--name-only` check, with holders at `<base>` ∪ `<head>` and
    never with an empty pathspec.
- **Closes when** the instrument fires on a deletion-only holder edit, read by QE.
- **Not chosen:**
  - keeping the by-hand check now (it brings back the retired manual step and its empty-pathspec trap, for a holder
    that cannot widen);
  - a cut now (at L1 it is gold-plating, because the trigger routes itself).

### 3. G-2: **ACCEPTED** as new residual **`AR-163-UNCOMMENT`**
- **Rating:** LOW, pre-existing on every limb. **Owner:** Architect/Design.
- **Today:** the tree holds no compilable limb code inside a block comment (measured: 0). The setup step is visible as
  a word hit.
- **Trigger:** such a block appears.
- **When it fires:** the gate treats the file as fired. The block is removed, or the fix lands before that ticket
  merges.
- **Fix:** fire on a per-file rise in the AST occurrence count.
- **Closes when** QE's uncomment plant fires on every limb.
- **No cut now.**

### 4. Security surface: **confirmed**
- **0 `src/` lines.** `git diff --numstat ccccc6bb 2270c8fa -- src/` is empty. The change touches the instrument,
  `ADR-0036`, the `ABC-163` page and notes.
- **The NEW instrument on its own range:** 0 production files; limbs 1, 2 and 3 do not fire.
- **The instrument's own surface:** `execFileSync` with an argument array, and no shell. Ruling 2 adds no call and no
  write.
- **`NFR-008`:** not triggered.

### 5. Owed before the merge: ADR wording (records, not a security block)
The Orchestrator routes these to `arch-ABC-163-adr-text`, which is running in parallel. Security/NFR did not edit
the ADR. The text concerned is `…a7d9c818`'s replacement paragraph:
- **(a)** replace "§ S1's re-armed § Decision 3 trigger re-opens this case" with `AR-163-DELONLY` and its trigger
  (i)–(iv);
- **(b)** "the instrument carries `AR-095-CWD`'s interim control": `AR-095-CWD` closed at `f459353e`. Drop it, or
  re-point it to `AR-180-VALIDATED`;
- **(c)** "The by-hand Ruling 2 check is no longer needed": add "until `AR-163-DELONLY`'s trigger fires without its
  fix".

### Accepted risks after this gate
- `AR-163-DELONLY` (LOW, the Orchestrator; new);
- `AR-163-UNCOMMENT` (LOW, Architect/Design; new);
- `AR-180-VALIDATED` (LOW, the Orchestrator);
- `AR-095-READ` (LOW, Security/NFR).

`AR-095-L1UNIT` closes at the merge. **Required security fixes before merge:** none.

### Board
`ABC-163` leaves `In Security/NFR` with PASS_WITH_RISKS, toward `Ready for UAT`. UAT is waived (0 production lines, as
QE measured). The Orchestrator makes the move, records the `AR-095-L1UNIT` close at the merge, and opens
`AR-163-DELONLY` and `AR-163-UNCOMMENT`.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-163 (Security/NFR) | instrument + ADR only (0 src lines; NEW instrument on ccccc6bb..2270c8fa: 0 production files, L1–L3 silent; execFileSync argv, no new call or write); re-planted G-1b no-parameter guard drop: NEW silent, by-hand lists; G-2 precondition absent in tree (0); security-nfr-ABC-163 …3e4b4a08 / …3b895278 | AR-095-L1UNIT closes at merge (QE A1–A3 own plants) → AR-163-DELONLY (LOW, owner Orchestrator; trigger: holder gains guard/parameter/multi-line read or 2nd limb-1 holder; fix ± lines, by hand until then) + AR-163-UNCOMMENT (LOW, owner Architect/Design; pre-existing, every limb); AR-180-VALIDATED part (i) met | grugops/ABC-163 @ dc4d4f15 (instrument 87d3897d); QE grugops/qe-ABC-163 @ 2270c8fa | .grugops/context/design-F-072-1/probe/clause-b.mjs, ADR-0036 | NFR-008 not triggered (0 tests); no timing | Security/NFR PASS_WITH_RISKS: no required security fixes; G-1, G-2 accepted, no cut; ADR wording (a)–(c) owed before merge via arch-ABC-163-adr-text |
