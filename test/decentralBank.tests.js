const assert = require('assert');

// @ts-ignore
const RWD = artifacts.require('RWD');
// @ts-ignore
const Teather = artifacts.require('Teather');
// @ts-ignore
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
    .use(require('chai-as-promised'))
    .should()


// @ts-ignore
contract('DecentralBank', ([owner, customer]) => {
    let teather, rwd, decentralBank;

    function tokens(number) {
        // @ts-ignore
        return web3.utils.toWei(number, 'ether');
    }

    // @ts-ignore
    before(async () => {
        teather = await Teather.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, teather.address);
        // await 
    });

    describe('Mock Teather Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await teather.name();
            // @ts-ignore
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
            // @ts-ignore
            assert.equal(name, 'Reward Token');
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name();
            // @ts-ignore
            assert.equal(name, 'Decentral Bank');
        });
        it('contract has token', async () => {
            let balance = await rwd.balanceOf(decentralBank.address);
            // @ts-ignore
            assert.equal(balance, tokens('1000000'));
        });
    });

    describe('Yield farming', async () => {
        it('reward tokens for staking', async () => {
            let result = await teather.balanceOf(customer);
            // @ts-ignore
            assert.equal(result.toString(), tokens('100'), 'customer wallet balance before staking');
            // check investors balance
            await teather.approve(decentralBank.address, tokens('100'), { from: customer });
            await decentralBank.depositTokens(tokens('100'), { from: customer });
            // check update balance of customerter
            result = await teather.balanceOf(customer);

            assert.equal(result.toString(), tokens('0'), 'customer wallet balance after staking');

            // // check updated balance of decentral bank
            result = await teather.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('100'), 'decentralbank wallet balance after staking');


            // // is staking balance
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'true', 'customer staking status after staking');

            // // issue tokens
            await decentralBank.issueTokens({ from: owner });

            await decentralBank.issueTokens({ from: customer }).should.be.rejected;

            // unstake toklens

            await decentralBank.unstakeTokens({ from: customer });

            // check unstakeing balances


            // check update balance of customerter
            result = await teather.balanceOf(customer);

            assert.equal(result.toString(), tokens('100'), 'customer wallet balance after unstaking');

            // // check updated balance of decentral bank
            result = await teather.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('0'), 'decentralbank wallet balance after unstaking');


            // // is staking balance
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'false', 'customer staking status after unstaking');


        });
    })
})

