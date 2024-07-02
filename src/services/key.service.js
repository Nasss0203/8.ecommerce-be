const keyModel = require("../models/key.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await keyModel.create({
                user: userId,
                privateKey,
                publicKey
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService