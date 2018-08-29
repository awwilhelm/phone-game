import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/Login';
import Lobby from '@/components/Lobby';
import Prompt from '@/components/Prompt';
import QuestionList from '@/components/QuestionList';
import Scoreboard from '@/components/Scoreboard';
import $backend from '@/backend';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path:'/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: HelloWorld,
    },
    {
      path: '/lobby',
      name: 'Lobby',
      component: Lobby,
    },
    {
      path: '/prompt',
      name: 'Prompt',
      component: Prompt,
    },
    {
      path: '/questionlist',
      name: 'Question List',
      component: QuestionList,
    },
    {
      path: '/scoreboard',
      name: 'Scoreboard',
      component: Scoreboard,
    },
  ],
});

router.beforeEach((to, from, next) => {
  $backend.getCurrentState()
    .then(responseData => {
      if(responseData.state === to.name || (to.name == "Login" )) {
        next();
      } else {
        next({name: responseData.state})
      }
    }).catch(error => {
      this.error = error.message
    });
})

export default router;
