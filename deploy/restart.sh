#/!bin/bash

PRODDIR=$(dirname $0)/prod
UPDTDIR=$(dirname $0)/update

if [ -d "${UPDTDIR}" ]; then
    npm stop --prefix ${PRODDIR}
    rm -rf ${PRODDIR}
    mv ${UPDTDIR} ${PRODDIR}
    npm start --prefix ${PRODDIR}
else
    npm restart --prefix ${PRODDIR}
fi

