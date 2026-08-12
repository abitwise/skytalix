---
id: 20260812T080000Z-software-engineer-decision-one-definition-two-rules-0649eceb
kind: decision
by: software-engineer
at: 2026-08-12T08:00:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ABC-017
  - NFR-002
  - NFR-008
  - ADR-0002
  - ADR-0008
  - ADR-0011
  - RISK-ABC017-04
  - src/history-pane.nfr.test.ts
  - src/history-pane.ts
supersedes:
---

# The mechanism I chose for each clause, and why — `A5` drove every one of them

> **Hand-authored.** There is **no `scripts/` directory in this repository at all** — re-checked at
> source at this hop, not inherited: `ls scripts` fails, a `find` for `claim*` / `context-io*` across
> the repo (outside `node_modules`, `.git` and the queue's own `claim.md` records) and across the kit
> root `/Users/olgeroeselg/.grugops/agent-factory` returns nothing, and
> `mcp__grugops__propose_note` is **not** in this session's tool set. So `scripts/context-io.ts` does
> not exist, note kind / id / front matter are written by hand, and there is **no derived
> `index.md` / `index.jsonl`** for this `ref:` — `notes/` is the source of truth and stands alone.
>
> **`kind: decision` needs no stamp.** Nothing at this hop is recorded as a `finding`: there is no
> `§14-gate` verdict record under this task to issue a `§14-gate#<id>`, and `context.human_admission`
> is **`off`**, so no `human:<name>` exists either. Gate results are `observation`.

## 0. The shape, in one line

**One expression (`ADR-0011` cl. 1) + two different per-guard rules about it (cl. 2 and cl. 3), each
declared once with its citation.** That is the *"name a SET plus a per-guard rule about it"* shape
`A1`'s own trap note sanctions, and it is the only shape that keeps `perft-bench.ts` inside the
regex's reach while keeping it out of the probe's roots **without a filename**.

## 1. The one expression — `productionModulesIn`

```ts
const productionModulesIn = (directory: string): readonly string[] =>
  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));
```

Both guards call it and nothing else builds a file set. The two `readdirSync(...).filter(...)`
literals that were duplicated at the two sites are now one function; **that is the mechanical
agreement `A1` asks for**, not a comment asserting agreement.

**I made it a function rather than a module-scope `const`** because the two guards compute the
directory differently — the regex guard holds a `.pathname` string, the probe holds a `URL` — and a
shared `const` would have forced one of them to change how it addresses the directory. A parameter
was the smaller diff. It is **not** a single-use abstraction: it has two call sites, which is the
entire point of the criterion.

## 2. The probe's rule — `FRAME_PRODUCERS`, declared (cl. 2)

`roots = production.filter((file) => FRAME_PRODUCERS.includes(file))`.

**The two exclusion literals are DELETED, not replaced, and no third is created.** I did not write
`file !== "turn-loop.ts"` and did not need to: the loop is green because it is not a declared frame
producer, which is *by the property*.

**Why the roots are an intersection with `production` rather than the declared list itself:** it
keeps the probe's set derived from cl. 1's one expression, so a declared name that stops existing
degrades to "not rooted" instead of to a crash inside the child. It also means the two guards' sets
are provably drawn from the same source, which is what `A1` is counting.

**I did NOT reach for a derived frame path.** The design hop already refuted that by construction
(`closure(frame.ts) = 1`; composition is by injection) and I did not re-litigate it. I did re-measure
the consequence that matters to the build: the ruled root set is **5 roots / closure 11**, a strict
subset of the delivered **14 roots / closure 14** on this tree.

## 3. The regex's rule — `LICENSED_DRIVERS`, an EQUALITY over the entries that EXIST (cl. 3)

```ts
expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));
```

**This is the mechanism `A5` forced, and I arrived at it by writing the three forbidden builds first
and measuring what killed each** (sibling `observation` note). The existence proof BA/PM recorded —
*"equality against the licence entries whose file exists in the production set"* — is what this is;
it was offered as a proof and explicitly not mandated, and I adopted it because after measuring the
alternatives I could not construct a cheaper one that satisfies all five rows.

**Both sides of the equality are `production.filter(...)`, deliberately.** They are drawn from the
same array in the same order, so `toEqual`'s order sensitivity can never produce a spurious red from
`readdirSync` ordering. Filtering `LICENSED_DRIVERS` instead would have compared two differently
ordered lists the day a second driver is licensed.

**What this buys and what it costs, stated as `ADR-0011` states it:**

- it is **green on both trees** at BASE, so this ticket passes its own blocking gate **and**
  `ABC-019`'s tip stops being red — the two things no single delivered form did;
- a **stale licence** (driver exists, stops importing) goes RED — the gain;
- a licence whose **file was deleted** is vacuous rather than red. **That is not a choice and I did
  not trade it away**: this tree and "`ABC-019`'s tree with `turn-loop.ts` deleted" are the same 16
  `cmp`-identical files, so no guard can be green on the first and red on the second. `ADR-0011`
  names this and routes it to Architect/Design; I did not edit the ADR.

## 4. `A2` — the report channel is a private file descriptor

The child now `writeSync(3, …)` and the parent runs `spawnSync` with
`stdio: ["ignore", "ignore", "pipe", "pipe"]`, reading `child.output[3]`. **The child's stdout is
discarded**, so a production module that prints at import writes into nothing the probe reads.

**The three alternatives I rejected, with reasons rather than preferences:**

- **stderr as the channel** — over-reaches. `## Test notes` 4 and `A2`'s own negative control require
  `WSTDERR` to keep surviving; moving the report onto stderr makes module-scope `console.error` fatal.
  Refused.
- **a sentinel / last-line parse of stdout** — not *private*, only *delimited*. `## Scope` asks for a
  channel that a printing module cannot corrupt, and a delimiter is a convention a printer can break.
- **a temporary file** — would put a **file write** into a guard whose security posture is recorded as
  *"no file write outside the test's own reads of `src/`"*, and `## Security / NFR triggers` names a
  firing threshold on exactly that surface. Refused on posture, not on cost.

**I added an explicit non-zero-status check, and it is required rather than defensive.**
`execFileSync` threw on a dead child for free; `spawnSync` does not. `## Dependencies` requires that
on a Node without `module.registerHooks` the child throws and the test **fails loudly** — *"it must
never pass by being unable to look"* — so without the check a dead child would arrive as an empty
report and a confusing `JSON.parse` error. The check surfaces the child's own stderr.

## 5. `A4` — one production line, and the docblock the ruling made false

`src/history-pane.ts:30` now reads *"so IT ADDS NO RUNTIME IMPORTER OF `src/history.ts`"* —
`src/status-panel.ts:24`'s already-merged phrasing, which `A4` names as the one that should win. It
is scoped to the module's own contribution and is true whatever any other module does.

**That is the ONLY production line I wrote, and I did not conclude a second was owed.** Form (a) of
`A3` was rejected by `ADR-0011`, so the `main()` guard in `src/perft-bench.ts` never fell due; every
other clause lands in the test file.

The probe's docblock no longer presents the regex as a strictly weaker subset. It now states cl. 3's
reason — **the regex is not redundant because it holds a DIFFERENT property** — and lists the builds
each guard catches and the other cannot, **in both directions**. I also corrected the two places in
the same docblock where the ruling made the wording false (*"over the production module graph"*, *"a
child process rooted at the production modules"*) and the probe's own test title and failure message,
which said *"in NO production closure"*. Those are the same site and the same defect; leaving them
would have left the file asserting a scope the ruling removed.

## 6. What I did not do

No test was added, weakened, narrowed or deleted — **the file's test count is 8 before and after**.
`ABC-028`'s inherited comment block at `:103-120` is **byte-identical to `HEAD`**, the `AT_*` fixtures
were not rebuilt or tidied, and the six pre-existing assertions are byte-identical (verified by `cmp`
on the exact line ranges, not by reading the diff). `HISTORY_COLS` was not touched. No dependency was
added (`dependencies` stays `{}`), no module and no test file was created — **the lane file count
stays TWO**. `plans/board.md`, `plans/nfr-catalog.md`, every ADR, `ABC-017`, `ABC-019` and `ABC-028`
were not opened for edit. Nothing merged, nothing pushed, nothing deployed, no `git checkout main`,
and none of the four live worktrees was entered.
