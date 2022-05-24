// @ts-nocheck
import React, { Component } from "react";
import Navbar from "./Navbar.jsx";
import Web3 from 'web3';
import Teather from '../truffle_abis/Teather.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main'

class App extends Component {

    async UNSAFE_componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }


    async loadWeb3() {
        if (window.ethereum) {
            // @ts-ignore
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("No ethereu browser detected check out metamask");
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        this.setState({ account: account[0] });
        const networkId = await web3.eth.net.getId();
        console.log(networkId);

        // load teather contract
        const teatherData = Teather.networks[networkId];
        if (teatherData) {
            const teather = new web3.eth.Contract(Teather.abi, teatherData.address);
            let tetherBalance = await teather.methods.balanceOf(this.state.account).call();
            this.setState({ teather, tetherBalance: tetherBalance.toString() });
            console.log(tetherBalance);
        } else {
            window.alert('Error! No teather contract deployed');
        }

        // load reward contract
        const rwdData = RWD.networks[networkId];
        if (rwdData) {
            const reward = new web3.eth.Contract(RWD.abi, rwdData.address);
            let rwdBalance = await reward.methods.balanceOf(this.state.account).call();
            this.setState({ rwd: reward, rwdBalance: rwdBalance.toString() });
            console.log(rwdBalance);
        } else {
            window.alert('Error! No reward contract deployed');
        }

        // load decentralBank contract
        const decentralBankData = DecentralBank.networks[networkId];
        if (decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({ decentralBank, stakingBalance: stakingBalance.toString() });
            console.log(stakingBalance);
        } else {
            window.alert('Error! No Decentral Bank contract deployed');
        }

        this.setState({ loading: false })

    }

    // two function one that stakes and one that unstakes

    //staking function
    stakeTokens = (amount) => {
        this.setState({ loading: true });
        this.state.teather.methods.approve(this.state.decentralBank._address, amount)
            .send({ from: this.state.account })
            .on('transactionHash', (hash) => {
                this.state.decentralBank.methods.depositTokens(amount)
                    .send({ from: this.state.account })
                    .on('transactionHash', (hash) => {
                        this.setState({ loading: false });
                    });
            });
    }

    // unstaking Tokens 
    unstakeTokens = () => {
        this.setState({ loading: true });
        this.state.decentralBank.methods.unstakeTokens()
            .send({ from: this.state.account })
            .on('transactionHash', (hash) => {
                this.setState({ loading: false });
            });
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }
    // our react app code goes here
    render() {
        let content;
        {
            this.state.loading ?
                content = <p id="loader" className="text-center" style={{ margin: '30px' }}>
                    Loading Page...</p> : content =
                <Main teatherBalance={this.state.tetherBalance}
                    rwdBalance={this.state.rwdBalance}
                    stakingBalance={this.state.stakingBalance}
                    stakeTokens={this.stakeTokens}
                    unstakeTokens={this.unstakeTokens}
                />
        }
        return (
            <>
                <Navbar account={this.state.account}></Navbar>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }} style={{ minHeight: '100vm' }}>
                            <div>
                                <>{content}</>
                            </div>
                        </main>
                    </div>
                </div>
            </>
        )
    }

}

export default App;