import {
  address,
  getBase58Decoder,
  getBase58Encoder,
  getBase64Encoder,
  getBase64Decoder,
  getBase16Encoder,
} from "@solana/kit";

export const getOpenSSHPrivateKeyFormatFromPrivateKeyBytes = (
  privateKeyBytes: Uint8Array,
  publicKeyBytes: Uint8Array,
) => {
  // console.log("-".repeat(50));
  // console.log(`[getOpenSSHPrivateKeyFormatFromPrivateKeyBytes]`);

  // throw new Error("Not yet implemented");

  const hexEncodedPayloadBytes = getBase16Encoder().encode(
    "6f70656e7373682d6b65792d763100000000046e6f6e65000000046e6f6e650000000000000001000000330000000b7373682d656432353531390000002000000000000000000000000000000000000000000000000000000000000000000000009879e4251079e425100000000b7373682d65643235353139000000200000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011726f6f744039373338623435363830666301020304",
  );
  const keyBuffer = new Uint8Array(hexEncodedPayloadBytes);

  /*
    "openssh-key-v1"0x00    # NULL-terminated "Auth Magic" string
32-bit length, "none"   # ciphername length and string
32-bit length, "none"   # kdfname length and string
32-bit length, nil      # kdf (0 length, no kdf)
32-bit 0x01             # number of keys, hard-coded to 1 (no length)
32-bit length, sshpub   # public key in ssh format
    32-bit length, keytype
    32-bit length, pub0
    32-bit length, pub1
32-bit length for rnd+prv+comment+pad
    64-bit dummy checksum?  # a random 32-bit int, repeated
    32-bit length, keytype  # the private key (including public)
    32-bit length, pub0     # Public Key parts
    32-bit length, pub1
    32-bit length, prv0     # Private Key parts
    ...                     # (number varies by type)
    32-bit length, comment  # comment string
    padding bytes 0x010203  # pad to blocksize (see notes below)
    */

  const cipherNameLength = 4; // "none"

  const offset =
    15 + // Header
    4 +
    4 + // Cipher Name
    4 +
    4 + // KDF Name
    4 +
    0 + // KDF
    4 +
    1 + // Number of keys
    4 +
    51 + // Public Key
    7 +
    8 +
    8 +
    cipherNameLength +
    3 +
    32 +
    4;
  // console.log("Offset to private key bytes:", offset);

  // Wipe
  keyBuffer.set(new Uint8Array(32).fill(0), 62); // Pub key wipe
  keyBuffer.set(new Uint8Array(32).fill(0), 125); // Pub key wipe
  keyBuffer.set(new Uint8Array(32).fill(0), 161); // Priv key wipe
  keyBuffer.set(new Uint8Array(32).fill(0), 193); // Pub key wipe / Part of Priv (secret)

  // keyBuffer.set(new Uint8Array(1).fill(0x98), 97); // Length of comment most likely
  const randomINT31Bit = new Uint8Array([0x79, 0xe4, 0x25, 0x10]);
  keyBuffer.set(randomINT31Bit, 98); // Strange random value
  keyBuffer.set(randomINT31Bit, 98 + 4); // Strange random value repeats

  // Write
  keyBuffer.set(publicKeyBytes, 62);
  keyBuffer.set(publicKeyBytes, 125);
  keyBuffer.set(privateKeyBytes, 161); // offset is 161 but it does not move
  keyBuffer.set(publicKeyBytes, 193);

  // console.log("XXX", Buffer.from(hexEncodedPayloadBytes).toString("hex"));

  // console.log("YYY", Buffer.from(keyBuffer).toString("hex"));

  // console.log("CCC", Buffer.from(keyBuffer).toString("utf-8"));

  const sshPrivateKeyString = `-----BEGIN OPENSSH PRIVATE KEY-----
${getBase64Decoder()
  .decode(keyBuffer)
  .split(/(.{70})/)
  .filter(Boolean)
  .join("\n")}
-----END OPENSSH PRIVATE KEY-----
`;

  return {
    sshPrivateKeyString: sshPrivateKeyString,
  };
};
