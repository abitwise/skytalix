---
id: 20261021T154400Z-ba-pm-decision-2edce8cb
kind: decision
by: ba-pm
at: 2026-10-21T15:44:00Z
verified_by: 
confidence: high
refs:
  - ABC-191
  - ABC-188
  - ABC-168
  - ABC-189
  - ABC-190
  - AR-188-BINARY
  - QE-188-a
  - QE-188-b
  - AR-163-UNCOMMENT
  - ADR-0036
  - ADR-0036 S1
  - 341da4c1
  - 1ee70c63
  - V1.2.5
  - NFR-008
  - plans/tickets/ABC-191-a-production-file-git-treats-as-binary-hides-every-changed-line-from-clause-b.md
  - plans/board.md
  - 20261021T154351Z-ba-pm-observation-d4004b45
  - 20261021T153032Z-security-nfr-decision-f5843a71
  - 20261021T152923Z-security-nfr-observation-534bddbb
  - 20261021T153240Z-orchestrator-decision-9f5ca4b4
supersedes: 
seal: sha256:380f1c6af7a1ab672c1960fe4484ef6841c87c0fe97ae653fade0aa4ac6fde5c
---

# BA/PM cut for `AR-188-BINARY`: `ABC-191` in Ready, XS, P3, DoR 10/10, builder Architect/Design. Four files, 0 `src/` lines; it gates no merge. Closes on QE's read of `A2`–`A7`

Cites Security/NFR `…f5843a71` § 3 (the rating, the fix shape and the close term) and the owner record `…9f5ca4b4` as authoritative. The readings are in `…observation-d4004b45` (this task). The page `plans/tickets/ABC-191-a-production-file-git-treats-as-binary-hides-every-changed-line-from-clause-b.md` is authoritative for scope and acceptance.

## The cut
- **Scope:**
  - `clause-b.mjs`'s one diff call reads `--text --no-textconv`;
  - `r2-mutants.sh` gains `BIN-NUL` and `BIN-ATTR`, both FIRE, `src/book-file.ts@<base>`;
  - `r2-mutants.out.txt` is regenerated;
  - one dated `ADR-0036` § S1 block retires the `--numstat` stand-in.
- **How the new rows read against `341da4c1`** (Security/NFR asked BA/PM to word this). `341da4c1` is blind to both plants. So on those two rows, limbs 2/3 are compared with `341da4c1`'s output on X1 (the same edit without the marker), plant ids masked, with the reference taken with X1 checked out. The 10 existing rows keep the same-plant byte comparison.
- **Acceptance:**
  - **A2:** base is red on exactly `BIN-NUL BIN-ATTR` (limb 1) and the 4 limb diffs.
  - **A3:** each flag alone falls short. `--no-textconv` only reads as A2; `--text` only passes the harness but misreads TXC.
  - **A4:** head 12/12, with the two references named.
  - **A5:** counts 2/4 and 1/3.
  - **A6:** TXC reads X1's 1/3 by hand.
  - **A7:** a git shim shows one diff call carrying both flags, with the call count equal to base, and `V1.2.5` held.
  - **A8:** the ADR has 0 `−` lines and one block stating (i)–(iii) plus a rollback.
  - **A9:** gates equal base.
  - All but A7's call count and A8/A9 were measured at cut on the prototype.
- **Size XS:** one argv, two rows and one reference comparison, and an ADR block that restates a measured fact. **P3:** it gates no merge, and the stand-in holds the risk at LOW.

## Fenced out
- a textconv harness row (read by hand, `A6`);
- a `.git/info/attributes` row (the same flag covers it; measured);
- any ruling change;
- the deleted-file `production files changed` omission (INFO);
- `AR-163-UNCOMMENT` limbs 2/3;
- `QE-188-b`;
- any change to the repository's `src/`, `biome.json` or `.gitattributes`.

## For the Orchestrator
- Keep the `--numstat` stand-in at every routing and merge until `ABC-191` merges. Measured at cut: `.git/info/attributes` is a third blinding route, and the stand-in catches it only in the same checkout as the instrument.
- Pull `ABC-191` when convenient. It has no file overlap with `ABC-168`, `ABC-189` or `ABC-190`.
- No Security/NFR gate is required; QE's read closes `AR-188-BINARY`.

## For the owner
Nothing to decide for this cut. It is P3 and gates no merge. Which checkout routing runs from stays `UNKNOWN - verify` (`…534bddbb` § 3). It stops mattering once this lands.

Next free id: **ABC-192**.
