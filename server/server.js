var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');

var user = require('./routes/user.js');
var intern = require('./routes/intern.js');
var department = require('./routes/department.js');

var port = process.env.PORT || config.serverport;
mongoose.connect(config.database, function (err) {
  if (err) {
    console.log('Error connecting database, please check if MongoDB is running.');
  } else {
    console.log('Connected to database ✔️');
  }
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('body-parser').json({
  type: '*/*'
}));

// use morgan to log requests to the console
app.use(morgan('dev'));

// Enable CORS from client-side
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// basic routes

app.get('/', function (req, res) {
  res.send('Expense Watch API is running at http://localhost:' + port + '/api');
});

app.post('/register', user.signup); // Register user

app.post('/intern', intern.saveintern); // adds & update expense of the user

app.get('/departments', department.getAllDepartments); // Get all department

app.get('/departments-form', department.getDepartmentsForForm); // Get all department

// express router
var apiRoutes = express.Router();

app.use('/api', apiRoutes);

apiRoutes.post('/login', user.login);

apiRoutes.use(user.authenticate); // route middleware to authenticate and check token

// authenticated routes
apiRoutes.get('/', function (req, res) {
  res.status(201).json({
    message: 'Bu Staj Takip Sistemi Web Servisidir. Bu sayfadan işlem yapamazsınız!'
  });
});

// User Request

apiRoutes.get('/user/:opt', user.getuserDetails); // API returns user details 

apiRoutes.put('/user/:id', user.updateUser); // API updates user details

apiRoutes.post('/user/admin', user.registerAdmin); // Register new admin or update for SuperAdmin

apiRoutes.put('/password/:id', user.updatePassword); // API updates user password

apiRoutes.delete('/user/:id', user.deleteUser); // This delete user, for SuperAdmin

// Intern Request

apiRoutes.delete('/intern/:id', intern.delintern); //API removes the expense details of given expense id

apiRoutes.get('/intern/:id', intern.getintern); // API returns expense details of given expense id

apiRoutes.get('/getintern_admin/:verified', intern.getintern_admin); // API returns expense details of given expense id

apiRoutes.put('/confirmintern/:id', intern.confirmintern); // API returns expense details of given expense id

apiRoutes.get('/interns/:option', intern.getinterns); // API returns all intern by time or any

// Department Request

apiRoutes.post('/department', department.saveDepartment); // Save or update dapartment

apiRoutes.get('/department', department.getDepartmentDate); // Get department date for admin

apiRoutes.put('/department/:id', department.saveDapartmentDate); // Save new department date

apiRoutes.get('/getalladmin/:dep', department.getAllAdminUser); // Get all Admin user by null department

apiRoutes.delete('/deletedepartment/:id', department.deleteDepartment); // Delete department by id

// kick off the server 
app.listen(port);
console.log('Expense Watch app is listening at http://localhost:' + port);
