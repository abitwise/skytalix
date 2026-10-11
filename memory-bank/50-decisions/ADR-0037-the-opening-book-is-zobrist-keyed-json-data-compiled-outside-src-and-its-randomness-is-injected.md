---
kind: adr
id: ADR-0037
---
# ADR-0037: The opening book is Zobrist-keyed JSON data compiled by a tool outside `src/`; the probe takes its randomness as an injected `() => number`, and a production session binds `Math.random`

## Status

**accepted**, 2026-10-10, by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-093`,
Workflows 02 and 07, branch `grugops/design-ABC-093` from wave tip `489c549e`).

**Amended 2026-10-11** (`design-low-batch-2026-10-11`). D1(f) gains a source-hash refusal
(`QE-093-b`), in the block under (f). It takes effect when its ticket merges.

- **What it answers.** BA/PM's decision note `…0e4da324` (`rescore-p1-backlog-2026-10-10`) names
  three structural decisions:
  - **D1**, the book format (`ABC-093` DoR item 5);
  - **D2**, `G4`, the randomness seam (`ABC-094` DoR item 5; `ADR-0012` § Consequences);
  - **D3**, the session's source of randomness (`ABC-095` DoR item 5).
- **Why this role accepts it.** Each is a structure question that the pages give to Architect/Design
  by name. The owner's standing directive of 2026-08-03 (`memory-bank/60-progress.md` § "Standing
  directive — who decides") lets this role ratify an architecture decision.
- **What it does not move.** No NFR level, target, product promise or cost moves.
- **What stays the owner's.** The source and licence stay his (`ADR-0023`). So do owner questions 4
  and 5 in `…0e4da324` (§ Consequences). He may veto the weight policy in D1(c).
- **Not edited here:** the ticket pages, the board, `AGENTS.md` and `plans/nfr-catalog.md`. BA/PM
  folds the pages; the fold list is in the decision note.

## Context

**Premises re-read at `489c549e`.** Each one matches BA/PM's note:
- **The randomness and the composition root.** `seededRandom(seed): () => number` (mulberry32) is at
  `src/levels.ts:61`. `src/cli.ts:176` reads `engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })`.
- **Production `Math.random`.** It occurs once, at `src/cli-options.ts:103` (`--colour random`). Its
  header records why a CSPRNG is not needed there: ASVS `V11.5.1` is L2, outside the project's active
  L1 set.
- **The key the tree already expects.** `zobristKey(position): bigint` is at `src/zobrist.ts:69`.
  `keyHistory` (`src/history.ts:116`) is documented as the list *"`EPIC-005` probes the opening book
  against"*, and `ADR-0002` § Consequences says the same.
- **`ABC-010` is merged** (`8a2d41a8`).
- **`ADR-0036`'s holders.** Production modules holding a limb in code: `cli.ts`, `glyph-mode.ts`,
  `perft-bench.ts`.
- **Configuration.** `tsconfig.json` includes `src/`, `spike/` and `vitest.config.ts`. Biome lints
  `tools/**/*.js` only. Vitest collects every `*.test.ts` outside its exclude list, and `tools/` is
  not on that list.

**Measured on the real source, own harness** (`.grugops/context/design-ABC-093/probe/`):
- **How it was run.**
  - `measure.ts` imports `src/` read-only. Output is in `RUN.txt`.
  - The source is `lichess-org/chess-openings` `a.tsv`…`e.tsv`, fetched to a private scratchpad and not
    committed. Master head is `a6189a30` (2026-10-06).
  - Node v26.11.0, Apple M3, load1 ≈ 14. The wall figures are diagnostic only.
- **The source.** 3,865 rows. Master has grown since `ADR-0023` read 3,704 rows / 388,052 B, which
  is why the pin matters. 0 SAN rejections. 1,012 lines run past 12 plies; the longest is 36.
- **Positions at ≤ 12 plies.** 5,390 positions, 3,626 of them with at least one book move. 0
  positions carry two source names. 0 Zobrist collisions: the key maps one-to-one onto 4-field FEN
  over the whole book.
- **Size against `NFR-006`'s 1,048,576 B:**

  | candidate | bytes | share |
  |---|---:|---:|
  | Zobrist hex keys, names inline, line-count weights | **356,295** | **34.0%** |
  | the same with uniform weights | 355,778 | 33.9% |
  | 4-field FEN keys | 592,320 | 56.5% |
  | Zobrist keys, no names | 211,370 | 20.2% |

- **The replay walk (`A2`'s method).** From the start position it examines **5,390 of 5,390**
  entries and 5,825 moves. 0 are illegal. It takes about 106 ms in-process. The whole compile takes
  about 478 ms.
- **Load and depth.** `JSON.parse` of the artifact takes 3.5 ms (one reading). Two compiles in one
  process are byte-identical.
- **First moves.** There are 20. Under uniform weights each gets 5%, so `1. e4` gets 5% and
  `1. g4`, `1. f3` and `1. Na3` get 5% each. Under line-count weights `1. e4` gets 52.6%, `1. d4`
  34.5%, `1. c4` 5.2% and `1. Nf3` 2.8%. After `1. e4` there are 19 replies; that position is named
  *"King's Pawn Game"*.

## Decision

### D1 — the format (`ABC-093`)

**(a) Key: the full 64-bit Zobrist key.** It is written as **16 lowercase hex digits**, zero-padded:
`zobristKey(position).toString(16).padStart(16, "0")`. JSON has no `bigint`.
- **Why.** It is the key `ADR-0002` and `keyHistory` already name for the book. At runtime it is the
  last element of a list the session can already derive, so lookup builds no FEN string. It is also
  the smaller artifact (34% against 57% for FEN).
- **FEN gives no transposition advantage.** Both keys take the en-passant term from
  `position.epSquare`, so they group positions identically. The probe found the mapping one-to-one.
- **Truncated hashes are rejected.** A collision returns a legal move from a different position. No
  guard catches that (`wasGenerated` passes it).

**(b) `A2`'s method is the replay walk, and the format makes it complete.**
- **The walk.** Start at `START_FEN`. At each entry, check that every move is in
  `legalMoves(position)`. Derive the key of each child and compare it with the artifact's key.
- **The completeness rule (format).** **Every entry must be reachable from the start position by book
  moves.** A hashed key cannot be inverted, so an unreachable entry could never be checked.
- **The assertion (`A2`).** **The examined count equals the entry count**, and both are printed. A
  shortfall is a red, not a sample.
- **What a red means.** If `src/zobrist.ts`'s table or components ever change, the key comparison goes
  red in the default lane, and **the fix is to regenerate the book**. That is the coupling this key
  buys, and it is guarded.

**(c) Weights: positive safe integers, with the line-count policy.**
- **The policy.** A move's weight is the number of source rows whose (truncated) line passes through
  that edge.
- **Why not uniform.** `ADR-0023` decision 5 allows uniform weights, but uniform plays a fringe first
  move about 80% of the time as White. Line-count weights come from the same pinned source and cost
  the compiler nothing extra. *"Anything richer is a later ticket"* in `ADR-0023` is read as new
  frequency data from another source, which this is not.
- **Fallback, and the owner's veto.** Uniform is one constant (`1`), and the encoding does not change.

**(d) The name lives inline, on the entry for the exact position where a source line ends, when that
is ≤ 12 plies.**
- **Lines past 12 plies.** Those 1,012 names are not in the artifact, and `ABC-096` shows nothing
  there (its "do not infer" rule).
- **No position carries two names.** If a future source would give one two names, the compile fails
  (see (f)).
- **No side table.** No two positions share a name to deduplicate, and an inline field costs
  `ABC-096` no second lookup.

**(e) Container: one JSON file, UTF-8, `JSON.stringify` output plus a trailing newline.** The
reproducibility rules:
- `positions` keys are sorted ascending;
- `m` is sorted by UCI ascending;
- no timestamp and no absolute path appear anywhere.

```json
{"format":1,"source":{"repo":"lichess-org/chess-openings","commit":"<40-hex pinned SHA>"},
 "attribution":"ATTRIBUTION.md","maxPly":12,
 "positions":{"<16-hex key>":{"m":[["e2e4",2032],["d2d4",1333]],"n":"<name>"}}}
```

- **`m`.** A list of `[uci, weight]` pairs. UCI is from-square, to-square and a lowercase promotion
  letter.
- **Entries with an empty `m`.** `m` may be empty only on an entry that exists for its `n`.
  **"In book" means `m` is non-empty.**
- **`attribution`.** It is `A6`'s pointer, relative to the artifact's directory.
- **Why JSON.** `JSON.parse` cannot execute anything (`A7`, `ABC-094` `A7`), and it is the parser
  Node already ships. A custom text format would add a parser to `ABC-094`'s hostile-input surface.

**(f) What the compiler validates, and refuses to emit on:**
- the header row;
- 3 columns per row;
- every SAN resolving to exactly one move (`outcome: "move"`);
- no key carrying two different 4-field FENs (a collision);
- no position carrying two names;
- no C0, DEL or ESC byte in a name. This is defence in depth only; `ABC-096` still sanitises.

> **[AMENDED 2026-10-11 (task `wave-2026-09-25`, subtask `design-low-batch-2026-10-11`): `QE-093-b`
> is ruled. (f) gains a seventh refusal. It takes effect when the ticket that builds it merges.
> Until then the compiler is as delivered.]**
>
> - **The refusal.** Before it compiles, the command-line run checks that each of the five source
>   files' sha256 (over the raw bytes) equals the pinned value. If one differs, it refuses with no
>   write, and names the file and both hashes.
> - **Why.** `source.commit` is a provenance claim in a shipped file, and `ADR-0023`'s CC0 basis
>   rests on it. Today any directory of well-formed TSVs compiles under that commit, so the field is
>   a label and not a proof (QE, `…cce9af72`). The compiler is the only party that sees the bytes. So
>   the check belongs to the compiler, and the cost is one `node:crypto` call per file.
> - **Where the pins live.** A `SOURCE_SHA256` constant beside `SOURCE_COMMIT`. A lane test pins the
>   five values to `ATTRIBUTION.md`, so the pair cannot drift apart.
> - **What does not change.** `compileBook`, `writeBook`'s signature, the artifact's bytes, and the
>   existing fixture tests. The check sits on the command-line path, before `writeBook`.
> - **Rejected:** carrying `QE-093-b` as an accepted risk. The fix costs about as much as the risk
>   record would, and the record would never close.
> - **The ticket** is recommended to BA/PM: `XS`, `P3`. It has 0 `src/` lines, 0 new files and 0
>   children (note `…e95791ae`).

**(g) Placement. The compiler and its test live outside `src/`. The data lives beside its
attribution.**

| path | what | why |
|---|---|---|
| `data/opening-book/book.json` | the artifact | beside `ATTRIBUTION.md` (`ADR-0023` decision 3); it is data, so 0 production lines |
| `data/opening-book/ATTRIBUTION.md` | `ADR-0023`'s five contents, including the pinned SHA and the five raw URLs at that SHA | `A6` |
| `tools/opening-book/compile.ts` | the compiler: `node tools/opening-book/compile.ts <dir holding a..e.tsv>` writes the artifact | it runs on demand and never in a player's process; it imports `src/` read-only |
| `tools/opening-book/book.test.ts` | the one test file: `A1` on a small fixture written in the test, and `A2`–`A5` on the real artifact | `NFR-008`: one file |

- **Config edits this placement requires.** `tsconfig.json` `include` and `biome.json`
  `files.includes` each gain `tools/opening-book/**/*.ts`. Without them the compiler and its test go
  un-typechecked and un-linted, which is `vitest.config.ts`'s `ABC-050` warning in another place.
- **The source TSVs are NOT checked in.** Regeneration is a manual fetch of the five files at the
  pinned SHA into a directory outside the repository, then the command above. That is `ABC-093`
  § Out of scope's one permitted fetch.
- **How `A1` is evidenced.** Byte-identity on the full source is a recorded RUN at the delivery hop
  (two compiles, `cmp` exit 0). In the lane, a fixture checks byte-identity, which is cheap.
  Compiling the real source in the lane would cost about 0.5 s of CPU for a property a fixture
  already proves.
- **The test location is a recommendation, not a pin.** The Engineer may put the test file in `src/`
  instead (`src/*.test.ts` is not production). The compiler's place is ruled.

### D2 — the randomness seam (`ABC-094`, `G4`)

**The probe's factory takes `random: () => number`, returning values in [0, 1). The probe module
imports no generator. `seededRandom` stays in `src/levels.ts`.**
- **Tests and harnesses** build the source as `seededRandom(seed)`: `A2`, `A3` and `A4`'s named seed.
- **No second generator may be written for the book**, in production or in its tests. This closes
  `G4`: two epics, one generator, one injected type. The LCG already in `src/history.test.ts:81-89`
  is pre-existing and is not touched (coding rule 12).
- **Why `seededRandom` does not move.**
  - Moving it edits merged `ABC-087` code for no caller that needs the move (coding rule 10). Under D3
    no production book path calls it.
  - Moving it reds `ABC-087`'s merged `A8` import pin (`src/levels.test.ts:445-455`).
- **`ADR-0012` clause 3(b) is satisfied as written.** The RNG is a parameter bound once at the
  composition root, and the decorator receives a probe that already holds it.

### D3 — the session's randomness (`ABC-095`)

**A production session has no seed.**
- **What the root binds.** `src/cli.ts` passes `Math.random` itself as the probe's `random`. That is
  the composition root's one ambient read, with the same precedent and the same ASVS reasoning as
  `src/cli-options.ts:103`.
- **Variation between sessions** comes from each process's fresh `Math.random` state.
- **No reproducibility requirement exists for a shipped session.** Deterministic mode is harness-only
  (`ADR-0027`), and `src/cli.ts` never builds it (`ABC-086` `A5`).
- **Consumers that take an integer seed get one from the same read.** When `ABC-101` wires a level,
  `createLevel` takes an integer seed. That seed is `Math.floor(Math.random() * 2 ** 32)` at the root.
  This sets the source only; `ABC-101`'s wiring is its own.

## Alternatives

| # | alternative | verdict |
|---|---|---|
| 1 | **FEN key (4 fields)** | **Rejected.** It is human-readable and gives a direct `A2`, but it is 66% larger, builds a FEN string on every probe, and leaves the key `ADR-0002` names. D1(b)'s completeness rule makes the replay walk as strong as a direct check. It meets `ABC-010`'s stricter `parseFen` too, which no longer matters (merged) |
| 2 | **Truncated hash** | **Rejected.** A collision is a legal wrong move that no guard catches |
| 3 | **Uniform weights** | **Rejected as the default; kept as the one-constant fallback.** About 80% fringe first moves as White |
| 4 | **Name side table** | **Rejected.** Nothing to deduplicate (0 shared names); it adds a second lookup |
| 5 | **Compiler in `src/`** (like `perft-bench.ts`) | **Rejected.** It is production by the measured rule, so it needs the owner's UAT word for a tool no player runs. Its `node:fs` import fires `ADR-0036` (b1) and makes it the fourth limb holder, which hits `ADR-0036` § Decision 3's trigger |
| 6 | **Check the source TSVs in** | **Rejected.** It doubles the third-party content in every clone (about 395 KB) and adds a third file to `ADR-0023`'s rollback surface. The in-lane check of `artifact == compile(source)` costs about 0.5 s of CPU |
| 7 | **Move `seededRandom` to its own module first** | **Rejected** (D2) |
| 8 | **Seed from `node:crypto`** | **Rejected.** Limb (1) fires `ADR-0036` (b1) for an L2 property outside the active set |
| 9 | **Seed from `Date.now()`** | **Rejected.** It is two steps for what `Math.random` does in one, and sessions started in the same millisecond share a seed |
| 10 | **A `--seed` flag or an environment variable** | **Rejected.** Nobody has asked for it (coding rule 5). It is a new argv surface under `ABC-042`/`ABC-062`'s guards, and the environment form is a limb (2) read |

## Consequences

**Gates.**

| ticket | UAT (2026-08-17 zero-production-lines rule) | `In Security/NFR` under `ADR-0036` |
|---|---|---|
| `ABC-093` | **Waived by measurement** if the delivered diff is as placed in D1(g): `tools/`, `data/`, two configs, `AGENTS.md`, a test file. The rule's `git diff … \| grep -v '\.test\.ts$' \| grep '^src/'` is empty. QE still owes its hop | **(b) does not fire.** 0 production files. Whether the hop goes anyway on the page's own untrusted-input and `V15` content bullets is the Orchestrator's call; `ADR-0036` does not send it |
| `ABC-094` | **The owner's word.** It adds a new `src/` module | **Fires (b1)** if the probe module imports `node:fs`, which makes it the **fourth limb holder** and hits `ADR-0036` § Decision 3's trigger (Security/NFR rules whether (b2) needs a call-graph reach). D2 adds no limb: an injected `() => number` is not a capability |
| `ABC-095` | **The owner's word.** It adds the decorator module and edits `src/cli.ts` | **Fires**: (b2) through the new edge to the probe, or (b1) if `src/cli.ts` itself gains the read. D3 adds no limb (`Math.random` is not one); D3's rejected `node:crypto` would have fired (b1) on its own |

- **Not ruled, recorded for `ABC-094`'s Engineer.** Where the file read sits is that ticket's call
  (§ Scope bullet 3). The probe could take an injected reader and an injected warn sink, the same
  shape as D2. Then the read is bound in `src/cli.ts` (already a holder), and the holder set stays at
  three. That moves (b)'s firing from `ABC-094` to `ABC-095`, and it lets `A5`/`A6` run in memory with
  no temp directory (`ABC-094` test note 1). Either branch routes through `In Security/NFR` once.
- **Owner questions.**
  - **Question 4 becomes live, with its substance unchanged.** D1 takes the branch it was
    conditional on: the compiler and artifact sit outside `src/`, so UAT is waived while CC0 data
    ships to every clone.
  - **Question 5 is unchanged** by D1 and by D3. The decorator still wraps whatever seam the root
    builds.
  - **One owner veto is named here, not a new question:** D1(c)'s line-count weight policy.
- **`NFR-006`.** The estimate is 356,295 B (34.0%) at upstream `a6189a30`. The figure stays
  `UNKNOWN - verify` until `ABC-093` `A5` reads the delivered file at its own pinned SHA.
  `plans/nfr-catalog.md` is not opened: no level, target or instrument moves.
- **`NFR-008`.** One new test file. The full walk is about 106 ms in-process here, so no opt-in flag
  should be needed. The build hop measures it under whichever protocol is in force.
- **`N-LOAD`.** `JSON.parse` takes about 3.5 ms. This is informative; the bar is `ABC-094`'s to
  measure.
- **`ADR-0012` `G4` is closed** by D2. A dated pointer is added to `ADR-0012` § Status.

## Rollback

- **Before `ABC-093` builds:** edit or delete this file. Nothing depends on it.
- **After the build:**
  - **To change the key or the container:** change the compiler, regenerate the artifact, and change
    `ABC-094`'s loader. The artifact is the only coupling, and `format` is versioned for exactly this.
  - **To change the weights to uniform:** change one constant and regenerate.
  - **D2/D3:** `random` is a parameter, so swapping its source is one expression at the root.
- **What would falsify D1(a).** A zobrist change that the regeneration fix cannot keep up with, or a
  collision found by D1(f). Either one re-opens the key choice. Fall back to FEN (Alternative 1),
  which fits at 57%.
