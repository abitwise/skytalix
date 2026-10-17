---
done_at: 2026-10-17T11:22:30Z
branch: grugops/ABC-024-castling-default-lane (worktree ../wt-ABC-024; base b84dc637; code a18da7f5)
tip: 822affb9 (QE notes + probe + ticket § QE; reviewed tip 290a9f86; no code, no other file)
result: PASS_WITH_GAPS. QE re-planted every mutant on its own instrument (qe-ABC-024/probe/qe-harness.mjs) before opening the SE's harness.
  - Mutants: git-archive trees of base and head in session scratch, outside the repo; fresh tsc + vitest per state; every *_DEEP unset; anchors exactly once; md5 6335b452... re-asserted after each state. 0 broken builds, 0 harness errors.
  - The seven: base BK g8 / BQ b8 / BQ c8 / R-half / R-ep SURVIVE 1792/1792; BQ d8 (book A2) and R-full (262 nodes) die on one incidental row each. Head: all seven die on A1/A2 rows (g8/b8/c8/R-half/R-ep 1808, d8 1807, R-full 1805). All 62 base/head counts equal the SE's mutants.base.out / mutants.rows.out.
  - A1 MET: each of the ten drops fails exactly its own A1 row, no other A1 row; all 16 row FENs parse under strict parseFen, round-trip, give the stated castles and counts.
  - A2 MET: R-half 2 rows, R-ep 2, R-full 4; controls 2 castles at 26.
  - A3 MET: 14/14 test-file discriminators red; a widened black production corridor (f7) turns the corridor quantifier red.
  - A4 MET: md5 unchanged at base and tip; -U0 zero removed lines, one src/ file (+280/-0); 58/1792 -> 58/1810 (+18); skip 0; No findings.; PERFT_DEEP=1 perft 32/32.
  - A5 MET: 15/15 controls survive at base and at head, 0 kills added.
  - Control-list check: SE's EQ01-EQ15 map 1:1 onto ABC-023 A5's prose list; QE's blind encodings are the same edits. Upstream is prose only (ABC-009 34f21e73 for 7-15, 02259098 for 1-6).
  - Gates at 290a9f86: lint 0 (113), typecheck 0, build 0, npm test 0 (58 files, 1810/1810), last-run.json success true, skip 0, test-skip-integrity No findings. merge-tree vs main exit 0. qe-hop-integrity --ticket ABC-024: covered (exit 0) at 822affb9.
  - Security threshold not fired (+280 < +525, one file); added lines read anyway: no imports, spawn, net, env, fs; loops bounded.
  - UAT-waiver reading: b84dc637...290a9f86 production-src grep empty (also per commit), so the waiver applies. Waived is not signed.
  - Gaps, none blocking:
    - QE-024-a MEDIUM, BA/PM to cut (out of scope): the right-MASK mutant ((castling & option.right) === 0 -> castling === 0) survives the default lane at base 1792/1792 and head 1810/1810; on "w kq" white is offered e1g1 e1c1. Deep lane 31/32, position-5 perft(4) only. This is the ticket's own judgement shape on a different axis.
    - QE-024-b LOW, accepted residual: the fifteen controls are prose-only upstream; two committed encodings now agree.
    - QE-024-c INFO: both A2 non-inertness controls are white (one per class, as required).
    - QE-024-d INFO: readings taken at base b84dc637; main has since gained ABC-030's three comment-only .nfr.test.ts lines; moves.ts unchanged there.
  - QE trace row NOT appended: the brief fences plans/traceability.md; the row text is in the handoff. Decision .grugops/context/qe-ABC-024/notes/…-e84b25c9.
