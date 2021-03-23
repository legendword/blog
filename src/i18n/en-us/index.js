export default {
    general: {
        posts: 'Posts',
        collections: 'Collections',
        authors: 'Authors',
        users: 'Users',
        following: 'Following',
        followers: 'Followers',
        overview: 'Overview',
        comments: 'Comments',
        email: 'Email',
        password: 'Password',
        cancel: 'Cancel',
        submit: 'Submit',
        done: 'Done',
        save: 'Save',
        username: 'Username',
        displayName: 'Display Name',
        sortBy: 'Sort By',
        sort: {
            timeDesc: 'Date Published (Newest)',
            timeAsc: 'Date Published (Oldest)',
            viewsDesc: 'Most Views',
            likesDesc: 'Most Likes'
        }
    },
    computed: {
        followers: 'Follower | Followers',
        posts: 'Post | Posts',
        collections: 'Collection | Collections'
    },
    forms: {
        requiredField: 'This is a required field.',
        maxChar: 'Maximum {0} Characters',
        onlyLettersAndSpaces: 'Can only contain letters and spaces.',
        nameTaken: 'This name is taken'
    },
    userAction: {
        unfollow: 'Unfollow',
        follow: 'Follow',
        following: 'Following'
    },
    tag: {
        author: 'Author'
    },
    barTitle: {
        author: 'Author',
        user: 'User'
    },
    collections: {
        menuHeader: 'Collections',
        menu: {
            browse: 'Browse',
            favorites: 'Favorites',
            mine: 'Mine'
        },
        title: {
            browse: 'Browse',
            favorites: 'My Favorites',
            mine: 'My Collections'
        },
        newCollection: 'New Collection',
        newCollectionDialog: {
            name: 'Collection Name'
        },
        deleteCollectionDialog: {
            title: 'Confirm Deletion',
            msg: 'Are you sure you want to delete this collection?'
        }
    },
    collection: {
        title: 'Collection',
        lastUpdated: 'Last Updated',
        editInfo: 'Edit Info',
        editInfoDialog: {
            title: 'Title',
            description: 'Description (Optional)',
            public: 'Public',
            mustHaveTitle: 'Collection must have a title!',
            updated: 'Collection Info Updated'
        },
        editPosts: 'Manage Posts',
        deletePostDialog: {
            title: 'Confirm',
            msg: 'Are you sure you want to delete this post?'
        },
        notFoundMsg: 'This collection does not seem to exist.'
    },
    categories: {
        article: 'Article',
        novel: 'Novel',
        experience: 'Experience',
        knowledge: 'Skill/Knowledge',
        guideline: 'Guideline',
        changelog: 'ChangeLog'
    },
    category: {
        title: 'Category',
        notFoundMsg: 'This category does not exist.'
    },
    tagPage: {
        title: 'Tag',
        notFoundMsg: 'This tag does not exist.'
    },
    settings: {
        title: 'Settings',
        general: {
            title: 'General',
            language: 'Language',
            languages: {
                Chinese: 'Chinese',
                English: 'English'
            }
        }
    },
    needToLogIn: {
        msg: 'Sign In To Access Full Functionalities',
        signInBtn: 'Sign In',
        backToHomeBtn: 'Back To Home'
    },
    userProfile: {
        notFoundMsg: 'This user does not exist.',
        profile: 'Profile',
        collections: 'Collections',
        goToAuthorPage: 'Go To Author Page',
        editProfile: 'Edit Profile',
        profileUpdated: 'Profile Updated'
    },
    authorProfile: {
        notFoundMsg: 'This author does not exist.',
        profile: 'Profile',
        posts: 'Posts',
        editProfile: 'Edit Profile',
        profileUpdated: 'Author Profile Updated',
        profileUpdatedCaption: 'Refresh to see updated profile.'
    },
    compose: {
        barTitle: 'Compose',
        newPost: 'New Post',
        notAuthorMsg: 'You are not an author yet! Apply to become an author so you can start creating amazing things.',
        becomeAuthor: 'Become an Author',
        authorApplicationApproved: 'Your application to become an author has been approved! (alpha-testing-no-restriction)',
        title: 'Title',
        description: 'Description',
        category: 'Category',
        content: 'Content',
        preview: 'Preview',
        submit: 'Submit',
        fieldRequired: 'The post must have a title, a description, a category, and some content.',
        exceedsMaxLength: 'Title/Description exceeds maximum length.',
        postIsPublished: 'Post is published.'
    },
    post: {
        notFoundTitle: 'Oops...',
        notFoundMsg: 'This post has been deleted or does not exist.',
        publishedOn: {
            before: 'Published on',
            after: ''
        },
        views: {
            before: '',
            after: 'Views'
        },
        emptyCommentMsg: 'Comment cannot be empty!',
        commentSuccess: 'Comment added',
        addToCollection: 'Add To Collection',
        newCollection: 'New Collection',
        addedToCollection: 'Added to Collection'
    },
    logIn: {
        newAccount: 'New Account',
        signIn: 'Sign In',
        alreadyAccountPrompt: 'Already have an account?',
        alreadyAccountSignIn: 'Sign In',
        noAccountPrompt: 'Don\'t have an account?',
        noAccountSignUp: 'Create One',
        incorrect: 'Email or Password Incorrect'
    },
    layoutDrawer: {
        discover: 'Discover',
        collections: 'Collections',
        following: 'Following',
        me: 'Me',
        notSignedIn: 'Not Signed In',
        settings: 'Settings',
        signIn: 'Sign In',
        signOut: 'Sign Out'
    },
    me: {
        creator: 'Creator',
        newPost: 'New Post',
        viewPost: 'View',
        removePost: 'Remove',
        stats: {
            totalViews: 'Views',
            totalComments: 'Comments',
            totalFollowers: 'Followers'
        },
        postViews: 'Views'
    },
    followingPage: {
        newPosts: 'New Posts'
    },
    indexPage: {
        allPosts: 'All Posts',
        allCategories: 'Categories',
        otherCategories: 'Other Categories'
    },
    search: {
        searchbar: 'Search...',
        searchResultFor: 'Search results for',
        noResultsFound: 'No Results Found.'
    },
    fourOFour: {
        msg: 'Oops. Nothing here...',
        goHome: 'Back Home'
    },
    newAccount: {
        welcome: 'Welcome aboard!',
        youCanNowLogIn: {
            before: 'You can now log in with ',
            after: ''
        },
        footnote: '*Email verification is not deployed yet.',
        backToHome: 'Back To Home'
    }
}