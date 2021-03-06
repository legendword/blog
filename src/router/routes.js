
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'collections', component: () => import('pages/Collections.vue') },
      { path: 'post/:id', component: () => import('pages/Post.vue'), meta: { hideDrawer: true, customBarTitle: true } },
      { path: 'compose', component: () => import('pages/Compose.vue'), meta: { hideDrawer: true, customBarTitle: true } },
      { path: 'newAccount', component: () => import('pages/NewAccount.vue') },
      { path: 'me', component: () => import('pages/Me.vue') },
      { path: 'user/:id', component: () => import('pages/UserProfile.vue'), meta: { customBarTitle: true } },
      { path: 'author/:id', component: () => import('pages/AuthorProfile.vue'), meta: { customBarTitle: true } },
      { path: 'search', component: () => import('pages/Search.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'following', component: () => import('pages/Following.vue') },
      { path: 'category/:name', component: () => import('pages/Category.vue') },
      { path: 'tag/:name', component: () => import('pages/Tag.vue') }
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
