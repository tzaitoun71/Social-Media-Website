import '../ChatStyle.css'
import { useState } from 'react';
import { useUserContext } from '../../UserContext';
import { doc, getFirestore, query, getDocs, collection, where, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

interface SearchResult {
    uid: string;
    username: string;
}

export const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const firestore = getFirestore();
    const { user } = useUserContext();

    const handleSearch = async (searchText: string) => {
        try {
            const q = searchText.toLowerCase();
            const userProfilesRef = collection(firestore, 'userProfiles');
            const qField = 'username';
            const searchQuery = query(userProfilesRef, where(qField, '==', q));
            const querySnapshot = await getDocs(searchQuery);

            const results: SearchResult[] = [];
            querySnapshot.forEach((doc) => {
                results.push({
                    uid: doc.id,
                    username: doc.data().username,
                });
            });

            setSearchResults(results);
        } catch (error) {
            console.error('Error searching for users:', error);
        }
    };

    const handleResultClick = async (result: SearchResult) => {
        if (user) {
            await updateContacts(user.uid, result.uid);
            await updateContacts(result.uid, user.uid);
            await createChat(user.uid, result.uid);
        }
    };

    const updateContacts = async (currentUserUid: string, newContactUid: string) => {
        const userDocRef = doc(firestore, 'userProfiles', currentUserUid);
        await updateDoc(userDocRef, {
            contacts: arrayUnion(newContactUid),
        });
    };

    const createChat = async (userUid: string, contactUid: string) => {
        const chatRoomId = userUid < contactUid
            ? `${userUid}_${contactUid}`
            : `${contactUid}_${userUid}`;

        const chatRoomRef = doc(firestore, 'chats', chatRoomId);

        try {
            await setDoc(chatRoomRef, {
                participants: [userUid, contactUid],
            });

            console.log('Chat room created successfully!');
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    return (
        <div className="search">
            <div className="search__form">
                <input
                    className='search__input'
                    type="text"
                    placeholder="Find a User..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                />
                <ul>
                    {searchResults.map((result) => (
                        <li className='search__result' key={result.uid} onClick={() => handleResultClick(result)}>
                            {result.username}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
