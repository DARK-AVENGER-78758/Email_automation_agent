import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';

export default function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const WEBHOOK_URL = 'https://afc1-2401-4900-6281-1330-14eb-8131-8a1e-173e.ngrok-free.app/webhook-test/expo-n8n';

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage = { id: Date.now(), text: message, sender: 'user' };
    const updatedChat = [...chatHistory, userMessage];
    setChatHistory(updatedChat);

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: 'expo-app-user',
          timestamp: new Date().toISOString(),
          chatHistory: updatedChat, // ✅ use updated chat history here
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI response:', data);

      const aiResponse = {
        id: Date.now() + 1,
        text: data.response || data.message || data.output || 'The mail has been sent successfully.',
        sender: 'ai',
      };

      setChatHistory(prevChat => [...prevChat, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Make sure your webhook is running.`,
        sender: 'system',
      };

      setChatHistory(prevChat => [...prevChat, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>n8n Chat</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {chatHistory.length === 0 ? (
          <Text style={styles.emptyChat}>Send a message to start chatting with the AI agent.</Text>
        ) : (
          chatHistory.map(item => (
            <View 
              key={item.id} 
              style={[
                styles.messageBubble, 
                item.sender === 'user' ? styles.userBubble : 
                item.sender === 'ai' ? styles.aiBubble : styles.systemBubble
              ]}
            >
              <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userText : 
                item.sender === 'ai' ? styles.aiText : styles.systemText
              ]}>
                {item.text}
              </Text>
            </View>
          ))
        )}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0084ff" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.disabledButton]} 
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0084ff',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 10,
  },
  emptyChat: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#0084ff',
    alignSelf: 'flex-end',
    marginLeft: '20%',
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
    marginRight: '20%',
    borderBottomLeftRadius: 5,
  },
  systemBubble: {
    backgroundColor: '#ffcc00',
    alignSelf: 'flex-start',
    marginRight: '20%',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#000',
  },
  systemText: {
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0084ff',
    borderRadius: 20,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
