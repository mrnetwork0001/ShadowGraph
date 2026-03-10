# ShadowGraph Setup & Installation Guide

Since you are running Windows, please note that the **Arcium CLI (`arcup`)** is not natively supported on Windows right now. The recommended development environment for Arcium, Anchor, and Solana is either macOS or **Windows Subsystem for Linux (WSL)** (such as Ubuntu for Windows). 

I have proactively scaffolded the raw projects for you right here so you can begin developing the code directly. When you are ready to compile and deploy them, you will need to set up your WSL environment as follows.

## 1. Prerequisites (Inside WSL / Linux)

### Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
export PATH="/home/$USER/.local/share/solana/install/active_release/bin:$PATH"
solana-keygen new # Generate a new local keypair
```

### Install Node.js & Yarn
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn
```

### Install Anchor CLI
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## 2. Installing the Arcium CLI

Once the prerequisites are ready in WSL, you can install the Arcium version manager (`arcup`) and the CLI.

For `x86_64_linux` (default for WSL):
```bash
curl -L https://github.com/ArciumNetwork/arcup/releases/latest/download/arcup_x86_64_linux -o arcup
chmod +x arcup
./arcup install
```
*(Make sure you add the path to your shell's rc file as prompted by `arcup`)*

## 3. Building the Projects

Once the tooling is installed, you can navigate to the folders I scaffolded:

*   **Anchor Program (`solana-program/`)**: 
    Run `anchor build` to compile the BPF program.
*   **Arcis Circuit (`private-contacts/`)**: 
    Run `arcium build` inside the `private-contacts/` directory.
