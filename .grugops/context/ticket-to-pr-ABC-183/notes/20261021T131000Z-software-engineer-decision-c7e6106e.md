---
id: 20261021T131000Z-software-engineer-decision-c7e6106e
kind: decision
by: software-engineer
at: 2026-10-21T13:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-183
  - AR-180-VALIDATED
  - AR-162-FALLBACK
  - ABC-180
  - ABC-095
  - grugops/ABC-183
  - 7bd2b54f
  - 19abbdb1
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
  - 20261021T092600Z-security-nfr-decision-1b032e3f
  - 20261021T082210Z-qe-e2e-observation-567002e7
supersedes: 
seal: sha256:95b30b895b222be72c32092280ad84eabf6ccb11d51ae783a2b8da65a709e9a2
---

# ABC-183 build decisions: the variable, the label words, the comment line, the base

- **Base:** `main` `19abbdb1` (the tip at start). `git diff --stat 59fc9215 19abbdb1 -- src` is empty, so the page's `59fc9215` readings apply. Code commit `7bd2b54f` on `grugops/ABC-183`.
- **Variable:** `let decoyBeforeBooked: boolean;` declared in the `ABC-095` `describe` block, after `neutral`, with a doc comment naming `ABC-183` and `AR-162-FALLBACK`.
- **Capture:** `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` on the line directly before `booked = spawnReal(…)`, i.e. after the `bookless` spawn. The `bookless` spawn did not move.
- **Assertion:** in `A7`'s `it`, directly after the existing in-`it` decoy-present check: `expect(decoyBeforeBooked, "AR-162-FALLBACK: the decoy must exist before the booked child spawns, or the detector is disarmed").toBe(true)`.
- **Comment:** a new `//` line directly under the existing `ABC-180` comment, two lines above the `writeFileSync`: `// \`ABC-183\`: this write MUST come before the \`booked\` spawn, or a cwd-first read finds nothing.` A new line was chosen over lengthening the `ABC-180` line so that line stays as delivered.
- **Not done (fenced):** no new spawn, `it`, `mkdtemp` or import (`existsSync` was already imported); `ABC-180`'s assertions and label untouched; no production file.
