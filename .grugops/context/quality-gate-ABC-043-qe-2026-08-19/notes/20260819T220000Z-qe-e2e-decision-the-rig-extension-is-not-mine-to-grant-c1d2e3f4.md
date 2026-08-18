---
id: 20260819T220000Z-qe-e2e-decision-the-rig-extension-is-not-mine-to-grant-c1d2e3f4
kind: decision
by: qe-e2e
at: 2026-08-19T22:00:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-037
  - ABC-035
  - ABC-019
  - ADR-0009
  - ADR-0011
  - ADR-0013
  - src/cli.test.ts
  - src/command-input.ts
supersedes:
---

# The `A3` substitution of `./command-input.ts` is an EXTENSION, and it is **NOT QE's to grant**. It goes to Architect/Design.

**I do not approve it, and I do not refuse it. I decline to rule it, and I stop on that point.** The
brief put the question to me first and told me not to approve a contract extension to keep a ticket
moving. I did the work to make the next hop short rather than to make the decision for it.

**The engineer classified it correctly.** It IS an extension, not an application, and flagging it
rather than smoothing it is the reason this hop has anything to weigh. Nothing below is a criticism
of the build.

## Why it is an extension and not an application — the reading, stated once

BA/PM's licence has two clauses, and they are not the same kind of thing:

- *"The rig is licensed for the **ENGINE seam** under `A2`/`A5` **only**."* — a SCOPE clause.
- *"Substituting `./line-input.ts`, `./frame.ts` or `./turn-loop.ts` would test the harness instead
  of the product."* — three NAMED refusals.

The reading that makes `A3` an application treats the three names as exhaustive: what is not on the
list is allowed. **That reading loses to BA/PM's own words.** They wrote `only`; they wrote *"the rig
is NOT a licence to substitute modules generally"*; and they wrote down the misread to expect —
*"BA/PM licensed module substitution, so mock anything"*. The three names answer that misread. They
are not the fence; `only` is the fence.

## The material fact Architect/Design should decide on, which neither side's summary states

**`./engine.ts` is reached through an INJECTED SEAM. `./command-input.ts` is not reached through a
seam at all.**

`createEngine(...)` is passed to `runTurnLoop` as the `engine` option — a typed injection point on a
merged contract. Substituting that module is materially indistinguishable from passing a double at
that injection point, which is exactly why BA/PM could say *"a constructed fault at a seam is a test
double by definition"* and be right.

`resolvePromptLine` is reached by a **hard static import inside `src/line-input.ts`**
(`src/line-input.ts:56` — the only production importer in the tree, measured). There is no seam, no
option and no injection point. So the rig is not standing in for an injection that exists; it is
**rewriting a merged production parser's source in the child**, and by doing so it changes the
observable behaviour of `./line-input.ts` — **one of the three modules BA/PM named by name** — without
substituting `./line-input.ts`'s file.

**That is the whole question, and it is a conformance question about where a test double ends and a
rewritten product begins.** `ADR-0009` clause 9c and `ADR-0013` clause 3 draw that line, and both are
Architect/Design's. BA/PM only reached the criterion question because `ADR-0013` clause 7 handed it to
them **by name**; nothing hands this one to BA/PM, and nothing hands it to QE.

## What I MEASURED, so the ruling hop does not have to re-measure it

Every one of these is mine, run in a contained worktree at `46457b8`.

| what | result |
|---|---|
| `src/cli.ts` exports | **0** — `grep -n "export" src/cli.ts` returns nothing. `ADR-0011` clause 4 intact |
| production lines added outside the entry point | **none** — `git diff --numstat 54cbb23 46457b8 -- src` is `src/cli.test.ts` and `src/cli.ts`, nothing else |
| the seven merged modules | **byte-identical** — `git diff --stat 54cbb23 46457b8` over `turn-loop`, `frame`, `render-seam`, `line-input`, `engine`, `move-input`, `command-input` is empty |
| a flag / env var / export needed by the rig | **none** — `--import` is child-only and appears in no `package.json` script |
| **is the delivered reader really total?** | **YES, and I did not take it on trust.** 71 pathological lines (empty, whitespace, `\r`, 10,000 chars, `😀`, `♞`, `\x1b[2J`, `__proto__`, `constructor`, SAN edge cases, coordinate garbage, format specifiers) fed to the delivered product on one run: **exit 0, `internal error` count 0, 37,526 bytes emitted.** No human input reaches `A3` |
| a real throw path below the seam | **one exists and it is not reachable from input** — `src/turn-loop.ts:362` throws when the `InputSeam` returns a move not in `legalMoves`, which the delivered reader cannot produce |

**So BA/PM's first limit — the one they said decides whether the ruling still applies — is untouched,
and the engineer's premise is confirmed by measurement rather than accepted.** `A3` cannot be reached
without substituting SOMETHING. The alternatives are refused by name (`./line-input.ts`) or by
`ADR-0013` clause 3 (an env gate), so the in-licence option is **to leave `A3` unbuilt** — the
criterion the ticket says decides the ticket.

## The two arguments, put fairly, since a ruling hop deserves both

**FOR granting it.** No module the licence names is substituted. No production line, export, flag or
env var was added, and I verified that rather than read it. The substituted module is a transparent
conduit here, not the subject: what `A3` asserts is the ENTRY POINT's `try`/`catch`, and the real
`line-input.ts`, the real `turn-loop.ts` repair-and-rethrow, and the real process exit code all run —
I ran the child by hand and watched exit **70** with one fixed line. It plays `ABC-019` `[D31]`
straight: *a parser bug*.

**AGAINST granting it.** The rig was licensed on a reasoning — *a constructed fault at a seam is a
double by definition* — that does not transfer, because there is no seam here. It is applied one layer
deeper, to a merged, `Done`, separately-gated production parser (`ABC-035`), and its effect is to
change the behaviour of a module the licence forbids substituting. If this is an application rather
than an extension, then *"never substitute `./line-input.ts`"* is satisfiable by substituting whatever
`./line-input.ts` imports, and the second limit means nothing.

## What I am NOT saying

- **Not** that `A3`'s build is wrong. It is the strongest of the three shapes and the engineer refused
  the two that touch `src/`.
- **Not** that the ticket fails. See the verdict note: everything else was attacked on its own terms
  and `A3`'s evidence is sound *if the instrument is licensed*.
- **Not** that a new ADR is required. Architect/Design may rule this in one line either way; what it
  may not do is arrive by default because a QE hop wanted to keep a ticket moving.

## The one thing I ask the ruling hop to answer explicitly

**Does the licence fence the MODULE LIST or the SEAM?** Everything else follows from that, and the
answer should be written where the next reader finds it — because the same question returns the day
`ABC-044` needs a fault the delivered product cannot produce either.
