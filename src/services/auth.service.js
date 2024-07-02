const bcrypt = require('bcrypt')
const crypto = require('crypto')
const authModel = require('../models/auth.model')
const KeyTokenService = require('./key.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInforData } = require('../utils')

const RoleAuth = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR'
}

class AuthService {
    static signUp = async ({ name, email, password }) => {
        try {
            //step 1: check email exists
            const holderShop = await authModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered'
                }
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

                console.log({ privateKey, publicKey })

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newAuth._id,
                    publicKey, privateKey
                })

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
                    metadata: {
                        auth: getInforData({ fields: ['_id', 'name', 'email'], object: newAuth }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AuthService