qe-ABC-282 A6, launch 3. d.out (the cutechess debug log, 9.5 MB) is not committed (qe-ABC-279 precedent): a6-read.py and analyze.py read it before deletion.
host.log is kept as host.log.txt because the repo's .gitignore drops *.log, bytes unchanged. Every other SHA256SUMS line verifies the committed bytes.
