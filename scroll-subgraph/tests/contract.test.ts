import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { TokenMinted } from "../generated/schema"
import { TokenMinted as TokenMintedEvent } from "../generated/Contract/Contract"
import { handleTokenMinted } from "../src/contract"
import { createTokenMintedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let trader = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let customer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newTokenMintedEvent = createTokenMintedEvent(trader, customer)
    handleTokenMinted(newTokenMintedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TokenMinted created and stored", () => {
    assert.entityCount("TokenMinted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TokenMinted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "trader",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TokenMinted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "customer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
