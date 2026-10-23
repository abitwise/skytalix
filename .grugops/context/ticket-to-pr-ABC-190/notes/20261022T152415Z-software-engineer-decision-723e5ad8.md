---
id: 20261022T152415Z-software-engineer-decision-723e5ad8
kind: decision
by: software-engineer
at: 2026-10-22T15:24:15Z
verified_by: 
confidence: high (every figure was run; counts only, no timing)
refs:
  - ABC-190
  - QE-172-a
  - ABC-168
  - EPIC-007
  - 823a9885
  - 15766056
supersedes: 
seal: sha256:4c9ab555ebce1ca6d9345a6df18fbba9c13d47a42cf0b01ba42cbfb7dda33219
---

# ABC-190: regenerate the lock once, as the page measures; no hand edit

- Ran the page's command exactly: `npm install --package-lock-only --ignore-scripts` (npm 11.20.0 = the page's npm, node v26.11.1) in ../wt-ABC-190 on grugops/ABC-190 from main 823a9885 (holds ABC-168 513c0211). Never in main's checkout.
- The diff equals the page's A1 measure, so no stop: numstat `4	0	package-lock.json`, under packages[""] only: `"license": "UNLICENSED",` and the 3-line `"bin": { "skytalix": "dist/uci.js" },`.
- Committed package-lock.json alone as 15766056. Nothing hand-trimmed. package.json, audit fix, AR-1 (Release Manager's) and src/ left untouched.
- Closes QE-172-a and ABC-168's bin drift on merge. Owed next: a QE hop (A1-A3), then the Security/NFR clause (a) hop.
