//a node web server.
var http = require("http");
var url = require("url");
var fs = require('fs');
function start() {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        //静态资源服务器
        //fs.readFile(filename,[options],callback);
        if (pathname === '/') {
            fs.readFile(__dirname + '/Main.html', function(err, file){
                if (err) throw err;
                response.write(file, 'binary');
                response.end();
            });
        } else {
            fs.readFile(__dirname + pathname, 'binary', function(err, file){
                if (err && err.code === 'ENOENT') {
                    response.writeHead(404, {'Content-Type': 'text/plain'});
                    response.write(err + "\n");
                    response.end();
                } else if (err) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.write(err + "\n");
                    response.end();
                } else {
                    var type = pathname.slice(pathname.lastIndexOf('.') + 1);
                    switch (type) {
                        case 'css':
                            response.writeHead(200, {'Content-Type': 'text/css'});
                            break;
                        case 'js':
                            response.writeHead(200, {'Content-Type': 'text/javascript'});
                            break;
                        case 'png':
                            response.writeHead(200, {'Content-Type': 'image/png'});
                            break;
                        case 'jpg':
                            response.writeHead(200, {'Content-Type': 'image/jpeg'});
                            break;
                        case 'svg':
                            response.writeHead(200, {'Content-Type': 'text/xml'});
                            break;
                        default:
                            break;
                    }
                    response.write(file, 'binary');
                    response.end();
                }
            });
        }
    }
    var port = process.argv[2] || 3000;
    http.createServer(onRequest).listen(port);
    console.log("Server has started at port " + port);
}
start();