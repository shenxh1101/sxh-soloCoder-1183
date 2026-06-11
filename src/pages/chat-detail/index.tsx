import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useMessageStore } from '@/store/useMessageStore';
import { useJobStore } from '@/store/useJobStore';
import { useUserStore } from '@/store/useUserStore';
import { mockUserProfile } from '@/data/profile';
import styles from './index.module.scss';

const ChatDetailPage: React.FC = () => {
  const router = useRouter();
  const chatId = router.params.id || '';
  const { role } = useUserStore();
  const { getChatById, getMessages, sendMessage, markAsRead, markJobCardApplied } = useMessageStore();
  const { jobs, getJobById, getAppliedJobs } = useJobStore();

  const [messageList, setMessageList] = useState(getMessages(chatId));
  const [chatInfo, setChatInfo] = useState(getChatById(chatId));
  const [inputValue, setInputValue] = useState('');
  const [showJobPicker, setShowJobPicker] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const scrollRef = useRef<any>(null);

  const syncJobCardAppliedStatus = () => {
    const messages = getMessages(chatId);
    const appliedJobs = getAppliedJobs();
    const appliedJobIds = new Set(appliedJobs.map((j) => j.id));

    messages.forEach((msg) => {
      if (msg.type === 'job_card' && msg.jobCard && !msg.jobApplied) {
        if (appliedJobIds.has(msg.jobCard.id)) {
          markJobCardApplied(chatId, msg.jobCard.id);
        }
      }
    });
  };

  useEffect(() => {
    const chat = getChatById(chatId);
    if (chat) {
      Taro.setNavigationBarTitle({ title: chat.name });
      setChatInfo(chat);
      setMessageList(getMessages(chatId));
      if (chat.unreadCount > 0) {
        markAsRead(chatId);
      }
      if (role === 'seeker') {
        syncJobCardAppliedStatus();
      }
    }
  }, [chatId, getChatById, getMessages, markAsRead, role]);

  useDidShow(() => {
    setMessageList(getMessages(chatId));
    setChatInfo(getChatById(chatId));
    if (role === 'seeker') {
      syncJobCardAppliedStatus();
    }
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

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
  };

  const handleConfirmSendJob = () => {
    if (!selectedJob) return;
    const greetText = greeting.trim() || '您好，这是我们在招的职位，感兴趣可以投递哦~';
    sendMessage(chatId, greetText, 'job_card', selectedJob);
    setShowJobPicker(false);
    setSelectedJob(null);
    setGreeting('');
    setTimeout(() => {
      setMessageList([...getMessages(chatId)]);
    }, 100);
    setTimeout(() => {
      setMessageList([...getMessages(chatId)]);
    }, 1600);
    Taro.showToast({ title: '职位卡片已发送', icon: 'success' });
  };

  const handleJobCardTap = (jobId: string) => {
    Taro.navigateTo({ url: `/pages/job-detail/index?id=${jobId}&chatId=${chatId}` });
  };

  const currentCompanyName = mockUserProfile.companyName;
  const myJobs = role === 'company'
    ? jobs.filter((j) => j.company === currentCompanyName)
    : jobs.filter((j) => j.company === (chatInfo?.name?.split('·')[0] || chatInfo?.name || ''));

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
                    <View>
                      {msg.content && msg.content !== msg.jobCard.title && (
                        <View className={styles.messageBubble}>
                          <Text className={styles.messageText}>{msg.content}</Text>
                        </View>
                      )}
                      <View
                        className={classnames(
                          styles.jobCardMsg,
                          msg.jobApplied && styles.jobCardApplied
                        )}
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
                          <Text className={styles.jobCardMsgLabel}>
                            {msg.jobApplied ? '✅ 已投递' : '职位卡片'}
                          </Text>
                          <Text className={styles.jobCardMsgAction}>
                            {msg.jobApplied ? '查看详情 ›' : '点击查看详情 ›'}
                          </Text>
                        </View>
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
          onClick={() => {
            setShowJobPicker(false);
            setSelectedJob(null);
            setGreeting('');
          }}
        >
          <View
            className={styles.jobPickerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <View className={styles.jobPickerHeader}>
              <Text className={styles.jobPickerTitle}>
                {selectedJob ? '确认发送' : '选择职位'}
              </Text>
              <Text
                className={styles.jobPickerClose}
                onClick={() => {
                  setShowJobPicker(false);
                  setSelectedJob(null);
                  setGreeting('');
                }}
              >
                ×
              </Text>
            </View>

            {selectedJob ? (
              <View className={styles.jobConfirmArea}>
                <View className={styles.jobConfirmCard}>
                  <Text className={styles.jobConfirmTitle}>{selectedJob.title}</Text>
                  <Text className={styles.jobConfirmSalary}>
                    {selectedJob.salaryMin}-{selectedJob.salaryMax}K
                  </Text>
                  <Text className={styles.jobConfirmMeta}>
                    {selectedJob.location} · {selectedJob.experience}
                  </Text>
                </View>
                <View className={styles.greetingArea}>
                  <Text className={styles.greetingLabel}>附言（可选）</Text>
                  <View className={styles.greetingInputBox}>
                    <Input
                      className={styles.greetingInput}
                      value={greeting}
                      onInput={(e) => setGreeting(e.detail.value)}
                      placeholder="写一句话给候选人"
                      maxLength={100}
                    />
                  </View>
                  <View className={styles.greetingPreset}>
                    {['您好，这是我们在招的职位，感兴趣可以投递哦~', '这个岗位很适合您，欢迎投递！', '我们正在急招，快来看看吧~'].map((text, i) => (
                      <View
                        key={i}
                        className={styles.greetingPresetItem}
                        onClick={() => setGreeting(text)}
                      >
                        <Text className={styles.greetingPresetText}>{text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className={styles.jobConfirmActions}>
                  <View
                    className={styles.jobConfirmBack}
                    onClick={() => {
                      setSelectedJob(null);
                      setGreeting('');
                    }}
                  >
                    <Text className={styles.jobConfirmBackText}>返回选择</Text>
                  </View>
                  <View
                    className={styles.jobConfirmSend}
                    onClick={handleConfirmSendJob}
                  >
                    <Text className={styles.jobConfirmSendText}>发送卡片</Text>
                  </View>
                </View>
              </View>
            ) : (
              <ScrollView className={styles.jobPickerList} scrollY>
                {myJobs.length === 0 ? (
                  <Text className={styles.jobPickerEmpty}>暂无职位，请先发布职位</Text>
                ) : (
                  myJobs.map((job) => (
                    <View
                      key={job.id}
                      className={styles.jobPickerItem}
                      onClick={() => handleSelectJob(job)}
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
                      <Text className={styles.jobPickerItemArrow}>›</Text>
                    </View>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatDetailPage;
