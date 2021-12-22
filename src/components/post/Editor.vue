<template>
    <div class="post-editor">
        <div class="post-information">
            <q-input
                counter
                :maxlength="limits.title"
                v-model="values.title"
                :label="$t('compose.title')"
                class="q-mb-sm"
                autofocus
            />
            <q-input
                autogrow
                counter
                :maxlength="limits.description"
                v-model="values.description"
                :label="$t('compose.description')"
                class="q-mb-lg"
            />
            
            <div class="row q-gutter-md">
                <div class="col-12 col-sm-auto">
                    <q-select
                        class="category-select"
                        
                        v-model="values.category"
                        :options="categoryList"
                        option-value="id"
                        option-label="name"
                        emit-value
                        map-options
                        :label="$t('compose.category')"
                    />
                </div>
                <tag-selector
                    componentClass="col-12 col-sm"
                    :limit="limits.tags"
                    v-model="values.tags"
                />
            </div>
        </div>
        <div class="post-content-wrapper q-mt-xl">
            <q-tabs
                v-model="tab"
                dense
                align="left"
                class="bg-white text-primary q-mb-md"
            >
                <q-tab name="editor" label="Editor" />
                <q-tab name="preview" label="Preview" />
            </q-tabs>

            <q-tab-panels v-model="tab">
                <q-tab-panel name="editor" class="q-pa-none">
                    <q-card flat bordered class="overflow-scroll-x">
                        <q-bar class="bg-white text-black">
                            <div class="barNoMLImportant">
                                <q-btn dense flat icon="format_size">
                                    <q-menu auto-close>
                                        <q-list dense>
                                            <q-item v-for="(item, index) in headingSizes" :key="index" clickable @click="headingAction(index)">
                                                <q-item-section>
                                                    <q-item-label class="text-weight-medium">{{ item }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                                </q-btn>
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
                    <q-input class="q-ma-sm" type="textarea" autogrow v-model="values.content" input-class="textarea" borderless ref="contentInput"></q-input>
                    <div class="q-mt-md text-caption">
                        Styling with <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank" rel="noopener noreferrer">Markdown</a> is enabled. Create new lines with two returns.
                    </div>
                </q-tab-panel>
                <q-tab-panel name="preview" class="q-pa-none">
                    <div class="q-ma-sm post-content content-preview">
                        <div class="markdown-body" v-html="htmlPreview" />
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script>
import api from 'src/api'
import TagSelector from '../form/TagSelector.vue'
import { apiError } from 'src/apiError'
// import MarkDownItVue from 'markdown-it-vue'
import 'src/css/markdown-it-vue.css'
// import markdownItVueOptions from 'src/markdownItVueOptions'
import markdownIt from 'markdown-it'
const emptyValues = {
    title: '',
    description: '',
    content: '',
    category: '',
    tags: []
}
const limits = {
    title: 50,
    description: 100,
    tags: 5
}
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
    name: 'Editor',
    components: {
        TagSelector,
        // MarkDownItVue
    },
    props: {
        initialValues: Object
    },
    data() {
        return {
            values: this.initialValues ? {...this.initialValues} : emptyValues,
            limits: limits,
            categoryList: [],

            tab: 'editor',

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

            // markdownItVueOptions: markdownItVueOptions,
            htmlPreview: ''
        }
    },
    watch: {
        tab(val) {
            if (val == 'preview') {
                this.generatePreview()
            }
        }
    },
    created() {
        console.log('Editor created')
        api.get('/categories', {
            newpost: true
        }).catch(err => {
            apiError()
        }).then(res => {
            let r = res.data
            if (r.success) {
                this.categoryList = r.categories.map(v => ({
                    ...v,
                    name: this.$t('categories.'+v.name)
                }))
            }
            else {
                this.$q.notify({
                    color: 'negative',
                    message: r.msg,
                })
            }
        })
    },
    updated() {
        if (this.editorActionsPerformed.didPerform) {
            let textarea = this.$refs.contentInput.$refs.input
            // textarea.setSelectionRange(this.editorActionsPerformed.selectionRange[0], this.editorActionsPerformed.selectionRange[1])
            textarea.setSelectionRange(this.editorActionsPerformed.selectionRange[1], this.editorActionsPerformed.selectionRange[1])
            textarea.focus()
            // console.log(textarea.selectionStart, textarea.selectionEnd)
            this.editorActionsPerformed.didPerform = false
        }
    },
    methods: {
        generatePreview() {
            let md = markdownIt({
                linkify: true
            })
            this.htmlPreview = md.render(this.values.content)
            // console.log(this.htmlPreview)
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
            let content = this.values.content
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
            this.values.content = newContent
        },
        performInsertion(text) {
            let textarea = this.$refs.contentInput.$refs.input
            let end = textarea.selectionEnd
            let content = this.values.content
            let newContent = content.substring(0, end) + text + content.substring(end)
            this.editorActionsPerformed.selectionRange = [end + text.length, end + text.length]
            this.editorActionsPerformed.didPerform = true
            this.values.content = newContent
        },
        performEditorAction(action) {
            console.log(action)
            let textarea = this.$refs.contentInput.$refs.input
            //console.log(textarea.selectionStart, textarea.selectionEnd)
            let start = textarea.selectionStart
            let end = textarea.selectionEnd
            let content = this.values.content
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
                this.values.content = newContent
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
                this.values.content = newContent
            }
            else if (mode == 'linebegin') {
                this.performMultilineInsertion(text)
            }
        },
    }
}
</script>

<style lang="scss">
.post-editor {
    .category-select {
        min-width: 200px;
    }
    .textarea {
        min-height: 50vh;
        resize: none !important;
        font-size: 1.1rem;
        line-height: 1.5;
    }
    .content-preview {
        min-height: calc(50vh + 66px);
    }
}
.barNoMLImportant {
    margin-left: 0 !important;
}
.overflow-scroll-x {
    overflow-x: scroll;
}
</style>