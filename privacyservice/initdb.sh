#KEY=`< /dev/urandom LC_CTYPE=C tr -dc 'a-f0-9' | head -c${1:-48};`
#ROOTTOKEN=`uuidgen 2> /dev/null`
#
#echo DATABUNKER_MASTERKEY=${KEY} > env
#echo DATABUNKER_ROOTTOKEN=${ROOTTOKEN} >> env
. ./env

export MMURL="https://api-smoke4.eng.macrometa.io"
export MMAPIKEY="demo.piidemo.EvFoIF5Nu8MioaFRuHyi4In2n9QgdVRIkhNIJr16E5dRkWzTtg8SgiJ7T8M4EusN269678"
export MMFABRIC="pii_eu"

export MMURL="https://api-joubert-us-east.eng.macrometa.io"
export MMAPIKEY="joubert_databunker.com.databunkerDemo.VpT4zqdTT5qz4PycrDW2ItXFYGgcX8FOVJljFlEI3tMBAP7lnQBBoL3zgqRIlfuKf15116"
export MMFABRIC="_system"

./databunker -init -masterkey ${DATABUNKER_MASTERKEY} -roottoken ${DATABUNKER_ROOTTOKEN}
