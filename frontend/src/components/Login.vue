<template lang="pug">
  div(class="container")
    div(class="login")
      form(class="login-container" v-on:submit.prevent="submit")
        div(class="login-title") Name:
        input(class="login-name" v-model="user.name")
        button(class="login-submit" type="submit") Submit
</template>

<script>
import $backend from '@/backend';
import router from '@/router';

export default {
  data() {
    return {
      user: {
        name: "",
      }
    };
  },
  mounted() {
    localStorage.setItem('user_id', '');
  },
  methods: {
    submit() {
      if(this.user.name === "") {
        return;
      }
      $backend.joinLobby(this.user.name)
        .then(responseData => {
          localStorage.setItem('user_id', responseData.user_id);
          router.push('lobby');

        }).catch(error => {
          this.error = error.message;
        });
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    
    .login{
      display: flex;
      justify-content: center;
      width: 250px;
      border: 1px solid black;
      padding: 15px;
      border-radius: 15px;

      &-container {
        display: flex;
        flex-direction: column;
        width: 200px;
      }
      &-title {
        font-size: 14pt;
        margin: 5px;
      }
      &-name {
        border: 1px solid black;
        border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
        margin: 5px;
        border-radius: 10px;
        padding: 5px;
      }
      &-submit {
        margin: 5px;
      }
      &-name:focus {
        outline: none;
        box-shadow: 0px 0px 6px rgb(59, 153, 252);
      }
    }
  }
</style>
