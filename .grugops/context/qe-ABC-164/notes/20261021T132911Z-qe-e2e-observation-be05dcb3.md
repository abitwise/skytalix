---
id: 20261021T132911Z-qe-e2e-observation-be05dcb3
kind: observation
by: qe-e2e
at: 2026-10-21T13:29:11Z
verified_by: 
confidence: high on bytes (wc -c and per-section byte counts at head); medium on 'needs': QE's reading of what each role's start path uses, not a run of those sessions
refs:
  - ABC-164
  - plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md
  - AGENTS.md
  - grugops/ABC-164
  - grugops/qe-ABC-164
  - 49dc490c
  - e82a3798
  - 3971302c
  - memory-bank/45-standing-rulings.md
  - memory-bank/90-agents-md-command-log.md
  - memory-bank/40-contributing.md
  - QE-164-e
  - 20261021T130200Z-orchestrator-decision-18e4ada0
supersedes: 
seal: sha256:1b58c4bdd5042a60bd271164b044d835e119dcc39eb6db251e544fcbb369b713
---

# ABC-164 against the owner's goal: every role session's start path, read fresh. Nothing is unreachable; three roles need a second document on some hops

The owner's yardstick (`…c6bf41be`, quoted on the page): AGENTS.md keeps what every role session needs, and nothing becomes unreachable. Every role's start read is now 24,575 -> **15,606 B** (-8,969). Sizes at head: `45` 8,683 B; `90` 73,231 B; in `90`, § On-demand commands 2,929 B, § Puzzle-suite strength gate 5,080 B, § Vitest worker cap 690 B; `40-contributing.md` 2,202 B.

- **Software Engineer: needs none on start (page test note 4 holds on start).** Commands, the heap flag, the worker cap, the 12 rules and the safety rules all stay. **Behind a pointer, needed on a trigger:** each lane's "Run after any src/<file> change" moved to `90`. Before changing `src/search.ts`, `src/engine.ts`, `src/levels.ts`, `src/line-input.ts`, `src/virtual-clock.ts` or `src/cli.ts`, the SE reads `90` § On-demand commands (2,929 B) to learn which lane to run. The same goes for the input-seam `heapUsed` trap (`90` § Input-seam deep lane) and the coverage process-boundary trap. AGENTS.md:66 names "each lane's trigger and trap".
- **QE: needs `90` § On-demand commands on every hop** (15,606 + 2,929 = 18,535 B). The "Run at QE" lanes (Search, Real-engine CLI) and the puzzle TRIGGER are no longer in AGENTS.md. The puzzle lane's verdict rule ("red = QE FAIL"), its baseline-move rule and the `PUZZLE_DEEP=weakened` reading are **two hops** away: the table's column 2 copies only the TRIGGER sentence, and its column 3 points to § Puzzle-suite strength gate (5,080 B). "Unset: NOT DEFINED, not skipped" (the skip-count reading) and the coverage trap are in `90` too. QE's own ruling (a qe-e2e hop before `In Review` exit) stays in AGENTS.md.
- **Orchestrator: needs `45` on most hops** (15,606 + 8,683 = 24,289 B). It merges, runs UAT and certifies, which are the pointer's own "Read it when …" list. Behind the pointer: the criteria-review procedure (re-read criteria against the built tree before `In Development`, and its controls); the waiver's "`Ready for UAT` → `Done`, no UAT run"; "an agent-run UAT is … a `decision`/`observation`, never a stamp"; the two misreadings; the config trap (`autonomy: "pr"`, no git remote); QE's forward-only rule; the authority sources in `60-progress.md`. The QE-hop exit codes (0/1/2) are in `40`.
- **Security/NFR: needs none on start.** Safety rules are kept whole, with `RISK-ABC143-01` and the deploy sentence. Behind a pointer: `45` § Deployment posture (1,975 B) when deploy is touched; `RISK-ABC152-NEGWORKERS` (a negative `VITEST_MAX_WORKERS` gives `npm test` exit 0 having run nothing) in `90` § Vitest worker cap. AGENTS.md's "env may only lower it: 1..2" still bounds it.
- **BA/PM: needs `45` § Process rules (1,223 B) when writing a ticket.** The rule sentence stays. What stays in a ticket (criteria, scope, risks) and what goes to notes, and the <= 300-line control, are behind the pointer.

**Ruling.** The goal holds. What moved serves one role or one trigger, and every moved block is one pointer away (A3). The lane table and its headings are the page's own index design. The cost falls on QE (one extra 2.9 KB read per hop, two hops for the puzzle verdict rule) and on the Orchestrator (`45` most hops). The SE pays only on a lane trigger. Recorded as QE-164-e (INFO).
