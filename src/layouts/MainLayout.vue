<template>
  <q-layout view="hHh LpR fFf">

    <q-header reveal elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn @click="toggleDrawer" flat round dense icon="menu" class="q-mr-sm" />
        <q-btn @click="routerGoBack" v-if="canGoBack" flat round dense icon="chevron_left" class="q-mr-sm" />
        <q-toolbar-title>
          {{ barTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer content-class="bg-shade-light" show-if-above :behavior="hideDrawerMode ? 'mobile' : 'default'" v-model="leftDrawer" :width="200" side="left" :mini="miniDrawer" @mouseover="drawerMouseOver" @mouseout="drawerMouseOut">
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item v-for="item in menuItems" :key="item.link" clickable v-ripple :to="item.link" exact>
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section>
              {{ $t(item.name) }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="absolute-bottom userDrawer q-pb-sm">
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
      menuLinks: []
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
    signIn() {
      this.logInDialog = true
    },
    signOut() {
      api('signout').then(res => {
        if (res.data.error) {
          this.$q.notify({
            color: 'negative',
            message: res.data.msg,
            position: 'top',
            timeout: 2000
          })
        }
        else if (res.data.success) {
          this.$q.notify({
            color: 'primary',
            message: 'You are now signed out.',
            position: 'top',
            timeout: 2000
          })
          this.$store.commit('userLogOut')
        }
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
      console.log('toggle')
      this.leftDrawer = !this.leftDrawer
    },
    setData(r) {
      console.log('userinfo', r)
      if (r.error) {}
      else if (r.isLoggedIn == true) {
        this.$store.commit('userLogIn', r.user)
        if (r.user.settings.locale != this.$i18n.locale) {
          this.$root.$i18n.locale = r.user.settings.locale
        }
      }
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
  },
  beforeRouteEnter (to, from, next) {
    api('userinfo', {
      detailed: true
    }).then(res => {
      next(vm => vm.setData(res.data))
    })
  }
  //don't need beforeRouteUpdate because userInfo needs only be fetched once
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