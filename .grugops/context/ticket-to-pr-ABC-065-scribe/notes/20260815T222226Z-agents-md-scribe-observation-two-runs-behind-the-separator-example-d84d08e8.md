---
id: 20260815T222226Z-agents-md-scribe-observation-two-runs-behind-the-separator-example-d84d08e8
kind: observation
by: agents-md-scribe
at: 2026-08-15T22:22:26Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - src/cli-options.ts
supersedes: 
---

# The two runs behind the example I recorded — and one place the ticket's prose is wrong

`AGENTS.md` § Commands forbids recording a command nobody ran, and `ABC-065` exists *because* an
unrun command was published. Both commands below were RUN by hand on branch
`grugops/ticket-to-pr-ABC-065-scribe` at `4e9ed1d`, working tree clean of `src/` changes, **before**
a byte was written into `AGENTS.md`. `npm` is **11.7.0**, Node per `## Stack` (>= 22).

## Run 1 — the command I recorded

```
npm run chess -- --colour black
```

**Exit `0`.** npm echoed `> node src/cli.ts --colour black` — the flag **reached the program**. The
board printed black-bottom: rank `1` on the top row, rank `8` on the bottom, file legend
`h g f e d c b a`, `White to move  1.`, `material: 0`. This is the invocation `ABC-065` § Scope names
and the one test note 4 asks be run once by hand. It is now the text at the slot.

## Run 2 — the failure the comment claims, measured rather than repeated on faith

```
npm run chess --ascii
```

**Exit `0`**, a board printed, and npm echoed `> node src/cli.ts` — **with no arguments at all**. The
option never reached the program; the package runner consumed it. The board printed is the DEFAULT
board, not an ASCII-flagged one. This is the path `ABC-065` § Problem describes and it reproduces.

## `O1` — the ticket's "no signal at all" is measurably too strong (severity: LOW, owner: BA/PM)

`ABC-065` § Problem says the reader gets *"a board, exit `0`, and the option silently discarded. The
user is never told... the only measured path where a person asks for something, is given something
else, and gets **no signal at all**."* npm 11.7.0 **does** emit one line:

```
npm warn Unknown cli config "--ascii". This will stop working in the next major version of npm.
```

Measured stream: **stderr** (`2>&1 1>/dev/null` reproduces it; `2>/dev/null` suppresses it and stdout
still carries the board). So the honest statement is narrower and still supports the ticket: the
signal exists, it is on the **other stream** from the board, it is worded as an **npm config**
problem rather than "your chess option was dropped", and it is **version-dependent** (npm's own text
says the behaviour changes in the next major). The user is told something, by the wrong tool, about
the wrong thing, where they are not looking.

**This does not weaken `A1` and I changed no criterion.** It is prose in § Problem, and ticket prose
is BA/PM's pen, not mine. I wrote the slot comment to the **measured** behaviour ("warns ... on
stderr ... prints the DEFAULT board and exits 0 — the option is silently discarded and stdout looks
like success") rather than transcribing the ticket's stronger sentence into `AGENTS.md`, because this
file may not carry a claim its own author has not measured.
