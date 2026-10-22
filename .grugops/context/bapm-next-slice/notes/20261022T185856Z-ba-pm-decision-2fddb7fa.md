---
id: 20261022T185856Z-ba-pm-decision-2fddb7fa
kind: decision
by: ba-pm
at: 2026-10-22T18:58:56Z
verified_by: 
confidence: high (scope line, gap G6 and the three uncut-work records agree; the EPIC-007 owed list matches the owner and Orchestrator records)
refs:
  - ABC-200
  - EPIC-006
  - EPIC-007
  - G6
  - ABC-101
  - ABC-037
  - ABC-042
  - ABC-168
  - ABC-178
  - ABC-197
  - ABC-199
  - M1
  - M2
  - M8
  - NFR-007
  - NFR-008
  - NFR-011
  - N8-LANE
  - ADR-0036
  - ADR-0045
  - RISK-EPIC007-01
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - 20261022T133720Z-orchestrator-decision-0b63d92f
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
  - 08d42d01
supersedes: 
seal: sha256:1717969e50f70fec0c31cb061290cb0f54ca2c322d89a5e4dc469d7ae24b3e63
---

# Next slice: ABC-200 cut (Ready, M, P2, EPIC-006, DoR 10/10). EPIC-007 cannot close on its measures; one owner question

## Why this slice
- The open, user-visible work inside an accepted epic's scope is small. Every ticket of EPIC-003 to EPIC-006 is Done or dropped. EPIC-007's open tickets (ABC-178, ABC-197, ABC-199) are test-only.
- The one uncut, user-visible line of scope is EPIC-006 § Scope "choose colour and difficulty, via prompt or CLI flags" (gap `G6`, MEDIUM, 2026-08-16; `ABC-101` § Out of scope; `memory-bank/60-progress.md` § Known UNCUT work item 3, "cuttable today").
- The pain: `npm run chess` always plays White at level 5, the strongest level and the default (`ADR-0045`), and nothing on screen names the flags. EPIC-006 AC4 already presumes prompts exist when flags are absent.
- Not chosen: EPIC-007 M1, M2 and M8(a) readings (blocked: neither `cutechess-cli` nor En Croissant is on the host); the EPIC-006 negotiable slice and the EPIC-003 pager (triggers not fired); the EPIC-006 AC1 and `NFR-007` fresh-clone reading (not user-visible; recommended as the next cut).

## ABC-200
- `plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md`.
- The questions are asked only when stdin and stdout are TTYs and that flag is absent. Colour comes first (`white`, `black`, `random`; Enter = white), then difficulty (`1`–`5`; Enter = 5). Both defaults are unchanged.
- A1–A9: question counts 2, 1 and 0 by flag; 0 frame bytes before the answers; one teaching line and a re-ask on a wrong answer (`purple`, `6`, `0`, `03`, a 1 025-character line); exit 0 with no frame at end of input; a pipe is byte-identical, with `src/cli.test.ts` and `src/cli.real-engine.test.ts` unedited; `black\n1\ne5\n` in one chunk loses or steals no line; a QE pty hand reading; 0 book reads before the first question.
- NFR: `NFR-007` < 2 s is read with both flags given (no questions). `NFR-008` gets +1 file, ≤ 0.05 s estimated against 0.605 s of headroom; `N8-LANE` ≤ 650 ms CPU if Security/NFR rules it owed. ASVS V5: closed set, filtered echo, 1 024 cap. `ADR-0036` (b1) fires on the `isTTY` reads, so a Security/NFR hop is owed.
- Builder: an Architect/Design ruling first, on how the questions share stdin with `ABC-037`'s reader. **If that needs a new ADR or changes an accepted one: STOP, owner** (`…5aaf7cec` item 3). Then the Software Engineer builds it; QE and Security/NFR follow. It merges after ABC-178's B7/B8 timing hop.
- Size M: one design ruling, one module, one test file, about 15 lines of wiring. A colour/difficulty split was refused, because it doubles the hops for about 10 lines. P2: user-visible, and nothing is broken.
- No requirement, scope, NFR bound or ADR moves, so no owner STOP at the cut.

## EPIC-007 close status: NOT closeable on its measures
- Met on Done tickets: M3 (`NFR-011`, 86.1 / 6.9 / 0.2 ms, `qe-ABC-168` `…1b96c204`; owner-confirmed rewording `…4ab163ef`), M4 (ABC-167, ABC-171, ABC-168), M5, M6 and M7 (ABC-171), M8(b) (ABC-170, ABC-167), M9 (ABC-168 `A7` on a fresh clone; the owner's repeat is not recorded, and UAT is now QE-signed), M10 (ABC-169), M11 (ABC-172).
- **Owed:** M1 (cutechess-cli 6 games), M8(a) (cutechess-cli 2 games at `depth=4`) and M2 (one En Croissant game). The owner accepted ABC-168 `A8`–`A10` by his word (`…0b63d92f`), and the Orchestrator recorded the missing evidence as a gap (`…5aaf7cec`). No result lines, no `-pgnout` file and no play-test exist. On this host, `which cutechess-cli` prints nothing and En Croissant is not in `/Applications` (re-checked this hop). So M1, M2 and M8(a) are accepted, but not read.
- ABC-178, ABC-197 and ABC-199 do not settle any M. They are test hygiene: ABC-178 restores a kill, ABC-197 restores a budget band, ABC-199 lightens two rows. After all three, M1, M2 and M8(a) are still owed. ABC-197 also waits on an admissible lane reading of ≤ 9.2 s (DoR 9/10).
- **Owner question.** Closing EPIC-007 with M1, M2 and M8(a) unread treats three success measures as met by acceptance. That is a requirements call, so it is the owner's. **Recommendation:** close M2 on his existing acceptance (it is a human-played game, and he signed it). Keep M1 and M8(a) open until `cutechess-cli` is on the host, then cut one XS QE reading ticket, agent-run, with no human gate. They are the only check of `RISK-EPIC007-01` (a GUI timeout during a 5 s search) before the web UI's backend meets it. If he prefers no install, "close EPIC-007 as accepted" closes it, with the gap kept on record.
