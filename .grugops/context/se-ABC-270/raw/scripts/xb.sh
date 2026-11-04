#!/bin/bash
# se-ABC-270 cross-build readings, each under the host lock, sequential.
cd <scratch>/se270
L=<scratch>/se270/../host-test.lock
flock $L node scripts/b0.ts <scratch>/se270/B > out/b0-base.out 2>&1; echo "b0-base exit $?" >> out/xb-exits.txt
flock $L node scripts/b0.ts <scratch>/se270/H > out/b0-head.out 2>&1; echo "b0-head exit $?" >> out/xb-exits.txt
flock $L node scripts/a2.ts <scratch>/se270/H <scratch>/se270/B > out/a2.out 2>&1; echo "a2 exit $?" >> out/xb-exits.txt
flock $L node scripts/xbuild.ts <scratch>/se270/H <scratch>/se270/B > out/xbuild.out 2>&1; echo "xbuild exit $?" >> out/xb-exits.txt
echo DONE >> out/xb-exits.txt
