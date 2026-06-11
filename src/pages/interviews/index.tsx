import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import InterviewCard from '@/components/InterviewCard';
import EmptyState from '@/components/EmptyState';
import { mockInterviews } from '@/data/interviews';
import styles from './index.module.scss';

type TabType = 'upcoming' | 'completed' | 'all';

const InterviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const filteredInterviews = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        return mockInterviews.filter(
          (i) => i.status === 'pending' || i.status === 'confirmed' || i.status === 'rescheduled'
        );
      case 'completed':
        return mockInterviews.filter(
          (i) => i.status === 'completed' || i.status === 'cancelled'
        );
      default:
        return mockInterviews;
    }
  }, [activeTab]);

  const upcomingCount = mockInterviews.filter(
    (i) => i.status === 'pending' || i.status === 'confirmed' || i.status === 'rescheduled'
  ).length;
  const completedCount = mockInterviews.filter(
    (i) => i.status === 'completed' || i.status === 'cancelled'
  ).length;

  const handleAction = (id: string, action: string) => {
    console.info('[Interviews]', 'Action:', action, 'Interview ID:', id);
    switch (action) {
      case 'confirm':
        Taro.showToast({ title: '已确认面试', icon: 'success' });
        break;
      case 'reschedule':
        Taro.showToast({ title: '已申请改期', icon: 'none' });
        break;
      case 'record':
        Taro.showActionSheet({
          itemList: ['面试通过', '面试未通过'],
        }).then((res) => {
          const resultText = res.tapIndex === 0 ? '通过' : '未通过';
          Taro.showToast({ title: `已记录结果：${resultText}`, icon: 'none' });
        }).catch(() => {
          console.info('[Interviews]', 'Record action cancelled');
        });
        break;
      default:
        break;
    }
  };

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
