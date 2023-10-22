import {
  TokenMinted as TokenMintedEvent,
  TraderTokenCreated as TraderTokenCreatedEvent
} from "../generated/Contract/Contract"
import { TokenMinted, TraderTokenCreated } from "../generated/schema"

export function handleTokenMinted(event: TokenMintedEvent): void {
  let entity = new TokenMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.trader = event.params.trader
  entity.customer = event.params.customer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTraderTokenCreated(event: TraderTokenCreatedEvent): void {
  let entity = new TraderTokenCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.trader = event.params.trader
  entity.tokenAddress = event.params.tokenAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
