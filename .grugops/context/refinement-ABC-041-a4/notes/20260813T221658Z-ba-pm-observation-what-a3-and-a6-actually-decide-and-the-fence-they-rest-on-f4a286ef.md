---
id: 20260813T221658Z-ba-pm-observation-what-a3-and-a6-actually-decide-and-the-fence-they-rest-on-f4a286ef
kind: observation
by: ba-pm
at: 2026-08-13T22:16:58Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.ts
  - src/render-seam.test.ts
supersedes: 
---

# `A3` and `A6` said *"over the diff"* and are read over ONE FILE. Both now say what they decide, and both name their blind spot.

Three gaps, all criterion wording, **none a defect in the delivered build** — which satisfies all
three honestly.

## The scope mismatch, and what actually stops it being exploited

The criteria said *"asserted textually over the diff"* (`A3`) and *"asserted over the diff, not by
inspection"* (`A6`). The delivered instruments read **`src/render-seam.ts`** — one file. QE's `X9`
moves a literal `HEIGHT = 23` and a real `process.env` read into a sibling module one import away:
**824/824 green**.

Both criteria are now scoped to **this module's source**, which is what the instrument reads. That is
the honest direction, and it is only honest because of a fence that already exists: **`A10` forbids
touching any file under `src/` other than this module, its test file and the one probe-root line**, so
a sibling module cannot be added at all. `A10` is now the only diff-scoped criterion on the page and
says so, and `A3`/`A6` say they rest on it.

**The residue, stated rather than buried: `A10` is checked by reading the diff, not by an assertion in
the suite.** That is why `X9` was green on `npm test` — it breaks `A10` at review, not at the runner.
Widening `A3`/`A6` to read the diff would not have fixed that; it would have moved one review-time
check into two places. Whether `A10` should become mechanical is a real question and it is **not**
raised as a ticket here: it is one line of judgement on a criterion whose author (me) has just been
refuted once on this page, and the next hop to touch that file is QE's.

## `A3` — the instrument is "no digit", the property was "no row-count literal"

`X7` writes a 23-row clamp with no digit (`"xxx…".length`) and is green. The criterion now states the
instrument exactly — **the executable text, comments stripped, contains no digit character at all** —
which is strictly stronger and mechanically decidable, and names the blind spot: a height spelled
without digits is not caught.

**And it is not caught behaviourally either, which is the part worth writing down.** `A3`'s
behavioural half asserts a single distinct height equal to `frameHeight(...)`. `frameHeight` returns
the same value for **every** input this module can be given — board 9, `STATUS_ROWS` 3,
`HISTORY_ROWS` 8 — so a constant that happens to equal it is a **no-op on every reachable input**.
`X7` is undetectable by construction, not by weak testing. `A3`'s textual clause is a *design* guard
(`ADR-0009` clause 9 puts the height with `assembleFrame`), and a design guard over source text is
what it is; pretending otherwise is how a spelling check gets read as a semantic guarantee.

Verified against the delivered module before writing the clause: executable text has **no digit, no
`process`, no `globalThis`, no `import.meta`**.

## `A6` — the substring check was one keystroke wide, and it is now four spellings wide

`X8` reads the environment as `globalThis["process"]`: **8/8 green, lint clean**. The criterion now
requires **zero** occurrences of `process.`, of the bare word `process`, of `globalThis` and of
`import.meta` in `src/render-seam.ts` (comments included, as delivered).

**This is a real strengthening, not decoration** — it kills the measured mutant — and it is also
**not a claim to have closed the class**. Any grep loses to the next spelling. The clause now says so,
and points at where the capability property actually lives: the repaired firing threshold's clause
**(b)**, which is scoped to *any non-`.test.ts` file under `src/` and its runtime closure* rather than
to one file's text.

I checked the delivered module against all four spellings before adopting them — **0, 0, 0, 0** — so
this costs the Engineer's next hop nothing but the assertion.

## What is NOT claimed

- Not claimed that these clauses make `A3`/`A6` un-evadable. They are text checks over one file and
  the notes say so in the ticket itself.
- Not claimed that `X7`, `X8` or `X9` are defects in the delivered build. They are mutants; the
  delivered module puts no literal, no ambient read and nothing in a sibling.
- Not claimed that any of this is QE's to re-run. The rows that follow this wording are the
  Engineer's next hop.
