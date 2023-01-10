const midtransClient = require('midtrans-client');
const midtransSnap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: process.env.MIDTRANS_TOKEN
});

module.exports = midtransSnap