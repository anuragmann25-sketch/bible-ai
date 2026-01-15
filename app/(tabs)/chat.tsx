import React, { useState, useRef, useCallback } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');
const PANEL_WIDTH = width * 0.85;

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

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
    closePanel();
  }, [closePanel]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openPanel} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bible AI</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
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
            />
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="navigate" size={22} color={Colors.textMuted} />
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

              <Text style={styles.emptyStateText}>No previous conversations</Text>
            </View>
          </Animated.View>
        </>
      )}
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
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
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
  emptyStateText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});
