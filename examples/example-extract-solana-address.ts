/**
 * Example: Extract Solana Address from OpenSSH Public Key
 * 
 * This example demonstrates how to extract a Solana address
 * from an OpenSSH ed25519 public key string.
 */

import { readPublicKeyFromSSH } from "../src/readPublicKeyFromSSH.ts";

// OpenSSH ed25519 public key format
const opensshPublicKey = process.argv[2];
if (!opensshPublicKey) {
  console.error("Usage: node example-extract-solana-address.ts '<openssh-public-key>'");
  process.exit(1);
}
console.log("Input OpenSSH Public Key:");
console.log(opensshPublicKey);
console.log();

// Convert to Solana address
const result = readPublicKeyFromSSH(opensshPublicKey);

console.log("Extracted Solana Information:");
console.log("-".repeat(50));
console.log(`Solana Address (Base58): ${result.address}`);
console.log(`Public Key        (Hex): ${result.publicKeyHex}`);
console.log();
console.log("Use this address to:");
console.log("  - Send Solana tokens");
console.log("  - Encrypt files with age tool");
console.log("  - Create a Solana wallet");
