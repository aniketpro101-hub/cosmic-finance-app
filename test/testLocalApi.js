async function testLocalApi() {
  const res = await fetch('http://localhost:9090/api/market-data');
  const json = await res.json();
  console.log('Status:', json.status);
  console.log('Feeds Health:', JSON.stringify(json.feedsHealth, null, 2));
  console.log('\nLive Instruments:');
  json.data.forEach(d => {
    console.log(`• ${d.symbol.padEnd(10)}: ${d.priceFormatted.padEnd(14)} (${d.changeFormatted}) [${d.marketStatus}]`);
  });

  const feedsRes = await fetch('http://localhost:9090/api/market-data/feeds');
  const feedsJson = await feedsRes.json();
  console.log('\nFeeds Endpoint Check:', feedsJson.status);
}

testLocalApi();
