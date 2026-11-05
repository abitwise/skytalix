qe-ABC-282 raw/out. offline/ and lanes/ are the chain's first pass. In a /tmp quota window (22:22 for sweep; 22:31:31 to about 22:31:52 for the rest) new files stayed at 0 bytes and node still exited 0, so
sweep, floor-*, zug-head, g1-* and the four R-281-a logs held nothing. offline2/ and tlines/ are those rows' first real read, written on /, with r12-control added. lanes/exits.txt has no header or t- lines for the same reason.
ident-base.jsonl is not committed; ident.sha256 holds both hashes, which are equal. a6-launch1/ and a6-launch2/ stopped before any game. a6/ is the read.
