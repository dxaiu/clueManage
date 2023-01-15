import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/loginOut',
    component: () => import('@/views/logout/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/userManage',
    meta: { title: '权限管理', icon: 'config', roles: ['admin'] },

    children: [
      {
        path: '/manage/userManage',
        name: 'userManage',
        component: () => import('@/views/userManage/index'),
        meta: { title: '用户管理' }
      },
      // {
      //   path: '/manage/cluedata',
      //   name: 'cluedata',
      //   component: () => import('@/views/clueDataStatistics/index'),
      //   meta: { title: '线索数据统计' }
      // },
      {
        path: '/manage/assignedLead',
        name: 'assignedLead',
        component: () => import('@/views/assignedLead/index'),
        meta: { title: '线索' }
      },
      {
        path: '/manage/unassignedLead',
        name: 'unassignedLead',
        component: () => import('@/views/unassignedLead/index'),
        meta: { title: '待分配的线索' }
      }
    ]
  },

  {
    path: '/myClues',
    component: Layout,
    children: [
      {
        path: '/myClues/list',
        name: 'myClues',
        component: () => import('@/views/myClues/index'),
        meta: { title: '我的线索', icon: 'clue', roles: ['admin', 'customer'] }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
