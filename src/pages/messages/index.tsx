import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import EmptyState from '@/components/EmptyState';
import { useMessageStore } from '@/store/useMessageStore';
import styles from './index.module.scss';

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { chats, getTotalUnread } = useMessageStore();

  const filteredChats = useMemo(() => {
    if (activeTab === 'unread') {
      return chats.filter((chat) => chat.unreadCount > 0);
    }
    return chats;
  }, [activeTab, chats]);

  const totalUnread = getTotalUnread();

  useDidShow(() => {
    // 页面显示时自动刷新
  });

  const handleChatTap = (chatId: string) => {
    Taro.navigateTo({ url: `/pages/chat-detail/index?id=${chatId}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'all' && styles.tabActive)}
          onClick={() => setActiveTab('all')}
        >
          <Text className={styles.tabText}>全部</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'unread' && styles.tabActive)}
          onClick={() => setActiveTab('unread')}
        >
          <Text className={styles.tabText}>未读</Text>
          {totalUnread > 0 && (
            <View className={styles.unreadBadge}>
              <Text className={styles.unreadCount}>
                {totalUnread > 99 ? '99+' : totalUnread}
              </Text>
            </View>
          )}
        </View>
      </View>

      {filteredChats.length === 0 ? (
        <EmptyState title="暂无消息" description="还没有人给您发消息哦~" />
      ) : (
        <ScrollView className={styles.scrollView} scrollY>
          <View className={styles.chatList}>
            {filteredChats.map((chat) => (
              <View
                key={chat.id}
                className={styles.chatItem}
                onClick={() => handleChatTap(chat.id)}
              >
                <Image className={styles.chatAvatar} src={chat.avatar} mode="aspectFill" />
                <View className={styles.chatInfo}>
                  <View className={styles.chatHeader}>
                    <Text className={styles.chatName}>{chat.name}</Text>
                    <Text className={styles.chatTime}>{chat.lastTime}</Text>
                  </View>
                  <Text className={styles.chatLastMsg}>{chat.lastMessage}</Text>
                </View>
                {chat.unreadCount > 0 && (
                  <View className={styles.chatUnread}>
                    <Text className={styles.chatUnreadText}>
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MessagesPage;
