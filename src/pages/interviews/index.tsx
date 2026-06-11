import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import InterviewCard from '@/components/InterviewCard';
import EmptyState from '@/components/EmptyState';
import { useInterviewStore } from '@/store/useInterviewStore';
import styles from './index.module.scss';

type TabType = 'upcoming' | 'completed' | 'all';

const InterviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { interviews, confirmInterview, rescheduleInterview, recordResult, getUpcomingInterviews, getCompletedInterviews } = useInterviewStore();

  const filteredInterviews = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        return getUpcomingInterviews();
      case 'completed':
        return getCompletedInterviews();
      default:
        return interviews;
    }
  }, [activeTab, interviews, getUpcomingInterviews, getCompletedInterviews]);

  const upcomingCount = getUpcomingInterviews().length;
  const completedCount = getCompletedInterviews().length;

  const handleAction = (id: string, action: string) => {
    switch (action) {
      case 'remind':
        Taro.showModal({
          title: '发送面试提醒',
          content: '确认向候选人发送面试提醒通知？',
          success: (r) => {
            if (r.confirm) {
              const { updateInterview } = useInterviewStore.getState();
              updateInterview(id, { reminded: true });
              Taro.showToast({ title: '提醒已发送', icon: 'success' });
            }
          }
        });
        break;
      case 'confirm':
        confirmInterview(id);
        Taro.showToast({ title: '已确认面试', icon: 'success' });
        break;
      case 'reschedule':
        Taro.showActionSheet({
          itemList: ['明天上午 10:00', '明天下午 14:00', '后天上午 10:00', '后天下午 14:00'],
        }).then((res) => {
          const times = ['明天上午 10:00', '明天下午 14:00', '后天上午 10:00', '后天下午 14:00'];
          rescheduleInterview(id, times[res.tapIndex], '候选人申请改期');
          Taro.showToast({ title: '改期申请已提交', icon: 'success' });
        }).catch(() => {});
        break;
      case 'record':
        Taro.showActionSheet({
          itemList: ['面试通过', '面试未通过', '待定'],
        }).then((res) => {
          const results = ['passed', 'failed', 'pending'];
          const resultTexts = ['通过', '未通过', '待定'];
          recordResult(id, results[res.tapIndex] as any);
          Taro.showToast({ title: `已记录：${resultTexts[res.tapIndex]}`, icon: 'success' });
        }).catch(() => {});
        break;
      default:
        break;
    }
  };

  useDidShow(() => {
    // 页面显示时自动刷新
  });

  return (
    <View className={styles.container}>
      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'upcoming' && styles.tabActive)}
          onClick={() => setActiveTab('upcoming')}
        >
          <Text className={styles.tabText}>待面试 ({upcomingCount})</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'completed' && styles.tabActive)}
          onClick={() => setActiveTab('completed')}
        >
          <Text className={styles.tabText}>已完成 ({completedCount})</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'all' && styles.tabActive)}
          onClick={() => setActiveTab('all')}
        >
          <Text className={styles.tabText}>全部</Text>
        </View>
      </View>

      {filteredInterviews.length === 0 ? (
        <EmptyState title="暂无面试" description="还没有面试安排哦~" />
      ) : (
        <ScrollView className={styles.scrollView} scrollY>
          <View className={styles.interviewList}>
            {filteredInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onAction={handleAction}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default InterviewsPage;
