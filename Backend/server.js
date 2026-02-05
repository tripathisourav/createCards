
require('dotenv').config()

const app = require('./src/app')
const connectToDB = require('./src/config/Database')

connectToDB()


app.listen(3000, () => {
    console.log('server is running at port 3000')
})