#execute this as follows:  expire.sh token (e.g show.sh )
#

. ./env

WHAT=$1
WHO=$2

curl -s --request POST ${DATABUNKER_URL}/v1/exp/start/${WHAT}/${WHO} \
    -H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" \
    -H "Content-Type: application/json" \
    -d '{ "expiration": "1m" }' 
