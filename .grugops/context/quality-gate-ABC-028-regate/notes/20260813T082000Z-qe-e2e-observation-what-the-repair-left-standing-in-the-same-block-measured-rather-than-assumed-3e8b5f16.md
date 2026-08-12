---
id: 20260813T082000Z-qe-e2e-observation-what-the-repair-left-standing-in-the-same-block-measured-rather-than-assumed-3e8b5f16
kind: observation
by: qe-e2e
at: 2026-08-13T08:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-030
  - src/history-pane.test.ts
  - src/zobrist.nfr.test.ts
  - src/status-panel.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# What the repair left standing THREE LINES ABOVE itself — checked rather than assumed — and the three record items that survive the merge

> **Hand-authored `observation`, not a `finding`.** Same absence of a stamp, same reason. Every
> number below was measured on the merged tip `0ee148e`.

## The done-condition greps, re-run on the merged tip by a role other than the one that wrote them

```
/usr/bin/grep -rn "anywhere in the project" src/                          exit 1   ZERO hits in all of src/
/usr/bin/grep -nE 'anywhere in the project|[0-9]{3}/[0-9]{3}' src/history-pane.test.ts
                                                                          exit 0   :87 and :307 ONLY
sed -n '486,504p' src/history-pane.test.ts | same grep                    exit 1   ZERO hits in the A9 block
```

**The Engineer's done-condition line 2 reproduces exactly, and their two disclosed surviving hits
are the only two.** `:87` is *"the builder for 40/80/120/300"* (fixture sizes) and `:307` is
*"9998/9999 are the widest move numbers reachable by play"* (move numbers). **Neither is a suite
total.** Obligations (i) and (ii) are discharged and `732/732 on 26 files` was **deleted, not
refreshed** — confirmed at source.

## The sentence the repair did NOT touch, three lines above the one it did

The `A9` block's surviving opening still reads: *"`ALL_CASES` are module-scope singletons that
**`A1`, `A2` and `A6`** have already rendered."* **That is a three-item enumeration over the file
— structurally the same shape the repair was sent to remove — and it was left alone.** So I checked
it instead of assuming it inherited the repair's safety.

`ALL_CASES` has 14 members: the ten `LENGTH_CASES`, plus `WIDE_WHITE`, `WIDE_BLACK`,
`FROM_WHITE_ANCHOR`, `FROM_BLACK_ANCHOR`. Every `renderHistory` call site declared **before** the
block (`:486`) was enumerated mechanically and attributed to its enclosing `it`:

```
member                                   rendered before :486 by
LENGTH_CASES (ten)                       A1 :278   and   A2 :284
WIDE_WHITE / WIDE_BLACK                  A2 :308, :309
FROM_WHITE_ANCHOR / FROM_BLACK_ANCHOR    A6 :389, :390
```

**The enumeration is EXACT on this tip — every member, exactly those three criteria, nothing
else.** The other fifteen pre-block render sites all take freshly-built objects (`lineTo(…)`,
`deterministicGame(…)`, `FROM_BLACK_ANCHOR_20`) and touch no `ALL_CASES` member.

**It is a citation of the same class as `S4`, and it is TRUE**, so it is reported as checked rather
than as a gap. It is falsifiable by the same kind of same-file commit (renaming one of those three
`it`s, or moving the `A9` block above them), and it stays inside the parent hop's own rule that a
figure scoped to the file you own is yours to keep true. **Not routed. Recorded so the next reader
does not have to re-derive it, and so nobody mistakes my silence for not having looked.**

## The three record items that survive the merge, re-counted here rather than inherited

```
site                                      says   the runner reports   status
src/history-pane.nfr.test.ts:116          26/26  26 in that file      HOLDS — the edit was comment text
src/zobrist.nfr.test.ts:18                "13"   23                   STALE, and staler than at my 755 run
src/status-panel.nfr.test.ts:11           "26"   29                   STALE, unchanged
src/history-pane.test.ts:1018             prediction about two rows   HOLDS — tested, see sibling note
```

**`G2` and `G3` are `ABC-030`'s, are unchanged by this ticket, and are re-confirmed live on the
merged tip.** I am not re-deriving their analysis — the narrow re-gate holds it — only recording
that the merge did not close them and that the counts are the runner's, not a grep's.

## `H4` — the published `+4` anchor-drift rule contradicts itself

The Engineer's drift note states the rule as:

> *"an anchor into this file at `:495` or below is unchanged; an anchor at `:495` or above is
> `+4`."*

**`:495` is in both halves.** Their own table gives the correct rule unambiguously — pre-edit `766`
→ `770`, pre-edit `351` → `351` — so the boundary is: **at `:494` or below unchanged, at `:495` or
above `+4`.** The intent is clear and the table is right; the sentence a later reader will quote is
the one that is wrong. **One character.** Routed as `H4` precisely because this ticket's entire
subject is published prose that a later hop trusts, and their own reasoning for stating a rule
rather than a list ("a list of six goes stale on the next edit, the rule does not") only pays if
the rule is exact.

## `H3` — `A4`'s live lane figure is stale for the FOURTH time

```
the ABC-028 page's A4 says      "1 failed, 749 passed" against "750 passed (750)"
my final gate measured          1 failed / 752
my narrow re-gate measured      1 failed / 755
measured on the MERGED tip      1 failed / 807 on 28 files, against a 0 failed / 807 control
```

**The SHAPE assertion — exactly one failure, it is `A4`, zero pre-existing tests break — has held
at every one of the four totals.** The number is a number, `## Test notes` 4 already demotes it to
a claim, and it changes no conclusion. **It is recorded a fourth time because this is a ticket whose
thesis is that a number in prose goes stale, and its own page is now the standing example.** LOW,
and I do not recommend re-opening a merged ticket for it.
