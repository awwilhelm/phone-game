<template lang="pug">
  div
    h1 Scoreboard
    div(v-for="user in users")
      h3 {{user.name}} 
      span {{user.score}}
    div
      button(@click="getRestart") Restart
      button(@click="nextQuestion") Continue

</template>

<script>
import $backend from '@/backend';

export default {
  mounted() {
    this.getAllUsers();
  },
  data() {
    return {
      users: {},
    };
  },
  methods: {
    getAllUsers() {
      $backend.allUsers()
        .then(responseData => {
          this.users = responseData.users;
        }).catch(error => {
          this.error = error.message
        });
    },
    getRestart() {
      $backend.restartLobby()
        .then(responseData => {
        }).catch(error => {
          this.error = error.message
        });
    },
    nextQuestion() {
      $backend.nextQuestion()
        .then(responseData => {
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
