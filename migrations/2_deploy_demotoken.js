const DemoToken = artifacts.require("DemoToken");

module.exports = (deployer)=>{
  deployer.deploy(DemoToken);
}
