---
id: 20260818T101500Z-orchestrator-claim-i-spawned-a-stray-agent-at-the-live-repo-by-misusing-the-tool-8a17c4d3
kind: claim
by: orchestrator
at: 2026-08-18T10:15:00Z
refs:
  - ABC-106
  - ABC-034
confidence: high
verified_by:
supersedes:
---

# I spawned a stray agent at the LIVE repo. It did nothing, and it should never have existed.

## What I did

I intended to send a correction to an already-running agent. Instead I **spawned a new
`software-engineer` agent** and put the correction text in its `prompt` field, where it read as a
nonsense task. **Worse than the wasted call: I spawned it with NO worktree isolation**, so it held
`Write` / `Edit` / `Bash` against the live checkout while three other hops were in flight.

**Outcome measured, not assumed: 0 tool uses, no writes, `git status` clean.** It asked what I
wanted and stopped. **It behaved better than my dispatch did.**

## Why I am recording a near-miss that cost nothing

Because the cost was luck, not design. Every other agent this wave ran under `isolation: worktree`
**specifically** to mitigate recorded hazard `G5` (shared tree, single index), and this one did not —
for no reason except that I filled in the wrong tool. **A malformed prompt that happens to be
inert is the same dispatch error as one that is not.**

## The underlying correction, which was real and which I verified MYSELF

`ABC-106`'s page says `e8=K`'s **"re-classification"** is assigned to `ABC-034` `A8`. **Read at
`main` `7ea9e1b`, `A8` requires only that each input produce "exactly one of the SEVEN codes above —
the set stays at seven".** It does not mandate WHICH code and it re-classifies nothing; `ABC-034`'s
own Scope says `no-such-move` is "accepted there and not re-opened". **"Placement" is accurate;
"re-classification" claims more than the source says.**

**I checked `A8`'s text and `src/san.parse.test.ts:421` myself rather than relaying another hop's
report** — the shared verified context is the memory, and I am not a channel between agents. The
check is routed into the `ABC-106` QE hop as a citation audit, pointed at the repo text, not at my
word for it.

## Second error on this ticket, also mine

**My dispatch brief collapsed `ABC-106` `A2`'s two clauses into "32/32 on that file".** `A2` says the
file's own test count is unchanged AND `PERFT_DEEP=1` is `32/32`. Measured: the file is **30**;
`32/32` is perft-deep. **The engineer refused to absorb it silently and reported the collapse back**,
which is the behaviour this factory wants and the reason it did not become a false negative. The QE
brief carries the corrected numbers.

## Third, and it is the same root as the queue race

The `ABC-106` engineer reported that the ticket went `Backlog → In Review` in one hop with **no
rule-1 criteria re-read at the `Ready for Dev` exit**. **The re-read DID happen** — it is filed at
`.grugops/context/pull-next-wave-2026-08-18/notes/…criteria-review-at-ready-for-dev-exit-wave-2026-08-18…`
and it is what caught his ticket's one-line citation drift. **He could not see it: his worktree
branched from `main` before I committed the note.** Identical root cause to the queue race — I
dispatched from an uncommitted working tree. **Three agents, one bug, mine.**
