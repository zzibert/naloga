let http = require('http')
let https = require('https')
let fs = require('fs')
let path = require('path')
let url = ''
let client = ''

let server = http.createServer((req, res) => {
    console.log('request: ' + req.url)

    let filePath = '.' + req.url
    if (filePath == './')
        filePath = './index.html'
    
    else if (filePath.match('./data')){
        url = filePath.split('data')[1]
        filePath = './data.json'
    }

    let extname = String(path.extname(filePath)).toLowerCase()
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
    }
    let contentType = mimeTypes[extname]

    if (filePath == './data.json'){
        if (url.match('https'))
            client = https
        else
            client = http
        client.get(url, resp => {
            let body = ''

            resp.on('data', chunk => {
                body += chunk
            })
            resp.on('end', () => {
                res.writeHead(200, {'Content-Type': contentType})
                res.end(body, 'utf-8')
            })
        })
    }
    else {
        fs.readFile(filePath, (err, content) => {
            if (err)
                res.end('there is an error')
            else {
                res.writeHead(200, {'Content-Type': contentType})
                res.end(content, 'utf-8')
            }
        })
    }
})

server.listen(9000, '127.0.0.1')

console.log('listening to port 9000')