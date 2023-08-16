import { Chat } from "./chat/Chat";
import { Sidebar } from "./sidebar/Sidebar";
import './ChatStyle.css';
import { useState } from "react";
import { Contact } from "./chat/Chats";
import { useUserContext } from "../UserContext";


// Define a type for the current user
interface CurrentUser {
    uid: string;
    username: string;
}

// Use the CurrentUser type where needed
export const ChatHome = () => {
    const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
    const { user } = useUserContext();

    const handleContactClick = (contact: Contact) => {
        setSelectedUser(contact);
    }

    if (!user) {
        return <div>Please log in to use the chat.</div>;
    }

    const currentUser: CurrentUser = {
        uid: user.uid,
        username: user.displayName || '', // Make sure to replace this with the actual way you fetch the username
    };

    return (
        <div className="chathome">
            <div className="chathome__container">
                <Sidebar onContactClick={handleContactClick} />
                {selectedUser ? (
                    <Chat selectedUser={selectedUser} currentUser={currentUser} />
                ) : (
                    <div>Select a contact to start chatting.</div>
                )}
            </div>
        </div>
    );
}


