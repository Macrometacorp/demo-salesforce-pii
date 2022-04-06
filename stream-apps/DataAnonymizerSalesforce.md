```
@App:name("DataAnonymizerSalesforce")
@App:description('Stream app to listen and to store data from eu fabric to global fabric.')
@App:qlVersion('2')

CREATE FUNCTION concatname[javascript] RETURN STRING {
    var str1 =data[0];
    var str2 = data[1];
    var response = str1 + str2;
    return response;
};

CREATE SOURCE pii_users WITH (type='database', collection='pii_users', replication.type="global", map.type='json') (emailidx string, loginidx string, phoneidx string, token string,key string );

CREATE SINK Users WITH (type='http', publisher.url='https://api-gdn.paas.macrometa.io/_fabric/pii_global_sf/_api/document/users?returnNew=false&returnOld=false&silent=true&overwrite=false', headers = "'Authorization: apikey demo.pii_salesforce.Ap9yg5pmpwsN32YU3M7OuLia1ygEKwlumOjBDf1gGGa4rZb8nwVpzPUZvPxIDDaM9a5b83'", map.type='json', map.payload = """{"name": "{{name}}","firstName": "{{firstName}}","lastname": "{{lastname}}", "token": "{{token}}", "email": "{{email}}", "phone": "{{phone}}","_key":"{{_key}}"}""") (name string,firstName string,lastname string, token string,email string,  phone string,_key string);

INSERT INTO Users
SELECT 
        loginidx as name,
        pii:fake(concatname(loginidx,'fr'),'NAME_FIRSTNAME',false) as firstName,
       pii:fake(concatname(loginidx,'lr'),'NAME_LASTNAME',false) as lastname,
       token,
       pii:fake(emailidx, "INTERNET_EMAILADDRESS", false)   as email,
       pii:fake(phoneidx, "PHONENUMBER_CELLPHONE", false) as phone,
       token as _key
FROM pii_users;


```