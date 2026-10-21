---
subtask: security-nfr-ABC-188
role: security-nfr
ticket: plans/tickets/ABC-188-a-deletion-only-edit-to-a-limb-1-holder-fires-nothing-on-clause-b-and-abc-168-adds-the-second-holder.md
ref: .grugops/context/qe-ABC-188/
branch: grugops/qe-ABC-188 @ da348a79 (main merged at 85b462f0; delivery tip 66d6a2f1); QE worktree ../wt-qe-ABC-188 (read only)
width: 1
---

# Security/NFR: ABC-188 short read — the `ADR-0036` § S1 block (A8), the `AR-163-DELONLY` close, and QE-188-a

QE passed with gaps and read `AR-163-DELONLY`'s close condition **met** (decision `…bfbbb83f` on the branch): G1-IMP, G1-GRD, G1B, UNC1, REN, D1 and D2 fire; limbs 2/3 identical to `341da4c1` on 29 plants; the empty-holder case unchanged.
- **QE-188-a (LOW, pre-existing):** one NUL byte in a holder's comment makes git treat the file as binary; the instrument then sees no changed line on any limb. `biome`/`tsc` pass on such a file; `git diff --name-only` still lists it — and § S1 (iv) as now written retires that by-hand check. QE's interim check: `git diff --numstat <base> <head> -- src | awk '$1=="-"'` prints nothing.
- QE-188-b: INFO (harness exit 1 vs 2 on a one-file two-edit plant).

## Decide
1. **A8 / the ADR text:** is the dated § S1 block consistent with your ABC-168 ruling (`…75a45be0`) and ABC-163's (`…3e4b4a08`), including the deleted-holder case BA/PM scoped in from your words?
2. **`AR-163-DELONLY`:** confirm the close (the Orchestrator records it at merge).
3. **QE-188-a:** rate it; is the § S1 (iv) retirement safe while it is open, or must the by-hand check (or QE's `--numstat` check) stay standing until a fix lands? Name the fix owner (Architect/Design) and whether BA/PM cuts it now.
4. **Verdict:** PASS / PASS_WITH_RISKS / FAIL, with required fixes and accepted risks.

## Fences
- Records only: notes, a dated Security/NFR addendum where risk records live (the ABC-095 page). No instrument, harness, ADR, `src/`, `AGENTS.md`, board, `plans/traceability.md` or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-188`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/security-nfr-ABC-188.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-188 (Security/NFR) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**PASS_WITH_RISKS.** There are no required fixes before the merge. The notes are in `.grugops/context/security-nfr-ABC-188/notes/`:
- the readings: `…534bddbb` (observation);
- the result: `…f5843a71` (decision).

Records: the ABC-095 page gains one dated Security/NFR addendum, +23/−0. Nothing is committed. No worktree, `src/`, ADR, instrument, harness, board or trace file was edited. Plants were made only in a fresh scratch repo. No timing was taken.

### 1. A8 / the ADR text: CONSISTENT, and no wording is owed
- (i) and (iii) repeat `…75a45be0` § 2 word for word.
- (ii), the deleted-holder case, falls inside my words "holds limb 1 at `<base>`". It does not widen the ruling.
- (iv) is accurate for `AR-163-DELONLY`. The limit from `…3e4b4a08` § 5(c) is spent once the fix is on `main`.
- (v) is a superset of the close term. (vi) matches `…3e4b4a08` § 3. The rollback matches the MEDIUM rating.

### 2. `AR-163-DELONLY`: close CONFIRMED, effective at `ABC-188`'s merge
- QE read G1B, G1-IMP, D1 and D2 firing, and the empty case unchanged (`…bfbbb83f`).
- The Orchestrator records the close. If `clause-b.mjs` changes before the merge, QE re-reads A2–A7.
- `ABC-168`'s hold lifts once `ABC-188` is on `main`, so `ABC-188` merges first.
- `AR-163-UNCOMMENT`: limb 1 is covered. Limbs 2/3 stay open, LOW, owner Architect/Design.

### 3. QE-188-a: ACCEPTED as `AR-188-BINARY`, LOW. Owner: the Orchestrator. Fix: Architect/Design. BA/PM cuts it now, XS, P3. It gates no merge
- **Wider than planted:** a checked-out `.gitattributes` `src/** -diff` line gives the same blindness on clean text files (measured).
  - Which checkout routing uses is `UNKNOWN - verify`.
  - A textconv driver does not blind limb 1. It garbles limbs 2/3, which is pre-existing, and the fix closes it.
- **Severity:** MEDIUM without the interim control, because an added capability import is invisible.
- **§ S1 (iv)'s retirement is safe only with QE's line standing in its place:**
  - the line is `git diff --numstat <base> <head> -- src | awk '$1=="-"'`;
  - run it at every routing, in the instrument's checkout, from now until the fix lands;
  - it must print nothing, and any file it lists routes here by hand;
  - the old `--name-only` check need not stay.
- **The fix:** the one diff call reads `--text --no-textconv`, and the harness gains a NUL plant and a `-diff` plant. It closes on QE's read.

### 4. The rest
- `R-188-a`: INFO, agreed (an undercount only; the holder still fires).
- `QE-188-b`: INFO, agreed.
- `V1.2.5` [L1] is met: the call form is unchanged.
- `NFR-008`: 0/0/0.

### Owed
- **The Orchestrator:**
  - move `ABC-188` In Security/NFR → Ready for UAT (waived) toward the owner's merge;
  - record the DELONLY close and the UNCOMMENT partial at the merge;
  - keep the `--name-only` check until the merge;
  - run the numstat line until the `AR-188-BINARY` fix lands;
  - route the cut to BA/PM;
  - commit the notes, the ABC-095 addendum and these queue files;
  - append the trace row.
- **BA/PM:** cut the `AR-188-BINARY` fix.
- **Architect/Design:** build it.

### Trace row
| ABC-188 (Security/NFR) | records read: ADR-0036 § S1 A8 block against …75a45be0 / …3e4b4a08; AR-163-DELONLY close confirmed; QE-188-a rated with NUL, -diff and textconv scratch plants; security-nfr-ABC-188 …534bddbb / …f5843a71 | — | — | ADR-0036 § S1 A8 consistent; AR-163-DELONLY closes at merge; AR-163-UNCOMMENT limb 1 covered (limbs 2/3 LOW, Architect/Design); AR-188-BINARY (QE-188-a) LOW accepted, owner Orchestrator, fix Architect/Design (XS P3 cut), interim numstat check; R-188-a, QE-188-b INFO; V1.2.5 [L1] met; NFR-008 0/0/0 | grugops/qe-ABC-188 @ da348a79 (merge 85b462f0; code d722a6b6; ADR eb097a7b)<br>records: plans/tickets/ABC-095 page (+23/−0), context notes | no gate re-run (QE's stand: npm test 59/1987, skips 0); 3 scratch plants; no timing | UAT waived (0 production lines) | — | Security/NFR PASS_WITH_RISKS: In Security/NFR → Ready for UAT (waived); no merge hold from this gate |
