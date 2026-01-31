/**
 * Example: Extract Solana Address from OpenSSH Public Key
 * 
 * This example demonstrates how to extract a Solana address
 * from an OpenSSH ed25519 public key string.
 */

import { readPublicKeyFromSSH } from "../src/readPublicKeyFromSSH.ts";

// OpenSSH ed25519 public key format
const opensshPublicKey = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK5xtyFM3UCVzEY/Uk3L0AmZg+c6ZqqrFrIWtepa3WTs gordan@neki.ch`;

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
