/**
 * Example: Generate OpenSSH Format from Solana Address
 * 
 * This example demonstrates how to convert a Solana address
 * back to OpenSSH public key format.
 */
import { address } from "@solana/kit";

import { getOpenSSHFromSolanaAddress } from "../src/getOpenSSHFromSolanaAddress.ts";

// Example Solana address (Base58 format)
// You can get this from readPrivateKeyFromSSH or any Solana address
const solanaAddress = "CjxWa7hvuzC8MHnzJ68K6nuUJqBB4piXjMyHxmfNKC5R";
const comment = "user@solana-host";

console.log("Input:");
console.log(`  Solana Address: ${solanaAddress}`);
console.log(`  Comment: ${comment}`);
console.log();

// Convert to OpenSSH format
const result = getOpenSSHFromSolanaAddress(address(solanaAddress), comment);

console.log("Output:");
console.log("=".repeat(60));
console.log("\nOpenSSH Public Key Format:");
console.log(result.sshPublicKeyString);
console.log();

console.log("Use this for:");
console.log("  - age encryption: age -r '<paste-above-key>'");
console.log("  - SSH authorized_keys entries");
console.log("  - GitHub SSH keys");
console.log("  - Sharing with others for encryption");
console.log();
console.log("Address: " + result.address);
