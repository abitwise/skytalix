---
id: 20260817T120000Z-orchestrator-decision-owner-waives-uat-for-abc061-and-the-branch-sweep-8c1a44e2
kind: decision
by: orchestrator
at: 2026-08-17T12:00:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
  - AGENTS.md
  - memory-bank/60-progress.md
supersedes: 
---

# The owner waived UAT for `ABC-061` and ordered the unmerged branches merged. Both, and their limits

## What was asked and what was answered

He was asked the question the previous close-out instructed be asked — the third zero-production-line
ticket in a row — and, separately, whether he wanted a **standing rule** so he would stop being
interrupted.

**Project owner Olger Oeselg, 2026-08-17, in session, verbatim: *"yes, waive UAT for ABC-061 and
merge and unmerged branches."***

## Half 1 — the waiver. THIRD on identical grounds, and STILL not a standing rule

Same fidelity as the two before it, and the same three things it is not:

- **Not an acceptance signature.** The `In UAT` → `Ready to Release` exit was **skipped**, not taken.
  Nobody signed. Do not later read "the owner waived UAT" as "the owner accepted the work".
- **Not a `finding` and no stamp.** `context.human_admission` is still `off` and he did not flip it.
  This note is an agent's transcription of his words into git — the honest fidelity level, stated.
- **NOT A STANDING RULE, AND DELIBERATELY NOT FILED AS ONE.**

**He was asked the standing-rule question directly and he did not answer it.** He answered about
`ABC-061` and about branches; the rule question went unanswered. **Silence is not a yes.** An
unanswered question is the weakest possible ground for a permanent change to how this factory
gates work, and converting it into one would be manufacturing the consent he declined to give.
So: nothing is written to `memory-bank/60-progress.md` § Standing directives, and **the next
zero-production-line ticket ASKS HIM AGAIN — including the rule question, which is still open.**

Three identical yeses now. Recorded as a pattern, deliberately not converted into one.

## Half 2 — "merge and unmerged branches", read literally and then MEASURED

Read as *"merge any unmerged branches"*. Before acting on it I enumerated rather than assumed,
because a blanket merge instruction is the kind that quietly lands abandoned work:

```
git branch --no-merged main   ->   grugops/abc061-resolver-value-assertions   (ONE, and only one)
```

**16 branches exist; 15 are already merged into `main`.** The four stale worktrees from earlier
sessions (`ticket-to-pr-ABC-065-scribe`, `quality-gate-ABC-065-qe`, `quality-gate-ABC-066-qe`,
`security-nfr-ABC-066`) all point at branches **already in `main`** — they carry nothing unmerged.

**So the instruction collapses onto exactly the branch the first half of his sentence is about.
There is no second merge to perform, and no ungated or abandoned work was swept into `main` under
cover of a general instruction.** Had the enumeration shown an ungated branch, the merge grant would
NOT have covered it: `AGENTS.md` § Safety rules makes the standing authority *"approval to merge work
that PASSED, never to skip or soften a gate"* — I would have stopped and named it rather than merged
it on this sentence.

## What binds regardless

`quality.gate_enforcement` is `blocking` and the gate is re-run on `main` after the merge, not
assumed. `production_requires_human_confirmation` is still `true` and untouched. **No deploy is
performed and none exists to perform** (`AGENTS.md` § Deployment posture). The merge itself rests on
the owner's standing per-ticket merge authority, which is a separate grant and is not touched by the
waiver.
