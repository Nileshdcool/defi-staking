const Teather = artifacts.require('Teather');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function (deployer) {
    await deployer.deploy(Teather);
    await deployer.deploy(RWD);
    await deployer.deploy(DecentralBank);
}



