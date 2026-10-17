---
done_at: 2026-10-17T18:34:30Z
branch: grugops/ABC-157-castling-one-right (worktree ../wt-ABC-157; base aa37f9cb; code 968a5843)
tip: 003f0bbd (QE notes + probe + ticket § QE; reviewed tip 2202b8eb; no code, no other file)
result: PASS_WITH_GAPS. QE planted X-any-right from the ticket text on its own runner (qe-ABC-157/probe/qe-mask-mutants.mjs) before opening the SE's harness.
  - Mutants: git-archive trees of base aa37f9cb and head 2202b8eb in session scratch, outside the repo; whole default lane; every *_DEEP unset; anchors exactly once; md5 6335b452... restored after every state.
  - X-any-right: base SURVIVES 1824/1824; head KILLED, 6 failed = exactly the six ABC-157 rows (A1 x4, A2 x2).
  - Committed catalogue (SE harness = ABC-024 harness + X-any-right, +3/-0) re-run on fresh trees, 32 states per tree, 0 broken builds, 0 harness errors: byte-identical to the SE's mutants.base.out / mutants.head.out. The 7 named ABC-024 mutants are killed at base and head with identical lists; EQ01-EQ15 survive 15/15 at both, 0 kills added. The six rows add kills only to X-any-right and CTL:right-removed (+6 each).
  - Weaker variants: own-colour-any-wing (head 4), same-wing-either-colour (2), kingside-or-queenside-only wrong colour (2 each), white-only or black-only any-right (3 each) all survive base and die at head. Colour-swap and wing-swap, plus 6 table-entry swaps, are already killed at base. Side-to-move-only = the delivered code (black = position.blackToMove), equivalent, not planted.
  - W-mixed (the other own-wing right is accepted when the opponent also holds a right) SURVIVES base 1824/1824, head 1830/1830 AND PERFT_DEEP 32/32. Witness: w Qk gives e1g1 e1c1 at 26 vs delivered e1c1 at 25.
  - A1/A2/A3/A4 MET. One src/ file, -U0 0 removed, md5 equal at base/code/tip, 58/1824 -> 58/1830 (+6), skip 0, No findings., deep perft 32/32.
  - Gates at 2202b8eb: lint 0, typecheck 0, build 0, npm test 0 (58 files, 1830/1830, success true, pending 0, todo 0), integrity No findings. merge-tree vs main 3fe9bc9e exit 0. qe-hop-integrity --ticket ABC-157: covered (exit 0) at 003f0bbd.
  - UAT-waiver reading: aa37f9cb...2202b8eb production-src grep empty (also per commit, and at 003f0bbd), so the waiver applies. Waived is not signed.
  - Gaps, none blocking: QE-157-a LOW (W-mixed passes every lane; a mixed-rights row such as w Qk -> e1c1 25 would close it; outside the one-right class; BA/PM to cut, or the owner accepts it as a residual). QE-157-b INFO (several weaker variants die on only one row per colour).
  - QE trace row NOT appended: the brief fences plans/traceability.md; the row text is in the handoff. Decision .grugops/context/qe-ABC-157/notes/…-5e19b0c3.
