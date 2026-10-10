---
id: 20261010T092602Z-qe-e2e-observation-abc069-gap-register-8c2f6eb3
kind: observation
by: qe-e2e
at: 2026-10-10T09:26:02Z
verified_by:
confidence: high
refs:
  - ABC-069
  - ABC-065
  - ABC-067
  - QE-069-a
  - QE-069-b
  - AGENTS.md
  - src/cli.test.ts
  - 20261010T092602Z-qe-e2e-observation-abc069-plants-six-red-four-green-781576a3
supersedes:
---

# `ABC-069` gap register: two LOW gaps, both advisory, neither blocks

Neither gap is a criterion miss. The page asked for a rule about **options**, and the delivered text
gives one. Both gaps are places where the guard is stricter than the sentence that now describes it.
The page's fence holds: **do not loosen the guard.** Neither gap asks for that.

**`QE-069-a` (LOW). Owner: the `AGENTS.md` Scribe at the next touch of § Commands. Optional.**
Rule (2) says "name an option here only if the program accepts it". The `A3` collector,
`/(?<![\w-])--[A-Za-z0-9-]*/`, reds on any `--`-prefixed word, whether or not it is an option. Probe `E1`
(` ---`) went red. A `--` dash glued to the next word (`defaults --see`) would be collected the same
way. A bare `--` with a space after it (`E3`) is safe. A Scribe can obey rule (2) as written and still
red the suite. The red names the token, so the failure costs one line to diagnose. Possible wording:
"no `--`-prefixed word". No action is required.

**`QE-069-b` (LOW). Owner: the `AGENTS.md` Scribe. Optional.**
The new sentence names `ABC-067` as "a comment that closes inside it". It does not say that the guard
reads a line beginning `- ` (column 0) as the next list item. Probe `E2` unindented one wrapped line,
and all four slot rows went red with "slot comment does not close before the next list item". The
delivered text uses an ASCII ` - ` as a dash twice (`backticks - the guard`, `does not - write`), while
the rest of the slot uses `—`. So an unindented re-wrap now has two places where it can put `- ` at
the start of a line. Today every continuation line carries a 2-space indent, so the slot is safe. The
red is loud and names the cause. Possible fix: use `—` for those two dashes.

**Noted, not gaps:**
- `AGENTS.md` `Test (all)` still says 1539 tests while the tip measures 1540. The Scribe recorded this,
  and the page's fence ("receipts not refreshed") is why it stays. It belongs to the next receipt refresh.
- The re-wrapped `Full receipts …` line is 129 bytes, against 84-98 for its neighbours. It is
  cosmetic, inside the comment, and lint is green.
- `A6`'s "`spawned` still 10" is out of date on the page. `N8_SPAWN` is 27 today; later tickets raised
  it. This diff does not move it.
