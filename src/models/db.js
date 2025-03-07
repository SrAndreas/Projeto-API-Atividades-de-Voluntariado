const RocksDB = require('rocksdb');
const path = require('path');

const db = new RocksDB(path.join(__dirname, '../../db'));

db.open({ readOnly: false }, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err);
    } else {
        console.log('Banco de dados RocksDB aberto com sucesso!');
    }
});

module.exports = db;