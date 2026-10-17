// Claude (Anthropic, https://claude.ai) was used in the creation of this file

const API_URL = "https://api.caliheung.com/lab5/api/v1/sql";

const INSERT_SQL =
    "INSERT INTO patient (name, dateOfBirth) VALUES " +
    "('Sara Brown', '1901-01-01'), " +
    "('John Smith', '1941-01-01'), " +
    "('Jack Ma', '1961-01-30'), " +
    "('Elon Musk', '1999-01-01')";

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async insert(sql) {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: sql })
        });
        return response.json();
    }

    async select(sql) {
        const response = await fetch(this.baseUrl + "/" + encodeURIComponent(sql));
        return response.json();
    }
}

class App {
    constructor(api) {
        this.api = api;
        this.insertBtn = document.getElementById("insertBtn");
        this.insertResponse = document.getElementById("insertResponse");
        this.queryInput = document.getElementById("queryInput");
        this.queryBtn = document.getElementById("queryBtn");
        this.queryResponse = document.getElementById("queryResponse");
    }

    init() {
        document.getElementById("insertHeading").textContent = MESSAGES.INSERT_HEADING;
        document.getElementById("queryHeading").textContent = MESSAGES.QUERY_HEADING;
        this.insertBtn.textContent = MESSAGES.INSERT_BUTTON;
        this.queryBtn.textContent = MESSAGES.QUERY_BUTTON;
        this.queryInput.placeholder = MESSAGES.QUERY_PLACEHOLDER;

        this.insertBtn.addEventListener("click", () => this.handleInsert());
        this.queryBtn.addEventListener("click", () => this.handleQuery());
    }

    async handleInsert() {
        this.insertResponse.textContent = MESSAGES.LOADING;
        try {
            const result = await this.api.insert(INSERT_SQL);
            this.show(this.insertResponse, result);
        } catch (error) {
            this.insertResponse.textContent = MESSAGES.NETWORK_ERROR + error.message;
        }
    }

    async handleQuery() {
        const sql = this.queryInput.value.trim();
        if (sql === "") {
            this.queryResponse.textContent = MESSAGES.EMPTY_QUERY;
            return;
        }

        this.queryResponse.textContent = MESSAGES.LOADING;
        try {
            const result = await this.api.select(sql);
            this.show(this.queryResponse, result);
        } catch (error) {
            this.queryResponse.textContent = MESSAGES.NETWORK_ERROR + error.message;
        }
    }

    show(element, data) {
        element.textContent = JSON.stringify(data, null, 2);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new App(new ApiClient(API_URL));
    app.init();
});
