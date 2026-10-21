# the QE-191-a stand-in: must print nothing (run in the instrument's checkout, in the instrument's shell env)
git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF
