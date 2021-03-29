const PostChat = artifacts.require("./PostChat.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('PostChat', ([deployer, author, tipper]) => {
  let postchat

  before(async () => {
     postChat = await PostChat.deployed()
  })
  describe('deployment',async () => {
    it('deploys successfully',async () => {
      const address = await postChat.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
    it('has a name',async () => {
      const name = await postChat.name()
      assert.equal(name, "PostChat")
    })
  })
  describe('posts', async() => {
    let result
    before(async () => {
      result = await postChat.createPost('test post', {from: author})
      postCount = await postChat.Postcount()
    })

    it('creates posts', async () => {
      assert.equal(postCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.content, 'test post', 'content is correct')
      assert.equal(event.tipAmount.toNumber(), 0, 'tip Amount is correct')
      assert.equal(event.author, author, 'author is correct')

      await postChat.createPost('', {from: author}).should.be.rejected;

    })
    it('Lists posts', async () => {
      const post = await postChat.posts(postCount)
      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(post.content, 'test post', 'content is correct')
      assert.equal(post.tipAmount.toNumber(), 0, 'tip Amount is correct')
      assert.equal(post.author, author, 'author is correct')
    })
    it('tips posts', async () => {
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await postChat.tipPost(postCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')})

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip Amount is correct')
      assert.equal(event.author, author, 'author is correct')

      let tipAmount
      tipAmount = await web3.utils.toWei('1', 'Ether')
      tipAmount = new web3.utils.BN(tipAmount)

      const expectedBalance = oldAuthorBalance.add(tipAmount)

      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      //assert.equal(newAuthorBalance.toString(), oldAuthorBalance.toString())

      await postChat.tipPost(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected

    })
  })
})
