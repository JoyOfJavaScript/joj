# Key pairs used in Wallets

These private and public key pairs were generated with the same algorithm as used in the Bitcoin protocol "secp256k1" Elliptic Curve Cryptography. You can use the following commands to generate more:  

Note: OpenSSL needs to be installed

## Private key
~~~
openssl ecparam -name secp256k1 -genkey -noout -out private.pem
~~~
## Public key (from private key)
~~~
openssl ec -in private.pem -pubout -out public.pem
~~~
