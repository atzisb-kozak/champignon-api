let config = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "champyresi",
    password: "champyresi",
    database: "champyresi",
    synchronize: true,
    logging: true,
    entities: ["src/database/models/*.{ts,js}"]
};

module.exports = config;