export default {
    general: {
        posts: '文章',
        collections: '收藏夹',
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
        done: '完成',
        save: '保存',
        username: '用户名',
        displayName: '作者名',
        sortBy: '排序',
        sort: {
            timeDesc: '最新发布',
            timeAsc: '最早发布',
            viewsDesc: '最多阅读',
            likesDesc: '最多点赞'
        },
        loading: '加载中...',
        serverError: {
            title: '服务器错误',
            message: '未能完成请求。服务器可能离线或者出错。请联系站点管理员。'
        }
    },
    computed: {
        followers: '粉丝',
        posts: '文章',
        collections: '收藏夹'
    },
    forms: {
        requiredField: '此项为必填',
        maxChar: '最多{0}个字符',
        onlyLettersAndSpaces: '只能包括字母和数字',
        nameTaken: '名称已被占用'
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
    collections: {
        menuHeader: '收藏夹',
        menu: {
            browse: '浏览',
            favorites: '我喜欢的',
            mine: '我创建的'
        },
        title: {
            browse: '浏览',
            favorites: '喜欢的收藏夹',
            mine: '我的收藏夹'
        },
        newCollection: '新建收藏夹',
        newCollectionDialog: {
            name: '收藏夹名称'
        },
        deleteCollectionDialog: {
            title: '确认删除',
            msg: '确认删除此收藏夹？'
        }
    },
    collection: {
        title: '收藏夹',
        lastUpdated: '最近更新',
        editInfo: '修改信息',
        editInfoDialog: {
            title: '收藏夹名称',
            description: '简介 (可选)',
            public: '公开收藏夹',
            mustHaveTitle: '收藏夹必须有一个名称',
            updated: '收藏夹信息已更新'
        },
        editPosts: '管理文章',
        deletePostDialog: {
            title: '确认移除',
            msg: '确认移除此文章？'
        },
        notFoundMsg: '这个收藏夹似乎不存在'
    },
    categories: {
        article: '文章',
        novel: '小说',
        experience: '经历',
        knowledge: '技术/知识',
        guideline: '规则',
        changelog: '更新日志',
        support: '帮助'
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
        collections: '收藏夹',
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
        },
        commentLogIn: '登录以发表评论',
        commentIsDeleted: '该评论已被删除',
        deleteComment: {
            btn: '删除',
            title: '删除评论',
            msg: '确认删除该评论？所有相关回复也将被删除。',
            success: '评论已删除'
        },
        emptyCommentMsg: '评论不能为空',
        commentSuccess: '评论发表成功',
        addToCollection: '添加至收藏夹',
        newCollection: '新建收藏夹',
        addedToCollection: '收藏成功'
    },
    logIn: {
        newAccount: '用户注册',
        signIn: '用户登录',
        alreadyAccountPrompt: '已有账号？',
        alreadyAccountSignIn: '登录',
        noAccountSignUp: '注册账号',
        passwordRecover: '找回密码',
        incorrect: '邮箱或密码错误',
        signOutSuccessMsg: '退出登录成功',
        rememberMe: '记住我'
    },
    layoutDrawer: {
        discover: '发现',
        collections: '收藏夹',
        following: '关注',
        me: '我',
        compose: '创作',
        notSignedIn: '未登录',
        settings: '设置',
        signIn: '登录',
        signOut: '退出登录'
    },
    me: {
        creator: '创作者中心',
        newPost: '创建新文章',
        viewPost: '查看',
        removePost: '删除',
        removePostDialog: {
            title: '删除文章',
            msg: '确定删除以下文章？同时将会删除其评论等所有信息。此操作无法恢复：',
            success: '文章已删除'
        },
        stats: {
            totalViews: '阅读',
            totalComments: '评论',
            totalFollowers: '粉丝'
        },
        postViews: '阅读'
    },
    followingPage: {
        newPosts: '最近更新'
    },
    indexPage: {
        allPosts: '全部文章',
        allCategories: '分类',
        otherCategories: '其他分类'
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
        emailVerify: '验证码已经发至',
        verifyNote: '请在30分钟内点击邮件中的链接完成注册',
        footnote: '没有收到邮件？加入Telegram群组解决问题：',
        backToHome: '进入首页'
    },
    emailVerification: {
        title: '邮箱验证成功',
        msg: {
            before: '现在您可以使用',
            after: '登录'
        },
        failedTitle: '邮箱验证失败',
        failedMsg: '验证链接可能已经失效，请重新注册。'
    },
    passwordRecovery: {
        prompt: {
            title: '找回密码',
            msg: '请输入您的邮箱',
            successMsg: '密码重置链接已发至您的邮箱，请及时查看。'
        },
        title: '重置密码',
        msg: {
            before: '为',
            after: '设置一个新密码'
        },
        input: {
            password: '新密码',
            passwordConfirm: '确认密码'
        },
        passwordsDontMatch: '两个密码不一致',
        finishedMsg: '您的密码已更新',
        failedTitle: '邮箱链接失效',
        failedMsg: '密码重置链接可能已经过期，请重试。'
    }
}