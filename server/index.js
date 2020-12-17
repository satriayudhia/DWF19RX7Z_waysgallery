const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const router = require('./src/routes')

const port = 5001

app.use(express.json())

app.use("/uploads", express.static("uploads"));

app.use('/api/v1', router)

app.listen(port, () => console.log(`port ${port} berhasil dijalankan`))