---
id: 20261023T203448Z-software-engineer-decision-b1c5b861
kind: decision
by: software-engineer
at: 2026-10-23T20:34:48Z
verified_by: 
confidence: high (built to the ruling; QE and Security/NFR hops owed)
refs:
  - ticket-to-pr-ABC-203
  - ABC-203
  - EPIC-006
  - ADR-0047
  - grugops/ABC-203
  - 5e23e249
  - 55a8f4ef
  - arch-design-ABC-203/…e6de1e00
  - ADR-0036
  - ADR-0002
  - src/pgn.ts
  - src/pgn-file.ts
  - src/cli.ts
  - src/result-screen.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - .gitignore
supersedes: 
seal: sha256:f38b439936d9b12976eb8ba84756622407d6276be1c7aa14e9a3b2d5d1d292ac
---

# ABC-203 built to the ruling; In Development -> In Review (QE incl. A13 and the A10 CLI reading, then Security/NFR)

1. **Shape as ruled.** src/pgn.ts pure (pgnStamp from local getters; formatPgn with its own replay; history.ts, turn-loop.ts and cli-options.ts imported as types only; value imports apply, fen, san, result-screen). src/pgn-file.ts is the one node:fs writer: one import, one export writePgnFile(startedAt: Date, text) with an inline return type (no exported type alias, to keep "one export" literal), no process., no output; mkdir games recursive, "wx" stem then -2..-99, write to the fd, close, unlink its own path if either fails, errno code only, anything else rethrown (exit 70 via the one catch).
2. **Headline export name: resultHeadline** (the old private headline, renamed and exported); renderResultScreen calls it, rows unchanged. Header sentence updated: pgn.ts is the second importer.
3. **Comment wrapping.** The comment's words wrap like any other word, because a fault's two-line headline is ~105 characters and cannot fit one 79-character line without splitting a word.
4. **Test cwd seam.** childOf picks cwd by command: npm keeps REPOSITORY, every other child (including the /bin/sh wrappers and heapProbe) runs from one module-scope mkdtemp directory removed by exact path in afterAll. Child gains a cwd field so the guard rows read it. cli.real-engine.test.ts: no child has the repository as cwd and none reaches an outcome, so it gets no guard row; only its header sentence was updated.
5. **Licensed source-count edits (A14 clarification class), each with a dated reason:** process census 10 -> 11 (fourth process.stderr); sink.write 1 -> 2 (the saved line, pinned by name); ABC-101 A8' difficulty 2 -> 3 (pinned to the formatPgn call). The last two were not named in the ruling; both are source-reading rows on cli.ts counting what this ticket adds.
6. **For QE:** A13 hand reading; a CLI-level A10 reading (games as a regular file, and a 0555 games/, in a clone: screen bytes as a success run without the saved line, one stderr line, exit 0); the <= 50 ms write reading. **For Security/NFR:** the five items in the ruling; pgn-file.ts is the sixth holder.
7. UAT is not waived (production lines). Not pushed, not merged.
