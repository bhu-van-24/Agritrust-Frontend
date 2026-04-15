import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, TextField, CircularProgress, Fab, Slide, Avatar, InputAdornment } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { chatService } from '../api';

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AgriCredit Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatService.askQuestion(userMsg);
      setMessages(prev => [...prev, { text: res.data.response, isBot: true }]);
    } catch {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="chat" 
        sx={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 32, 
          zIndex: 1000,
          width: 64,
          height: 64,
          boxShadow: '0 8px 32px rgba(39, 78, 19, 0.4)',
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? <CloseIcon sx={{ fontSize: 28 }} /> : <ChatIcon sx={{ fontSize: 28 }} />}
      </Fab>

      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: 110,
            right: 32,
            width: 380,
            maxWidth: 'calc(100vw - 64px)',
            height: 550,
            maxHeight: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            borderRadius: 5,
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 2.5, 
            background: 'linear-gradient(135deg, #274e13 0%, #4c8c4a 100%)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <SmartToyIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Agri Assistant</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>AI-Powered Support</Typography>
            </Box>
            <IconButton size="small" color="inherit" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Wrapper */}
          <Box sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflowY: 'auto', 
            bgcolor: '#ffffff', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5,
            backgroundImage: 'radial-gradient(#f0f0f0 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.isBot ? 'flex-start' : 'flex-end' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', maxWidth: '85%' }}>
                  {msg.isBot && (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light', mb: 0.5 }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: msg.isBot ? '#f0f4f0' : 'primary.main', 
                      color: msg.isBot ? 'text.primary' : 'white',
                      borderRadius: 4,
                      borderTopLeftRadius: msg.isBot ? 4 : 20,
                      borderBottomRightRadius: msg.isBot ? 20 : 4,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>{msg.text}</Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light' }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: '#f0f4f0', borderRadius: 4, borderTopLeftRadius: 4 }}>
                  <CircularProgress size={16} thickness={5} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 6,
                  backgroundColor: '#f8f9fa',
                  '& fieldset': { border: 'none' }
                } 
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      color="primary" 
                      onClick={handleSend} 
                      disabled={!input.trim() || loading}
                      sx={{ 
                        bgcolor: input.trim() ? 'primary.main' : 'transparent',
                        color: input.trim() ? 'white' : 'action.disabled',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default AIChatBot;

