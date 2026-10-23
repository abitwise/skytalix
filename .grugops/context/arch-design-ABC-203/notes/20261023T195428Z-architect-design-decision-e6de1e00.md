---
id: 20261023T195428Z-architect-design-decision-e6de1e00
kind: decision
by: architect-design
at: 2026-10-23T19:54:28Z
verified_by: 
confidence: high (design ruling; ADR-0047 accepted under the 2026-08-03 standing directive; owner may veto)
refs:
  - arch-design-ABC-203
  - ABC-203
  - EPIC-006
  - ADR-0047
  - ADR-0036
  - ADR-0002
  - ADR-0011
  - ADR-0007
  - ADR-0018
  - ADR-0029
  - NFR-008
  - NFR-007
  - NFR-002
  - 06fabb18
  - 4a788b92
  - 20261023T195412Z-architect-design-observation-26a21f7c
  - bapm-cut-pgn-export/…0c2867c1
  - owner-word-2026-10-23/…715b9cbf
supersedes: 
seal: sha256:3626974b149c9d939a3ca0606f5ce7fe07d0926b74150531638f0f11c979d5c6
---

# ABC-203 design ruling: pure formatter + one fs holder + wiring; neutral test cwd; one clock read; ADR-0047. STOP did not fire

Full text: the ticket page § Design ruling and ADR-0047 at 4a788b92.

1. **Module shape.** src/pgn.ts pure (pgnStamp(Date) -> {stem,date} from local getters; formatPgn(outcome, history, {startedAt, difficulty, humanColour}); own replay; history.ts and turn-loop.ts import type only). result-screen.ts exports its existing headline function; renderResultScreen rows unchanged. src/pgn-file.ts is the only writer: one node:fs import, one export writePgnFile(startedAt: Date, text), no process., no output; name derived inside from the Date, so only a Date reaches the path; mkdir recursive games, open wx with -2..-99, write to fd, close, unlink own path on failure; returns {ok,path}|{ok:false,code}, code only if ^E[A-Z0-9]+$, else rethrow (-> exit 70). cli.ts gates on reason !== null after the screen and writes PGN saved:/PGN not saved:.
2. **Tree clean.** Seam = child cwd (no argv/env). cli.test.ts childOf runs every direct entry-point child from a module-scope mkdtemp dir, removed by exact path; npmRun keeps REPOSITORY (EOF, no file). Guard rows: no REPOSITORY-cwd child prints a PGN line; neutral games/ count = PGN saved count. N8-SPAWN unchanged. Holder tests: one spawned child in the new file (threads pool forbids chdir). A14 clarified: cli.ts source rows counting what ABC-203 adds may move (process census 10 -> 11) with a dated reason; any other red is a STOP back to Architect.
3. **Clock.** const startedAt = new Date() once in cli.ts, directly before runTurnLoop(. Tests use the local-time Date constructor; no TZ. A12 is a source-order row. After new, the stamp stays the session start (accepted).
4. **ADR-0047 written, accepted, reverses nothing** (ADR-0007, -0018, -0011 cl.4, -0002 cl.4, -0029, -0016, -0021 unmoved; ADR-0036 fires as designed). STOP not fired.

**Security/NFR must check:** (b1) limb 1 on pgn-file.ts, (b2) cli.ts -> pgn-file.ts, limb 2 on cli.ts new process.stderr; § Decision 3 re-armed twice (sixth holder; caller value reaching a capability) - input: no call-graph reach; games symlink to a dir is followed - input: accept LOW; ASVS V12 path/exclusive-create/errno-only; NFR-008 +1 file +1 spawn (page estimated 0), N8-LANE call.

**Next move:** In Design -> Ready for Dev, then In Development with the SE; QE (A1-A13, P1-P7); Security/NFR. nfr-catalog not edited (fence).
