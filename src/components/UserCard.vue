<template>
    <router-link :to="'/user/'+user.id" class="noLinkStyle">
        <q-card class="q-ma-lg">
            <q-card-section>
                <div class="row">
                    <div class="col-auto q-pr-md">
                        <q-avatar color="primary" text-color="white">{{ user.username ? user.username[0]:'' }}</q-avatar>
                    </div>
                    <div class="col q-my-auto">
                        <div><strong>{{ user.username }}</strong> <q-chip size="sm" color="accent" text-color="white" icon="create" class="q-ml-sm" v-show="user.isAuthor == true || user.isAuthor == '1'">{{ $t('tag.author') }}</q-chip></div>
                        <div class="text-caption">
                            <span class="q-pr-sm">{{ user.followingCount }} {{ $t('general.following') }}</span>
                            <span class="q-pl-sm">{{ user.followerCount }} {{ $tc('computed.followers', user.followerCount) }}</span>
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </router-link>
</template>

<script>
export default {
    name: 'UserCard',
    props: {
        user: {
            type: Object,
            required: true
        }
    }
}
</script>

<style>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
</style>