const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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

// 4. Menyimpan Wallet ke File t.txt
function saveWalletsToFile(wallets, filename) {
    const data = wallets.map(wallet => `
=== Wallet ${wallet.id} ===
Public Key: ${wallet.publicKey}
Private Key: ${wallet.privateKey}
Access Token: ${wallet.accessToken}
`).join('\n');

    fs.writeFileSync(filename, data, 'utf-8');
    console.log(`\n✅ Wallets berhasil disimpan ke file ${filename}`);
}

// Eksekusi: Membuat 5 Wallet dan Simpan ke t.txt
const walletCount = 5;
const wallets = createMultipleWallets(walletCount);
saveWalletsToFile(wallets, 't.txt');

// Menampilkan Hasil
wallets.forEach(wallet => {
    console.log(`\n=== Wallet ${wallet.id} ===`);
    console.log("Public Key:", wallet.publicKey);
    console.log("Private Key:", wallet.privateKey);
    console.log("Access Token:", wallet.accessToken);
});
