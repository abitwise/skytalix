---
id: 20261023T190829Z-agents-md-scribe-decision-1ae3b551
kind: decision
by: agents-md-scribe
at: 2026-10-23T19:08:29Z
verified_by: 
confidence: high (each fact re-run on main ad9655fc before it was written)
refs:
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - memory-bank/45-standing-rulings.md
  - ABC-200
  - ABC-168
  - 20261023T105540Z-architect-design-decision-0f003634
  - 20261023T185614Z-architect-design-decision-5ffd0ca7
  - 20261023T185614Z-architect-design-observation-a6addc0d
  - 20261023T105540Z-architect-design-observation-97e856c3
supersedes: 
seal: sha256:35385c9dee345758efb6c8d8333c7c9997c9c384378b0f53018c3d707b8c5ea0
---

# Three factual drifts fixed in records: startup questions, the `--` wording, the `bin` correction

Branch `grugops/scribe-drift-2026-10-23` from `main` `ad9655fc`. Three files, 42 lines added, 2 deleted (the 2 are the old `--` sentence in the `AGENTS.md` slot). No `src/`, `plans/`, `package*.json`, ADR or config line; `memory-bank/70-runbook.md` untouched (parallel Architect hop).

1. **Startup questions (ABC-200).** `AGENTS.md` `Dev / run` slot comment and `memory-bank/90-agents-md-command-log.md` § Dev / run now say: on a terminal, colour then difficulty are asked for when their flag is absent (Enter keeps the default); a flag skips its question; a non-terminal stdin skips both. Source: `src/startup-questions.ts` (`terminal = source.isTTY === true && output.isTTY === true`) and `src/cli.ts` (`askAbsentOptions` runs before the glyph mode and the loop).
2. **The `--` separator.** `AGENTS.md`: "without it npm silently drops the flag and runs with defaults" -> npm eats the flag name (npm 11.20.0): a value-less flag (`--ascii`) is dropped and the game runs with defaults, exit 0; a value flag leaves its value as a stray argument and the CLI refuses it, exit 1. The command log keeps the 2026-08-15 receipt as written and adds a dated CORRECTED paragraph after it.
3. **`bin`.** `memory-bank/45-standing-rulings.md` § Deployment posture: a dated "Correction 2026-10-23" paragraph after the "no `bin`/`main`/`exports`/`files`" sentence, which stays visible. It names the baseline tuple `[true,{"skytalix":"dist/uci.js"},false,false,false]` and points at the owner-approved notes `…0f003634` (ADR-0007) and `…5ffd0ca7` (ADR-0018). No ruling changes.

The command log also gets a `scribe-drift-2026-10-23` pass section at its end. `AGENTS.md` 16,669 -> 17,010 B (budget 18,432); no new `-->` closer.
