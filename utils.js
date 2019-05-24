const {Api, JsonRpc} = require('eosjs');
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default;

const {TextEncoder, TextDecoder} = require('util');
const fetch = require("node-fetch");

let endpoint = 'https://api-kylin.eoslaomao.com';

const customizedFetch = function (input, init) {
    let headers = {};
    // headers["Authorization"] = `Bearer ${jwtKey}`;
    headers["X-Eos-Push-Guarantee"] = "in-block";
    init.headers = headers;
    return fetch(input, init)
};
const rpc = new JsonRpc(endpoint, {fetch: customizedFetch});

const account_name = "freeheresun1";
const defaultPrivateKey = ""; // freeheresun1
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const api = new Api({rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

const guestPrivateKey = ""; // freeheresun2
const guestSignatureProvider = new JsSignatureProvider([guestPrivateKey]);
const noAuthApi = new Api({
    rpc,
    signatureProvider: guestSignatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});

function randomName(len) {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
    let maxPos = chars.length;
    let str = '';
    for (i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
}

module.exports = {
    rpc,
    api,
    noAuthApi,
    account_name,
    randomName
};