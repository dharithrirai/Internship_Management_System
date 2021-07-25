const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const { Router } = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", __dirname);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/main.html"));
});
app.get("/index", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/home.html"));
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/login1", function (req, res) {
  res.sendFile(path.join(__dirname + "/login1.html"));
});
app.get("/apply", function (req, res) {
  res.sendFile(path.join(__dirname + "/apply.html"));
});
app.get("/apply1", function (req, res) {
  res.sendFile(path.join(__dirname + "/apply1.html"));
});
app.get("/contactus", function (req, res) {
  res.sendFile(path.join(__dirname + "/contactus.html"));
});

//registration start
app.post("/save", (req, res) => {
  console.log("inside saved")
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;

  var data = { name: name, password: password, email: email };
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dharithri_db",
  });
  connection.connect();
  console.log("db connected");
  connection.query(
    "INSERT INTO admin SET ?",
    data,
    function (error, result, fields) {
      if (error) throw error;
      console.log("inserted");
    }
  );
  connection.end();
  res.render("login");
});
//registration end


// login page begin
// login authentication start
app.post("/login", (req, res) => {
  const email = req.body.email;
  const fpassword = req.body.password;

  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dharithri_db",
  });
  connection.connect();
  console.log("db connected");

  connection.query(
    "SELECT email, password FROM admin where email=?",
    email,
    function (error, result) {
      if (error) {
        throw error;
      } else {
        if (result.length == 0) {
          console.log("email not available");
          res.render( "login");
        } else if (result[0].password == fpassword) {
          console.log("login success");
          res.sendFile(path.join(__dirname + "/home.html"));
        } else {
          console.log("invaild user and password");
          res.render("login",{error:"Password not match"});
        }
      }
    }
  );
  connection.end();
});
// login authentication end
//end login page

//admin page
app.get("/admin", function (req, res) {
  //1.connectdb
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "icadmin",
  });
  connection.connect();
  console.log("connected to database")
  //2 fetch the data
  connection.query("SELECT * FROM cregister", function (err, result) {
    if (err) throw err
    res.render("admin", { bdata: result })
  });
  connection.end()
})
//end admin page
//delete start
app.get("/users/delete/(:id)", function (req, res) {
  var did = req.params.id; // id read from the front end

  var mysql = require("mysql"); //connect to database
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "icadmin",
  });
  connection.connect();
  var sql = "DELETE FROM cregister WHERE id=?";
  connection.query(sql, did, function (err, result) {
    console.log("deleted record");
  });
  connection.end();
  res.redirect(req.get("referer"));
});
//delete end

//accept
app.get("/users/edit/(:id)/(:s)", function (req, res) {
  var id = req.params.id; // get the id from FE
  var sel = req.params.s;

  if (sel == 0) {
    sel = 1;
  } else {
    sel = 0;
  }
  // connect to db
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "icadmin",
  });
  connection.connect();
  //aaccept end
  // query to accept or reject
  let udata = [sel, id];
  connection.query(
    "UPDATE cregister SET selected=? WHERE id=?",
    udata,
    function (err, res) {
      if (err) throw err;
      console.log("updated");
    }
  );
  connection.end();
  res.redirect(req.get("referer"));
});
//end query accept/reject

//apply now
app.post("/saveas", (req, res) => {
  console.log("Data saved")
  const name = req.body.name;
  const date=req.body.dob;
  const email = req.body.email;
  const college=req.body.college;
  const location=req.body.location;
  const qualification=req.body.qualification;
  const type=req.body.type;
  const role=req.body.role;
  const resume=req.body.resume;
  var data = { name: name,dob:date,email:email,college:college,location:location,qualification:qualification,type:type,role:role,resume:resume };
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "apply_now",
  });
  connection.connect();
  console.log("db connected");
  connection.query(
    "INSERT INTO applicant SET ?",
    data,
    function (error, result, fields) {
      if (error) throw error;
      console.log("inserted");
    }
  );
  connection.end();
  res.sendFile(path.join(__dirname + "/successfull.html"));
});
//end apply1

//contact us
app.post("/feed", (req, res) => {
  console.log("Data saved")
  const feedback = req.body.feedback;
  const name = req.body.name;
  const email = req.body.email;
  var data = { feedback:feedback,name:name,email:email};
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "feedback",
  });
  connection.connect();
  console.log("db connected");
  connection.query(
    "INSERT INTO feed SET ?",
    data,
    function (error, result, fields) {
      if (error) throw error;
      console.log("inserted");
    }
  );
  connection.end();
  res.sendFile(path.join(__dirname + "/contactus.html"));
});

//status page
app.get("/status", function (req, res) {
  //1.connectdb
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "icadmin",
  });
  connection.connect();
  console.log("connected to database")
  //2 fetch the data
  connection.query("SELECT * FROM cregister", function (err, result) {
    if (err) throw err
    res.render("status", { bdata: result })
  });
  connection.end()
})
//end status page
//accept
app.get("/users/edit/(:id)/(:s)", function (req, res) {
  var id = req.params.id; // get the id from FE
  var sel = req.params.s;

  if (sel == 0) {
    sel = 1;
  } else {
    sel = 0;
  }
  // connect to db
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "icadmin",
  });
  connection.connect();
  //aaccept end
  // query to accept or reject
  let udata = [sel, id];
  connection.query(
    "UPDATE cregister SET selected=? WHERE id=?",
    udata,
    function (err, res) {
      if (err) throw err;
      console.log("updated");
    }
  );
  connection.end();
  res.redirect(req.get("referer"));
});
//end query accept/reject

//end contact us
app.listen(3004);
console.log("server started at 3004");

