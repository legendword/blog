export default {
    general: {
        posts: 'Posts',
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
        username: 'Username',
        displayName: 'Display Name'
    },
    computed: {
        followers: 'Follower | Followers',
        posts: 'Post | Posts',
        collections: 'Collection | Collections'
    },
    forms: {
        requiredField: 'This is a required field.',
        maxChar: 'Maximum {0} Characters',
        onlyLettersAndSpaces: 'Can only contain letters and spaces.'
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
        }
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
        removePost: 'Remove'
    },
    followingPage: {
        newPosts: 'New Posts'
    },
    indexPage: {
        allPosts: 'All Posts'
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