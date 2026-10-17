// Claude (Anthropic, https://claude.ai) was used.

const http = require("http");
const MESSAGES = require("../lang/en/en");

const BASE_PATH = "/lab5/api/v1/sql";

class ApiServer {
    constructor(config, database) {
        this.config = config;
        this.database = database;
        this.server = http.createServer((req, res) => this.handleRequest(req, res));
    }

    start() {
        this.server.listen(this.config.port, () => {
            console.log(MESSAGES.SERVER_RUNNING + this.config.port);
        });
    }

    setCorsHeaders(res) {
        res.setHeader("Access-Control-Allow-Origin", this.config.allowedOrigin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    sendJson(res, statusCode, data) {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    }

    async handleRequest(req, res) {
        this.setCorsHeaders(res);

        try {
            const url = new URL(req.url, "http://localhost");

            if (req.method === "OPTIONS") {
                res.writeHead(204);
                res.end();
            } else if (!url.pathname.startsWith(BASE_PATH)) {
                this.sendJson(res, 404, { success: false, message: MESSAGES.NOT_FOUND });
            } else if (req.method === "GET") {
                await this.handleGet(url, res);
            } else if (req.method === "POST") {
                this.handlePost(req, res);
            } else {
                this.sendJson(res, 404, { success: false, message: MESSAGES.NOT_FOUND });
            }
        } catch (error) {
            this.sendJson(res, 500, { success: false, message: MESSAGES.SERVER_ERROR });
        }
    }

    async handleGet(url, res) {
        let sql = decodeURIComponent(url.pathname.slice(BASE_PATH.length + 1)).trim();

        if (sql.startsWith("\"") && sql.endsWith("\"")) {
            sql = sql.slice(1, -1);
        }

        if (sql === "") {
            this.sendJson(res, 400, { success: false, message: MESSAGES.INVALID_INPUT });
            return;
        }

        try {
            const rows = await this.database.select(sql);
            this.sendJson(res, 200, { success: true, message: MESSAGES.SELECT_SUCCESS, data: rows });
        } catch (error) {
            this.sendJson(res, 400, { success: false, message: MESSAGES.DB_ERROR + error.message });
        }
    }

    handlePost(req, res) {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            let sql = "";
            try {
                sql = JSON.parse(body).query || "";
            } catch (error) {
                sql = "";
            }

            if (sql.trim() === "") {
                this.sendJson(res, 400, { success: false, message: MESSAGES.INVALID_INPUT });
                return;
            }

            try {
                const result = await this.database.insert(sql);
                this.sendJson(res, 201, {
                    success: true,
                    message: MESSAGES.INSERT_SUCCESS,
                    rowsInserted: result.affectedRows
                });
            } catch (error) {
                this.sendJson(res, 400, { success: false, message: MESSAGES.DB_ERROR + error.message });
            }
        });
    }
}

module.exports = ApiServer;