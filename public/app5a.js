// Load Solana Web3.js
const web3 = solanaWeb3;

// 1. Solana connection
const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

// 2. Leaderboard account public key
const leaderboardPublicKey = new web3.PublicKey('6oMKESixo7KsAd32dYVmxgkUf6cRaGe1w6We9pzDSVhx');

// 3. Account Layout
// You must know the structure from your Rust program
// Example assumes:
// - game_type: fixed 20 bytes string
// - user_count: u32 (4 bytes)
// - each user: 32 bytes wallet + 4 bytes score

// Let's say max 100 users
const MAX_USERS = 100;

// 4. Fetch the account and decode
(async () => {
  const accountInfo = await connection.getAccountInfo(leaderboardPublicKey);
  
  if (accountInfo === null) {
    console.error('Account not found!');
    return;
  }

  const data = accountInfo.data;

  let offset = 8; // skip Anchor discriminator (8 bytes)

  // Read game_type (assume 20 bytes, adjust to your program)
  const gameTypeBytes = data.slice(offset, offset + 20);
  const gameType = new TextDecoder().decode(gameTypeBytes).replace(/\0/g, '');
  offset += 20;

  // Read user count
  const userCount = new DataView(data.buffer).getUint32(offset, true);
  offset += 4;

  console.log('Game Type:', gameType);
  console.log('User Count:', userCount);

  const leaderboardElement = document.getElementById('leaderboard');

  for (let i = 0; i < userCount; i++) {
    const walletBytes = data.slice(offset, offset + 32);
    const wallet = new web3.PublicKey(walletBytes).toBase58();
    offset += 32;

    const score = new DataView(data.buffer).getUint32(offset, true);
    offset += 4;

    console.log(`Wallet: ${wallet} Score: ${score}`);

    const listItem = document.createElement('li');
    listItem.textContent = `Wallet: ${wallet} - Score: ${score}`;
    leaderboardElement.appendChild(listItem);
  }

})();
