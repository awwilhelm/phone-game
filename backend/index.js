const express = require('express');
const passport = require('passport');
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
var server = require('http').createServer(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });


const hostname = '127.0.0.1';
const port = 3000;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,application/json,user_id');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
let usersDefault = [{name: 'Alex', score: 0}, {name: 'Bill', score: 0}, {name: 'Cat', score: 0}];
let listOfAnswersDefault = [{user_id: 0, answer:'Apple'}, {user_id: 1, answer:'Bogo'}, {user_id: 2, answer:'Cape'}];

let users = usersDefault.slice();
let questions = ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Question 6'];
let questionTimeout;
let gameStatus = false;
let state = 'Lobby';
let currentQuestion = '';
let listOfAnswers = listOfAnswersDefault.slice();
let listOfRemainingAnswers = [];
let listOfUsedAnswers = [];
let shuffledListOfAnswers = [];
let userTurn = 0;
let questionStartTimer = 0;
let questionTimerLengthInSeconds = 12;

app.get('/api/allUsers', function(req, res) {
  res.json({
    users: users
  });
});

app.get('/api/allUsersWithAnswers', function(req, res) {  
  let userWithAnswers = [];
  for(let i = 0; i < users.length; i++) {
    for(let j = 0; j < listOfAnswers.length; j++) {
      if(i === listOfAnswers[j].user_id && listOfAnswers[j].answer !== '') {
        userWithAnswers.push(users[i]);
      }
    }
  }
  res.json({
    users: userWithAnswers
  });
});

app.get('/api/currentState', function(req, res) {
  res.json({
    state: state,
  });
});

app.get('/api/currentQuestion', function(req, res) {
  res.json({
    currentQuestion: currentQuestion,
  });
});

app.get('/api/didUserAnswerQuestion', function(req, res) {
  let hasBeenAnswered = false;
  listOfAnswers.map(answerTouple => {
    if(answerTouple.user_id == req.headers.user_id) {
      hasBeenAnswered = true;
    }
  })
  res.json({
    answered: hasBeenAnswered,
  });
});

app.get('/api/getShuffledListOfAnswers', function(req, res) {
  res.json({
    shuffledAnswers: shuffledListOfAnswers,
    listOfUsedAnswers: listOfUsedAnswers,
  });
});

app.get('/api/currentListOfAnswers', function(req, res) {
  res.json(listOfAnswers);
});

app.get('/api/getUserTurn', function(req, res) {
  res.json({
    userTurnId: userTurn,
  });
});

app.get('/api/secondsLeftToAnswerQuestion', function(req, res) {
  res.json(questionStartTimer + questionTimerLengthInSeconds - Math.floor((new Date()).getTime()/1000));
});

app.post('/api/nextQuestion', function(req, res) {
  state = 'Prompt';
  listOfAnswers = listOfAnswersDefault.slice();
  listOfUsedAnswers = [];
  listOfRemainingAnswers = [];
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  questionStartTimer = Math.floor((new Date()).getTime()/1000);
  questionTimeout = setTimeout(answersFinished, questionTimerLengthInSeconds * 1000);
  io.emit('NextQuestion', {
    question: currentQuestion
  });
  res.json({
  });
});

app.post('/api/join', function(req, res) {
  state = 'Lobby';
  users.push({name: req.body.name, score: 0});
  io.emit("UserJoinedLobby", {
    users: users
  });
  res.json({
    user_id: users.length  -1
  });
});

app.post('/api/restart', function(req, res) {
  state = 'Login';
  users = usersDefault.slice();
  listOfAnswers = listOfAnswersDefault.slice();
  clearTimeout(questionTimeout);
  io.emit('RestartLobby', {});
  res.json({
  });
});

app.post('/api/answerQuestion', function(req, res) {
  listOfAnswers.push({user_id: parseInt(req.headers.user_id), answer: req.body.answer});
  if(listOfAnswers.length === users.length) {
    clearTimeout(questionTimeout);
    answersFinished();
  }
  res.json(true);
});

app.post('/api/verifyAttempt', function(req, res) {
  if(parseInt(req.headers.user_id) !== userTurn) {
    console.log('not correct credentials');
    return;
  }
  
  let { pickedUser, pickedAnswer } = req.body.attempt;
  let pickedUserId = users.map((e) => { return e.name }).indexOf(pickedUser);
  let wasCorrectAnswer = false;
  listOfRemainingAnswers.map((x, i) => {
    if(pickedUserId === x.user_id && pickedAnswer === x.answer) {
      users[req.headers.user_id].score += 1;
      wasCorrectAnswer = true;
      listOfUsedAnswers.push(x);
      listOfRemainingAnswers.splice(i, 1);
      io.emit('UpdateListOfAnswers', {
        listOfUsedAnswers: listOfUsedAnswers,
      });
      if(listOfRemainingAnswers.length === 0) {
        state = 'Scoreboard';
        io.emit('NextScoreboard');
      }
    }
  }, this)
  
  if(!wasCorrectAnswer) {
    userTurn += 1;
    if(userTurn >= users.length) {
      userTurn = 0;
    }
    io.emit('NewUserTurn', {
      userTurnId: userTurn,
    });
  }

  res.json(wasCorrectAnswer);
});

io.on('connection', function(socket){
  console.log(socket.id);
  socket.on('SEND_MESSAGE', function(data) {
      io.emit('MESSAGE', data)
  });
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function answersFinished() {
  io.emit('QuestionTimeUp',{});
  state = 'Question List';
  listOfRemainingAnswers = listOfAnswers.slice();
  shuffledListOfAnswers = shuffle(listOfAnswers.map((x)=> {return x.answer}));
}



server.listen(port, () => console.log('Example app listening on port 3000!'))