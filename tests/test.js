const { JsonRpc } = require('eosjs');
const fetch = require('node-fetch');           // node only; not needed in browsers
// const rpc = new JsonRpc('https://api.eosnewyork.io', { fetch });
const rpc = new JsonRpc('http://localhost:8888', { fetch });

const run = async function() {
    const resp = await rpc.get_table_rows({
        json: true,              // Get the response as json
        code: 'test',     // Contract that we target
        scope: 'test',         // Account that owns the data
        table: 'accounts',        // Table name
        limit: 10,               // Maximum number of rows that we want to get
        // reverse = false,         // Optional: Get reversed data
        // show_payer = false,      // Optional: Show ram payer
    });

    console.log(resp.rows);
}

run();
