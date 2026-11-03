# QE gaps for ABC-278: QE-278-a LOW (shape d false-positive surface wider than named), QE-278-b LOW (residual foreign-argv misses, one not named), QE-278-c INFO (non-UTF-8 / compressed-under-another-name records). None blocks the merge

Facts as run (`raw/out/harness-run.txt`, the `probe` and `a1-utf16` / `a1-gzip` rows; `raw/out/qe277-harness-rerun.txt` fp02). Severities and owners are QE's judgement.

- **QE-278-a LOW. Owner: Software Engineer (header text) or BA/PM (a narrower shape d).**
  - **What happens.** Shape d (a PID-like number, then an absolute path at the end of the line) hits any line that is a count followed by an absolute path, not only `size <n> /dev/<disk>` and the code-span case the header names.
  - **Measured.** These now hit (all were clean on `main`):
    - `wc -l` output (`  <n> /srv/x/a.md`; QE-277's own fp02);
    - `du` output with spaces before the path;
    - a numbered line `<n> /usr/local/bin`.
  - `du` with a TAB, `ls -l`, `df`, a markdown table cell and `<n> matches --in /…` stay clean.
  - **Exposure.** At base the recount finds 1 such line in 16 223 text records (the code span), so A4's bar holds with room. It fails closed: an extra placeholder edit, never a leak.
  - **Remedy hint, not built.** Name "a count before an absolute path at a line end (`wc -l`, `du`)" among shape d's accepted false positives, or require the path to look like an executable (`/bin/`, `/sbin/`, no extension). Re-open trigger: an FP of this shape blocks a real merge.
- **QE-278-b LOW. Owner: Software Engineer (header) / BA/PM (scope).** foreign-argv still misses these process lines (all `[]`):
  - `ps -ef` or `ps aux` rows whose command has a flag before the path (`node --x /abs`). Scope (iii) asks only for an absolute executable, or a bare command followed by an absolute path, so this is not an AC miss. **The header's "Not seen" list does not name it.**
  - Named by the SE as not seen: `<pid> node -p <n> /abs` and a relative executable.
  - Not named:
    - `<pid> sudo -u <user> /abs`;
    - `<pid> /abs-exec` followed by `,` or wrapped in `( )`;
    - a 1-digit PID outside a `ps` table.
  - **Mitigation.** A path under the owner's home is still caught by home-path. The open case stays a foreign project outside the home, as in QE-277-c.
- **QE-278-c INFO. Owner: none (accepted; BA/PM if re-opened).** `--text` reads bytes as text, but these records with a planted home path still pass with exit 0:
  - a UTF-16LE record;
  - gzip bytes committed under a non-compressed name (`.md`).
  - The ticket claims neither: scope 1 covers attributes and NUL bytes; other archive forms are out of scope. The record writers emit UTF-8 and name compressed outputs `.gz`/`.xz`, so this matters only for a deliberate evasion, which is outside the check's threat model (an agent's accidental leak). Re-open trigger: a record writer that emits UTF-16, or compressed bytes under another extension.
- **Closed from QE-277.**
  - **a:** verdict equal from every checkout and attribute source.
  - **b:** `.xz` read; missing `xz` gives UNKNOWN.
  - **c:** the five named shapes caught.
  - **d:** `.`, `-` and `_` caught; `\/` declined by the ticket.
  - **e:** quoted names print clean, and `unquote` is tested.
  - **f:** a `HOME` override no longer narrows the check (17/17 on QE-277's own A1 branch), and the runbook has its line.
  - **QE-277-g:** unchanged, as the ticket says.
