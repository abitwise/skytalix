---
id: 20261021T152923Z-security-nfr-observation-534bddbb
kind: observation
by: security-nfr
at: 2026-10-21T15:29:23Z
verified_by: 
confidence: high
refs:
  - ABC-188
  - grugops/ABC-188
  - grugops/qe-ABC-188
  - 66d6a2f1
  - d722a6b6
  - eb097a7b
  - da348a79
  - 85b462f0
  - b71f8902
  - ADR-0036
  - ADR-0036 S1
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - QE-188-a
  - QE-188-b
  - R-188-a
  - V1.2.5
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261021T093522Z-security-nfr-decision-3e4b4a08
  - 20261021T152354Z-qe-e2e-observation-0b73ec04
  - 20261021T152354Z-qe-e2e-observation-b2674938
  - 20261021T150717Z-architect-design-decision-7d78d7cc
supersedes: 
seal: sha256:4d0f11146f8a3919bb1cf151d13bcf9d0de48155a5fd4001ae8addec73649126
---

# Security/NFR readings on ABC-188: the A8 text against `…75a45be0` § 2 and `…3e4b4a08` § 2–3, the instrument diff, and QE-188-a re-measured with two more routes (a `.gitattributes` `-diff` line and a textconv driver)

Cites the page's `## Scope` (four files) and its `## Security / NFR triggers` (`AR-163-DELONLY`, a records read of `A8`) as authoritative. Read only: `grugops/ABC-188` @ `66d6a2f1` (code `d722a6b6`, ADR `eb097a7b`) and `grugops/qe-ABC-188` @ `da348a79` (merge `85b462f0`). Plants are in a fresh scratch repo under the session scratchpad. No timing was taken.

## 1. The A8 block, line by line
`git diff -U3 main...grugops/ABC-188 -- memory-bank/50-decisions/`: one hunk at `:469`, numstat `25 0`. The block `#### Ruling 2 widened — 2026-10-21 (ABC-188)` sits after the `ABC-163` block.
- **(i)** matches `…75a45be0` § 2's wording word for word: "any changed line, `+` or `−`, comments included, in a production file that holds limb 1 in code at `<base>` or `<head>`". It says limb 1 only and limbs 2/3 unchanged. That matches.
- **(ii)** a holder deleted or renamed away at `<head>`: it held limb 1 in code at `<base>`, and under `--no-renames` all its lines are `−`. So my words already cover it. It is not a widening of my ruling.
- **(iii)** matches `…75a45be0` § 2 and `…3e4b4a08` § 2 (the empty-holder case is kept).
- **(iv)** retires the `--name-only` check. `…3e4b4a08` § 5(c) limited that retirement "until `AR-163-DELONLY`'s trigger fires without its fix". With the fix on `main`, that limit is spent. The text is accurate as a statement about `AR-163-DELONLY`. It says nothing about `QE-188-a` (§ 3 below).
- **(v)** "on QE's read of `A2`–`A7` (D1 and D2 included)" is a superset of the term in `…3e4b4a08` § 2 (G-1b and the import-line drop) plus `…75a45be0` § 2 (D1 and D2 must fire). The Orchestrator records the close. That matches.
- **(vi)** matches `…3e4b4a08` § 3 ("For limb 1 alone, `AR-163-DELONLY`'s fix already catches it"). Limbs 2/3 stay open, LOW, owner Architect/Design.
- **Rollback** "re-opens at MEDIUM while a second holder stands, and the by-hand check returns" matches the rating in `…3e4b4a08` § 2.

## 2. The instrument diff (`main...grugops/ABC-188`, `clause-b.mjs`)
- **Call surface unchanged:** `execFileSync("git", args)` with an argument array and no shell (`V1.2.5`). There is still one `diff -U0 --no-renames <b> <h> -- src` call, and no new subprocess or write. QE's git shim agrees: 79/87 calls, base = head.
- **`R-188-a` re-read.** `removed` counts from the `@@ -a,N` header, so the hunk that holds a `-- ` content line is counted before that line is parsed. A misparse can only (a) drop the counts of later hunks for the same file, or (b) point `old` at a different path, which over-counts (the safe direction). So a holder with any hunk still fires. **INFO, agreed.**
- **Harness.** `mk` compares sorted `--cached --name-only --no-renames` against the named files, and exits 2 with the plant's name. Plants use `perl -0pi` on a scratch clone. QE read `status`, `HEAD` and 46 refs unchanged. This adds no new surface.

## 3. QE-188-a re-measured, plus two routes QE did not plant
Fresh scratch repo. Base: `src/h.ts` holds `import { readFileSync } from "node:fs";`. git 2.56.0.
| plant | `diff -U0 --no-renames` | `--text` (`--no-textconv` for row 3) | `--numstat` | `--name-only` |
|---|---|---|---|---|
| 1. NUL in a comment, plus an ADDED `import { writeFileSync } from "node:fs";` | `Binary files … differ`, no hunk | real hunks; the `+` import is at line 3 | `-	-	src/h.ts` | lists it |
| 2. Clean text edit (the same added import), plus a committed `.gitattributes` `src/** -diff`, checked out | `Binary files … differ`, no hunk | real hunk | `-	-	src/h.ts` | lists it |
| 3. The same, but with `src/** diff=bin` and the owner's GLOBAL `diff.bin.textconv hexdump -v -C` | hexdump lines, wrong line numbers | real hunk | `1	0` (numstat does not apply textconv) | lists it |
- **`git show <rev>:<file>`** (`analyse`, `:83`) prints the raw blob under `diff=bin`, so textconv does not reach the AST side. Only the one diff call is exposed.
- **The tree today:** there is no `.gitattributes` at `main` or at `grugops/ABC-168`, and `.git/info/attributes` is absent. `git diff --numstat <empty-tree> <rev> -- src | awk '$1=="-"'` prints nothing at `main` and at `b71f8902`, so there are 0 binary production files.
- **Route 2 needs no odd byte in `src/`.** A one-line `.gitattributes` blinds every limb on every file it matches. It applies only when the instrument runs in a checkout whose working tree carries that file. Which checkout the Orchestrator routes from: `UNKNOWN - verify`. QE's `--numstat` line catches routes 1 and 2.
- **Route 3 does not blind limb 1.** The holder's diff still has hunks, so Ruling 2 fires on any file that holds limb 1 at either end, including a file that gains it. It garbles the line mapping that limbs 2 and 3 use. That is pre-existing, and the retired check never covered limbs 2/3. It needs both a committed attribute and a host-global textconv driver (present on this host). QE's `--numstat` line does NOT catch it.
- **What the retired check saw.** `--name-only` with a holder pathspec listed a holder under all three routes. After `ABC-188`, the instrument sees route 3 on limb 1 by itself. On routes 1 and 2 it sees nothing on any limb.
