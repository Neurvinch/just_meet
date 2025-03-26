import React, { useState, useEffect } from 'react';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set username once on mount
  useEffect(() => {
    const user = prompt('Enter your username:') || 'Anonymous';
    setUsername(user);
  }, []);

  const sendMessage = async () => {
    if (input.trim() && username) {
      setLoading(true);
      setError('');

      try {
        // Simulate message sending
        const newMessage = { 
          _id: Date.now(), 
          text: input, 
          user: username 
        };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
      } catch (error) {
        setError("Message send failed!");
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl relative">
          <div className="bg-black rounded-2xl shadow-2xl border-4 border-white p-8 relative">
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white pixel-font tracking-wider">Just_meet Chat</h1>
            </div>

            {/* Chat Messages Container */}
            <div 
              className="h-[400px] overflow-y-auto bg-black border-2 border-white rounded-lg mb-4 p-4 space-y-2"
            >
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center pixel-font">
                  No messages yet. Start chatting!
                </p>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg._id} 
                    className="bg-gray-800 p-3 rounded-lg text-left border border-white"
                  >
                    <strong className="text-yellow-300 mr-2 pixel-font">{msg.user}:</strong>
                    <span className="text-white pixel-font">{msg.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* Message Input Area */}
            <div className="space-y-4">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..." 
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg pixel-font placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              
              <button 
                onClick={sendMessage}
                disabled={loading}
                className="w-full bg-yellow-400 text-black text-sm font-bold py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {error && <p className="text-red-500 text-center pixel-font mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;