
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'collection', component: () => import('pages/Collection.vue') },
      { path: 'post/:id', component: () => import('pages/Post.vue'), meta: { miniDrawer: true } },
      { path: 'compose', component: () => import('pages/Compose.vue') },
      { path: 'newAccount', component: () => import('pages/NewAccount.vue') },
      { path: 'user/:id', component: () => import('pages/UserProfile.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
