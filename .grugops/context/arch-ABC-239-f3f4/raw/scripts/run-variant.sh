#!/bin/bash
# arch-ABC-239-f3f4: write one variant table into the scratch src copy, then chooseMove at the depths given.
# usage: run-variant.sh <F> <spec> <depth...>   (the caller holds the host lock)
F=$1; spec=$2; shift 2
node "$F/scripts/gen.ts" "$F/tabs" "$F/var/src/evaluate-params.ts" "$spec" && timeout 600 node "$F/scripts/zz.ts" "$F/var/src" "$spec" "$@"
