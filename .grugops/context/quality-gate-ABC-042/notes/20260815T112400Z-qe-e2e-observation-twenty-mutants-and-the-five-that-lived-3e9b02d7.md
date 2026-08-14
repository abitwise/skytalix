---
id: 20260815T112400Z-qe-e2e-observation-twenty-mutants-and-the-five-that-lived-3e9b02d7
kind: observation
by: qe-e2e
at: 2026-08-15T11:24:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A6
  - A9
  - A2
  - A12
  - src/cli.test.ts
  - src/cli-options.ts
  - src/cli.ts
supersedes: 
---

# Twenty mutants against the delivered instruments — fourteen killed, five lived, one hung

**The suite is green on the delivered build and green is not the question.** The question the
subtask set is whether the instruments *fire*. Every mutant below was applied to the tree, **proved
to be on disk** before the run (a silently-unapplied mutation reads as a false "killed"), run against
`src/cli.test.ts` + `src/history-pane.nfr.test.ts`, and reverted with `git checkout -- src/`.

## The table

| # | mutant | verdict | killed by |
|---|---|---|---|
| `M1` | `--debug` **enumerated** in `ACCEPTED_ARGUMENTS` and handled | **KILLED** | `A6(i) — the exported enumeration EQUALS the table` **and** `A6(i) — an undocumented fifth flag is rejected and named` |
| `M2` | `--debug` handled as a **bare literal**, not enumerated | **KILLED** | `A6(i) — the enumeration is the ONLY argv literal in the delivered resolver` **and** the fifth-flag row |
| `M3` | `--verbose` **enumerated** — a flag the test file never names | **KILLED** | `A6(i) — the exported enumeration EQUALS the table` |
| `M4` | `--verbose` as a **bare literal** — likewise unnamed | **KILLED** | `A6(i) — the ONLY argv literal` |
| `M5` | an extra **bare value word** (`purple`) accepted — no dash to catch it | **KILLED** | `A6(i) — the ONLY argv literal` (its space-free-literal arm) |
| `M6` | `token.toLowerCase() === ASCII` — case folding on `--ascii` | **KILLED** | `A6(i) — the 18 near misses` |
| **`M7`** | **`token.startsWith(COLOUR)` — prefix matching on `--colour`** | **SURVIVED** | — |
| `M8` | `charCodeAt(0) === 45 && length > 7` — a flag sniff writing **no new literal at all** | **KILLED** | `A8 — neither delivered module names a row count` (the `45`), plus 10 behaviour rows |
| `M9` | `reject()` stops carrying the offending token (`offending: []`) | **KILLED** | `A5`, `A6(iii)`, `A6(i)` fifth flag, `A6(ii)` unnamed-arm, `bar 3` |
| `M10` | the word `random` leaked downstream in `ResolvedOptions` | **KILLED** | `A4 — 1000 resolutions` (its `JSON.stringify` leak counter) |
| **`M11`** | **a second, unvalidated argv read spelled `process["argv"]`, branched on after the resolver returned** | **SURVIVED** | — |
| `M12` | rejection path prints the **board on stdout**, then complains on stderr | **KILLED** | `A5` e2e, `A6(iii)`, `A9` stdout-count, `bar 3` |
| `M13` | `printableOf` neutered — the byte filter passes everything | **KILLED** | `bar 3`, and `A8`'s number transcription (`0x20`/`0x7f` vanish) |
| **`M14`** | **a binding published on `globalThis` without the `export` keyword** | **SURVIVED** | — |
| **`M15`** | **the merged licence guard's `toEqual` weakened to a subset** | **SURVIVED** | — |
| `M16` | `"cli.ts"` removed from `LICENSED_DRIVERS` — the **non-vacuity control** | **KILLED** | the merged guard **and** `A12`'s row |
| **`M17`** | **`A6(ii)`'s filter over-drops (CONTAINS instead of WHOLE FORM)** | **TIMEOUT 180 s — no clean RED** | — |
| `M18` | `token.startsWith(ASCII)` — the same weakening on a **one-token** flag | **KILLED** | `A6(i) — the 18 near misses` |
| **`M19`** | **`token.toLowerCase() === COLOUR` — case folding on `--colour`** | **SURVIVED** | — |
| `M20` | truncation tolerated on `--colour` (`COLOUR.startsWith(token) && token.length > 3`) | KILLED — **but not by `A6`** | `A8`'s number transcription (the `3`). Written without a numeric literal it would have lived |

## `M7` / `M19` — the one that matters, and it is not a near miss

`A6` exists so that *"an unrecognised argument never starts a game"*. Both survivors do exactly that:

```
resolveOptions(["--colourx","white"])        ACCEPTED -> {"colour":"white","orientation":"white-bottom",...}
resolveOptions(["--colour-anything","black"])ACCEPTED
node src/cli.ts --colourx black              -> 23-row board on stdout, exit 0
node src/cli.ts --COLOUR black               -> 23-row board on stdout, exit 0
```

**A full board, exit 0, on an argument the allowlist does not contain — and the suite is 856/856
green.** These are not exotic mutants: `startsWith` and `toLowerCase` are the two the test's own
comment says it is aimed at (*"aimed at the two mutants data-equality alone does not catch: prefix
matching (`startsWith`) and case folding"*).

**The mechanism, and it is a one-line defect.** `A6`(i) requires the near misses to be rejected
**"in its legal argv position"**. The row builds its cases like this:

```ts
for (const flag of [...TABLE_FLAGS, TABLE_COLOUR]) { ... cases.push([miss]); }   // ONE token
for (const value of TABLE_VALUES)                  { ... cases.push([TABLE_COLOUR, miss]); }  // two
```

`--colour` is grouped with the **flags** and tested in the **one-token** form. But `--colour`'s legal
argv position is **two tokens** — `--colour <value>`. In the one-token form `["--colourx"]` still
rejects, for the *wrong reason*: the value word is missing. The row asserts only `.ok === false`, so
the wrong-reason rejection satisfies it and the weakening is invisible.

`M18` proves the diagnosis rather than leaving it as an argument: the **same** `startsWith` weakening
applied to `--ascii` — whose legal argv position genuinely **is** one token — **is killed** by the
same row. The instrument works exactly where the argv position is right and fails exactly where it is
wrong. The three value words are fine: they already get `[TABLE_COLOUR, miss]`.

**`A6`(ii) is blind to it by construction**, as the criterion itself anticipates: the `--<word>`
shape would have to randomly generate a `--colour`-prefixed token, and the `--colour <word>` shape
hard-codes the exact accepted spelling.

**This is the same defect class that made this ticket what it is** — an `A6`(i) that looked
structural and was not, one layer deeper than the one the `Ready for Dev` exit caught.

## `M11` — `A9`(2)'s letter, and its purpose

`A9`(2): *"`process.argv` occurs exactly once … no second read and no branch on argv after the
resolver returns: the resolver is the exclusive validator (ASVS **V2.2.2 [L1]**)"*. The assertion is
`expect(entry.match(/process\.argv/g)).toHaveLength(1)`. A second read spelled `process["argv"]` is
**not** `process.argv`, so the count stays at 1 and the mutant ships green with an argument path the
resolver never validates. The engineer applied the *stronger* form (`not.toContain("process")` over
the whole source) to the **resolver** and the weaker count to the **entry point** — the asymmetry is
the hole. This is the same shape as `X8` in the `ABC-041` re-gate (`globalThis["process"]` beating a
narrow textual row); it recurred here in a different criterion.

## `M14` — `A2`'s letter, and its purpose

`export` is the letter; *"nothing can import a binding from it"* is the purpose. Hanging `main` on
`globalThis` publishes it without the keyword. Lower stakes than `M11` — it is still not an ESM
import, so the census and probe-root reasoning survive — but the row proves only the keyword.

## `M15` — the guard that stops guarding while staying green

Weakening `src/history-pane.nfr.test.ts`'s `expect(runtimeImporters).toEqual(...)` to an
`arrayContaining` subset **survives the whole suite**, which is precisely what that file's own
comment says must not happen (*"A subset … is green on both trees and would silently drop the kill
this equality buys"*). **The delivered build does not do this — I verified the comparator is intact
and the diff on that file is two hunks.** What the mutant shows is that nothing *asserts* it: `A12`'s
row checks the licence **array's contents** and not the comparator, so the only thing standing
between a merged guard and a silent subset is diff review. Reported, not repaired — that file is
merged and `A12` bounds what may change in it.

## `M17` — the "asserted first" control that cannot fail

`A6`(ii) requires each shape to *"still contribute 250 after filtering, **asserted first**"*, to
catch a filter that over-drops. The corpus is built by **rejection sampling**:

```ts
while (drawn.length < 250) { const c = generate(); if (!isAcceptedForm(c[0])) drawn.push(c); }
...
for (const [shape, drawn] of corpus) expect(drawn, `shape ${shape}`).toHaveLength(250);
```

`drawn` can only leave that loop at **exactly 250**, so `expect(drawn).toHaveLength(250)` is a
**tautology** — it cannot fail for any filter. I proved it: switching `isAcceptedForm` to the
CONTAINS reading the criterion forbids made the run **hang until the 180 s timeout**, never reaching
the assertion that is supposed to catch it.

**The delivered filter is correct** — whole-form only, four exact `JSON.stringify` comparisons, never
"contains" — so `A6`(ii) is MET. But the criterion's named detector for the failure it fears does not
detect; an over-dropping filter here is a **hang**, not a red. A control that reports the number of
*generator draws* (not the number kept) would be the instrument the criterion is describing.

## Method

Mutations applied by script with an anchor assertion (`MUTATE_FAIL` and abort if the anchor is not
found), `git diff --name-only` printed after each to prove the mutation was on disk, `timeout 180`
per run, `git checkout -- src/` between every mutant, and a clean `git status --porcelain` verified at
the end of every batch. `src/cli.ts`, `src/cli-options.ts` and `src/history-pane.nfr.test.ts` are
byte-identical to `8b07d9f` at this hop's tip — **no production behaviour was changed by this gate.**
