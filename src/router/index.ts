import { createRouter, createWebHistory } from 'vue-router'
import BBSRegisterView from '../views/bbs/BBSRegisterView.vue'
import BBSListView from '../views/bbs/BBSListView.vue'
import BBSPostView from '../views/bbs/BBSPostView.vue'
import MemberRegisterView from '../views/members/MemberRegisterView.vue'
import MemberListView from '../views/members/MemberListView.vue'
import Main from '../views/main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/bbs/register',
      name: 'register-bbs',
      component: BBSRegisterView
    },
    {
      path: '/bbs/modify/:id',
      name: 'modify-bbs',
      component: BBSRegisterView
    },
    {
      path: '/bbs/list',
      name: 'list-bbs',
      component: BBSListView
    },
    {
      path: '/bbs/view/:id',
      name: 'view-bbs',
      component: BBSPostView
    },
    {
      path: '/member/register',
      name: 'register-member',
      component: MemberRegisterView
    },
    {
      path: '/member/list',
      name: 'list-member',
      component: MemberListView
    },
  ]
})

export default router
