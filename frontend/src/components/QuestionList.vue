<template lang="pug">
  div
    h1 {{user.question}}
    form(v-on:submit.prevent="verifyAttempt")
      h2 Players
      div(v-for="(user, index) in users", v-if="usedAnswers.filter(e => e.user_id === index).length === 0")
        input(type="radio" v-model="attempt.pickedUser" v-bind:value='user.name')
        | {{user.name}}
      br
      br
      h2 Answers
      div(v-for="answer in shuffledAnswers", v-if="answer !== '' && usedAnswers.filter(e => e.answer === answer).length === 0")
        input(type="radio" v-model="attempt.pickedAnswer" v-bind:value='answer')
        | {{answer}}
      button(type="submit", v-if="userTurnId === user.id") Submit
      div(v-else)
        h5 Waiting for your turn
</template>

<script>
import $backend from '@/backend';

export default {
  mounted() {
    this.getShuffledListOfAnswers();
    this.getAllUsersWithAnswers();
    this.getCurrentQuestion();
    this.getUserTurn();
    this.socket.on('UpdateListOfAnswers', (usedAnswers) => {
      this.usedAnswers = usedAnswers.listOfUsedAnswers;
    });
    this.socket.on('NewUserTurn', (userTurnId) => {
      this.userTurnId = userTurnId.userTurnId;
    });
    this.user.id = parseInt(localStorage.getItem('user_id'));
  },
  props: ['socket'],
  data() {
    return {
      shuffledAnswers: [],
      usedAnswers: [],
      users: [],
      attempt: {
        pickedUser: '',
        pickedAnswer: '',
      },
      user: {
        question: '',
        id: 0,
      },
      userTurnId: 0,
      
    };
  },
  methods: {
    getShuffledListOfAnswers() {
      $backend.getShuffledListOfAnswers()
        .then(responseData => {
          console.log(responseData);
          this.shuffledAnswers = responseData.shuffledAnswers;
          this.usedAnswers = responseData.listOfUsedAnswers;
        }).catch(error => {
          this.error = error.message
        });
    },
    getAllUsers() {
      $backend.allUsers()
        .then(responseData => {
          this.users = responseData.users;
        }).catch(error => {
          this.error = error.message
        });
    },
    getAllUsersWithAnswers() {
      $backend.allUsersWithAnswers()
        .then(responseData => {
          console.log(responseData.users);
          this.users = responseData.users;
        }).catch(error => {
          this.error = error.message
        });
    },
    getCurrentQuestion() {
      $backend.getCurrentQuestion()
        .then(responseData => {
          this.user.question = responseData.currentQuestion;
        }).catch(error => {
          this.error = error.message
        });
    },
    verifyAttempt() {
      if(this.attempt.pickedUser === '' || this.attempt.pickedAnswer === '')
        return;
      $backend.verifyAttempt(this.attempt)
        .then(responseData => {
        }).catch(error => {
          this.error = error.message
        });
    },
    getUserTurn() {
      $backend.getUserTurn()
        .then(responseData => {
          this.userTurnId = responseData.userTurnId
        }).catch(error => {
          this.error = error.message
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>