---
id: 20261023T080232Z-qe-e2e-observation-0a5d72bb
kind: observation
by: qe-e2e
at: 2026-10-23T08:02:32Z
verified_by: 
confidence: high on this host (one series; same M3 as the builder, so not independent hardware)
refs:
  - ABC-201
  - EPIC-006
  - NFR-007
  - qe-ABC-201
  - security-nfr-timing-2026-10-23
  - ABC-200
  - c0585331
  - e9ed895e
  - c91445e3
  - 20261017T131800Z-security-nfr-observation-abc096-timing-a4-nfr007-window-w1-clean-8d3f6c15
  - ADR-0037
  - AR-096-DISKCOLD
supersedes: 
seal: sha256:a459598d09e4890cb68a488271b8c3e88def01699cecbf442f05998e1eb83d13
---

# QE's own fresh-clone re-reading at c0585331 (main with ABC-200): A1, A2 and A3 MET. The first board on a pipe is byte-identical to the pre-ABC-200 one, and the 23-newline pin holds

QE/E2E, task `qe-ABC-201`, 2026-10-23T08:00:00Z–08:01:11Z. Machine: Apple M3 (Mac15,13), Darwin 25.6.0 (macOS 26.7.1), node v26.11.1, npm 11.20.0, git 2.56.0.

- **The tree.** `git clone` of main's checkout (local path), `checkout --detach c0585331`; origin/main `e9ed895e`.
  - `c0585331` → `e9ed895e` touches only `.grugops/` and `plans/`, so the reading also holds for `e9ed895e`.
  - `c91445e3` → `c0585331` is **not** records-only. ABC-200 changed `src/cli.ts`, `cli-options.ts`, `line-input.ts`, `line-reader.ts` (new) and `startup-questions.ts` (new). This reading covers that code.
- **Driver.** `qe201.sh` (sha256 `3921fc07…`) is `run201.sh` with 4 stated changes: Q1 paths; Q2 SHA; Q3 a 600 s bounded gate instead of a wall deadline; Q4 one untimed no-flags pipe probe after A2. The order is unchanged.
  - **Instrument:** a byte-equal copy of `nfr007-201.mjs` (`d3940487c808…`).
  - **Readout:** a byte-equal copy of `readout201.py` (`b46d8ee22dca…`).
  - **Vitest probe:** `ps -axo command= | grep -c '[v]itest'`, run from a script file. A first manual check counted 3, but those were self-matches: QE's own shell command text contained the word.
- **Preconditions** (`st.tsv` `77c1523b…`, `gate.tsv` `597a2513…`):
  - pre-clone: AC, load1 4.34, thermal 0, vitest 0.
  - pre-install and post-install: AC, load1 4.15, thermal 0, vitest 0.
  - start gate: 13 polls 08:00:05–08:01:07Z, 61 s span, all OK, load1 3.39–4.18.
  - pre-A3, each of the 10 children, post-A3 and post-A2: AC, load1 3.39, thermal 0, vitest 0. post-Q4: load1 3.52.
  - **The host qualified, so A3's re-read is not UNRESOLVED.**
- **A1 MET.** Before the install: 0 cache entries, userconfig 0 bytes, no `node_modules`.
  - `npm install` with no flags: **rc 0**. Wall 1.76 s (user 0.90, sys 1.05). `added 66 packages, and audited 67 packages in 2s`.
  - `git status --porcelain`: 0 lines before, after and at the end.
  - The same allowScripts warning (esbuild 0.28.1, fsevents 2.3.3) and the same `3 vulnerabilities (1 moderate, 2 high)` line as recorded. QE did not re-run `npm audit`.
- **A3 MET.** 10 fresh children of `npm run --silent chess -- --colour white --difficulty 5`, stdin ended after frame 0.
  - Frame 0 pinned from child 1: **23 newlines** before the first `> ` line.
  - Spawn to frame 0, in ms, children 1–10: 227.2, 196.0, 196.1, 205.2, 201.4, 219.6, 212.6, 204.5, 203.4, 204.0.
  - **min 196.0 / median 204.3 / max 227.2 ms < 2 000 ms.**
  - **The first launch after the install (child 1) = 227.2 ms**, the max. Without child 1, reported only: 196.0 / 204.0 / 219.6.
  - Every child: exit 0, 0 stderr bytes, not timed out, 499 bytes. The readout's re-derivation at the pin equals the driver's figure for every child.
- **A2 MET.** `printf 'e4\n' | npm run --silent chess -- --colour white --difficulty 5`:
  - exit 0, stderr 0 bytes, 3 frames;
  - the last move-list row is `   1. e4      c5` (2 plies); the last frame's opening name is `Sicilian Defense`;
  - `input ended` once, after the last frame.
  - stdout sha `920135d9…` (1 471 bytes). It differs from the recorded `96a13b85…` only from byte 1 002 on: the engine's reply and what follows from it (the pawn rows, `last:`, the move list, the opening name). The book draw is `Math.random` per session (`src/book.ts`, ADR-0037 D3), so the reply varies by design (`QE-201-a`).
- **The 23-newline pin with ABC-200 merged: HOLDS.**
  - Child 1's raw stdout (sha `4e7ace1164fb…`) is **byte-identical** to Security/NFR's child 1 at `c91445e3`, from before ABC-200. All 10 of QE's children are byte-identical to it.
  - The first 485 bytes of the A2 and Q4 outputs (frame 0 and its 23 newlines) equal child 1's frame 0.
  - So on a pipe with both flags given, the first board is unchanged byte-for-byte, as ABC-200 `A6` requires.
- **Q4 (extra, untimed): ABC-200 `A6` on a pipe with no flags.** `printf 'e4\n' | npm run --silent chess`:
  - exit 0, stderr 0 bytes, 0 lines matching `colour`, `difficulty` or `?`, so 0 questions were written;
  - `e4` was played as the human's first move;
  - stdout is **byte-identical** to the recorded A2 stdout `96a13b85…` (this run's book draw also gave `e5`).
- **Kept.** Raw files are in the session scratchpad, `…/scratchpad/qe201/att1/`, which is not committed (fence: notes plus the page section). The shas above pin them:
  - child 1 stdout = the recorded `p2/att1/a3/child-1.stdout`;
  - Q4 stdout = the recorded `p2/att1/a2.stdout`;
  - A2 stdout `920135d9…` differs from the recorded A2 only in the reply `c5` and what follows from it.
  - Also hashed: `a3.jsonl` `dc3c3623…`, `readout.out` `86f0b6ca…`.
