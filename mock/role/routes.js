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
  },

  {
    path: '/example',
    redirect: '/example/table',
    name: 'Example',
    component: 'layout/Layout',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: '/views/table/index',
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: '/views/tree/index',
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    children: [
      {
        path: 'index',
        name: 'Form',
        component: '/views/form/index',
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/nested',
    component: 'layout/Layout',
    redirect: '/nested/menu1/menu1-1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: '/views/nested/menu1/index', // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: '/views/nested/menu1/menu1-1',
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: '/views/nested/menu1/menu1-2',
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: '/views/nested/menu1/menu1-2/menu1-2-1',
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: '/views/nested/menu1/menu1-2/menu1-2-2',
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: '/views/nested/menu1/menu1-3',
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: '/views/nested/menu2/index',
        meta: { title: 'menu2' }
      }
    ]
  },
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

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
