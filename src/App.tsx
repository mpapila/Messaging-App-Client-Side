import { useEffect, useState } from 'react';
import './App.css'
import Router from './components/Router'
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/SocketSlice';
import { RootState } from './redux/store';
import { InitialMessage, Message } from './type';
import { addMessage, setChatRoomIdforNewMessage, setMessages, setNewMessages } from './redux/ChatRoomSlice';

function App() {
  const [userId, setUserId] = useState<string>()
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => state.chatRoom.messages)
  const chatRoom = useSelector((state: RootState) => state.chatRoom.chatRoomId)
  const socket = useSelector((state: RootState) => state.socket.socket)

  useEffect(() => {
    dispatch(setSocket(socket));

    socket.on('initial', (initialData) => {
      console.log('recieved inital userId:', initialData)
      setUserId(initialData.userId)
      const initialMessages = initialData.messages
        .map((message: InitialMessage) => {
          if (initialData.userId !== message.senderId) {
            dispatch(setChatRoomIdforNewMessage(message.chatRoom));
          }
          return {
            id: message.id,
            type: message.senderId === initialData.userId ? 'ownmessages' : 'recipients',
            text: message.content,
            date: new Date(message.createdAt),
            userId: message.senderId,
            chatRoom: message.chatRoom
          }
        })


      dispatch(setMessages(initialMessages))
    })


    socket.on('chat message', (messageData) => {
      console.log('messageData', messageData)
      setUserId((currentUserId) => {
        console.log('currentUserId', currentUserId)
        const type = messageData.backendUserId === currentUserId ? 'ownmessages' : 'recipients'
        // console.log('type', type)
        const newMessage: Message = {
          id: messages.length + 1,
          type,
          chatRoom: messageData.chatRoom,
          text: messageData.text,
          date: new Date(),
          userId: messageData.backendUserId
        }
        dispatch(addMessage(newMessage));
        const ours = messageData.backendUserId === currentUserId
        if (!ours) {
          dispatch(setNewMessages(true))
        }
        return currentUserId
      });
    })

    socket.connect();

    return () => {
      socket.disconnect()
      socket.off('chat message')
    }
  }, [chatRoom])

  return (
    <Router />
  )
}

export default App
