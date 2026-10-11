#!/bin/bash
# plant.sh <name> <file-rel> <perl-subst-expr> <env-assign> <vitest args...>
# Clones P-head (APFS), applies one perl substitution that must match EXACTLY once (else aborts),
# runs vitest in the clone, records diff + output (timing lines cut), deletes the clone.
set -u
S=${QE2_SCRATCH:?set QE2_SCRATCH to the scratch dir that holds P-head (git archive of the tip + an APFS clone of node_modules)}
name=$1; file=$2; expr=$3; envs=$4; shift 4
W=$S/W-$name; rm -rf "$W"; cp -Rc $S/P-head "$W"
n=$(EXPR="$expr" perl -0777 -ne 'my $c = eval "\$_ =~ $ENV{EXPR}"; die $@ if $@; print $c+0' "$W/$file")
if [ "$n" != "1" ]; then echo "ABORT $name: $n matches"; rm -rf "$W"; exit 2; fi
EXPR="$expr" perl -0777 -i -pe 'eval "\$_ =~ $ENV{EXPR}"; die $@ if $@' "$W/$file"
out=$S/plants/$name.txt; mkdir -p $S/plants
{ echo "# plant $name  file=$file  env=$envs"; echo "# substitution: $expr"; echo "# matches: $n"
  /usr/bin/diff -u "$S/P-head/$file" "$W/$file" | sed -e "s#$S/##g" -e 's/\t20[0-9-]* [0-9:.]*$//'
  echo "# run: $envs npx vitest run $*"; } > "$out"
( cd "$W" && env $envs npx vitest run "$@" ) 2>&1 | sed -E -e "s#$S/##g" -e 's/wall [0-9.]+ s/wall <cut>/g' \
  -e '/Duration|Start at/d' -e 's/ [0-9]+ms$//' >> "$out"; echo "# exit ${PIPESTATUS[0]}" >> "$out"
rm -rf "$W"
grep -E "^# matches|^PUZZLES|AssertionError|FAIL |Tests  |^# exit" "$out"
