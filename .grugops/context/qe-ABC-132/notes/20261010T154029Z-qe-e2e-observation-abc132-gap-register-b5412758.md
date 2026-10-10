---
id: 20261010T154029Z-qe-e2e-observation-abc132-gap-register-b5412758
kind: observation
by: qe-e2e
at: 2026-10-10T15:40:29Z
verified_by:
confidence: high
refs:
  - ABC-132
  - QE-129-b
  - QE-132-a
  - QE-132-b
  - QE-132-c
  - .grugops/context/qe-ABC-129/probe/exit-probe.mjs
supersedes:
---

# QE `ABC-132`: gap register (1 LOW, fixed; 2 INFO)

This note is hand-authored and unsealed.

- **`QE-132-a` — LOW — FIXED by QE at `7387c65a`.** The SE's "(only `src/cli.ts` imports it)" in
  `src/result-screen.ts` was false over `src/`. `git grep` finds four importers: `cli.ts`, plus
  `cli.test.ts`, `command-input.test.ts` and `result-screen.test.ts`.
  - The claim is true over production modules, which is the set the frame path is defined on.
  - It now reads "(of the production modules, only `src/cli.ts` imports it)".
  - Why this is not pedantry: a reader who greps the claim would hit exactly the misdirection this
    ticket removes.
  - The fix is comment-only and inside the site. `A3`'s kept sentence is untouched, and the Q4 exit
    and all gates were re-taken after it.
- **`QE-132-b` — INFO — the ticket's `A4` filter has blind spots. The Q4 conjunction catches them.**
  The filter is `grep -E '^[+-][^+-]' | grep -vE '^[+-][[:space:]]*(\*|/\*\*|\*/)'`. It prints nothing
  for three kinds of edit:
  - a whitespace-only added line, including one INSIDE a template literal, which changes runtime
    output;
  - an added code line beginning with `+`, such as `++i;` (diff text `+++i;`);
  - a removed code line beginning with `-`, such as `--i;`.

  Measure (i) is also vacuous on whitespace-only lines, whatever the implementation. The emit
  measure (ii) goes red on all three (`probe/blind.mjs`). **This diff holds none of them**: its only
  `+++`/`---` lines are the 6 file headers. For future comment-only tickets: never take the `A4`
  filter or (i) alone as the exit. Keep the conjunction (`QE-129-b`).
- **`QE-132-c` — INFO — `qe-ABC-129/probe/exit-probe.mjs` `changed()` skips EVERY line that starts
  with `+++` or `---`, even inside a hunk.**
  - So an added `++x;` or a removed `--x;` is not counted, and (i) reads `changed 0 / 0 / 0`, which is
    vacuous. (ii) and (iii) still go DIFFERENT, so the conjunction holds.
  - It did not affect the recorded readings. `ABC-129`'s range `dc90f42d..0ee6424e` has 18 such
    lines = 9 files × 2 headers, and `ABC-132`'s has 6 = 3 × 2.
  - `probe/exit132.mjs` here recognises headers only outside a hunk. The next hop that applies Q4
    should use it, or patch the older probe. That probe is not edited here, because it is
    `qe-ABC-129`'s record.

Not a gap, recorded so nobody re-sweeps it:
- `npm run build` is `tsc --noEmit`, the same command as typecheck. This is already on record in
  earlier notes.
- The probe's per-frame phase draws only `ascii`/`white-bottom`, as its docblock states. QE's
  four-variant draw saw nothing more for `result-screen.ts`.
