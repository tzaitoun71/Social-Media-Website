import '../ChatStyle.css';
import { Avatar } from '@mui/material';
import { Messages } from './Messages';
import { Input } from './Input';
import { Contact } from './Chats';
import { addDoc, collection, getFirestore, serverTimestamp, orderBy, query, Timestamp, where, getDocs } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

interface ChatProps {
    selectedUser: Contact | null;
    currentUser: Contact;
}

export const Chat = ({ selectedUser, currentUser }: ChatProps) => {
    const firestore = getFirestore();
    const [lastFetchedTimestamp, setLastFetchedTimestamp] = useState<Timestamp | null>(null);
    const chatRoomId = selectedUser?.uid
        ? currentUser.uid < selectedUser.uid
            ? `${currentUser.uid}_${selectedUser.uid}`
            : `${selectedUser.uid}_${currentUser.uid}`
        : '';

    const messagesRef = chatRoomId ? collection(firestore, 'chats', chatRoomId, 'messages') : null;

    const handleSendMessage = async (messageText: string) => {
        if (!messagesRef) return;

        try {
            await addDoc(messagesRef, {
                content: messageText,
                senderId: currentUser.uid,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const [messages, setMessages] = useState<Array<{ content: string; senderId: string; timestamp: Timestamp }>>([]);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!messagesRef) return;

        const fetchMessages = async () => {
            const queryMessages = lastFetchedTimestamp
                ? query(messagesRef, where('timestamp', '>', lastFetchedTimestamp), orderBy('timestamp'))
                : query(messagesRef, orderBy('timestamp'));

            const querySnapshot = await getDocs(queryMessages);
            const newMessages: { content: string; senderId: string; timestamp: Timestamp }[] = [];

            querySnapshot.forEach((doc) => {
                const messageData = doc.data();
                newMessages.push({
                    content: messageData.content,
                    senderId: messageData.senderId,
                    timestamp: messageData.timestamp,
                });
            });

            setMessages((prevMessages) => [...prevMessages, ...newMessages]);

            if (newMessages.length > 0) {
                setLastFetchedTimestamp(newMessages[newMessages.length - 1].timestamp);
            }
        };

        fetchMessages();
    }, [messagesRef, lastFetchedTimestamp]);

    useEffect(() => {
        // Scroll to the bottom of the messages container
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat">
            <div className='chat__info'>
                <Avatar alt={selectedUser?.username}>{selectedUser?.username[0]} </Avatar>
                <span>{selectedUser?.username}</span>
                <div className='chat__icons'></div>
            </div>
            <div className='chat__messages' ref={messagesContainerRef}>
                <Messages messages={messages} currentUser={currentUser} />
            </div>
            <Input onSendMessage={handleSendMessage} />
        </div>
    );
};
