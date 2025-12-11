const LobbyScreen = ({ room, players, playerId, onStart }) => {
    const isHost = players.find(p => p.id === playerId)?.isHost;
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(room.id);
        // Optional: Add a temporary "Copied!" toast here
    };

    return (
        <div className="lobby-screen">
            <h2>Lobby</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                <p style={{ marginBottom: '5px', fontSize: '0.9em', opacity: 0.8 }}>Room Code</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '1.5em', letterSpacing: '2px' }}>{room.id}</strong>
                    <button 
                        onClick={copyToClipboard}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '0.8em' }}
                    >
                        Copy
                    </button>
                </div>
            </div>
            
            <div className="players-list">
                <h3>Players ({players.length}/5)</h3>
                {players.map((player) => (
                    <div key={player.id} className="player-item">
                        <span>
                            {player.isHost && '👑 '}
                            {player.name}
                            {player.id === playerId && ' (You)'}
                        </span>
                        {/* Status Indicator */}
                        <span style={{ color: '#4ade80' }}>Ready</span>
                    </div>
                ))}
            </div>
            
            {isHost ? (
                <button onClick={onStart} className="btn btn-primary" style={{ width: '100%' }}>
                    Start Game
                </button>
            ) : (
                <div style={{ padding: '15px', fontStyle: 'italic', opacity: 0.7 }}>
                    Waiting for host to start...
                </div>
            )}
        </div>
    );
};

export default LobbyScreen
