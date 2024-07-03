const bcrypt = require('bcrypt')
const crypto = require('crypto')
const authModel = require('../models/auth.model')
const KeyTokenService = require('./key.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInforData } = require('../utils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./auth.service')
const createError = require('http-errors')

const RoleAuth = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR'
}

class AuthService {
    /**
        1 - Check email in db
        2 - Match password 
        3 - create accessToken and refreshToken and save 
        4 - generate tokens
        5 - get data return login
      */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1 - Check email in db
        const foundAuth = await findByEmail({ email })
        if (!foundAuth) throw new createError(400, 'Shop not registered')

        //2. Match password 
        const match = bcrypt.compare(password, foundAuth.password)
        if (!match) throw new createError(401, 'Authentication error')

        //3. create accessToken and refreshToken and save 
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        const { _id: userId } = foundAuth

        // 4 - generate tokens
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey, publicKey
        })

        // 5 - get data return login
        return {
            data: getInforData({ fields: ['_id', 'name', 'email'], object: foundAuth }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        //step 1: check email exists
        const holderShop = await authModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered')
        }
        const salt = 10
        const passwordHash = await bcrypt.hash(password, salt)

        const newAuth = await authModel.create({
            name, email, password: passwordHash, roles: [RoleAuth.SHOP]
        })

        if (newAuth) {
            // create privateKey, publicKey
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            // console.log({ privateKey, publicKey })

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newAuth._id,
                publicKey,
                privateKey
            })
            console.log('keyStore: ', keyStore);


            if (!keyStore) {
                return {
                    code: "xxx",
                    message: "Key store error"
                }
            }

            const tokens = await createTokenPair({
                userId: newAuth._id, email
            }, publicKey, privateKey)

            return {
                code: 201,
                data: {
                    auth: getInforData({ fields: ['_id', 'name', 'email'], object: newAuth }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }

    static hadlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new createError(403, 'Something wrong happend!! Please relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new createError(401, 'Shop not registered')

        const foundAuth = await findByEmail({ email })
        if (!foundAuth) throw new createError(401, 'Auth not registered')

        //creata 1 cặp token
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }


}

module.exports = AuthService