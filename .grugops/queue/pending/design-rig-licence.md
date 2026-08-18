---
task: design-rig-licence-2026-08-19
subtask: design-rig-licence
role: architect-design
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-043-the-live-session.md
ref: .grugops/context/design-rig-licence-2026-08-19/
parent_ref: .grugops/context/quality-gate-ABC-043-qe-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T23:00:00Z
branch: grugops/design-rig-licence
base: grugops/quality-gate-ABC-043-qe-2026-08-19 @ HEAD
---

# Subtask: `G-01` — does BA/PM's rig licence fence the MODULE LIST or the SEAM?

**`ABC-043` is BLOCKED on this and QE stopped rather than granting it.** Two roles have now refused
to rule it: the engineer flagged its own rig as an **extension** rather than an application, and QE
declined to approve a contract extension to keep a ticket moving. **Both refusals were right. It is
yours.**

Read `parent_ref:` (QE's five notes) and `.grugops/context/refine-ABC-043-2026-08-19/notes/`
(BA/PM's licence) first.

## The question, in one line

**`ABC-043`'s `A3` substitutes `./command-input.ts` in a child process. BA/PM licensed the
`registerHooks` rig "for the ENGINE seam under `A2`/`A5` **only**". Is that an application of the
licence or an extension of it?**

## The material distinction QE drew — and I verified it first-hand

| | how it is reached |
|---|---|
| `./engine.ts` | **an INJECTED seam** — `createEngine(...)` is passed to `runTurnLoop` as the `engine` option. Substituting it is materially identical to passing a double at an injection point **that already exists**. |
| `resolvePromptLine` | **a HARD STATIC IMPORT** — `src/line-input.ts:56`. **Measured by me at `main`: `src/line-input.ts` is the ONLY production importer of `command-input.ts`.** There is no seam, no option, no injection point. |

**QE's argument, which I am not endorsing and not dismissing:** the rig is not standing in for an
injection — it rewrites a merged production parser's source in the child, and its *effect* is to
change the observable behaviour of **`./line-input.ts`, one of the three modules BA/PM named by
name**, without substituting that file. If that is an *application*, then *"never substitute
`./line-input.ts`"* is satisfiable by substituting whatever `./line-input.ts` imports, and the
second limit means nothing.

QE also notes BA/PM's list is not the fence — **`only` is** — and that the three named modules
answer a *different* misread BA/PM had written down.

## What is NOT in dispute — measured, so you need not re-derive it

- **`src/cli.ts` exports 0.** `ADR-0011` clause 4 intact. Verified by me and by QE.
- **The `src/` diff is `cli.ts` + `cli.test.ts` only**; the seven merged modules are
  **byte-identical**; no flag, no export, no env var. **BA/PM's FIRST limit — the one it said
  decides whether the ruling still applies — is intact.**
- **`A3`'s behaviour is right.** QE ran the child by hand: exit 70, one fixed line, no chess word,
  one frame, no result screen; the catch-and-exit-0 mutant reds on `A3` and `A4`.

## The fact that makes this a real dilemma rather than a tidy no

**QE did not take the totality claim on trust.** It drove **71 pathological lines** through the
delivered product in one session — empty, `\r`, 10,000 chars, `😀`, `\x1b[2J`, `__proto__`, SAN
edge cases, format specifiers — and got **exit 0, zero `internal error`, 37,526 bytes**. The one
real throw below the seam (`src/turn-loop.ts:362`) is **unreachable from the delivered reader**.

**So no human input can reach `A3`. If the rig is out of licence, the in-licence option is to leave
`A3` UNBUILT** — not to build it another way. That is the cost of ruling narrowly, and you should
rule with it in view rather than discover it after.

## What I need

1. **Rule it.** Application, or extension requiring a widened licence, or out of bounds.
2. **If the licence needs widening, say what the new fence IS** — precisely enough that `ABC-044`
   and `ABC-045` inherit a rule rather than a precedent. QE notes this returns the day `ABC-044`
   needs a fault the product cannot produce either.
3. **If you rule it out of bounds, say what `A3` becomes** — left unbuilt and recorded, re-scoped by
   BA/PM, or something else. **Do not leave `ABC-043` with a criterion that is neither met nor
   dispositioned.**

## Fences

- **This is `ADR-0009` 9c / `ADR-0013` 3 territory and both are yours.** BA/PM only reached the
  criterion question because `ADR-0013` clause 7 handed it to them **by name**; nothing hands this
  one to QE, which is why QE stopped.
- **Do not weaken `ADR-0011` clause 4** to make this easier — `src/cli.ts` exporting nothing is what
  the rig exists to preserve.
- **Do not rule `NFR-008` / `N8-LANE`** — `ADR-0014` is yours already and is not re-opened here.
- **Zero production lines.** Nothing under `src/`.
- Do not merge, do not deploy, do not move a board column. Write an ADR if it deserves one; if you
  do, update the count line in `memory-bank/00-index.md` **in the same commit** (it has gone stale
  twice, and `ADR-0014` took it to fourteen).

## Gate

No `src/` change. Contained lane; record unchanged: **1189 tests / 39 files, skip 0** at the QE tip.
An isolated agent worktree has no `.claude/worktrees/`; the repo root is contaminated and that trap
has cost me three bad measurements.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/design-rig-licence`. **Commit incrementally.**

Commit on `grugops/design-rig-licence`, never on `main`.
