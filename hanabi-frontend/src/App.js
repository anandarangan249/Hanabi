import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
	const [screen, setScreen] = useState('home'); // home, lobby, game
	const [playerName, setPlayerName] = useState('');
	const [roomId, setRoomId] = useState('');
	const [playerId, setPlayerId] = useState('');
	const [room, setRoom] = useState(null);
	const [players, setPlayers] = useState([]);
	const [gameState, setGameState] = useState(null);

	// Socket event listeners
	useEffect(() => {
		socket.on('room_created', (data) => {
			setPlayerId(data.playerId);
			setRoom(data.room);
			setPlayers(data.room.players);
			setScreen('lobby');
		});
		
		socket.on('room_joined', (data) => {
			setPlayerId(data.playerId);
			setRoom(data.room);
			setPlayers(data.room.players);
			setScreen('lobby');
		});
		
		socket.on('player_joined', (data) => {
			setRoom(data.room);
			setPlayers(data.room.players);
		});
		
		socket.on('game_started', (data) => {
			setGameState(data.gameState);
			setScreen('game');
		});
		
		socket.on('error', (message) => {
			alert(message);
		});
		
		return () => {
			socket.off('room_created');
			socket.off('room_joined');
			socket.off('player_joined');
			socket.off('game_started');
			socket.off('error');
		};
	}, []);

	const handleCreateRoom = () => {
		if (!playerName.trim()) {
			alert('Please enter your name');
			return;
		}
		socket.emit('create_room', playerName);
	};

	const handleJoinRoom = () => {
		if (!playerName.trim() || !roomId.trim()) {
			alert('Please enter your name and room ID');
			return;
		}
		socket.emit('join_room', { roomId, playerName });
	};

	const handleStartGame = () => {
		socket.emit('start_game', room.id);
	};

	// Render screens
	const renderHomeScreen = () => (
		<div className="home-screen">
			<h1>🎆 Hanabi Online</h1>
			<div className="input-group">
				<input
					type="text"
					placeholder="Your Name"
					value={playerName}
					onChange={(e) => setPlayerName(e.target.value)}
				/>
			</div>
			<div className="button-group">
				<button onClick={handleCreateRoom} className="btn btn-primary">
					Create New Room
				</button>
				<div className="join-section">
					<input
						type="text"
						placeholder="Room ID"
						value={roomId}
						onChange={(e) => setRoomId(e.target.value.toUpperCase())}
					/>
					<button onClick={handleJoinRoom} className="btn btn-secondary">
						Join Room
					</button>
				</div>
			</div>
		</div>
	);

	const renderLobbyScreen = () => (
		<div className="lobby-screen">
			<h2>Room: {room.id}</h2>
			<p>Share this ID with friends: <strong>{room.id}</strong></p>
			
			<div className="players-list">
				<h3>Players ({players.length}/5)</h3>
				{players.map((player, index) => (
					<div key={player.id} className="player-item">
						{player.isHost && '👑 '}{player.name}
						{player.id === playerId && ' (You)'}
						{player.ready && ' ✓ Ready'}
					</div>
				))}
			</div>
			
			{players.some(p => p.isHost && p.id === playerId) && (
				<button onClick={handleStartGame} className="btn btn-primary">
					Start Game
				</button>
			)}
		</div>
	);

	const renderGameScreen = () => (
		<div className="game-screen">
			<h2>Game in Progress</h2>
			<div className="game-info">
				<p>Hints: {gameState?.hints}</p>
				<p>Mistakes: {gameState?.mistakes}/3</p>
			</div>
			<div className="game-area">
				{/* We'll build this in Phase 3 */}
				<p>Game board will appear here</p>
			</div>
		</div>
	);

	return (
		<div className="App">
			{screen === 'home' && renderHomeScreen()}
			{screen === 'lobby' && renderLobbyScreen()}
			{screen === 'game' && renderGameScreen()}
		</div>
	);
}

export default App;
