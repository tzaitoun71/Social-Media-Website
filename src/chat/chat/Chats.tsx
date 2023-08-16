import { useEffect, useState } from 'react';
import { Avatar } from "@mui/material";
import { useUserContext } from '../../UserContext';
import { doc, getFirestore, getDoc, onSnapshot } from 'firebase/firestore';

export interface Contact {
    uid: string;
    username: string;
}

interface ChatsProps {
    onContactClick: (contact: Contact) => void;
}

export const Chats: React.FC<ChatsProps> = ({ onContactClick }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
    const { user } = useUserContext();
    const firestore = getFirestore();

    useEffect(() => {
        if (user) {
            const userRef = doc(firestore, 'userProfiles', user.uid);
            const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
                const userData = docSnapshot.data();
                if (userData) {
                    const userContacts = userData.contacts || [];
                    const contactsPromises = userContacts.map(async (contactUid: string) => {
                        const contactDocRef = doc(firestore, 'userProfiles', contactUid);
                        const contactDocSnapshot = await getDoc(contactDocRef);
                        if (contactDocSnapshot.exists()) {
                            const contactData = contactDocSnapshot.data();
                            return {
                                uid: contactUid,
                                username: contactData?.username || '',
                            };
                        }
                        return null;
                    });
                    Promise.all(contactsPromises).then((contactsData) => {
                        setContacts(contactsData.filter(Boolean) as Contact[]);
                    });
                }
            });

            return () => unsubscribe();
        }
    }, [firestore, user]);

    const handleContactClick = (contact: Contact) => {
        setSelectedUser(contact)
        onContactClick(contact); // Call the parent callback to open chat
    };


    const avatarStyle = {
        width: '50px',
        height: '50px',
    };

    return (
        <div className="chats">
            <div>{selectedUser?.username}</div>
            {contacts.map((contact) => (
                <div
                    key={contact.uid}
                    className="chats__userChat"
                    onClick={() => handleContactClick(contact)}
                >
                    <Avatar className="chats__avatar" style={avatarStyle} />
                    <div className="chats__userChatInfo">
                        <span>{contact.username}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
