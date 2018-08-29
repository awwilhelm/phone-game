<template lang="pug">
  div
    form(v-on:submit.prevent="answerQuestion", v-if="!user.questionAnswered")
      | Print message
      | {{user.question}}
      input(v-model="user.answer")
      button(type="submit") Submit
    div(v-else)
      h5 waiting for other players.
    | {{gameLogic.secondsLeft}}
  
</template>

<script>
import $backend from '@/backend';
import router from '@/router'

export default {
  name: 'HelloWorld',
  mounted() {
    this.didUserAnswerQuestion();
    this.getCurrentQuestion();
    this.secondsLeftToAnswerQuestion();
  },
  data() {
    return {
      user: {
        question: '',
        answer: '',
        questionAnswered: false,
      },
      gameLogic: {
        secondsLeft: 0,
      },
      users: {},
      router: router,
    };
  },
  methods: {
    answerQuestion() {
      $backend.answerQuestion(this.user.answer)
        .then(responseData => {
          this.user.questionAnswered = responseData;
        }).catch(error => {
          this.error = error.message
        });
    },
    didUserAnswerQuestion() {
      $backend.didUserAnswerQuestion()
        .then(responseData => {
          this.user.questionAnswered = responseData.answered;
          console.log(this.user.questionAnswered);
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
    secondsLeftToAnswerQuestion() {
      $backend.secondsLeftToAnswerQuestion()
        .then(responseData => {
          this.gameLogic.secondsLeft = responseData - 2;
          this.countDown();
        }).catch(error => {
          this.error = error.message
        });
    },
    countDown() {
      let t = this;
      setTimeout(function(){
        t.gameLogic.secondsLeft--;
        if(t.gameLogic.secondsLeft > 0) {
          t.countDown();
        }
      }, 1000);
    },
    clearData() {
      this.user = {
        question: '',
        answer: '',
        questionAnswered: false,
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
