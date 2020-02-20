#!/bin/sh

# Wait until local MongoDB instance is up and running
until /usr/bin/mongo --port 27017 --quiet --eval 'db.getMongo()'; do
    sleep 1
done

# Configure a MongoDB replica set (doesn't matter if each container attempts
# to run same action, first one wins, other attempts will then be ignored)
/usr/bin/mongo --port 27017 <<EOF
  use $MONGO_DB_NAME;
  db.createUser({user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles: [{role: 'dbAdmin', db: 'admin'}, {role: 'dbAdmin', db: '$MONGO_DB_NAME'}, "readWrite"]});
EOF
