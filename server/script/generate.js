const secp = require("ethereum-cryptography/secp256k1");
const { secp256k1 } = require("@noble/curves/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const priv_Key = secp.secp256k1.utils.randomPrivateKey();
let pubKey = secp.secp256k1.getPublicKey(priv_Key);

// const key = pubKey.slice(1);
// const hash = keccak256(key);
// const address = hash.slice(-20);

// console.log(pubKey);
// console.log('address = ', toHex(address));
// console.log('privateKey =', toHex(priv_Key));

const privHex = 'cef385d983e901058ea3a83c861fcbf5e14d9a9872c65a2f3f9fa696dd6ce60d';
const pub = secp256k1.getPublicKey(privHex);
const key = pub.slice(1);
const hash = keccak256(key);
const address = hash.slice(-20);

console.log(hash);
console.log('address = ', toHex(address));
