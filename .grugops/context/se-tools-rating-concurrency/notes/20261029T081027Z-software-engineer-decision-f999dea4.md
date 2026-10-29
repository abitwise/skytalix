---
id: 20261029T081027Z-software-engineer-decision-f999dea4
kind: decision
by: software-engineer
at: 2026-10-29T08:10:27Z
verified_by: 
confidence: high: diff read line by line; dry check run as stated
refs:
  - ABC-204
  - EPIC-008 Q4
  - tools/rating/rating.ts
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - orch-2026-10-29d/20261029T080512Z-orchestrator-decision-3081f6d4
  - orch-2026-10-29c/20261029T073203Z-orchestrator-decision-d9513dc1
  - se-tools-rating-host/20261028T211542Z-software-engineer-decision-f55b4cdf
  - grugops/se-tools-rating-concurrency
  - b95961d4
supersedes: 
seal: sha256:549843cd8f177823f31decc1e518fe32e1a9bbb321a420eb6d9b48d5bce40944
---

# rating.ts takes --concurrency 1–8 in both modes; without it R 2 and D 3, byte-identical

**What changed (commit `b95961d4` on `grugops/se-tools-rating-concurrency`, from main `bb089d3d`):**
- `tools/rating/rating.ts` accepts `--concurrency C` in `r` and `d` mode. The value goes to `cutechess-cli`'s `-concurrency` as `String(concurrency)`, replacing the literal `mode === "r" ? "2" : "3"`.
- No flag → `concurrency = mode === "r" ? 2 : 3`. `String(2)` is `"2"` and `String(3)` is `"3"`, so the argument list is the same as before. The dry check shows it byte for byte (observation, same task).
- Validation: the flag's raw text must match `^[1-8]$`. Anything else throws `--concurrency <v>: not an integer from 1 to 8`, exit 1. That is the same shape as `--rounds`. It runs next to the other flag checks, before the out-dir is made and before any probe, clone or build.
- Records: `machine.txt` (also printed) gains a last line, `concurrency: 3 (default)` or `concurrency: 2 (default 3)`. `cmd.txt` carries the value through the args. `summary.txt` lists no pins, so it is not touched. There is no separate analyse step in `tools/rating/`.
- Usage text and header comment name the flag and its default.
- ABC-204 § Dependencies has a dated 2026-10-29 change line (reason: heat on this host, owner `orch-2026-10-29d/…3081f6d4`). Q4's ruling text and the older lines are not edited.

**Choices made here (small, reversible):**
1. The value is checked as text, not with `Number`. `--rounds` uses `Number`, which reads `2.0`, `0x2` and `2e0` as 2. For a width that has to show up exactly in the records, those are refused instead.
2. The default case is also written down (`(default)`), so every new `machine.txt` states the width. This adds one line to `machine.txt` compared with past readings. The command line itself is unchanged.
3. The range is 1–8, as the brief says. Nothing ties 8 to this host's core count.

**Not done:** no test was added. The harness stays outside `npm test` by design (ABC-204: no `*.test.*` under `tools/rating/`), and the dry check is the behaviour evidence, as in the previous hop.
