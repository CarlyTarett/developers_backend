const express = require("express");
const cors = require("cors");
const serverlessHttp = require("serverless-http");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "developers"
});
 
// GET /developers

app.get("/developers", function(request, response) {
  // request is an object with lots of info about the request
  // response is an object which allows us to define what kind of response we want to send back

    connection.query("SELECT * FROM Developers", function(err, data){
    if(err){
        response.status(500).json({
            error: err
        })
    }
    else {
        response.status(200).json({
        developers: data
        });
    };
});

});


// POST /developers
app.post("/developers", function(request, response) {

    const newDeveloper = request.body;
  
    connection.query("INSERT INTO Developers SET ?", [newDeveloper], function(err, data){
  
      if(err){
        response.status(500).json({
            error: 
            err
                    })
    }
    else {
        newDeveloper.id = data.insertId;
        response.status(201).json(newDeveloper);
    }
  });
  
  });

// PUT /developers
app.put("/developers/:id", function(request, response) {

  const updatedDeveloper = request.body;
  const id = request.params.id;

  connection.query("UPDATE Developers SET ? WHERE developerId = ?", [updatedDeveloper, id], function(err, data){

    if(err){
      response.status(500).json({
          error: err
      })
  }
  else {
      response.status(200).json({
      developers: data
      });
  };
});

});



// DELETE /developers

app.delete("/developers/:id", function(request, response) {

    const id = request.params.id;
  
      connection.query("Delete FROM Developers WHERE developerId = ?", [id], function(err, data){
      if(err){
          response.status(500).json({
              error: err
          })
      }
      else {
          response.sendStatus(200);
      };
  });
  
  });

module.exports.app = serverlessHttp(app);