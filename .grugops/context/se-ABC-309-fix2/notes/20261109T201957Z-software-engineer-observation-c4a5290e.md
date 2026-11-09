---
id: 20261109T201957Z-software-engineer-observation-c4a5290e
kind: observation
by: software-engineer
at: 2026-11-09T20:19:57Z
verified_by: 
confidence: high for the README edits and the A1, A2, A5-A8 re-checks (run on this host); the Arena, BanksiaGUI and Windows routes and the macOS Settings label UNKNOWN - verify (not run)
refs:
  - se-ABC-309-fix2
  - se-ABC-309
  - grugops/ABC-309
  - ABC-309
  - 1064eb4e
  - README.md
  - qe-ABC-309/20261109T201720Z-qe-e2e-decision-858d4098
  - qe-ABC-309/20261109T201711Z-qe-e2e-observation-7f94de2f
  - AR-NFR004-A
supersedes: 
seal: sha256:14dbc9fc289efc9919a12997f338ceecf89efe9207271173fe8a75bbb04e3d2d
---

# se-ABC-309-fix2: A3's untested marks and QE's low gaps, README.md only; the re-checks

Software Engineer, task `se-ABC-309-fix2`, on `grugops/ABC-309` from `1064eb4e`. Source: QE's verdict `qe-ABC-309` `…858d4098` (FAIL on A3 only) and its observation `…7f94de2f`. `README.md`, ABC-309's Result block and this note only; nothing under `src/` (the stale `src/levels.ts` comment is left, out of scope). Host commands ran under `flock <scratch>/<home>/<repo>/host-test.lock`.

## Changed
1. **A3:** the Arena and BanksiaGUI subsections each say in bold that their steps have not been tried in that GUI, as Cute Chess's Windows route does.
2. **Cute Chess on macOS:** step 2 says Settings is in the application menu there, not under Tools (from QE's reading of `mainwindow.cpp:191`, `PreferencesRole`).
3. **§ Strength:** 100 ms a move is much shorter than level 5's normal 4 s; the default level in normal play should be at least that strong; not measured.
4. **`simple-tournament`:** aims to stay within the clock, can run over by a few milliseconds, give it a small margin (QE: 202 ms on `movetime 200`, `AR-NFR004-A`). 22 s kept.
5. **`level`:** plays at most the `Skill Level`'s time per move.
6. **Readability:** the intro now matches Cute Chess (Arena and BanksiaGUI run `node` plus the path; Cute Chess runs the script). The Arena and BanksiaGUI `skytalix.cmd` fallbacks are self-contained, with no pointer to Cute Chess. Both name `where node` in a Command Prompt to find `node.exe`. No fourth `###` subsection was added, so A3's "exactly three" holds.

## Re-checks at the fix-2 working tree
- A1: `git diff --name-only efd2230b | grep -c '^src/'` prints 0.
- A2: `test -s` holds; line 1 is ` ```text `; the `cmp` command exits 0.
- A5: `printf 'uci\nquit\n' | node dist/uci.js` gives 3 `option name` lines equal to the table; 22 s and 59.5 s unchanged; `two options` counts 0.
- A6: personal-path, IPv4 and e-mail scans count 0; the one absolute URL is the clone URL.
- A7: `AGENTS.md`, `LICENSE`, `NOTICE` pass `git ls-files --error-unmatch`; `npm run lint` exits 0 (148 files); `npm run build` exits 0.
- A8: `FIGlet` counts 0; § Licence differs from `efd2230b` by the credit line and its blank line only.

Not checked: no GUI window, Windows or macOS host was used; the Arena, BanksiaGUI and Windows routes and the macOS Settings label are `UNKNOWN - verify`. Commands ran in this worktree, not on a fresh clone.
