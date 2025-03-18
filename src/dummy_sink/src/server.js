const http = require('http')

const PORT = process.env.PORT || 8000;

const server = http.createServer(function(request, response) {
  console.dir(request.param)

  if (request.method == 'POST') {
    console.log('POST')
    var body = ''
    request.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    request.on('end', function() {
      console.log('Body: ' + body)
      body = JSON.parse(body)
      // If key "position" is found in the body, then print it
      if (body.hasOwnProperty('position')) {
        console.log('Got position !')
        console.log(body)
        console.log(body['position'])
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end('Position received')
      } else if (body.hasOwnProperty('text')) {
        console.log('Got text !')
        console.log(body['text'])
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end('Text received')
      } else if (body.hasOwnProperty('status')) {
        console.log('Got status !')
        console.log(body['status'])
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end('Status received')
      } else {
        console.log('No key found')
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end('No key found')
      }
    })
  } else {
    console.log('GET')
    // Answer with empty body
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('')
  }
})

const port = PORT
const host = '0.0.0.0'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)