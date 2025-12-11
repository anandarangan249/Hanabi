const HomeScreen = ({ 
    playerName, setPlayerName, 
    roomId, setRoomId, 
    onCreate, onJoin, 
    isLoading, error 
}) => (
    <div className="home-screen">
        <h1>🎆 Hanabi Online</h1>
        
        {/* Inline Error Message */}
        {error && <div style={{ color: '#ff6b6b', marginBottom: '15px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>⚠️ {error}</div>}

        <div className="input-group">
            <input
                type="text"
                placeholder="Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                disabled={isLoading}
            />
        </div>
        
        <div className="button-group">
            <button 
                onClick={onCreate} 
                className="btn btn-primary"
                disabled={isLoading}
            >
                {isLoading ? 'Creating...' : 'Create New Room'}
            </button>
            
            <div className="join-section">
                <input
                    type="text"
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    disabled={isLoading}
                />
                <button 
                    onClick={onJoin} 
                    className="btn btn-secondary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Joining...' : 'Join Room'}
                </button>
            </div>
        </div>
    </div>
);

export default HomeScreen
