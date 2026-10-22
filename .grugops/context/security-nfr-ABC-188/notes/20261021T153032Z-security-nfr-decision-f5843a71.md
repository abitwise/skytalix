---
id: 20261021T153032Z-security-nfr-decision-f5843a71
kind: decision
by: security-nfr
at: 2026-10-21T15:30:32Z
verified_by: 
confidence: high
refs:
  - ABC-188
  - ABC-168
  - grugops/ABC-188
  - grugops/qe-ABC-188
  - 66d6a2f1
  - d722a6b6
  - eb097a7b
  - da348a79
  - 85b462f0
  - b71f8902
  - 341da4c1
  - ADR-0036
  - ADR-0036 S1
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - AR-188-BINARY
  - AR-095-READ
  - QE-188-a
  - QE-188-b
  - R-188-a
  - F-095-1
  - V1.2.5
  - V5.2.1
  - V5.3.2
  - NFR-008
  - 20261021T152923Z-security-nfr-observation-534bddbb
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261021T093522Z-security-nfr-decision-3e4b4a08
  - 20261021T152354Z-qe-e2e-decision-bfbbb83f
  - 20261021T152354Z-qe-e2e-observation-0b73ec04
  - 20261021T152354Z-qe-e2e-observation-8ea32c43
  - 20261021T152354Z-qe-e2e-observation-b2674938
  - 20261021T152354Z-qe-e2e-observation-36ec80ab
  - 20261021T150717Z-architect-design-decision-7d78d7cc
supersedes: 
seal: sha256:eadfe0f118ed7b01dacbbd58c90f36c0991d8fedfaa2a19232aa452e3181b008
---

# Security/NFR on ABC-188 (records read): **PASS_WITH_RISKS**. The A8 block is consistent with both rulings. `AR-163-DELONLY`'s close is confirmed. `QE-188-a` is accepted as **`AR-188-BINARY`** (LOW, owner the Orchestrator, fix Architect/Design). § S1 (iv)'s retirement is safe only if QE's `--numstat` line stands in its place. No required fix before merge

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in `…534bddbb`. The change has 0 `src/` lines (QE `…36ec80ab`), and the UAT waiver applies.

## 1. A8 / the `ADR-0036` § S1 block: CONSISTENT. No wording is owed
- **(i) and (iii)** are `…75a45be0` § 2 word for word. Both are limb 1 only.
- **(ii), the deleted-holder case BA/PM scoped in, is inside my ruling, not a widening of it.** A file deleted or renamed away at `<head>` "holds limb 1 in code at `<base>`", and every line of it is a changed line. That was the intended reading. The Architect read it the same way (`…7d78d7cc`).
- **(iv)** is accurate for `AR-163-DELONLY`. The limit I asked for at `ABC-163` (`…3e4b4a08` § 5(c), "until the trigger fires without its fix") is spent once the fix is on `main`. The binary gap is a separate risk with its own interim control (§ 3). It is recorded in the risk record, not owed as ADR text before this merge.
- **(v)** is a superset of the close term (`…3e4b4a08` § 2 plus D1/D2 from `…75a45be0` § 2). **(vi)** matches `…3e4b4a08` § 3. **The rollback** matches the MEDIUM rating.

## 2. `AR-163-DELONLY`: close CONFIRMED. It takes effect at `ABC-188`'s merge to `main`, and the Orchestrator records it
- **The term is met on QE's own read (`…bfbbb83f`, `…8ea32c43`, `…b2674938`):**
  - G1B (G-1b) and G1-IMP (the import-line drop) FIRE, and so do G1-GRD, UNC1 and REN;
  - D1 and D2 FIRE on `src/uci.ts` at `b71f8902`, with `−` 1 and `−` 4, and base's instrument is silent on both;
  - the empty case adds nothing and runs no pathspec diff (git shim);
  - limbs 2/3 match `341da4c1` on all 29 plants.
- **If `clause-b.mjs` changes again before the merge,** QE re-reads `A2`–`A7` first (the same rule as `…3e4b4a08` § 1).
- **`ABC-168`'s hold:** it lifts when `ABC-188` is on `main`. `ABC-188` merges first. The interim `--name-only` check stands until then.
- **`AR-163-UNCOMMENT`:** limb 1 is covered at this merge (UNC1). Limbs 2/3 stay open, LOW, owner Architect/Design, with the trigger unchanged. The Orchestrator records the partial.

## 3. `QE-188-a`: ACCEPTED as **`AR-188-BINARY`**
- **Rating: LOW,** with the interim control below standing, as QE proposed.
  - **Why LOW:** no L1 requirement fails at the tip. There are 0 binary production files at `main` and at `b71f8902`, and no `.gitattributes`. Reaching the gap takes a deliberate act.
  - **Without the interim control: MEDIUM,** the `F-095-1` class (a form that passes silently). Unlike `AR-163-DELONLY` at `ABC-163`, this gap can hide a widening: an ADDED `node:fs` import is invisible (QE Q11b, my plant 1). So the regression it could carry (`V5.2.1`, `V5.3.2`) is an L1 fail.
  - **Pre-existing on every limb since `ADR-0036`.** `ABC-188` neither introduces it nor widens it.
- **The route is wider than QE planted.** A committed `.gitattributes` line `src/** -diff` gives the same blindness on clean text files, with no odd byte in `src/` (plant 2). This applies when the instrument runs in a checkout that carries that file, and which checkout routing uses is `UNKNOWN - verify`. A textconv driver (plant 3) does not blind limb 1, and it needs a host-global config. It garbles limbs 2/3's line mapping, which is pre-existing; the fix closes it too.
- **Is § S1 (iv)'s retirement safe while this is open? Only with a replacement.** The retired `--name-only` check listed a binary holder. After the merge, nothing routine would.
  - **The `--name-only` check itself does not need to stay.** QE's line `git diff --numstat <base> <head> -- src | awk '$1=="-"'` covers routes 1 and 2 on every production file and every limb, not just holders. Its pathspec is fixed, so it has no empty-pathspec trap.
  - **Interim control (owner: the Orchestrator), from now until the fix lands:** at every routing, run QE's line in the same checkout and with the same `<base>`/`<head>` as the instrument. It must print nothing. If it lists a file, route that file to Security/NFR by hand as fired on every limb.
  - **Compensating controls:**
    - the AGENTS.md UAT-waiver pipe uses `--name-only`, so a binary `src/` change cannot ride the waiver;
    - a human merge review shows `Binary files … differ` on a `.ts` file;
    - QE reviews every ticket.
- **Fix (Architect/Design; BA/PM cuts it now, XS, P3; it gates no merge).** The instrument's one diff call reads `--text --no-textconv`. The harness gains a NUL plant and a `.gitattributes` `-diff` plant that FIRE on limb 1. BA/PM words how those rows read against `341da4c1`, which is blind to both. When it lands, it appends a dated `ADR-0036` § S1 block.
- **Closes when** QE reads both plants firing at head, and silent on base's instrument. The interim line then retires.

## 4. The rest
- **`R-188-a`: INFO, agreed** (Architect/Design). An undercount only. A holder with any hunk still fires (`…534bddbb` § 2).
- **`QE-188-b`: INFO, agreed** (Architect/Design). It is harness-only and has no security bearing. QE's reading rule stands.
- **A file deleted at `<head>` is missing from `production files changed`:** INFO, cosmetic. Ruling 2 now names it on limb 1. No action.
- **Security surface:** the instrument still uses `execFileSync` with an argv array and no shell (`V1.2.5` met). It has one diff call and no new write. The harness works on a scratch clone only.
- **`NFR-008`:** 0 / 0 / 0. No timing was taken.

## Accepted risks after this gate
- `AR-188-BINARY` (LOW, the Orchestrator; new);
- `AR-163-UNCOMMENT` (LOW, Architect/Design; limbs 2/3);
- `AR-095-READ` (LOW, Security/NFR; unchanged).

`AR-163-DELONLY` closes at the merge. **Required fixes before merge:** none.

## Owed
- **The Orchestrator:**
  - move `ABC-188` In Security/NFR → Ready for UAT (waived, 0 production lines) toward the owner's merge;
  - record the `AR-163-DELONLY` close and the `AR-163-UNCOMMENT` partial at the merge;
  - keep the `--name-only` check until the merge;
  - run the `--numstat` line from now until `AR-188-BINARY`'s fix lands;
  - route the cut to BA/PM;
  - commit the records.
- **BA/PM:** cut the `AR-188-BINARY` fix (XS, P3).
- **Architect/Design:** build it.
