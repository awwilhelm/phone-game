<template lang="pug">
  div
    | Game

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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
