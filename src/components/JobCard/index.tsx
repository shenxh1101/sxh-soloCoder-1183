import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import type { Job } from '@/types';
import styles from './index.module.scss';

interface JobCardProps {
  job: Job;
  onBookmark?: (id: string) => void;
  onTap?: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onBookmark, onTap }) => {
  return (
    <View className={styles.card} onClick={() => onTap?.(job.id)}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>{job.title}</Text>
          <View
            className={classnames(styles.bookmarkBtn, job.isBookmarked && styles.bookmarked)}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(job.id);
            }}
          >
            <Text className={styles.bookmarkIcon}>{job.isBookmarked ? '★' : '☆'}</Text>
          </View>
        </View>
        <Text className={styles.salary}>
          {job.salaryMin}-{job.salaryMax}K
        </Text>
      </View>
      <View className={styles.companyRow}>
        <Image className={styles.companyLogo} src={job.companyLogo} mode="aspectFill" />
        <Text className={styles.companyName}>{job.company}</Text>
      </View>
      <View className={styles.infoRow}>
        <Text className={styles.infoTag}>{job.location}</Text>
        <Text className={styles.infoDot}>·</Text>
        <Text className={styles.infoTag}>{job.experience}</Text>
        <Text className={styles.infoDot}>·</Text>
        <Text className={styles.infoTag}>{job.education}</Text>
        <Text className={styles.infoDot}>·</Text>
        <Text className={styles.infoTag}>{job.type}</Text>
      </View>
      <View className={styles.tagsRow}>
        {job.tags.map((tag) => (
          <View key={tag} className={styles.tag}>
            <Text className={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      {job.isApplied && (
        <View className={styles.appliedBadge}>
          <Text className={styles.appliedText}>已投递</Text>
        </View>
      )}
    </View>
  );
};

export default JobCard;
