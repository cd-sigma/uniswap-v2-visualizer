require("dotenv").config({path: "./.env"})

const _ = require("lodash");
const logger = require("numan-logger");
const express = require("express");

const web3Lib = require("./libs/web3.lib");
const uniswapLib = require("./libs/uniswap.lib");

const app = express();
const PORT = 3000;

(async () => {
    try {
        web3Lib.connect(process.env.ETH_WS_PROVIDER_URL)
        app.set("view engine", "ejs");

        app.get("/", (req, res) => {
            return res.render("home")
        })

        app.get("/uniswap/:poolAddress", async (req, res) => {
            const {poolAddress} = req.params;

            if (_.isEmpty(poolAddress)) {
                return res.json({
                    error: `Missing args! poolAddress: ${poolAddress}`
                })
            }

            const k = await uniswapLib.getKValueForPool(poolAddress);
            const plotDataForPoolCurve = await uniswapLib.getPlotDataForConstantProductFormula(poolAddress,k);
            const currentPricePoint = await uniswapLib.getCurrentPriceOnCurve(poolAddress);

            return res.render("graph", {
                plotData: JSON.stringify({
                    poolCurve: plotDataForPoolCurve,
                    currentPricePoint: [currentPricePoint]
                })
            })
        })

        app.listen(PORT, () => {
            logger.logInfo(`Server started on port: ${PORT}`)
        })
    } catch (error) {
        logger.logError(error);
        process.exit(1);
    }
})();