<template>
    <router-link :to="'/author/'+author.id" class="noLinkStyle">
        <q-card class="q-ma-lg">
            <q-card-section>
                <div class="row">
                    <div class="col-auto q-pr-md">
                        <q-avatar color="primary" text-color="white">{{ author.displayName ? author.displayName[0]:"" }}</q-avatar>
                    </div>
                    <div class="col q-my-auto">
                        <div><strong>{{ author.displayName }}</strong> <q-chip size="sm" color="accent" text-color="white" icon="create" class="q-ml-sm">{{ $t("tag.author") }}</q-chip></div>
                        <div class="text-caption">
                            <span class="q-pr-sm">{{ author.followerCount }} {{ $tc("computed.followers", author.followerCount) }}</span>
                            <span class="q-pl-sm">{{ author.postCount }} {{ $tc("computed.posts", author.postCount) }}</span>
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </router-link>
</template>

<script>
export default {
    name: "AuthorCard",
    props: {
        author: {
            type: Object,
            required: true
        }
    }
};
</script>

<style>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
</style>