############################
# STEP 1 build executable binary
############################
FROM golang:alpine AS builder
# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache git gcc libc-dev openssl && go get -u github.com/gobuffalo/packr/packr
WORKDIR $GOPATH/src/securitybunker/databunker/src/
COPY src/go.mod ./deps
RUN cat ./deps | grep -v storage > ./go.mod && go mod download

COPY . $GOPATH/src/securitybunker/databunker/
#RUN echo "tidy " && go get -u && go mod tidy && cat ./go.mod
# Fetch dependencies.
# Using go get.
RUN go get -d -v && \
    packr && \
    go build -o /go/bin/databunker && \
    packr clean
############################
# STEP 2 build a small image
############################
FROM scratch
# Copy our static executable.
COPY --from=builder /bin/busybox /bin/sh
COPY --from=builder /bin/busybox /usr/bin/openssl /bin/
COPY --from=builder /lib/ld* /lib/libssl.* /lib/libcrypto.* /lib/
COPY --from=builder /etc/group /etc/
COPY --from=builder /etc/ssl /etc/ssl
COPY databunker.yaml /databunker/conf/
RUN /bin/busybox mkdir -p /databunker/data && \
    /bin/busybox mkdir -p /databunker/certs && \
    /bin/busybox ln -s /bin/busybox /bin/addgroup && \
    /bin/busybox ln -s /bin/busybox /bin/adduser && \
    /bin/busybox ln -s /bin/busybox /bin/chown && \
    /bin/busybox ln -s /bin/busybox /bin/ls && \
    /bin/busybox ln -s /bin/busybox /bin/cat && \
    /bin/busybox touch /etc/passwd && \
    /bin/busybox mkdir -p /tmp && \
    /bin/busybox chmod 0777 /tmp && \
    addgroup -S appgroup && adduser --no-create-home -S appuser -G appgroup && \
    chown appuser:appgroup /databunker/data
# Tell docker that all future commands should run as the appuser user
USER appuser
COPY --from=builder /go/bin/databunker /databunker/bin/databunker
COPY run.sh startInDocker.sh health-check.sh /databunker/bin/
EXPOSE 3000
#
# Must first execute these commands before starting this container
# DATABUNKER_MASTERKEY=`< /dev/urandom LC_CTYPE=C tr -dc 'a-f0-9' | head -c${1:-48};`
# ROOTTOKEN=`uuidgen 2> /dev/null`
# databunker -init -masterkey ${DATABUNKER_MASTERKEY} -roottoken ${ROOTTOKEN}
#
ENV DATABUNKER_MASTERKEY=e8de0079de860a194fd7ea15e2ad82c165f0075956d2a825
ENV MMURL="https://api-joubert-us-east.eng.macrometa.io"
ENV MMFABRIC="_system"
ENV MMAPIKEY="joubert_databunker.com.databunkerDemo.VpT4zqdTT5qz4PycrDW2ItXFYGgcX8FOVJljFlEI3tMBAP7lnQBBoL3zgqRIlfuKf15116"
#HEALTHCHECK --interval=5s --timeout=3s --start-period=33s --retries=3 CMD /databunker/bin/health-check.sh
ENTRYPOINT ["/bin/sh", "/databunker/bin/startInDocker.sh"]
#CMD ["/bin/sh", "-x", "-c", "/go/bin/databunker -init"]
