

const RWD = artifacts.require('RWD');
const Teather = artifacts.require('Teather');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('DecentralBank', ([owner, customer]) => {
    let teather, rwd, decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number, 'ether');
    }

    before(async () => {
        teather = await Teather.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, teather.address);
        // await 
    });

    describe('Mock Teather Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await teather.name();
            assert.equal(name, 'Teather');

            // tranmsfer all tokens to decentralBank (1 million)

            await rwd.transfer(decentralBank.address, tokens('1000000'));

            //transfer 100 miock tokens to customer

            await teather.transfer(customer, tokens('100'), { from: owner })


        })
    })
    describe('Mock Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name();
            assert.equal(name, 'Reward Token');
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank');
        });
        it('contract has token', async () => {
            let balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, tokens('1000000'));
        });
    })
})

