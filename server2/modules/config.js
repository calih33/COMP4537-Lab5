// Claude (Anthropic, https://claude.ai) was used.

const fs = require("fs");
const path = require("path");

class Config {
    constructor() {
        this.loadEnvFile(path.join(__dirname, "..", ".env"));

        this.port = Number(process.env.PORT) || 3000;
        this.allowedOrigin = process.env.CLIENT_ORIGIN || "*";

        this.db = {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME
        };
        this.writer = {
            user: process.env.DB_WRITER_USER,
            password: process.env.DB_WRITER_PASSWORD
        };
        this.reader = {
            user: process.env.DB_READER_USER,
            password: process.env.DB_READER_PASSWORD
        };
    }

    loadEnvFile(filePath) {
        if (!fs.existsSync(filePath)) {
            return;
        }
        const lines = fs.readFileSync(filePath, "utf8").split("\n");
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed === "" || trimmed.startsWith("#")) {
                return;
            }
            const equalsIndex = trimmed.indexOf("=");
            const key = trimmed.slice(0, equalsIndex);
            const value = trimmed.slice(equalsIndex + 1);
            process.env[key] = value;
        });
    }
}

module.exports = Config;