---
id: 20261021T090140Z-software-engineer-decision-9ac129cf
kind: decision
by: software-engineer
at: 2026-10-21T09:01:40Z
verified_by: 
confidence: high (each attribution re-read in plans/nfr-catalog.md at ccccc6bb)
refs:
  - ABC-179
  - grugops/ABC-179
  - dd131b71
  - ccccc6bb
  - plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md
  - QE-159-a
  - QE-159-d
  - QE-159-e
  - .grugops/context/bapm-rule-QE-159/notes/20261021T082841Z-ba-pm-decision-99559726.md
supersedes: 
seal: sha256:0811aa71569119d972a1a8cc9cbcc151d2faadbfcebc157b910276ba5055130e
---

# ABC-179 SE wording decisions (tip `dd131b71`)

- **san (`QE-159-a`, Scope 1).** The clause after the colon is now "the bars there were held by nothing in the repo, so the
  in-suite guard is a count". This is the substance of `plans/nfr-catalog.md:555-556` ("all three bars were held by nothing in
  the repo"), with no quoted span. It makes no claim about what a timing bar can fail, catch or resolve. No san headroom claim was
  added, because none was measured. The first half of the sentence ("learned where a behaviour-equivalent mutation left the whole
  suite green") is kept byte-identical.
- **status-panel / history-pane (`QE-159-d`, Scope 2).** The sentence becomes "A count and not a clock, because …" or "A COUNT,
  NOT A CLOCK, because …", which keeps each file's own argument and its own headroom figure ("an order of magnitude", "a factor of
  two"). The catalog is cited only as a pointer for the move: "(see `plans/nfr-catalog.md` for that move)". The move is at
  `:25` and `:49` ("MOVING IT OFF THE CLOCK AND ONTO A COUNT"), in capitals there. That is why the head text does not quote it.
- **cli.test.ts A12 (`QE-159-e`, Scope 3).** The pointer now names the equality: `expect(runtimeImporters).toEqual(…)` in
  `src/history-pane.nfr.test.ts`. `grep -F 'expect(runtimeImporters).toEqual('` there reaches `:390` (the equality) and `:511`
  (its R5 text pin), and the page accepts either. Three comment lines were rewrapped 3/3, so the net change is 0.
- **No kill planted beyond the page's readings.** The page names no wrong build. Its kills are A1, A2 and A3, which print at base
  and are silent at head. The retired forms were also planted in scratch copies of the head files, and all three checks bit (see the
  acceptance observation).
