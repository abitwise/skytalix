---
id: 20261024T082003Z-software-engineer-decision-e2623df7
kind: decision
by: software-engineer
at: 2026-10-24T08:20:03Z
verified_by: 
confidence: medium (a builder call on a criteria/wording conflict; words unchanged)
refs:
  - ABC-214
  - ADR-0048
  - A5
  - bb8d4432
  - a5dfb0dc
supersedes: 
seal: sha256:78a5222b322bc7898b34f9bddc62aa3a680a7f715bb1e2c1e663c5c62cb56352
---

# ABC-214: NOTICE reflowed so A5's "Simplified Evaluation Function" is on one line

- **Conflict found.** ABC-214 Scope 6's default NOTICE text, which ADR-0048 adopts unchanged, wraps `"Simplified Evaluation` / `  Function"` across two lines. A5 requires NOTICE to contain `Simplified Evaluation Function`, and `grep -cF` read 0 at `a5dfb0dc`.
- **Decision.** Move the line break only. The carve-out now reads `…Tomasz Michniewski's` / `"Simplified Evaluation Function", published at` / `https://www.chessprogramming.org/Simplified_Evaluation_Function`. The whitespace-normalised NOTICE is byte-identical before and after (`tr -s ' \n'` + cmp), so no word changed. Committed as `bb8d4432`, not an amend.
- **Why not stop.** The page's stop rules (A3 sha, A5 base check, A6) did not fire. Test note 5 says A4/A5 check strings and the wording may change "as long as they hold".
- **For BA/PM and Architect:** the Scope 6 and ADR-0048 decision 3 text, read line by line, cannot pass A5. A future re-read, or ABC-215, should know the line break moved. No ADR was edited.
