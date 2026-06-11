import { create } from 'zustand';
import type { Chat, ChatMessage } from '@/types';
import { mockChats, mockChatMessages } from '@/data/messages';

interface MessageState {
  chats: Chat[];
  messages: Record<string, ChatMessage[]>;
  getChatById: (id: string) => Chat | undefined;
  getMessages: (chatId: string) => ChatMessage[];
  sendMessage: (chatId: string, content: string, type?: 'text' | 'job_card', jobCard?: any) => void;
  markAsRead: (chatId: string) => void;
  getTotalUnread: () => number;
  markJobCardApplied: (chatId: string, jobId: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  chats: mockChats,
  messages: mockChatMessages,

  getChatById: (id: string) => {
    return get().chats.find((chat) => chat.id === id);
  },

  getMessages: (chatId: string) => {
    return get().messages[chatId] || [];
  },

  sendMessage: (chatId: string, content: string, type = 'text', jobCard?) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      senderId: 'me',
      senderName: '我',
      senderAvatar: '',
      content,
      type: type as any,
      jobCard,
      timestamp: timeStr,
      isRead: true,
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMessage],
      },
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: type === 'job_card' ? '[职位卡片] ' + content : content, lastTime: timeStr }
          : chat
      ),
    }));

    setTimeout(() => {
      const replyTime = new Date();
      const replyTimeStr = `${replyTime.getHours().toString().padStart(2, '0')}:${replyTime.getMinutes().toString().padStart(2, '0')}`;
      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        chatId,
        senderId: `company-${chatId}`,
        senderName: get().chats.find((c) => c.id === chatId)?.name || '对方',
        senderAvatar: get().chats.find((c) => c.id === chatId)?.avatar || '',
        content: '好的，收到您的消息~',
        type: 'text',
        timestamp: replyTimeStr,
        isRead: false,
      };

      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), replyMessage],
        },
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: replyMessage.content,
                lastTime: replyTimeStr,
                unreadCount: chat.unreadCount + 1,
              }
            : chat
        ),
      }));
    }, 1500);
  },

  markAsRead: (chatId: string) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((m) => ({ ...m, isRead: true })),
      },
    }));
  },

  getTotalUnread: () => {
    return get().chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  },

  markJobCardApplied: (chatId: string, jobId: string) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((m) =>
          m.type === 'job_card' && m.jobCard?.id === jobId
            ? { ...m, jobApplied: true }
            : m
        ),
      },
    }));
  },
}));
