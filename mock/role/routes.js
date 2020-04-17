// Just a mock data

export const constantRoutes = [
  {
    path: '/login',
    component: '/views/login/index',
    hidden: true
  },

  {
    path: '/404',
    component: '/views/404',
    hidden: true
  },

  {
    path: '/',
    redirect: '/dashboard',
    component: 'layout/Layout',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: '/views/dashboard/index',
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/account',
    children: [
      {
        path: 'index',
        name: 'account',
        component: '/views/account/index',
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/inventory',
    children: [
      {
        path: 'index',
        name: 'inventory',
        component: '/views/inventory/index',
        meta: { title: '库存管理', icon: 'table' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: '/views/inventory/edit',
        name: 'editOrder',
        meta: { title: '修改订单', noCache: true, activeMenu: '/inventory/edit' },
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
