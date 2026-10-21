---
id: 20261021T101020Z-qe-e2e-observation-cbd50a13
kind: observation
by: qe-e2e
at: 2026-10-21T10:10:20Z
verified_by: 
confidence: high
refs:
  - ABC-183
  - AR-180-VALIDATED
  - AR-162-FALLBACK
  - grugops/ABC-183
  - c4c6d36e
  - 7bd2b54f
  - 19abbdb1
  - 59fc9215
  - grugops/qe-ABC-183
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
  - QE-183-a
  - QE-183-b
  - src/book-file.ts
  - AR-095-CWD
  - ABC-162
  - ABC-168
supersedes: 
seal: sha256:4cdee2f04c4ef8c0cca47a21806f9fcecd6b9bdb8d0ce0eaca519190373ebc13
---

# ABC-183 survivors beyond the page's table: TMOC (capture moved with the write) and TCWD (booked's cwd argument dropped) both pass CLI_DEEP under P6f at head

These are scratch probes, not proposed diffs. The method is the same as the A4 matrix (P6f `0b016daf…`, private `TMPDIR`, 400 heap, one cell at a time).

- **QE-183-a, TCWD (LOW; pre-existing, from `ABC-162`; outside this ticket's scope).**
  - **The plant:** the head test with `booked`'s fourth argument `neutral` removed (sha `008c4e79…`). The child then runs with `spawnReal`'s default cwd, which is the tree root, where the real book sits.
  - **Result under P6f: 11/11 green, SURVIVES.**
  - **Why:** A7's `expect(join(neutral, "/")).not.toBe(join(REPOSITORY, "/"))` compares the *variable*, not the child's cwd. `RealChild` does not carry the cwd. Only the unasserted `[CLI_DEEP] (cwd …)` log line shows it.
  - So a one-token test edit disarms the `AR-095-CWD` / `AR-162-FALLBACK` detector. It is not a reordering, so the page's Value ("cannot be disarmed by reordering the setup") still holds as written.
  - **Shape left to Security/NFR and BA/PM:** have `spawnReal` return the cwd it used, and assert in A7 that `booked`'s cwd is `neutral`. That is 0 new spawns.
- **QE-183-b, TMOC (INFO).**
  - **The plant:** the decoy `mkdirSync` and `writeFileSync` **and** the capture line, moved together to directly after the `booked` spawn (sha `a7dd6d51…`).
  - **Result under P6f: 11/11 green, SURVIVES.** The capture now reads true after the child has exited.
  - Only the page's A1 `grep -B1` catches it, and A1 is a hop-time acceptance read, not a test.
  - The pin is relative to the capture's position, which is the shape Security/NFR specified (`…1b032e3f` § 3). This is a three-line co-move, so it is recorded, not escalated.
- **Neither survivor touches production code, and neither is a failure of A1–A5.**
