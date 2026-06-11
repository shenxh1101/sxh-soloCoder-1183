import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useApplicationStore } from '@/store/useApplicationStore';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

type StatusType = 'all' | 'pending' | 'viewed' | 'interview' | 'rejected' | 'hired';

const statusLabels: Record<string, string> = {
  all: '全部',
  pending: '待查看',
  viewed: '已查看',
  interview: '邀面',
  rejected: '淘汰',
  hired: '录用',
};

const statusStyles: Record<string, string> = {
  pending: 'statusPending',
  viewed: 'statusViewed',
  interview: 'statusInterview',
  rejected: 'statusRejected',
  hired: 'statusHired',
};

const ApplicationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatusType>('all');
  const { applications, updateApplicationStatus } = useApplicationStore();

  const filteredApplications = useMemo(() => {
    if (activeTab === 'all') return applications;
    return applications.filter((app) => app.status === activeTab);
  }, [activeTab, applications]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: applications.length,
      pending: 0,
      viewed: 0,
      interview: 0,
      rejected: 0,
      hired: 0,
    };
    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  const handleView = (id: string) => {
    updateApplicationStatus(id, 'viewed');
    Taro.showToast({ title: '已标记为已查看', icon: 'success' });
  };

  const handleInterview = (id: string) => {
    updateApplicationStatus(id, 'interview');
    Taro.showToast({ title: '已发送面试邀请', icon: 'success' });
  };

  const handleReject = (id: string) => {
    Taro.showModal({
      title: '确认淘汰',
      content: '确定要淘汰该候选人吗？',
      confirmColor: '#FF4D4F',
    }).then((res) => {
      if (res.confirm) {
        updateApplicationStatus(id, 'rejected');
        Taro.showToast({ title: '已淘汰', icon: 'success' });
      }
    });
  };

  const handleHire = (id: string) => {
    Taro.showModal({
      title: '确认录用',
      content: '确定要录用该候选人吗？',
      confirmColor: '#2B6BFF',
    }).then((res) => {
      if (res.confirm) {
        updateApplicationStatus(id, 'hired');
        Taro.showToast({ title: '已录用', icon: 'success' });
      }
    });
  };

  const handleCardTap = (id: string, status: string) => {
    if (status === 'pending') {
      handleView(id);
    }
  };

  useDidShow(() => {
    // 页面显示时刷新
  });

  const tabs: StatusType[] = ['all', 'pending', 'viewed', 'interview', 'rejected', 'hired'];

  return (
    <View className={styles.container}>
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab}
            className={classnames(
              styles.tabItem,
              activeTab === tab && styles.tabActive
            )}
            onClick={() => setActiveTab(tab)}
          >
            <Text className={styles.tabText}>
              {statusLabels[tab]}
              <Text className={styles.tabCount}>({statusCounts[tab] || 0})</Text>
            </Text>
          </View>
        ))}
      </View>

      {filteredApplications.length === 0 ? (
        <EmptyState title="暂无数据" description="还没有相关投递记录~" />
      ) : (
        <ScrollView className={styles.scrollView} scrollY>
          <View className={styles.applicantList}>
            {filteredApplications.map((app) => (
              <View
                key={app.id}
                className={styles.applicantCard}
                onClick={() => handleCardTap(app.id, app.status)}
              >
                <View className={styles.cardHeader}>
                  <Image
                    className={styles.applicantAvatar}
                    src={app.applicantAvatar}
                    mode="aspectFill"
                  />
                  <View className={styles.applicantInfo}>
                    <Text className={styles.applicantName}>{app.applicantName}</Text>
                    <Text className={styles.appliedJob}>应聘：{app.jobTitle}</Text>
                  </View>
                  <View
                    className={classnames(
                      styles.statusBadge,
                      styles[statusStyles[app.status] || 'statusPending']
                    )}
                  >
                    <Text className={styles.statusText}>
                      {statusLabels[app.status]}
                    </Text>
                  </View>
                </View>

                <View className={styles.cardFooter}>
                  <Text className={styles.appliedTime}>投递时间：{app.appliedAt}</Text>
                  <View className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                    {app.status === 'pending' && (
                      <>
                        <View
                          className={classnames(styles.actionBtn, styles.actionBtnDanger)}
                          onClick={() => handleReject(app.id)}
                        >
                          <Text className={styles.actionBtnText}>淘汰</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.actionBtnSuccess)}
                          onClick={() => handleInterview(app.id)}
                        >
                          <Text className={styles.actionBtnText}>邀面</Text>
                        </View>
                      </>
                    )}
                    {app.status === 'viewed' && (
                      <>
                        <View
                          className={classnames(styles.actionBtn, styles.actionBtnDanger)}
                          onClick={() => handleReject(app.id)}
                        >
                          <Text className={styles.actionBtnText}>淘汰</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.actionBtnSuccess)}
                          onClick={() => handleInterview(app.id)}
                        >
                          <Text className={styles.actionBtnText}>邀面</Text>
                        </View>
                      </>
                    )}
                    {app.status === 'interview' && (
                      <>
                        <View
                          className={classnames(styles.actionBtn, styles.actionBtnDanger)}
                          onClick={() => handleReject(app.id)}
                        >
                          <Text className={styles.actionBtnText}>淘汰</Text>
                        </View>
                        <View
                          className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                          onClick={() => handleHire(app.id)}
                        >
                          <Text className={styles.actionBtnText}>录用</Text>
                        </View>
                      </>
                    )}
                    {app.status === 'rejected' && (
                      <View
                        className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                        onClick={() => handleInterview(app.id)}
                      >
                        <Text className={styles.actionBtnText}>重新邀面</Text>
                      </View>
                    )}
                    {app.status === 'hired' && (
                      <View
                        className={classnames(styles.actionBtn, styles.actionBtnSuccess)}
                      >
                        <Text className={styles.actionBtnText}>已录用</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ApplicationsPage;
