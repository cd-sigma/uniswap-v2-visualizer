const _ = require("lodash");
const web3Lib = require("./web3.lib");

const erc20Abi = require("../abi/erc20.abi.json");
const uniswapV2PoolAbi = require("../abi/uniswap.v2.pool.abi.json");

async function getKValueForPool(poolAddress) {
    try {
        if (_.isEmpty(poolAddress)) {
            throw new Error(`Missing args! poolAddress ${poolAddress}`);
        }

        const web3 = web3Lib.getWeb3Provider();
        const pool = new web3.eth.Contract(uniswapV2PoolAbi, poolAddress);
        const reserves = await pool.methods.getReserves().call();

        return reserves[0] * reserves[1]
    } catch (error) {
        throw error;
    }
}

async function getPlotDataForConstantProductFormula(poolAddress, k) {
    try {
        if (_.isNil(k) || _.isEmpty(poolAddress)) {
            throw new Error(`Missing args! k: ${k} poolAddress: ${poolAddress}`);
        }


        const {x: startingX} = await getCurrentPriceOnCurve(poolAddress);

        const web3 = web3Lib.getWeb3Provider();
        const pool = new web3.eth.Contract(uniswapV2PoolAbi, poolAddress);
        const [token0Address, reserves] = await Promise.all([pool.methods.token0().call(), pool.methods.getReserves().call()]);
        const token0 = new web3.eth.Contract(erc20Abi, token0Address);
        const token0Decimals = await token0.methods.decimals().call();
        const xStepSize = ((5 * reserves[0]) / (10 ** token0Decimals) / 100) * 10 ** token0Decimals;

        const NO_OF_PLOT_POINTS = 500;

        let iterPlot = 0,
            points = []

        while (iterPlot < NO_OF_PLOT_POINTS) {
            let xPoint = startingX + (iterPlot * xStepSize);
            let yPoint = k / xPoint;
            points.push({
                x: xPoint,
                y: yPoint
            })
            iterPlot++;
        }

        return points
    } catch (error) {
        throw error;
    }
}

async function getCurrentPriceOnCurve(poolAddress) {
    try {
        if (_.isEmpty(poolAddress)) {
            throw new Error(`Missing args! poolAddress ${poolAddress}`);
        }

        const web3 = web3Lib.getWeb3Provider();
        const pool = new web3.eth.Contract(uniswapV2PoolAbi, poolAddress);
        const reserves = await pool.methods.getReserves().call();

        return {
            x: parseInt(reserves[0]),
            y: parseInt(reserves[1])
        }
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getKValueForPool: getKValueForPool,
    getPlotDataForConstantProductFormula: getPlotDataForConstantProductFormula,
    getCurrentPriceOnCurve: getCurrentPriceOnCurve
}