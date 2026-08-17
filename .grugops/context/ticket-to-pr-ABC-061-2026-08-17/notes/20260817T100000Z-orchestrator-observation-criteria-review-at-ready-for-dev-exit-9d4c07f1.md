---
id: 20260817T100000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-9d4c07f1
kind: observation
by: orchestrator
at: 2026-08-17T10:00:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
  - src/cli.test.ts
  - src/cli-options.ts
supersedes: 
---

# `ABC-061` criteria re-read against the built tree — the `Ready for Dev` exit (project process rule 1)

Read on `main` @ `86594fb`, working tree clean. The page was cut **2026-08-15**; since then
`ABC-065`, `ABC-066`, `ABC-067`, `ABC-071` and `ABC-068` have all landed in `src/cli.test.ts`, which
grew from 856 to 861 tests. **Six gaps. None blocks the pull. One of them, left uncorrected, would
have caused an engineer to protect the wrong line and leave a merged criterion's instrument
unguarded.**

## `G-A` — EVERY `src/cli.test.ts` line number on the page has drifted, one by 91 lines

| the page says | the tree at `86594fb` |
|---|---|
| `:359` — the `.ok`-only accepting row (`A6(i)`) | **`:450`**, inside the block at `:441`–`:452` |
| `:353` — element-for-element equality | **`:438`** (`expect(ACCEPTED_ARGUMENTS).toHaveLength(TABLE.length)`) |
| `:780` — the `spawned` pin | **`:862`** |
| `:247` — the 1000-iteration `random` property | **`:329`** (`it("A4 — …1000 times, with zero spawns")`) |
| `:274` — the byte-exact `white` child | the child is declared at **`:147`** (`white: run("--colour","white","--unicode")`) |

**`src/cli-options.ts:153` is the one number on the page that is still exact** — it reads
`      flags: { ascii, unicode },`. The mutation target `A1` and `A4` name is intact, so both
witnesses can be reproduced exactly as written.

## `G-B` — the dangerous one: `A5` protects `:359`, and `:359` is no longer the row it means

`A5` requires that "`:359` is **byte-identical**". Line 359 today is
`    const white = boardRegionOf("unicode", "white-bottom");` — an unrelated line in a frame-region
block. **The row `A5` exists to protect is at `:450`.**

This is worse than the same-class drift found on `ABC-068`, and the reason is the direction of the
criterion. `ABC-068`'s stale number pointed an *editing* instruction at the wrong line. **`A5` is a
PROTECTIVE criterion: pointed at the wrong line it protects something nobody was going to touch,
while leaving the merged `A6(i)` instrument it means to fence completely unguarded** — and it would
still be reported MET. Protect the row **by identity, not by number**: the `it("A6(i) — every
documented spelling resolves in its legal argv position")` block, and specifically its
`expect(resolveOptions(argv).ok, …).toBe(true)` line.

## `G-C` — `A2`'s "(Today: 6 of 6 are `.ok` only)" understates the problem, and the ticket still scopes it correctly

At the cut there was one accepting-path `.ok`-only site. There are now **four** `.ok` assertion sites
in the file — `:450` (accepting, `ABC-042` `A6(i)`), `:547` (rejecting), and **two added since the
cut**: `:904` (`ABC-066`, over advertised argvs) and `:989` (`ABC-065`, over the documented argv).
Three of the four are accepting-path and assert `.ok` alone.

**No criterion needs changing.** `A2` is scoped to "the new blocks" and `## Out of scope` fences
merged rows, so the ticket's work is unchanged. **Recording it because the ticket's premise got
BROADER while it sat in `Backlog`, and a hop that reads "6 of 6" will think it has seen the whole
problem.** Whether `:904` and `:989` deserve the same treatment is a BA/PM question, not this hop's —
**do not widen this ticket to cover them.**

## `G-D` — `A1`'s and `A4`'s witness baseline `856/856` is stale; it is **861/861** on 30 files

Measured by me on `main` @ `86594fb`. Both criteria ask for **RED**, which is a verdict and not a
count, so neither is weakened — but a hop that mutates and sees 861 must not read the changed number
as the mutation having done something. **Measure the green baseline yourself before mutating.**

## `G-E` — `## Dependencies` names `ABC-042` "merged at `dbaf972`" and lists neighbours that have since landed

`ABC-057`–`ABC-060` and `ABC-062`–`ABC-064` are still in `Backlog`, so the "ordering, not blockers"
reasoning holds. But `ABC-065`/`ABC-066`/`ABC-067`/`ABC-071`/`ABC-068` — **not on the page at all,
because they did not exist at the cut** — have all merged into this same file. The textual-conflict
risk the page asks me to sequence is therefore **already discharged for those five**; the live
constraint is unchanged and is the one this factory has now applied twice: **one hop at a time in
`src/cli.test.ts`.** Nothing else holds that file: `In Development` 0/3, queue empty.

## `G-F` — a shape detail the page never states, and `A2` cannot be satisfied without it

`resolveOptions` returns a **discriminated union** (`src/cli-options.ts:88`–`90`):
`{ ok: true, options: ResolvedOptions } | ({ ok: false } & UsageError)`. **The "whole resolved
options object" `A2` and Test note 2 demand is `.options`, not the top-level result** — and it is
`{ colour, orientation, flags }` where `flags` is `{ ascii, unicode }` (`src/glyph-mode.ts:49`).
An engineer who compares the top-level result whole will fold `ok: true` into the expectation and
write a passing assertion that is not the one the ticket asked for.

## What was confirmed intact, by reading rather than assuming

- **The mutation target** — `src/cli-options.ts:153` is byte-exact as quoted on the page. Both
  mutants are reproducible verbatim.
- **`A6`'s spawn pin** — `spawned` is **10**, by a live assertion (now at `:862`).
- **The `.ok`-only defect itself** — `:441`–`:452` lists exactly the six accepted argvs (`[]`,
  `--ascii`, `--unicode`, and `--colour` × three values, built off `TABLE_VALUES`) and asserts
  nothing but `.ok`. **The premise of the ticket is true, today, as written.**
- **`A3`'s pairing rule is real** — `src/cli-options.ts:152` derives
  `orientation: resolved === WHITE ? "white-bottom" : "black-bottom"`, so a mismatched pair is a
  reachable build, not a hypothetical.

## Effect on the pull

**Pull stands. DoR 10/10 unchanged, size `S` unchanged, priority `P1` unchanged.** Six gaps recorded
HERE, at this exit, which is what the control measures. **No criterion was edited and the ticket page
was not opened.**
