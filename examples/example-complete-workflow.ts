/**
 * Example: Complete Workflow
 * 
 * This example demonstrates a complete workflow:
 * 1. Read OpenSSH private key
 * 2. Extract Solana address and keys
 * 3. Generate OpenSSH public key from the address
 * 4. Display all available key formats
 */

import { readPublicKeyFromSSH } from "../src/readPublicKeyFromSSH.ts";
import { readPrivateKeyFromSSH } from "../src/readPrivateKeyFromSSH.ts";
import { getOpenSSHFromSolanaAddress } from "../src/getOpenSSHFromSolanaAddress.ts";
import { getOpenSSHPrivateKeyFormatFromPrivateKeyBytes } from "../src/getOpenSSHPrivateKeyFormatFromPrivateKeyBytes.ts";
import { readFile } from "node:fs/promises";

async function main() {
  try {
    const privateKeyPath = process.argv[2] || "./.devcontainer/.secrets/KEYS/anonymous-dev";
    const publicKeyPath = privateKeyPath + ".pub";
    
    console.log("Complete Solana-SSH Transformer Workflow");
    console.log("=".repeat(70));
    console.log();
    
    // Step 1: Read public key
    console.log("Step 1: Reading OpenSSH Public Key");
    console.log("-".repeat(70));
    const publicKeyString = await readFile(publicKeyPath, "utf-8");
    const publicKeyResult = readPublicKeyFromSSH(publicKeyString);
    console.log(`✓ Solana Address: ${publicKeyResult.address}`);
    console.log();
    
    // Step 2: Read private key
    console.log("Step 2: Reading OpenSSH Private Key");
    console.log("-".repeat(70));
    const privateKeyString = await readFile(privateKeyPath, "utf-8");
    const privateKeyResult = await readPrivateKeyFromSSH(privateKeyString);
    console.log(`✓ Verified Address: ${privateKeyResult.address}`);
    console.log();
    
    // Step 3: Generate OpenSSH format from address
    console.log("Step 3: Regenerating OpenSSH Public Key from Address");
    console.log("-".repeat(70));
    const regeneratedSSH = getOpenSSHFromSolanaAddress(
      privateKeyResult.address,
      "solana-transformer"
    );
    console.log("✓ Regenerated public key (first 80 chars):");
    console.log(`  ${regeneratedSSH.sshPublicKeyString.substring(0, 80)}...`);
    console.log();
    
    // Step 4: Display key information
    console.log("Step 4: Available Key Formats");
    console.log("-".repeat(70));
    console.log("\nSolana Address:");
    console.log(`  Base58: ${privateKeyResult.address}`);
    console.log();
    
    console.log("Public Key:");
    console.log(`  Hex: ${privateKeyResult.publicKeyHex}`);
    console.log();
    
    console.log("Private Key:");
    console.log(`  Base58: ${privateKeyResult.privateKeyBase58}`);
    console.log(`  Hex:    ${privateKeyResult.privateKeyHex}`);
    console.log();
    
    console.log("Secret Key:");
    console.log(`  Base58: ${privateKeyResult.secretBase58}`);
    console.log(`  Hex:    ${privateKeyResult.secretHex}`);
    console.log();
    
    // Step 5: Show usage examples
    console.log("Step 5: Usage Examples");
    console.log("-".repeat(70));
    console.log("\nEncrypt a file with age:");
    console.log(`  age -r '${regeneratedSSH.sshPublicKeyString}' \\`);
    console.log(`      plaintext.txt > plaintext.age`);
    console.log();
    
    console.log("Decrypt the file:");
    console.log(`  age -d -i ${privateKeyPath} plaintext.age`);
    console.log();
    
    console.log("Use with Solana CLI:");
    console.log(`  solana address-lookup-table create \\`);
    console.log(`      --keypair ${privateKeyPath}`);
    console.log();
    
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
