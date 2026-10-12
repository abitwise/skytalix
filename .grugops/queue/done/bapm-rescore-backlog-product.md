---
subtask: bapm-rescore-backlog-product
role: ba-pm
status: done
branch: grugops/bapm-rescore-backlog-product
tip: d8265aff
base: 1eb2edbc
notes: .grugops/context/bapm-rescore-backlog-product/notes/ (…4f1a9c27 observation, …8b3e60d1 decision); probe/ (mutant runner, witnesses, book/frame probes, mutants.out.tsv)
---
- ABC-095 DoR 8 -> 10, S P1, recommend Ready. ABC-093 ac83c3fd / ABC-094 02dfa044 merged; cli.ts:176, engine.ts:518, turn-loop.ts:150 re-read; start position and the position after 1. e4 are in book; QE-094-a stderr half already on the page; owner Q5 answered KEEP; A5 game half made concrete.
- ABC-101 DoR 7 -> 10, M, P2 -> P1 (trigger fired: ABC-087 b696d8e8 LEVELS 1-5, DEFAULT 3), recommend Ready. No EngineSeam change needed; scope now wires the level (A8', A10); startup line struck (CURSOR_HOME overwrites it on a TTY, frame.ts:236-240). Front matter not edited.
- ABC-024 DoR 9 -> 10, S P2, recommend Ready. moves.ts md5 6335b452 unchanged; scratch-copy mutants at 1775/57: g8, b8, c8, R-half and R-ep survive; d8 and R-full die only on one incidental row each; PERFT_DEEP 32/32; A1, A2, A4 and A5 re-based.
- ABC-146 DoR 9 -> 8, XS P1, stays Backlog. ADR-0038 addendum ACCEPTED and ABC-083 f00038ef merged (both waits cleared), but ABC-152 (runner off) likely removed the 4.35x factor. Owner route question (a) vitest LADDER_DEEP=verdict with no code, after a paired factor re-read, or (b) as accepted. A1 base and A5 180 games amended.
- ABC-096 DoR -> 9, S P3, stays Backlog. Format carries n (2,853 of 5,390); probe drops it; frame W 21 -> family-name cut; A7 and A8 added. Architect question on where the lookup runs.
- Gates on the branch tip: lint 0, typecheck 0, build 0, vitest 57 files 1775/1775, 0 pending/todo. qe-hop --sweep exit 1, byte-identical to main (pre-existing). No timing reading.
