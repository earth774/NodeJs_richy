'use string';
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var Db_order = require('./controllers/Db_order');
var Db_history = require('./controllers/Db_history');
var Db_user = require('./controllers/Db_user');
var Db_insert = require('./controllers/Db_insert');
var contro = require('./controllers/contro');


var port = process.env.PORT || 3000; // is port 3000 if 3000 not use port other
//
app.use('/assets', express.static(__dirname+'/public'));
//app.set('superSecret', config.secret);
app.set('view engine','ejs'); // npm install ejs --save

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: false 
}));

app.use('/picture', express.static(__dirname +'/picture')); 

app.use('/',function (req,res,next) {  // show link to cmd run
	console.log('Request Url: '+ req.url);
	next();
});

app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');
    next();
});


var con1 = mysql.createConnection({
            host:process.env.PORT,
            user:"root",
            password:"",
            database:"project",
        });;



Db_order(app,con1);
Db_history(app,con1);
Db_user(app,con1);
Db_insert(app,con1);
contro(app,con1);

app.listen(port);