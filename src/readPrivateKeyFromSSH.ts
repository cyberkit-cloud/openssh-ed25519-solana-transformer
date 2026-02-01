import {
  createKeyPairSignerFromPrivateKeyBytes,
  getBase58Decoder,
  getBase16Decoder,
} from "@solana/kit";

export const readPrivateKeyFromSSH = async (sshPrivateKeyPEMString: string) => {
  // console.log("-".repeat(50));
  // console.log(`[readPrivateKeyFromSSH]`);

  const base64Data = sshPrivateKeyPEMString
    .replace(/-----BEGIN OPENSSH PRIVATE KEY-----/, "")
    .replace(/-----END OPENSSH PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");

  const bufferFromBase64 = Buffer.from(base64Data, "base64");

  // console.log('XXX', bufferFromBase64.toString('hex'));

  // console.log("✓ Buffer from Base64:", bufferFromBase64);
  // console.log("✓ Length of Buffer:", bufferFromBase64.length, "bytes");

  // console.log("✓ String:", bufferFromBase64.toString("utf-8"));

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
  const header = bufferFromBase64.slice(0, 15);
  // console.log("✓ Header:", header.toString("utf-8"));

  const cipherNameLength = bufferFromBase64.readUInt32BE(15);
  const cipherName = bufferFromBase64
    .slice(19, 19 + cipherNameLength)
    .toString("utf-8");
  //console.log("✓ Cipher Name:", cipherName);

  const kdfNameOffset = 19 + cipherNameLength;
  const kdfNameLength = bufferFromBase64.readUInt32BE(kdfNameOffset);
  const kdfName = bufferFromBase64
    .slice(kdfNameOffset + 4, kdfNameOffset + 4 + kdfNameLength)
    .toString("utf-8");
  // console.log("✓ KDF Name:", kdfName);

  const kdfOffset = kdfNameOffset + 4 + kdfNameLength;
  const kdfLength = bufferFromBase64.readUInt32BE(kdfOffset);
  // console.log("✓ KDF Length:", kdfLength);

  const numKeysOffset = kdfOffset + 4 + kdfLength;
  const numKeys = bufferFromBase64.readUInt32BE(numKeysOffset);
  // console.log("✓ Number of Keys:", numKeys);

  const publicKeyOffset = numKeysOffset + 4;
  const publicKeyLength = bufferFromBase64.readUInt32BE(publicKeyOffset);
  // console.log("✓ Public Key Length:", publicKeyLength);

  const privateKeyOffset = publicKeyOffset + 4 + publicKeyLength;
  const privateKeyLength = bufferFromBase64.readUInt32BE(privateKeyOffset);
  // console.log("✓ Private Key Length:", privateKeyLength);

  const privateKeyPartsOffset = privateKeyOffset + 4;
  const pub0Length = bufferFromBase64.readUInt32BE(privateKeyPartsOffset);
  const pub0 = bufferFromBase64.slice(
    privateKeyPartsOffset + 4,
    privateKeyPartsOffset + 4 + pub0Length,
  );
  // console.log("✓ Public Key Part 0 Length:", pub0Length);
  // console.log("✓ Public Key Part 0:", pub0.toString("utf8"));

  const x = 8 + 8 + cipherNameLength + 3 + 32 + 4;
  const sixtyFourBytePrivateKeyData = pub0.slice(x, x + 32);
  const emptyPub = new Uint8Array(32).fill(0);

  // connect sixtyFourBytePrivateKeyData with emptyPub to form a 64-byte private key
  const fullPrivateKey = new Uint8Array(32);
  fullPrivateKey.set(sixtyFourBytePrivateKeyData, 0); // Set the first 32 bytes
  // fullPrivateKey.set(emptyPub, 32); // Set the last 32 bytes

  //   console.log(
  //     "✓ Sixty Four Byte Private Key Data:",
  //     sixtyFourBytePrivateKeyData.toString("utf8"),
  //   );
  //   console.log(
  //     "✓ Sixty Four Byte Private Key Data:",
  //     new Uint8Array(sixtyFourBytePrivateKeyData),
  //   );

  //   console.log("✓ Private Key Data:", new Uint8Array(fullPrivateKey));

  const signer = await createKeyPairSignerFromPrivateKeyBytes(
    fullPrivateKey,
    true,
  );

  const exportedPrivateKeyPKCS8ArrayBuffer = await crypto.subtle.exportKey(
    "pkcs8",
    signer.keyPair.privateKey,
  );
  const exportedPrivateKey32BytesUint8Array = new Uint8Array(
    exportedPrivateKeyPKCS8ArrayBuffer,
    exportedPrivateKeyPKCS8ArrayBuffer.byteLength - 32,
    32,
  );
  const privateKeyBase58 = getBase58Decoder().decode(
    exportedPrivateKey32BytesUint8Array,
  );

  // console.log(
  //   "✓ Exported Private Key (from PKCS8(crypto.subtle) - Uint8Array):",
  //   exportedPrivateKey32BytesUint8Array,
  // );

  const exportedPublicKeyRAWArrayBuffer = await crypto.subtle.exportKey(
    "raw",
    signer.keyPair.publicKey,
  );
  const exportedPublicKeyBytesUint8Array = new Uint8Array(
    exportedPublicKeyRAWArrayBuffer,
  );

  const secretPaddedWithZerosForPublicKey = new Uint8Array([
    ...exportedPrivateKey32BytesUint8Array,
    ...new Uint8Array(32).fill(0),
  ]);

  const secretPaddedWithZerosForPublicKeyBase58 = getBase58Decoder().decode(
    secretPaddedWithZerosForPublicKey,
  );

  const secret = new Uint8Array([
    ...exportedPrivateKey32BytesUint8Array,
    ...exportedPublicKeyBytesUint8Array,
  ]);

  const secretBase58 = getBase58Decoder().decode(secret);

  return {
    signer,
    address: signer.address,
    publicKey: exportedPublicKeyBytesUint8Array,
    publicKeyHex: getBase16Decoder().decode(exportedPublicKeyBytesUint8Array),
    privateKey: exportedPrivateKey32BytesUint8Array,
    privateKeyBase58,
    privateKeyHex: getBase16Decoder().decode(
      exportedPrivateKey32BytesUint8Array,
    ),
    secret,
    secretBase58,
    secretHex: getBase16Decoder().decode(secret),
    secretPaddedWithZerosForPublicKey,
    secretPaddedWithZerosForPublicKeyBase58,
    secretPaddedWithZerosForPublicKeyHex: getBase16Decoder().decode(
      secretPaddedWithZerosForPublicKey,
    ),
  };
};
