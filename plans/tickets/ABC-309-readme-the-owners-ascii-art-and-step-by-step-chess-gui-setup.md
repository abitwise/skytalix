---
id: ABC-309
title: "README: the owner's ASCII art and step-by-step chess GUI setup"
status: backlog
column: Backlog
size: S
priority: P2
epic: "— (the owner's ruling orch-2026-10-30a …a9c03e07 item 3; the README's first ticket, ABC-216, sat in EPIC-006, done; EPIC-011 closes after R2)"
feature: —
---

# ABC-309: README, the owner's ASCII art and step-by-step chess GUI setup

> **2026-11-09, by BA/PM: R2's figure is in; Q1 and Q2 answered; DoR 9/10, Backlog, waiting on one input, the art** (task `bapm-close-1109b`,
> records only, at `main` `638ac8a5`; nothing run). Sources: QE `qe-ABC-295` verdict `…e11c410e`; the owner's answer 5 (`orch-2026-10-30a`
> `…810191ff`); the Orchestrator's brief `bapm-close-1109b`; `src/uci-session.ts` and `src/levels.ts` at `638ac8a5`.
> - **R2's figure is in:** **X = 1 902.5 ± 49.1** on R2's scale (`ABC-295` Done, `…e11c410e`). The scale is Stockfish 19 at
>   `UCI_LimitStrength` with `UCI_Elo` 1 810, both sides at 100 ms a move, 200 games, 126.0 / 200 (63.0 %), Elo +92.5 ± 49.1 against E.
>   **The README must say what that scale is** (A4, as re-stated below). The first input of row 10 is met.
> - **Q1 answered: the FIGlet credit line in § Licence is dropped.** The owner's art does not use FIGlet's standard font (answer 5). Scope 5, A8.
> - **Q2 answered by the Orchestrator's brief: the README documents all three UCI options**, `Skill Level`, `OwnBook` and `TimeMode`, each
>   with its range and default as `src/uci-session.ts`'s `uci` reply gives them. The old default (steps for two, `TimeMode` named once) is
>   replaced. Scope 2.3 and 3, A3, A5.
> - **The one input left: `assets/readme-art.txt` non-empty.** It is untracked on `main` and the owner is writing it; it was 0 bytes at this
>   hop. This hop does not create or commit it. How the file reaches the build branch (the owner commits it to `main`, or another route) is
>   the Orchestrator's to settle with the owner (`UNKNOWN - verify`); A1 and A2 read it as present at the base.
> - Docs only. The board move is the Orchestrator's.

> **Cut 2026-11-09 by BA/PM: S, P2, DoR 9/10, Backlog, waiting on two inputs** (task `bapm-close-1109`, records only, at `main` `e069b49a`;
> nothing run). Source: the owner's ruling, item 3 (`orch-2026-10-30a` `…a9c03e07`): *"One final ticket, after R2: the README. The owner's
> ASCII art comes from assets/readme-art.txt and replaces the title block. The GUI section gets step-by-step setup for Arena, Cute Chess and
> BanksiaGUI, and the README states R2's measured strength. No other GUIs."*
> - **It waits on two inputs** (DoR row 10): `assets/readme-art.txt` non-empty on `main`, written by the owner; and `ABC-295`'s QE verdict with
>   R2's X ± Y. Each is named under § Dependencies. When both exist, row 10 holds and the ticket can go to Ready.
> - Docs only. The board move is the Orchestrator's.

## Problem

- **User:** a visitor to the public repository who wants to play `skytalix` in a chess GUI. The owner is the second user: he wants his own
  art at the top of the page and the project's measured strength stated.
- **Pain:** § Use with a chess GUI is one paragraph. It says to add a UCI engine with command `node` and the path to `dist/uci.js`, but not
  where any GUI takes a command and a separate argument, where the options are set, or how a game starts. A GUI asks for an executable, and
  `dist/uci.js` is not one, so this is the step a first-time user gets stuck on. The page states no strength figure.
- **Value:** a visitor goes from a clone to a game in Arena, Cute Chess or BanksiaGUI by following numbered steps. The page carries the
  owner's art and one measured figure, with the scale it is measured on.

## Scope

1. **The title block.** Replace `README.md`'s title block, the fenced `text` block at lines 1–9 at `e069b49a`, with the contents of
   `assets/readme-art.txt`, inside a fenced `text` block so it renders monospaced. The owner writes the file; the Engineer does not write or
   edit it. The tagline line below the block stays.
2. **§ Use with a chess GUI**, expanded into step-by-step setup for **Arena, Cute Chess and BanksiaGUI only**, one subsection each. Each
   covers, as numbered steps:
   1. **build:** `npm install` and `npm run build` in the clone, which writes `dist/uci.js`;
   2. **add the engine:** where this GUI adds a UCI engine, with command `node` and argument the full path to `dist/uci.js`, and how this GUI
      takes a command and an argument;
   3. ~~**the two UCI options:** where this GUI sets `Skill Level` (1 to 7, default 5) and `OwnBook` (the built-in book, on by default);~~
      *2026-11-09 (`bapm-close-1109b`; the brief, Q2):* **the three UCI options:** where this GUI sets `Skill Level`, `OwnBook` and
      `TimeMode`, naming all three, with a pointer to the one options list of scope 3;
   4. **start a game** against `skytalix` in this GUI.

   Each subsection names the GUI version and the operating system its steps were written against.
3. ~~**R2's measured strength:** one statement of R2's figure as **X ± Y on R2's scale**, from `ABC-295`'s QE verdict, and what that scale is
   (§ Acceptance criteria, A4).~~ *(moved to scope 4, 2026-11-09)*

   *2026-11-09 (`bapm-close-1109b`; the brief, Q2):* **The three UCI options, documented once,** in § Use with a chess GUI, as the `uci`
   reply in `src/uci-session.ts` gives them at `638ac8a5`:

   | option | type | range or values | default | source |
   |---|---|---|---|---|
   | `Skill Level` | spin | 1 to 7 (`EASIEST_LEVEL`, `HARDEST_LEVEL`) | 5 (`DEFAULT_LEVEL`) | `src/levels.ts` lines 64–66; `uci` reply |
   | `OwnBook` | check | true or false (the built-in opening book) | true | `uci` reply |
   | `TimeMode` | combo | `level`, `simple-tournament`, `uci-clock-mode` (`TIME_MODES`) | `level` | `src/uci-session.ts` `TIME_MODES`; `uci` reply |

   One line per `TimeMode` value says what it does, from `src/uci-session.ts`'s header (`ADR-0052`): `level` plays at the `Skill Level`'s
   time budget; `simple-tournament` searches a fixed 22 s a move (`SIMPLE_TOURNAMENT_BUDGET_MS`), never past the clock it is given;
   `uci-clock-mode` spends the clock the GUI gives it, at most 59.5 s a move (`CLOCK_MODE_MAX_BUDGET_MS`). One sentence says that
   **`Skill Level` is read only while `TimeMode` is `level`** (the `go` handler: `leveled = timeMode === "level"`).
4. **R2's measured strength** *(was scope 3; 2026-11-09, `bapm-close-1109b`: the figure is in)*: one statement of **X = 1 902.5 ± 49.1**,
   from `ABC-295`'s QE verdict `…e11c410e`, with the scale it is on stated in the README (A4).
5. *2026-11-09 (`bapm-close-1109b`; the owner's answer 5, `…810191ff`):* **§ Licence's last line, "The title's letters use FIGlet's standard
   font.", is removed.** The rest of § Licence stays as it is.

## Out of scope

- Any file other than `README.md`: no `src/`, `tools/`, `package*.json`, `AGENTS.md`, runbook, `LICENSE` or `NOTICE` change, and no edit to
  `assets/readme-art.txt`.
- Any GUI other than the three. Where to download a GUI, and its install. Screenshots and images.
- Any strength figure other than R2's: no R1 figure, no 4 s figure, no 40/15 or rating-list claim. `EPIC-011` `G1` is not met.
- Any other README section, except ~~the one credit line of § Open questions Q1~~ *(2026-11-09) the § Licence credit line of scope 5*.

## Acceptance criteria

All checks run at the build tip. `<base>` is the `main` sha the branch was cut from.

- **A1 (docs only).** **Given** the branch, **when** `git diff --name-only <base> <tip>` runs, **then** it lists `README.md` and, at most,
  files under `plans/` and `.grugops/`. No path under `src/` and no `assets/readme-art.txt`.
- **A2 (the art, byte-equal).** **Then** line 1 of `README.md` is exactly ` ```text `, and the lines up to the next line that is exactly
  ` ``` ` are byte-equal to `assets/readme-art.txt`:
  `sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt` exits 0. No line of the old title block remains outside it.
- **A3 (each GUI's steps complete).** **Then** § Use with a chess GUI has exactly three subsections, Arena, Cute Chess and BanksiaGUI, and no
  other GUI is named in the file. In each subsection:
  - a numbered list covers the four steps of scope 2, **4 of 4 for each GUI, 12 of 12 in all**;
  - step 2 shows the command `node` and the argument as the full path to `dist/uci.js`, written as a placeholder (A6);
  - ~~step 3 names both `Skill Level` and `OwnBook`, with their ranges or defaults as the `uci` reply gives them (A5);~~
    *2026-11-09 (`bapm-close-1109b`):* step 3 names all three, `Skill Level`, `OwnBook` and `TimeMode`, and points at the one options list
    (scope 3), whose ranges and defaults A5 checks;
  - the subsection names the GUI version and the operating system.
  QE records the 12 cells as a table, each with the README line that meets it.
- **A4 (R2's strength and its scale).** **Then** the README states X ± Y equal to `ABC-295`'s QE verdict figures as QE rounds them, and names
  what the scale is: Stockfish 19 at `UCI_LimitStrength` at `UCI_Elo` E, both sides at 100 ms a move, 200 games, and X as E plus the Elo
  difference from the score. It says the figure is a reading on that scale only, not a 40/15 or rating-list claim. No other Elo figure is in
  the file. *2026-11-09 (`bapm-close-1109b`): the figure is in. **X ± Y is `1 902.5 ± 49.1`** (`…e11c410e`; the README may write
  `1902.5 ± 49.1`). The scale the README names, from that verdict: Stockfish 19 with `UCI_LimitStrength` on and `UCI_Elo` **1 810**;
  `skytalix` at level 5 and Stockfish each at **100 ms a move**; **200 games**, 100 openings with both colours, one at a time;
  `skytalix` scored **63.0 %**, **+92.5 ± 49.1** Elo against 1 810, so X = 1 810 + 92.5. A reader who checks the README against
  `…e11c410e` finds each of these numbers there. No 1 806.5 (R1), no 2 074 (4 s) and no other Elo figure.* **If R2's verdict carries no X ± Y** (UNRESOLVED or VOID), A4 cannot be met: the ticket goes back to the Orchestrator, and no
  other figure stands in.
- **A5 (facts match the code).** **Then** every option name, range and default shown equals the `option name` lines of the `uci` reply in
  `src/uci-session.ts`. No sentence counts the options wrongly (§ Open questions Q2). *2026-11-09 (`bapm-close-1109b`): **all three
  options appear, 3 of 3,** each with type, range or values and default equal to its `option name` line: `OwnBook` check, default true;
  `Skill Level` spin 1–7, default 5; `TimeMode` combo `level` / `simple-tournament` / `uci-clock-mode`, default `level`. The two times
  stated (22 s, 59.5 s) equal `SIMPLE_TOURNAMENT_BUDGET_MS` and `CLOCK_MODE_MAX_BUDGET_MS`. The README's "two options" sentence is gone:
  `grep -c 'two options' README.md` prints 0.* `npm run build` is a `package.json` script and writes
  `dist/uci.js`. Every shell command added runs as written on a fresh clone and exits 0.
- **A6 (no personal data, `ADR-0049` decision 4).** **Then** `ABC-216` A8's four scans count 0 on `README.md`: personal paths, IPv4
  addresses, e-mail addresses, and absolute URLs other than the repository's own public HTTPS URL and the Apache licence URL. No absolute URL
  is added.
- **A7 (links and lint).** The repository has no markdown lint and no link check: `biome.json`'s includes take no `*.md`, and there is no
  markdownlint config. So there is no lint bar on the README. **Then** every relative link target is a file `git ls-files` lists at the tip
  (`ABC-216` A9's check), and `npm run lint` and `npm run build` exit 0 at the tip.
- **A8 (the credit line gone)** *(2026-11-09, `bapm-close-1109b`; the owner's answer 5)*. **Then** `grep -c 'FIGlet' README.md` prints 0,
  and § Licence's other lines are byte-equal to `<base>`'s.

## NFR triggers

- **None moves.** No code, test or lane change, so `NFR-008` has nothing to read.
- **Security:** A6 is `ADR-0049`'s decision-4 scan for this file. `ABC-041` (a) does not fire: `package*.json` is untouched.

## Test notes

1. **A2 by `cmp`**, after `test -s assets/readme-art.txt`. If the owner's file has no final newline, or holds a line that is exactly
   ` ``` `, the Engineer stops and asks; the file is not edited.
2. **A3 is a reading, recorded as a table.** Whether the host can run each GUI is `UNKNOWN - verify`. Where it cannot, QE checks each step
   against the named GUI version's own manual and says so per GUI in its note.
3. **A4 against `ABC-295`'s QE verdict note**, by its id (`qe-ABC-295` `…e11c410e`). **A5 and A8 by `grep`** against the `uci` reply and `README.md`.
4. **UAT: waived by measurement.** `git diff --name-only <base> <tip> | grep '^src/'` prints nothing. The QE verdict is still owed.

## Size and priority

- **Size S.** One file. Three short step lists, one figure, one block replaced, from sources this page names. *2026-11-09: plus one three-row options table and one line removed; still S.*
- **Priority P2.** The owner's last asked-for ticket. Nothing is broken, so not P1.

## Dependencies

- ~~**`ABC-295`'s QE verdict,** with R2's X ± Y (A4). The owner's order: the README comes after R2.~~ *2026-11-09 (`bapm-close-1109b`): **met.** `ABC-295` Done, `…e11c410e`, X = 1 902.5 ± 49.1.*
- **`assets/readme-art.txt`,** non-empty on `main` (`test -s`), written by the owner. Absent at `e069b49a`. *2026-11-09 (`bapm-close-1109b`): **still owed.** Untracked on `main`, being written by the owner (0 bytes at this hop); not created or committed by any role. How it reaches the build branch is the Orchestrator's to settle (`UNKNOWN - verify`).*
- **Builder:** software-engineer. **QE hop:** owed (A2–A7).
- **Push:** the owner pushes; the page is public only after his push (`ADR-0049` decision 1).

## Open questions (the Orchestrator's to take to the owner; each has a default) *(2026-11-09: both answered)*

- **Q1, the credit line.** § Licence ends "The title's letters use FIGlet's standard font.", which describes today's art. **Default:** the
  line is removed unless the owner says his art uses that font. Asked when the art file lands. *2026-11-09 (`bapm-close-1109b`):
  **answered: removed.** The owner's art does not use FIGlet's standard font (`…810191ff` answer 5). Scope 5, A8.*
- **Q2, the third option.** The `uci` reply lists three options, not two: `OwnBook`, `Skill Level` and `TimeMode` (`level`,
  `simple-tournament`, `uci-clock-mode`; default `level`; `ADR-0052`). The README says "two options", and the ruling names two. **Default:**
  the steps set the two named options, and the sentence that counts them names `TimeMode` and its default once, so A5 holds. No steps for
  `TimeMode`. *2026-11-09 (`bapm-close-1109b`): **answered by the Orchestrator's brief: the README documents all three options**, each
  with its range and default from `src/` (scope 3, A3, A5). The default above is replaced.*

## Definition of Ready

~~BA/PM, 2026-11-09, at `main` `e069b49a`. **Result: 9 of 10. Backlog.**~~

**Re-scored 2026-11-09 by BA/PM, at `main` `638ac8a5` (`bapm-close-1109b`). Result: 9 of 10. Backlog.** Rows 1–9 hold as before; row 2
now carries the options table and the credit line, row 4 the figure, 3 of 3 options and A8, row 5 the met verdict. Row 10 has one input
left, down from two.

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the GUI paragraph leaves out command-and-argument, options and game start; the owner's art and figure |
| 2 | scope and out-of-scope | ✅ one file; three GUIs, four steps each; one figure; other GUIs, figures and files out |
| 3 | INVEST | ✅ independent of code; S; testable by `cmp`, a 12-cell table, a figure match and scans |
| 4 | testable, measurable acceptance | ✅ `cmp` exit 0; 12 of 12; X ± Y equal to QE's; 0 scan hits; links resolve |
| 5 | dependencies known | ✅ `ABC-295`'s verdict; the art file |
| 6 | NFR triggers with targets | ✅ none moves; A6 is the decision-4 scan |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ ~~**two inputs missing:** `assets/readme-art.txt` (absent) and R2's X ± Y (`ABC-295` not yet read). Q1 and Q2 have defaults and do not block~~ *2026-11-09 (`bapm-close-1109b`):* **one input missing: `assets/readme-art.txt` non-empty** (untracked on `main`, 0 bytes, the owner writing it). R2's X ± Y is in (`…e11c410e`). Q1 and Q2 are answered |

~~**DoR 9/10. Left in Backlog until both inputs exist.**~~

**DoR 9/10. Left in Backlog until `assets/readme-art.txt` is non-empty and reachable from the build branch; then row 10 holds and the ticket
can go to Ready with no other change to this page.**
