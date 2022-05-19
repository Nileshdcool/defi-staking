const Teather = artifacts.require('Teather');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function (deployer, network, accounts) {
    // deploy mock Teather Contract
    await deployer.deploy(Teather);
    const teather = await Teather.deployed();

    // Deplot RWD Contract
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    // Deploy DecentralBank Contract
    await deployer.deploy(DecentralBank,rwd.address, teather.address);
    const decentralBank = await DecentralBank.deployed();

    // transfer all RWD tokens to Decentral bank
    await rwd.transfer(decentralBank.address, '1000000000000000000000000');

    // distribute 100 Teather tokens to investor
    await teather.transfer(accounts[1], '100000000000000000000');
}



