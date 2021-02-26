<template>
    <q-dialog v-model="open" persistent transition-show="scale" transition-hide="scale">
        <q-card class="profileEditDialog">
            <q-card-section>
                <div class="text-h6">Edit Profile</div>
            </q-card-section>
            <q-card-section>
                <q-form class="q-gutter-md q-px-md">
                    <q-input v-model="username" lazy-rules :rules="usernameRules" label="Username"></q-input>
                </q-form>
            </q-card-section>
            <q-card-actions align="right" class="q-pa-lg">
                <q-btn flat label="Cancel" size="md" @click="cancelEdit" />
                <q-btn flat label="Submit" color="primary" size="md" @click="submitEdit" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import api from '../api'
export default {
    name: 'LogIn',
    props: {
        open: {
            type: Boolean,
            required: true
        },
        userData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            username: '',
            usernameRules: [
                val => val && val.length > 0 || 'This is a required field.'
            ]
        }
    },
    methods: {
        resetFields() {
            //todo
        },
        cancelEdit() {
            this.resetFields()
            if (this.$route.path!='/') this.$router.push('/')
            this.$emit('closed')
        },
        submitEdit() {
            //todo
            return
            api('signup', {
                email: this.email,
                password: this.password
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
                    this.$store.commit('newAccount', this.email)
                    this.resetFields()
                    this.$emit('closed')
                    this.$router.push('/newAccount')
                }
            })
        }
    }
}
</script>

<style scoped>
.profileEditDialog {
    width: 800px;
    max-width: 80vw;
}
</style>