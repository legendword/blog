<template>
    <q-page class="q-pa-lg">
        <q-banner class="bg-grey-3 q-my-md" v-show="isLoggedIn && user.isAuthor == '0'">
            {{ $t("compose.notAuthorMsg") }}
            <!-- #todo: becomeAnAuthor -->
        </q-banner>
        <div v-show="isLoggedIn && user.isAuthor == '1'">
            <div class="editor-wrapper q-mt-lg">
                <editor ref="editor" />

                <div class="q-mt-lg q-mb-xl">
                    <q-btn color="primary" :label="$t('compose.submit')" @click="submitPost" />
                </div>
            </div>
        </div>
        <log-in :open="!isLoggedIn"></log-in>
    </q-page>
</template>

<script>
import { mapState } from "vuex"
import LogIn from "../components/LogIn.vue"
import api from "../api"
import { apiError } from "src/apiError"
import Editor from "src/components/post/Editor.vue"
import logger from "src/logger"
export default {
    name: "Compose",
    components: {
        LogIn,
        Editor
    },
    meta: {
        title: "Compose"
    },
    data() {
        return {
            safeToLeave: false
        }
    },
    computed: mapState(["user", "isLoggedIn"]),
    methods: {
        submitPost() {
            let post = {...this.$refs.editor.values}
            // logger(post)
            // return

            if (post.title.length == 0 || post.content.length == 0 || post.description.length == 0 || post.category == "") {
                this.$q.notify({
                    type: "warning",
                    message: this.$t("compose.fieldRequired")
                })
                return
            }
            if (post.title.length > 50 || post.description.length > 100) {
                this.$q.notify({
                    type: "warning",
                    message: this.$t("compose.exceedsMaxLength"),
                })
                return
            }
            api.post("/posts", {
                title: post.title,
                description: post.description,
                content: post.content,
                category: post.category,
                tags: post.tags,
                showTOC: post.showTOC ? 1 : 0
            }).catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                logger(r)
                if (r.success) {
                    this.$q.notify({
                        color: "positive",
                        message: this.$t("compose.postIsPublished"),
                    })
                    //after post publish
                    this.safeToLeave = true
                    // #todo: provide popup to copy link
                    this.$router.push("/me")
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg,
                    })
                }
            })
        }
    },
    created() {
        this.$store.commit("setBarTitle", this.$t("compose.barTitle"))
    },
    beforeRouteLeave(to, from, next) {
        if (this.safeToLeave) next();
        else {
            this.$q.dialog({
                title: "Confirm",
                message: "Do you really want to leave? Your changes will be lost.",
                cancel: true,
                persistent: true
            }).onOk(() => {
                next()
            }).onCancel(() => {
                next(false)
            })
        }
    }
}
</script>

<style lang="scss">
.editor-wrapper {
    body.screen--sm &, body.screen--xs & {
        width: 100%;
        max-width: 100%;
    }
    
    width: 80%;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.composeScrollArea {
    height: 70vh;
}
.composeScrollArea.bordered {
    border: 1px solid $grey-3;
}
textarea.postTextarea {
    min-height: calc( 70vh - 5px );
    height: calc( 70vh - 5px ) !important;
    resize: none !important;
}
.noBorderBottom {
    border-bottom: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
</style>