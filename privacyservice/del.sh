#execute this as follows:  del.sh token (e.g del.sh 620ba8b3-559a-69a8-de64-6d5dcb579b6d)
#

. ./env

TOKEN=$1
curl -s --request DELETE ${DATABUNKER_URL}/v1/user/token/${TOKEN} -H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" 
