/**
 * Example: Check Solana Address Usage via QuickNode RPC
 * 
 * This example demonstrates how to convert an OpenSSH ed25519 public key
 * to a Solana address and then query the Solana blockchain via QuickNode RPC
 * to check if the address has been used (has balance, transactions, etc).
 * 
 * Prerequisites:
 *   - QuickNode RPC endpoint (get free one at https://www.quicknode.com/)
 *   - Set QUICKNODE_RPC_URL environment variable or replace the URL below
 */

import { readPublicKeyFromSSH } from "../src/readPublicKeyFromSSH.ts";

// Your QuickNode RPC endpoint
// Get a free endpoint at https://www.quicknode.com/
const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL || "https://YOUR_QUICKNODE_RPC_URL";

// OpenSSH ed25519 public key
const opensshPublicKey = process.argv[2];
if (!opensshPublicKey) {
  console.error("Usage: node example-extract-solana-address.ts '<openssh-public-key>'");
  process.exit(1);
}

async function checkAddressUsage() {
  try {
    console.log("Converting OpenSSH public key to Solana address...");
    console.log();

    // Step 1: Convert SSH public key to Solana address
    const result = readPublicKeyFromSSH(opensshPublicKey);
    const solanaAddress = result.address;

    console.log(`Generated Solana Address: ${solanaAddress}`);
    console.log();

    // Step 2: Check address usage via QuickNode RPC
    console.log("Checking address usage via QuickNode RPC...");
    console.log("-".repeat(60));

    // Make RPC call to get account info
    const response = await fetch(QUICKNODE_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [solanaAddress],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("RPC Error:", data.error.message);
      console.log();
      console.log("Make sure to:");
      console.log("1. Set QUICKNODE_RPC_URL environment variable");
      console.log("2. Or replace QUICKNODE_RPC_URL in this file with your endpoint");
      console.log("3. Get a free endpoint at https://www.quicknode.com/");
      return;
    }

    // Step 3: Analyze the results
    if (data.result === null) {
      console.log("Address Status: NOT USED");
      console.log();
      console.log("This address has never been initialized on the blockchain.");
      console.log("It's a fresh Solana address ready to receive tokens.");
    } else {
        console.log(data.result);
    //   const accountInfo = data.result.value;
    //   // const lamports = accountInfo?.lamports;
    //   // const solBalance = lamports / 1_000_000_000; // Convert lamports to SOL

    //   console.log("Address Status: ACTIVE");
    //   console.log();
    //   // console.log(`Balance: ${solBalance} SOL`);
    //   console.log(`Owner Program: ${accountInfo.owner}`);
    //   console.log(`Executable: ${accountInfo.executable}`);
    //   console.log(`Data Size: ${accountInfo.data[1].length} bytes`);
    //   console.log();

    // //   if (solBalance > 0) {
    // //     console.log("This address has active SOL balance and has been used.");
    // //   } else {
    // //     console.log("This address has been initialized but has no SOL balance.");
    // //   }
    }

    console.log();
    console.log("=".repeat(60));
    console.log("Address Details:");
    console.log("-".repeat(60));
    console.log(`Address (Base58): ${result.address}`);
    console.log(`Public Key (Hex): ${result.publicKeyHex}`);
    console.log();

    // Step 4: Show how to use this address
    console.log("Next Steps:");
    console.log("-".repeat(60));
    console.log("1. To receive SOL: Share the address with others");
    console.log("2. To spend SOL: Use the corresponding private key in a wallet");
    console.log("3. To interact with programs: Use this address in transaction signing");

  } catch (error) {
    console.error("Error:", error.message);
    console.log();
    console.log("Troubleshooting:");
    console.log("- Check your QUICKNODE_RPC_URL is valid");
    console.log("- Verify your internet connection");
    console.log("- Ensure the RPC endpoint is accessible");
    process.exit(1);
  }
}

// Run the example
checkAddressUsage();
