const http = require("http");

const message = process.env.MESSAGE;

const server = http.createServer((req, res) => {
  res.end(message);
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});