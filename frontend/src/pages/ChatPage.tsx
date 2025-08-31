import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  role: 'doctor' | 'patient' | 'clinic_admin';
  avatar?: string;
  online: boolean;
  lastSeen?: string;
}

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock chat partner
  const chatPartner: ChatUser = {
    id: userId || 'doctor1',
    name: 'Dr. Alma Ahmetović',
    role: 'doctor',
    online: true,
    lastSeen: '2024-12-26T10:30:00Z'
  };

  // Mock messages
  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: chatPartner.id,
      receiverId: user?.id || '',
      content: 'Zdravo! Kako se osjećate?',
      timestamp: '2025-01-15T09:15:00Z',
      type: 'text',
      read: true
    },
    {
      id: '2',
      senderId: user?.id || '',
      receiverId: chatPartner.id,
      content: 'Zdravo doktore! Bolje mi je, hvala. Prestali su bolovi.',
      timestamp: '2025-01-15T09:20:00Z',
      type: 'text',
      read: true
    },
    {
      id: '3',
      senderId: chatPartner.id,
      receiverId: user?.id || '',
      content: 'Super! Jeste li uzimali lijekove redovno?',
      timestamp: '2025-01-15T09:25:00Z',
      type: 'text',
      read: true
    },
    {
      id: '4',
      senderId: user?.id || '',
      receiverId: chatPartner.id,
      content: 'Da, svaki dan ujutro. Treba li da dođem na kontrolu?',
      timestamp: '2025-01-15T10:30:00Z',
      type: 'text',
      read: false
    }
  ];

  useEffect(() => {
    // Simulacija učitavanja poruka
    setLoading(true);
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 500);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: chatPartner.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulacija odgovora doktora
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: chatPartner.id,
        receiverId: user?.id || '',
        content: 'Hvala na informaciji. Kontrola bi bila dobra za dvije sedmice. Zakaži termin kada ti odgovara.',
        timestamp: new Date().toISOString(),
        type: 'text',
        read: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('bs-BA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Danas';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Jučer';
    } else {
      return date.toLocaleDateString('bs-BA');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-rose-600 font-medium">
                {chatPartner.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div>
              <h2 className="font-semibold text-gray-900">{chatPartner.name}</h2>
              <p className="text-sm text-gray-500">
                {chatPartner.online ? (
                  <span className="text-green-600">● Online</span>
                ) : (
                  `Poslednji put viđen ${formatTime(chatPartner.lastSeen || '')}`
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Phone className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Video className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.senderId === user?.id;
          const showDate = index === 0 || 
            formatDate(messages[index - 1]?.timestamp) !== formatDate(message.timestamp);
          
          return (
            <React.Fragment key={message.id}>
              {showDate && (
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-rose-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Paperclip className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Napišite poruku..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <Smile className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
