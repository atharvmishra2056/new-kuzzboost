import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your KuzzBoost AI assistant. I can help you find the perfect social media growth services, answer questions about our offerings, or assist with your orders. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses = {
    greetings: [
      "Hello! How can I assist you with your social media growth today?",
      "Hi there! I'm here to help you boost your social presence. What service are you interested in?",
      "Welcome to KuzzBoost! Let me help you find the perfect growth strategy."
    ],
    services: [
      "We offer a wide range of social media growth services including:\n• Instagram followers and likes\n• YouTube views and subscribers\n• TikTok engagement\n• Twitter followers\n• Discord members\n• And much more!\n\nWhich platform are you looking to grow?",
      "Our services cover all major social platforms. We provide high-quality, authentic engagement that helps boost your social presence safely and effectively.",
    ],
    pricing: [
      "Our pricing is very competitive and varies by service. For example:\n• Instagram followers start from ₹100\n• YouTube views from ₹50\n• TikTok likes from ₹75\n\nWould you like specific pricing for a particular service?",
      "We offer flexible pricing tiers to suit different budgets. All our services come with quality guarantees and customer support."
    ],
    orders: [
      "You can track your orders in the 'Order History' section after logging in. All orders are processed within 24-48 hours.",
      "If you have questions about a specific order, please provide your order ID and I'll help you track its status."
    ],
    quality: [
      "We pride ourselves on delivering high-quality, authentic engagement. All our services come with:\n• Quality guarantee\n• Gradual delivery\n• 24/7 customer support\n• Refill warranty\n• Safe and secure methods",
    ]
  };

  const getRandomResponse = (category: keyof typeof predefinedResponses): string => {
    const responses = predefinedResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return getRandomResponse('greetings');
    }
    
    if (message.includes('service') || message.includes('what do you offer') || message.includes('instagram') || message.includes('youtube') || message.includes('tiktok')) {
      return getRandomResponse('services');
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('how much') || message.includes('pricing')) {
      return getRandomResponse('pricing');
    }
    
    if (message.includes('order') || message.includes('track') || message.includes('status')) {
      return getRandomResponse('orders');
    }
    
    if (message.includes('quality') || message.includes('safe') || message.includes('real') || message.includes('authentic')) {
      return getRandomResponse('quality');
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! You can ask me about:\n• Our services and platforms\n• Pricing information\n• Order tracking\n• Quality and safety\n• General questions about social media growth\n\nWhat would you like to know?";
    }
    
    return "I understand you're asking about " + userMessage + ". While I'd love to help with that specific question, I recommend browsing our services or contacting our support team for detailed assistance. Is there anything else about our social media growth services I can help you with?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-vibrant shadow-elegant hover:scale-110 transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-peach rounded-full animate-pulse" />
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50"
          >
            <Card className="glass border-border/50 h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-vibrant flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-clash">AI Assistant</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        Online
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-4 pt-0">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {message.isBot && (
                        <div className="w-8 h-8 rounded-full bg-gradient-vibrant flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.isBot
                            ? 'bg-secondary text-primary'
                            : 'bg-gradient-vibrant text-white ml-auto'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {!message.isBot && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-vibrant flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-secondary p-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 glass"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-gradient-vibrant hover:scale-105 transition-transform"
                    disabled={isTyping || !inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;