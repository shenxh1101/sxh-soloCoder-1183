import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useMessageStore } from '@/store/useMessageStore';
import { useJobStore } from '@/store/useJobStore';
import { useUserStore } from '@/store/useUserStore';
import styles from './index.module.scss';

const ChatDetailPage: React.FC = () => {
  const router = useRouter();
  const chatId = router.params.id || '';
  const { role } = useUserStore();
  const { getChatById, getMessages, sendMessage, markAsRead } = useMessageStore();
  const { jobs } = useJobStore();

  const [messageList, setMessageList] = useState(getMessages(chatId));
  const [chatInfo, setChatInfo] = useState(getChatById(chatId));
  const [inputValue, setInputValue] = useState('');
  const [showJobPicker, setShowJobPicker] = useState(false);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const chat = getChatById(chatId);
    if (chat) {
      Taro.setNavigationBarTitle({ title: chat.name });
      setChatInfo(chat);
      setMessageList(getMessages(chatId));
      if (chat.unreadCount > 0) {
        markAsRead(chatId);
      }
    }
  }, [chatId, getChatById, getMessages, markAsRead]);

  useDidShow(() => {
    setMessageList(getMessages(chatId));
    setChatInfo(getChatById(chatId));
  });

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(chatId, inputValue.trim());
    setInputValue('');
    setTimeout(() => {
      setMessageList([...getMessages(chatId)]);
    }, 100);
    setTimeout(() => {
      setMessageList([...getMessages(chatId)]);
    }, 1600);
  };

  const handleSendJobCard = (job: any) => {
    sendMessage(chatId, job.title, 'job_card', job);
    setShowJobPicker(false);
    setTimeout(() => {
      setMessageList([...getMessages(chatId)]);
    }, 100);
    setTimeout(() => {
      setMessageList([...getMessages(chatId)]);
    }, 1600);
    Taro.showToast({ title: '职位卡片已发送', icon: 'success' });
  };

  const handleJobCardTap = (jobId: string) => {
    Taro.navigateTo({ url: `/pages/job-detail/index?id=${jobId}` });
  };

  const myJobs = jobs.filter((j) => j.company === (chatInfo?.name?.split('·')[0] || ''));

  return (
    <View className={styles.container}>
      <ScrollView className={styles.messageList} scrollY scrollIntoView="msg_bottom">
        {messageList.map((msg, index) => {
          const isSelf = msg.senderId === 'me';
          const showTime =
            index === 0 ||
            msg.timestamp !== messageList[index - 1]?.timestamp;

          return (
            <View key={msg.id}>
              {showTime && (
                <View className={styles.messageTime}>
                  <Text>{msg.timestamp}</Text>
                </View>
              )}
              <View
                className={classnames(
                  styles.messageItem,
                  isSelf && styles.messageItemSelf
                )}
              >
                {!isSelf && msg.senderAvatar && (
                  <Image
                    className={styles.messageAvatar}
                    src={msg.senderAvatar}
                    mode="aspectFill"
                  />
                )}
                <View className={styles.messageContent}>
                  {msg.type === 'job_card' && msg.jobCard ? (
                    <View
                      className={styles.jobCardMsg}
                      onClick={() => handleJobCardTap(msg.jobCard!.id)}
                    >
                      <View className={styles.jobCardMsgHeader}>
                        <Image
                          className={styles.jobCardMsgLogo}
                          src={msg.jobCard.companyLogo}
                          mode="aspectFill"
                        />
                        <View className={styles.jobCardMsgInfo}>
                          <Text className={styles.jobCardMsgTitle}>
                            {msg.jobCard.title}
                          </Text>
                          <Text className={styles.jobCardMsgCompany}>
                            {msg.jobCard.company}
                          </Text>
                        </View>
                        <Text className={styles.jobCardMsgSalary}>
                          {msg.jobCard.salaryMin}-{msg.jobCard.salaryMax}K
                        </Text>
                      </View>
                      <View className={styles.jobCardMsgMeta}>
                        <Text className={styles.jobCardMsgTag}>
                          {msg.jobCard.location}
                        </Text>
                        <Text className={styles.jobCardMsgDot}>·</Text>
                        <Text className={styles.jobCardMsgTag}>
                          {msg.jobCard.experience}
                        </Text>
                        <Text className={styles.jobCardMsgDot}>·</Text>
                        <Text className={styles.jobCardMsgTag}>
                          {msg.jobCard.type}
                        </Text>
                      </View>
                      <View className={styles.jobCardMsgFooter}>
                        <Text className={styles.jobCardMsgLabel}>职位卡片</Text>
                        <Text className={styles.jobCardMsgAction}>点击查看详情 ›</Text>
                      </View>
                    </View>
                  ) : (
                    <View className={styles.messageBubble}>
                      <Text className={styles.messageText}>{msg.content}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
        <View id="msg_bottom" />
      </ScrollView>

      <View className={styles.inputBar}>
        <View className={styles.inputActions}>
          {role === 'company' && (
            <View
              className={styles.inputActionBtn}
              onClick={() => setShowJobPicker(true)}
            >
              <Text className={styles.inputActionIcon}>💼</Text>
            </View>
          )}
        </View>
        <View className={styles.inputWrapper}>
          <Input
            className={styles.textInput}
            value={inputValue}
            onInput={(e) => setInputValue(e.detail.value)}
            placeholder="输入消息..."
            confirmType="send"
            onConfirm={handleSend}
            adjustPosition
          />
        </View>
        <View
          className={classnames(
            styles.sendBtn,
            !inputValue.trim() && styles.sendBtnDisabled
          )}
          onClick={handleSend}
        >
          <Text className={styles.sendBtnText}>发送</Text>
        </View>
      </View>

      {showJobPicker && (
        <View
          className={styles.jobPickerModal}
          onClick={() => setShowJobPicker(false)}
        >
          <View
            className={styles.jobPickerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <View className={styles.jobPickerHeader}>
              <Text className={styles.jobPickerTitle}>选择职位</Text>
              <Text
                className={styles.jobPickerClose}
                onClick={() => setShowJobPicker(false)}
              >
                ×
              </Text>
            </View>
            <ScrollView className={styles.jobPickerList} scrollY>
              {myJobs.length === 0 ? (
                <Text className={styles.jobPickerEmpty}>暂无职位</Text>
              ) : (
                myJobs.map((job) => (
                  <View
                    key={job.id}
                    className={styles.jobPickerItem}
                    onClick={() => handleSendJobCard(job)}
                  >
                    <Text className={styles.jobPickerItemTitle}>{job.title}</Text>
                    <View className={styles.jobPickerItemMeta}>
                      <Text className={styles.jobPickerItemSalary}>
                        {job.salaryMin}-{job.salaryMax}K
                      </Text>
                      <Text className={styles.jobPickerItemLocation}>
                        · {job.location}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatDetailPage;
