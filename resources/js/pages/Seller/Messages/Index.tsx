import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'JD',
    lastMessage: 'Hi there! I\'m interested in your property...',
    time: '2h ago',
    unread: 3,
    active: true,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    lastMessage: 'Is the property still available?',
    time: '1d ago',
    unread: 0,
  },
  {
    id: 3,
    name: 'Michael Brown',
    avatar: 'MB',
    lastMessage: 'Can we schedule a viewing?',
    time: '2d ago',
    unread: 0,
  },
];

// Define the Message type
interface Message {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  isMe: boolean;
}

// Mock data for messages - will be replaced with real data
const messages: Message[] = [
  {
    id: 1,
    sender: 'John Doe',
    avatar: 'JD',
    content: 'Hi there! I\'m interested in your property. Could you tell me more about it?',
    time: '2h ago',
    isMe: false,
  },
  {
    id: 2,
    sender: 'You',
    avatar: 'ME',
    content: 'Hello! Yes, of course. What would you like to know?',
    time: '1h ago',
    isMe: true,
  },
  {
    id: 3,
    sender: 'John Doe',
    avatar: 'JD',
    content: 'Is the property still available for viewing this weekend?',
    time: '30m ago',
    isMe: false,
  },
];

// Define the Props type
interface Props {
  conversations: any[];
}

export default function SellerMessages({ conversations = [] }: Props) {
  return (
    <>
      <Head title="Message Center" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-semibold">Message Center</h1>
                  <p className="text-gray-600">Communicate with potential buyers</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    className="w-full bg-gray-50 pl-8"
                  />
                </div>
              </div>
              
              <div className="flex flex-col h-[calc(100vh-20rem)]">

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Conversation List */}
          <Card className="w-80 flex-shrink-0 overflow-hidden">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-4 hover:bg-muted/50 cursor-pointer ${
                      conversation.active ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className="relative h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                      {conversation.avatar}
                      {conversation.unread > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message Area */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">John Doe</CardTitle>
                  <p className="flex items-center gap-1 text-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Property
                </Button>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isMe && (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium mr-3 self-end">
                      {message.avatar}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 flex items-center gap-1 ${
                      message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                      {message.isMe && <Check className="h-3 w-3 ml-1" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="relative">
                    <Input
                      placeholder="Type a message..."
                      className="pr-20"
                    />
                    <Button 
                      size="sm" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4"
                    >
                      Send
                    </Button>
                  </div>
                </div>
          </Card>
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Apply the app layout with sidebar
SellerMessages.layout = (page: any) => <AppLayout>{page}</AppLayout>;
