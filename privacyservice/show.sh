#execute this as follows:  show.sh token (e.g show.sh )
#

. ./env

TOKEN=$1
curl -s ${DATABUNKER_URL}/v1/user/token/${TOKEN} -H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" 
