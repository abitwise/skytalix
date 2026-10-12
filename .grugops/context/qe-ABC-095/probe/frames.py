#!/usr/bin/env python3
# qe-ABC-095: split a non-TTY session's stdout into frames (a frame starts at the rank-8 row, ends before the next blank line).
# Either orientation (rank 8 or rank 1 on top). Prints per frame: ply (from the status row), row count, the non-blank rows below `material` that are not move-history rows.
import re, sys, json
lines = [l[2:] if l.startswith("> ") else l for l in open(sys.argv[1]).read().split("\n")]
frames = []; i = 0
while i < len(lines):
    if i + 1 < len(lines) and ((re.match(r"^8 ", lines[i]) and re.match(r"^7 ", lines[i + 1])) or (re.match(r"^1 ", lines[i]) and re.match(r"^2 ", lines[i + 1]))):
        j = i
        while j < len(lines) and lines[j] != "": j += 1
        rows = lines[i:j]
        st = next((r for r in rows if re.match(r"^(White|Black) to move\s+\d+\.", r)), "")
        m = re.match(r"^(White|Black) to move\s+(\d+)\.(\.\.)?", st)
        ply = 2 * (int(m.group(2)) - 1) + (1 if m.group(3) else 0) if m else None
        k = next((n for n, r in enumerate(rows) if "material" in r), len(rows))
        extra = [r.strip() for r in rows[k + 1:] if r.strip() and not re.match(r"^\s+\d+\.", r) and r.strip() != "thinking..."]
        frames.append({"ply": ply, "rows": len(rows), "extra": extra, "book": sum("book" in r.lower() for r in rows)})
        i = j
    else: i += 1
print(json.dumps(frames))
