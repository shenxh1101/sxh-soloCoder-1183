import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useJobStore } from '@/store/useJobStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './index.module.scss';

const JobDetailPage: React.FC = () => {
  const router = useRouter();
  const jobId = router.params.id || '';
  const { getJobById, toggleBookmark, applyJob } = useJobStore();
  const { addApplication } = useApplicationStore();
  const { resume } = useResumeStore();

  const job = getJobById(jobId);
  const [localJob, setLocalJob] = useState(job);

  useEffect(() => {
    const currentJob = getJobById(jobId);
    setLocalJob(currentJob);
  }, [jobId, getJobById]);

  if (!localJob) {
    return (
      <View className={styles.container}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>职位不存在</Text>
        </View>
      </View>
    );
  }

  const handleBookmark = () => {
    toggleBookmark(jobId);
    setLocalJob(getJobById(jobId));
    Taro.showToast({
      title: localJob.isBookmarked ? '已取消收藏' : '已收藏',
      icon: 'none',
    });
  };

  const handleApply = () => {
    if (localJob.isApplied) {
      Taro.showToast({ title: '您已投递过该职位', icon: 'none' });
      return;
    }

    applyJob(jobId);
    addApplication({
      jobTitle: localJob.title,
      companyName: localJob.company,
      applicantName: resume.name,
      applicantAvatar: resume.avatar,
      jobId: localJob.id,
    });
    setLocalJob(getJobById(jobId));
    Taro.showToast({ title: '投递成功！', icon: 'success' });
  };

  const handleChat = () => {
    Taro.showToast({ title: '消息功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.headerSection}>
          <View className={styles.titleRow}>
            <Text className={styles.title}>{localJob.title}</Text>
            <View
              className={classnames(styles.bookmarkBtn, localJob.isBookmarked && styles.bookmarked)}
              onClick={handleBookmark}
            >
              <Text className={styles.bookmarkIcon}>
                {localJob.isBookmarked ? '★' : '☆'}
              </Text>
            </View>
          </View>
          <Text className={styles.salary}>
            {localJob.salaryMin}-{localJob.salaryMax}K·14薪
          </Text>
          <View className={styles.companyInfo}>
            <Image
              className={styles.companyLogo}
              src={localJob.companyLogo}
              mode="aspectFill"
            />
            <Text className={styles.companyName}>{localJob.company}</Text>
          </View>
          <View className={styles.infoTags}>
            <Text className={styles.infoTag}>{localJob.location}</Text>
            <Text className={styles.infoTag}>·</Text>
            <Text className={styles.infoTag}>{localJob.experience}</Text>
            <Text className={styles.infoTag}>·</Text>
            <Text className={styles.infoTag}>{localJob.education}</Text>
            <Text className={styles.infoTag}>·</Text>
            <Text className={styles.infoTag}>{localJob.type}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🏷</Text>
            职位标签
          </View>
          <View className={styles.tagsList}>
            {localJob.tags.map((tag) => (
              <View key={tag} className={styles.tag}>
                <Text className={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>
            职位描述
          </View>
          <Text className={styles.description}>{localJob.description}</Text>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>✅</Text>
            任职要求
          </View>
          <View className={styles.requirements}>
            {localJob.requirements.map((req, index) => (
              <Text key={index} className={styles.requirementItem}>
                {req}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎁</Text>
            福利待遇
          </View>
          <View className={styles.benefits}>
            {localJob.benefits.map((benefit, index) => (
              <Text key={index} className={styles.benefitItem}>
                {benefit}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📅</Text>
            发布信息
          </View>
          <Text className={styles.description}>
            发布时间：{localJob.publishedAt}
          </Text>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.iconBtn} onClick={handleChat}>
          <Text className={styles.iconBtnIcon}>💬</Text>
          <Text className={styles.iconBtnText}>沟通</Text>
        </View>
        <View
          className={classnames(
            styles.applyBtn,
            localJob.isApplied && styles.applyBtnApplied
          )}
          onClick={handleApply}
        >
          <Text
            className={classnames(
              styles.applyBtnText,
              localJob.isApplied && styles.applyBtnTextApplied
            )}
          >
            {localJob.isApplied ? '已投递' : '立即投递'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default JobDetailPage;
