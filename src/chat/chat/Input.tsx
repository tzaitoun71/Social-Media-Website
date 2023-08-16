import { useState } from 'react';
import '../ChatStyle.css'

interface InputProps {
    onSendMessage: (messageText: string) => void;
}

export const Input = ({ onSendMessage }: InputProps) => {
    const [messageText, setMessageText] = useState('');

    const handleSendClick = () => {
        if (messageText.trim() !== '') {
            onSendMessage(messageText);
            setMessageText('');
        }
    };

    return (
        <div className="input">
            <input
                className='input__input'
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />
            <button className='input__send' onClick={handleSendClick}>Send</button>
        </div>
    );
};