
const http = require('http')
require('dotenv').config({path: 'variables.env'})
const app = require('./app.js')

const port = process.env.port || "3000"

const server = http.createServer(app)

server.listen(port)

server.on("listening", function(){
    console.log(`listening on port ${port}`)
})

server.on('error', function(err){
    console.error(err)
    process.exit(1)
})

