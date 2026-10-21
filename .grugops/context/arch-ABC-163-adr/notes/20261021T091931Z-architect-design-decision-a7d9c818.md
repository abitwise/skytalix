---
id: 20261021T091931Z-architect-design-decision-a7d9c818
kind: decision
by: architect-design
at: 2026-10-21T09:19:31Z
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
  - 20261021T091930Z-architect-design-decision-c3568326
  - AR-095-CWD
supersedes: 
seal: sha256:684d30fcccab4562c1c5640ad59ffdf353d53268469e8cd5dea1d25bad812189
---

# Decision 2: the `d8c073e2` line is accurate in what it states, and it retires the by-hand check once it is on `main`. Four precisions are owed; the exact text is below

**Accurate, checked against the code at `87d3897d`:**
- the edit is in place, and the pointer is unchanged;
- `341da4c1` reproduces the old readings;
- comments are included, and the output prints "fired by Ruling 2";
- the empty case adds nothing and runs no pathspec diff;
- limbs 2 and 3 are byte-identical.

**It retires the by-hand check: yes.** § S1 introduces the by-hand method as "how to apply Ruling 2 before the
instrument carries it", and the instrument now carries it. The retirement takes effect when `87d3897d` is on `main`,
because the Orchestrator routes with `main`'s copy.

**Owed, because the line does not state it:**
1. "in a file" should read "in a production file".
2. The by-hand method fired on a holder touched only by deleted lines, and the fold does not. Retiring a broader check
   without saying so is the missing *why* a later maintainer would need.
3. Limb 1 prints one added line. A record harness must run on the `341da4c1` copy for a byte comparison.
4. The close needs the merge as well as QE, and `AR-095-CWD`'s interim control moves to the instrument.

**Exact replacement** for the paragraph under `#### Ruling 2 folded — 2026-10-21 (ABC-163)` in `ADR-0036`. The
Orchestrator routes the change. Any hop with write access to the ADR may apply it on `grugops/ABC-163`.

> Commit `87d3897d` edits `.grugops/context/design-F-072-1/probe/clause-b.mjs` **in place**, so the canonical
> pointer above is unchanged. Readings taken before it reproduce from that file at `341da4c1`. For limb 1, (b1) now
> also fires on any `+` line, comments included, in a production file that holds limb 1 at `<base>` or `<head>`. The
> output prints "fired by Ruling 2". With no holder at either end, Ruling 2 adds nothing and runs no pathspec diff.
> Limbs 2 and 3 print byte-identical output. Limb 1 prints one added line, `(b1) Ruling 2 …`. The record harnesses
> take the instrument path as an argument, so a byte comparison with a pre-fold record runs them on the `341da4c1`
> copy.
>
> **One case the by-hand method caught and the fold does not.** A holder touched only by deleted lines has no `+`
> line, so Ruling 2 does not fire. The by-hand `--name-only` listed it. Today's holder takes no parameter and reads
> one fixed path, so a deletion cannot widen what it reads. § S1's re-armed § Decision 3 trigger re-opens this case
> (`arch-ABC-163-adr`).
>
> **The by-hand Ruling 2 check is no longer needed once this commit is on `main`.** `AR-095-L1UNIT` closes when QE
> reads `A1`–`A3` with its own plants and this commit merges. The Orchestrator records the close. From then on the
> instrument carries `AR-095-CWD`'s interim control, Ruling 2 by hand. Readings:
> `.grugops/context/ticket-to-pr-ABC-163/notes/` and `.grugops/context/arch-ABC-163-adr/notes/`.

**Not a gate.** The wording holds neither QE's verdict nor the close. It is recommended before the merge, so that
`main` never states the retirement without the deletion-only limit.
