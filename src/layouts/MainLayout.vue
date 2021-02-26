<template>
  <q-layout view="hHh LpR fFf">
    <q-drawer content-class="bg-grey-3" show-if-above v-model="leftDrawer" :width="200" side="left" :mini="miniDrawer" @mouseover="drawerMouseOver" @mouseout="drawerMouseOut">
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple to="/" exact>
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/collection" exact>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section>
              Collection
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/user/1" exact>
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>

            <q-item-section>
              Test User
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/compose" exact>
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>

            <q-item-section>
              Compose
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="absolute-bottom userDrawer q-px-md">
        <q-avatar size="56px" class="q-mb-sm">
          <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png"> -->
        </q-avatar>
        <div v-if="isLoggedIn" class="drawerUserInfo">
          <div key="username" class="text-weight-medium text-center">{{ user.username }}</div>
          <div key="useraction" class="absolute-bottom q-mb-sm text-center"><q-btn flat color="primary" label="Sign Out" @click="signOut" /></div>
        </div>
        <div v-else class="drawerUserInfo">
          <div class="text-weight-medium text-center">Not Signed In</div>
          <div class="absolute-bottom q-mb-sm text-center"><q-btn flat color="primary" label="Sign In" @click="signIn" /></div>
        </div>
      </div>
    </q-drawer>

    <q-footer reveal elevated class="bg-indigo-8 text-white">
      <q-toolbar>
        <q-btn @click="toggleDrawer" flat round dense icon="menu" class="q-mr-sm" />
        <q-toolbar-title>
          Legendword Blog
        </q-toolbar-title>
        <q-space />
        <!--
        <q-tabs v-model="tab" shrink switch-indicator>
          <q-tab name="tab2" label="Reading" />
          <q-tab name="tab1" label="Home" />
        </q-tabs>
        -->
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <log-in :open="logInDialog" @closed="logInDialog = false"></log-in>

  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import api from '../api'
import LogIn from '../components/LogIn'
export default {
  components: {
    LogIn
  },
  data () {
    return {
      leftDrawer: false,
      miniDrawer: false,
      tab: 'tab1',
      logInDialog: false
    }
  },
  computed: {
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
      if (r.error) {}
      else if (r.isLoggedIn == true) {
        this.$store.commit('userLogIn', r.user)
      }
    }
  },
  watch: {
    miniDrawerMode: 'drawerMouseOut'
  },
  beforeRouteEnter (to, from, next) {
    api('userinfo').then(res => {
      next(vm => vm.setData(res.data))
    })
  }
  //don't need beforeRouteUpdate because userInfo needs only be fetched once
}
</script>

<style scoped>
.userDrawer {
  height: 130px;
}
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