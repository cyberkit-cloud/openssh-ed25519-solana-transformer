# OpenSSH ed25519 Solana Transformer

A utility library that transforms OpenSSH ed25519 keys to Solana addresses and private keys, and vice versa. This bridges the gap between existing DevSecOps tools and the Solana blockchain, enabling you to encrypt files for Solana addresses using standard tools like [age](https://github.com/FiloSottile/age), generate SSH keys from Solana keypairs, and integrate Solana operations into your existing infrastructure.

## Idea behind the project

Ever felt like your SSH keys and Solana wallet were living in two different dimensions? What if we told you they don't have to be? This transformer is your interdimensional bridge between the DevSecOps universe and the Solana blockchain. Generate Solana keypairs with ssh-keygen, encrypt files for Solana addresses using age, and use your Solana keys for Git commits and VPS access. It's like discovering your SSH keys had a secret identity as Solana wallets all along. Welcome to the best-kept secret of infrastructure-meets-solana-blockchain.

Why should you care? Because you get the best of both worlds without any compromises. Your existing DevSecOps workflows suddenly gain Solana superpowers. Your Solana security infrastructure gets battle-tested cryptographic tools. Teams can encrypt sensitive data directly for Solana addresses using standard Unix tools. No custom wallets, no proprietary formats, just pure cryptographic elegance. It's the security Swiss Army knife that makes your infrastructure and blockchain work together like they were always meant to.

## Getting Started

### Setup

Clone the repository and open it in VS Code:

```bash
git clone https://github.com/cyberkit-cloud/openssh-ed25519-solana-transformer.git
cd openssh-ed25519-solana-transformer
code .
```

Reopen it in a dev container. Wait for Docker to build the image and start the dev container with all necessary tools.

### Generate Your First Solana Address

Create a Solana keypair using ssh-keygen:

```bash
ssh-keygen -t ed25519 -C "anonymous@developer.solana.com"  -f .devcontainer/.secrets/KEYS/anonymous-dev
node index.ts
```

### Encrypt Files for Solana Addresses

Use the age encryption tool to encrypt files for Solana addresses:

```bash
age -r 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKa01Sbm9uGiUSlArgE7/KltbIiH9ZadGvDxMnxt+fvV anon@solana' examples/secret.txt > examples/secret.age.txt

age -d -i ./.devcontainer/.secrets/KEYS/anonymous-dev examples/secret.age.txt
```

## Features

This project enables you to:

- Convert OpenSSH ed25519 public keys to Solana addresses
- Extract Solana private keys from OpenSSH format keypairs
- Generate OpenSSH format keys from Solana addresses
- Integrate Solana keypairs with standard SSH tooling
- Encrypt and decrypt files for Solana addresses using the [age tool](https://github.com/FiloSottile/age)
- Use ssh-keygen to create Solana-compatible keypairs
- Use solana-keygen to generate SSH-compatible keys
- Sign Git commits with your Solana keypair

## Donations

If you want to support the project you can tip me in SOL or well anything actually to my Solana address `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK5xtyFM3UCVzEY/Uk3L0AmZg+c6ZqqrFrIWtepa3WTs gordan@neki.ch`

`CjxWa7hvuzC8MHnzJ68K6nuUJqBB4piXjMyHxmfNKC5R`

## Roadmap (Plan for the future )

- Build CLI tool, so it is easier to work with the idea than to edit scripts.
- Talk with Solflare devs to implement importing OPEN SSH PEM format into wallets directly.

## Contributing

Contributions are welcome. Please note that this is a work-in-progress project and may contain bugs. Feel free to submit issues and pull requests.

## Development

Development with this project is streamlined using dev containers. All necessary tools are pre-installed, including Node.js, ssh-keygen, age, solana-keygen, and TypeScript.

The development boilerplate was adapted from [WEB-CDE](https://github.com/gnekich/web-cde).

## Authors

It is part of the DevTools provided by CybeKit.cloud by Cyberpunk d.o.o. developers and any open source contributors under Apache 2.0 [licence](./LICENCE.md).
