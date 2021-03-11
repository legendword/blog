import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

Vue.use(VueI18n)

const supportedLanguages = ['en-US', 'en', 'zh-CN', 'zh']
let userLanguage = 'en'
if (navigator.languages && navigator.languages.length > 0) {
  for (let i of navigator.languages) {
    if (supportedLanguages.includes(i)) {
      userLanguage = i
      break
    }
    else if (supportedLanguages.includes(i.substr(0,2))) {
      userLanguage = i.substr(0,2)
    }
  }
}
else if (navigator.language && navigator.language != '') {
  if (supportedLanguages.includes(navigator.language)) {
    userLanguage = navigator.language
  }
  else if (supportedLanguages.includes(navigator.language.substr(0,2))) {
    userLanguage = navigator.language.substr(0,2)
  }
}

const i18n = new VueI18n({
  locale: userLanguage,
  fallbackLocale: 'en',
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}

export { i18n }
