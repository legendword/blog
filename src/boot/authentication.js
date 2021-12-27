import { LocalStorage } from 'quasar'
import api from 'src/api'
import logger from 'src/logger'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ app, router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    const hasToken = LocalStorage.has('identifier') && LocalStorage.has('token')
    const hasUserInfo = store.state.isLoggedIn;
    if (hasToken) {
      let alive = (hasUserInfo ? api.get('/alive').then(res => {
        let r = res.data
        logger(r)
        if (r.success) {
          if (!r.isLoggedIn) return false;
          else return true;
        }
        return false;
      }) : Promise.resolve(false));
      alive.then(isLoggedIn => {
        if (!isLoggedIn) {
          const identifier = LocalStorage.getItem('identifier')
          const token = LocalStorage.getItem('token')
          return api.post('/user/tokenSignIn', {
            identifier: identifier,
            token: token
          }).then(res => {
            let r = res.data
            logger('signInWithToken', r)
            if (r.success) {
              logger('signInWithToken Success')
              if (r.jwt) {
                store.commit('setAuthorization', 'Bearer ' + r.jwt)
              }
              LocalStorage.set('token', r.token)
              store.commit('userLogIn', r.user)
              if (r.user.settings.locale != app.i18n.locale) { // #test
                app.i18n.locale = r.user.settings.locale
              }
            }
            else {
              logger('signInWithToken Failed')
              LocalStorage.remove('identifier')
              LocalStorage.remove('token')
              store.commit('setAuthorization', null)
            }
          })
        }
        return Promise.resolve()
      }).finally(() => {
        next()
      })
    }
    else {
      if (hasUserInfo) {
        api.get('/alive')
      }
      next()
    }
  })
}
