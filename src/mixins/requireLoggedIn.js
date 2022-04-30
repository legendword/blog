import NeedToLogIn from '../components/NeedToLogIn.vue'

const requireLoggedIn = {
    components: { NeedToLogIn },
    computed: {
        isLoggedIn() {
            return this.$store.state.isLoggedIn
        }
    },
    watch: {
        isLoggedIn() {
            this.init()
        }
    }
}

export default requireLoggedIn;