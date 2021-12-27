import { Dialog } from 'quasar'
import { i18n } from 'boot/i18n'
import api from 'src/api'
import { apiError } from 'src/apiError'
import logger from 'src/logger'

const newCollection = () => {
    return new Promise((resolve, reject) => {
        Dialog.create({
            title: i18n.t('collections.newCollection'),
            prompt: {
                model: '',
                label: i18n.t('collections.newCollectionDialog.name'),
                isValid: val => val.length > 0 && val.length <= 50,
                type: 'text'
            },
            cancel: true,
            persistent: true
        }).onOk(val => {
            logger(val)
            api.post('/collections', {
                title: val
            }).catch(err => {
                apiError()
                resolve(false)
            }).then(res => {
                let r = res.data
                if (r.success) {
                    resolve(true)
                }
                else {
                    reject(r.msg)
                }
            })
        }).onCancel(() => {
            resolve(false)
        })
    })
}
const addToCollection = (collectionId, postId) => {
    return new Promise((resolve, reject) => {
        api.put('/collections/'+collectionId+'/posts', {
            postId: postId
        }).catch(err => {
            reject(err)
        }).then(res => {
            let r = res.data
            if (r.success) {
                resolve(i18n.t('post.addedToCollection'))
            }
            else {
                reject(r.msg)
            }
        })
    })
}
export {
    newCollection,
    addToCollection
}