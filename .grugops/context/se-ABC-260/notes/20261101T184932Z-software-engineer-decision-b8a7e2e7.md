---
id: 20261101T184932Z-software-engineer-decision-b8a7e2e7
kind: decision
by: software-engineer
at: 2026-11-01T18:49:32Z
verified_by: 
confidence: high: the strip was compared byte for byte with the old strip on all six files at the tip, and every plant was run out of tree under flock host-test.lock
refs:
  - se-ABC-260
  - ABC-260
  - EPIC-010
  - ADR-0056
  - R-TC
  - QE-259-a
  - QE-259-b
  - ABC-259
  - ABC-087
  - grugops/ABC-260
  - 524b7949
  - 22d815e7
  - 040f7f26
  - src/levels.test.ts
  - A8
supersedes: 
seal: sha256:587b38220ac58b4d77dd862ca3cadae86e6772d5498ac65ca9f2cbf888bfe585
---

# se-ABC-260 design: whole-word `process` in the environment row; form (b) as a string-aware comment strip shared by A8 and the ABC-259 block

1. **Environment row (Scope 1):** the match changes from `/process\.|argv|import\.meta\.env/g` to `/\bprocess\b|argv|import\.meta\.env/g`. The title now names `process` in place of `process.`, and one comment cites ABC-260 (QE-259-a). `argv` and `import.meta.env` are unchanged.
2. **Form chosen: (b), in a variant (Scope 2).** A new module-level helper `stripComments` sits directly above A8's describe. It makes one left-to-right `replace` with `/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\`(?:[^\`\\]|\\[\s\S])*\`|\/\*[\s\S]*?\*\/|\/\/.*$/gm`. String and template literals come first in the alternation and are returned **unchanged**. Comments are returned as "". So a `//` or `/*` inside a string never opens a comment, and a comment's quotes or apostrophes never open a string.
   - **Why the literals are kept rather than blanked:** A8's imports row reads the specifiers out of `code` (`from "./apply.ts"` …). Blanking would empty them and turn the row red, and A7 lets only A8's `code` line change. Keeping them also means a string such as `"node:process"` is still read by the environment row, which is how Q5 turns red.
   - **Where it is used:** A8's `code` line becomes `stripComments(source)`, and the ABC-259 block's `codeOf` becomes `stripComments(readFileSync(...))`. Nothing else in A8 changes.
   - **Form (a) not chosen:** a guard that lists string literals needs the same tokenizer to skip comments (A5's `"//"` inside a comment). It would also add a row and turn red on any future URL or glob string.
3. **A1 by construction:** the new strip's output is byte-identical to the old strip on engine, search, quiescence, evaluate, transposition and levels at the tip. The literals found were 13, 27, 5, 1, 1 and 16, with one template literal (in levels) and no single-quoted strings (raw/gates/strip-equivalence.txt). So the A1/A3–A5 STOP case does not arise.
4. **Known limits (unchanged scope):** a regex literal holding a quote, or a `${}` with a nested backtick, would mis-tokenize. Neither occurs in the six files. Obfuscated reads stay out of scope (ticket § Out of scope).
5. **Rows:** none added, so the lane header stays 49 (A7: "raised by the rows added" = 0).
6. **Commit layout (as in se-ABC-259):** claim 22d815e7 (queue files only), then code 040f7f26. `git diff 22d815e7 040f7f26 --name-only` lists only src/levels.test.ts. Over the base 524b7949 it also lists the two queue files.
7. **No ADR question found** (test note 2): the widened term reads R-TC item 2 as written.
