---
id: 20261010T193535Z-qe-e2e-observation-abc094-gap-register-3058eacd
kind: observation
by: qe-e2e
at: 2026-10-10T19:35:35Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-095
  - NFR-006
  - QE-094-a
  - QE-094-b
  - QE-094-c
  - QE-094-d
  - QE-094-e
  - QE-094-f
  - QE-094-g
supersedes:
---

# QE `ABC-094`: gap register (1 MEDIUM open, 1 MEDIUM closed by QE, 5 INFO)

This note is hand-authored and unsealed. None of these gaps blocks the gate. `QE-094-a` must land on
`ABC-095` before `ABC-095` is pulled.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-094-a` | MEDIUM, open | BA/PM (amend `ABC-095`) | **`A5`'s "on stderr, never stdout" half has no owner.** The probe takes an injected warn sink (SE decision `…d14f72cb`, allowed by `ADR-0037` § Consequences), so the stream is fixed only where the root binds it. That root is `ABC-095`'s. `ABC-095` `A5` asks for "exactly 1 warning … for the whole process" and names no stream. Its `A3` is about 0 stderr bytes on a book hit, a different path. The SE flagged this ("`ABC-095`'s page should carry that check"). No page carries it yet. **Ask:** fold "the one warning goes to stderr and 0 bytes go to stdout" into `ABC-095` `A5`. Evidence it can hold: QE's child binding read stdout 0 B and stderr 1 line |
| `QE-094-b` | MEDIUM, CLOSED at `58726139` | QE (done) | **The delivered suite was blind to 8 non-equivalent mutants**, plus M30 when the garbage sits under an unreached key. The most material is **M01, the leading zero dropped from the key**: 330 of the 5,679 reachable keys have a leading zero, and the suite stayed green, so about 6 % of the book could miss silently. **M32**: the SE's "the warning carries no byte of the file" test was vacuous, because `JSON.parse` rejects the raw ESC before the key path. QE added 9 tests to the same file (1 file, 0 spawns), and every one of these mutants is now red |
| `QE-094-c` | INFO | none (inherent) | **The illegal-move check is lazy.** A schema-valid but illegal move under a key that is never probed never warns, because a Zobrist key cannot be inverted to its position. The probe still never returns an illegal move. This is consistent with `A6` ("nothing or only legal moves") |
| `QE-094-d` | INFO | Security/NFR, if it matters | **What "1 MB" means.** `BOOK_MAX_BYTES` = 1,048,576 (MiB). `NFR-006` says "≤ 1 MB" and does not define the unit. The artifact is 356,526 B, under either reading. QE pinned the code's own boundary (exactly `BOOK_MAX_BYTES` is accepted), not the unit |
| `QE-094-e` | INFO | none (covered by `ABC-095` `A5`) | **The probe warns once per instance, not once per process.** Two probes in one process warned 2 times. The scope's "once per process" holds only if the root builds one probe per process. `ABC-095` `A5` ("exactly 1 warning for the whole process") is where that half is proven |
| `QE-094-f` | INFO | none | **Reading the cost.** One of QE's two narrow-set readings is admissible: run 1 at load1 median 4.93, twin 1.42 % (the margin is 0.08 pp), MET at +0.345 s against 650 ms. Run 2 at load1 median 9.43 is inadmissible (−1.76 %). The 30 ms hit bar was read on Node v26.11.0. The reference names v24.12.0, so the reference reading is `UNKNOWN - verify` |
| `QE-094-g` | INFO | human (git host) | **`host-protection.js` exit 2.** The check is `UNKNOWN - verify`, because gh returned no readable HTTP status. This is environmental, not the ticket's. The optional `n` accessor was not built. That is allowed: it is `ABC-096`'s to want |
