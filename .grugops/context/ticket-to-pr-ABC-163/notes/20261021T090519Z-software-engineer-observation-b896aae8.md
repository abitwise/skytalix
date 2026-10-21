---
id: 20261021T090519Z-software-engineer-observation-b896aae8
kind: observation
by: software-engineer
at: 2026-10-21T09:05:19Z
verified_by: 
confidence: high (every row re-run after the label fix)
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/ABC-163
  - 87d3897d
  - d8c073e2
  - ccccc6bb
  - plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
  - 1671f24f
  - 0974102f..2307fc11
  - 3ea3e352..98ea0a84
  - dbaf972f^..dbaf972f
  - .grugops/context/secnfr-ABC-095-s3/notes/20261012T151900Z-security-nfr-observation-s3-readings-clause-b-items-2-8-cwd-children-c24fec8e.md
  - .grugops/context/secnfr-ABC-101/notes/20261012T213100Z-security-nfr-decision-abc101-result-pass-with-risks-ar-nfr004-a-re-accepted-4bed890a.md
supersedes: 
seal: sha256:a6bfe428f7c83a9ea67d68c31e69c1a2146777db4968ebe298a065a62b7ffecd
---

# ABC-163 acceptance readings, OLD (`341da4c1`) vs NEW (`87d3897d`) instrument: A1–A5 met

**Method.** Both instruments were copied into the session scratchpad, outside the repository, with `node_modules`
symlinked. OLD is `git show 341da4c1:.grugops/context/design-F-072-1/probe/clause-b.mjs`. The plant repository is
`git init` plus `git archive 1671f24f`, as one base commit (`77c38363`). Each plant is one commit off that base. Real
pairs were read in a `git clone --no-checkout` of this repository. No timing was taken.

| criterion | pair | OLD limb 1 | NEW limb 1 | NEW (b1) Ruling 2 line |
|---|---|---|---|---|
| `A1` P2b | `/etc/passwd` in `src/book-file.ts` | does not fire | **FIRES** | `src/book-file.ts (fired by Ruling 2: 1 + line; holds limb 1 at <base> and <head>)` |
| `A1` P2c | `readBookFile(path: string)`; `cli.ts` `read: () => readBookFile(\`data/opening-book/${colour}.json\`)` | does not fire | **FIRES** | `src/book-file.ts (… 2 + lines …)`. `cli.ts` is not a holder, so it is not named |
| `A2` | comment-only edit, `book-file.ts:9` | does not fire | **FIRES** | `src/book-file.ts (… 1 + line …)` |
| extra X1 | the import is replaced by a local stub (holder at `<base>` only) | does not fire | **FIRES** | `… holds limb 1 at <base>` |
| `A3` | `dbaf972f^..dbaf972f` (`ABC-042`) | does not fire | does not fire | `no limb-1 holder at <base> or <head>; adds nothing` (0 lines) |
| `A4` | `0974102f..2307fc11` (`ABC-095`) | FIRES | FIRES | `holders 0 at <base>, 1 at <head>; … 1` → `src/book-file.ts (17 + lines; at <head>)` |
| `A4` | `3ea3e352..98ea0a84` (`ABC-101`) | does not fire | does not fire | `holders 1 at <base>, 1 at <head>; holder files with + lines: 0` |

- **A1 and A2:** 2 of 2 plants, plus the comment plant, FIRE on limb 1 under NEW, with (b1) naming `src/book-file.ts`.
  On every plant, limbs 2 and 3 read "does not fire" under both instruments.
- **A3:** Ruling 2 adds 0 lines, and the limb-1 verdict equals OLD's. A git shim on `PATH` logged NEW's 43 git calls
  on this pair. The only `diff` was `diff -U0 --no-renames dbaf972f^ dbaf972f -- src`. There was no `--name-only` and
  no holder pathspec. The other calls were `show`, `ls-tree` and `rev-parse`.
- **A4, `ABC-095`:** limb 1 FIRES on (b1) `src/book-file.ts:13 import { readFileSync } from "node:fs";` and (b2)
  `src/cli.ts -> src/book-file.ts (holds it)`. Limb 2 FIRES on (b1) `src/cli.ts:177`. Limb 3 does not fire. The holder
  union across limbs is **4** (`book-file.ts`; `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`). Ruling 2 adds
  `src/book-file.ts`.
- **A4, `ABC-101`:** all three limbs do not fire. The holder union is **4**. Ruling 2 adds nothing:
  `src/book-file.ts` has no `+` line (the changed files are `cli-options.ts`, `cli.ts` and `level-seam.ts`).
- **Regression, 9 pairs × 3 limbs** (A4's two pairs, plus F-072-1's seven: `dbaf972f`, `34c9c026`, `4c33b72b`,
  `460b9f58`, `088e48db`, `6bfc7b29..5f48753f`, `f76e041`):
  - limbs 2 and 3: OLD and NEW are **byte-identical**, 18 of 18;
  - limb 1: the only change is the one added Ruling 2 line (plus its file line on `ABC-095`), and the verdicts are
    equal, 9 of 9.
- **A5:** `ADR-0036` § S1 has the dated `#### Ruling 2 folded — 2026-10-21 (ABC-163)` paragraph, naming `87d3897d`
  and retiring the by-hand step. `git diff --numstat ccccc6bb d8c073e2 -- src/` is empty (0 lines).
- **A defect caught by the plants.** On the first run, NEW printed "FIRES (disputed: unresolved, the fail-safe)" on
  P2b, P2c and A2. The verdict label did not yet count Ruling 2. It was fixed before `87d3897d`, and the table above is
  the re-run.
- **For QE:** P2b, P2c and the comment plant are each one `sed` on the `1671f24f` archive. The plant script was
  `bin/plants.sh` in the scratchpad, and it was not committed (the fence keeps plants out of the repository).
