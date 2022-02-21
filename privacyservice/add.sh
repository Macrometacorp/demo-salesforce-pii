#execute this as follows:  add.sh first last phone (e.g add.sh joubert berger 4045551234)

. ./env

FIRST=$1
LAST=$2
PHONE=$3
LOGIN=${FIRST}${LAST}
EMAIL="${FIRST}@${LAST}.com"

curl -s ${DATABUNKER_URL}/v1/user \
  -H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"first\": \"${FIRST}\", \"last\": \"${LAST}\", \"login\": \"${LOGIN}\", \"phone\": \"${PHONE}\", \"email\": \"${EMAIL}\"}"
