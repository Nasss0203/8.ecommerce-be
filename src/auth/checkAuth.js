const createError = require('http-errors')
const { findById } = require('../services/apiKey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return next(createError(403, 'Forbidden'))
        }

        const objKey = await findById(key)
        if (!objKey) {
            return next(createError(403, 'Forbidden'))
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        return next(error)
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return next(createError(403, 'permissions denined'))
        }

        console.log(`permissions::`, req.objKey.permissions)
        const inValidPermission = req.objKey.permissions.includes(permission)
        if (!inValidPermission) {
            return next(createError(403, 'permissions denined'))
        }
        next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler
}