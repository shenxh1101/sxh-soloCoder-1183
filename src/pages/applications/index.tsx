import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useJobStore } from '@/store/useJobStore';
import { mockUserProfile } from '@/data/profile';
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
  const router = useRouter();
  const jobTitleFromUrl = router.params.jobTitle ? decodeURIComponent(router.params.jobTitle) : '';
  const [activeTab, setActiveTab] = useState<StatusType>('all');
  const [selectedJob, setSelectedJob] = useState<string>(jobTitleFromUrl || 'all');
  const { getApplicationsByJob, updateApplicationStatus } = useApplicationStore();
  const { addInterview } = useInterviewStore();
  const { getCompanyJobs } = useJobStore();

  const currentCompanyName = mockUserProfile.companyName;
  const companyJobs = getCompanyJobs(currentCompanyName);
  const companyApplications = getApplicationsByJob('all', currentCompanyName);

  const filteredByJob = useMemo(() => {
    if (selectedJob === 'all') return companyApplications;
    return companyApplications.filter((app) => app.jobTitle === selectedJob);
  }, [selectedJob, companyApplications]);

  const filteredApplications = useMemo(() => {
    if (activeTab === 'all') return filteredByJob;
    return filteredByJob.filter((app) => app.status === activeTab);
  }, [activeTab, filteredByJob]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: filteredByJob.length,
      pending: 0,
      viewed: 0,
      interview: 0,
      rejected: 0,
      hired: 0,
    };
    filteredByJob.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, [filteredByJob]);

  const handleView = (id: string) => {
    updateApplicationStatus(id, 'viewed');
    Taro.showToast({ title: '已标记为已查看', icon: 'success' });
  };

  const handleInterview = (app: any) => {
    updateApplicationStatus(app.id, 'interview');

    addInterview({
      jobId: '',
      jobTitle: app.jobTitle,
      companyName: mockUserProfile.companyName,
      companyLogo: mockUserProfile.companyLogo,
      applicantName: app.applicantName,
      applicantAvatar: app.applicantAvatar,
      time: '待定，请与候选人沟通',
      location: '待确认',
      interviewer: 'HR 面试官',
      status: 'pending',
      notes: '邀请面试',
    });

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

  useDidShow(() => {
    // 页面显示时刷新
  });

  const renderActionButtons = (app: any) => {
    switch (app.status) {
      case 'pending':
        return (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnView)}
              onClick={() => handleView(app.id)}
            >
              <Text className={styles.actionBtnText}>已查看</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnInterview)}
              onClick={() => handleInterview(app)}
            >
              <Text className={styles.actionBtnText}>邀面</Text>
            </View>
          </>
        );
      case 'viewed':
        return (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnInterview)}
              onClick={() => handleInterview(app)}
            >
              <Text className={styles.actionBtnText}>邀面</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnReject)}
              onClick={() => handleReject(app.id)}
            >
              <Text className={styles.actionBtnText}>淘汰</Text>
            </View>
          </>
        );
      case 'interview':
        return (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnHire)}
              onClick={() => handleHire(app.id)}
            >
              <Text className={styles.actionBtnText}>录用</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnReject)}
              onClick={() => handleReject(app.id)}
            >
              <Text className={styles.actionBtnText}>淘汰</Text>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>投递管理</Text>
        <View className={styles.jobFilter}>
          <Text className={styles.jobFilterLabel}>职位筛选：</Text>
          <View className={styles.jobSelect} onClick={() => {
            const jobNames = ['全部职位', ...companyJobs.map(j => j.title)];
            Taro.showActionSheet({
              itemList: jobNames,
            }).then((res) => {
              if (res.tapIndex === 0) {
                setSelectedJob('all');
              } else {
                setSelectedJob(companyJobs[res.tapIndex - 1].title);
              }
            }).catch(() => {});
          }}>
            <Text className={styles.jobSelectText}>
              {selectedJob === 'all' ? '全部职位' : selectedJob}
            </Text>
            <Text className={styles.jobSelectArrow}>▼</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabBar}>
        {(Object.keys(statusLabels) as StatusType[]).map((tab) => (
          <View
            key={tab}
            className={classnames(styles.tabItem, activeTab === tab && styles.tabActive)}
            onClick={() => setActiveTab(tab)}
          >
            <Text className={styles.tabText}>
              {statusLabels[tab]} ({statusCounts[tab]})
            </Text>
          </View>
        ))}
      </View>

      {filteredApplications.length === 0 ? (
        <EmptyState text="暂无相关投递记录" />
      ) : (
        <ScrollView scrollY className={styles.listArea}>
          {filteredApplications.map((app) => (
            <View key={app.id} className={styles.card}>
              <View className={styles.cardHeader}>
                <Image
                  className={styles.avatar}
                  src={app.applicantAvatar}
                  mode="aspectFill"
                />
                <View className={styles.applicantInfo}>
                  <Text className={styles.applicantName}>{app.applicantName}</Text>
                  <Text className={styles.jobTitle}>{app.jobTitle}</Text>
                </View>
                <View
                  className={classnames(
                    styles.statusBadge,
                    styles[statusStyles[app.status]]
                  )}
                >
                  <Text className={styles.statusText}>{statusLabels[app.status]}</Text>
                </View>
              </View>
              <View className={styles.cardFooter}>
                <Text className={styles.applyTime}>投递时间：{app.appliedAt}</Text>
                <View className={styles.actionRow}>
                  {renderActionButtons(app)}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ApplicationsPage;
