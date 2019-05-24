const {RpcError} = require('eosjs');
const util = require("../utils");
const lib = require("../lib");
const assert = require('assert');
const target = "freeheresun2";
const ringToken = "freeheresun1";

describe('create', function () {
    it('create need authority', async () => {
        let data = {issuer: ringToken, maximum_supply: "10000.000000000 BTC"};
        try {
            await lib.notOwnerSendTrans(target, ringToken, "create", data)
        } catch (e) {
            if (e instanceof RpcError) {
                assert.equal(e.json.error.what, "Missing required authority");
            }
        }
    });
    it('create success', async () => { // if this token
        data = {issuer: ringToken, maximum_supply: "10000.000000000 RING"};
        try {
            await lib.sendTrans(util.account_name, ringToken, "create", data);
        } catch (e) {
            if (e.json.error.details[0].message === "assertion failure with message: token with symbol already exists") {
                assert.ok()
            } else {
                assert.fail()
            }
        }
    });
});


describe('issue', function () {
    it('sym invalid symbol name', async () => {
        let data = {to: util.account_name, quantity: "10000.000000000", memo: "memo"};
        try {
            await lib.sendTrans(util.account_name, ringToken, "issue", data)
        } catch (e) {
            if (e instanceof RpcError) {
                assert.equal(e.json.error.what, "eosio_assert_message assertion failure");
            }
        }
    });

    it('invalid memo', async () => {
        data = {to: util.account_name, quantity: "10.000000000 RING", memo: util.randomName(257)};
        try {
            await lib.sendTrans(util.account_name, ringToken, "issue", data)
        } catch (e) {
            if (e instanceof RpcError) {
                assert.equal(e.json.error.details[0].message, "assertion failure with message: memo has more than 256 bytes");
            }
        }
    });
    it('not exist symbol name', async () => {
        data = {to: util.account_name, quantity: "10.000000000 BRING", memo: "memo"};
        try {
            await lib.sendTrans(util.account_name, ringToken, "issue", data)
        } catch (e) {
            if (e instanceof RpcError) {
                assert.equal(e.json.error.details[0].message, "assertion failure with message: token with symbol does not exist, create token before issue");
            }
        }
    });
    it('should issues success and account balance true', async () => {
        let owner = await lib.getBalance(ringToken, util.account_name);
        data = {to: util.account_name, quantity: "10.000000000 RING", memo: "memo"};
        let tx = await lib.sendTrans(util.account_name, ringToken, "issue", data);
        await lib.awaitBeforeGetReceipt(tx);
        let owner_now = await lib.getBalance(ringToken, util.account_name);
        assert.equal(Number(owner.split(" ")[0]) + 10, Number(owner_now.split(" ")[0]));
    });

    it('should not issues exceeded circulation', async () => {
        data = {to: util.account_name, quantity: "10000000.000000000 RING", memo: "memo"};
        try {
            await lib.sendTrans(util.account_name, ringToken, "issue", data);
        } catch (e) {
            assert.equal(e.json.error.details[0].message, "assertion failure with message: quantity exceeds available supply");
        }
    });


});


describe('Transfer', function () {
    it('should account balance true', async () => {
        let owner = await lib.getBalance(ringToken, util.account_name);
        let target_account = await lib.getBalance(ringToken, target);
        let tx = await lib.sendToken(util.account_name, target, ringToken, '1.000000000 RING');
        await lib.awaitBeforeGetReceipt(tx);
        let owner_now = await lib.getBalance(ringToken, util.account_name);
        let target_now = await lib.getBalance(ringToken, target);
        assert.equal(Number(owner.split(" ")[0]) - 1, Number(owner_now.split(" ")[0]));
        assert.equal(Number(target_account.split(" ")[0]) + 1, Number(target_now.split(" ")[0]));
    });

    it('should not be able to send tokens with excess balance', async () => {
        let owner = await lib.getBalance(ringToken, util.account_name);
        try {
            await lib.sendToken(util.account_name, target, ringToken, `${Number(owner.split(" ")[0]) + 1}.000000000 RING`);
        } catch (e) {
            assert.equal(e.json.error.details[0].message, "assertion failure with message: overdrawn balance");
        }
    });

    it('Should not be able to send tokens less than 0', async () => {
        try {
            await lib.sendToken(util.account_name, target, ringToken, `-1 RING`);
        } catch (e) {
            assert.equal(e.json.error.details[0].message, "assertion failure with message: must transfer positive quantity");
        }
    });
    it('invalid memo', async () => {
        try {
            await lib.sendToken(util.account_name, target, ringToken, util.randomName(257))
        } catch (e) {
            if (e instanceof RpcError) {
                assert.equal(e.json.error.details[0].message, "assertion failure with message: memo has more than 256 bytes");
            }
        }
    });

});


// describe('Transferbyid', function () { //todo assertion failure with message: unable to find key
//     it('should account balance true', async () => {
//         let owner = await lib.getBalance(ringToken, util.account_name);
//         let target_account = await lib.getBalance(ringToken, target);
//         let data = {from: util.account_name, to: target, amount_account: util.account_name, amount_id: 0, memo: "memo"};
//         let tx = await lib.sendTrans(util.account_name, ringToken, "transferbyid", data);
//         await lib.awaitBeforeGetReceipt(tx);
//         let owner_now = await lib.getBalance(ringToken, util.account_name);
//         let target_now = await lib.getBalance(ringToken, target);
//
//         assert.equal(Number(owner.split(" ")[0]) - 1, Number(owner_now.split(" ")[0]));
//         assert.equal(Number(target_account.split(" ")[0]) + 1, Number(target_now.split(" ")[0]));
//     });
// });


describe('retire', function () {
    it('should account after retire balance true', async () => {
        let owner = await lib.getBalance(ringToken, util.account_name);
        let data = {quantity: "1.000000000 RING", memo: "memo"};
        let tx = await lib.sendTrans(util.account_name, ringToken, "retire", data);
        await lib.awaitBeforeGetReceipt(tx);
        let owner_now = await lib.getBalance(ringToken, util.account_name);
        assert.equal(Number(owner.split(" ")[0]) - 1, Number(owner_now.split(" ")[0]));
    });
});
