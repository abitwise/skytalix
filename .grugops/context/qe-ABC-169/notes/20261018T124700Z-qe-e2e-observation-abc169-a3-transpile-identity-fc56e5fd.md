---
id: 20261018T124700Z-qe-e2e-observation-abc169-a3-transpile-identity-fc56e5fd
kind: observation
by: qe-e2e
task: qe-ABC-169
at: 2026-10-18T12:47:00Z
verified_by:
confidence: high
refs:
  - ABC-169
  - ADR-0036
  - 20261018T124600Z-qe-e2e-observation-abc169-acceptance-readings-9b0bf9ae
  - .grugops/context/wave-2026-09-25/notes/ (owner Q4, …5c8e2a17)
supersedes:
---

# ABC-169 A3: comment-only on both checks, and the probe can see a one-character escape

Hand-authored and unsealed. No timing was read.

- **`-U0`.** `git diff -U0 849d7f92 344a4128 -- src/evaluate.ts` is one hunk, `@@ -14,0 +15,6 @@`, which inserts
  before the base's closing ` */` (base line 15). It has 0 `-` lines. The filter for `+`/`-` lines that do not start with
  ` *` after optional whitespace prints nothing.
- **Transpile identity.** `ts.transpileModule(src, { compilerOptions: { removeComments: true } }).outputText`, with
  TypeScript 5.9.3, gives 9014 bytes at base and at tip. Both have sha256
  `629c825d9165a07154d336694e8b4f5b9c07d2c6110ac2029edd36e4172c7705`, and `===` is `true`.
- **Probe sanity.** With comments kept, the base and tip outputs differ (`true`), so the probe reads the change. A
  planted `;` after the closing ` */` makes the output differ from base (`identical? false`).
- UAT therefore stays WAIVED under the owner's Q4 word: "WAIVED (waived is not accepted)".
