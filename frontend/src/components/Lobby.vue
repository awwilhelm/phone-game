<template lang="pug">
  div(class="container")
    div(class="user-item" v-for="item in users")
      div(class="user-name") {{item.name}}
    button(@click="nextQuestion") Start
</template>

<script>
import $backend from '@/backend';

export default {
  name: 'HelloWorld',
  props: ['socket'],
  mounted() {
    $backend.allUsers()
        .then(responseData => {
          this.users = responseData.users;
        }).catch(error => {
          this.error = error.message
        });
    this.socket.on('UserJoinedLobby', (users) => {
      this.users = users.users;
    });
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      users: {},
    };
  },
  methods: {
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
<style lang="scss" scoped>
@mixin quantity-query( $number ) {
  $nth: '';
  
  @if $number % 2 == 0 {
    $nth: '#{$number}';
  } @else {
    $nth: '#{$number}';
  }
  
  &:nth-child(#{$nth}) div {
    &,
    & ~ * {
      @content;
      width: #{$nth}px;
      color: blue;
    }
  }
}

.container {
  .user {
    &-item {
      @include quantity-query(2) {
      }

    }
    &-name {

    }
  }
}
</style>
