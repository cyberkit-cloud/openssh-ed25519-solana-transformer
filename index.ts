import { readFile } from "node:fs/promises";

import { readPublicKeyFromSSH } from "./src/readPublicKeyFromSSH.ts";
import { readPrivateKeyFromSSH } from "./src/readPrivateKeyFromSSH.ts";

const OPENSSH_dataString = await readFile(
  "./.devcontainer/.secrets/KEYS/anonymous-dev",
  "utf-8",
);

const OPENSSH_dataStringPub = await readFile(
  "./.devcontainer/.secrets/KEYS/anonymous-dev.pub",
  "utf-8",
);

const sshPublicUint8Array = readPublicKeyFromSSH(OPENSSH_dataStringPub);
console.log("SSH Public Result Object:", sshPublicUint8Array);

const sshPrivateUint8Array = await readPrivateKeyFromSSH(OPENSSH_dataString);
console.log("Result Object:", sshPrivateUint8Array);

console.log("*".repeat(153));
console.log(`Address/Public (Base58): ${sshPrivateUint8Array.address}`);
console.log(`Address/Public    (hex): ${sshPrivateUint8Array.publicKeyHex}`);
console.log(
  `Private        (Base58): ${sshPrivateUint8Array.privateKeyBase58}`,
);
console.log(`Private           (hex): ${sshPrivateUint8Array.privateKeyHex}`);
console.log(`Secret         (Base58): ${sshPrivateUint8Array.secretBase58}`);
console.log(`Secret            (hex): ${sshPrivateUint8Array.secretHex}`);
console.log(
  `SecretPWZFPK   (Base58): ${sshPrivateUint8Array.secretPaddedWithZerosForPublicKeyBase58}`,
);
console.log(
  `SecretPWZFPK      (hex): ${sshPrivateUint8Array.secretPaddedWithZerosForPublicKeyHex}`,
);
console.log("*".repeat(153));

// ---
import { getOpenSSHFromSolanaAddress } from "./src/getOpenSSHFromSolanaAddress.ts";

const addressToTransformToSSHPublic = sshPrivateUint8Array.address;

const openSSHPublicObject = getOpenSSHFromSolanaAddress(
  addressToTransformToSSHPublic,
  "anon@solana",
);
console.log("OpenSSH for address    :", openSSHPublicObject.address);
console.log("OpenSSH Public (string):", openSSHPublicObject.sshPublicKeyString);
console.log("*".repeat(153));

// ---
import { getOpenSSHPrivateKeyFormatFromPrivateKeyBytes } from "./src/getOpenSSHPrivateKeyFormatFromPrivateKeyBytes.ts";

const openSSHPrivateObject = getOpenSSHPrivateKeyFormatFromPrivateKeyBytes(
  sshPrivateUint8Array.privateKey,
  sshPrivateUint8Array.publicKey,
);
console.log("OpenSSH for private    :", sshPrivateUint8Array.privateKeyBase58);
console.log("OpenSSH Private (string):");
console.log(openSSHPrivateObject.sshPrivateKeyString);
// ---
console.log("*".repeat(153));
