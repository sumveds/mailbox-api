module.exports = {
    protocol: 'http',
    port: 4004,
    version: 'v1',
    salt_rounds: 10,
    mysql: {
        connectionLimit: 25,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'mailbox'
    }
};
