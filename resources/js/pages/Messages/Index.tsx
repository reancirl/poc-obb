import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MessageSquare, Search, Send, User, Clock } from 'lucide-react';

interface Props {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

interface Message {
  id: number;
  sender: string;
  senderRole: string;
  avatar: string;
  preview: string;
  date: string;
  unread: boolean;
  messages: {
    content: string;
    timestamp: string;
    fromMe: boolean;
  }[];
}

export default function MessagesIndex({ auth }: Props) {
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data - would be replaced with API calls
  const conversations: Message[] = [
    {
      id: 1,
      sender: 'John Smith',
      senderRole: 'buyer',
      avatar: '',
      preview: 'I\'m interested in your restaurant listing...',
      date: '2 hours ago',
      unread: true,
      messages: [
        { content: 'Hi there! I\'m interested in your restaurant listing in Downtown. Is it still available?', timestamp: '2 hours ago', fromMe: false },
        { content: 'Yes, it\'s still available! What would you like to know about it?', timestamp: '1 hour ago', fromMe: true },
        { content: 'I\'d like to know more about the monthly revenue and if there\'s any room for negotiation on the price.', timestamp: '1 hour ago', fromMe: false },
      ]
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      senderRole: 'seller',
      avatar: '',
      preview: 'Thank you for your prompt response...',
      date: 'Yesterday',
      unread: false,
      messages: [
        { content: 'I saw your profile and wanted to ask if you\'re interested in a tech startup that\'s currently not listed.', timestamp: 'Yesterday', fromMe: false },
        { content: 'I might be interested depending on the details. What industry is it in?', timestamp: 'Yesterday', fromMe: true },
        { content: 'It\'s an AI-driven analytics platform for retail. I can send you more information if you\'d like.', timestamp: 'Yesterday', fromMe: false },
        { content: 'Thank you for your prompt response! Yes, please send more details.', timestamp: 'Yesterday', fromMe: true },
      ]
    }
  ];

  const filteredConversations = conversations.filter(conversation => 
    conversation.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, you would send this to the server
    console.log('Sending message:', newMessage);
    
    // For demo purposes, we'll just add it locally
    setSelectedConversation({
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        { content: newMessage, timestamp: 'Just now', fromMe: true }
      ]
    });
    
    setNewMessage('');
  };

  const userRole = auth.user.role;
  const pageTitle = userRole === 'seller' ? 'Seller Message Center' : 'Buyer Message Center';
  
  return (
    <AppLayout>
      <Head title="Message Center" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Message Center
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {userRole === 'seller' 
                  ? 'Communicate with potential buyers interested in your listings.' 
                  : 'Connect with sellers to learn more about their businesses.'}
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex h-[600px]">
              {/* Conversation list sidebar */}
              <div className="w-full md:w-1/3 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2"
                      placeholder="Search messages"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[calc(600px-65px)]">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.sender}
                                <span className="ml-1 text-xs text-gray-500 capitalize">
                                  ({conversation.senderRole})
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 whitespace-nowrap">
                                {conversation.date}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className={`text-xs truncate ${conversation.unread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                {conversation.preview}
                              </p>
                              {conversation.unread && (
                                <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No conversations found
                    </div>
                  )}
                </div>
              </div>
              
              {/* Message view */}
              <div className="hidden md:flex md:flex-col w-2/3">
                {selectedConversation ? (
                  <>
                    {/* Conversation header */}
                    <div className="p-4 border-b border-gray-200 flex items-center">
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConversation.sender}
                          <span className="ml-1 text-xs text-gray-500 capitalize">
                            ({selectedConversation.senderRole})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Last active {selectedConversation.date}
                        </p>
                      </div>
                    </div>

                    {/* Message list */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      {selectedConversation.messages.map((message, index) => (
                        <div key={index} className={`mb-4 flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.fromMe 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.fromMe ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                          type="button"
                          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={handleSendMessage}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                      <MessageSquare className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No conversation selected
                    </h3>
                    <p className="text-gray-500 text-center max-w-sm">
                      Select a conversation from the list or start a new one to begin messaging.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Empty state for mobile - shown when no conversation selected */}
              <div className="flex md:hidden w-2/3 flex-col items-center justify-center p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Select a conversation to view messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
