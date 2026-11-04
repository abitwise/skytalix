qe-ABC-283 raw/out. The repo's .gitignore drops *.log, so every committed log carries a .log.txt suffix
(c2/ and s1/ host.log -> host.log.txt; lanes/*.log -> *.log.txt; g6/wait.log -> wait.log.txt), bytes unchanged.
c2/ and s1/ SHA256SUMS also list d.out / r.out (cutechess debug logs, 7.6 MB / ~1 MB) and build-*.log; those
are not committed (qe-ABC-279 precedent); analyze.py read d.out / r.out before deletion (c2-analysis.txt,
s1-analysis.txt). Every other SHA256SUMS line verifies the committed bytes (host.log under its .txt name).
Host paths are placeholders: <scratch>, <worktree>, <repo>.
