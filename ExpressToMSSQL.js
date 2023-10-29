// Step-1 : Load the Driver
var mssql =require('mysql');
var exp = require('express');
var bparser = require('body-parser')    
bparserInit = bparser.urlencoded({extended:false});  
var cors = require('cors') ;            // with cors ... Data communication is availabe with security (Navigation)
var app = exp();//Initialize expressjs
app.use(cors());// Initialize
app.use(exp.json());
// host means - on which machine the Database is stored
// for MYSQL port number is - port:3306 ...  for MSSQL - 1433
mssqlconnection=mssql.createConnection({
    host:'localhost',
    database:'world',
    user:'root',
    password:'root',
    port:3306
});
function checkConnection(error){
    if(error == undefined){
        console.log("Connected to the database......");    // it will tells whether database is connected or not
     }
     else{
         console.log("error code :" + error.errno)
         console.log(error.message);
     }
}
//mssql.connect(createConnection, checkConnection);
function feedback(error){
    if(error != undefined){
        console.log(error.errno);
        console.log(error.message);
    }else
        console.log("Open the browser and visit http://localhost:8001/")
}
app.listen(8001, feedback)
//Get Request
var queryresults = undefined;
function processResults(error, results){
    queryresults=results;
    console.log(results);
}
function displayAllUsers(request, response){
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query('select * from users',processResults);
    response.send(queryresults);
}
app.get('/getAll',displayAllUsers)
//

function GetUserById(request, response){
    var userid = request.query.uid;
    // Parameterized sql, '?'- temporary placeholder, is replaced by value of userid
    mssqlconnection.query('select  * from users where userid=?',[userid],processResults);      //userid" +userid
    response.send(queryresults);
}

app.get('/getById',GetUserById)
//
function GetByEmailId(request, response){
}
app.get('getbyEmailId',GetByEmailId)
//
var statusMessage="";
function checkInsertStatus(error){
    (error == undefined)?statusMessage="<B>Insert Successful</b>":
    statusMessage="<b>Insert Failure" + error.message + "</b>";

}
function insertUser(request,response){
    userid=request.body.uid;
    password=request.body.password;
    emailid=request.body.emailid;
    console.log(userid+"\t\t"+password+"\t\t"+emailid);
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query('insert into users values ( ?, ?, ?)',

        [userid,password,emailid], checkInsertStatus);

    response.send(statusMessage);
}
app.post('/insert',bparserInit,insertUser);
//
function updateUser(request, response) {

    var userId = request.body.uid;

    var password = request.body.password;

    var emailid = request.body.emailid;

    mssqlconnection.query('UPDATE users SET password=?, emailid=? WHERE userid=?',

        [password, emailid, userId],

        function (error, results) {

            if (error == null) {

                statusMessage = "<b>Update successful</b>";

            } else {

                statusMessage = "<b>Update failure " + error.message + "</b>";

            }

            response.send(statusMessage);

        });

}

 

app.put('/update', bparserInit, updateUser);

 

//

var statusMessage="";

function checkDeleteStatus(error){

    (error == undefined)?statusMessage="<B>Delete Successful</b>":

    statusMessage="<b>Delete Failure" + error.message + "</b>";

}

function deleteUser(request, response){

    userid=request.query.uid;

    console.log (userid);

    mssqlconnection.connect(checkConnection);

    mssqlconnection.query(

        'DELETE FROM users WHERE userid = ?',

        [userid], checkDeleteStatus);

        response.send(statusMessage);

}
app.delete('/delete',deleteUser)

 