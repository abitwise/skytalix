---
id: 20260920T023200Z-qe-e2e-observation-abc075-sentence-audit-two-false-three-stale-comments-in-the-two-test-files-haslegalenpassant-orphaned-a5-bar-unmechanised-3d9f1c64
kind: observation
by: qe-e2e
at: 2026-09-20T02:32:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ABC-114
  - ADR-0020
  - ADR-0005
  - NFR-005
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - src/legal.ts
  - plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
supersedes:
---

# `ABC-075` sentence audit under `ABC-114`'s standard — the two comments the Engineer flagged are FALSE sentences; three more are stale; none corrected here; plus the two residuals (`hasLegalEnPassant` orphaned, the `A5` bar unmechanised)

**Not a stamp.** Read at the tip. `ABC-114`'s standard: a comment that states, as measured fact,
something that is false on the delivered tree is a false sentence, whatever the assertion under it
does; the agent that writes the replacement is not the agent that validates it, so **QE names and
does not correct** (`ABC-114 A7`). Line numbers are the tip's (`8dda2ae`).

## The two the Engineer flagged and left (rule 9)

**S1 — `src/zobrist.test.ts:242–243`** (inside the `ABC-011 QE — zobristKey returns the position
exactly as it found it` walk):

> `// An ep component was XORed in, so hasLegalEnPassant returned true and the make/unmake`
> `// path inside the key actually ran on this node — that is the path purity is about.`

**FALSE on the delivered tree.** `zobristKey` no longer calls `hasLegalEnPassant` (mutant (k)'s
structural spy row reads 0 calls on every input at the tip) and has no make/unmake path. The
counter it narrates (`withEpComponent`) now counts double pushes, which is still non-vacuous
(`expect(withEpComponent).toBeGreaterThan(0)` at `:255` stays meaningful as "the component was
present on some node"), so the assertion is sound; the sentence mis-describes what the row buys —
it says the row exercises a mutating path that does not exist. **Priced: under-states nothing,
over-states one thing (a path).** Same shape as `ABC-114`'s `S3`.

**S2 — `src/zobrist.nfr.test.ts:92–94`** (the NO_SQUARE-guard block):

> `// Deleting the early return on its own is now a pure COST change, and through zobristKey it`
> `// costs NOTHING: zobristKey is the only production caller of this predicate and its own`
> `// epSquare !== NO_SQUARE guard short-circuits, so a no-ep node never enters here at all.`

**FALSE on the delivered tree** in its middle clause: `zobristKey` is not "the only production
caller" — it is not a caller at all, and the predicate has ZERO production callers (`grep -rn
hasLegalEnPassant src --include=*.ts | grep -v test.ts` → `src/legal.ts:90` only). The conclusion
("costs NOTHING through `zobristKey`") is still true, for a stronger reason than the one written.
The two `NO_EP_PROBES` rows under it are unaffected (they call the predicate directly). **Priced:
the sentence points a reader at a call edge that is gone.**

## Three more QE found in the same two files — stale, and one of them false

**S3 — `src/zobrist.test.ts:226–229`** (the same walk's opening comment): *"Since ABC-011 the key
plays a move and takes it back, so 'transiently mutates' is only safe if the restore is exact at
EVERY node"*. **FALSE as a present-tense statement**: the key plays no move since `ADR-0020`. The
`describe` title two lines up is fine. Same site as S1; one pen-stroke fixes both.

**S4 — `src/zobrist.test.ts:64–65`** (the `ABC-011` regression-guard pair): *"The fix must collapse
the pair above without collapsing this one."* Stale, not false-as-fact: the pair above (`:49`) is
now asserted `not.toBe` and its comment says why; this sentence describes the `ABC-011` fix that
`ADR-0020` reversed. A reader who trusts it expects `:49` to be `toBe`. **Priced: mis-points the
row above.**

**S5 — `src/zobrist.test.ts:255`** trailing comment `// the mutating path was genuinely exercised`.
Same falsity as S1, three lines down.

**Not stale, checked:** `src/zobrist.nfr.test.ts:47` ("under `ADR-0005` the only ones that paid for
the predicate") is past tense and true; the `vitest.config.ts` comment naming this file's spy as a
`--no-isolate` casualty is still true (the `vi.mock` is still there); `src/zobrist.ts`'s module doc
and the `zobristKeyAfterMove` docblock were read sentence by sentence against the mutant ledger and
hold — every component it lists has a killing mutant.

**Whose pen.** All five sit in `*.test.ts` files whose assertions are sound and whose delivered
production diff is `src/zobrist.ts` only. This is `ABC-114`'s shape exactly (false narration over
right guards, zero assertions to change, zero production lines). **BA/PM's to cut** — either as
five more sites on `ABC-114` (which is `Backlog`, scoped to `EPIC-006`'s files, so a scope decision)
or as its `EPIC-004` sibling. Not the Engineer's to fix at this hop (`AGENTS.md` rule 9 and the
ticket's `A6` fence both say leave adjacent lines alone), and not QE's (`A7`).

## Residual 1 — `hasLegalEnPassant` is exported with zero production callers

Confirmed by grep at the tip (above). `src/legal.ts` is byte-identical to `b65f5f1` (`A6`,
`ADR-0003` clause 1). Its own tests in `src/legal.test.ts` and the two `NO_EP_PROBES` rows keep it
honest; the `vi.mock` in `src/zobrist.nfr.test.ts` now spies on a function the module under test
never imports — the structural row is still the one assertion that fails if a probe is
re-introduced (mutant (k) proves it: `called 1 times`). Deleting the predicate is the ADR's
*"later, separate, one-line ticket if anyone wants it"* — **BA/PM's**, and it would take the spy
row and S2's block with it.

## Residual 2 — the `A5` ≥ 5x bar is asserted by nothing in any lane

Mutant (f) (recompute from scratch, `keyBefore` ignored) is green on all 1305 tests and reads
0.98x on the bench. The default lane cannot carry it (the catalog's standing rule: no wall-clock in
the default lane; `N8-LANE`), and `ZOBRIST_DEEP` currently carries only the depth-4 walk. If the
owner wants the seam's whole reason for existing mechanised, the honest shape is a `ZOBRIST_DEEP`
row that runs the interleaved bench and asserts the ratio ≥ 5 (a ratio, not an absolute, so it is
machine-independent in the way the catalog's rule wants) — `ABC-081`'s per-ply array will be the
first consumer to feel a regression here, and it would feel it as depth, not as a red row.
**Security/NFR's and BA/PM's; not written at this hop.**
