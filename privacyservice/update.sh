#execute this as follows:  update.sh first last phone (e.g add.sh joubert berger 4045551234)

. ./env


WHAT=$1
WHO=$2
DATA=$3
VALUE=$4

curl -s --request PUT ${DATABUNKER_URL}/v1/user/${WHAT}/${WHO} \
  -H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" -H "Content-Type: application/json" \
  -d "{\"${DATA}\": \"${VALUE}\" }"
