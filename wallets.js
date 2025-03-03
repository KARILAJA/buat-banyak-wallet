const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// 1. Fungsi Membuat Wallet (Keypair)
function createWallet() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    return { publicKey, privateKey };
}

// 2. Fungsi Membuat Access Token
function createAccessToken(publicKey) {
    const payload = {
        publicKey,
        createdAt: Date.now()
    };

    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
    return token;
}

// 3. Membuat Banyak Wallet
function createMultipleWallets(count) {
    const wallets = [];

    for (let i = 0; i < count; i++) {
        const wallet = createWallet();
        const accessToken = createAccessToken(wallet.publicKey);
        wallets.push({
            id: i + 1,
            publicKey: wallet.publicKey,
            privateKey: wallet.privateKey,
            accessToken
        });
    }

    return wallets;
}

// Eksekusi: Membuat 5 Wallet
const walletCount = 5;
const wallets = createMultipleWallets(walletCount);

// Menampilkan Hasil
wallets.forEach(wallet => {
    console.log(`\n=== Wallet ${wallet.id} ===`);
    console.log("Public Key:", wallet.publicKey);
    console.log("Private Key:", wallet.privateKey);
    console.log("Access Token:", wallet.accessToken);
});
