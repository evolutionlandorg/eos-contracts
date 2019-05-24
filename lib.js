const {api, noAuthApi, rpc} = require("./utils");

async function getBalance(code, scope) {
    let result = await rpc.get_table_rows({
        json: true, //json
        code: code,//CONTRACT_NAME
        scope: scope,// SCOPE_ACCOUNT (Normally contract)
        table: "accounts", // TABLE_NAME
        lower_bound: "0",// index low >=
        upper_bound: "-1",// index high <
        limit: "10",// county
        key_type: "i64",//
        index_position: "1" //
    });
    return result.rows[0].balance
}

async function sendToken(from, to, account, amount) {
    let data = {from: from, to: to, quantity: amount, memo: ''};
    return await this.sendTrans(from, account, "transfer", data)
}

async function sendTrans(from, account, action, data) {
    let result = await api.transact({
        actions: [{
            account: account,
            name: action,
            authorization: [{
                actor: from,
                permission: 'active',
            }],
            data: data,
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
    return result.transaction_id
}

async function notOwnerSendTrans(from, account, action, data) {
    let result = await noAuthApi.transact({
        actions: [{
            account: account,
            name: action,
            authorization: [{
                actor: from,
                permission: 'active',
            }],
            data: data,
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
    return result.transaction_id
}


async function awaitBeforeGetReceipt(tx) {
    while (true) {
        let ret = await rpc.history_get_transaction(tx);
        if (ret.traces[0].producer_block_id) {
            break
        }
    }
    return true
}


module.exports = {
    getBalance,
    sendToken,
    awaitBeforeGetReceipt,
    sendTrans,
    notOwnerSendTrans,
};
