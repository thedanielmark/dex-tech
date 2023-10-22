import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { TokenMinted, TraderTokenCreated } from "../generated/Contract/Contract"

export function createTokenMintedEvent(
  trader: Address,
  customer: Address
): TokenMinted {
  let tokenMintedEvent = changetype<TokenMinted>(newMockEvent())

  tokenMintedEvent.parameters = new Array()

  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("customer", ethereum.Value.fromAddress(customer))
  )

  return tokenMintedEvent
}

export function createTraderTokenCreatedEvent(
  trader: Address,
  tokenAddress: Address
): TraderTokenCreated {
  let traderTokenCreatedEvent = changetype<TraderTokenCreated>(newMockEvent())

  traderTokenCreatedEvent.parameters = new Array()

  traderTokenCreatedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  traderTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )

  return traderTokenCreatedEvent
}
