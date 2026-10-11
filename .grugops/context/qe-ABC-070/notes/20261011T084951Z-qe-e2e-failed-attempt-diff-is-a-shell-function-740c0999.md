---
id: 20261011T084951Z-qe-e2e-failed-attempt-diff-is-a-shell-function-740c0999
kind: failed-attempt
by: qe-e2e
at: 2026-10-11T08:49:51Z
verified_by:
confidence: high
refs:
  - ABC-070
supersedes:
---

# Do not use bare `diff` for byte checks on this host; it is a shell function

In this host's shell, `diff` is a function, `git diff --no-index --color-words "$@"`. My first A4 identity check, `diff <(sed …) <(sed …) && echo IDENTICAL`, printed IDENTICAL without testing anything. With process-substitution inputs it compares nothing useful, and `-U0`/`grep '^@@'` came back empty. I re-ran with `/usr/bin/diff` and a deliberately wrong-window control that must fail. Use `/usr/bin/diff` or `cmp` for any byte-identity reading.
