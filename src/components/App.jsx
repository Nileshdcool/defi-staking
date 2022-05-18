import React, { Component } from "react";
import Navbar  from "./Navbar.jsx";

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            account: '0xo'
        }
    }
    // our react app code goes here
    render() {
        return (
            <>
            <Navbar account={this.state.account}></Navbar>
            <div className="text-center">
                Hello world
            </div>
            </>
        )
    }

}

export default App;