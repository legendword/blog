<template>
    <q-page class="q-pa-lg">
        <h5 class="q-my-md">{{ $t('compose.newPost') }}</h5>
        <q-banner class="bg-grey-3 q-my-md" v-show="isLoggedIn && user.isAuthor == '0'">
            {{ $t('compose.notAuthorMsg') }}
            <template v-slot:action>
                <q-btn flat color="primary" :label="$t('compose.becomeAuthor')" /> <!-- todo: becomeAnAuthor -->
            </template>
        </q-banner>
        <div v-show="isLoggedIn && user.isAuthor == '1'">
            <q-input counter maxlength="50" v-model="newPost.title" :label="$t('compose.title')" class="q-mb-md"></q-input>
            <q-input autogrow counter maxlength="100" v-model="newPost.description" :label="$t('compose.description')" class="q-mb-md"></q-input>
            <div class="row q-gutter-md">
                <div class="col-12 col-sm-auto">
                    <q-select class="composeCategorySelect" outlined v-model="newPost.category" :options="postCategories" option-value="id" option-label="name" emit-value map-options :label="$t('compose.category')"></q-select>
                </div>
                <div class="col-12 col-sm">
                    <div class="text-body2 text-grey-8">Tags ({{newPost.tags.length}}/{{tagsLimit}})</div>
                    <div class="row inline items-center">
                        <q-chip v-for="(tag, index) in newPost.tags" :key="index" removable color="primary" text-color="white" @remove="removeTag(index)">{{tag}}</q-chip>
                        <q-input class="q-pl-sm" maxlength="20" v-model="newTag" dense borderless @keydown="newTagKeydown" label="+ Add Tag">
                            <template v-slot:append>
                                <q-btn class="touch-only" v-if="newTag != ''" round dense flat icon="add" color="primary" @click="insertTag" />
                            </template>
                        </q-input>
                    </div>
                </div>
            </div>
            <div class="q-mt-md row">
                <div class="col-12 col-md-6">
                    <h6 class="q-my-md">{{ $t('compose.content') }}</h6>
                    <q-card flat bordered class="noBorderBottom">
                        <q-bar class="bg-white text-black">
                            <div class="barNoMLImportant">
                                <q-btn-dropdown dense flat icon="format_size">
                                    <q-list dense>
                                        <q-item v-for="(item, index) in headingSizes" :key="index" clickable v-close-popup @click="headingAction(index)">
                                            <q-item-section>
                                                <q-item-label class="text-weight-medium">{{ item }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-btn-dropdown>
                            </div>
                            <!-- special actions should be inserted above -->
                            <template v-for="(action, index) in editorActions">
                                <q-btn v-if="action.type == 'btn'" :key="index" dense flat :icon="action.icon" @click="performEditorAction(action)" />
                                <q-separator v-else :key="index" vertical spaced />
                            </template>
                            <!-- special actions should be inserted below -->
                            <div class="barNoMLImportant">
                                <q-btn dense flat icon="insert_link" />
                                <q-popup-edit v-model="insertLink.url" @before-show="beforeInsertLinkShow">
                                    <q-input v-if="insertLink.tab == 'url'" v-model="insertLink.url" dense autofocus label="URL" />
                                    <q-input v-else v-model="insertLink.label" dense autofocus label="Link Text" />
                                    <div class="row justify-between q-mt-sm">
                                        <q-btn dense flat color="secondary" icon="short_text" @click="insertLink.tab = 'label'" />
                                        <q-btn dense flat color="primary" label="Insert" @click="insertLinkAction" />
                                    </div>
                                </q-popup-edit>
                            </div>
                            <div class="barNoMLImportant">
                                <q-btn dense flat icon="insert_photo" />
                                <q-popup-edit v-model="insertImage.url" @before-show="beforeInsertImageShow">
                                    <q-input v-if="insertImage.tab == 'url'" v-model="insertImage.url" dense autofocus label="Image URL" />
                                    <q-input v-else v-model="insertImage.label" dense autofocus label="Image Description" />
                                    <div class="row justify-between q-mt-sm">
                                        <q-btn dense flat color="secondary" icon="short_text" @click="insertImage.tab = 'label'" />
                                        <q-btn dense flat color="primary" label="Insert" @click="insertImageAction" />
                                    </div>
                                </q-popup-edit>
                            </div>
                        </q-bar>
                    </q-card>
                    <q-scroll-area class="composeScrollArea bordered">
                        <q-input type="textarea" v-model="newPost.content" input-class="postTextarea q-pa-md" borderless ref="contentInput"></q-input>
                    </q-scroll-area>
                </div>
                <div class="col-12 col-md-6">
                    <h6 class="q-my-md">{{ $t('compose.preview') }}</h6>
                    <q-scroll-area class="composeScrollArea" :thumbStyle="scrollAreaThumbStyle">
                        <!--<q-markdown class="q-pa-md" no-html :src="newPost.content"></q-markdown> -->
                        <MarkDownItVue class="q-pa-md post-content" :content="newPost.content" :options="markdownItVueOptions"></MarkDownItVue>
                    </q-scroll-area>
                </div>
            </div>
            <div class="q-mt-md">
                <q-btn color="primary" :label="$t('compose.submit')" @click="submitPost"></q-btn>
            </div>
            <div class="q-mt-md text-caption">
                Posts made during <strong>alpha testing</strong> can be removed at any time without prior notice. Please do not post content you wish to keep until beta testing.
            </div>
        </div>
        <log-in :open="!isLoggedIn"></log-in>
    </q-page>
</template>

<script>
import MarkDownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import markdownItVueOptions from '../markdownItVueOptions'
import { mapState } from 'vuex'
import LogIn from '../components/LogIn'
import api from '../api'
const editorActions = [
    {type: 'btn', icon: 'format_bold', text: '**', mode: 'sandwich'},
    {type: 'btn', icon: 'format_italic', text: '*', mode: 'sandwich'},
    {type: 'btn', icon: 'format_underlined', text: '++', mode: 'sandwich'},
    {type: 'btn', icon: 'format_strikethrough', text: '~~', mode: 'sandwich'},
    {type: 'separator'},
    {type: 'btn', icon: 'format_quote', text: '> ', mode: 'linebegin'},
    {type: 'btn', icon: 'format_list_bulleted', text: '- ', mode: 'linebegin'},
    {type: 'btn', icon: 'format_list_numbered', text: '1. ', mode: 'linebegin'},
    {type: 'btn', icon: 'code', mode: 'code'},
    {type: 'separator'}
]
export default {
    name: 'Compose',
    components: {
        LogIn,
        MarkDownItVue
    },
    data() {
        return {
            markdownItVueOptions: markdownItVueOptions,
            headingSizes: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            editorActions: editorActions,
            editorActionsPerformed: {
                didPerform: false,
                selectionRange: [0, 0]
            },
            insertImage: {
                tab: 'url',
                url: '',
                label: ''
            },
            insertLink: {
                tab: 'url',
                url: '',
                label: ''
            },
            tagsLimit: 5,
            newTag: '',
            postCategories: [],
            newPost: {
                title: '',
                description: '',
                content: '',
                category: '',
                tags: []
            },
            scrollAreaThumbStyle: {
                width: '4px',
                opacity: 0.5,
                backgroundColor: 'grey',
                borderRadius: '2px'
            }
        }
    },
    computed: mapState(['user', 'isLoggedIn']),
    updated() {
        if (this.editorActionsPerformed.didPerform) {
            let textarea = this.$refs.contentInput.$refs.input
            textarea.setSelectionRange(this.editorActionsPerformed.selectionRange[0], this.editorActionsPerformed.selectionRange[1])
            textarea.focus()
            console.log(textarea.selectionStart, textarea.selectionEnd)
            this.editorActionsPerformed.didPerform = false
        }
    },
    methods: {
        removeTag(ind) {
            this.newPost.tags.splice(ind, 1)
        },
        insertTag() {
            if (this.newPost.tags.includes(this.newTag) || this.newPost.tags.length == this.tagsLimit) {
                return
            }
            this.newPost.tags.push(this.newTag)
            this.newTag = ''
        },
        newTagKeydown(ev) {
            if (ev.keyCode == 13) { //Enter
                this.insertTag()
            }
            else if (ev.keyCode == 8) {
                if (this.newTag.length == 0 && this.newPost.tags.length > 0) {
                    this.newPost.tags.pop()
                }
            }
        },
        headingAction(ind) {
            let text = ''
            for (let i=0;i<=ind;i++) {
                text += '#'
            }
            text += ' '
            this.performMultilineInsertion(text)
        },
        insertImageAction() {
            if (this.insertImage.url != '') {
                if (this.insertImage.label != '') {
                    this.performInsertion('![' + this.insertImage.label + '](' + this.insertImage.url + ')')
                }
                else {
                    this.performInsertion('![](' + this.insertImage.url + ')')  
                }
            }
        },
        insertLinkAction() {
            if (this.insertLink.url != '') {
                if (this.insertLink.label != '') {
                    this.performInsertion('[' + this.insertLink.label + '](' + this.insertLink.url + ')')
                }
                else {
                    this.performInsertion('<' + this.insertLink.url + '>')
                }
            }
        },
        beforeInsertImageShow() {
            this.insertImage.tab = 'url'
            this.insertImage.url = ''
            this.insertImage.label = ''
        },
        beforeInsertLinkShow() {
            this.insertLink.tab = 'url'
            this.insertLink.url = ''
            this.insertLink.label = ''
        },
        performMultilineInsertion(text) {
            let textarea = this.$refs.contentInput.$refs.input
            let start = textarea.selectionStart
            let end = textarea.selectionEnd
            let content = this.newPost.content
            let newContent = ''

            let f = [content.lastIndexOf('\n', start-1)+1]
            let j = content.indexOf('\n', start)
            while (j < end && j != -1) {
                f.push(j+1)
                j = content.indexOf('\n', j+1)
            }
            let lastPos = 0
            for (let i of f) {
                newContent += content.substring(lastPos, i) + text
                lastPos = i
            }
            newContent += content.substring(lastPos)

            this.editorActionsPerformed.selectionRange = [f[0], end + f.length * text.length]
            this.editorActionsPerformed.didPerform = true
            this.newPost.content = newContent
        },
        performInsertion(text) {
            let textarea = this.$refs.contentInput.$refs.input
            let end = textarea.selectionEnd
            let content = this.newPost.content
            let newContent = content.substring(0, end) + text + content.substring(end)
            this.editorActionsPerformed.selectionRange = [end + text.length, end + text.length]
            this.editorActionsPerformed.didPerform = true
            this.newPost.content = newContent
        },
        performEditorAction(action) {
            console.log(action)
            let textarea = this.$refs.contentInput.$refs.input
            //console.log(textarea.selectionStart, textarea.selectionEnd)
            let start = textarea.selectionStart
            let end = textarea.selectionEnd
            let content = this.newPost.content
            let newContent = ''
            let newSelectionRange = [start, end]
            let mode,text
            if (action.mode == 'code') { //code can be block or inline
                mode = (content.indexOf('\n', start) == -1 || content.indexOf('\n', start) >= end) ? 'sandwich' : 'blocksandwich'
                text = mode == 'sandwich' ? '`' : '```'
            }
            else {
                mode = action.mode
                text = action.text
            }
            if (mode == 'sandwich') {
                newContent = content.substring(0, start) + text + content.substring(start, end) + text + content.substring(end)
                //todo add proper sandwich to multiline selection
                newSelectionRange[1] += text.length*2

                this.editorActionsPerformed.selectionRange = newSelectionRange
                this.editorActionsPerformed.didPerform = true
                this.newPost.content = newContent
            }
            else if (mode == 'blocksandwich') {
                let lineStart = content.lastIndexOf('\n', start-1)+1
                let lineEnd = content.indexOf('\n', end)
                if (lineEnd == -1) lineEnd = content.length
                newContent = content.substring(0, lineStart) + text + '\n' + content.substring(lineStart, lineEnd) + '\n' + text + content.substring(lineEnd)
                newSelectionRange[0] = lineStart
                newSelectionRange[1] = lineEnd

                this.editorActionsPerformed.selectionRange = newSelectionRange
                this.editorActionsPerformed.didPerform = true
                this.newPost.content = newContent
            }
            else if (mode == 'linebegin') {
                this.performMultilineInsertion(text)
            }
        },
        submitPost() {
            if (this.newPost.title.length == 0 || this.newPost.content.length == 0 || this.newPost.description.length == 0 || this.newPost.category == '') {
                this.$q.notify({
                    type: 'warning',
                    message: this.$t('compose.fieldRequired'),
                    position: 'top'
                })
                return
            }
            if (this.newPost.title.length > 50 || this.newPost.description.length > 100) {
                this.$q.notify({
                    type: 'warning',
                    message: this.$t('compose.exceedsMaxLength'),
                    position: 'top'
                })
                return
            }
            api('newpost', {
                title: this.newPost.title,
                description: this.newPost.description,
                content: this.newPost.content,
                category: this.newPost.category,
                tags: this.newPost.tags
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.error) {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                else if (r.success) {
                    this.$q.notify({
                        color: 'positive',
                        message: this.$t('compose.postIsPublished'),
                        position: 'top',
                        timeout: 2000
                    })
                    //after post publish
                }
            })
        }
    },
    created() {
        this.$store.commit('setBarTitle', this.$t('compose.barTitle'))
        api('listcategories').then(res => {
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
                    this.postCategories = r.categories
                }
        })
    }
}
</script>

<style lang="scss">
.composeCategorySelect {
    min-width: 200px;
}
.barNoMLImportant {
    margin-left: 0 !important;
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