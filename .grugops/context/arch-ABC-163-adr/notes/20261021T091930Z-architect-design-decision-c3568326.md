---
id: 20261021T091930Z-architect-design-decision-c3568326
kind: decision
by: architect-design
at: 2026-10-21T09:19:30Z
verified_by: 
confidence: high
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
  - 20261021T091929Z-architect-design-observation-a76b1b2e
  - F-095-1
  - X1
supersedes: 
seal: sha256:0b3da3669971dad4bf7428908ec3eafb382d4622f3a6f41db32a2125a5cd8e5a
---

# Decision 1: `87d3897d` implements `ADR-0036` § S1 Ruling 2 as the ADR states it, including the base AND head union. The instrument's owner accepts it

**Each element of the ruling, mapped to the code** (evidence: `…a76b1b2e`).
- **"a `+` line of `git diff -U0 --no-renames <base> <head>`"** maps to `added`, which reads that same diff. The diff
  is limited to `src`, where every production file lives.
- **"anywhere in a production file"** maps to any `+` line, comment and blank lines included, behind `isProduction`.
- **"holds limb 1 in code at `<base>` or at `<head>`"** maps to `baseHolders ∪ holderSet`. Both come from the AST
  occurrence count, not the (b2) closure.
  - The `<base>` side carries weight. The SE's plant X1, a holder at `<base>` only, fires on it alone.
  - The `<head>` side adds nothing beyond (b1) today. A file becomes a holder only through a `+` line on the import,
    and (b1) already counts that line. It is kept because the ruling words it.
- **"for limb 1 only"** maps to `limb === 1`.
- **Security/NFR's empty case (`…b65b11b7`)** cannot occur. No pathspec is ever built, and the empty line says so.

**Not a deviation: deletion-only touches do not fire.**
- Ruling 2 says a `+` line. § Decision's DELTA never fires on a removal.
- At today's holder (one import, no parameter, one fixed path), a deletion cannot widen what it reads (plants D1, D2).
- The case re-opens with § S1's re-armed § Decision 3 trigger. That is the first holder that takes a caller-supplied
  value, where deleting a guard line could widen reach.
- **To Security/NFR, for information.** No ruling is owed unless Security/NFR wants deletion-only touches routed.
  That change is about three lines in `addedLines`.

**Role.** The page names Architect/Design as the builder, and the SE built it on the Orchestrator's dispatch. As the
instrument's owner, this role accepts `87d3897d` as the fold owed under `AR-095-L1UNIT`. No rebuild and no new path
are owed.

**In place is the right call.** The canonical pointer stays put, and the file at `341da4c1` reproduces every old
reading.

**Alternatives rejected.**
- **A new path.** It churns the pointer across about 30 notes and fenced pages, and it gains no reading.
- **Fire on any touched holder file.** It widens Ruling 2 beyond its words. That is Security/NFR's call, not the
  instrument owner's.

**NFR impact: none.** There are 0 tests, `NFR-008` is not triggered, and `plans/nfr-catalog.md` is unchanged.
