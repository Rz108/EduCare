const app = require("./controller/app");
const serveStatic = require('serve-static');

const PORT = 8081;

app.use(serveStatic(__dirname));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});