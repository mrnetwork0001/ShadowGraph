document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const connectBtn = document.getElementById('connectWalletBtn');
    const walletAddressEl = document.getElementById('walletAddress');
    const contactFile = document.getElementById('contactFile');
    const runDiscoveryBtn = document.getElementById('runDiscoveryBtn');
    const resultsSection = document.getElementById('resultsSection');
    const terminalOutput = document.getElementById('terminalOutput');
    const uploadText = document.querySelector('.upload-text');

    // State
    let isWalletConnected = false;
    let fileUploaded = false;

    // Connect Wallet Handler
    connectBtn.addEventListener('click', async () => {
        if (!isWalletConnected) {
            connectBtn.querySelector('.btn-text').textContent = 'INITIALIZING...';
            
            // Simulate Solana Phantom wallet connection delay
            setTimeout(() => {
                isWalletConnected = true;
                const mockAddress = '7XyT1...eC9q';
                
                // Update UI
                connectBtn.classList.add('hidden');
                walletAddressEl.textContent = `CONNECTED: ${mockAddress}`;
                walletAddressEl.classList.remove('hidden');
                
                checkReadyState();
            }, 1000);
        }
    });

    // File Upload Handler
    contactFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            uploadText.textContent = `LOADED: ${fileName}`;
            uploadText.style.color = 'var(--accent-cyan)';
            fileUploaded = true;
            
            checkReadyState();
        }
    });

    // Check if ready to run discovery
    function checkReadyState() {
        if (isWalletConnected && fileUploaded) {
            runDiscoveryBtn.disabled = false;
        }
    }

    // Run Terminal Animation
    function addTerminalLine(text, type = 'info', delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                
                const prompt = document.createElement('span');
                prompt.className = 'terminal-prompt';
                prompt.textContent = '>';
                
                const content = document.createElement('span');
                content.className = `terminal-text ${type}`;
                content.textContent = text;
                
                line.appendChild(prompt);
                line.appendChild(content);
                terminalOutput.appendChild(line);
                
                // Auto scroll to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                resolve();
            }, delay);
        });
    }

    // Run Discovery Protocol
    runDiscoveryBtn.addEventListener('click', async () => {
        runDiscoveryBtn.disabled = true;
        runDiscoveryBtn.querySelector('.btn-text').textContent = 'EXECUTING PROTOCOL...';
        
        resultsSection.classList.remove('hidden');
        terminalOutput.innerHTML = ''; // clear terminal
        
        // Mocking the Arcium / Solana Orchestration flow
        await addTerminalLine('Initializing Solana connection...', 'info', 500);
        await addTerminalLine('Validating Arcium RTG node availability...', 'info', 800);
        await addTerminalLine('Encrypting local contact payload.', 'warning', 1000);
        await addTerminalLine('Encrypting local contact payload..', 'warning', 300);
        await addTerminalLine('Encrypting local contact payload...', 'warning', 300);
        await addTerminalLine('Payload encrypted successfully.', 'success', 500);
        
        await addTerminalLine('Submitting computation task to Arcium Network (Tx: 4aF8...b12C)', 'info', 1200);
        await addTerminalLine('Awaiting MPC nodes verification...', 'info', 1500);
        
        await addTerminalLine('[ARCIS CIRCUIT] Executing 2-Party Private Set Intersection', 'warning', 2000);
        await addTerminalLine('Processing...', 'info', 1000);
        
        await addTerminalLine('Circuit execution completed. ZK Proof validated on Solana.', 'success', 2500);
        await addTerminalLine('Decrypting mutual connection results...', 'info', 800);
        
        await addTerminalLine('RESULTS FOUND: 3 Mutual Contacts Detected', 'success', 1000);
        await addTerminalLine('- 0xHashA... (Matched)', 'info', 300);
        await addTerminalLine('- 0xHashB... (Matched)', 'info', 300);
        await addTerminalLine('- 0xHashC... (Matched)', 'info', 300);
        
        runDiscoveryBtn.querySelector('.btn-text').textContent = 'PROTOCOL COMPLETE';
    });
});
