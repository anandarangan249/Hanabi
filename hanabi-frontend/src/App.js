import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import './App.css';
import HomeScreen from './screens/HomesScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';

// Use environment variable for production, fallback to localhost for dev
const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL);

// --- Main App Component ---
function App() {
    const [screen, setScreen] = useState('home'); // home, lobby, game
    
    // User Input State
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    
    // Game State
    const [playerId, setPlayerId] = useState('');
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState(null);
    
    // UI State
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Socket event listeners
    useEffect(() => {
        socket.on('room_created', (data) => {
            setIsLoading(false);
            setError('');
            setPlayerId(data.playerId);
            setRoom(data.room);
            setPlayers(data.room.players);
            setScreen('lobby');
        });
        
        socket.on('room_joined', (data) => {
            setIsLoading(false);
            setError('');
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
            setIsLoading(false);
            setError(message); // Display error in UI instead of alert
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
            setError('Please enter your name');
            return;
        }
        setIsLoading(true);
        socket.emit('create_room', playerName);
    };

    const handleJoinRoom = () => {
        if (!playerName.trim() || !roomId.trim()) {
            setError('Please enter your name and room ID');
            return;
        }
        setIsLoading(true);
        socket.emit('join_room', { roomId, playerName });
    };

    const handleStartGame = () => {
        socket.emit('start_game', room.id);
    };

    return (
        <div className="App">
            {screen === 'home' && (
                <HomeScreen 
                    playerName={playerName}
                    setPlayerName={setPlayerName}
                    roomId={roomId}
                    setRoomId={setRoomId}
                    onCreate={handleCreateRoom}
                    onJoin={handleJoinRoom}
                    isLoading={isLoading}
                    error={error}
                />
            )}
            
            {screen === 'lobby' && (
                <LobbyScreen 
                    room={room} 
                    players={players} 
                    playerId={playerId} 
                    onStart={handleStartGame} 
                />
            )}
            
            {screen === 'game' && (
                <GameScreen 
                    gameState={gameState} 
                />
            )}
        </div>
    );
}

export default App;
