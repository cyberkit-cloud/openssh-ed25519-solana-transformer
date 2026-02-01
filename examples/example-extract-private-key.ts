/**
 * Example: Extract Private Key from OpenSSH Format
 *
 * This example demonstrates how to read an OpenSSH ed25519 private key
 * and extract the Solana private key in multiple formats.
 */

import { readPrivateKeyFromSSH } from "../src/readPrivateKeyFromSSH.ts";
import { readFile } from "node:fs/promises";

async function main() {
  try {
    // In real usage, you would read from an actual OpenSSH private key file:
    // const privateKeyString = await readFile("./my-keypair", "utf-8");

    // For this example, we'll use a sample (you need a real key file)
    const privateKeyPath = process.argv[2];
    if (!privateKeyPath) {
      console.error(
        "Usage: node example-extract-private-key.ts '<private-key-file-path>'",
      );
      process.exit(1);
    }

    console.log(`Reading private key from: ${privateKeyPath}`);
    const privateKeyString = await readFile(privateKeyPath, "utf-8");

    // Extract Solana information from OpenSSH format
    const result = await readPrivateKeyFromSSH(privateKeyString);

    console.log();
    console.log("Extracted Solana Information:");
    console.log("=".repeat(60));

    console.log("\nAddress Information:");
    console.log("-".repeat(60));
    console.log(`  Solana Address (Base58): ${result.address}`);

    console.log("\nPublic Key Formats:");
    console.log("-".repeat(60));
    console.log(`  Public Key (Hex): ${result.publicKeyHex}`);

    console.log("\nPrivate Key Formats:");
    console.log("-".repeat(60));
    console.log(`  Private Key (Base58): ${result.privateKeyBase58}`);
    console.log(`  Private Key (Hex):    ${result.privateKeyHex}`);

    console.log("\nSecret Key Variants:");
    console.log("-".repeat(60));
    console.log(`  Secret (Base58): ${result.secretBase58}`);
    console.log(`  Secret (Hex):    ${result.secretHex}`);

    console.log("\nSpecial Formats:");
    console.log("-".repeat(60));
    console.log(`  Secret with Zero Padding (Base58):`);
    console.log(`    ${result.secretPaddedWithZerosForPublicKeyBase58}`);
    console.log(`  Secret with Zero Padding (Hex):`);
    console.log(`    ${result.secretPaddedWithZerosForPublicKeyHex}`);
  } catch (error) {
    console.error("Error reading private key:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
