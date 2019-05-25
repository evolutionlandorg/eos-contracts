cleos wallet unlock -n test --password PW5Js2WLHsXZ4qL3hifPR6GrhMP5VtxwT8MYGiXdXjNk3CSUz8JMU
alias kcleos="cleos -u https://api-kylin.eoslaomao.com"

#kcleos set account permission evotokenring active '{"threshold": 1,"keys": [{"key": "EOS6ALdaBmiRgv3Hna5tnKxPuHSMsrud9s6cBEZ2pNJGLeQT22wkh","weight": 1},{"key": "EOS6x2Wn5DboM9Q929sfsBYLx5CpV7hyvcH3W9URm4daWg42eSBG8","weight": 1}]}' owner -p evotokenring@owner

#kcleos set account permission evotokenring active '{"threshold": 1,"keys": [{"key": "EOS6ALdaBmiRgv3Hna5tnKxPuHSMsrud9s6cBEZ2pNJGLeQT22wkh","weight": 1},{"key": "EOS6x2Wn5DboM9Q929sfsBYLx5CpV7hyvcH3W9URm4daWg42eSBG8","weight": 1}],"accounts": [{"permission":{"actor":"updateauth","permission":"eosio.code"},"weight":1}]}' owner -p evotokenring@owner


kcleos set contract evotokenring ./ token.wasm token.abi

cleos wallet lock -n test