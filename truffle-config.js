require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');


module.exports = {
  networks: {
    ropsten:{
      provider:function(){
        return new HDWalletProvider(process.env.PRIVATE_KEY, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`)
          console.log(provider)
      },
      gasPrice:2500000000,
      network_id:3
    }
    ,
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
   contracts_build_directory: './frontend/src/contracts',
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
}
