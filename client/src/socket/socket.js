import {io} from 'socket.io-client';
//link
const socket = io('ws://localhost:8000');

export default socket;