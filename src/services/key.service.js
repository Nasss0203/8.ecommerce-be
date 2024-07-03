const { Types } = require("mongoose")
const keyModel = require("../models/key.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {

        try {
            const filter = {
                user: userId
            }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {
                upsert: true, new: true
            }

            const tokens = await keyModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keyModel.deleteOne(id).lean()
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        const tokenUsed = await keyModel.findOne({ refreshTokensUsed: refreshToken })
        return tokenUsed
    }

    static findByRefreshToken = async (refreshToken) => {
        const token = await keyModel.findOne({ refreshToken })
        return token
    }

    static deleteKeyById = async (userId) => {
        return await keyModel.findByIdAndDelete({ user: userId }).lean();
    }
}

module.exports = KeyTokenService