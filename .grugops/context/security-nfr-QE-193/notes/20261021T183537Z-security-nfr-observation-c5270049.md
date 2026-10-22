---
id: 20261021T183537Z-security-nfr-observation-c5270049
kind: observation
by: security-nfr
at: 2026-10-21T18:35:37Z
verified_by: 
confidence: high for the readings (own scratch clone, two identical runs); biome on the block-comment form UNKNOWN - verify; no timing
refs:
  - ABC-193
  - QE-193-a
  - QE-193-b
  - QE-193-c
  - QE-193-e
  - R-193-a
  - F-095-1
  - ADR-0036
  - ADR-0036 S1
  - aa86a1a1
  - 63eadabe
  - 11245e3d
  - V5.2.1
  - V5.3.2
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/security-nfr-QE-193/probe/repro.sh
  - .grugops/context/security-nfr-QE-193/probe/fix-prototype.patch
  - 20261021T182104Z-qe-e2e-decision-69c93667
  - 20261021T182104Z-qe-e2e-observation-9c7a6680
  - 20261021T182327Z-orchestrator-decision-f61be5db
supersedes: 
seal: sha256:51d36f0c6ec9281293b45ea8f1764b617b4e625e686c6f9bbaeaf6bb18a2fb15
---

# Security/NFR readings on QE-193-b and QE-193-a: both reproduced on `main` `aa86a1a1`. Both are blind on head's instrument (`63eadabe`) and on the instrument before it (`11245e3d`). A `++ b/src/<file>` line also sends later hunks to another file. One stand-in line flags both, with 0 hits over 174 `src/` commits. A scratch fix prototype closes both and keeps `r2-mutants.sh` at 20/20, byte-identical to head

**Setup.**
- The script and its output are in `.grugops/context/security-nfr-QE-193/probe/` (`repro.sh`, `repro.out.txt`).
- Every run used my own `git clone --shared --no-checkout` of `main` at `aa86a1a1`. It had a private `HOME`, `GIT_CONFIG_GLOBAL` (an empty file) and `TMPDIR`, with `GIT_CONFIG_NOSYSTEM=1` and fixed commit dates, so the plant ids reproduce. Two full runs gave identical output.
- No route was set. At the end, the clone had no `color.*` or `diff.*` key and no `.git/info/attributes`, and main's checkout had none either.
- Three instruments were run:
  - **head:** main's `clause-b.mjs`, run in place and read only;
  - **base:** `git show 11245e3d:<instrument>`, the one before ABC-193;
  - **fix:** a scratch copy carrying `probe/fix-prototype.patch`.

**Plants** (base = `aa86a1a1` unless stated). "Later hunk" means a hunk below the `++ ` line in the same file.

| plant | what | L1 head/base/fix | L2 head/base/fix | L3 head/base/fix |
|---|---|---|---|---|
| `PP-TPL` | `src/fen.ts`: a template literal holding `++ promoted pieces` near the top; a later hunk adds `process.env.FEN_URL` and `fetch(u)` | no/no/no | **no/no**/FIRES | **no/no**/FIRES |
| `PP-CMT` | the same, with the `++ ` line inside a `/* … */` block comment | no/no/no | **no/no**/FIRES | **no/no**/FIRES |
| `PP-CTL` | control: the same as `PP-TPL`, with `x promoted pieces` | no/no/no | FIRES ×3 | FIRES ×3 |
| `PP-REDIR` | as `PP-TPL`, with the line `++ b/src/glyph-mode.ts` | no/no/no | **no/no**/FIRES | **no/no**/FIRES |
| `PP-L1` | `++ ` line, then a later hunk adds `require("node:fs").readFileSync(p)` | FIRES ×3 (Ruling 2) | no ×3 | no ×3 |
| `PP-EDIT` | `src/cli.ts`, a limb-2 holder: a `++ ` template line, then far below an edit in place, `process.argv.slice(2)` → `slice(1)` | no ×3 | **no/no**/FIRES | no ×3 |
| `RA-PLUS` | template line `++ "quoted" note`, plus `PP-TPL`'s later hunk | FIRES (disputed)/no/no | FIRES (disputed)/no/FIRES | FIRES (disputed)/no/FIRES |
| `SP-N5` | base: `src/cli.ts` imports a benign `./q t.ts`. head: `src/q t.ts` gains a `node:fs` import, a `process.env.Q` read and a `fetch` | **no/no**/FIRES | **no/no**/FIRES | **no/no**/FIRES |
| `SP-N4` | a new, unreached `src/w t.ts` holding `node:fs` and `process.env` | **no/no**/FIRES | **no/no**/FIRES | no ×3 (it has no limb-3 call) |

**What the rows show for QE-193-b.**
- The fault is in `changedLines` (instrument lines 212–234). Any line starting `+++ ` resets `file`, wherever it sits.
  - So under `-U0`, the added text `++ x` becomes `+++ x`. `file` goes null, and every later hunk of that file adds no line to limbs 2 and 3.
  - The hunk that holds the `++ ` line is already counted, because its `@@` header came first.
  - A new file has one hunk, so it is immune.
- **It reaches more than a new capability line:**
  - `PP-EDIT`: an in-place edit of an existing `process` read is silent. `ADR-0036` § Decision 2 says such an edit "counts".
  - `PP-REDIR`: the later hunks are read against another production file's line numbers. The head output prints `production files changed: 2`, naming `src/glyph-mode.ts`, which the diff never touches. So this can also over-fire or under-fire on that other file, and it writes a false record.
- **What still holds:**
  - Limb 1 is held by Ruling 2 (`PP-L1`). Any new non-local import makes the file a holder at `<head>`, and the file is in `added` from its first hunk.
  - (b2) edges and non-literal `import()`/`require()` disputes are read from each end's AST, not from the diff, so they are immune.
  - The `-- ` mirror only undercounts Ruling 2's `-` lines. That is QE's `PM`: still FIRES.
  - A `++ "` line raises its own dispute (`RA-PLUS`, `R-193-a`), but a `++ ` line without a quote does not.
- **Lint.** QE measured the template-literal form lint-clean (`biome check` rc 0). I did not run biome on `PP-CMT`: `UNKNOWN - verify`.
- **The waiver form** (`AGENTS.md` line 150, `--name-only`) lists `src/fen.ts`, so no such change rides the UAT waiver.
- **Today:** `grep -rnE '^(\+\+|--) ' src` = 0.

**What the rows show for QE-193-a.**
- git appends one TAB to a `---`/`+++` header whose path holds a space. Raw: `+++ b/src/q t.ts^I`. The instrument keeps the TAB, and `isProduction` refuses the name.
- So the file's (b1) lines, its Ruling 2 entry and its non-literal-import disputes are all lost, on every limb.
- `git ls-tree` gives the name without the TAB, so on `SP-N5` the instrument's own baseline line names `src/q t.ts` as a new limb-1 holder (`holders 1 at <base>, 2 at <head>`) while the verdict says `does not fire`. That is visible, but it is not a trigger.
- A new edge to such a file still resolves for (b2), but **no dispute line arises**, unlike `AR-191-QUOTEPATH`.
- The waiver form prints `src/q t.ts`, so there is no ride on the waiver.
- Names with a space and a `"` are C-quoted and still dispute. The dispute line keeps the trailing TAB, which is cosmetic. A name holding a TAB is C-quoted (`"b/src/c\td.ts"`).
  - **So stripping one trailing TAB from an unquoted header path is unambiguous:** git adds it only for a space, and quotes any name holding a real TAB.
- Paths with whitespace under `src/` in all history (`log --all --name-only`): 0.

**The stand-in** (measured; the flags make it config-immune, and the same flags as the instrument):
`git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <head> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'`
- It prints a header-shaped line inside a hunk (QE-193-b), or a header ending in a TAB (QE-193-a).
- It flags 8 of 8 colliding plants (`PP-TPL`, `PP-CMT`, `PP-REDIR`, `PP-L1`, `PP-EDIT`, `RA-PLUS`, `SP-N5`, `SP-N4`) and is silent on `PP-CTL`.
- It holds under `GIT_DIFF_OPTS=--unified=5`, where context lines are prefixed with a space.
- Over main's history it has **0 hits**: 174 first-parent commits touching `src/`, and the `root..aa86a1a1` diff, 0 lines.

**The fix prototype** (`probe/fix-prototype.patch`; in `changedLines`, 3 lines added and 5 edited).
- A flag is set on `diff --git ` and cleared on `@@`. The quoted test and both header tests apply only while it is set. An unquoted header path drops one trailing TAB.
- Every `PP-*` and `SP-*` row FIRES where a capability line exists. `RA-PLUS` no longer disputes and fires on the real lines, so `R-193-a` is gone.
- It still FIRES on `PP-TPL` under `GIT_DIFF_OPTS=--unified=5`.
- **`r2-mutants.sh <repo> aa86a1a1 <scratch> <prototype>`:** rc 0, 20 of 20. Its output is byte-identical to the same harness on main's instrument, apart from the instrument sha line (`probe/r2-fix-vs-head.txt`).

**QE-193-c and QE-193-e:** not re-measured beyond the `GIT_DIFF_OPTS` checks above. QE's readings stand.

No timing was taken.
