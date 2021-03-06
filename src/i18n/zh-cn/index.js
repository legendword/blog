export default {
    general: {
        posts: '文章',
        authors: '作者',
        users: '用户',
        following: '关注',
        followers: '粉丝',
        overview: '概览',
        comments: '评论',
        email: '邮箱',
        password: '密码',
        cancel: '取消',
        submit: '提交',
        username: '用户名',
        displayName: '作者名',
        sortBy: '排序',
        sort: {
            timeDesc: '最新发布',
            timeAsc: '最早发布',
            viewsDesc: '最多阅读'
        }
    },
    computed: {
        followers: '粉丝',
        posts: '文章',
        collections: 'Collection | Collections'
    },
    forms: {
        requiredField: '此项为必填',
        maxChar: '最多{0}个字符',
        onlyLettersAndSpaces: '只能包括字母和数字'
    },
    userAction: {
        unfollow: '取消关注',
        follow: '关注',
        following: '已关注'
    },
    tag: {
        author: '作者'
    },
    barTitle: {
        author: '作者',
        user: '用户'
    },
    categories: {
        article: '文章',
        novel: '小说',
        nonfiction: '纪实',
        changelog: '更新日志'
    },
    category: {
        title: '分类',
        notFoundMsg: '分类不存在',
    },
    tagPage: {
        title: '标签',
        notFoundMsg: '标签不存在'
    },
    settings: {
        title: '设置',
        general: {
            title: '通用',
            language: '语言',
            languages: {
                Chinese: '中文',
                English: '英文'
            }
        }
    },
    needToLogIn: {
        msg: '登录后即可使用全部功能',
        signInBtn: '登录',
        backToHomeBtn: '返回主页'
    },
    userProfile: {
        notFoundMsg: '用户不存在',
        profile: '详情',
        collections: 'Collections',
        goToAuthorPage: '作者主页',
        editProfile: '编辑信息',
        profileUpdated: '信息已更新'
    },
    authorProfile: {
        notFoundMsg: '作者不存在',
        profile: '详情',
        posts: '文章',
        editProfile: '编辑信息',
        profileUpdated: '作者信息已更新',
        profileUpdatedCaption: '刷新页面查看最新信息'
    },
    compose: {
        barTitle: '写作',
        newPost: '创建文章',
        notAuthorMsg: '你还不是作者！申请成为作者即可创作',
        becomeAuthor: '成为作者',
        authorApplicationApproved: '作者申请已通过！ (alpha-testing-no-restriction)',
        title: '标题',
        description: '简介',
        category: '分类',
        content: '内容',
        preview: '预览',
        submit: '提交',
        fieldRequired: '文章必须有标题，简介，分类，内容。',
        exceedsMaxLength: '标题或简介超出最大字符数',
        postIsPublished: '文章已发布'
    },
    post: {
        notFoundTitle: '糟糕',
        notFoundMsg: '文章不存在或已被删除',
        publishedOn: {
            before: '发表于',
            after: ''
        },
        views: {
            before: '阅读',
            after: ''
        }
    },
    logIn: {
        newAccount: '用户注册',
        signIn: '用户登录',
        alreadyAccountPrompt: '已有账号？',
        alreadyAccountSignIn: '登录',
        noAccountPrompt: '没有账号？',
        noAccountSignUp: '注册',
        incorrect: '邮箱或密码错误'
    },
    layoutDrawer: {
        discover: '发现',
        collections: '收藏',
        following: '关注',
        me: '我',
        notSignedIn: '未登录',
        settings: '设置',
        signIn: '登录',
        signOut: '退出登录'
    },
    me: {
        creator: '创作者中心',
        newPost: '创建新文章',
        viewPost: '查看',
        removePost: '删除'
    },
    followingPage: {
        newPosts: '最近更新'
    },
    indexPage: {
        allPosts: '全部文章'
    },
    search: {
        searchbar: '搜索...',
        searchResultFor: '搜索结果：',
        noResultsFound: '什么也没找到...'
    },
    fourOFour: {
        msg: '糟糕，这里什么也没有...',
        goHome: '回到首页'
    },
    newAccount: {
        welcome: '注册完成！',
        youCanNowLogIn: {
            before: '现在可以使用',
            after: '登录您的账号'
        },
        footnote: '*邮箱验证暂时没有部署',
        backToHome: '进入首页'
    }
}