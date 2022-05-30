const mainMenuItems = [
    {
        name: "layoutDrawer.discover",
        link: "/",
        icon: "ion-book",
        exact: true
    },
    {
        name: "layoutDrawer.collections",
        link: "/collections",
        icon: "ion-bookmarks"
    },
    {
        name: "layoutDrawer.following",
        link: "/following",
        icon: "ion-today",
        badge: "following",
        requireLogin: true
    },
    {
        name: "layoutDrawer.me",
        link: "/me",
        icon: "ion-person",
        requireLogin: true
    },
    {
        name: "layoutDrawer.creator",
        link: "/creator",
        icon: "ion-create",
        badge: "comments",
        requireLogin: true,
        requireAuthor: true
    }
];
export default mainMenuItems;