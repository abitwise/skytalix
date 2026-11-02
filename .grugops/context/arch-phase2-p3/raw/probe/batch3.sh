#!/bin/bash
# cut audit per candidate (search() depth 6 over the 190 + 6 endgames, sampled fires re-searched fresh)
S=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad
$S/sweep.sh audit "D=6 AUD=20 TOP=6" '{"rf":120}'
$S/sweep.sh audit "D=6 AUD=10 TOP=6" '{"fut":[0,150,350,550]}' '{"fut":[0,100,200]}' '{"raz":[0,250,450,650]}' '{"raz":[0,300,500]}' '{"fut":[0,150]}'
$S/sweep.sh audit "D=6 AUD=20 TOP=6" '{"lmp":3}' '{"lmp":2}'
$S/sweep.sh audit "D=6 AUD=5 AMAXD=6 TOP=6" '{"nmpDiv":4}'
