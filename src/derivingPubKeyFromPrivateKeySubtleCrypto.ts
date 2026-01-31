import { readFile } from "node:fs/promises";

import { readPublicKeyFromSSH } from "./readPublicKeyFromSSH.ts";
import { readPrivateKeyFromSSH } from "./readPrivateKeyFromSSH.ts";


const OPENSSH_dataString = await readFile(
  // "../.devcontainer/.secrets/KEYS/local-env-key",
  "../.devcontainer/.secrets/KEYS/dev-env",
  "utf-8",
);

const OPENSSH_dataStringPub = await readFile(
  // "../.devcontainer/.secrets/KEYS/local-env-key.pub",
  "../.devcontainer/.secrets/KEYS/dev-env.pub",
  "utf-8",
);

const sshPublicUint8Array = readPublicKeyFromSSH(OPENSSH_dataStringPub);
console.log("SSH Public Result Object:", sshPublicUint8Array);

const sshPrivateUint8Array = await readPrivateKeyFromSSH(OPENSSH_dataString);
console.log("Result Object:", sshPrivateUint8Array);


// ---
const ED25519_ALGORITHM_IDENTIFIER =
  // Resist the temptation to convert this to a simple string; As of version 133.0.3, Firefox
  // requires the object form of `AlgorithmIdentifier` and will throw a `DOMException` otherwise.
  Object.freeze({ name: "Ed25519" });

function addPkcs8Header(bytes: Uint8Array) {
  return new Uint8Array([
    /**
     * PKCS#8 header
     */
    48,
    // ASN.1 sequence tag
    46,
    // Length of sequence (46 more bytes)
    2,
    // ASN.1 integer tag
    1,
    // Length of integer
    0,
    // Version number
    48,
    // ASN.1 sequence tag
    5,
    // Length of sequence
    6,
    // ASN.1 object identifier tag
    3,
    // Length of object identifier
    // Edwards curve algorithms identifier https://oid-rep.orange-labs.fr/get/1.3.101.112
    43,
    // iso(1) / identified-organization(3) (The first node is multiplied by the decimal 40 and the result is added to the value of the second node)
    101,
    // thawte(101)
    // Ed25519 identifier
    112,
    // id-Ed25519(112)
    /**
     * Private key payload
     */
    4,
    // ASN.1 octet string tag
    34,
    // String length (34 more bytes)
    // Private key bytes as octet string
    4,
    // ASN.1 octet string tag
    32,
    // String length (32 bytes)
    ...bytes,
  ]);
}
async function createPrivateKeyFromBytes(
  bytes: Uint8Array,
  extractable = false,
) {
  const actualLength = bytes.byteLength;
  if (actualLength !== 32) {
    throw new Error(
      "Invalid private key length: " +
        actualLength +
        " bytes. Expected 32 bytes.",
    );
  }
  const privateKeyBytesPkcs8 = addPkcs8Header(bytes);
  return await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBytesPkcs8,
    ED25519_ALGORITHM_IDENTIFIER,
    extractable,
    ["sign"],
  );
}
async function createPublicKeyFromBytes(
  bytes: Uint8Array,
  extractable = false,
) {
  const actualLength = bytes.byteLength;
  if (actualLength !== 32) {
    throw new Error(
      "Invalid public key length: " +
        actualLength +
        " bytes. Expected 32 bytes.",
    );
  }
  return await crypto.subtle.importKey(
    "raw",
    bytes.slice(0, 32),
    ED25519_ALGORITHM_IDENTIFIER,
    extractable,
    ["verify"],
  );
}

const importPrivateKeyFromBytes = await createPrivateKeyFromBytes(
  sshPrivateUint8Array.privateKey,
  true,
);
console.log("Imported Private Key:", importPrivateKeyFromBytes);
console.log('Exported Private Key (Uint8Array):', new Uint8Array(await crypto.subtle.exportKey('pkcs8', importPrivateKeyFromBytes)));

async function getPublicKeyFromPrivateKey(privateKey: CryptoKey, extractable = false) {
  // assertKeyExporterIsAvailable();
  if (privateKey.extractable === false) {
    throw new Error('Key is not extractable');
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  return await crypto.subtle.importKey(
    "jwk",
    {
      crv: "Ed25519",
      ext: extractable,
      key_ops: ["verify"],
      kty: "OKP",
      x: jwk.x
    },
    "Ed25519",
    extractable,
    ["verify"]
  );
}
const derivedPublicKey = await getPublicKeyFromPrivateKey(importPrivateKeyFromBytes, true);
console.log("Derived Public Key from Private Key:", derivedPublicKey);
console.log('Exported Derived Public Key (Uint8Array):', new Uint8Array(await crypto.subtle.exportKey('raw', derivedPublicKey)));


const importPublicKeyFromBytes = await createPublicKeyFromBytes(
  sshPrivateUint8Array.publicKey,
  true,
);
console.log("Imported Public Key:", importPublicKeyFromBytes);
console.log('Exported Public Key (Uint8Array):', new Uint8Array(await crypto.subtle.exportKey('raw', importPublicKeyFromBytes)));