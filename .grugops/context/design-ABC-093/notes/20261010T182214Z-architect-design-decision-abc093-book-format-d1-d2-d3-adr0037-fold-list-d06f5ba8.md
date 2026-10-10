---
id: 20261010T182214Z-architect-design-decision-abc093-book-format-d1-d2-d3-adr0037-fold-list-d06f5ba8
kind: decision
by: architect-design
at: 2026-10-10T18:22:14Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ABC-094
  - ABC-095
  - ABC-096
  - ABC-101
  - G4
  - NFR-006
  - NFR-008
  - N-LOAD
  - ADR-0037
  - ADR-0012
  - ADR-0023
  - ADR-0036
  - ADR-0002
  - ADR-0027
  - memory-bank/50-decisions/ADR-0037-the-opening-book-is-zobrist-keyed-json-data-compiled-outside-src-and-its-randomness-is-injected.md
  - .grugops/context/design-ABC-093/probe/RUN.txt
  - 20261010T182214Z-architect-design-observation-abc093-probe-readings-on-the-real-source-21537f0b
  - 20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324
supersedes:
---

# `ABC-093` D1, `ABC-094` D2 (`G4`) and `ABC-095` D3 are ruled in `ADR-0037`. What each ruling means for the gates, and what BA/PM folds into each page

**How this note was made.**
- It is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- Task `wave-2026-09-25`, subtask `design-ABC-093`, Workflows 02 and 07. Branch
  `grugops/design-ABC-093`, from wave tip `489c549e`.
- The issuing pages' `## Scope` / `## Risks` are `ABC-093`–`ABC-096`'s, and BA/PM's note `…0e4da324`.
  This note cites them and does not restate them.
- **Cite `ADR-0037`; do not copy it.** The readings are in observation `…21537f0b`.

## Rulings (one line each; the ADR holds the why)

- **D1 key.** The full 64-bit Zobrist key, written as 16 hex digits. `A2` is a replay walk that
  compares keys. The format requires every entry to be reachable from the start position, and the
  walk asserts examined = entries.
- **D1 weights.** Positive integers under the line-count policy. Uniform is a one-constant fallback,
  and the owner may veto the policy.
- **D1 name.** Inline `n`, only on the position where a source line ends, at ≤ 12 plies.
- **D1 container.** One sorted JSON file at `data/opening-book/book.json`.
- **D1 compiler.** `tools/opening-book/compile.ts`, with its test in `tools/opening-book/`.
  `tsconfig.json` and `biome.json` widen their includes to cover it. The source TSVs are not checked
  in.
- **D2.** The probe factory takes `random: () => number`. `seededRandom` stays in `src/levels.ts`.
  No second generator is written for the book. `G4` is closed.
- **D3.** There is no session seed. `src/cli.ts` binds `Math.random`. An integer-seeded consumer
  (`ABC-101`'s level) gets `Math.floor(Math.random() * 2 ** 32)`.

## Gates

| ticket | UAT | `In Security/NFR` (`ADR-0036`) |
|---|---|---|
| `ABC-093` | **waived by measurement** (0 production lines, as placed) | **(b) does not fire** (0 production files). Routing on the page's own untrusted-input and `V15` bullets is the Orchestrator's call |
| `ABC-094` | **the owner's word** (new `src/` module) | **(b1) fires** if the probe imports `node:fs`. It would be the fourth limb holder, which hits `ADR-0036` § Decision 3's trigger. D2 adds no limb |
| `ABC-095` | **the owner's word** (decorator module plus `src/cli.ts`) | **fires**: (b2) through the edge to the probe, or (b1) if `src/cli.ts` holds the read. D3 adds no limb |

Not ruled: the injected-reader option is recorded for `ABC-094`'s Engineer in `ADR-0037`
§ Consequences. It keeps the holder set at three, and (b) then fires on `ABC-095` only.

## Owner questions 4 and 5

- **Question 4 becomes live, with its substance unchanged.** D1 takes the "outside `src/`" branch it
  was conditional on.
- **Question 5 is unchanged** by D1 and D3.
- **No new question.** D1's weight policy is a named owner veto, not a question.

## Fold list (BA/PM's pen)

**`ABC-093`**
1. **DoR item 5 ⚠️.** The format ADR now exists (`ADR-0037`), so re-score it; 10/10 is expected.
   Replace § Dependencies' "Architect/Design owns the format decision … Named and not decided here"
   with a pointer to `ADR-0037` D1.
2. **`A2`, and test note 1.** The method is the replay walk with key compare. Add that the examined
   count must **equal** the artifact's entry count (`ADR-0037` D1(b)). Drop the FEN-direct-check
   aside.
3. **`A1`.** Full-source byte-identity is a RUN at the delivery hop (`cmp` exit 0) against the
   source at the pinned SHA. In the lane, a fixture written in the test asserts it. The source TSVs
   are not checked in.
4. **`A3`.** The format records `maxPly: 12`. The probe reads 12 plies as the deepest.
5. **`A5`.** The estimate is 356,295 B (34.0%) at upstream `a6189a30`. It stays `UNKNOWN - verify`
   until the file is measured.
6. **`A6`.** The artifact's `attribution` field is the pointer. `ATTRIBUTION.md` also lists the five
   raw URLs at the pinned SHA.
7. **§ Scope placement.** The compiler goes to `tools/opening-book/compile.ts` and the artifact to
   `data/opening-book/book.json`. One test file goes to `tools/opening-book/` (or `src/`, the
   Engineer's choice). The diff also edits `tsconfig.json` and `biome.json`'s includes. The
   regeneration command for `AGENTS.md` is `node tools/opening-book/compile.ts <dir>`, inside the 943 B
   left.
8. **The compiler's validation list** for § Security bar (b): `ADR-0037` D1(f).
9. **Weights.** Line-count is the policy, and the owner may veto it. Fold the `1. e4` and `1. d4`
   shares as the reason.
10. **Production and UAT.** Waived by measurement, with owner question 4 live. `ADR-0036` (b) does not
    fire.
11. **Stale text.**
    - The `ABC-010` overlap and "build after it merges" are discharged: it is merged (`8a2d41a8`), and
      D1 does not key on FEN.
    - `ADR-0023`'s 3,704 rows / 388,052 B is dated: master read 3,865 / 395,064 B on 2026-10-10.
      The build pins its own SHA.
12. **`NFR-008`.** One new file. The full walk is about 106 ms in-process on this host, so no opt-in
    flag is expected. The build hop measures it.

**`ABC-094`**
1. **DoR item 5 ⚠️.** `G4` is ruled (`ADR-0037` D2), so re-score it. In § Dependencies, replace "The
   question is narrower now … Rule it in the same `In Design` hop" with D2's ruling.
2. **§ Scope bullet 2.** The factory takes `random: () => number` in [0, 1). Tests build it from
   `seededRandom(seed)`. No book generator of its own.
3. **The lookup key.** 16 hex digits of `zobristKey(position)`, or the last element of
   `keyHistory(history)`. "In book" means the entry's `m` is non-empty.
4. **`A6`'s matrix, given shape by the JSON format.**
   - "Truncated mid-record" is a JSON text cut mid-entry, so `JSON.parse` fails.
   - "Valid container, garbage payload" is valid JSON that fails the schema: for example a key that
     is not 16 hex digits, or an `m` that is not a list of `[uci, positive integer]` pairs.
   - "Illegal move" is a schema-valid UCI that is not in `legalMoves`.
5. **Optional read-only name accessor** for `ABC-096`, reading `n`.
6. **Production and UAT.** The owner's word.
   - `ADR-0036` (b1) fires if the probe imports `node:fs`, and so does § Decision 3's
     fourth-holder trigger.
   - Record `ADR-0037` § Consequences' unruled injected-reader option as an Engineer's choice.
7. **`N-LOAD`, informative.** `JSON.parse` takes about 3.5 ms (one reading, loaded host).

**`ABC-095`**
1. **DoR item 5 ⚠️.** The seed source is ruled (`ADR-0037` D3), so re-score it. In § DoR, replace
   "Whether that seed comes from `Date.now`, `crypto` or something else is Architect/Design's" with
   D3's ruling.
2. **`A7`.** The `engine:` value is the decorator over `createEngine(...)`, with the probe built with
   `random: Math.random`. Check that "the only changed expression in the `runTurnLoop({ … })` call"
   still reads true if the probe is built in a `const` above the call; a `const` above is not inside
   the call.
3. **Production and UAT.** The owner's word. `In Security/NFR` through (b2) or (b1). D3 adds no limb.
4. **`ABC-101` overlap note.** Its integer seed comes from the same `Math.random` read at the root.

**`ABC-096`**
1. **DoR item 5 ⚠️ is discharged.** The format carries the name inline (`ADR-0037` D1(d)).
2. **§ Priority.** The promotion trigger ("if `ABC-093`'s format would have to be re-opened to add the
   name") does not fire.
3. **Names beyond book depth.** 1,012 of 3,865 source names (lines past 12 plies) are not in the
   artifact. This is consistent with the page's "does not infer" rule.
