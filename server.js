let http = require('http')
let fs = require('fs')
let path = require('path')

let server = http.createServer((req, res) => {
    console.log('request: ' + req.url)

    let filePath = '.' + req.url
    if (filePath == './')
        filePath = './index.html'
    
    else if (filePath == './data'){
        filePath = './data.js'
    }

    let extname = String(path.extname(filePath)).toLowerCase()
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.jpg': 'image/jpg'
    }
    let contentType = mimeTypes[extname]

    fs.readFile(filePath, (err, content) => {
        if (err)
            res.end('there is an error')
        else {
            res.writeHead(200, {'Content-Type': contentType})
            res.end(content, 'utf-8')
        }
    })
})

server.listen(9000, '127.0.0.1')

console.log('listening to port 9000')