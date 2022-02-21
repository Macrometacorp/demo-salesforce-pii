#execute this as follows:  showby.sh {email|login|token} data (e.g showby.sh token b78c6a43-5e5c-d41b-1725-59513975c068)
. ./env

WHAT=$1
WHO=$2

EMAIL="john@doe.com"
LOGIN="johndow"
TOKEN="d1aa2d1b-481b-072c-4ac1-54dd85001d6b"

curl -s ${DATABUNKER_URL}/v1/user/${WHAT}/${WHO} -H "X-Bunker-Token: $DATABUNKER_ROOTTOKEN" |jq

