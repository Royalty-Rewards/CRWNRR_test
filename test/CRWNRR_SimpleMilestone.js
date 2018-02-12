import regeneratorRuntime from "regenerator-runtime";
var CRWNRR_SimpleMilestone = artifacts.require('./contracts/CRWNRR_SimpleMilestone.sol');

contract('CRWNRR_SimpleMilestone', function (accounts) {
  let milestone;

  beforeEach(async function () {
    milestone = await CRWNRR_SimpleMilestone.new();
  });

  it('has an owner', async function () {
      assert.equal(await milestone.owner(), owner)
  })
  //
  // it("should make sure milestone is NOT complete", function() {
  //   return CRWNRR_SimpleMilestone.deployed().then(function(instance) {
  //     instance.setMilestone.call(5000);
  //     return instance.checkMilestone.call(999);
  //   }).then(function(milestoneComplete) {
  //     assert.equal(milestoneComplete, false);
  //   });
  // });
  //
  // it("should make sure milestone IS complete", function() {
  //   return CRWNRR_SimpleMilestone.deployed().then(function(instance) {
  //     instance.setMilestone.call(5000);
  //     return instance.checkMilestone.call(5005);
  //   }).then(function(milestoneComplete) {
  //     assert.equal(milestoneComplete, true);
  //   });
  // });

});
