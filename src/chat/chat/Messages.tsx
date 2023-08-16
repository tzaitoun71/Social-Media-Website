import { Timestamp } from 'firebase/firestore';
import '../ChatStyle.css'
import { Message } from "./Message";
import { Contact } from './Chats';

interface MessagesProps {
    messages: Array<{ content: string; senderId: string; timestamp: Timestamp }>;
    currentUser: Contact;
}

export const Messages = ({ messages, currentUser }: MessagesProps) => {
    return (
        <div className="messages">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    text={message.content}
                    isCurrentUser={message.senderId === currentUser.uid}
                />
            ))}
        </div>
    );
};
