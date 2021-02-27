<template>
    <q-page class="q-pa-lg">
        <div v-if="postNotFound">
            <h5>Oops..</h5>
            <h6>This post has been deleted or does not exist.</h6>
        </div>
        <div v-else>
            <h4>{{ post.title }}</h4>
            <div class="row q-gutter-md">
                <div class="col-12 col-sm-auto text-subtitle1">
                    <q-card>
                        <q-card-section>
                            <div class="row">
                                <div class="col-auto q-pr-md">
                                    <q-avatar color="primary" text-color="white">{{ post.authorName ? post.authorName[0]:'' }}</q-avatar>
                                </div>
                                <div class="col q-my-auto">
                                    <div><strong>{{ post.authorName }}</strong></div>
                                    <div class="text-caption">0 Followers</div>
                                </div>
                                <div class="col-auto q-my-auto q-ml-md">
                                    <q-btn flat color="primary" label="Follow"></q-btn>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-12 col-sm-auto text-subtitle1">
                    <q-card>
                        <q-card-section class="q-pb-xs q-pt-sm">
                            <div class="row">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="schedule" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.publishTime }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col q-pl-md">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="schedule" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.publishTime }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs q-pb-sm">
                            <div class="row">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="auto_stories" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.views }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col q-pl-md">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="auto_stories" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.views }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <q-markdown class="q-my-md" no-html :src="post.content"></q-markdown>
            <p class="text-caption">Post Id: {{ $route.params.id }}</p>
        </div>
    </q-page>
</template>

<script>
import api from '../api'
export default {
    name: 'Post',
    data() {
        return {
            post: {},
            postNotFound: false
        }
    },
    created() {
        if (this.$store.state.miniDrawerMode == false) {
            this.$store.commit('setMiniDrawerMode', true);
        }
    },
    methods: {
        setData(r) {
            if (r.error) {
                if (r.errorType && r.errorType == 'PostNotFound') {
                    this.postNotFound = true
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                this.$store.commit('setBarTitle')
            }
            else if (r.success) {
                console.log(r.post)
                this.post = r.post
                this.$store.commit('setBarTitle', r.post.title)
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api('getpost', {
            id: to.params.id
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
    },
    beforeRouteUpdate (to, from, next) {
        api('getpost', {
            id: to.params.id
        }).then(res => {
            this.setData(res.data)
            next()
        })
    },
    beforeRouteLeave (to, from, next) {
        if (!to.meta.miniDrawer) {
            this.$store.commit('setMiniDrawerMode', false);
        }
        next()
    }
}
</script>
