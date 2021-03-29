pragma solidity ^0.5.0;

contract PostChat{
  string public name;
  uint public Postcount = 0;
  mapping(uint => Post) public posts;

  struct Post{
    uint id;
    string content;
    uint tipAmount;
    address payable author;
  }

  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address author
  );

  event PostTipped(
    uint id,
  //  string content,
    uint tipAmount,
    address author
  );
  constructor() public {
    name = "PostChat";
  }

  function createPost(string memory _content) public {
    require(bytes(_content).length > 0);
    Postcount++;
    posts[Postcount] = Post(Postcount, _content, 0, msg.sender);
    emit PostCreated(Postcount, _content, 0, msg.sender);
  }

  function tipPost(uint _id) public payable{
    require(_id > 0 && _id <= Postcount);
    Post memory _post = posts[_id];
    address payable _author = _post.author;
    _author.transfer(msg.value);
    _post.tipAmount += msg.value;
    posts[_id] = _post;
    emit PostTipped(Postcount, msg.value, _author);
  }
}
