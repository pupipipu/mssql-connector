/**
  node js module to connect to mssql server and call a stored procedure
**/

var sql = require('mssql');

// Create connection to database
var config = {
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
      encrypt:true
  }
}

/**params --> array
format:
[{
  name:'name',
  value:'value'
},...]
**/
var mssql_helper={
  call_stored_procedure:function(spName, params){
      return new Promise((resolve,reject) => {

        //create a new connection every request
        var pool1 = new sql.ConnectionPool(config, err => {
            if(err){
              reject(err);
            }

            var request = pool1.request();

            if(params && params.length>0){
              params.forEach(function(a){
                request.input(a.name, a.value);
              })
            }

            request.execute(spName,function(err,recordsets,returnValue){
              if(err){
                reject(err);
                sql.close();
              }
              else{
               resolve(recordsets);
               sql.close();
              }
            });
        });

        pool1.on('error', err => {
            reject(err);
        })

     });
   }
};


module.exports = mssql_helper;
