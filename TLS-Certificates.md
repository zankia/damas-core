
By default the TLS is not enabled in the `https` configuration section of `conf.json`:

```json
{
    "https" : { 
        "enable": false,
        "cert": "fullchain.pem",
        "key": "privkey.pem"
    }
}
```  
Set `enable`: `true` and specify the certificate `.pem` files to use.

### Letsencrypt Certificate
You can use certbot with the following command to generate a certificate in /etc/letsencrypt :
```shell
docker run --rm --name certbot -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot certonly -q --standalone --agree-tos -m YOUR@EMAIL.COM -d YOUR_DOMAIN_NAME
```

### Self Signed Certificate
You can create a self signed certificate
```sh
openssl req -new -x509 -days 9999 -nodes -out fullchain.pem -keyout privkey.pem
```

