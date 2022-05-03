import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_HOST, BROKER } from './Constants'

const StatusContext = createContext({
  socket: null,
  setSocket: () => { }
});

const StatusProvider = (props) => {

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(API_HOST);
    setSocket(socket);
  }, []);
  useEffect(() => {
    if (socket)
      socket.emit('brokerID', BROKER)
  }, [socket])
  return (
    <StatusContext.Provider
      value={{
        socket, setSocket
      }}
      {...props}
    />
  );
};

function useStatus() {
  return useContext(StatusContext);
}

export { StatusProvider, useStatus };