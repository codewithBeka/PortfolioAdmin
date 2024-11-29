import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { useGetMessagesQuery, useMarkAsUnreadMutation } from '../../redux/api/messagesApi';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: messages = [], isLoading, isError } = useGetMessagesQuery();
  const [markAsUnread] = useMarkAsUnreadMutation();
  
  console.log("messages",messages)
  // State for unread count
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationList, setNotificationList] = useState([]);

  // Count unread messages
  useEffect(() => {
    const unreadMessages = messages.filter(message => message.status === 'unread');
    setUnreadCount(unreadMessages.length);
    setNotificationList(messages);
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000'); // Adjust URL as necessary
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
  };
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if (newMessage.type === 'contact') {
        console.log("newMessage",newMessage)
        const { _id, name, email, message } = newMessage.data;

        const newNotification = {
          id: _id, // Unique order ID
          name: name, // More informative title
          email:email   , // Detailed description
          message:message   , // Detailed description
          time: "Just now",
          status: 'unread',
      };

        setNotificationList((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1); // Increment unread count on new message
      }

   
    };

    return () => {
      ws.close();
    };
  }, []);

  console.log("Unread Count:", unreadCount);
console.log("Notification List:", notificationList);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };
  
  const handleMarkAsUnread = async (id) => {
    if (!id) {
      console.error('No ID provided for marking as unread.');
      return;
    }
  
    try {
      // Optimistically update the count
      setUnreadCount((prev) => prev - 1);
      
      await markAsUnread(id).unwrap(); // Trigger the mutation and wait for it to resolve
    } catch (error) {
      console.error('Failed to mark as unread:', error);
      // Optionally, revert the count if the mutation fails
      setUnreadCount((prev) => prev + 1);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative bg-gray-800 bg-opacity-50">
      <li>
        <Link
          onClick={handleDropdownToggle}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 z-10 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && (
          <div
            className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-gray-800 bg-opacity-50 shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Notifications
              </h5>
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              {isLoading && <li className="p-4 text-center">Loading notifications...</li>}
              {isError && <li className="p-4 text-center text-red-500">Error loading notifications.</li>}
              {!isLoading && !isError && notificationList.map((message) => (
                <li key={message._id}>
                  <Link
                    className={`flex flex-col gap-1 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 ${message.status === 'unread' ? 'bg-gray-200' : ''}`}
                    to="#"
                    onClick={() => handleMarkAsUnread(message._id)} // Trigger the mark as unread action
                  >
                    <p className="text-sm font-bold text-black dark:text-white">{message.name}</p>
                    <p className="text-xs text-gray-500">{message.email}</p>
                    <p className="text-sm">
                      <span className="text-white dark:text-white">{message.message.substring(0, 50)}{message.message.length > 50 ? '...' : ''}</span>
                    </p>
                    <p className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;