---
id: 20261024T084459Z-security-nfr-observation-a9182d9f
kind: observation
by: security-nfr
at: 2026-10-24T08:44:59Z
verified_by: 
confidence: high (every reading run this hop at head 2a9f38cf, output read; npm private guard by source read, no publish run)
refs:
  - ABC-214
  - security-nfr-ABC-214
  - ABC-041
  - ADR-0048
  - grugops/ABC-214
  - c4acf49f
  - bb8d4432
  - 306f1083
  - 2a9f38cf
  - A1
  - A2
  - A3
  - A4
  - A6
  - c487d89c
supersedes: 
seal: sha256:cba278c65c60cbd17dcd2b1ed701cbebe5764f3a944386c9770d821a99a7e1d9
---

# ABC-214 Security/NFR readings: ABC-041 (a) fires with no finding; `private` still blocks publish; no personal or host detail beyond the owner's copyright line

Base `c4acf49f`, tip `bb8d4432`, branch head `2a9f38cf` (QE merge `306f1083` plus QE records). From `306f1083` to `2a9f38cf` only `.grugops/context/qe-ABC-214/` and the page changed. Every reading below was run this hop in `../wt-ABC-214`, and each output was read.

- **ABC-041 clause (a), dependency surface.**
  - `git diff --numstat c4acf49f 2a9f38cf -- package.json package-lock.json`: `1 1` and `1 1`. The clause fires because the files were touched.
  - Every changed line is the licence value: `"license": "UNLICENSED"` became `"license": "Apache-2.0"`, once in `package.json` and once under the lock's `packages[""]`.
  - The lock diff has 0 changed `resolved`, `integrity` or `version` lines. No package was added, removed or re-pointed.
  - `jq` on `package.json`: `has("dependencies")` false, `has("publishConfig")` false, `has("files")` false.
  - `.scripts`, `.devDependencies`, `.bin` and `.engines` are identical at base and tip (`jq -S`, then `diff`). No lifecycle script was added.
- **`"private": true` still keeps the package off npm.**
  - At the tip `.private` is `true`. The tip still pins it: `src/cli.test.ts` `expect(packaged.private).toBe(true)` in ABC-042 A10.
  - Source read of the installed npm 11.20.0: `libnpmpublish/lib/publish.js:15` throws `EPRIVATE` on `manifest.private` before any registry call. `lib/commands/publish.js:194` calls it only outside `--dry-run`. No publish was run.
- **`LICENSE`.** sha256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`, 11358 B, 0 non-ASCII bytes. That equals the A3 pin. Its only copyright text is the Apache template's own `[yyyy] [name of copyright owner]` placeholder.
- **`NOTICE`, the two `src/evaluate.ts` header lines, and `LICENSE`, scanned for personal or host detail.**
  - The patterns: `@`, `/Users/`, `/home/`, `~/`, `localhost`, `.local`, `.lan`, `.internal`, `.home`, IPv4 dotted quads, `homelab`, `tailscale`, `ssh`, `token`, `secret`, `key`.
  - Each pattern gives 0 in all three files.
  - Non-ASCII bytes in `NOTICE`: 0.
  - **The owner's name** is in `NOTICE` twice and nowhere else:
    - the copyright line `Copyright 2026 Olger Oeselg` (ADR-0048 decision 2);
    - the kit MIT line `Copyright (c) 2026 Olger Oeselg` (ADR-0048 decision 5).
    
    The owner chose both lines.
  - **URLs:**
    - `NOTICE` has two, the chessprogramming.org page and the creativecommons.org licence page.
    - `LICENSE` has the Apache licence's own two.
    - Neither file has any other URL.
- **Emitted code.**
  - `ts.transpileModule(…, { removeComments: true })` of `src/evaluate.ts` gives 9014 B, with the same sha256 prefix `629c825d9165a071`, at `c487d89c`, `c4acf49f`, `bb8d4432` and `2a9f38cf`.
  - It used the worktree's own `typescript` and ran in scratch.
  - This confirms the QE and SE A6 readings independently.
- **The page's Security/NFR predictions all hold:**
  - (a) fires;
  - (b1) does not fire: the change is comment-only by the transpile identity;
  - (b2) does not fire: no import edge was added;
  - (c) does not fire: one `expect` line, with no import, call or capability;
  - (d) the blast radius is the two `src/` files named in A9.
