import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_HOST } from './Constants'

const StatusContext = createContext({
  clientID: null,
  setClientID: () => { },
  socket: null,
  setSocket: () => { }
});

const StatusProvider = (props) => {
  const [clientID, setClientID] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(API_HOST,
    );
    // const socket = io(API_HOST);

    setSocket(socket);
  }, []);
  useEffect(() => {
    console.log(socket);
    if (socket && clientID) {
      console.log('My clientID is ', clientID)
      socket.emit('clientID', clientID)
    }
  }, [socket, clientID])
  return (
    <StatusContext.Provider
      value={{
        clientID, setClientID,
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