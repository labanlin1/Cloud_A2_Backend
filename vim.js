const monitor = require('./monitor')
const auth = require('./auth')
const fetch = require('node-fetch');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var monitorDomain = 'http://10.0.1.5:10000';
var http = require("http");
const request = require('request-promise');

//CORS to allow acess to backend from frontend
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}))



const port = process.env.PORT || 8080;

router.get('/', function (req, res) {
  res.json({ message: 'VIM is running!' });
});

//get all the VMs
router.get('/vm/all', (req, res) => {
  var event = {
      ccID: req.query.ccID
    
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    }
  }

  fetch(monitorDomain + '/vm/all', options)
    .then(data => data.json())
    .then(json => {
      console.log(json)
      res.json(json);
    });
});

router.post('/createUser', (req, res) => {
  var username = req.query.username;
  var password = req.query.password;
  auth.createUser(username, password).then(function (data) {
    res.json(data);
  });
});

//create VM
router.post('/create', (req, res) => {
  var event = req.body.event;

  const options = {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    }
  }

  fetch(monitorDomain + '/create', options)
    .then(data => data.json())
    .then(json => {
      console.log(json)
      res.json(json);
    });

});

router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  auth.login(username, password).then(function (data) {
    res.json(data);
  });
});

//route to launch event
router.post('/launchEvent', (req, res) => {
  var event = req.body.event;
  const options = {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    }
  }

  fetch(monitorDomain + '/launchEvent', options)
    .then(data => data.json())
    .then(json => {
      console.log(json)
      res.json(json);
    });


});

router.get('/vm/usage', (req, res) => {
  var event = {
    ccID: req.query.ccID,
    vmID: req.query.vmID,
    startTime: req.query.startTime,
    endTime: req.query.endTime

  };

  const options = {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    }
  }

  fetch(monitorDomain + '/vm/usage', options)
    .then(data => data.json())
    .then(json => {
      console.log(json)
      res.json(json);
    });


});

router.get('/vm/totalUsage', (req, res) => {
  var event = {
    ccID: req.query.ccID,
    startTime: req.query.startTime,
    endTime: req.query.endTime
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    }
  }

  fetch(monitorDomain + '/vm/totalUsage', options)
    .then(data => data.json())
    .then(json => {
      console.log(json)
      res.json(json);
    });

});


app.use('/', router);

app.listen(port, function () {
  console.log("up and running on port " + port);
});


//listen for request on port 3000, and as a callback function have the port listened on logged
// app.listen(port, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// let Event = {
//   eventType: "Upgrade",
//   vmType: "Basic",
//   eventTime: Date.now(),
//   vmID: "-L_JZH1Vf1Ud7yXyBZDs",
//   ccID: "patrick"
// }

// let Event2 = {
//   eventType: "Start",
//   vmType: "Basic",
//   eventTime: Date.now(),
//   vmID: "-LZn3FahneHK2RFWVzVw",
//   ccID: "12312312"
// }

// monitor.event(Event)

// monitor.getVMs(Event).then(result => console.log(result))
// monitor.event(Event)

//logs user in
// auth.login("12312312", "password")
// auth.login("12312312", "dd")
// auth.login("111", "dd")
// auth.createUser("12312312", "password")
