/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
/* eslint-disable max-len */
export const waitUntilProcessed = async (txHash, value, foreignWeb3, homeWeb3) => {
  const bridge = homeWeb3

  const tx = await foreignWeb3.eth.getTransaction(txHash)
  const messageHash = foreignWeb3.utils.soliditySha3(tx.from, foreignWeb3.utils.toBN(value).toString(), txHash)
  const numSigned = await bridge.methods.numAffirmationsSigned(messageHash).call()
  const processed = await bridge.methods.isAlreadyProcessed(numSigned).call()

  if (processed) {
    return Promise.resolve()
  }
  return sleep(5000).then(() => waitUntilProcessed(txHash, value))
}

export const getPastEvents = async (
  contract,
  {
    event = 'allEvents', fromBlock = toBN(0), toBlock = 'latest', options = {},
  },
) => {
  let commonEvents
  try {
    commonEvents = await contract.getPastEvents(event, {
      ...options,
      fromBlock,
      toBlock,
    })
  } catch (e) {
    if (e.message.includes('query returned more than') && toBlock !== 'latest') {
      const middle = toBN(fromBlock)
        .add(toBN(toBlock))
        .divRound(toBN(2))
      const middlePlusOne = middle.add(toBN(1))

      const firstHalfEvents = await getPastEvents(contract, {
        options,
        event,
        fromBlock,
        toBlock: middle,
      })
      const secondHalfEvents = await getPastEvents(contract, {
        options,
        event,
        fromBlock: middlePlusOne,
        toBlock,
      })
      commonEvents = [ ...firstHalfEvents, ...secondHalfEvents ]
    } else {
      throw new Error(e)
    }
  }
  return commonEvents
}
