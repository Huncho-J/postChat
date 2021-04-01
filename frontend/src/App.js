import React, { Component } from 'react';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.min.css';
import Identicon from 'identicon.js';
import Navbar from './Navbar';
import Main from './Main';
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

      const postCount = await postChat.methods.Postcount().call()
      this.setState({postCount: postCount})

      //load posts
      for(var i = 1; i <= postCount; i++){
        const post = await postChat.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount)
      })
    this.setState({loading: false})
  } else{
   window.alert('contract was not deployed to test network.')

this.setState({loading:false})
}
}

createPost(content){
  this.setState({loading: true})
  this.state.postChat.methods.createPost(content).send({from: this.state.account})
  .once('receipt', (receipt) => {
    this.setState({loading: false})
  })
}

tipPost(id, tipAmount){
  this.setState({loading: true})
  this.state.postChat.methods.tipPost(id).send({from: this.state.account, value: tipAmount})
  .once('receipt', (receipt) => {
    this.setState({loading: false})
  })

}
constructor(props) {
  super(props)
  this.state = {
    account:'',
    postChat: null,
    postCount:0,
    posts:[],
    loading: true
  }
  this.createPost=this.createPost.bind(this)
  this.tipPost=this.tipPost.bind(this)
}

  render() {
  return (
    <div>
      <Navbar account={this.state.account} />
      {this.state.loading
        ? <div id="loader" className="text-center"><p>Loading...</p></div>
        :<Main
        posts={this.state.posts}
        createPost={this.createPost}
        tipPost={this.tipPost}
        />
      }

  </div>
  );
 }
}

export default App;
