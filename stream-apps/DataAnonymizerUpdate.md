```
@App:name("DataAnonymizerUpdate")
@App:description("It update the existing record in the users table")
@App:qlVersion("2")


CREATE FUNCTION concatkey[javascript] RETURN STRING {
    var str1 ='https://api-gdn.paas.macrometa.io/_fabric/pii_global/_api/document/users/';
    var str2 = data[0];
    var str3 = '?keepNull=false&mergeObjects=true&ignoreRevs=true&returnOld=false&returnNew=false&silent=true'
    var response = str1 + str2 + str3;
    return response;
};

CREATE SOURCE pii_users WITH (type='database', collection='pii_users', replication.type="global", map.type='json') (emailidx string, loginidx string, phoneidx string, token string,key string );

CREATE SINK UpdateUsers WITH (type='http-call',sink.id='update-user', publisher.url='{{URL}}',method = 'PUT', headers = "'Authorization: apikey xxxx'", map.type='json', map.payload = """{"name": "{{name}}", "token": "{{token}}", "email": "{{email}}", "phone": "{{phone}}","_key":"{{_key}}"}""") (URL string, name string, token string, email string, phone string, _key string );

CREATE SOURCE  ExternalServiceResponseSink WITH (type='http-call-response', sink.id='update-user', http.status.code='404', map.type='json') (code int);


INSERT INTO UpdateUsers
SELECT 
      concatkey(token) as URL,
      loginidx      as name,
      token,
       ifThenElse(emailidx=='','',pii:fake(emailidx, "INTERNET_EMAILADDRESS", false) )  as email,
      ifThenElse(phoneidx=='','',pii:fake(phoneidx, "PHONENUMBER_CELLPHONE", false)) as phone,
      token as _key
FROM pii_users;
```