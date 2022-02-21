```
@App:name("DataAnonymizer")
@App:description('Stream app to listen and to store data from eu fabric to global fabric.')
@App:qlVersion('2')

CREATE SOURCE pii_users WITH (type='database', collection='pii_users', replication.type="global", map.type='json') (emailidx string, loginidx string, phoneidx string, token string,key string );

CREATE SINK Users WITH (type='http', publisher.url='https://api-gdn.paas.macrometa.io/_fabric/pii_global/_api/document/users?returnNew=false&returnOld=false&silent=true&overwrite=false', headers = "'Authorization: apikey xxxx'", map.type='json', map.payload = """{"name": "{{name}}", "token": "{{token}}", "email": "{{email}}", "phone": "{{phone}}","_key":"{{_key}}"}""") (name string,token string,email string,  phone string,_key string);

INSERT INTO Users
SELECT loginidx      as name,
       token,
       pii:fake(emailidx, "INTERNET_EMAILADDRESS", false)   as email,
       pii:fake(phoneidx, "PHONENUMBER_CELLPHONE", false) as phone,
       token as _key
FROM pii_users;

```