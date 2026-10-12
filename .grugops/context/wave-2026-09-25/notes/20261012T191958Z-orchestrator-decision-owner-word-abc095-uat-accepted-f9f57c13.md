---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-12T19:19:58Z
sealed: false
refs: [ABC-095]
---

# Owner word, 2026-10-12 — ABC-095 UAT ACCEPTED

The owner played the branch `grugops/ABC-095-book-before-engine` (`2307fc11`, worktree `wt-ticket-to-pr-ABC-095`, started by absolute path) and said verbatim: **"UAT accepted, it plays instantly now"**.

- A first attempt the same day ("reject, it doesn't play instantly"; 1.e4 → d6, 1.d4 → d5 ×3, 1.c4 → e6 ×3) was read by the Orchestrator as a game started from the main checkout, which has no `withBook`: the unwired search reproduces exactly those replies at 3,000 ms each, while the branch under a pty replies from the book at once and varies (1.c4 → e6, g6, e5, Nf6). The owner then asked which branch is correct and re-tested on it. That attempt was never recorded as a rejection.
- UAT waiver did not apply (3 `src/` files in `0974102f..2307fc11`); this word is the UAT exit.
- Gates before merge: QE PASS_WITH_GAPS (`e1444f23`), Security/NFR S3 PASS_WITH_RISKS (`7b93c973`), N8-LANE MET on 3 sets (`315308e4`).
