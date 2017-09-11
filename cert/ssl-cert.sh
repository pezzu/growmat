export OPENSSL_CONF=D:\tools\openssl-0.9.8h-1\share\openssl.cnf

openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem