---
id: 20261021T081851Z-qe-e2e-observation-b9df505d
kind: observation
by: qe-e2e
at: 2026-10-21T08:18:51Z
verified_by: 
confidence: high (QE's own read); san's 'could fail' inference UNKNOWN - verify
refs:
  - ABC-159
  - grugops/ABC-159
  - 3c505abe
  - 4ab5b453
  - plans/tickets/ABC-159-four-nfr-test-headers-carry-a-running-tally-of-the-catalog-and-they-disagree.md
  - A3
  - QE-159-a
  - src/status-panel.nfr.test.ts
  - src/history-pane.nfr.test.ts
  - src/turn-loop.nfr.test.ts
  - src/san.nfr.test.ts
  - plans/nfr-catalog.md
supersedes: 
seal: sha256:ab06fc5149197d1729e699e1fc24eed9c96bcda21983dbe60f1dcec2290cf972
---

# ABC-159 A3, QE's own read of the four rewritten sentences (joined text, tip `3c505abe`)

QE graded these before opening the SE's decision note `…69b2939c`. The bar: the sentence still says, in
substance, that the bar is a count because a timing bar could not fail on the regression. It must also keep
no count or ordinal of anything outside the file, including forms A1's regex does not read.

| site | does it say "count because a clock cannot fail"? | tally left? | grade |
|---|---|---|---|
| `status-panel.nfr.test.ts:4-6` | yes: "a timing bar with an order of magnitude of headroom cannot fail on the regression it exists to catch, so the bar moves off the clock and onto a count" | none ("three times" and "each after" are gone) | MET |
| `history-pane.nfr.test.ts:5-7` | yes: same form, "a factor of two of headroom" | none ("five times now" and "each time" are gone) | MET |
| `turn-loop.nfr.test.ts:8-10` | yes: "It is a count and not a clock because a timing bar with that little headroom cannot fail on the regression it exists to catch". "That little" points back to the file's own 2x | none ("the sixth bar on this project" is gone) | MET |
| `san.nfr.test.ts:17-19` | yes, by its letter: "a timing bar cannot fail on the regression it exists to catch, so the guard is a count" | none ("twice" and "both times" are gone) | MET, gap `QE-159-a` |

## Search wider than A1
`probe/wide-tally.cjs` reads joined comment text. Its sentence split ignores dots inside code spans. It flags
any sentence that mentions the catalog, "on this project", "off a/the clock" or "onto a count" and also holds
"N times", "both times", "each time", "every time", "again", "once more", "times now", an ordinal plus
bar/time/move/lesson/record, or "the first … the latest".
- **Base:** finds the four ticket sites plus `glyph-mode.nfr.test.ts`'s "both times". glyph-mode is out of
  scope by the page.
- **Tip:** finds only the glyph-mode site and one false positive. The false positive is `status-panel`'s
  "twice", which sits in code below the header, unchanged. **None of the four sites matches.**

Other numbers in the four headers are about the file itself or name what they count: history-pane:2 "the third
… part of `A12`", history-pane:17 "the two tickets", turn-loop:18 "THREE PLY COUNTS", and san:5/27 "42 moves" /
"four assertions". None of them is a tally of catalog citations, and none was changed by this diff.

## San: why the grade carries a gap (QE-159-a)
The san sentence drops the headroom qualifier that the ticket's Scope gives the lesson ("a timing bar **with small
headroom**"). As a bare universal, the clause is false. It also hangs the clause on the catalog's "A measurement
is not a guard" lesson (`plans/nfr-catalog.md:555-558`). That lesson says the bars were held by nothing in the
repo, not that a timing bar cannot fail. The header's own figures (lines 7-8: `ADR-0004`, ~97% `legalMoves`)
imply that `N1`'s ≤ 1/5 ratio would move toward 1 if a build ignored the supplied `legal` list. For that
regression, a timing bar plausibly *could* fail if it were measured. That is an inference, not a measurement
(no timing at this hop): `UNKNOWN - verify`. The root is upstream. The ticket's Scope and A3 put the
count-not-clock lesson on a sentence whose argument was a different one.
