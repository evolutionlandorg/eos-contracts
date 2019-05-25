eosio-cpp -abigen -I ./include -contract token -o token.wasm eosio.token/eosio.token.cpp

eosio-cpp -abigen -I ./include -contract dgoods -o dgoods.wasm dgoods/dgoods.cpp