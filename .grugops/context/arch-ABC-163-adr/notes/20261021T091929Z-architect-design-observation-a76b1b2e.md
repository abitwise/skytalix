---
id: 20261021T091929Z-architect-design-observation-a76b1b2e
kind: observation
by: architect-design
at: 2026-10-21T09:19:29Z
verified_by: 
confidence: high (code read at 87d3897d; three scratch plants, OLD and NEW instrument)
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/ABC-163
  - 87d3897d
  - d8c073e2
  - dc4d4f15
  - 341da4c1
  - 20261021T090518Z-software-engineer-decision-78d30164
  - 20261021T090519Z-software-engineer-observation-b896aae8
  - .grugops/context/secnfr-ABC-095-s3/notes/20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7.md
  - .grugops/queue/claimed/arch-ABC-163-adr/arch-ABC-163-adr.md
  - 1671f24f
  - F-095-1
  - src/book-file.ts
supersedes: 
seal: sha256:d3ccd1d11ee3413b69a280ba2f8312a57ca55cccf1a6953bf25334e441bc2bfa
---

# ABC-163 fold, read by the instrument's owner: code at `87d3897d`, ADR line at `d8c073e2`, three scratch plants

**What was read.**
- `git show 87d3897d` (+24/−2), and the whole instrument at `87d3897d`.
- `ADR-0036` § S1 at `dc4d4f15`, and the SE's four notes (`…78d30164`, `…b896aae8`, `…a61bb150`, `…83110c81`).
- Security/NFR `…b65b11b7`.
- QE's done record `qe-ABC-163` did not exist when this was read. Nothing here uses QE's result.

**Code facts at `87d3897d`.**
- `added` holds each production file with its `+` line numbers. It comes from the one
  `git diff -U0 --no-renames <base> <head> -- src` that the instrument already ran. A file with only `-` lines enters
  with an empty set. A file deleted at `<head>` does not enter.
- `baseHolders` holds the production files at `<base>` with at least one limb-1 occurrence. They come from the same
  AST scan that `<head>` uses. `holderSet` is the same at `<head>`. Both mean "holds limb 1 in code", not the
  (b2) runtime closure.
- Ruling 2 fires for each file in `added` that has at least one `+` line and is in `baseHolders ∪ holderSet`. It
  runs only for limb 1.
- No new git call is made and no pathspec is built. The empty-holder line prints when both sets are empty.
- For limbs 2 and 3, `ruling2` stays empty and no new line prints. `fires` and the verdict label reduce to the old
  expressions, so the byte identity holds by construction.
- `341da4c1` is the last commit to touch the file before `87d3897d` (`git log` of the path).

**Scratch plants.** The repository is `git archive 1671f24f src package.json` plus one commit per plant, in the
session scratchpad, outside this repository. OLD is the `341da4c1` copy and NEW is the `87d3897d` copy. By hand is
`git diff --name-only --no-renames <base> <head> -- src/book-file.ts`, with holders 1 at `<base>`.

| plant | OLD limb 1 | NEW limb 1 | by hand | limbs 2, 3: OLD vs NEW |
|---|---|---|---|---|
| P2b: `readFileSync("/etc/passwd")` | does not fire | **FIRES**: Ruling 2 names `src/book-file.ts`, held at `<base>` and `<head>` | lists the file | byte-identical |
| D1: delete only comment line 5 of `src/book-file.ts` | does not fire | does not fire (holders 1 and 1; `+` lines 0) | **lists the file** | byte-identical |
| D2: delete only the `node:fs` import line | does not fire | does not fire (holders 1 and 0; `+` lines 0) | **lists the file** | byte-identical |

- **The one divergence from the by-hand method** is a holder touched only by deleted lines. The by-hand method fires
  on it and the fold does not. Ruling 2's words are "a `+` line". The SE's decision note `…78d30164` states the same
  choice.
- **Harnesses that grep `(b1)`:** `design-ABC-072/probe/mutants.sh`, `design-F-072-1/probe/f-mutants.sh`,
  `design-F-072-1/probe/fixtures.sh` and `secnfr-ABC-072/probe/sec-mutants.sh`. Each one takes the instrument path
  as an argument. No routing tool parses the output, and nothing in `AGENTS.md` or `tools/` calls the instrument.
- **The holder's own header**, `src/book-file.ts:5`, says "any edit to this file routes to `In Security/NFR`".
  Under the fold, a deletion-only edit does not route.
- No timing was taken. Nothing in this repository was written by the plants.
