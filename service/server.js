const { MongoClient } = require("mongodb");
require("dotenv").config();
const axios = require('axios');


// Connection URL
const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db(process.env.MONGODB_NAME || "dextech");
const collection = db.collection('traders')

// const walletAddresses = [
//   "0x64574ddbe98813b23364704e0b00e2e71fc5ad17",
//   "0x5a6b842891032d702517a4e52ec38ee561063539",
//   "0x220866b1a2219f40e72f5c628b65d54268ca3a9d",
//   "0x719eee6d1e78fec386bad0c1dda2b0ef2fa9bf00",
//   "0xd69a4dd0dfb261a8EF37F45925491C077EF1dBFb"
// ];

const calculateKeyPrice = async (absolute_1d) => {
  let keyPrice = 0;
  if (absolute_1d > 0 && absolute_1d <= 100) {
    keyPrice = absolute_1d * 0.00006
  } else if (absolute_1d > 100 && absolute_1d <= 1000) {
    keyPrice = absolute_1d * 0.00005
  } else if (absolute_1d > 1000 && absolute_1d <= 10000) {
    keyPrice = absolute_1d * 0.00004
  } else if (absolute_1d > 10000 && absolute_1d <= 100000) {
    keyPrice = absolute_1d * 0.00003
  } else if (absolute_1d > 100000 && absolute_1d <= 1000000) {
    keyPrice = absolute_1d * 0.00002
  } else if (absolute_1d > 1000000) {
    keyPrice = absolute_1d * 0.00001
  } else {
    keyPrice = 0
  }
  return keyPrice;
}

const insertDataIntoDB = async (address, chainID) => {
  let key = process.env.API_KEY;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Basic ${key}`,
    },
  };

  try {
    let response = await fetch(`https://api.zerion.io/v1/wallets/${address}/portfolio?currency=usd`, options);
    if (response.ok) {
      response = await response.json();

      // Delete the old data for the same address
      await collection.deleteMany({ id: address, chainID });

      let absolute_1d = response.data.attributes.changes.absolute_1d
      let keyPrice = await calculateKeyPrice(absolute_1d)

      // Insert the new data
      await collection.insertOne({ ...response.data, timestamp: Date.now(), keyPrice, chainID });
      console.log(`Data inserted for address ${address}`);
    } else {
      console.error(`Failed to fetch data for address ${address}`);
    }
  } catch (error) {
    console.error(`Error processing address ${address}: ${error.message}`);
  }
};

const getDexTechTradersMumbai = async () => {
  const apiUrl = 'https://api.studio.thegraph.com/query/55648/mumbaidex-v4/v0.0.3'; // Replace with your GraphQL API URL
  const query = `
  query dexTechTraders {
    traderTokenCreateds {
      trader
    }
  }`;
  const headers = {
    'Content-Type': 'application/json',
    // Add any necessary authentication headers if required
  };
  const res = await axios.post(apiUrl, { query }, { headers })
  let data = res.data.data.traderTokenCreateds
  let traders = []
  data.forEach((value) => {
    traders.push(value.trader)
  })
  return traders
}

const getDexTechTradersScroll = async () => {
  const apiUrl = 'https://api.studio.thegraph.com/query/55648/mumbaidex-v3/v0.0.5'; // Replace with your GraphQL API URL
  const query = `
  query dexTechTraders {
    traderTokenCreateds {
      trader
    }
  }`;
  const headers = {
    'Content-Type': 'application/json',
    // Add any necessary authentication headers if required
  };
  const res = await axios.post(apiUrl, { query }, { headers })
  let data = res.data.data.traderTokenCreateds
  let traders = []
  data.forEach((value) => {
    traders.push(value.trader)
  })
  return traders
}

// insertDataIntoDB("0x719EEE6D1E78FEc386BaD0c1DDa2B0eF2fa9bf00")

async function main() {
  while (true) {
    let walletAddressesMumbai = await getDexTechTradersMumbai()
    let walletAddressesScroll = await getDexTechTradersScroll()
    for (let i = 0; i < walletAddressesMumbai.length; i++) {
      await insertDataIntoDB(walletAddressesMumbai[i], 80001);
    }
    for (let i = 0; i < walletAddressesScroll.length; i++) {
      await insertDataIntoDB(walletAddressesScroll[i], 534351);
    }

    // Sleep for five minutes (300,000 milliseconds)
    await new Promise(resolve => setTimeout(resolve, 300000));
  }
}

(async function () {
  try {
    await client.connect();
    await main();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  } finally {
    client.close();
  }
})();