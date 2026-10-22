---
id: 20261022T134243Z-software-engineer-observation-53d08e23
kind: observation
by: software-engineer
at: 2026-10-22T13:42:43Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - grugops/ABC-168
  - merge-prep-ABC-168
  - a7857e0b
  - a2c5f673
  - 243c2fdf
  - ABC-187
  - QE-187-a
supersedes: 
seal: sha256:153650fba17518347ff6fddf3c6ed5db74041ba841c6c488eaefb7265518ed7e
---

# QE-187-a discharged: closer count measured 9, comment set to 9 (243c2fdf)

ABC-187 A5's script (`node -e '…indexOf("- Dev / run:")…split("-->").length-1'`) on the merged AGENTS.md prints **9** (main a7857e0b alone prints 8). The extra closer is Scope 5's `npm run uci` line, which follows the Dev / run slot. `src/cli.test.ts:2244` (was :2242) now reads "carries 9 further closers after this slot's own". It is a one-line comment edit (1+/1-), and no assertion reads it.
