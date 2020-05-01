echo "env_variables:"
set | grep "^_GAE_" | sed -e "s/^_GAE_/   /" | sed -e "s/=/: /1"
