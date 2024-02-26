const Web3 = require("web3");
const _ = require("lodash");
const logger = require("numan-logger");

const globalLib = require("./global.lib");
const PROVIDER_GLOBAL_KEY = "ETH_PROVIDER"

function connect(rpcUrl) {
    try {
        if (_.isEmpty(rpcUrl)) {
            throw new Error(`Missing args! rpcUrl: ${rpcUrl}`);
        }


        if (rpcUrl.startsWith("ws")) {
            globalLib.setGlobalKey(PROVIDER_GLOBAL_KEY, new Web3(rpcUrl, {
                reconnect: {
                    auto: true,
                    delay: 1000, // ms
                    onTimeout: false,

                },
                timeout: 5000, // ms
                clientConfig: {
                    maxReceivedFrameSize: 10000000000,
                    maxReceivedMessageSize: 10000000000,
                    keepalive: true,
                    keepaliveInterval: 1000, // ms
                    dropConnectionOnKeepaliveTimeout: true,
                    keepaliveGracePeriod: 4000, // ms
                },
            }));
        } else if (rpcUrl.startsWith("http")) {
            globalLib.setGlobalKey(PROVIDER_GLOBAL_KEY, new Web3(rpcUrl, {
                keepAlive: true,
                timeout: 50000,
                withCredentials: false,
            }));
        } else {
            throw new Error(`Invalid rpcUrl scheme! rpcUrl:${rpcUrl}`)
        }

        logger.logInfo(`Web3 connected!`)
    } catch (error) {
        throw error;
    }
}

function isWeb3ProviderConnected() {
    try {
        return !_.isEmpty(globalLib.getGlobalKey(PROVIDER_GLOBAL_KEY));
    } catch (error) {
        throw error;
    }
}

function getWeb3Provider() {
    try {
        if (!isWeb3ProviderConnected()) {
            throw new Error(`Web3 provider not connected!`);
        }

        return globalLib.getGlobalKey(PROVIDER_GLOBAL_KEY);
    } catch (error) {
        throw error;
    }
}


module.exports = {
    connect: connect,
    isWeb3ProviderConnected: isWeb3ProviderConnected,
    getWeb3Provider: getWeb3Provider
}