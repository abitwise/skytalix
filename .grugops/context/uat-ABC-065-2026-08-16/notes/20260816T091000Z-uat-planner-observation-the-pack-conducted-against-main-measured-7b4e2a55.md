---
id: 20260816T091000Z-uat-planner-observation-the-pack-conducted-against-main-measured-7b4e2a55
kind: observation
by: uat-planner
at: 2026-08-16T09:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - AGENTS.md
  - src/cli.ts
  - src/cli.test.ts
  - src/cli-options.ts
supersedes: 
---

# The pack CONDUCTED against `main` — every scenario run, with exit codes and output shape

Environment, stated so a re-run is comparable: `main` @ **`722bd9d`**, working tree carrying no `src/`
or `AGENTS.md` modification (`git status --porcelain`: only `plans/board.md`, another hop's, and
untracked `.grugops/` context). **node `v24.12.0`, npm `11.7.0`.** Every command below was **actually
run in this hop**; nothing is carried on faith from a prior note, and where I am carrying a prior
figure I say so.

---

## `S1` — the page shows me how to pass an option. **PASS**

```
$ grep -c -- 'npm run chess -- ' AGENTS.md
1
```

**From 0 at the cut to 1.** The slot, read whole, carries the invocation **inside** the slot's HTML
comment, so it falls in the span the guard scores:

> `Pass an option AFTER `--`: `npm run chess -- --colour black` — RUN 2026-08-15 at `4e9ed1d`, exit 0,`
> `black-bottom board. The separator is load-bearing; do not tidy this example away.`

The slot is **9 lines**, one list item plus its comment. A reader meets a runnable command and a
one-clause reason it is written that way.

## `S2` — what the page shows me actually runs. **PASS**

Copied verbatim from the page:

```
$ npm run chess -- --colour black
EXIT=0
```

**27 stdout lines** (npm's 3-line banner + a blank, then the program's **23 rows**), **stderr empty**.
npm echoed `> node src/cli.ts --colour black` — **the flag reached the program.** The board is
black-bottom: rank `1` on the top row, rank `8` on the bottom, legend `h g f e d c b a`,
`White to move  1.`, `material: 0`. This is the shape the slot promises, on a third independent hand.

## `S3` — every listed option works as shown. **PASS — 5 of 5, and all five visibly do something**

Each run through the documented separator form:

| invocation | exit | echoed command line | stderr |
|---|---|---|---|
| `npm run chess -- --colour white` | **0** | `> node src/cli.ts --colour white` | empty |
| `npm run chess -- --colour black` | **0** | `> node src/cli.ts --colour black` | empty |
| `npm run chess -- --colour random` | **0** | `> node src/cli.ts --colour random` | empty |
| `npm run chess -- --ascii` | **0** | `> node src/cli.ts --ascii` | empty |
| `npm run chess -- --unicode` | **0** | `> node src/cli.ts --unicode` | empty |

**Exit 0 is not enough and I did not stop there** — a flag that is accepted and ignored is exactly the
defect this ticket is about, one level down. So each was checked for a visible effect:

```
white  legend:  a b c d e f g h        black legend:  h g f e d c b a
--ascii   rank 8:  8 .r:n.b:q.k:b.n:r
--unicode rank 8:  8 .♜:♞.♝:♛.♚:♝.♞:♜
default   rank 8:  8 .r:n.b:q.k:b.n:r
```

`--colour` flips the orientation; `--unicode` prints figurines; `--ascii` prints letters and is the
current default rendering, so it is the one option whose effect is **not** distinguishable from the
default on this terminal — recorded honestly rather than scored as a difference I did not see.

## `S4` — the page does not hide an option from me. **PASS, both directions**

Documented `--`-tokens in the slot: `--colour`, `--ascii`, `--unicode` — **3**.
`--`-prefixed elements of `ACCEPTED_ARGUMENTS`: `--ascii`, `--unicode`, `--colour` — **3**.
**Equal as sets, both directions.** `--colour`'s three value words `white`, `black`, `random` all
appear in the slot. The measurement is made by the suite at run time off `ACCEPTED_ARGUMENTS`, not by
me reading two lists — and I falsified it in both directions rather than trusting it (`S7`/`S8` below).

## `S5` — the page's warning about omitting `--` is true. **PASS, reproduces exactly as written**

```
$ npm run chess --ascii
EXIT=0
> node src/cli.ts                    <- NO arguments reached the program
stderr: npm warn Unknown cli config "--ascii". This will stop working in the next major version of npm.
rank 8:  8 .r:n.b:q.k:b.n:r          <- the DEFAULT board
```

Every clause of the slot's warning is true on this machine: *warns `Unknown cli config "--ascii"` on
stderr* — yes; *runs `node src/cli.ts` with NO arguments* — yes; *prints the DEFAULT board and exits 0*
— yes; *the option is silently discarded and stdout looks like success* — yes. **The page now describes
the trap it used to walk the reader into.** The Scribe's `O1` correction holds and is the honest
statement: the user IS told something, on the other stream, by the wrong tool, about the wrong thing.

## `S6` — the plain command still works. **PASS**

```
$ npm run chess
EXIT=0     stderr: empty
$ node src/cli.ts | wc -l
23
```

**23 rows exactly**, which is what `AGENTS.md` has claimed since `ABC-042`. `npm run chess` prints 27
stdout lines of which 4 are npm's banner. No regression to the accepted `ABC-042` behaviour.

## `S7` / `S8` — will anyone notice when this goes stale? **PASS — 5 of 6 mutants RED**

Conducted as a separate falsification campaign in an **isolated linked git worktree** so the shared
tree was never mutated (two hops run concurrently here — `G5`). Full table in this task's
falsification `observation` note. Headline: the four mutants a real editor would produce all **RED**,
each naming the offending token, and the code-side drift that `EPIC-006` will actually cause
(`--depth` accepted, documented nowhere) **REDs on three rows**. The sixth mutant is the known
`Q8` weakness and stayed green — reported, not hidden.

## `S9` — nothing else broke. **PASS**

Run by this hop on `main` @ `722bd9d`:

| check | command | result |
|---|---|---|
| suite | `npm test` | **859 passed / 859, 30 files**, exit 0, 2.22 s |
| the ticket's own file | `npx vitest run src/cli.test.ts` | **32 passed / 32**, 12 ms |
| lint | `npm run lint` | **exit 0** — 54 files, 127 ms, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |

## `S10` — nothing already accepted was disturbed. **PASS, measured four ways**

**`ABC-042`'s `A1` acceptance block, extracted BY CONTENT** (the re-worded `A2`'s fence — from
`it("A1 — AGENTS.md's \`Dev / run\` line ...` to its closing `});`), hashed at four commits:

| commit | what it is | sha1 (first 12) | lines |
|---|---|---|---|
| `dbaf972` | `ABC-042`'s merge | `240d0c66b450` | 12 |
| `c5a5493` | `ABC-065`'s guard commit | `240d0c66b450` | 12 |
| `460b9f5` | `ABC-065`'s merge to `main` | `240d0c66b450` | 12 |
| `HEAD` (`722bd9d`) | `main` today | `240d0c66b450` | 12 |

**Byte-identical across all four.** This is an independent confirmation of QE's `6effd96e…` result by a
different extraction and a different hash function — the two agree that the block did not move, and
mine is fenced by content, which is the whole point of the `A2` re-wording.

**The changed surface, from the delivered commits themselves** (`.grugops/` process substrate excluded
per the Orchestrator's standing ruling for this ticket):

| commit | non-`.grugops` paths | numstat |
|---|---|---|
| `39122ec` | `AGENTS.md` | `6 1` |
| `c5a5493` | `src/cli.test.ts` | `85 0` — pure append, **0 deleted** |

**Two paths. Zero files under `src/` other than the one `.test.ts`. Zero production lines.** The
`CHILDREN` map in `src/cli.test.ts` has **10 keys — I counted them myself**, so `spawned` is 10 → 10 and
this ticket added no child process. The substring `- Dev / run: \`npm run chess\`` — the literal
`ABC-042`'s merged row asserts — is still present in `AGENTS.md`.

---

## Scoreboard

**10 scenarios conducted, 10 PASS, 0 FAIL, 0 unrun.** One scenario (`S3`) carries a recorded honest
caveat: `--ascii` is indistinguishable from the default rendering on this terminal, so its *visible*
effect could not be separated from doing nothing — its arrival at the program was confirmed by npm's
echoed command line instead.

**Not re-measured at this hop, and named rather than implied:** `A5`'s "no second spelling in the added
lines" (a code-hygiene property with no user-visible surface — QE's figure of 0 of 6 accepted arguments
in the 85 added lines stands), and `N8-LANE` (this ticket added 0 test files and 0 spawns; the
catalog's paired instrument was not run and my absolute readings would not substitute for it).
