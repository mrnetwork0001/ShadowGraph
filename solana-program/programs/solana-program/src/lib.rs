use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod shadowgraph_orchestrator {
    use super::*;

    /// Initializes a new contact discovery request on-chain.
    /// Stores Party A's public key and the reference to the Arcium MXE Task.
    pub fn initialize_discovery(
        ctx: Context<InitializeDiscovery>,
        mxe_task_id: [u8; 32],
    ) -> Result<()> {
        let discovery_request = &mut ctx.accounts.discovery_request;
        
        discovery_request.party_a = ctx.accounts.party_a.key();
        discovery_request.party_b = Pubkey::default(); // Party B will join later
        discovery_request.mxe_task_id = mxe_task_id;
        discovery_request.status = DiscoveryStatus::Pending;
        
        msg!("Discovery request initialized.");
        msg!("MXE Task ID logged: {:?}", mxe_task_id);
        
        Ok(())
    }

    /// Allows Party B to join an existing discovery request.
    pub fn join_discovery(ctx: Context<JoinDiscovery>) -> Result<()> {
        let discovery_request = &mut ctx.accounts.discovery_request;
        
        require!(
            discovery_request.status == DiscoveryStatus::Pending,
            ErrorCode::NotPending
        );
        
        discovery_request.party_b = ctx.accounts.party_b.key();
        discovery_request.status = DiscoveryStatus::Active;
        
        msg!("Party B has joined the computing session.");
        msg!("Task is now active for Arcium execution.");
        
        Ok(())
    }

    /// Marks the computation as complete.
    /// In production, access control ensures only Arcium RTG nodes/relayers can call this.
    pub fn complete_discovery(ctx: Context<CompleteDiscovery>) -> Result<()> {
        let discovery_request = &mut ctx.accounts.discovery_request;
        
        require!(
            discovery_request.status == DiscoveryStatus::Active,
            ErrorCode::NotActive
        );
        
        discovery_request.status = DiscoveryStatus::Completed;
        
        msg!("Arcium MPC computation verified and completed.");
        
        Ok(())
    }
}

// --------------------------------------------------------
// Anchor Context Validation Structs
// --------------------------------------------------------

#[derive(Accounts)]
pub struct InitializeDiscovery<'info> {
    #[account(
        init,
        payer = party_a,
        space = 8 + DiscoveryRequest::INIT_SPACE
    )]
    pub discovery_request: Account<'info, DiscoveryRequest>,
    
    #[account(mut)]
    pub party_a: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinDiscovery<'info> {
    #[account(mut)]
    pub discovery_request: Account<'info, DiscoveryRequest>,
    
    pub party_b: Signer<'info>,
}

#[derive(Accounts)]
pub struct CompleteDiscovery<'info> {
    #[account(mut)]
    pub discovery_request: Account<'info, DiscoveryRequest>,
    
    // Abstract authority representing the Arcium Network relayer
    // Validating ZK Proofs or computation results on-chain goes here.
    pub authority: Signer<'info>, 
}

// --------------------------------------------------------
// Program State
// --------------------------------------------------------

#[account]
#[derive(InitSpace)]
pub struct DiscoveryRequest {
    pub party_a: Pubkey,         // Initiator
    pub party_b: Pubkey,         // Participant
    pub mxe_task_id: [u8; 32],   // Arcium Execution Environment Task ID
    pub status: DiscoveryStatus, // State machine tracker
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum DiscoveryStatus {
    Pending,
    Active,
    Completed,
    Failed,
}

// --------------------------------------------------------
// Custom Errors
// --------------------------------------------------------

#[error_code]
pub enum ErrorCode {
    #[msg("The discovery request must be in the Pending state to join.")]
    NotPending,
    #[msg("The discovery request must be Active to complete validation.")]
    NotActive,
}
