const express = require ('express')
const app = express ()
const port = 8080
import products from "./routes/products.router.js"
const http = require('http')


app.get('/', (req, res) =>{
    res.send('hello API !')
})
const server = http.createServer((req, res) =>{
    res.writeHead(200,{
        'Content-Type': 'text/plain',
    })
    res.end('Hello!')
})

server.listen(port, () =>{
    console.log(`listening on port ${port}...`)
})
    