<template>
  <div id="app">
    <router-view
      :socket="socket">
    </router-view>
    <button @click="restart"> Restart </button>
  </div>
</template>

<script>

import io from 'socket.io-client';
import router from './router';
import $backend from '@/backend';
import { host } from '../../frontend.config.js';

export default {
  name: 'App',
  data() {
    return {
      socket: io(host+':3000')
    }
  },
  methods: {
    restart() {
      console.log('restart');
      $backend.restartLobby()
        .then(responseData => {
        }).catch(error => {
          this.error = error.message
        });
    }
  },
  mounted() {
    this.socket.on('NextQuestion', (question) => {
      router.push({name: 'Prompt'});
    });
    this.socket.on('QuestionTimeUp', () => {
      router.push({name: 'Question List'});
    });
    this.socket.on('NextScoreboard', () => {
      router.push({name: 'Scoreboard'});
    });
    this.socket.on('RestartLobby', () => {
      router.push({name: 'Login'});
    });
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
