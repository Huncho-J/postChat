import React, { Component } from 'react';
import logo from './logo.svg';
import Web3 from 'web3';
import './App.css';
import PostChat from './contracts/PostChat.json';


class App extends Component{
  async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockChainData()
    }
  async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
    }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
      else{
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
}
async loadBlockChainData(){
  const web3 = window.web3
  //load accounts
  const accounts = await web3.eth.getAccounts()
  this.setState({account: accounts[0]})
  //Get Network ID
  const networkId = await web3.eth.net.getId()

    //load PostChat smart contract
    const postchatData = PostChat.networks[networkId]
    if(postchatData){
     const postChat = new web3.eth.Contract(PostChat.abi, postchatData.address)
      this.setState({postChat: postChat})
  } else{
   window.alert('contract was not deployed to test network.')
  }
this.setState({loading:false})
}

constructor(props) {
  super(props)
  this.state = {
    account: '',
    loading: true
  }
}

  render() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
 }
}

export default App;
