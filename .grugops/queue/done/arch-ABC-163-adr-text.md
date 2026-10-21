---
subtask: arch-ABC-163-adr-text
role: architect-design
ticket: ABC-163
ref: .grugops/context/arch-ABC-163-adr/
branch: new branch grugops/arch-ABC-163-adr-text from grugops/qe-ABC-163 @ 2270c8fa; worktree ../wt-arch-163
width: 2 (beside security-nfr-ABC-163)
---

# Architect: land the ADR-0036 § S1 replacement paragraph before ABC-163 merges

Your decision `…a7d9c818` owes four wording fixes to the `d8c073e2` line:
- "a file" becomes "a production file";
- name the deletion-only gap;
- note limb 1's extra line and the `341da4c1` copy for byte comparisons;
- note that the close needs the merge, and that AR-095-CWD's interim check moves to the instrument.

Apply the exact replacement text from `…a7d9c818` to ADR-0036 on the branch above, and commit there. If QE's result changes anything, say so first.

## Also (QE `…8a60d7c8`)
- **G-1:** deletion-only holder edits fire nothing. QE re-planted three, and the by-hand check caught all three. Your replacement text names this gap; check it matches QE's plants. Security/NFR rules on the risk in parallel. If its ruling changes the text, the Orchestrator re-routes.
- **G-3:** probe scripts that grep `(b1)` now split limb-1 rows, and F5, F6 and S10 move from L3 to L1+L3. Rule whether those scripts need an edit or a note.
- **G-4:** Biome ignores `.grugops/`, and there is no committed Ruling 2 plant fixture. Rule whether to cut a ticket for one, and name its shape; BA/PM cuts.

## Fences
- Change ADR-0036 only, plus notes written inside the worktree.
- Don't touch `clause-b.mjs`, `src/`, `AGENTS.md` or `plans/board.md`.
- Never push or merge.

## Publish
- Seal notes with the plugin writer (task `arch-ABC-163-adr-text`).
- Write `.grugops/queue/done/arch-ABC-163-adr-text.md` (brief + `## Result`: branch tip, diff summary, trace row) and `.claim.md`, uncommitted on main.

## Result (architect-design, 2026-10-21 09:34Z): **ADR-0036 § S1 fold paragraph replaced at `e7385671`; G-1 text matches QE's plants; G-3 a note, not an edit; G-4 one XS ticket (`r2-mutants.sh`), BA/PM cuts**

**Branch tip: `grugops/arch-ABC-163-adr-text` @ `3b30196e`** (worktree `../wt-arch-163`, from `grugops/qe-ABC-163`
@ `2270c8fa`). Two commits: `e7385671` (the ADR) and `3b30196e` (the notes). Not pushed, not merged.

**Said first: QE's result and `main` changed the `…a7d9c818` text.** The four owed precisions are applied. Five changes
differ from the sealed text:
1. **Limb 1's output (QE).** Limb 1 prints one added line, plus one indented line for each holder file Ruling 2 names
   (QE measured 1 or 2 lines).
2. **The deletion-only gap (QE).** It is restated against QE's plants. It becomes live at the first holder with a
   guard, or with a read whose path is built over more than one line, and at the re-armed § Decision 3 trigger.
   `…a7d9c818` named only the re-armed trigger. G-2 is marked as pre-existing.
3. **The close (QE).** QE read `A1`–`A3` MET, so `AR-095-L1UNIT` closes at the merge.
4. **The `AR-095-CWD` clause is dropped (`main`).** `AR-095-CWD` closed at `ABC-162`'s merge (`f459353e`). The ADR
   now says the Orchestrator keeps the by-hand check until the merge, and that `AR-180-VALIDATED` names this merge.
5. **G-3's harness note is added.**

**Diff summary (`e7385671`, `ADR-0036` only, +27/−4).** The paragraph under
`#### Ruling 2 folded — 2026-10-21 (ABC-163)` is replaced by three blocks:
- **The fold.** "a production file"; limb 1's added lines; the `341da4c1` byte-comparison pointer; and the
  `(b1) capability` grep note, with F5, F6 and S10 moving `L3` → `L1 L3` by design.
- **The deletion-only case.** QE's three G-1 plants. Today's holder cannot be widened by a deletion. When the case
  becomes live. G-2 is pre-existing. Security/NFR rules the risk.
- **The retirement.** It takes effect at the merge, and the readings list is updated.
- **Not touched:** `clause-b.mjs`, `src/`, `AGENTS.md` and `plans/`.

**Rulings.**
- **G-1:** the text names the gap, and it matches QE's plants (guard line deleted, import line deleted, rename with
  the import dropped). The rule "a holder at `<base>` or `<head>`, touched only by deleted lines" also covers G-2's
  plant. The risk rating is Security/NFR's, ruled in parallel. If that ruling changes the text, the Orchestrator
  re-routes.
- **G-3:** a note, not an edit.
  - The harnesses and their `*.out.txt` are earlier hops' records, and they reproduce at `341da4c1`.
  - No gate parses the output, and the verdict lines are unchanged.
  - F5, F6 and S10 are correct Ruling 2 fires.
  - Whoever re-runs a harness greps `(b1) capability`.
- **G-4:** cut one ticket, XS, P3, LOW, 0 `src/` lines (BA/PM cuts it).
  - **What it adds:** `.grugops/context/design-F-072-1/probe/r2-mutants.sh` and its `.out.txt`, in the
    `f-mutants.sh` shape: the instrument path as an argument, a `clone --shared` in scratch, and a grep on
    `(b1) capability`.
  - **Plants:** P2b, P2c, comment-only and X1 base-only, each FIRES. A no-holder plant at `f00038ef^1` adds nothing.
    G-1 has two deletion-only plants that read "does not fire", labelled.
  - **How it checks:** expected verdicts with a nonzero exit, and limbs 2 and 3 byte-compared with `341da4c1`.
  - **Acceptance:** exit 0 at `87d3897d`, nonzero at `341da4c1`, and QE reads both.
  - **Trigger:** owed before any `clause-b.mjs` edit merges.
  - **Rejected:** Biome on the instrument (QE measured 0 new diagnostics, and lint does not test firing), and a
    vitest suite.

**Notes** (`.grugops/context/arch-ABC-163-adr-text/notes/`, in the worktree). They were sealed by `context-io.js`
`admitAndAppend` (grugops 2.1.0 plugin cache), task `arch-ABC-163-adr-text`. `validate` returns `[]` and the seal is ok
on each. They read back through `readContext`.
- `20261021T093350Z-architect-design-decision-3951361a`: the ADR change, what QE's result and `main` changed, and G-1;
- `20261021T093351Z-architect-design-decision-b2dfabfc`: G-3;
- `20261021T093352Z-architect-design-decision-34e592ac`: G-4.

A first sealing used a wrong `at` (09:50Z, ahead of the clock). Those three uncommitted files were removed before the
commit and re-sealed at the real time. Nothing from them was committed.

**Fences kept.**
- Untouched: `ADR-0036` was the only file changed besides the notes. `clause-b.mjs`, `src/`, `AGENTS.md`,
  `plans/board.md`, `plans/traceability.md` and `plans/nfr-catalog.md` are untouched.
- No board move. NFR impact: none.
- The brief moved pending → claimed → done by rename. The empty `claimed/arch-ABC-163-adr-text/` is left for the
  Orchestrator's close.

### Trace row (for the Orchestrator to append; this hop did not edit `plans/traceability.md`)
`| ABC-163 (Architect ADR text) | AR-095-L1UNIT, ADR-0036 § S1 Ruling 2; Architect …a7d9c818; QE …8a60d7c8 (G-1, G-3, G-4) | grugops/arch-ABC-163-adr-text @ 3b30196e (ADR e7385671, from qe tip 2270c8fa) | — (docs only) | ADR text checked against code at 87d3897d and QE plants …7f56f339/…47186969; main state read (AR-095-CWD closed f459353e, AR-180-VALIDATED open) | ADR-0036 § S1 fold paragraph replaced (+27/−4): production file, limb-1 output lines, 341da4c1 pointer, (b1) capability note, deletion-only gap with QE's plants and live trigger, close at merge; G-3 note not edit; G-4 XS r2-mutants.sh ticket shape for BA/PM | notes …3951361a, …b2dfabfc, …34e592ac |`
