import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import JobCard from '@/components/JobCard';
import EmptyState from '@/components/EmptyState';
import { useJobStore } from '@/store/useJobStore';
import { salaryRanges, locationOptions, typeOptions } from '@/data/jobs';
import type { Job } from '@/types';
import styles from './index.module.scss';

type FilterKey = 'salary' | 'location' | 'type';

const JobsPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);
  const [filterValues, setFilterValues] = useState({
    salary: '',
    location: '',
    type: '',
  });

  const { jobs, getOnlineJobs, toggleBookmark } = useJobStore();
  const visibleJobs = getOnlineJobs();

  const filterConfigs: { key: FilterKey; label: string; options: typeof salaryRanges }[] = [
    { key: 'salary', label: '薪资', options: salaryRanges },
    { key: 'location', label: '地点', options: locationOptions },
    { key: 'type', label: '类型', options: typeOptions },
  ];

  const filteredJobs = useMemo(() => {
    return visibleJobs.filter((job) => {
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        if (
          !job.title.toLowerCase().includes(kw) &&
          !job.company.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }
      if (filterValues.salary) {
        const [min, max] = filterValues.salary.split('-').map(Number);
        if (job.salaryMin < min || job.salaryMin > max) return false;
      }
      if (filterValues.location) {
        if (!job.location.includes(filterValues.location)) return false;
      }
      if (filterValues.type) {
        if (job.type !== filterValues.type) return false;
      }
      return true;
    });
  }, [visibleJobs, searchKeyword, filterValues]);

  const handleBookmark = useCallback(
    (id: string) => {
      const job = visibleJobs.find((j) => j.id === id);
      toggleBookmark(id);
      Taro.showToast({
        title: job?.isBookmarked ? '已取消收藏' : '已收藏',
        icon: 'none',
      });
    },
    [visibleJobs, toggleBookmark]
  );

  const handleTapJob = useCallback((id: string) => {
    Taro.navigateTo({ url: `/pages/job-detail/index?id=${id}` });
  }, []);

  const handleFilterToggle = useCallback((key: FilterKey) => {
    setActiveFilter((prev) => (prev === key ? null : key));
  }, []);

  const handleFilterSelect = useCallback(
    (key: FilterKey, value: string) => {
      setFilterValues((prev) => ({ ...prev, [key]: value }));
      setActiveFilter(null);
    },
    []
  );

  const getFilterLabel = useCallback(
    (key: FilterKey) => {
      const config = filterConfigs.find((c) => c.key === key);
      if (!config) return '';
      if (!filterValues[key]) return config.label;
      const option = config.options.find((o) => o.value === filterValues[key]);
      return option ? option.label : config.label;
    },
    [filterValues]
  );

  useDidShow(() => {
    // 页面显示时自动刷新数据
  });

  return (
    <View className={styles.container}>
      <View className={styles.searchSection}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索职位、公司"
            placeholderClass={styles.searchPlaceholder}
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          {filterConfigs.map((config) => (
            <View
              key={config.key}
              className={classnames(
                styles.filterItem,
                activeFilter === config.key && styles.filterItemActive,
                filterValues[config.key] && styles.filterItemActive
              )}
              onClick={() => handleFilterToggle(config.key)}
            >
              <Text
                className={classnames(
                  styles.filterLabel,
                  (activeFilter === config.key || filterValues[config.key]) &&
                    styles.filterLabelActive
                )}
              >
                {getFilterLabel(config.key)}
              </Text>
              <Text
                className={classnames(
                  styles.filterArrow,
                  (activeFilter === config.key || filterValues[config.key]) &&
                    styles.filterArrowActive
                )}
              >
                ▼
              </Text>
            </View>
          ))}
        </View>

        {activeFilter && (
          <View className={styles.filterDropdown}>
            {filterConfigs
              .find((c) => c.key === activeFilter)
              ?.options.map((option) => (
                <View
                  key={option.value}
                  className={classnames(
                    styles.filterOption,
                    filterValues[activeFilter] === option.value &&
                      styles.filterOptionActive
                  )}
                  onClick={() => handleFilterSelect(activeFilter, option.value)}
                >
                  <Text className={styles.filterOptionText}>{option.label}</Text>
                </View>
              ))}
          </View>
        )}
      </View>

      <View className={styles.jobList}>
        <View className={styles.statsBar}>
          <Text className={styles.statsText}>
            共 <Text className={styles.statsCount}>{filteredJobs.length}</Text> 个职位
          </Text>
        </View>

        {filteredJobs.length === 0 ? (
          <EmptyState title="暂无匹配职位" description="试试调整筛选条件" />
        ) : (
          <ScrollView className={styles.scrollView} scrollY>
            {filteredJobs.map((job: Job) => (
              <JobCard
                key={job.id}
                job={job}
                onBookmark={handleBookmark}
                onTap={handleTapJob}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default JobsPage;
