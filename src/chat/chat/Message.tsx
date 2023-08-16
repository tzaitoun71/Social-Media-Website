import '../ChatStyle.css'

interface MessageProps {
    text: string;
    isCurrentUser: boolean;
  }
  
  export const Message = ({ text, isCurrentUser }: MessageProps) => {
    const messageClassName = isCurrentUser ? 'message__right' : 'message__left';
    const contentClassName = isCurrentUser ? 'message__content__right' : 'message__content__left';
    
    return (
      <div className={`message ${messageClassName}`}>
        <div className={`message__content ${contentClassName}`}>
          {text}
        </div>
      </div>
    );
  };