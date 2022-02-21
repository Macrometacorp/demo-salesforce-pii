. ./env

TOKEN=$1

curl -s --request POST ${DATABUNKER_URL}/v1/sharedrecord/token/${TOKEN} \
    -H "Content-Type: application/json" \
	-H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" \
    --data-raw '{
	    "fields":"email,login,first,last,phone"
        }'
