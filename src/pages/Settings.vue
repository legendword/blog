<template>
    <q-page class="q-pa-lg">
        <div class="text-h4 q-mb-lg">{{$t('settings.title')}}</div>
        <q-list bordered>
            <q-item-label header>{{$t('settings.general.title')}}</q-item-label>
            <q-item>
                <q-item-section>
                    {{$t('settings.general.language')}}
                </q-item-section>
                <q-item-section side class="settingSelect">
                    <q-select dense v-model="language" outlined :options="options.languages" map-options emit-value />
                </q-item-section>
            </q-item>
            <!--
            <q-expansion-item expand-separator icon="settings" label="General">
            </q-expansion-item> -->
        </q-list>
        <div class="q-mt-md">Dev Info: {{ sts }}</div>
    </q-page>
</template>

<script>
import api from '../api'
import { mapState } from 'vuex'
export default {
    name: 'Settings',
    data() {
        return {
            options: {
                languages: [
                    {value: 'en', label: this.$t('settings.general.languages.English')},
                    {value: 'zh', label: this.$t('settings.general.languages.Chinese')}
                ]
            },
            language: this.$root.$i18n.locale
        }
    },
    computed: {
        sts() {
            return this.$store.state.user ? this.$store.state.user.settings : ''
        },
        ...mapState(['isLoggedIn']) //todo !isLoggedIn message
    },
    methods: {
        backHome() {
            this.$router.push('/')
        }
    },
    watch: {
        language(lang) {
            this.$root.$i18n.locale = lang
            if (this.isLoggedIn) {
                api('editusersetting', {
                    column: 'locale',
                    value: lang
                }).then(res => {
                    let r = res.data
                    if (r.error) {
                        this.$q.notify({
                            color: 'negative',
                            message: r.msg,
                            position: 'top',
                            timeout: 2000
                        })
                    }
                    else if (r.success) {
                        //do nothing
                    }
                })
            }
        }
    }
}
</script>

<style>
.settingSelect {
    width: max( 200px, 30vw );
}
.settingSelect > * {
    width: 100%
}
</style>