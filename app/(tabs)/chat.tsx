import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { sendMessage, generateChatTitle, Message } from '../../services/aiService';
import { useChat } from '../../context/ChatContext';

const { width } = Dimensions.get('window');
const PANEL_WIDTH = width * 0.85;

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  
  const {
    sessions,
    currentSession,
    createNewChat,
    selectChat,
    addMessage,
    setSessionTitle,
    deleteChat,
  } = useChat();

  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Create a new chat if none exists
  useEffect(() => {
    if (!currentSession && sessions.length === 0) {
      createNewChat();
    }
  }, [currentSession, sessions.length, createNewChat]);

  const openPanel = useCallback(() => {
    setIsPanelVisible(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }),
      Animated.spring(overlayAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }),
    ]).start();
  }, [slideAnim, overlayAnim]);

  const closePanel = useCallback(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -PANEL_WIDTH,
        useNativeDriver: true,
        damping: 22,
        stiffness: 280,
        mass: 0.7,
      }),
      Animated.spring(overlayAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        stiffness: 280,
        mass: 0.7,
      }),
    ]).start(() => {
      setIsPanelVisible(false);
    });
  }, [slideAnim, overlayAnim]);

  const handleNewChat = useCallback(() => {
    createNewChat();
    closePanel();
  }, [createNewChat, closePanel]);

  const handleSelectChat = useCallback((id: string) => {
    selectChat(id);
    closePanel();
  }, [selectChat, closePanel]);

  const handleDeletePress = useCallback((id: string) => {
    setChatToDelete(id);
    setDeleteModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      setChatToDelete(null);
      setDeleteModalVisible(false);
    }
  }, [chatToDelete, deleteChat]);

  const handleCancelDelete = useCallback(() => {
    setChatToDelete(null);
    setDeleteModalVisible(false);
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading || !currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    const isFirstMessage = currentSession.messages.length === 0;
    const userMessageContent = inputText.trim();

    addMessage(userMessage);
    setInputText('');
    setIsLoading(true);

    try {
      // Generate title after first user message (in parallel with AI response)
      const [response, title] = await Promise.all([
        sendMessage([...currentSession.messages, userMessage]),
        isFirstMessage && !currentSession.title
          ? generateChatTitle(userMessageContent)
          : Promise.resolve(null),
      ]);

      // Set title if generated
      if (title) {
        setSessionTitle(title);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      addMessage(assistantMessage);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorText,
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, currentSession, isLoading, addMessage, setSessionTitle]);

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.assistantText,
        ]}
      >
        {item.content}
      </Text>
    </View>
  ), []);

  const renderChatItem = useCallback(({ item }: { item: typeof sessions[0] }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        item.id === currentSession?.id && styles.chatItemActive,
      ]}
      onPress={() => handleSelectChat(item.id)}
    >
      <Text
        style={[
          styles.chatItemTitle,
          item.id === currentSession?.id && styles.chatItemTitleActive,
        ]}
        numberOfLines={1}
      >
        {item.title || 'New Chat'}
      </Text>
      <TouchableOpacity
        onPress={() => handleDeletePress(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [currentSession?.id, handleSelectChat, handleDeletePress]);

  const messages = currentSession?.messages || [];
  const hasMessages = messages.length > 0;
  const displayTitle = currentSession?.title || 'Bible AI';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openPanel} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {displayTitle}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      {!hasMessages ? (
        <View style={styles.mainContent}>
          <View style={styles.topSection}>
            <Text style={styles.mainTitle}>Ask Bible AI anything</Text>
            <Text style={styles.mainDescription}>
              Ask about love, purpose, faith, fear,{'\n'}
              temptation, doubt, and the meaning of life.{'\n'}
              Guided by Scripture. Rooted in truth.
            </Text>
          </View>

          {/* Cross Icon */}
          <View style={styles.crossSection}>
            <View style={styles.cross}>
              <View style={styles.crossVertical} />
              <View style={styles.crossHorizontal} />
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Message Bible AI"
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="arrow-up"
              size={22}
              color={inputText.trim() ? Colors.white : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Side Panel */}
      {isPanelVisible && (
        <>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4],
                }),
              },
            ]}
            pointerEvents="auto"
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closePanel}
            />
          </Animated.View>
          
          <Animated.View
            style={[
              styles.sidePanel,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.panelContent}>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Bible AI</Text>
                <TouchableOpacity
                  onPress={closePanel}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="close" size={28} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
                <Ionicons name="add" size={22} color={Colors.white} />
                <Text style={styles.newChatText}>New Chat</Text>
              </TouchableOpacity>

              {sessions.length > 0 ? (
                <FlatList
                  data={sessions}
                  renderItem={renderChatItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  style={styles.chatList}
                />
              ) : (
                <Text style={styles.emptyStateText}>No conversations yet</Text>
              )}
            </View>
          </Animated.View>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete chat?</Text>
            <Text style={styles.modalBody}>
              This will permanently delete this chat and all its messages. This action cannot be undone.
            </Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleConfirmDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelDelete}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 44,
  },
  mainContent: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  mainDescription: {
    fontSize: 17,
    color: '#5A5A5A',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  crossSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  cross: {
    width: 90,
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossVertical: {
    position: 'absolute',
    width: 14,
    height: 135,
    backgroundColor: '#000000',
    borderRadius: 7,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 74,
    height: 14,
    backgroundColor: '#000000',
    borderRadius: 7,
    top: 26,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: Colors.white,
  },
  assistantText: {
    color: Colors.text,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 12,
    gap: 10,
  },
  micButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  input: {
    fontSize: 16,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sidePanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  panelContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  newChatText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  chatItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  chatItemTitle: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  chatItemTitleActive: {
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
});
