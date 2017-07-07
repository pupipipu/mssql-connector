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
var callStoredProcedure = function(spName, params, success, error){
    try{

      sql.connect(config)
     // Successfull connection
     .then(function () {

       // Create request instance, passing in connection instance
       var request = new sql.Request();

       if(params && params.length>0){
         params.forEach(function(a){
           request.input(a.name, a.value);
         })
       }

       request.execute(spName,function(err,recordsets,returnValue){
         if(err){
           typeof error === 'function' ? error(err) : console.log(err);
         }
         else{
           typeof success === 'function' ? success(recordsets,returnValue) : null;
         }
       });
     })
     // Handle connection errors
     .catch(function (err) {
       typeof error === 'function' ? error(err) : console.log(err);
       conn.close();
     });

    }
    catch(ex){
      typeof error === 'function' ? error(ex) : null;
    }
}


module.exports.callStoredProcedure = callStoredProcedure;
