cd "$1"
for v in 'door|{}' 'V1|{"lmr":"log","base":0.75,"div":2.25}' 'V1k0|{"lmr":"log","base":0.75,"div":2.25,"killerLess":0}' 'V5|{"lmr":"log","base":1.0,"div":2.0}' 'V3|{"lmr":"log","base":0.75,"div":2.25,"pvLess":0,"killerLess":0}' 'V10|{"lmr":"log","base":1.0,"div":1.75}' 'R-floor1|{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"floorOne":true}' 'R-clamp2|{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"clampMin":2}' 'R-mind4|{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"minDepth":4}' 'R-max2|{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}' 'R-max3|{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":3}' 'B085-200|{"lmr":"log","base":0.85,"div":2.0,"killerLess":0}' 'B100-225|{"lmr":"log","base":1.0,"div":2.25,"killerLess":0}' 'B075-200|{"lmr":"log","base":0.75,"div":2.0,"killerLess":0}'; do
  n=${v%%|*}; c=${v#*|}
  printf "%s " "$n"; node probe.ts zug "$c" | grep -E "zugzwang.004|zugzwang.005" | tr '\n' ' '; echo
done
