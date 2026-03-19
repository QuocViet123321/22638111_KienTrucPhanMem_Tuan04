const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello Node Multi-stage");
});

server.listen(3000);