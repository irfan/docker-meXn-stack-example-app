set -e

mongo <<EOF

use admin

db.createUser({
  user: '$DB_USER',
  pwd: '$DB_PASS',
  roles: [{
    role: 'dbOwner',
    db: '$MONGO_INITDB_DATABASE'
  }]
})

EOF
