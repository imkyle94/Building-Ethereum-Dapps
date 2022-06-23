module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "localhost", 
      port: 8545,
      network_id: 3,    
      from: "0x70e36be8ab8f6cf66c0c953cf9c63ab63f3fef02",
      gas: 4000000	  
	} 	
  }
};
