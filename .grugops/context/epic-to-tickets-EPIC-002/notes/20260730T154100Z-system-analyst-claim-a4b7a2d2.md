---
id: 20260730T154100Z-system-analyst-claim-a4b7a2d2
kind: claim
by: system-analyst
at: 2026-07-30T15:41:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - NFR-002
  - NFR-003
  - NFR-004
  - RISK-005
  - ABC-009
  - ABC-010
  - ABC-011
  - 20260730T140500Z-orchestrator-observation-c41a7e92
  - 20260730T152600Z-system-analyst-decision-cca3c342
  - 20260730T153400Z-system-analyst-observation-2fc3e3d9
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/nfr-catalog.md
  - src/legal.ts
supersedes: 
---

# Stop list — eight loop behaviours I could not resolve from the record

Workflow 03's first stop condition: *behavior ambiguous and unresolvable → stop and name the
missing decision; do not fabricate the flow.* Each item below is a decision the record does not
contain and that I decline to invent. `confidence: UNKNOWN - verify` applies to this whole note.
Items 1-3 are blockers for the epic's acceptance criteria as written; 4-6 are gaps with no
recorded answer; 7-8 are unverified performance claims that would need measurement, not a ruling.

None of these is Architect/Design's structural seam (module API, SAN's home, memoisation) — those
are being decided concurrently and are deliberately untouched here.

---

## 1. How "the terminal cannot render Unicode" is detected — BLOCKER for acceptance #2

**Epic acceptance #2:** *"Given a terminal without Unicode support (or `--ascii`), when the board
renders, then the ASCII fallback is used and no replacement glyphs (`?`/`�`) appear."*

The `--ascii` half is decidable. The automatic half is not, and I could find no detection rule in
any epic, ADR, note or the code.

**What a process can observe:** whether stdout is a TTY, whether the locale claims UTF-8, the
platform, the reported colour depth. **What it cannot observe:** whether the installed font has
glyphs for U+2654–U+265F. A terminal can be UTF-8-clean, report everything correctly, and still
draw tofu — and the process cannot see what was drawn. So the criterion as written is not
satisfiable by any in-process detection, only approximated.

Settled rule R9 restates the criterion into the byte-stream form (*in ASCII mode, no code point
above U+007F is emitted*), which is decidable and testable. **The residual is the case this
question is actually about:** Unicode mode on a terminal whose font lacks the figurines.

The options I can see, none of which I will pick:
- **(a) default ASCII on Windows, Unicode elsewhere, `--ascii` and an opt-in override on top** —
  targets the platform `RISK-005` names first, at the cost of a worse default on Windows Terminal,
  which handles the figurines well.
- **(b) default Unicode everywhere, `--ascii` as the only escape** — simplest, and it makes
  acceptance #2's automatic clause vacuous.
- **(c) ask once on first run** ("do these look like chess pieces?") and remember — the only option
  that actually observes what the terminal drew, at the cost of a prompt in a game whose selling
  point is *"one command, five seconds, and you are playing"* and a place to persist the answer,
  which `EPIC-006` rules out for game data.

**Needs:** a product ruling on the default and the signal set, plus a decision on whether
acceptance #2's automatic clause is restated (R9) or dropped. It also decides whether a
`--unicode` force-on flag exists, since under (a) a wrong auto-detection has no override today.

## 2. Fixed-region redraw vs scroll, and whether the SAN history is bounded — BLOCKER for acceptance #4

**Epic acceptance #4:** *"Given a 40-move game, when rendering after each move, then the board
redraws without leaving stale rows from the previous frame."*

"Stale rows" is a failure mode of **in-place redraw into a fixed region**; under append/scroll
rendering it cannot occur. So the criterion presupposes in-place redraw. But EPIC-002's scope also
contains *"move history display in two-column SAN"*, which **grows by one row per move pair**, and
the two requirements collide inside the same frame.

The arithmetic, with assumptions stated because no layout exists yet: board + labels ≈ 10 rows,
status panel ≈ 4, message region ≈ 2 → **≈ 16 fixed rows**. On the conventional 24-row terminal
that leaves **8** rows for history, so an unbounded history overflows the viewport at roughly
**move 9** — before the opening is over. At the acceptance criterion's own move 40 the frame is
≈ 56 rows, over twice a 24-row viewport. **Above a certain move number, "redraws without leaving
stale rows" is not merely hard, it is undefined:** the frame does not fit the region it is being
redrawn into.

Options, none chosen here:
- **(i) bound the history pane** to the last K move pairs and scroll within it — keeps the frame a
  fixed height, loses the full list mid-game (`EPIC-006`'s result screen shows the full move list
  at the end regardless).
- **(ii) put the history beside the board** in a right-hand column — naturally bounded to the
  board's ~10 rows, and it raises a **minimum terminal width** question the record also does not
  answer.
- **(iii) drop in-place redraw for append/scroll** — a fresh frame per move, scrollback keeps the
  history for free, works identically in a pipe, and acceptance #4 becomes trivially true. Costs
  the "single live board" feel.

**Needs:** a UX ruling on (i)/(ii)/(iii). It determines the frame model, which in turn determines
whether the loop skeleton and the renderer are one ticket or two — which is exactly the boundary
BA/PM is waiting on. Settled rules R10 and R11 hold under all three; they bound the *other*
sources of height variation, not this one.

## 3. Whether the engine seam yields — i.e. whether the thinking indicator can update at all

Node is single-threaded. A synchronous search occupies the event loop for its entire budget (up to
3 s default, 5 s ceiling under `NFR-004`), during which nothing animates and nothing is read.

An **updating** indicator therefore requires EPIC-004 to yield at least once per iterative-deepening
iteration, or to run in a worker. A **static** indicator (printed on entering `engine-thinking`,
cleared on leaving) satisfies the epic's scope line literally and needs nothing from EPIC-004.

This is a constraint that has to be stated **before** EPIC-004 is designed, not discovered after —
retrofitting a yield point into a finished search, or moving it to a worker, is not a small change.
EPIC-004 is undecomposed, so there is no counterpart to agree it with today.

**Needs:** a ruling on static vs updating, and if updating, a recorded contract clause on EPIC-004
before that epic is decomposed. What EPIC-002 can build and verify either way is in settled rule
R10 and the status-panel note.

## 4. Colour/shading is conflated with glyph mode, and neither `NO_COLOR` nor pipes are addressed

The epic's scope has *"light/dark square shading"* and `RISK-005` names *"Unicode chess glyphs
**and colour**"* together, but `--ascii` is defined only against glyphs. Unanswered by the record:

- Does `--ascii` also disable colour, or is there a separate switch?
- Is the de-facto `NO_COLOR` convention honoured?
- Shading by ANSI background colour vanishes in a pipe or a plain-text snapshot; shading by
  character (e.g. a filler on dark squares) survives both. `EPIC-006`'s end-to-end test drives the
  real stdout as a **pipe**, so this decides what that test can even assert.

Glyph mode and colour mode are two independent capability decisions, and the record has one flag.

## 5. Terminal resize (SIGWINCH) is not in any epic's scope

A resize mid-game corrupts an in-place frame and can invalidate the width assumption under option
2(ii). No epic mentions it. The obvious behaviour — redraw on resize when attached to a TTY — is
not recorded anywhere, and under option 2(iii) it is a non-issue. Named, not decided.

## 6. Stdin EOF / non-interactive input has no recorded behaviour

`EPIC-006`'s test notes require *"an end-to-end test that drives a scripted game from `npx`
invocation to a checkmate result screen through the real stdin/stdout interface"* — i.e. stdin is
a **pipe that ends**. The loop reaches transition T11 with no line to read, and no epic says what
happens. The reasonable behaviour is "treat as `quit` and exit cleanly", which would also satisfy
`EPIC-006`'s *"exits cleanly with code 0"* — but the alternative (a scripted game whose input runs
out before mate should arguably be an error, not a clean exit) is equally defensible and the
choice is not mine. Un-decided, this is the shape of bug that manifests as a test that hangs in CI.

## 7. `NFR-002`'s 16 ms budget — only the compute half can be reasoned about

The compute half is ~0.3% of the budget on an M3 (transcribed figures and their derivation are in
the status-panel note; `plans/nfr-catalog.md` and `ADR-0002`, Apple M3 / Node v24.12.0 /
darwin-arm64). The write-and-paint half — syscall plus the terminal's own escape parsing and paint,
across the terminals `RISK-005` names — is **`UNKNOWN - verify`, and it is the whole risk.** The
catalog's NFR-002 row already says so. Nothing here changes it, and no render latency number should
be quoted from this analysis: nothing is built and I measured nothing.

## 8. `NFR-003`'s 50 ms keystroke echo may be violated during the engine's turn — chain unverified

The chain, stated so it can be checked rather than believed:

1. EPIC-003's scope includes **tab-completion of legal moves at the prompt**.
2. Tab-completion is not achievable with the terminal in canonical (cooked) line mode, so the
   prompt must put stdin in **raw mode**. *(Strong implication, but not a recorded decision — this
   is the weakest link and the reason this is a claim.)*
3. In raw mode the **process**, not the terminal, echoes each keystroke.
4. A synchronous engine search blocks the event loop for up to 3 s (`NFR-004`).
5. Therefore any keystroke typed during the engine's turn is echoed up to 3 s late — a **60x**
   breach of `NFR-003`'s 50 ms echo budget.

In canonical mode step 3 does not hold, the terminal echoes locally, and the breach disappears.
So this depends entirely on step 2. It shares its resolution with item 3 (a yielding or worker
engine removes it), and it is a genuine cross-epic interaction that neither EPIC-002's nor
EPIC-003's nor EPIC-004's happy path shows. **Verify by:** confirming EPIC-003's terminal mode when
that epic is decomposed, then measuring echo latency during an engine turn once both exist.

---

## Also carried forward, already-cut and not re-scoped here

- **`ABC-009`** (`legalMoves` mutates a semantically-invalid position) — the loop calls it once per
  frame through `gameStatus`. Safe while every position comes from legal play out of a validated
  start; `ABC-009`'s own escalation trigger fires when *"any epic begins accepting a position from
  outside the rules core before ABC-010 lands"*, and this loop is the runtime that will be
  executing when EPIC-003's FEN entry ships. Sequencing input for BA/PM, not a new defect.
- **`ABC-011`** (en-passant hashing) — every threefold verdict this loop renders inherits it.
  Under-detects only; a legitimate draw is missed, a false draw is never declared.
