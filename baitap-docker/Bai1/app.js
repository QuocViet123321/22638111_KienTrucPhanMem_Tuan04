const http = require("http");

// Tạo server
const server = http.createServer((req, res) => {
  res.write("Hello, Docker!");
  res.end();
});

// Lắng nghe port 3000
server.listen(3000, () => {
  console.log("Server running on port 3000");
});