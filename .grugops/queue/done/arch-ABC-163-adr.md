---
subtask: arch-ABC-163-adr
role: architect-design
ticket: ABC-163
ref: .grugops/context/arch-ABC-163-adr/
branch: grugops/ABC-163 @ dc4d4f15 (read only)
width: queued; dispatched when a slot frees
---

# Architect: confirm the ABC-163 fold of ADR-0036 § S1 Ruling 2

The ABC-163 page names Architect/Design as the builder, but the Orchestrator routed the build to the SE. The SE folded Ruling 2 into `clause-b.mjs` (`87d3897d`) and added a dated line to ADR-0036 § S1 (`d8c073e2`) saying the by-hand check is no longer needed.

## Decide (kind: decision)
1. **Fidelity.** Does `87d3897d` implement Ruling 2 as ADR-0036 states it, including the "holders at base AND head" union?
2. **The ADR line.** Is the `d8c073e2` line accurate? Does it retire the by-hand check?
3. **AR-095-L1UNIT.** Does it close on this fold plus QE's re-plants?

Also read QE's result if `.grugops/queue/done/qe-ABC-163.md` exists by then.

## Fences
- Records only. No edits to the branch, `src/`, `AGENTS.md` or `plans/board.md`.
- If the ADR line needs changing, say exactly how; the Orchestrator routes the change.
- Never push or merge.

## Publish
- Seal notes with the plugin writer (task `arch-ABC-163-adr`).
- Write `.grugops/queue/done/arch-ABC-163-adr.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result (architect-design, 2026-10-21 09:20Z): **fidelity YES; the ADR line is accurate and retires the by-hand check once on `main`, with four precisions owed; `AR-095-L1UNIT` closes on QE's `A1`–`A3` plus the merge**

**QE's result was not in.** `.grugops/queue/done/qe-ABC-163.md` did not exist at 09:19Z. This rules on the code and
the ADR as they stand at `grugops/ABC-163` @ `dc4d4f15`.

**Notes** (`.grugops/context/arch-ABC-163-adr/notes/`) were sealed by the sanctioned writer: `context-io.js`
`admitAndAppend`, from the grugops 2.1.0 plugin cache, task `arch-ABC-163-adr`. All four read back through
`readContext`, and `validate` returns `[]` on each.
- `20261021T091929Z-architect-design-observation-a76b1b2e`: the code read, and three scratch plants (P2b, D1, D2),
  OLD and NEW and by hand;
- `…091930Z-architect-design-decision-c3568326`: decision 1, fidelity;
- `…091931Z-architect-design-decision-a7d9c818`: decision 2, the ADR line, with the exact replacement text;
- `…091932Z-architect-design-decision-c7df0411`: decision 3, the `AR-095-L1UNIT` close.

### 1. Fidelity: **YES. `87d3897d` is Ruling 2 as `ADR-0036` § S1 states it, union included**
- **The `+` line** comes from the same `-U0 --no-renames` diff. **Production file** goes through `isProduction`.
  **"Holds limb 1 in code"** is the AST occurrence count, not the (b2) closure. **Limb 1 only** is `limb === 1`.
- **The union** is `baseHolders ∪ holderSet`, both from the same AST scan. The `<base>` side carries weight: the SE's
  plant X1 fires on it alone. The `<head>` side is redundant with (b1) today, and it is kept as the ruling words it.
- **The empty case** cannot occur, because no pathspec is ever built.
- **Limbs 2 and 3** are byte-identical by construction, and on this role's three plants.
- **One divergence from the by-hand method, not from the ruling.**
  - A holder touched only by deleted lines (D1: comment line deleted; D2: import line deleted) fires by hand and does
    not fire in the fold.
  - Ruling 2 says "a `+` line", and DELTA never fires on a removal. At today's holder, a deletion cannot widen what it
    reads.
  - The re-armed § Decision 3 trigger, a holder that takes a caller-supplied value, re-opens the case.
  - **To Security/NFR, for information only:** no ruling is owed unless it wants deletion-only touches routed. That
    change is about three lines.
- **The instrument's owner accepts the SE-built fold.** No rebuild and no new path are owed. In place is right: the
  pointer stays, and `341da4c1` reproduces the old readings.

### 2. The ADR line: **accurate in what it states. It retires the by-hand check once `87d3897d` is on `main`. Four precisions are owed**
- Every claim in it checks against the code.
- The retirement is real: § S1 framed the by-hand method as the stand-in "before the instrument carries it".
- **Owed:**
  1. "a file" should read "a production file".
  2. State the deletion-only case that the by-hand method caught and the fold does not.
  3. Limb 1 gains one output line, so a byte comparison runs the record harnesses on the `341da4c1` copy.
  4. The close needs the merge, and `AR-095-CWD`'s interim control moves to the instrument.
- **The exact replacement paragraph** is in `…a7d9c818`. The Orchestrator routes it. It is recommended on
  `grugops/ABC-163` before the merge. It is not a gate.

### 3. `AR-095-L1UNIT`: **closes on this fold plus QE's re-plants, recorded by the Orchestrator at the merge**
- **Condition 1:** QE's done record reads `A1`, `A2` and `A3` MET under `87d3897d`, with QE's own plants.
- **Condition 2:** `grugops/ABC-163` merges to `main`; the merge is the owner's.
- Until both hold, the by-hand check stays, holders at both ends.
- **Neither of these holds the close:** the deletion-only case and the ADR wording.
- **If QE reads any of `A1`–`A3` as not met,** the risk stays open and the instrument returns to this role.
- **After the close:** `AR-095-CWD`'s interim control is carried by the instrument. `F-095-1` and § Decision 3's
  residual are unchanged.

### Also noted, no action owed now
- `src/book-file.ts:5` says "any edit to this file routes to `In Security/NFR`". Under the fold, a deletion-only edit
  does not route. The comment errs in the safe direction for a human reader. `src/` is fenced here. Align it at the
  next edit of that file, which routes to Security/NFR anyway.

### Fences kept
- Records only.
- Untouched: the branch, `src/`, `AGENTS.md`, `plans/` (including `plans/board.md`, `plans/traceability.md` and
  `plans/nfr-catalog.md`) and `ADR-0036`.
- The plants ran in the session scratchpad, outside the repository. No timing was taken. Nothing was committed,
  pushed or merged.
- The brief moved pending → claimed → done by rename. The empty `claimed/arch-ABC-163-adr/` is left for the
  Orchestrator's close.
- No board move.
- NFR impact: none (0 tests; `NFR-008` not triggered).

### Trace row (for the Orchestrator to append; this hop did not edit `plans/traceability.md`)
`| ABC-163 (Architect fold review) | AR-095-L1UNIT, ADR-0036 § S1 Ruling 2; Security/NFR …b65b11b7 | grugops/ABC-163 @ dc4d4f15 (code 87d3897d, ADR d8c073e2) | — (records only) | Architect arch-ABC-163-adr: code read at 87d3897d; scratch plants on 1671f24f: P2b NEW FIRES (Ruling 2, base and head), D1 and D2 (deletion-only) NEW does not fire while by hand lists the file; L2/L3 byte-identical | fidelity YES (union base ∪ head; owner accepts the SE-built fold); ADR line accurate, retires by hand once on main, 4 precisions owed (text in …a7d9c818); AR-095-L1UNIT closes on QE A1–A3 + merge, Orchestrator records; QE result absent at ruling | notes …a76b1b2e, …c3568326, …a7d9c818, …c7df0411 |`
