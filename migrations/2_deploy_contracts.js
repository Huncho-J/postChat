const PostChat = artifacts.require("./PostChat.sol");

module.exports = function (deployer) {
  deployer.deploy(PostChat);
};
