import '../ChatStyle.css';
import { Chats } from '../chat/Chats';
import { NavBar } from './Navbar';
import { Search } from './Search';
import { Contact } from '../chat/Chats';

interface SidebarProps {
    onContactClick: (contact: Contact) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onContactClick }) => {
    return (
        <div className="sidebar">
            <NavBar />
            <Search />
            <Chats onContactClick={onContactClick} />
        </div>
    );
};

