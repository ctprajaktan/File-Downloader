const express = require("express");
const nodeFetch = require("node-fetch");
const util = require("util");
const app = express();
const fs = require("fs");
const streamPipeline = util.promisify(require('stream').pipeline)


app.get("/fetch", async (req, res) => {
    try {
        const { imgUrl } = req.query;
        const ext = imgUrl.split(".").pop();
        const startTime = Date.now();
        const imageData = await nodeFetch(imgUrl);

        const fileName = `${(new Date()).toISOString()}.${ext}`;

        await streamPipeline(imageData.body, fs.createWriteStream(fileName));

        const processTime = Date.now() - startTime;
        const stats = fs.statSync(`./${fileName}`)

        return res.status(200).json({ fileSize: `${stats.size / 1024} kb`, processTime: `${processTime} ms` })
    } catch (e) {
        return res.status(500).json({ "message": "Internal Server Error" })
    }
})

app.listen(3000, () => {
    console.log("server started")
})