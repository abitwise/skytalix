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

**Amended 2026-10-12** (`design-ABC-095-wiring`). § Addendum — 2026-10-12, at the end of this file,
rules how `ABC-095` wires the decorator into a real session:
- R1: where the file read lives;
- R2: how the merged child-process criteria stay valid when the book answers first;
- R3: what the 5 ms miss bar measures;
- the merge order.

It **corrects** two things in § Consequences:
- the `ABC-095` row of the gates table;
- the "Not ruled, recorded for `ABC-094`'s Engineer" bullet, which put the read in `src/cli.ts`
  without seeing `ABC-042` bar 4.

D1–D3 do not change.

**2026-10-12, `secnfr-ABC-095-placement`: Security/NFR answers the addendum's S1 and S2. R1 stands.**
- **S1** is ruled in `ADR-0036` § `### S1 — the fourth holder — 2026-10-12`. (b2) gets no
  call-graph reach. Limb 1's (b1) unit widens to the holder file, so any later edit to
  `src/book-file.ts` routes to `In Security/NFR`.
- **S2.** `ABC-042` bar 4 is file-scoped: it covers the own source of `src/cli.ts` and
  `src/cli-options.ts`, which is what its test reads. Bar 4's text does not change, and no carve-out
  is written.
- **S3's checklist** is in `.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43`.

**2026-10-12, `secnfr-ABC-095-s3`: S3 ran on `0974102f..2307fc11`. The result is PASS_WITH_RISKS, and R1–R3
stand as built.** The result is in `.grugops/context/secnfr-ABC-095-s3/notes/…b65b11b7`.
- **Item 7's first bullet is corrected there (`QE-095-e`).** No entry is a symbolic link, and every entry
  that is not a directory is a regular file. `src/__snapshots__` is a directory.
- **One risk is added: `AR-095-CWD` (LOW, the Orchestrator).** No test pins that `readBookFile` resolves
  from `import.meta.url` rather than from the working directory. The named fix is to run `A7`'s child from
  a neutral cwd.

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
  > **[CORRECTED 2026-10-12, `design-ABC-095-wiring`.]** The original words above are kept.
  > - **"The read is bound in `src/cli.ts`" is wrong.** `ABC-042` bar 4 forbids a `node:fs` import in
  >   `cli.ts`.
  > - **The ruling.** The read lives in `src/book-file.ts`, which is the fourth holder, and `cli.ts`
  >   binds it (§ Addendum — 2026-10-12, R1).
  > - **The `ABC-095` row of the table above** is corrected there too: the edge to `book.ts` never
  >   fired (b2).
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

## Addendum — 2026-10-12: wiring `ABC-095` (`design-ABC-095-wiring`)

Added by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-095-wiring`, branch
`grugops/design-ABC-095-wiring` from `main` `1c765b04`).
- **What it answers.** The Software Engineer stopped at the wiring line. The notes are `…ef39c9a6`,
  `…1e971b4d` and `…31116475` under `.grugops/context/ticket-to-pr-ABC-095/notes/`, on branch
  `grugops/ABC-095-book-before-engine`, tip `1f205b00`.
- **This hop's notes:** `.grugops/context/design-ABC-095-wiring/notes/`.
- **What it does not move:**
  - no NFR level and no product promise;
  - no merged criterion's discriminating requirement;
  - no byte of the decorator commit `521a8513`.
- **What it does not change, and whose that is.**
  - `ABC-042` bar 4 is Security/NFR's. R1 states exactly what is asked of them.
  - The ticket pages are BA/PM's. The amendment list is in the decision note.

### Premises, read at `1c765b04` and on `1f205b00`

- **`ABC-042` bar 4** reads *"No filesystem and no network — in the production modules"*. It is a
  grammar over import specifiers, `/^(node:)?(fs|net|http|http2|https|tls|dns|dgram)(\/|$)/`, plus the
  globals `fetch`, `WebSocket` and `XMLHttpRequest`.
  - Its test (`src/cli.test.ts`, the row "bar 1 — the production modules treat arguments as data")
    reads the **own source** of `cli.ts` and of `cli-options.ts`, and nothing else.
  - § Consequences above, and the `ABC-095` page, both missed it.
- **`src/cli.ts`'s header and `ABC-042` `A9`.** Only the entry point may acquire `process.stdout`,
  `process.stderr` or `process.stdin`. Nothing below it writes on either channel.
- **`src/book.ts`.** `createBookProbe({ read, warn, random })`. `read: () => Uint8Array` is called at
  most once, on the first probe, and it may throw. The probe holds no `ADR-0036` limb.
- **`src/book-engine.ts` at `521a8513`.** `withBook(probe, inner)` has two `import type` lines, so it
  adds no runtime edge.
- **`src/cli.test.ts` substitutes `./engine.ts` in 10 children:** `black`, `random`, `mate`,
  `engineThrows`, `engineForeign`, `colourBlack`, `colourWhite`, `resigns`, `quits` and `renews`.
  - It substitutes `./line-input.ts` in 1 child.
  - No row pins the substituted module's name.
- **`src/cli.real-engine.test.ts`.** Both deep children run `node src/cli.ts --colour black --ascii`,
  with empty or one-line stdin. The engine moves at ply 0, from the start position.
- **The artifact.** It was read by a scratch script, run outside the repository, that imports `src/`
  read-only. The script and its output are quoted in this hop's observation note.
  - The start position is in book, with 20 moves.
  - 19 of the 20 positions after White's first move are in book. The one that is not is `1. c3`.
  - After `1. f3`, `e7e5` carries weight 3 of 5 (60%).
  - After `1. f3 e5 2. g4`, `d8h4` carries weight 1 of 1.
  - After `1. e4`, `e7e5` carries 1,033 of 2,031 (50.9%).

### R1 — the read lives in a new holder module, `src/book-file.ts` (option (b2))

**The contract.**
- **The module.** `src/book-file.ts` sits flat in `src/` (`ADR-0012` clause 8). It exports exactly one
  function, `readBookFile(): Uint8Array`, which returns
  `readFileSync(new URL("../data/opening-book/book.json", import.meta.url))`.
- **It takes no parameter.** The path is a constant, resolved against the module's own URL. No
  argument, environment variable or option can reach it.
- **Its imports and its effects.**
  - It imports `node:fs` and nothing else.
  - It contains no `process` reference and writes nothing.
  - It reads nothing at import time. `ABC-094`'s `N-LOAD` holds in its first form: construction still
    performs 0 filesystem operations, and the read happens on the probe's first call.
- **It does not catch.** A throw is the probe's documented input: `read` may throw, and `ABC-094` turns
  the throw into the one warning.
- **What `src/cli.ts` binds.** It binds the three injected values in one `const` above `runTurnLoop({`:
  - `read: readBookFile`;
  - `` warn: (line) => process.stderr.write(`${line}\n`) ``;
  - `random: Math.random`.
- **What changes inside the call.** Only `engine: withBook(book, createEngine({ budgetMs:
  DEFAULT_BUDGET_MS }))`.
- **What stays at the root.** The warn sink stays in `cli.ts`, because of the header's stream rule
  and `ABC-042` `A9`. `ABC-095` `A5`'s stream half is fixed where the root binds the sink.
  `Math.random` stays at the root, so D3 is unchanged.

**Why (b2), and not (b1) (the read in `src/cli.ts`):**
1. **Bar 4 protects a structural property.** The module that handles argv cannot touch the
   filesystem.
   - (b2) keeps that by construction. The file that sees argv imports no `node:fs`, and the file that
     reads takes no input.
   - (b1) would import `readFileSync` into the argv module. From then on, the property is held by
     reviewing every later `cli.ts` edit, not by bar 4's grammar.
2. **No merged security bar's text changes**, provided that bar 4 is file-scoped, as its test reads
   it. That is S2, below.
3. **`ABC-094` is not re-opened.**
   - The probe stays capability-free, and the root still binds `read`.
   - What moves is the body of the function the root binds. It was guessed as an inline lambda in
     § Consequences; it is now an imported function.
4. **The price, named.** `book-file.ts` is the **fourth limb holder**, after `cli.ts`, `glyph-mode.ts`
   and `perft-bench.ts`. That is `ADR-0036` § Decision 3's trigger (S1).

**Rejected:**

| # | option | verdict |
|---|---|---|
| 1 | **(b1) the read in `src/cli.ts`** | **Rejected** (reason 1 above). It needs bar 4 amended to admit a filesystem import into the argv module |
| 2 | **The read inside `src/book.ts`** | **Rejected.** It re-opens `ABC-094`'s merged injected seam, its in-memory `A5`/`A6` tests and its 0 / 0 / 0 clause (b) reading, for no gain. The holder count is the same |
| 3 | **A JSON module import (`import … with { type: "json" }`), or `process.getBuiltinModule("fs")`** | **Rejected.** Each one reaches the filesystem while hiding the reach from bar 4's grammar. A capability spelled so that the bar cannot see it is the failure the bar exists for. The JSON form also loads eagerly, or needs `import(`, which bar 1 forbids in `cli.ts`. And it takes the parse away from `ABC-094`'s hostile-input path |
| 4 | **A flag or environment variable that names a book path** | **Rejected.** This is § Alternatives 10. A path from outside the program is the attack surface bar 4 guards against |

**`ADR-0036` on `ABC-095`'s diff with this wiring.** This is the prediction. The reading is the wiring
hop's, with `.grugops/context/design-F-072-1/probe/clause-b.mjs`.
- **(b1) FIRES** on two files:
  - `src/book-file.ts`, limb 1 (`node:fs`);
  - `src/cli.ts`, limb 2 (the warn's `process.stderr`).
- **(b2) FIRES** on the edge `cli.ts -> book-file.ts`. It does not fire on:
  - `cli.ts -> book.ts`, whose closure is `legal`, `position`, `zobrist` and `moves`, and holds no limb;
  - `cli.ts -> book-engine.ts`, whose imports are type-only.
- **The holder set goes from 3 to 4.**
- **The § Consequences `ABC-095` row is corrected.** It said "(b2) through the new edge to the probe".
  `book.ts` holds no limb, so that edge never fired (b2).

**For Security/NFR, in the next hop. Not ruled here.**
- **S1 — `ADR-0036` § Decision 3's trigger fires.** Security/NFR rules whether (b2) now needs a
  call-graph reach. This role's input: the residual case, a new call over an existing edge, reaches
  one function with no parameter, and its only importer is `cli.ts`.
- **S2 — bar 4's scope.** Security/NFR confirms that bar 4 reads as written and tested: the own source
  of `cli.ts` and `cli-options.ts`.
  - **If it does, no bar text changes.**
  - **If it reads bar 4 over the entry point's runtime closure, or over the whole process,** then no
    placement satisfies it, and bar 4 must be amended either way. The carve-out to write is: *one
    read-only, synchronous read of the fixed path `data/opening-book/book.json`, resolved from
    `import.meta.url`, by a module that takes no input; no write, no other path, no network.*
  - **R1's placement stands in both cases.**
- **S3 — the `In Security/NFR` hop for `ABC-095`.** It covers:
  - (b1) and (b2) above;
  - `ABC-042` `A9`'s census, which gains a third `process.stderr` and a tenth `process`;
  - the hostile-input surface, which is `ABC-094`'s and is unchanged.

### R2 — the engine double moves to the outermost supplier at `engine:`, `./book-engine.ts`

**The ruling.**
- **Who supplies `engine:` after the wiring.** The value at `engine:` is
  `withBook(book, createEngine(…))`.
  - `ADR-0015` (S) asks for a module *"imported by `src/cli.ts` AND the binding it supplies is passed
    as an option in the `runTurnLoop({ … })` bag"*. Under that test the supplier at `engine:` is
    `./book-engine.ts`.
  - `./engine.ts`'s binding is passed to `withBook`, not to the bag.
  - **(S) is not amended.** It reads the new composition, which is what it was written to do.
- **Every child that substitutes `./engine.ts` today substitutes `./book-engine.ts` instead.**
  - Its module exports `withBook(_probe, _inner)`, which returns the same double seam the child uses
    today: scripted, first-legal, throwing or foreign.
  - It is one substitution per child, so BA/PM's (N3) holds.
  - All 10 move: `black`, `random`, `mate`, `engineThrows`, `engineForeign`, `colourBlack`,
    `colourWhite`, `resigns`, `quits` and `renews`.
  - **No child keeps an `./engine.ts` substitution after the wiring.** It fails (S) by the letter, and
    the book in front would shadow it.
- **(C).** The double returns an `EngineSeam`, and any `EngineSeam` at `engine:` is a composition that
  `runTurnLoop`'s contract permits. A session with nothing answering in front of the search is one
  the product also produces on its own (`ABC-095` `A5`, the book absent).
- **What stays real in those children:**
  - `cli.ts`;
  - the construction of `createEngine(…)`, which is never called;
  - the probe's construction, which is never called, so `book.json` is never read in the default lane;
  - the loop, the frames, the top-level handler and the exit code.
- **Why the outermost supplier.** The double stays put whatever sits inside it. When `ABC-101`
  replaces `createEngine(…)` with a level's seam, these children do not move again.

**Rejected:**

| # | option | verdict |
|---|---|---|
| 1 | **Re-script the children to leave book first** | **Rejected.** It is impossible for the engine-first children (`--colour black`): ply 0 is the start position, which is always in book. For the human-first children, the book's reply comes from `Math.random` (D3), so no script knows the position it must leave from. It would also tie a criterion to the artifact's content, which D1(b) says gets regenerated |
| 2 | **A switch that turns the book off: a flag, an environment variable or an export** | **Refused.** `ADR-0012` clause 4(b), `ADR-0015` § Alternatives D and `ADR-0013` clause 3 all refuse it: it would be a user-reachable override |
| 3 | **Substitute `./book.ts` with an always-miss probe, and keep the `./engine.ts` double** | **Refused.** It is two substitutions for one criterion, which (N3) refuses. And `./book.ts` fails (S), because its binding goes to `withBook`, not to the bag |
| 4 | **Re-target only the 4 children that went red** | **Rejected.** "Did not go red" is not the same as "still tests its Given": <br>• `mate` (`ABC-043` `A2`) passes under the attempted wiring only when the book picks `e7e5`, which is 60% of the time. That is a flake on 40% of runs, which one run could not show. <br>• The `e4` children (`colourWhite`, `resigns`, `quits`, `renews`) play against a random reply. <br>• The first-frame children (`black`, `random`) read the artifact |

**`ABC-119`: its deep children run from a byte-verified copy of the tree, with the artifact absent.**
- **Why they cannot stay as they are.** `ABC-119`'s subject is the real search, through the delivered
  composition, with no hook. With the book wired, both of its children only ever meet the book (ply
  0, the start position). `A1`'s floor caught that. `A3` and `A4` would pass while testing the book.
- **The ruling.**
  - The lane's children run the delivered `src/` from a temporary copy of the tree in which
    `data/opening-book/book.json` is absent.
  - Before the spawn, the lane asserts that every copied file is byte-identical to the repository's.
  - There is no `--import`, no hook and no double. The bytes are the delivered ones, and an absent
    artifact is a state the product handles itself (`ABC-095` `A5`: one warning, then the search). The
    decorator's no-book path is exercised end to end as well.
- **The same copy serves `ABC-095`.** `ABC-095` test note 4 already prescribes this copy for `A5`'s
  stream half, so one helper serves both.
- **`A1`'s ≥ 1.0 s floor is unchanged.** It now also detects a book that leaked in.
- **The book-present real session** is `ABC-095` `A7`'s child, which is unchanged.
- **Rejected:**
  - Hooking the book out. `A1`'s Given forbids a hook, and that is the whole point of the lane.
  - Having the human play `1. c3`, the one first move that leaves book. It ties the lane to the
    artifact's content: a regeneration that adds a `1. c3` line turns the lane into a book test.
  - Re-scoping `A1`. It would re-open `G-06` silently.

**Two pins move.** Both are mechanical, both are in `ABC-095`'s diff, and each carries a reason line.
- **`ABC-042` `A9`'s `process` census** gains one `process.stderr`, the warn, so the identifier count
  goes from 9 to 10. The census has moved this way twice before, at `ABC-043` and at `ABC-115`. `A9`'s
  rule is "only the entry point acquires `process.stderr`", and this satisfies it.
- **`ABC-043` `A1`'s `engine:` row** moves from `createEngine({ budgetMs: DEFAULT_BUDGET_MS })` to
  `withBook(book, createEngine({ budgetMs: DEFAULT_BUDGET_MS }))`, with both halves pinned.
  - **What "no adapter" means in `A1`** is a type adapter. In the test's own words, it is "six merged
    types meeting at one call site with nothing between them", and `tsc` decides it.
  - `withBook` is `EngineSeam → EngineSeam`, and it is the composition that `ADR-0012` clause 2(3)
    names. `A1`'s discriminating requirement does not move.

**Givens, criterion by criterion.** (N) is BA/PM's. Each re-target keeps its criterion's double at the
same seam, `engine:`, so no (N) verdict should change. BA/PM confirms that.

| criterion | instrument after the wiring | does the Given change? |
|---|---|---|
| `ABC-043` `A5` (`engineThrows`, `engineForeign`) | double at `./book-engine.ts` | **No.** "An `EngineSeam` that throws" is still literally true. The page's rig prose names `./engine.ts` and `createEngine` and needs a dated pointer |
| `ABC-043` `A7` (`colourBlack`, `colourWhite`) | as above | **No** |
| `ABC-043` `A2` (`mate`) | as above | **No.** This is the 40% flake, closed |
| `ABC-044` `A3` | reads `ABC-043` `A5`'s two children | **No** |
| `ABC-045` `A4` (`resigns`), `ABC-046` (`quits`, `renews`) | as above | **No** |
| `ABC-042`'s colour children (`black`, `random`) | as above | **No.** The subject is the first frame |
| `ABC-043` `A1` | the pin moves (above) | **No.** It gets a dated pointer only |
| `ABC-119` `A1`, `A3`, `A4` | the book-absent byte-verified copy | **Yes.** BA/PM amends the Given, the parenthetical and `A3`(iv). See the decision note |

### R3 — the 5 ms miss bar is WARM

**The ruling.** The bar is *"a recorded probe cost of ≤ 5 ms on an out-of-book position"*. It measures
the **steady-state cost of one probe call on the miss path**.
- **Why.** The bar exists so that the miss path is not slowed down, and the miss path recurs on every
  engine ply after the game leaves book. The read and parse happen at most once per process. Charged
  to a miss, they would measure the load, not the miss path.
- **The void cold-miss figures** (5.0–5.4 ms) sit on the bar. They are a reading of the load.

**The measurement definition (QE and SE).**
- **Subject.** One call of `probe.bookMove(P)` on a probe whose single `read` has already completed and
  parsed the real artifact. `P` is the position after `1. e4 e5 2. Ke2`. The SE's instrument already
  asserts that `P` is out of book.
- **Procedure.**
  1. Start a fresh process, outside the suite. `probe/time.ts warm` on `1f205b00` is the shape.
  2. Build the probe with the read the root binds: `readBookFile` once it exists, or `readFileSync` of
     the same URL.
  3. Make one warm-up `bookMove` on the start position, which forces the read and the parse.
  4. Time 200 calls of `bookMove(P)` with `performance.now()`.
- **The statistic.** The **maximum of the 200** is checked against 5 ms. The median and p99 are
  recorded beside it.
- **The host.** The reference machine (Apple M3, Mac15,13 / Node v26.11.0 / Darwin 25.5.0 arm64),
  under the SE's quiet-host gate: no other `vitest` process, and load1 logged.
- **Where it is recorded.** In the notes, with the machine. It is never asserted in the suite
  (`ABC-095` test note 5).

**Where the cold cost goes.**
- **Where production pays it.** The one read and parse land on the **first engine ply of a process**.
  That ply is a book **hit** in every session, except when the human opens `1. c3` against an engine
  playing Black, or when the artifact is absent or refused.
- **So it belongs to `A2`'s 30 ms hit bar.** BA/PM is recommended to state `A2`'s Given as *the first
  call in a fresh process* (cold). Its current words, "a loaded book", leave that open. Otherwise the
  lazy load that `N-LOAD`'s first form deferred escapes every bar.
- **The void cold-hit figures** are 5.2–17.5 ms.
- **A cold miss** (`1. c3`) pays the load on a ply that then searches for up to 3 s. That falls under
  `NFR-004`. It is recorded once, as a diagnostic reading, and has no bar of its own.

### Merge order — `521a8513` merges only together with the wiring

1. **The project's merge authority.** `AGENTS.md` § Branching model allows a merge to `main` *"once all
   tests pass and the ticket is done, never before"*. Without `A7` and `A5`'s stream half, `ABC-095` is
   not done.
2. **UAT.** The decorator alone carries production lines, so it needs the owner's UAT word for a
   change no player can perceive, and the wiring then needs a second one.
3. **Nothing on `main` needs the decorator first.**
4. **This addendum changes no byte of `521a8513`.** It stays the first commit on the branch, and the
   wiring hop builds on top of it. How `main` is brought into the branch, by merge and never by
   rebase, is the Orchestrator's call.

### Consequences

- **`NFR-008`.**
  - **Default lane.** 0 new children and 0 new files from R2.
  - **The re-targeted children load more code.** Each of the 10 now loads the real `./engine.ts`
    closure (search, evaluation, quiescence, the transposition table), plus `./book.ts` and
    `./book-file.ts`. The `./engine.ts` double used to replace all of that.
  - **That added CPU is `UNKNOWN - verify`.** It is charged to `ABC-095`'s `N8-LANE` line and read by
    QE under `ADR-0035`.
  - **The `CLI_DEEP` lane** is opt-in. It gains `ABC-095`'s two rows and the tree copy.
- **`NFR-007` and `N-LOAD`.** `book-file.ts` reads nothing at import, so startup gains no filesystem
  operation.
- **`NFR-004`.** See R3.
- **`plans/nfr-catalog.md`** is not opened. No level, target or instrument moves, and this hop's fence
  excludes it.
- **`ABC-095`'s size.** The wiring hop also edits 10 hook sites and 2 pins in `src/cli.test.ts`, edits
  `src/cli.real-engine.test.ts`, and adds a production module of about 5 lines. Whether `S` holds is
  BA/PM's to re-check.

### Falsifiers and rollback

- **What would falsify R1.** S1 rules that a call-graph reach is needed and costs more than (b1). Then
  R1 is re-opened against an amended bar 4. If S2 reads bar 4 as closure-wide, bar 4 is amended, and
  R1's placement stands (above).
- **What would falsify R2.** BA/PM's (N) refuses a re-target for some criterion. That criterion then
  goes the way `ADR-0015` clause 2 says: re-scope it, or move it to an opt-in lane. The fence is never
  widened.
- **Rollback.**
  - Strike this addendum.
  - In code, `book-file.ts` is one function. Folding it back into `cli.ts` is (b1), which needs bar 4
    amended.
  - Each re-targeted hook reverts with one string.
