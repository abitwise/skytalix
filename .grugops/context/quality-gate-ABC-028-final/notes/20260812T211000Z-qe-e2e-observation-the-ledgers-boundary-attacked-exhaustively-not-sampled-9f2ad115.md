---
id: 20260812T211000Z-qe-e2e-observation-the-ledgers-boundary-attacked-exhaustively-not-sampled-9f2ad115
kind: observation
by: qe-e2e
at: 2026-08-12T21:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - ABC-017-A11
  - ABC-017-A14
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
supersedes:
---

# THE LEDGER'S BOUNDARY IS DRAWN IN THE RIGHT PLACE — and I can say so exhaustively rather than by sampling

> **Hand-authored, no stamp** — see the sibling gate note. Every cell below was RUN on this tip, out
> of tree, on a harness pinned by md5 to `c4653c4c…` / `9533f050…` / `1d33bea6…`.

**The question put to this gate was: is there a SHALLOWER key with no owned guard? That would be
worse than the deep one, because the ladder implies there isn't.** The answer is **no**, and the
reason it can be stated as *no* rather than as *none found* is that the shallow end of the class is
**finite and I enumerated all of it**.

## First, the ledger reproduces — three configurations, every cell run

The generator is parameterised on the axis itself (`TAIL` = how many trailing move identities join
`moves.length` in the key), so the rungs are the **same code at 0/1/2/3** and cannot differ by a
transcription slip. Every build was **output-identity checked FIRST** at twelve fixtures — all
render digest `e07f2046b9cafcfdf06ae5139430b411`, byte-identical to the delivered pane, caller's
graph unmoved — because a build that changes output is not a survivor and proves nothing.

```
build            key                     full suite      owned lane        nfr fixtures
                                         (26 files)      (26, alone)       rebuilt per test
delivered pane   —                       752 passed      26 passed         752 passed
WCACHE           never invalidates       6 failed/752    4 failed/26       —
WCACHE-LEN       length                  5 failed/752    3 failed/26       3 failed/752
WCACHE-LAST      length + last 1         4 failed/752    2 failed/26       2 failed/752
WCACHE-LAST2     length + last 2         3 failed/752    1 failed/26       1 failed/752
WCACHE-LAST3     length + last 3         2 failed/752    26 PASSED         752 PASSED
                                         A11 x2 ONLY     no owned guard    THE GUARD IS GONE
```

**Both null controls hold:** the untouched replica is `752/752`, and the delivered pane **with** the
fixtures rebuilt per test is `752/752` — so a green in configuration (b) is the build's and not the
transform's. The ladder is its own calibration: `4 / 3 / 2 / 1 / 0` in the owned lane, which is
neither an instrument blind to caches nor one that kills at every rung.

**Every cell of the closure ledger at `RISK-ABC028-02` reproduces on this tip on an independent
harness, including the bottom-right one.** `WCACHE-LAST3` — `2 failed / 752` shared, `26 PASSED`
owned, `752 PASSED` rebuilt — is real, and the two `A11` `toSan` call-count assertions are the whole
project's only catcher for it.

## The attack: the shallow end of the class is FINITE, so I enumerated it

A cache in this class is a function of `moves.length` and a **watched set** of positions in the move
list. Every criterion's edit **preserves the length**, so such a cache HITs — and shows a stale pane —
**exactly when its watched set misses every index the edit changed.** So the changed-index sets are
what decide the whole question, and I measured them rather than reading them off the prose:

```
criterion            length     indices whose IDENTITY moved     rendered window
ABC-028 A1           21 -> 21   {20}                             indices 5..20
ABC-028 A5 row 1     21 -> 21   {19}                             indices 5..20
ABC-028 A5 row 2     21 -> 21   {16, 17, 18}                     indices 5..20
```

Counted from the end (offset 1 = the last move), the three owned edits hit offsets **{1}**, **{2}**
and **{3,4,5}** — three PAIRWISE DISJOINT sets. Two consequences follow, and I ran both rather than
arguing them:

**(1) No key that watches fewer than THREE positions can survive.** It would have to miss one of
three disjoint requirement sets. **All eight subset keys of reach ≤ 3 exist, and I ran all eight:**

```
watched offsets   build           owned lane   killed by
{}                WCACHE-LEN      3 failed/26  A1, A5 r1, A5 r2
{1}               WCACHE-LAST     2 failed/26  A5 r1, A5 r2
{2}               KEY-off2        2 failed/26  A1, A5 r2
{3}               KEY-off3        2 failed/26  A1, A5 r1
{1,2}             WCACHE-LAST2    1 failed/26  A5 r2
{1,3}             KEY-off1+3      1 failed/26  A5 r1
{2,3}             KEY-off2+3      1 failed/26  A1
{1,2,3}           WCACHE-LAST3    26 PASSED    NOTHING OWNED
```

**Exactly one of the eight survives, and it is the suffix at depth three.** `KEY-off2`, `KEY-off3`,
`KEY-off1+3` and `KEY-off2+3` are non-suffix keys nobody had built; all four die in the file that owns
the property. **There is no shallower, sparser or cheaper live key. `WCACHE-LAST3` is minimal in BOTH
measures** — cardinality 3 (no 2-position key survives; all four were run) and reach 3 (any survivor
must watch offset 3, 4 or 5 to see `A5` row 2, and 3 is the shallowest of those).

**(2) The criteria are not identity-specific, which I checked because `A5`'s `Given` is stated in
terms of identity preservation** and a value-keyed cache is an equally natural member of the class:

```
build          key                                  owned lane   killed by
VALUE-LAST     length + last 1 move's from/to       2 failed/26  A5 r1, A5 r2
VALUE-LAST2    length + last 2 moves' from/to       1 failed/26  A5 r2
```

**A value-keyed cache sits on exactly the same rung as its identity-keyed twin.** The ladder is a
property of *how much of the tail* the key watches, not of *what it stores about it* — which is what
`A5`'s own class statement claims, now measured rather than assumed.

## THE VERDICT ON THE BOUNDARY

**The ledger's `MAY CLAIM` half is TRUE on this tip, all three parts, re-measured:** the four keys
`A14`/`A1`/`A5`r1/`A5`r2 name all die in `src/history-pane.test.ts` with the nfr file not loaded at
all; the rebuild is genuinely free for them (`3 / 2 / 1` kills, every one in the owned file); and the
accident is no longer the sole guard for any key any criterion names.

**The ledger's `MAY NOT CLAIM` half is TRUE and is not over-stated:** the class is open, and
`WCACHE-LAST3` is a live witness, not a theoretical one.

**And the boundary between them is in the RIGHT PLACE.** The ledger names `WCACHE-LAST3` as the
deepest known live witness; measured, it is also the **shallowest** and the **cheapest** one. There is
no key the ladder's shape implies is guarded that is not. **The one thing I would have reported as
worse than the deep witness — a shallow unguarded key hiding under a ladder that implies there isn't
one — does not exist, and that is now an enumeration rather than a search that happened to stop.**

## The ONE sentence in the ledger I would not carry, and it is about the framing rather than the ruling

> *"the axis is infinite, so there is **always** a next class without one. A ledger that runs out of
> rungs is a ledger that has stopped measuring."*

**True about keys. False about what this project can do about them, and the difference is
load-bearing** — see the sibling note on `A5`'s extension mechanism, which measures that the mechanism
closes rungs **0 through 15** and CANNOT express a row past that, because at `preservedTail` 16 the
whole edit falls outside the pane's 16-ply window and the row goes **red on the delivered pane**.

So the residual is not an infinite regress: it is **thirteen rungs**, each a real wrong build, each
closable by **one row of pure data**, and each caught today by nothing but the accident. **A finite,
countable, priced residual is a different object from an infinite one** — it can be closed, scheduled,
or accepted on the record with a number attached. The current wording makes the next row look
pointless, which is exactly the direction that keeps the accident load-bearing. **I am not disputing
the refusal to add the row in this ticket** — that refusal is defensible on scope and is priced. I am
disputing the sentence that makes the refusal look inevitable.
