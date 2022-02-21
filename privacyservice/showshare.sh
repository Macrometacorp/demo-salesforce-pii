. ./env

TOKEN=$1
curl -s ${DATABUNKER_URL}/v1/get/${TOKEN} -H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" 
