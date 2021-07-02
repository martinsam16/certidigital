pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DemoToken is ERC20{
  constructor() ERC20("MyNFT", "MNFT") {
  }
}
