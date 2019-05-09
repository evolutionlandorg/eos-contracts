const { JsonRpc } = require('eosjs');
const fetch = require('node-fetch');           // node only; not needed in browsers
const rpc = new JsonRpc('https://api.eosnewyork.io', { fetch });

const run = async function() {
    const resp = await rpc.get_table_rows({
        json: true,              // Get the response as json
        code: 'eosio.token',     // Contract that we target
        scope: 'ageleeagelee',         // Account that owns the data
        table: 'accounts',        // Table name
        limit: 10,               // Maximum number of rows that we want to get
        // reverse = false,         // Optional: Get reversed data
        // show_payer = false,      // Optional: Show ram payer
    });

    console.log(resp.rows);
}

run();
