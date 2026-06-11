import React, { useState } from 'react';
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useJobStore } from '@/store/useJobStore';
import { mockUserProfile } from '@/data/profile';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

const MyJobsPage: React.FC = () => {
  const { getCompanyJobs, toggleJobStatus, updateJob } = useJobStore();
  const [jobs, setJobs] = useState(getCompanyJobs(mockUserProfile.companyName));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    salaryMin: number;
    salaryMax: number;
    location: string;
    description: string;
  }>({
    salaryMin: 0,
    salaryMax: 0,
    location: '',
    description: '',
  });

  useDidShow(() => {
    setJobs(getCompanyJobs(mockUserProfile.companyName));
  });

  const handleToggleStatus = (id: string, currentStatus?: string) => {
    const isOffline = currentStatus === 'offline';
    const actionText = isOffline ? '上架' : '下架';
    Taro.showModal({
      title: `${actionText}职位`,
      content: `确定要${actionText}这个职位吗？`,
      success: (res) => {
        if (res.confirm) {
          toggleJobStatus(id);
          setJobs(getCompanyJobs(mockUserProfile.companyName));
          Taro.showToast({ title: `${actionText}成功`, icon: 'success' });
        }
      },
    });
  };

  const handleEdit = (job: any) => {
    setEditingId(job.id);
    setEditForm({
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      location: job.location,
      description: job.description || '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    if (!editForm.location) {
      Taro.showToast({ title: '请填写工作地点', icon: 'none' });
      return;
    }
    if (editForm.salaryMin <= 0 || editForm.salaryMax <= 0 || editForm.salaryMin >= editForm.salaryMax) {
      Taro.showToast({ title: '请填写合理薪资', icon: 'none' });
      return;
    }
    updateJob(editingId, {
      salaryMin: Number(editForm.salaryMin),
      salaryMax: Number(editForm.salaryMax),
      location: editForm.location,
      description: editForm.description,
    });
    setEditingId(null);
    setJobs(getCompanyJobs(mockUserProfile.companyName));
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  const handleJobDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/job-detail/index?id=${id}` });
  };

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/publish-job/index' });
  };

  const handleViewApplications = (jobTitle: string) => {
    Taro.navigateTo({ url: `/pages/applications/index?jobTitle=${encodeURIComponent(jobTitle)}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>已发布职位</Text>
        <View className={styles.publishBtn} onClick={handlePublish}>
          <Text className={styles.publishBtnText}>+ 发布新职位</Text>
        </View>
      </View>

      {jobs.length === 0 ? (
        <EmptyState text="还没有发布过职位" />
      ) : (
        <ScrollView scrollY className={styles.scrollArea}>
          {jobs.map((job) => (
            <View key={job.id} className={styles.jobCard}>
              <View className={styles.jobHeader} onClick={() => handleJobDetail(job.id)}>
                <View className={styles.jobInfo}>
                  <Text className={styles.jobTitle}>{job.title}</Text>
                  <Text className={styles.jobSalary}>
                    {job.salaryMin}-{job.salaryMax}K
                  </Text>
                </View>
                <View
                  className={`${styles.statusBadge} ${
                    job.status === 'offline' ? styles.statusOffline : styles.statusOnline
                  }`}
                >
                  <Text className={styles.statusText}>
                    {job.status === 'offline' ? '已下架' : '招聘中'}
                  </Text>
                </View>
              </View>

              <View className={styles.jobMeta}>
                <Text className={styles.metaTag}>{job.location}</Text>
                <Text className={styles.metaTag}>·</Text>
                <Text className={styles.metaTag}>{job.experience}</Text>
                <Text className={styles.metaTag}>·</Text>
                <Text className={styles.metaTag}>{job.type}</Text>
              </View>

              <View className={styles.jobTags}>
                {(job.tags || []).slice(0, 3).map((tag, idx) => (
                  <Text key={`${tag}-${idx}`} className={styles.jobTag}>
                    {tag}
                  </Text>
                ))}
              </View>

              <View className={styles.jobFooter}>
                <Text className={styles.publishTime}>发布于 {job.publishedAt}</Text>
                <Text
                  className={styles.viewApplications}
                  onClick={() => handleViewApplications(job.title)}
                >
                  查看投递
                </Text>
              </View>

              <View className={styles.actionRow}>
                <View className={styles.actionBtn} onClick={() => handleEdit(job)}>
                  <Text className={styles.actionBtnText}>编辑</Text>
                </View>
                <View
                  className={`${styles.actionBtn} ${
                    job.status === 'offline' ? styles.btnOnline : styles.btnOffline
                  }`}
                  onClick={() => handleToggleStatus(job.id, job.status)}
                >
                  <Text className={styles.actionBtnText}>
                    {job.status === 'offline' ? '上架' : '下架'}
                  </Text>
                </View>
              </View>

              {editingId === job.id && (
                <View className={styles.editPanel}>
                  <View className={styles.editItem}>
                    <Text className={styles.editLabel}>工作地点</Text>
                    <Input
                      className={styles.editInput}
                      value={editForm.location}
                      onInput={(e) =>
                        setEditForm({ ...editForm, location: e.detail.value })
                      }
                      placeholder="如：北京·朝阳"
                    />
                  </View>
                  <View className={styles.editRow}>
                    <View className={styles.editItem} style={{ flex: 1 }}>
                      <Text className={styles.editLabel}>最低薪资(K)</Text>
                      <Input
                        className={styles.editInput}
                        type="number"
                        value={String(editForm.salaryMin)}
                        onInput={(e) =>
                          setEditForm({
                            ...editForm,
                            salaryMin: Number(e.detail.value) || 0,
                          })
                        }
                      />
                    </View>
                    <View style={{ width: 20 }} />
                    <View className={styles.editItem} style={{ flex: 1 }}>
                      <Text className={styles.editLabel}>最高薪资(K)</Text>
                      <Input
                        className={styles.editInput}
                        type="number"
                        value={String(editForm.salaryMax)}
                        onInput={(e) =>
                          setEditForm({
                            ...editForm,
                            salaryMax: Number(e.detail.value) || 0,
                          })
                        }
                      />
                    </View>
                  </View>
                  <View className={styles.editItem}>
                    <Text className={styles.editLabel}>职位描述</Text>
                    <Textarea
                      className={styles.editTextarea}
                      value={editForm.description}
                      onInput={(e) =>
                        setEditForm({ ...editForm, description: e.detail.value })
                      }
                      placeholder="请输入职位描述"
                    />
                  </View>
                  <View className={styles.editActions}>
                    <View
                      className={`${styles.editActionBtn} ${styles.btnCancel}`}
                      onClick={() => setEditingId(null)}
                    >
                      <Text className={styles.editActionBtnText}>取消</Text>
                    </View>
                    <View
                      className={`${styles.editActionBtn} ${styles.btnSave}`}
                      onClick={handleSaveEdit}
                    >
                      <Text className={styles.editActionBtnText}>保存</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default MyJobsPage;
