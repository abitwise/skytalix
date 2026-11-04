#!/bin/bash
# qe-ABC-302 A2: added comment lines in the delivered test diff, and every trace id they cite. Usage: a2-comments.sh <repo> <base> <tip>
git -C $1 diff $2 $3 -- 'src/*.test.ts' | grep '^+' | grep -v '^+++' | grep -E '^\+\s*(//|/\*\*|\*)' > /dev/stdout
echo "## ids cited on added comment lines"
git -C $1 diff $2 $3 -- 'src/*.test.ts' | grep '^+' | grep -v '^+++' | grep -E '^\+\s*(//|/\*\*|\*)' | grep -oE 'ABC-[0-9]+|ADR-[0-9]+|secnfr-[a-z0-9-]+|arch-ABC-[0-9]+|QE-[0-9]+-[a-z]' | sort | uniq -c
