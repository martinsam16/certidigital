
compile:
	truffle compile

deploy:
	truffle deploy --network development

console:
	truffle console --network development

#truffle build
#truffle deploy --network development
#
#https://www.trufflesuite.com/docs/truffle/getting-started/using-truffle-develop-and-the-console
#https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts
#truffle console --network development
#    let instance = await Certidigital.deployed()
#    let accounts = await web3.eth.getAccounts()
#     instance.crearCertificado(accounts[0],'titulo','hashfile','12/12/2020','25/12/2021','url');
#    instance.obtenerCertificado('hashfile');
#:8545
#truffle develop
