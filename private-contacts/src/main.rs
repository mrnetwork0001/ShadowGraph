use arcis::prelude::*;

const SET_SIZE: usize = 100;

// We use u64::MAX as a sentinel value to indicate "no match"
const NO_MATCH: u64 = u64::MAX;

/// A 2-Party Private Set Intersection (PSI) circuit using Arcium secret-sharing primitives.
/// Party A and Party B provide their encrypted phone number hashes.
/// The circuit evaluates the intersection and returns the *indices* of Party A's 
/// array that found a match in Party B's array.
#[circuit]
pub fn private_set_intersection_indices(
    party_a_hashes: [Secret<u64>; SET_SIZE],
    party_b_hashes: [Secret<u64>; SET_SIZE],
) -> [Secret<u64>; SET_SIZE] {
    
    // Initialize the results array with our NO_MATCH sentinel value
    let mut match_indices: [Secret<u64>; SET_SIZE] = [Secret::from(NO_MATCH); SET_SIZE];
    
    // O(n^2) MPC evaluation logic. 
    // In zero-knowledge, we cannot early-return or branch on secret data,
    // so we iterate over the entire set size.
    for i in 0..SET_SIZE {
        let mut is_match_found = Secret::from(0u64);
        
        for j in 0..SET_SIZE {
            // Using the Arcis secret-sharing eq primitive. It evaluates to a Secret
            // bit resolving to 1 if equal, or 0 if not equal.
            let is_match = party_a_hashes[i].eq(&party_b_hashes[j]);
            
            // Bitwise OR accumulates the match status across the inner loop
            is_match_found = is_match_found | is_match;
        }
        
        // Multiplexing (mux) primitive:
        // If `is_match_found` is 1, it returns the first argument (the exact index `i`).
        // If `is_match_found` is 0, it returns the second argument (`NO_MATCH`).
        match_indices[i] = is_match_found.mux(
            Secret::from(i as u64), 
            Secret::from(NO_MATCH)
        );
    }
    
    match_indices
}

fn main() {
    println!("Circuit built: private-contacts (Returning Match Indices)");
}
