# ShadowGraph: Neon Privacy

ShadowGraph is a highly secure, private contact discovery application built for the **Arcium RTG (Real-Time Global)** environment. Using Solana for orchestration, we guarantee absolute data confidentiality across peer connections. 

## The Core Concept: Why Not Just Hashing?

Traditional web applications often claim "privacy" by simply hashing phone numbers or email addresses before sending them to a server (Standard Hashing). **This is critically vulnerable:**

### Standard Hashing (The Wrong Way)
1. **Brute Force & Rainbow Tables**: Phone numbers have a minimal entropy space (e.g., typically fewer than 15 digits). If a centralized database stores hashed phone numbers to compute intersections, an attacker who dumps the database can just pre-compute the hashes of all possible phone numbers globally and instantly reverse the hashes back into plaintext numbers.
2. **Data is Centralized**: A central server is inherently required to run the matching logic (`hash(A) == hash(B)`), making it a honeypot.

### Arcium MPC & Private Set Intersection (Our Approach)
ShadowGraph solves this using **Private Set Intersection (PSI)** evaluated strictly within **Arcium's Multi-Party Computation (MPC)** engine constraints:

1. **Local Hashing for Normalization**: The user's device hashes phone numbers (via SHA-256 natively in the browser) strictly to normalize the formatting off-chain *before* the data leaves the device.
2. **Multi-Party Computation (The Magic)**: The hashes are *secret-shared* via Arcis prior to computation. They are split into cryptographic pieces and distributed among independent Arcium execution nodes. 
3. **No Unencrypted Intersections**: The Arcium nodes compute the equality check (`eq()`) mathematically across the secret shares inside an execution circuit. **At no point does a single server or node hold the full hash, nor do they learn whose contact lists are intersecting.**
4. **Zero-Knowledge Return**: Only the mutual connection *indices* are revealed and verified using Solana ZK proofs, maintaining perfect confidentiality of non-intersecting and un-matched data.

By combining the UX of standard Web3 apps with the absolute cryptographic guarantees of Arcium MPC, ShadowGraph fundamentally alters how social graphs are managed.

## Local Development

If you have Node.js and WSL ready, you can boot the Next.js frontend:

```bash
cd frontend-next
npm install
npm run dev
```
