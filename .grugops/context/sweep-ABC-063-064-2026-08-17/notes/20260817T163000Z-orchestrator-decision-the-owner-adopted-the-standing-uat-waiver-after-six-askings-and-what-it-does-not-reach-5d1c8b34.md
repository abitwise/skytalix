---
id: 20260817T163000Z-orchestrator-decision-the-owner-adopted-the-standing-uat-waiver-after-six-askings-and-what-it-does-not-reach-5d1c8b34
kind: decision
by: orchestrator
at: 2026-08-17T16:30:00Z
verified_by:
confidence: high
refs:
  - ABC-063
  - ABC-064
  - ABC-061
  - ABC-062
  - ABC-068
  - AGENTS.md
  - memory-bank/60-progress.md
supersedes:
---

# The owner ADOPTED the standing UAT waiver — the question asked six times across six tickets

## His words, verbatim and entire, 2026-08-17

> **"skip UAT for ABC-063, and yes make it a standing rule"**

Eleven words, two clauses, and they are **not** the same kind of instruction. This note exists so
that distinction survives.

## What each clause is

**Clause 1 — `"skip UAT for ABC-063"` — a NAMED WAIVER, and a waiver is not a signature.** One
ticket, named. Identical in form to the four before it (`ABC-068`, `ABC-061`, `ABC-062`, and the
first). **No UAT was conducted on `ABC-063` and nobody signed anything.** It carries no
`human:<name>` stamp; `context.human_admission` is still `off` and he did not flip it. This is a
hand-authored transcription in git, and that is the honest fidelity level.

**Clause 2 — `"yes make it a standing rule"` — the ANSWER to a question asked six times and never
answered.** The four previous waivers each drew the standing-rule question and each time he answered
the ticket, not the rule. This time he answered the rule. **The record of "four askings, zero
answers" now closes at six askings, one answer.**

## What the rule IS, stated no wider than the question he answered

The question he said "yes" to was, in my words at the close of the sweep:

> *"should 'zero production lines, test-only change' become a standing UAT waiver, so this stops
> consuming a round-trip every time?"*

**The rule, therefore: a ticket whose DELIVERED DIFF contains zero production lines — a test-only
change — has its UAT step waived standing, and moves `Ready for UAT` → `Done` without a UAT being
conducted and without the owner being asked per ticket.**

### The criterion is MEASURED from git, never asserted

At the `Ready for UAT` exit the Orchestrator measures the delivery commit first-hand:

```
git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'
```

**Empty output, and only empty output, invokes the rule.** A ticket page claiming "zero production
lines" is not evidence; the diff is. Both tickets in this sweep were measured that way before the
rule was applied to either — `e6697f6` **`63 0`** and `9957ddf` **`121 0`**, `src/cli.test.ts` only,
no non-`.test.ts` file under `src/` in either.

### The boundary, written sharply because this is exactly the rule that will drift

- **ANY production line → the rule does NOT apply.** Not "mostly test". Not "one trivial line". One
  production line and the ticket needs the owner's word as before.
- The rule waives **UAT only**. It does not touch `quality.gate_enforcement` (still `blocking`), the
  merge authority, or `production_requires_human_confirmation` (still `true` — he did not flip it
  and no inference may).
- It creates **no signature**. A waived ticket has had no UAT and carries no acceptance. `Done`
  under this rule means *merged and gated*, never *accepted by a human*.
- It is **the owner's and revocable**, on the same terms as every other standing directive here.

## The scope call I had to make, and how to reverse it

**He named `ABC-063` and did not name `ABC-064`**, though my question named both. Two readings:

1. the standing rule takes effect now, and `ABC-064` — sitting in `Ready for UAT`, measured at zero
   production lines — is covered by it;
2. the rule starts with the NEXT ticket, and his silence on `ABC-064` was deliberate.

**I took reading 1**, and the reason is the rule's own stated purpose: he adopted it so this would
stop consuming a round-trip every time, and holding the one ticket already in the column to ask a
seventh time would defeat the thing he just granted. `ABC-064` meets the criterion on measurement,
not on assertion.

**So the two tickets close under DIFFERENT authorities, and the board says so:** `ABC-063` by his
named word, `ABC-064` by the standing rule applied to a measurement of mine. **If reading 2 was what
he meant, one line reverses it and I will reopen `ABC-064`** — a board move, nothing else, since the
merge and the gate were never in question.

## What is now owed elsewhere

`AGENTS.md` § "Test and UAT authority" says every ticket to date deferred UAT and describes the
per-ticket asking. That section and `memory-bank/60-progress.md` (where this project's standing
directives actually live, `AGENTS.md` being a pointer to them) must carry this directive. **Routed
to the AGENTS.md Scribe** — that is its one job and this is a precedence-bearing edit, not the
Orchestrator's to make in passing.
