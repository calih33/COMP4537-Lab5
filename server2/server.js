// Entry point for server2 (origin 2).
// Claude (Anthropic, https://claude.ai) was used.
const Database = require("./modules/database");
const ApiServer = require("./modules/apiServer");
const Config = require("./modules/config");

class App {
    constructor() {
        this.config = new Config();
        this.database = new Database(this.config);
        this.apiServer = new ApiServer(this.config, this.database);
    }

    start() {
        this.apiServer.start();
    }
}

const app = new App();
app.start();