const { expect } = require('chai')

// TODO compare block_number...
function assertItem(actualResult, expectedResult) {
  expect(actualResult.id).to.equal(expectedResult.id)
  expect(actualResult).has.property('block_number')
  expect(actualResult.owner).to.equal(expectedResult.owner)
  expect(actualResult.creator).to.equal(expectedResult.creator)
  expect(actualResult.parents).to.deep.equal(expectedResult.parents)
  expect(actualResult.children).to.deep.equal(expectedResult.children)
}

module.exports = {
  assertItem,
}
