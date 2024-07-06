const _ = require('lodash')

const getInforData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unSetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]));
}

module.exports = {
    getInforData,
    getSelectData,
    unSetSelectData
}