import io from 'socket.io-client'
import { useState } from "react"
import { BROKER } from "./Constants"

const Socket = io.connect('http://localhost:7000')

const BROKERID = BROKER
// Socket.on('connect', () => {
if (Socket) {
  Socket.emit('brokerID', BROKERID)
  console.log(`I am ${BROKERID} after emit`)
}
// })


// const SocketFiveTicks = () => {
//   const [ticksInfo, setTicksInfo] = useState({
//     buyer: [],
//     seller: []
//   })

//   socket.on('fiveTicks', function (fiveTicks) {
//     console.log('fiveTicks', fiveTicks)
//     setTicksInfo(fiveTicks)
//   });
// }

// export default Socket
export { Socket };



// socket.on('execution', function (execution) {
//   console.log('execution', execution)
// });


