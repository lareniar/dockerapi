// Para correrlo
// MYDBHOST="localhost" MYDATABASE="mydb" MYUSER="root" MYPASSWORD="" node appapi.js
const mysql = require('mysql');
const express = require('express');
var bodyParser = require('body-parser')
 
const app = express();
 
const api = '/api/v1' //la ruta de la api
const apiusers = api + '/Users' //la ruta para ver los usuarios de la api
const port = process.argv[2] || 7000 //puerta
 
console.log('MYDBHOST:   '+process.env.MYDBHOST)
console.log('MYUSER:     '+process.env.MYUSER)
console.log('MYPASSWORD: '+process.env.MYPASSWORD)
console.log('MYDATABASE: '+process.env.MYDATABASE)
 
var conn = mysql.createConnection({
  host: process.env.MYDBHOST || "db",
  user: process.env.MYUSER || "root",
  password: process.env.MYPASSWORD || "root",
  database: process.env.MYDATABASE || "laravel"
});
 
// la bd y el server
var server
 
conn.connect(err => {
  if (err)  {
    console.error(err)
    return
  }
  console.log('database '+conn.config.host+':'+conn.config.port)
  
  // Establecemos el server api
  server = app.listen(process.env.PORT || port, () => {
    console.log('webapi listening on ' + server.address().port)
  })
})
 
//CORS
app.use( (req, res, next) =>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");//"Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', "*");//'PUT, POST, GET, DELETE, OPTIONS');
  next();
})
app.use(bodyParser.json());
 
//====
app.get('/', (req, res) => {
  res.status(200).send({
    success: "true",
    status: 200,
    data: {},
    timestamp: (new Date()).toUTCString()
  })
})
 
// =========  API ===========
// SELECT ALL
app.get( apiusers, (req, res) => {
  console.log('get all')
  var sql = 'SELECT * FROM usuarios';
  conn.query(sql,  (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result)
  });
})


// SELECT ID
app.get(apiusers + '/:id', (req, res) => {
  console.log('get ' + req.params.id)
  var sql = 'SELECT Id _id, Nombre, Apellido FROM usuarios WHERE Id = ?';
  conn.query(sql, [parseInt(req.params.id)],  (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result)
  });
})

// // SELECT ALL
// app.get( apiusers, (req, res) => {
//   console.log('get all')
//   var sql = 'SELECT id _id, name, email FROM users';
//   conn.query(sql,  (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send(result)
//   });
// })

// INSERT
app.post( apiusers, (req, res) => {
  console.log('post ');
  console.log(req.body);

  var sql = 'INSERT INTO Users (Nombre, Apellido) VALUES(?,?)';
  conn.query(sql, [req.body.name, req.body.email],  (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result)
  });
})

// UPDATE
app.put( apiusers, (req, res) => {
  console.log('put ' + req.body._id)
  var sql = 'UPDATE Users SET Nombre = ?, Apellido = ? WHERE Id = ?';
  conn.query(sql, [req.body.name, req.body.email, req.body._id],  (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result)
  });
})

// DELETE 
app.delete( apiusers + '/:id', (req, res) => {
  console.log('delete ' + req.params.id)
  var sql = 'DELETE FROM Users WHERE Id = ?';
  conn.query(sql, [parseInt(req.params.id)],  (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result)
  });
})
 
// ======  TODAS LAS DEMAS RUTAS =====
// 404 Siempre al final
app.get('*', (req, res) => {
  res.status(404).send({
    success: "false",
    status: 404,
    error: "Not found",
    data: {},
    timestamp: (new Date()).toUTCString()
  })
})
