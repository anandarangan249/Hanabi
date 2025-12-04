const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
  	cors: {
		origin: "http://localhost:3000", // Your frontend URL
		methods: ["GET", "POST"]
  	}
});

// In-memory storage (replace with DB later if needed)
const rooms = new Map();
const games = new Map();

// Utility functions
function generateRoomId() {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId() {
	return 'player_' + Math.random().toString(36).substring(2, 9);
}

// Socket.IO event handlers
io.on('connection', (socket) => {
	console.log('New connection:', socket.id);
  
	// Create a new room
	socket.on('create_room', (playerName) => {
		const roomId = generateRoomId();
		const playerId = generatePlayerId();
	
		const room = {
			id: roomId,
			players: [{
				id: playerId,
				name: playerName,
				socketId: socket.id,
				isHost: true,
				ready: false
			}],
			gameState: 'lobby', // lobby, playing, finished
			settings: {
				maxPlayers: 5,
				timer: null,
				variant: 'standard'
			}
		};
	
		rooms.set(roomId, room);
		socket.join(roomId);
		
		socket.emit('room_created', {
			roomId,
			playerId,
			room
		});
		
		console.log(`Room created: ${roomId} by ${playerName}`);
	});
  
	// Join existing room
	socket.on('join_room', ({ roomId, playerName }) => {
		const room = rooms.get(roomId);
		if (!room) {
			socket.emit('error', 'Room not found');
			return;
		}
		
		if (room.players.length >= room.settings.maxPlayers) {
			socket.emit('error', 'Room is full');
			return;
		}
		
		const playerId = generatePlayerId();
		const player = {
			id: playerId,
			name: playerName,
			socketId: socket.id,
			isHost: false,
			ready: false
		};
		
		room.players.push(player);
		rooms.set(roomId, room);
		socket.join(roomId);
		
		// Notify everyone in the room
		io.to(roomId).emit('player_joined', {
			player,
			room
		});
		
		socket.emit('room_joined', {
			roomId,
			playerId,
			room
		});
	});
  
	// Start game
	socket.on('start_game', (roomId) => {
		const room = rooms.get(roomId);
		if (!room || room.gameState !== 'lobby') return;
		
		// Initialize game state
		const gameState = initializeGame(room.players);
		games.set(roomId, gameState);
		room.gameState = 'playing';
		
		// Notify all players
		io.to(roomId).emit('game_started', {
			gameState: getPlayerView(gameState, null), // Send initial state
			room
		});
		
		// Send each player their private view
		room.players.forEach(player => {
			io.to(player.socketId).emit('your_hand', {
				hand: getPlayerView(gameState, player.id).hand
			});
		});
	});
  
	// Handle disconnection
	socket.on('disconnect', () => {
		console.log('Client disconnected:', socket.id);
		// Clean up empty rooms
	});
});

// Basic game initialization (we'll expand this)
function initializeGame(players) {
	return {
		players: players.map(p => ({ ...p, hand: [] })),
		deck: [],
		discardPile: [],
		fireworks: {
		red: 0,
		blue: 0,
		green: 0,
		yellow: 0,
		white: 0
		},
		hints: 8,
		mistakes: 0,
		turn: 0,
		history: []
	};
}

function getPlayerView(gameState, playerId) {
	// Return game state with hidden information
	return {
		...gameState,
		players: gameState.players.map(p => ({
		...p,
		hand: p.id === playerId ? p.hand : p.hand.map(card => ({
			...card,
			color: null, // Hide color from other players
			number: null  // Hide number from other players
		}))
		}))
	};
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
