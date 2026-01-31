import { address, getBase58Decoder, getBase16Decoder} from "@solana/kit";

export const readPublicKeyFromSSH = (sshPublicKeyString: string) => {
  // console.log("-".repeat(50));
  // console.log(`[readPublicKeyFromSSH]`);
  // console.log(" - PUBLIC KEY STRING:", sshPublicKeyString);
  // // Remove the "ssh-ed25519 " prefix and any trailing comment
  const base64Key = sshPublicKeyString.trim().split(" ")[1]; // Assumes format: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI..."

  // Decode the base64 SSH key
  const keyBuffer = Buffer.from(base64Key, "base64");

  // console.log("✓ Key Buffer:", keyBuffer);
  
  // SSH ed25519 format:
  // - 4 bytes: key type length
  // - N bytes: key type ("ssh-ed25519")
  // - 4 bytes: public key length
  // - 32 bytes: actual public key

  // Skip the key type header (first 15 bytes for "ssh-ed25519")
  // The structure is: [4 bytes length][11 bytes "ssh-ed25519"][4 bytes key length][32 bytes key]
  
  const keyTypeLength = keyBuffer.readUInt32BE(0); // Should be 11
  const keyType = keyBuffer.toString("utf-8", 4, 4 + keyTypeLength); // "ssh-ed25519"

  if (keyType !== "ssh-ed25519") {
    throw new Error(`Unsupported key type: ${keyType}`);
  }

  // Read the public key length
  const publicKeyLength = keyBuffer.readUInt32BE(4 + keyTypeLength); // Should be 32

  // Extract the 32-byte public key
  const publicKeyBytes = keyBuffer.slice(
    8 + keyTypeLength,
    8 + keyTypeLength + publicKeyLength,
  );

  // Convert to Uint8Array
  const publicKeyUint8Array = new Uint8Array(publicKeyBytes);

  // console.log("Public Key (Uint8Array):", publicKeyUint8Array);
  
  const sshSolanaAddress = address(
    getBase58Decoder().decode(publicKeyUint8Array),
  );
  // console.log("Decoded Address:", sshSolanaAddress);

  const publicKeyHex = getBase16Decoder().decode(publicKeyUint8Array);

  return {
    address: sshSolanaAddress,
    publicKey: publicKeyUint8Array,
    publicKeyHex: publicKeyHex,
    sshPublicKeyString,
  };
};