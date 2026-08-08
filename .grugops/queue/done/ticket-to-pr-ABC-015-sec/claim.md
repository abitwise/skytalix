---
task: ticket-to-pr-ABC-015
subtask: security-nfr-abc015-gate
role: security-nfr
claimed_at: 2026-08-08T19:45:00Z
claimed_by: security-nfr
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has **no `scripts/` directory at all** (`ls scripts` → `No such file
or directory`), so Workflow 17 step 2's atomic `claimTask` could not be executed and step 3's
`transition` rename was done with `mv`. The claim directory was created with a plain `mkdir` — still
atomic, still `EEXIST` on a second writer — and this registry record written into it. Queue width is
1 and no contention was possible, so the claim is degenerate. Recorded rather than glossed, exactly
as the queued subtask instructed and as every prior subtask on this board recorded.

DEPENDENCY CHECKED AT THE SOURCE, not taken from the activating prompt:
`.grugops/queue/done/ticket-to-pr-ABC-015-qe/` and `.grugops/queue/done/ticket-to-pr-ABC-015-spec/`
both exist and carry their own `claim.md`. The chain into this gate is satisfied.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-015/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

## Read before acting

All twenty-two prior notes in `.grugops/context/ticket-to-pr-ABC-015/notes/` read AT SOURCE and in
`at` order before any gating judgement was formed. Then `plans/tickets/ABC-015-glyph-mode-selection.md`
in full (both `CORRECTED IN PLACE` blocks, all fifteen criteria), `plans/nfr-catalog.md`,
`plans/board.md`, `plans/traceability.md`, `AGENTS.md`, `.grugops/factory.config.json`,
`agent-factory/checklists/security-nfr-checklist.md` filtered to `security.asvs_level: L1`, and the
shipped `src/glyph-mode.ts`, `src/glyph-mode.test.ts` and `src/glyph-mode.nfr.test.ts` line by line.
`ABC-014`'s gate notes were read as PRECEDENT — this module is the owner of the value that gate
carried forward as accepted risk 3 and as V2.2.1's counterfactual.

**Nothing measured by an earlier role is inherited.** `NFR-007`'s zero-filesystem / zero-process bar
is re-derived on this gate's own instruments — deliberately NOT by citing the delivered guard, which
QE already found blind to `node:fs/promises` — and the ticket's "no security trigger" claim is
RE-DERIVED against what was actually built rather than accepted from the ticket's wording.

---
completed_at: 2026-08-08T20:25:00Z
outcome: PASS_WITH_RISKS (board verdict PASS) - ABC-015 moved In Security/NFR -> Ready for UAT.
  In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; no limit approached, no override taken.
  Gated against `security.asvs_level: L1` and `security.block_on: high`. NO required fix
  outstanding. FOUR accepted risks, each with a severity, a NAMED OWNER and a PLACE.
  `compliance_regime` is [], so NO Compliance Officer hand-off is owed - recorded rather than
  silently omitted.

  NFR-007's ZERO-FILESYSTEM / ZERO-PROCESS BAR WAS RE-DERIVED ON THIS GATE'S OWN INSTRUMENTS AND IS
  MET. THE DELIVERED GUARD WAS NEVER CITED: QE had already found src/glyph-mode.nfr.test.ts blind to
  node:fs/promises - a specifier it did not name - and a guard that fails by omission is not
  evidence. Three instruments, the first SPECIFIER-AGNOSTIC BY DESIGN:
    1. Node's PERMISSION MODEL (--permission --allow-fs-read=<dir>), denying at the binding level
       BELOW every module mock. Proved ARMED before any negative result was trusted, by four
       positive controls: readFileSync, fs/promises.readFile, execSync and
       existsSync("/etc/locale.conf") - the exact mutant QE built - all ERR_ACCESS_DENIED.
    2. A cmp-verified BYTE-IDENTICAL COPY of the module ALONE in an empty directory with NO
       render.ts beside it. It imports and runs, which PROVES the `import type` line is erased and
       the RUNTIME IMPORT CLOSURE IS EMPTY - stronger than reading the source.
    3. 165 FUNCTIONS PATCHED across fs, fs/promises, child_process, os and tty, plus a
       node:module registerHooks module-load recorder.
  Across three ambient shapes (isTTY absent / true / false): 0 MODULES LOADED, 0 FILESYSTEM CALLS,
  0 PROCESS CALLS, 0 BYTES WRITTEN, 0 wrong answers over 11 selection paths and both entry points.

  ONE INSTRUMENT-LIMIT CORRECTION, RECORDED BECAUSE IT WOULD HAVE PRODUCED A FALSE MISS: the first
  run counted THREE fs calls in the region (openSync/readSync/closeSync) and they were the ESM
  loader reading the module off disk - the LOAD, not the SELECTION. Hoisted out with the counters
  reset at the boundary, the count is 0. Eighth of this shape on this project's record; the seventh
  produced a 2.08x false miss on ABC-012.

  WHAT THE ONE PERMITTED READ ACTUALLY DOES, measured so the bar is not over-claimed: process.stdout
  is a LAZY getter and the first touch constructs the stream for fd 1 - Socket on a pipe,
  SyncWriteStream on a file and /dev/null, WriteStream on a terminal - and performs no
  permission-checked filesystem operation and no child process in any shape.

  THE TTY PATH WAS EXERCISED AGAINST A REAL TERMINAL FOR THE FIRST TIME ON THIS TICKET (a python3
  pty, under the permission model): LANG=en_US.UTF-8 -> unicode, LANG=C -> ascii, isTTY genuinely
  true and genuinely a boolean. Every earlier test faked it with defineProperty. ONE machine's
  terminal; Windows conhost, Windows Terminal, iTerm2 and tmux stay UNKNOWN - verify (RISK-005).

  THE ENVIRONMENT IS TOUCHED NARROWLY, measured with a recording Proxy on process.env: AT MOST 3
  KEYS and only LC_ALL / LC_CTYPE / LANG, stopping at the first SET rung; ZERO ENUMERATIONS; ZERO
  env reads at all on a non-TTY sink (row 3 short-circuits, so on the pipe EPIC-006's end-to-end
  test uses this module reads no environment variable); ZERO further ambient reads across 8 accessor
  calls after the session began; 0 bytes to stdout and 0 to stderr.

  THE TICKET'S "NO SECURITY TRIGGER" REASON IS WRONG THREE TIMES IN ONE SENTENCE AND THE RULING
  STILL HOLDS - reported rather than ratified, as ABC-014's gate did with the same class of claim.
  "reads TWO environment variables" -> it reads THREE (the FOURTH wrong count on this ticket, and
  the first inside the section this gate audits). "and A BOOLEAN" -> process.stdout.isTTY is
  UNDEFINED on a pipe, a file and /dev/null; a boolean only on a real terminal, which is exactly why
  Boolean() is in the code. "interprets NO USER TEXT" -> it interprets three user-influenceable env
  values against a regex, and src/glyph-mode.ts is the FIRST module in src/ to read process.env at
  all. "it writes nothing" is the one clause that survives.
  WHAT ACTUALLY HOLDS IS STRONGER: THE RETURN DOMAIN IS CLOSED - every path returns one of two
  MODULE literals and the env values are match SUBJECTS that are never returned, emitted or embedded
  in a message. Measured over 138 HOSTILE LOCALE VALUES x 3 rungs x 2 TTY states (ANSI ESC and OSC
  payloads, C0 controls, NUL, CRLF injection, shell metacharacters, command substitution, format
  strings, path traversal, SQL, script tag, __proto__ JSON, 10k- and 1M-character values, Unicode
  confusables, RTL override): 0 THREW, DOMAIN EXACTLY {ascii, unicode}. Also: /utf-?8/i has no `g`
  flag so it carries no lastIndex, and a 5 MB value scans in 1.55 ms - linear, no ReDoS.

  ONE REAL PROPERTY FOUND AND IT IS A GADGET, NOT A VULNERABILITY - the environment sibling of the
  GLYPHS[mode] gadget ABC-014's gate found. signals.env[name] is an unguarded prototype lookup AND
  THE REAL process.env FALLS THROUGH TO Object.prototype. Measured with a LIVE NULL CONTROL IN BOTH
  DIRECTIONS (this module's default is unicode, so a "polluted with UTF-8" hit would prove nothing):
  unpolluted -> unicode; Object.prototype.LC_ALL="C" -> ASCII, OUTRANKING a real UTF-8 LANG;
  pollution deleted -> unicode again. Under pollution the rung need not be a string, so UTF8.test's
  ToString RUNS ATTACKER CODE (measured, 1 invocation through the real process.env) and a throwing
  toString escapes beginGlyphModeSession uncaught. FOUR BOUNDS, each verified: a real environment
  can never hold a non-string (Node coerces on assignment); NO prototype-pollution sink exists
  anywhere in src/; the reachable return domain UNDER pollution is STILL {ascii, unicode} - it flips
  a glyph table, it cannot inject a byte; and an own `false` flag shadows a polluted
  Object.prototype.ascii. LOW, does not block.

  ASVS L1 JUDGED NOT PADDED: 70 active requirements counted at the source (V16 and V17 carry NO L1
  requirement at all - checked, not assumed). TWELVE judged individually - V1.2.5 (OS command
  injection) PASS on evidence via zero process operations with a positive control, the requirement
  that would have been engaged had the module shelled out to `locale`; V1.3.2 PASS (zero modules
  loaded, stronger than a grep); V2.1.1 PASS; V2.2.1 PASS ON THE ENVIRONMENT INPUT and NOT ENGAGED
  on the flags; V15.3.1 PASS on evidence; V1.2.1-1.2.4 PASS BY ANALOGUE; V13.4.1 DEFERRED not
  passed; V15.1.1/V15.2.1 NOT MET with a CARRIED high -> low override restated and its evidence
  re-checked (zero runtime dependencies, package.json untouched), owner Architect/Design at
  EPIC-006 - and 58 STRUCTURALLY N/A with the reason per chapter. V7 SESSION MANAGEMENT IS N/A AND
  IS NAMED RATHER THAN SKIPPED BECAUSE THE KEYWORD MATCHES: ASVS "session" means an authentication
  session and a token; this module's session is a process-lifetime constant. NO DEFAULT SEVERITY WAS
  OVERRIDDEN BY THIS GATE in either direction.

  ABC-014's BANKED V2.2.1 COUNTERFACTUAL IS HALF DISCHARGED AND HALF LIVE. DISCHARGED - the `mode`
  half, BY CONSTRUCTION: beginGlyphModeSession returns a value from a closed two-literal domain, so
  no user string can reach renderBoard's `mode`, PROVIDED EPIC-006 passes THIS MODULE'S OUTPUT and
  not a raw flag string (the condition is stated, not assumed). STILL LIVE - the flags half is
  EPIC-006's: GlyphFlags are BOOLEANS, argv gives STRINGS, and a non-empty "false" is truthy, so a
  naive --ascii=false selects ASCII silently.

  A PRIOR GATE'S ACCEPTED RISK NAMES AN OWNER THAT DOES NOT OWN IT, AND IS CORRECTED. ABC-014's
  accepted risk 3 (a non-white-bottom orientation silently renders black-bottom) named
  "ABC-015 / EPIC-006 (they own the value)". ABC-015 HAS NOW SHIPPED AND PRODUCES NO ORIENTATION
  VALUE AT ALL - checked at the source: no EPIC-002 ticket but ABC-014 mentions orientation, and
  EPIC-002's own ## Dependencies puts the human's colour, "which fixes board orientation", in
  EPIC-006's startup scope. RULED: sole owner EPIC-006; the ABC-015 half is struck. Mechanism: that
  gate correctly found renderBoard's two string parameters are both ERASED unions, then assigned
  BOTH VALUES' OWNERSHIP to the same pair. Corrected in a NEW NOTE rather than by `supersedes`,
  because that note's other three risks are correct and `supersedes` overrides a WHOLE note.

  THE FOUR ACCEPTED RISKS, NONE UNOWNED: (1) the environment prototype-chain gadget - LOW -
  Architect/Design @ ABC-018/EPIC-006. (2) An uncaught exception can escape the session's ambient
  read with no log and no context, failing CLOSED rather than fail-safe - no board at all is NEITHER
  of RISK-005's directions - LOW - EPIC-006 (startup) @ EPIC-006/ABC-018; no fix asked for, since
  guarding a read that can only fail under a polluted prototype is the impossible-scenario handling
  AGENTS.md rule 8 forbids. (3) The WHOLE environment crosses the call boundary when three named
  keys are all that is read - not a leak today, a BLAST-RADIUS statement; NARROWING THE PARAMETER
  NOW WAS CONSIDERED AND REJECTED AS GOLD-PLATING - LOW - Software Engineer @ EPIC-006. (4) Every
  figure is one machine and one Node version, and the real-terminal reading is one pty on it - LOW -
  Security/NFR @ EPIC-004's non-M3 spike; RISK-005 for the terminals.

  A DIAGNOSTIC, EXPLICITLY NOT A BAR, AND NO BAR WAS INVENTED (the ticket names no us bar and says
  why): selectGlyphMode 14.1/14.3 ns first rung and 28.3/30.3 ns all three rungs;
  beginGlyphModeSession 436.6/442.7 ns - 11 rounds x 200,000 iterations, discarded warm-up, medians
  of per-round means, TWO independent samples, on Apple M3 (Mac15,13) / Node v24.12.0 /
  Darwin 25.5.0 arm64 and UNKNOWN - verify on any other hardware. ~0.00002% of NFR-007's 2 s window.
  ATTRIBUTION IS PARTIAL AND LABELLED PARTIAL: two ambient reads 155.9/158.4 ns in isolation, the
  closure 2.9/3.2 ns, which does NOT sum to 433-445 ns, and the residual is NOT attributed.
  NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE.

  ONE INSTRUMENT COULD NOT ANSWER ITS QUESTION AND NO NUMBER IS TAKEN FROM IT: whether the session
  closure retains an injected env object. The WeakRef + --expose-gc probe said "reachable" AND SO
  DID THE NULL CONTROL WITH NO SESSION CREATED, so it is UNKNOWN - verify. Moot in production:
  process.env outlives every session.

  GATES RE-RUN ON THE TIP 8de5624 RATHER THAN INHERITED: npm test 277/277 on 13 files, skip count 0
  by the AGENTS.md command, lint exit 0 (2 pre-existing biome.json infos), typecheck exit 0, build
  exit 0 - PLUS three further full-suite runs with --sequence.shuffle, 277/277 each, this gate's own
  flakiness check. Per-file arithmetic re-derived: 253 on 11 files on main + 24 = 277 on 13.
  NO PRODUCTION CODE AND NO TEST WAS CHANGED - git diff --stat -- src/ is EMPTY and src/glyph-mode.ts
  still hashes 9c1f4f4e957d4faf3c9cccc49a545185. NO --coverage RUN WAS MADE, so the tracked
  coverage/ hazard never arose; the 100% figure is QE's and is not restated as this gate's.

  plans/nfr-catalog.md: NFR-007's row gains measured evidence for ONE COMPONENT of its window.
  EXACTLY 2 LINES CHANGED (the header and that row) of 546; NFR-001..NFR-006 BYTE-IDENTICAL and
  NFR-007's TARGET cell and Applies-to cell BYTE-IDENTICAL - NO TARGET MOVED, verified by hashing
  the cells before and after. THE ROW IS STILL UNKNOWN - verify: a zero-I/O component inside a
  window is not the window, and the npx measurement remains EPIC-006's. The two-documents-disagree
  item on that row (EPIC-006 says npx in four places, ADR-0007 clause 5 says undecided) is untouched
  and still open - owners BA/PM and Architect/Design.
  plans/traceability.md: exactly one row (ABC-015), three cells - NFRs, UAT, Status. Every row's
  cell count machine-verified at TEN before and after.

  UAT RECORDED AS DEFERRED TO EPIC-006, EXPLICITLY NOT PASSED - zero runtime importers (verified),
  no CLI entry point, nothing rendered and nothing prompted, so there is no surface a human can
  exercise and a UAT pass would be a fabrication. THE REAL-PTY RUN IS AN INSTRUMENT READING AND IS
  NOT OFFERED AS UAT. Ruled on this ticket's own evidence rather than inherited as precedent.
  CARRIED FORWARD UNCHANGED: NFR-007's npx target; the EPIC-006/ADR-0007 disagreement; the two ASVS
  deferrals; coverage/ tracked and stale (flagged, not deleted - rule 12); plans/metrics.md; the
  snapshot net and ABC-012's stale frontmatter, both already owned; ABC-009, ABC-010 and ABC-022.
  The Boolean() comment was NOT edited and NOT re-adjudicated - this gate's measurement SUPPORTS the
  Orchestrator's "overclaiming, not lying" reading. NO acceptance criterion was amended or
  re-opened. NO PR - this repo has no git remote and none was invented. THE MERGE-ORDER CONSTRAINT
  STILL BINDS: with or before ABC-018. NOTHING MERGED, NOTHING DEPLOYED - a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-015-sec/ -> done/ticket-to-pr-ABC-015-sec/ - ALL BY HAND
  (no scripts/claim.js in this install; the claim dir was created with a plain mkdir, still atomic
  and still EEXIST on a second writer; the two transitions were `mv`, the rename Workflow 17 step 3
  and step 5 specify).
