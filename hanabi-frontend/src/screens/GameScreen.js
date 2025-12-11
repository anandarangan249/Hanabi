const GameScreen = ({ gameState }) => (
    <div className="game-screen">
        <div className="game-info">
            <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.8em', opacity: 0.7 }}>HINTS</span>
                <strong style={{ fontSize: '1.5em', color: '#667eea' }}>{gameState?.hints || 8}</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.8em', opacity: 0.7 }}>MISTAKES</span>
                <strong style={{ fontSize: '1.5em', color: '#ff6b6b' }}>{gameState?.mistakes || 0}/3</strong>
            </div>
        </div>

        <div className="game-area" style={{ 
            minHeight: '300px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px dashed rgba(255,255,255,0.2)',
            borderRadius: '12px',
            marginTop: '20px'
        }}>
            <p style={{ opacity: 0.5 }}>Game Board Rendering...</p>
        </div>
    </div>
);

export default GameScreen
