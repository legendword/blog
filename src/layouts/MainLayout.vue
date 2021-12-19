<template>
  <q-layout view="hHh LpR fFf">

    <q-header reveal elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn @click="toggleDrawer" flat round dense icon="menu" class="q-mr-sm" />
        <q-btn @click="routerGoBack" v-if="canGoBack" flat round dense icon="chevron_left" class="q-mr-sm" />
        <q-toolbar-title @click="scrollBackTop">
          {{ barTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer content-class="bg-shade-light" show-if-above :behavior="hideDrawerMode ? 'mobile' : 'default'" v-model="leftDrawer" :width="200" side="left" :mini="miniDrawer" @mouseover="drawerMouseOver" @mouseout="drawerMouseOut">
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item v-for="item in menuItems" :key="item.link" clickable v-ripple :to="item.link" :exact="item.exact ? true : false">
            <q-item-section avatar>
              <q-icon :name="item.icon" class="margin-auto" />
            </q-item-section>

            <q-item-section>
              {{ $t(item.name) }}
            </q-item-section>
            
            <q-item-section side v-if="item.badge && menuBadges[item.badge] != 0">
              <q-badge>{{ menuBadges[item.badge] }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="absolute-bottom userDrawer q-pb-sm">
        <q-item clickable v-ripple v-if="isLoggedIn && user.isAuthor == 1" to="/compose" exact>
          <q-item-section avatar>
            <q-icon name="create" class="margin-auto" />
          </q-item-section>
          <q-item-section>
            Compose
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">{{ isLoggedIn ? user.username[0]:'' }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" class="text-weight-medium" v-if="isLoggedIn">{{ user.username }}</q-item-label>
            <q-item-label lines="1" v-else>{{ $t('layoutDrawer.notSignedIn') }}</q-item-label>
          </q-item-section>
          <q-menu fit anchor="top middle" self="bottom middle" content-class="bg-primary-light text-primary-light text-weight-medium">
            <q-list style="min-width: 100px" v-show="isLoggedIn">
              <q-item clickable v-close-popup to="/settings" exact>
                <q-item-section>{{ $t('layoutDrawer.settings') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="signOut">
                <q-item-section>{{ $t('layoutDrawer.signOut') }}</q-item-section>
              </q-item>
            </q-list>
            <q-list style="min-width: 100px" v-show="!isLoggedIn">
              <q-item clickable v-close-popup @click="signIn">
                <q-item-section>{{ $t('layoutDrawer.signIn') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <!--
        <div v-if="isLoggedIn" class="drawerUserInfo">
          <div key="username" class="text-weight-medium text-center">{{ user.username }}</div>
          <div key="useraction" class="absolute-bottom q-mb-sm text-center"><q-btn flat color="primary" label="Sign Out" @click="signOut" /></div>
        </div>
        <div v-else class="drawerUserInfo">
          <div class="text-weight-medium text-center">Not Signed In</div>
          <div class="absolute-bottom q-mb-sm text-center"><q-btn flat color="primary" label="Sign In" @click="signIn" /></div>
        </div>
        -->
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <log-in :open="logInDialog" @closed="logInDialog = false"></log-in>

  </q-layout>
</template>

<script>
import SearchBar from 'src/components/SearchBar.vue'
import { mapState } from 'vuex'
import api from '../api'
import { apiError } from '../apiError'
import LogIn from '../components/LogIn'
import mainMenuItems from '../mainMenu'
export default {
  name: 'MainLayout',
  components: {
    LogIn,
    SearchBar
  },
  data () {
    return {
      leftDrawer: false,
      miniDrawer: false,
      tab: 'tab1',
      logInDialog: false,
      menuItems: mainMenuItems,
      menuLinks: [],
      menuBadges: {
        following: 0
      }
    }
  },
  computed: {
    barTitle() {
      return this.$route.meta.customBarTitle ? this.$store.state.barTitle : 'Legendword Blog'
    },
    canGoBack() {
      return !this.menuLinks.includes(this.$route.path)
    },
    hideDrawerMode() {
      return this.$route.meta.hideDrawer ? true : false
    },
    ...mapState(['user','isLoggedIn','miniDrawerMode'])
  },
  methods: {
    scrollBackTop() {
      window.scrollTo({top:0,left:0,behavior:'smooth'})
    },
    signIn() {
      this.logInDialog = true
    },
    signOut() {
      let params = {}
      if (this.$q.localStorage.has('identifier') && this.$q.localStorage.has('token')) {
        params = {
          token: this.$q.localStorage.getItem('token'),
          identifier: this.$q.localStorage.getItem('identifier')
        }
      }
      api.post('/user/signOut', params).then(res => {
        let r = res.data
        if (r.success) {
          this.$q.notify({
            color: 'primary',
            message: this.$t('logIn.signOutSuccessMsg'),
            position: 'top',
            timeout: 2000
          })
          delete api.instance.defaults.headers.common['Authorization']
          this.$store.commit('userLogOut')
        }
        else {
          this.$q.notify({
            color: 'negative',
            message: r.msg,
            position: 'top',
            timeout: 2000
          })
        }
        delete api.instance.defaults.headers.common['Authorization']
        this.$q.localStorage.remove('identifier')
        this.$q.localStorage.remove('token')
      })
    },
    routerGoBack() {
      this.$router.go(-1)
    },
    drawerMouseOver() {
      this.miniDrawer = false
    },
    drawerMouseOut() {
      this.miniDrawer = this.miniDrawerMode
    },
    toggleDrawer() {
      this.leftDrawer = !this.leftDrawer
    },
    callAlive() {
      api.get('/alive').then(res => {
        let r = res.data
        console.log(r)
        if (r.success) {
          if (!r.isLoggedIn) {
            //attempt token login if token is stored
            if (this.$q.localStorage.has('identifier') && this.$q.localStorage.has('token')) {
              let identifier = this.$q.localStorage.getItem('identifier')
              let token = this.$q.localStorage.getItem('token')
              api.post('/user/tokenSignIn', {
                identifier,
                token
              }).then(res => {
                let r = res.data
                console.log('signInWithToken', r)
                if (r.failed) {
                  console.log('signInWithToken Failed')
                  this.$q.localStorage.remove('identifier')
                  this.$q.localStorage.remove('token')
                  delete api.instance.defaults.headers.common['Authorization']
                  if (this.isLoggedIn) this.$store.commit('userLogOut')
                }
                else if (r.success) {
                  console.log('signInWithToken Success')
                  if (r.jwt) {
                    api.instance.defaults.headers.common['Authorization'] = 'Bearer ' + r.jwt
                  }
                  this.$q.localStorage.set('token', r.token)
                  this.$store.commit('userLogIn', r.user)
                }
                else {
                  console.error(r.msg)
                  delete api.instance.defaults.headers.common['Authorization']
                  if (this.isLoggedIn) this.$store.commit('userLogOut')
                }
              })
            }
            else {
              delete api.instance.defaults.headers.common['Authorization']
              if (this.isLoggedIn) this.$store.commit('userLogOut')
            }
          }
        }
      })
    },
    setData(r) {
      console.log('userinfo', r)
      if (r.isLoggedIn == true) {
        this.$store.commit('userLogIn', r.user)
        if (r.user.settings.locale != this.$i18n.locale) {
          this.$root.$i18n.locale = r.user.settings.locale
        }
      }
      this.callAlive()
    }
  },
  watch: {
    miniDrawerMode: 'drawerMouseOut'
  },
  created() {
    if (window.history && window.history.length) {
      this.$store.commit('setHistoryLength', window.history.length)
    }
    this.menuLinks = mainMenuItems.map(v => v.link)
    api.get('/badges').then(res => {
      let r = res.data
      if (r.success) {
        this.menuBadges = r.badges
        //clear badge of current path
        let itm = this.menuItems.find(v => v.link == this.$route.path)
        if (itm && itm.badge) {
          this.menuBadges[itm.badge] = 0
        }
      }
    })
  },
  beforeRouteEnter (to, from, next) {
    api.get('/user/info', {
      detailed: true
    }).catch(err => {
      // apiError()
      next()
    }).then(res => {
      next(vm => vm.setData(res.data))
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.callAlive()
    let itm = this.menuItems.find(v => v.link == to.path)
    if (itm && itm.badge) {
      this.menuBadges[itm.badge] = 0
    }
    next()
  }
}
</script>

<style scoped>
.drawerUserInfo {
  opacity: 1;
  transition: opacity 300ms;
}
.q-drawer--mini .drawerUserInfo {
  display: none;
  opacity: 0;
}
/*
.menu-list .q-item {
  border-radius: 0 32px 32px 0;
} */
</style>