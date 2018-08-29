import axios from 'axios';
import router from './router';
import { host } from '../../frontend.config.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const API_URL = IS_PRODUCTION ? '/api/' : 'http://'+host+':3000/api/';

const $axios = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

$axios.interceptors.request.use(function (config) {
  config.headers['user_id'] = localStorage.getItem('user_id');
  return config;
});

// Response Interceptor to handle and log errors
$axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

export default {

  joinLobby(name) {
    return $axios.post('/join', {name: name})
      .then((response) => {
        return response.data;
      });
  },
  restartLobby() {
    return $axios.post('/restart')
      .then((response) => {
        return response.data;
      });
  },
  nextQuestion() {
    return $axios.post('/nextQuestion')
      .then((response) => {
        return response.data;
      });
  },
  verifyAttempt(attempt) {
    return $axios.post('/verifyAttempt', {attempt: attempt})
      .then((response) => {
        return response.data;
      });
  },
  answerQuestion(answer) {
    return $axios.post('/answerQuestion', {answer: answer})
      .then((response) => {
        return response.data;
      });
  },
  allUsers() {
    return $axios.get('/allusers')
      .then((response) => {
        return response.data;
      });
  },
  allUsersWithAnswers() {
    return $axios.get('/allUsersWithAnswers')
      .then((response) => {
        return response.data;
      });
  },
  getCurrentState() {
    return $axios.get('/currentState')
      .then((response) => {
        return response.data;
      });
  },
  getCurrentQuestion() {
    return $axios.get('/currentQuestion')
      .then((response) => {
        return response.data;
      });
  },
  getCurrentListOfAnswers() {
    return $axios.get('/currentListOfAnswers')
      .then((response) => {
        return response.data;
      });
  },
  didUserAnswerQuestion() {
    return $axios.get('/didUserAnswerQuestion')
      .then((response) => {
        return response.data;
      });
  },
  secondsLeftToAnswerQuestion() {
    return $axios.get('/secondsLeftToAnswerQuestion')
      .then((response) => {
        return response.data;
      });
  },
  getShuffledListOfAnswers() {
    return $axios.get('/getShuffledListOfAnswers')
      .then((response) => {
        return response.data;
      });
  },
  getUserTurn() {
    return $axios.get('/getUserTurn')
      .then((response) => {
        return response.data;
      });
  },
};
