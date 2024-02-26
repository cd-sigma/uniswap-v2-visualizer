const _ = require("lodash")

/**
 * @param {string} key
 * @param value
 */
function setGlobalKey(key, value) {
    try {
        global[key] = value
    } catch (error) {
        throw error
    }
}

/**
 * @param {string} key
 */
function getGlobalKey(key) {
    try {
        return global[key]
    } catch (error) {
        throw error
    }
}

/**
 * @param {string} key
 */
function deleteGlobalKey(key) {
    try {
        delete global[key]
    } catch (error) {
        throw error
    }
}

module.exports = {
    setGlobalKey: setGlobalKey,
    getGlobalKey: getGlobalKey,
    deleteGlobalKey: deleteGlobalKey,
}
