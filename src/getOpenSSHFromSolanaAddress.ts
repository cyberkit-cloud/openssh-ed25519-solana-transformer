import {
  address,
  getBase58Decoder,
  getBase58Encoder,
  getBase64Encoder,
  getBase64Decoder,
} from "@solana/kit";
import type { Address } from "@solana/kit";

export const getOpenSSHFromSolanaAddress = (solanaAddress: Address, mail?: string) => {
  // console.log("-".repeat(50));
  // console.log(`[getOpenSSHFromSolanaAddress]`);
  // console.log(" - solanaAddress (PublicKey Base58):", solanaAddress);

  const publicKeyUint8Array = getBase58Encoder().encode(solanaAddress);

  // HEX template: 0000000b7373682d65643235353139000000200000000000000000000000000000000000000000000000000000000000000000
  const base64EncodedOpenSSHPayload = getBase64Encoder().encode(
    "AAAAC3NzaC1lZDI1NTE5AAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  );

  const keyBuffer = new Uint8Array(base64EncodedOpenSSHPayload);

  // SSH ed25519 format:
  // - 4 bytes: key type length
  // - N bytes: key type ("ssh-ed25519")
  // - 4 bytes: public key length
  // - 32 bytes: actual public key
  const outputBuffer = new Uint8Array(keyBuffer.length);
  // Copy template
  outputBuffer.set(keyBuffer, 0); // This will do all the fun parts
  // Wipe
  outputBuffer.set(
    new Uint8Array([
      0,
      0,
      0,
      32, // Public key length (32 bytes)
    ]),
    outputBuffer.length - 32 - 4,
  ); // Set just before the public key
  outputBuffer.set(new Uint8Array(32).fill(0), outputBuffer.length - 32); // Set just before the public key
  // The most important part: set the actual public key bytes
  outputBuffer.set(publicKeyUint8Array, keyBuffer.length - 32);

  // console.log(" - keyBuffer:    ",  Buffer.from(keyBuffer).toString('hex'));
  // console.log(" - outputBuffer: ",   Buffer.from(outputBuffer).toString('hex'));
  // console.log(" - outputBuffer: ",   Buffer.from(outputBuffer).toString('base64'));

  const sshPublicKeyString = `ssh-ed25519 ${getBase64Decoder().decode(outputBuffer)} ${mail ?? "anonymous@solana.com"}`;

  return {
    address: solanaAddress,
    publicKey: publicKeyUint8Array,
    sshPublicKeyString,
  };
};
