cleos wallet unlock -n alice --password $ALICEPassWD
alias kcleos="cleos -u https://api-kylin.eoslaomao.com"
kcleos set contract ring ../ ring.wasm ring.abi
cleos wallet lock -n alice