// Claude (Anthropic, https://claude.ai) was used.

const mysql = require("mysql2/promise");

const CREATE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS patient (
        patientid INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATETIME NOT NULL,
        PRIMARY KEY (patientid)
    ) ENGINE=InnoDB`;

class Database {
    constructor(config) {
        this.writerPool = mysql.createPool({
            host: config.db.host,
            database: config.db.database,
            user: config.writer.user,
            password: config.writer.password,
            dateStrings: true
        });

        this.readerPool = mysql.createPool({
            host: config.db.host,
            database: config.db.database,
            user: config.reader.user,
            password: config.reader.password,
            dateStrings: true
        });
    }

    async ensureTable() {
        await this.writerPool.query(CREATE_TABLE_SQL);
    }

    async insert(sql) {
        await this.ensureTable();
        const result = await this.writerPool.query(sql);
        return result[0];
    }

    async select(sql) {
        await this.ensureTable();
        const result = await this.readerPool.query(sql);
        return result[0];
    }
}

module.exports = Database;