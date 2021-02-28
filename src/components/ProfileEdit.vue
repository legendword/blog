<template>
    <q-dialog v-model="open" persistent transition-show="scale" transition-hide="scale">
        <q-card class="profileEditDialog">
            <q-card-section>
                <div class="text-h6">Edit Profile</div>
            </q-card-section>
            <q-card-section v-if="profileMode == 'user'">
                <q-form class="q-gutter-md q-px-md">
                    <q-input v-model="username" lazy-rules :rules="usernameRules" label="Username"></q-input>
                </q-form>
            </q-card-section>
            <q-card-section v-else>
                <q-form class="q-gutter-md q-px-md">
                    <q-input v-model="displayName" lazy-rules :rules="displayNameRules" label="Display Name"></q-input>
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
    name: 'ProfileEdit',
    props: {
        open: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object
        },
        profileMode: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            username: '',
            usernameRules: [
                val => val && val.length > 0 || 'This is a required field.',
                val => val.length <= 20 || 'Maximum 20 Characters',
                val => /^[a-zA-Z ]+$/.test(val) || 'Can only contain letters and spaces.'
            ],
            displayName: '',
            displayNameRules: [
                val => val && val.length > 0 || 'This is a required field.',
                val => val.length <= 20 || 'Maximum 20 characters.',
                val => /^[a-zA-Z ]+$/.test(val) || 'Can only contain letters and spaces.'
            ]
        }
    },
    created() {
        this.resetFields()
    },
    watch: {
        open: function(newVal) {
            if (newVal == true) {
                this.resetFields()
            }
        }
    },
    methods: {
        resetFields() {
            if (this.data) {
                var fields
                if (this.profileMode == 'user') {
                    fields = ['username']
                }
                else {
                    fields = ['displayName']
                }
                for (let i of fields) {
                    this[i] = this.data[i]
                }
            }
        },
        cancelEdit() {
            this.resetFields()
            this.$emit('closed')
        },
        submitEdit() {
            if (this.profileMode == 'user') {
                api('edituserprofile', {
                    username: this.username
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
                        this.$store.commit('userDataChange', {
                            username: r.user.username
                        })
                        this.$emit('closed')
                        this.$q.notify({
                            color: 'positive',
                            message: 'Profile Updated',
                            position: 'top',
                            timeout: 2000
                        })
                    }
                })
            }
            else {
                api('editauthorprofile', {
                    displayName: this.displayName
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
                        this.$emit('closed')
                        this.$q.notify({
                            color: 'positive',
                            message: 'Author Profile Updated',
                            caption: 'Refresh to see updated profile.',
                            position: 'top',
                            timeout: 2000
                        })
                    }
                })
            }
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