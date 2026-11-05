# Records read only, no run. From arch-ABC-302's recorded tip kill sets (raw/kills/tip-*.sum, src tree af2b77dc plus
# ABC-302's sketch), drop the nine ABC-307 rows and count who still holds each mutant.
# Usage, from .grugops/context: python3 arch-ABC-307/raw/holders.py > arch-ABC-307/raw/holders.tsv
import glob, os
ROWS = {"L1": "the seam built for each level", "L2": "with a legal ep capture available",
        "L3": "the move the search scores 0", "C1": "two sessions on the same seededRandom",
        "C2": "Skill Level value 7 sets 7", "B1": "ten seeds, one pick each"}
print("mutant\ttip_killers\tnine_rows_among_them\tleft_after_all_nine\tleft_cli_and_uci_241_230_242")
for f in sorted(glob.glob("arch-ABC-302/raw/kills/tip-*.sum")):
    m = os.path.basename(f)[4:-4]
    ks = [l.split("\t", 1)[1].strip() for l in open(f, encoding="utf8") if l.startswith("KILL")]
    hit = sorted(r for r, t in ROWS.items() if any(t in k for k in ks))
    left = [k for k in ks if not any(t in k for t in ROWS.values())]
    named = sum(1 for k in left if any(a in k for a in ("ABC-241", "ABC-230", "ABC-242")))
    print(f"{m}\t{len(ks)}\t{','.join(hit) or '-'}\t{len(left)}\t{named}")
