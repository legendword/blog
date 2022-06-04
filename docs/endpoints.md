# WordBlog API Endpoints

## 1. Authentication

### 1.1 POST /user/signIn

Sign in using email and password.

#### Arguments

- **email**: String
- **password**: String - plain-text password
- **rememberme**: Boolean - whether to return token for automatic sign-in

#### Response

- **success**: Boolean - if true, sign in success; if false, returns either **msg** or **invalid**
- **msg**: String? - error in argument checks
- **invalid**: Boolean? - if true, email/password incorrect
- **jwt**: String - JSON Web Token string; pass this as header `Authorization: Bearer ${jwt}` in all future requests
- **user**: Object
  - **username**: String
  - **id**: Integer
  - **email**: String
  - **accessLevel**: Integer
  - **isAuthor**: Integer{0, 1} - maps to a boolean *(#todo: change to boolean)*
  - **settings**: Object
    - **locale**: String - the user preferred locale code
    - ...and more
- **identifier**: String? - the identifier for automatic sign-in, if argument rememberme is true
- **token**: String? - the token for automatic sign-in; store both this and the identifier in localStorage/cookies

### 1.2 POST /user/tokenSignIn

Sign in using token and identifier. Meant for automatic sign-in using stored information.

#### Arguments

- **token**: String
- **identifier**: String

#### Response

- **success**: Boolean - if true, sign in success; if false, returns either **msg** or **failed**
- **msg**: String? - error in argument checks
- **failed**: Boolean? - if true, token-identifier combination expired or does not match; remove stored token and identifier and sign out immediately
- **jwt**: String - JSON Web Token string; pass this as header `Authorization: Bearer ${jwt}` in all future requests
- **user**: Object - same as 1.1
- **token**: String - new token for automatic sign-in; update the stored token with this, but keep the identifier

### 1.3 POST /user/signOut

*Deprecated: this will always return `{success:true}`. Destroy stored JWT at client-side instead.* (#todo: invalidate token-identifier pair if exists)

### 1.4 POST /user/signUp

Creates a new account.

#### Arguments

- **email**: String
- **password**: String

#### Response

- **success**: Boolean - if false, also returns **msg**
- **msg**: String? - error message

> Remember to prompt the user that a verification email has been sent to the email address if response is success.

### 1.5 POST /user/verifyEmail

Verify the email address to complete registration.

#### Arguments

- **email**: String
- **code**: String

#### Response

- **success**: Boolean - if false, also returns **msg**
- **msg**: String? - error message

### 1.6 Password Recovery

There are 3 steps: sending recovery email, verifying recovery email code, and setting new password. They share the same endpoint with different HTTP methods.

#### 1.6.1 POST /user/recoverPassword

Send a password recovery email to the address.

#### Arguments

- **email**: String

#### Response

- **success**: Boolean
- **msg**: String? - error message

#### 1.6.2 GET /user/recoverPassword

Check if the recovery code from the email is valid.

#### Arguments

- **email**: String
- **code**: String

#### Response

- **success**: Boolean
- **msg**: String? - error message

#### 1.6.3 PUT /user/recoverPassword

Set a new password.

#### Arguments

- **email**: String
- **code**: String - recovery code from the email
- **password**: String - new password

#### Response

- **success**: Boolean
- **msg**: String? - error message

## 2. User Related Operations

### 2.1 PUT /user/settings

Edits a value in user settings.

#### Arguments

- **column**: String{"locale"} - settings column name
- **value**: String - new value for the setting

#### Response

- **success**: Boolean
- **msg**: String? - error message

### 2.2 PUT /user/info

Edit the user profile.

#### Arguments

- **username**: String - username (not for sign-in, but for public profile)

#### Response

- **success**: Boolean
- **msg**: String? - error message

### 2.3 PUT /user/authorInfo

Edit the author profile associated with the user.

#### Arguments

- **displayName**: String - display name of the author

#### Response

- **success**: Boolean
- **msg**: String? - error message

### 2.4 POST /user/becomeAuthor

Request to become an author. Creates an author account associated with the current user.

#### Arguments

None.

#### Response

- **success**: Boolean - if false, returns **msg**
- **msg**: String? - error message
- **authorId**: Integer

### 2.5 GET /user/info

Fetch verbose information of current user.

#### Arguments

- **detailed**: Boolean - whether to return detailed information

#### Response

- **isLoggedIn**: Boolean - if not logged in, this will be the only property returned by the request
- **user**: Object
  - **id**: Integer
  - **username**: String
  - **email**: String
  - **accessLevel**: Integer
  - **isAuthor**: Integer{0, 1} - maps to a boolean
  - **followerCount**: Integer
  - **followingCount**: Integer
  - **authorId**: Integer? - the id of the author, if user is an author
  - **settings**: Object? - only returned when **detailed** argument is true
    - **locale**: String - the user preferred locale code
    - ...and more
- **author**: Object? - only returned when **detailed** argument is true
  - **id**: Integer
  - **displayName**: String
  - **followerCount**: Integer
  - **postCount**: Integer
  - **joinTime**: Integer{timestamp}
  - **joinTimeStr**: String

### 2.6 GET /user/authorInfo

Fetch verbose information of the author of current user.

#### Arguments

None
#### Response

- **success**: Boolean
- **msg**: String?
- **hasAuthor**: Boolean
- **author**: Object? - only returned when **detailed** argument is true
  - **id**: Integer
  - **userId**: Integer
  - **displayName**: String
  - **followerCount**: Integer
  - **postCount**: Integer
  - **joinTime**: Integer{timestamp}


## 3. Posts

### 3.1 GET /posts

Query a list of the newest posts by publication date.

#### Arguments

- **count**: Integer? - number of results per page, default 10
- **page**: Integer? - page number, starts from 1, default 1

#### Response

- **success**: Boolean
- **msg**: String? - error message
- **posts**: Array\<Object\>
  - **authorId**: Integer
  - **authorName**: String
  - **category**: String{categories}
  - **description**: String
  - **postId**: Integer
  - **publishTime**: Integer - timestamp
  - **publishTimeStr**: String - human readable time
  - **updateTime**: Integer?
  - **updateTimeStr**: String?
  - **title**: String
  - **views**: Integer
- **postCount**: Integer? - total number of posts, only returns when argument page is 1

### 3.2 GET /posts/author/:id

Query a list of newest posts from an author.

#### Arguments

See 3.1

#### Response

See 3.1

### 3.3 GET /posts/category/:name

Query a list of posts from a category.

#### Arguments

- **sort**: String{"timeDesc", "timeAsc", "viewsDesc"} - sorting method
- **count**: Integer? - number of results per page, default 10.
- **page**: Integer? - page number, starts from 1, default 1

#### Response

See 3.1


### 3.4 GET /posts/tag/:name

Query a list of posts with a tag.

#### Arguments

See 3.3

#### Response

See 3.1

### 3.5 GET /posts/following

Query a list of the newest posts from authors followed by the current user.

Backend implementation should also maintain the largest postId in this list per user for calculating the number of new posts in `GET /badges`.

#### Arguments

See 3.1

#### Response

See 3.1

### 3.6 GET /posts/:id

Fetch a specific post.

#### Arguments

None

#### Response

- **success**: Boolean - if false, returns either **msg** or **errorType**
- **msg**: String? - error message
- **errorType**: String?{"NotFound"} - indicating the type of error, usually NotFound
- **post**: Object
  - **authorId**: Integer
  - **authorName**: String
  - **authorUserId**: Integer - the userId associated with this author
  - **followerCount**: Integer
  - **views**: Integer
  - **likes**: Integer - not implemented
  - **category**: String{categories}
  - **tags**: Array\<Object\>
    - **id**: Integer
    - **name**: String
  - **postId**: Integer
  - **publishTime**: Integer - timestamp
  - **publishTimeStr**: String - human readable time
  - **updateTime**: Integer?
  - **updateTimeStr**: String?
  - **title**: String
  - **description**: String
  - **content**: String - the full content of the post
  - **comments**: Array\<Object\>
    - **id**: Integer
    - **userId**: Integer
    - **username**: String
    - **userIsAuthor**: Integer{0, 1} - maps to a boolean; indicates whether the user is an author
    - **content**: String
    - **likes**: Integer - number of likes
    - **parentId**: Integer - 0 if no parent comment (not a reply); frontend implementation is responsible for rendering replies properly
    - **publishTime**: String
    - **publishTimeStr**: String
  - **isFollowing**: Boolean? - is the current user following the author
  - **likedComments**: Array\<Object\>? - list of comments the current user liked
    - **id**: the comment id

### 3.7 POST /posts

Publish a new blog post.

#### Arguments

- **title**: String
- **description**: String
- **content**: String
- **category**: Integer
- **tags**: Array\<String\>
- **showTOC**: Integer{0, 1} - maps to a Boolean

#### Response

- **success**: Boolean
- **msg**: String? - error message

> Work In Progress...
> `GET /user/info`
> `GET /user/authorInfo`
> `POST /posts`
> `DELETE /posts/:id`
> and more
