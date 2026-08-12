---
id: 20260813T014000Z-security-nfr-claim-verdict-pass-with-risks-no-required-fix-owners-triggers-d4d2ec7f
kind: claim
by: security-nfr
at: 2026-08-13T01:40:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-019
  - ABC-018
  - ABC-026
  - ABC-028
  - ABC-029
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - NFR-002
  - NFR-008
  - ADR-0008
  - ADR-0009
  - ADR-0010
  - ADR-0011
  - src/turn-loop.ts
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# VERDICT: **`PASS_WITH_RISKS`** — **NO REQUIRED FIX.** `NFR-002` MET, `N8-LANE` MET at 0.75x, both seams' trust boundary HOLDS

> **`kind: claim` with `confidence: UNKNOWN - verify`, and that is the honest kind, not a hedge on the
> content.** `context.human_admission` is **`off`** and there is no `§14-gate` verdict record under
> this task, so a `finding` cannot be admitted and nothing is self-stamped. **The measurements in the
> sibling `observation` notes are what they are; this note's soft kind is a provenance fact about the
> stamp, not a doubt about the numbers.**

**A `P0` waiting is not a reason to soften, and nothing here was softened. Nothing needed to be.**
This is the gate `ABC-019` has never had in seven refinement hops, two returns to `In Development`,
one QE mutant campaign and one rebase, and it comes back clean on its own merits.

## Both halves ran. NEITHER was untriggered

The brief asked me to say so if one half was untriggered. **Both were triggered and both were run.**

- **Security half — triggered.** The change introduces two **trust boundaries** (the input seam and
  the engine seam) across which a value the loop did not produce reaches a board the loop owns, and it
  carries strings this product did not generate toward a terminal. That is a validation surface and an
  output-encoding surface, and it is squarely inside this role's triggers.
- **NFR half — triggered.** The ticket carries `NFR-002`'s three ply-count clauses plus its binding
  spy clause, `NFR-008` / `N8-LANE`, and `NFR-004`'s async contract.

`compliance_regime` is `[]`, so **no Compliance Officer handoff is owed** and none is invented.

## Why `PASS_WITH_RISKS` and not `PASS`

Every mandatory gate is green, no ASVS **L1** requirement fails, and no required fix exists. What
stops it being a bare `PASS` is four accepted risks — one of which is a **merge-hygiene** fact about
the tip rather than anything wrong with the loop.

`security.asvs_level` is **`L1`** (70 active requirements) and `security.block_on` is **`high`**.
**Nothing at `high` was found.** The L1 requirements this change actually engages, and how each lands:

| requirement | verdict | evidence |
|---|---|---|
| **V2.2.1** input validated by **positive allowlist** | **PASS, strongly** | `wasGenerated` is literally a membership test against `legalMoves(position)` on **all six fields** — and I broke each field individually and all four were rejected |
| **V2.2.2** validation enforced at a trusted layer, not relied on from the untrusted side | **PASS** | the loop enforces it **itself** on both seams rather than trusting either; `## Scope`'s "the stub returns a generator-owned Move" is a property of the test double and the loop does not rely on it |
| **V2.1.1** documentation defines the validation rule | **PASS** | `A10` / `A10b` state the rule, the six fields, and why `rejected` and a tenth reason were both refused |
| **V2.3.1** flows processed in the expected sequential order without skipping steps | **PASS** | eight states / fifteen transitions enumerated; the exit test's position between render and act is normative; `A3b`'s order re-derived on my own spy |
| **V15.3.1** only the required subset of fields returned | **PASS** | `LoopOutcome` is exactly `{result, reason, exitCode}` |
| **V1.3.2** no `eval` / dynamic code execution | **PASS** | swept: none in `src/turn-loop.ts`, and zero non-literal dynamic imports anywhere in production `src/` |
| V1.2.x (HTML/JS/SQL/OS-command encoding), V1.5.1 (XML), V3–V4 (web/API), V5 (file handling), V6–V10 (authn/session/authz/tokens/OAuth), V12 (TLS), V13.4.1, V14 (data protection), V17 (WebRTC) | **NOT APPLICABLE** | no HTTP, HTML, JS-string, database, OS command, XML parser, file I/O, user, credential, session, token, network or deployment surface exists in this change or this project (`ADR-0007`: deploys nowhere) |
| **V11** cryptography | **NOT APPLICABLE** | `zobrist.ts`'s PRNG is a hash-table index, not a security control; it is not "general cryptographic use" and treating it as one would be a fabricated control |
| **V16** logging and error handling | **NO L1 REQUIREMENT EXISTS** — every V16 item is L2/L3 | recorded honestly rather than scored; see `R-C` |
| **V15.1.1 / V15.2.1** third-party remediation time frames | **repo-level, pre-existing, NOT this change's** | `package.json` / `package-lock.json` diff vs `main` is **0 lines** — this ticket adds no dependency and moves nothing here |

## ACCEPTED RISKS — four, each with a NAMED OWNER and a DATED TRIGGER

| # | risk | severity | owner | trigger |
|---|---|---|---|---|
| **R-A** | **The loop is a pure pass-through for seam-supplied message strings and its `RenderSeam` contract records no sanitization obligation — and the control it delegates to is narrower than the ticket's sentence.** Measured: `src/frame.ts`'s `sanitize` drops C0 and `U+007F` always but everything above `U+007F` **only in `ascii` mode**, so in **`unicode`** mode the whole C1 block `U+0080`–`U+009F` survives into the frame, **including `U+009B` (CSI)**. The ticket says *"No security trigger of its own. The loop places strings; `ABC-018` sanitizes them."* | **LOW today**, and the requirement it would fail is **V1.3.3 — which is L2, outside the active L1 set**, so it does not block. **I am not overriding a default severity; I am recording which requirement it is.** Not reachable today: no CLI entry point, no real parser, no terminal in the loop's path. Whether a UTF-8 terminal *acts* on `C2 9B` is emulator-dependent — **`UNKNOWN - verify`** from here | **`EPIC-006`** wires the render seam and owns the glyph mode; **`ABC-018`** owns `sanitize` itself | **whichever comes first: `EPIC-003`'s real parser landing, or `EPIC-006`'s CLI entry point** — i.e. the first moment a string this project did not generate can reach a real terminal in `unicode` mode |
| **R-B** | **The repair primitive's domain is narrower than "repair".** `takeBack(history, 0)` rebuilds the **position** from the **move list**; a seam that appends to the list and then throws leaves a phantom ply and the repair **cements** it. Measured both ways. **`A9b`(i)'s replay clause HOLDS in both shapes** — this is outside the criterion, not a failure of it, and `## Scope`'s promise is about a *mid-mutation* board, which this is not | **LOW** | **`EPIC-003`** — it owns the `InputSeam` contract this constrains | **the first real `InputSeam` implementation that calls `playMove` rather than only `legalMoves`.** Today's stub does not, and a real parser filtering candidates has no reason to |
| **R-C** | **The engine `catch` has no binding (`catch {`) — the thrown value is discarded entirely.** Measured: a marker string in the engine's error reaches neither the `LoopOutcome` nor the sink. `engine-threw` says *that* it failed and nothing survives to say *why* | **LOW, and it is TWO-SIDED — stated as a trade rather than a defect.** It satisfies **V16.5.1** (L2 — generic message, no stack-trace exposure) **by construction**, and costs the only diagnosis a future engine failure could have had. **This project has no logging layer at all and V16 carries no L1 requirement, so requiring one here would be gold-plating** | **`EPIC-004`** — it replaces the seam and is where an engine failure becomes diagnosable; **`EPIC-006`** catches | **the first real engine behind that seam**, or the first time `engine-threw` is reported and nobody can say why |
| **R-D** | **The tip I gated is NOT `ABC-019` alone.** `git log main..HEAD` = **58 commits**; `git diff main -- src/` touches **six** files, three of them `ABC-028`/`ABC-029`'s. A green gate here attests to the **composite**, and merging this branch merges `ABC-028` and `ABC-029` with it | **MEDIUM as a merge-hygiene risk. It is NOT a defect and NOT a security finding** — the extra content is the stack that fixed the `A11` collision and is why this ticket is green at all | **the Orchestrator** — owns the merge order and the board | **before any merge of `grugops/security-nfr-ABC-019` to `main`.** `ABC-028` has a live QE hop; whether its and `ABC-029`'s state permits riding along is the Orchestrator's call, not mine |

**Inherited and NOT re-opened, exactly as this subtask instructed** — each already carries an owner
and a trigger I have no reason to move: **`S-1`** (the fd-3 channel is forgeable by
write-then-`exit(0)`; no in-process defence works), **`S-2`** (test-integrity exit `2` — **and I
re-confirmed it fires on this tip**, with the skip count a genuine measured `0`; owner a human, an
agent may not author the registry), **`N-1`** (`N8-LANE`'s session-dependent floor — I measured mine
beside it rather than inheriting either), **`N-2`** (the coverage headline's false miss).

## FLAGGED, NOT TAKEN — three record items, none of them mine to write

1. **The ticket's front matter has drifted from the board again.**
   `plans/tickets/ABC-019-turn-loop-skeleton.md` reads `status: in-development` / `column: In
   Development`; `plans/board.md` has it under **`## In Security/NFR (WIP 1/2)`**. **This exact drift
   was fixed once already on this branch** (`bc15ea0`, *"grug fix ABC-019 front matter drift, column
   now agree with board"*) and has re-opened because the board moved and the front matter did not.
   **Owner: the Orchestrator** (it took the fix last time and the board is reserved to it by this
   brief). **Trigger: before the next board move on this ticket.**
2. **The ticket's `## Security / NFR triggers` sentence *"the loop places strings; `ABC-018` sanitizes
   them"* is measurably narrower than it reads** — see `R-A`. **Owner: BA/PM** — amendments are BA/PM's
   on this ticket by its own repeated precedent (`A9b`, `A10b`, `[D54]` were all handed back rather
   than taken). **Trigger: the next amendment hop, or `R-A`'s trigger, whichever is first.**
3. **The board move `In Security/NFR` → `Ready for UAT` is this role's by the role contract, and I am
   HANDING IT OVER rather than taking it**, because this brief reserves `plans/board.md` to the
   Orchestrator in writing. **The gate's result is `PASS_WITH_RISKS` with no required fix, so the move
   is warranted on the merits** — subject to `R-D`, which is a merge question and not a UAT-readiness
   question.

## WHAT I WOULD NOT CARRY, in words

**1. I would not carry *"the loop places strings; `ABC-018` sanitizes them"* as an unqualified
sentence.** It is true in `ascii` mode and false for the C1 block in `unicode` mode, and I measured
both. This is the seventh instance of this stack's recurring shape — *"non-static"*, *"the maximum"*,
*"unreachable by any pattern"*, *"exactly one"*, *"the trees differ by exactly one file"*, *"the fd-3
channel cannot be forged"*. **The true sentence costs one clause: C0 and DEL are stripped in both
modes, everything above `U+007F` only in `ascii`.** The delegation is sound; its stated scope is not.

**2. I would not have reported my first `A9b` result.** It came back `fenRepaired: false` with a
surviving ply, on the `P0` that has waited longest, and it was **my fixture's shape and not the
loop's behaviour**. I re-ran it in the criterion's exact shape before writing anything, and it is
green. **The near-miss is on the record in the seam note rather than in a deleted file, because a
gate that only publishes the runs that came out convenient is not a gate.**

**3. I would not let this ticket's `NFR-002` premise be inherited a second time.** I built two
instruments from scratch — a TypeScript-**parser** AST closure and a **one-child-per-root** runtime
probe over 17 modules — and required them to agree (**17/17, zero disagreements**) and required the
positive control to fire (rooted at `turn-loop.ts` both **do** report `history.ts`). **A zero from an
instrument that cannot see a one is not evidence.**

**4. I would not claim my `N8-LANE` floor generalises.** Mine is ±140 ms with a **−10 ms** median at
3/8 — and a byte-identical tree is not 10 ms cheaper than itself, so that is noise and it is written
as noise. The record one hop back is ±390 ms on the same machine and method. **What makes this hop
report a number rather than a sixth floor is not a better instrument — it is that the effect is
+805 ms at 8/8 with a MINIMUM of +620 ms, which clears every floor on record.** A smaller ticket would
have been unresolvable here too, and `N-1` remains the real finding for `ABC-026`.

**5. I would not sign off on the merge on the strength of this gate.** The gate is on the loop and it
passes. `R-D` is about what else is in the branch, and that is the Orchestrator's decision, made with
the board in front of it. **Humans hold merge and deploy; I hold neither, and I did not merge, push,
deploy, enter another worktree, or check out `main`.**
