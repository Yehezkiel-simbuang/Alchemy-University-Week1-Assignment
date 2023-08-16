const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "29882f52d9589e9b6589ca6b3863ae2a5ddef7a0": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit } = req.body;
  const _signature = (secp256k1.Signature.fromCompact(signature)).addRecoveryBit(recoveryBit);
  console.log(_signature);
  
  try {
    const msg = utf8ToBytes(JSON.stringify({ sender, amount, recipient }));
    const hash_msg = keccak256(msg);
    const pubKey = _signature.recoverPublicKey(hash_msg).toRawBytes();
    const hash = pubKey.slice(1);
    const _hash = keccak256(hash);
    const addressFromRecover = _hash.slice(-20);
    if (toHex(addressFromRecover) != sender) {
      res.status(400).send({ message: "Signature invalid" });
    }
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message);
  }
});
  
  

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
