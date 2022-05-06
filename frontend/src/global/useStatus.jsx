import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_HOST, CLIENT } from './Constants'

const StatusContext = createContext({
  socket: null,
  setSocket: () => { }
});

const StatusProvider = (props) => {

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(API_HOST,
    );
    // const socket = io(API_HOST);

    setSocket(socket);
  }, []);
  useEffect(() => {
    console.log(socket);
    if (socket) {
      console.log('My clientID is ', CLIENT)
      socket.emit('clientID', CLIENT)
    }
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