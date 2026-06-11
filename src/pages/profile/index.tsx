import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useUserStore } from '@/store/useUserStore';
import { useJobStore } from '@/store/useJobStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useResumeStore } from '@/store/useResumeStore';
import { mockUserProfile } from '@/data/profile';
import styles from './index.module.scss';

const seekerMenus = [
  { icon: '📝', text: '我的投递', url: '' },
  { icon: '⭐', text: '我的收藏', url: '' },
  { icon: '🔒', text: '隐私设置', url: '/pages/privacy-settings/index' },
  { icon: '🚫', text: '黑名单管理', url: '/pages/blacklist/index' },
];

const companyMenus = [
  { icon: '📌', text: '发布职位', url: '/pages/publish-job/index' },
  { icon: '📊', text: '已发布职位', url: '/pages/my-jobs/index' },
  { icon: '📋', text: '收到的投递', url: '/pages/applications/index' },
  { icon: '🔒', text: '隐私设置', url: '/pages/privacy-settings/index' },
  { icon: '🚫', text: '黑名单管理', url: '/pages/blacklist/index' },
];

const ProfilePage: React.FC = () => {
  const { role, toggleRole } = useUserStore();
  const { jobs, getAppliedJobs, getBookmarkedJobs } = useJobStore();
  const { applications } = useApplicationStore();
  const { calculateCompletion } = useResumeStore();
  const profile = mockUserProfile;

  const menus = role === 'seeker' ? seekerMenus : companyMenus;

  const resumeCompletion = calculateCompletion();
  const appliedCount = getAppliedJobs().length;
  const bookmarkedCount = getBookmarkedJobs().length;
  const publishedJobsCount = jobs.filter((j) => j.company === profile.companyName).length;
  const receivedAppsCount = applications.length;

  useDidShow(() => {
    // 页面显示时自动刷新
  });

  const handleMenuTap = (url: string, text: string) => {
    if (url) {
      Taro.navigateTo({ url });
    } else {
      Taro.showToast({ title: `${text}功能开发中`, icon: 'none' });
    }
  };

  const handleToggleRole = () => {
    toggleRole();
    Taro.showToast({
      title: role === 'seeker' ? '已切换到企业模式' : '已切换到求职者模式',
      icon: 'none',
      duration: 1500,
    });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.profileHeader}>
          <View className={styles.profileCard}>
            <View className={styles.profileTop}>
              <Image
                className={styles.profileAvatar}
                src={role === 'seeker' ? profile.avatar : profile.companyLogo}
                mode="aspectFill"
              />
              <View className={styles.profileInfo}>
                <Text className={styles.profileName}>
                  {role === 'seeker' ? profile.name : profile.companyName}
                </Text>
                <Text className={styles.profilePhone}>{profile.phone}</Text>
              </View>
            </View>

            <View className={styles.roleSwitch}>
              <View
                className={classnames(styles.roleBtn, role === 'seeker' && styles.roleBtnActive)}
                onClick={() => role !== 'seeker' && handleToggleRole()}
              >
                <Text
                  className={classnames(
                    styles.roleBtnText,
                    role === 'seeker' && styles.roleBtnTextActive
                  )}
                >
                  求职者
                </Text>
              </View>
              <View
                className={classnames(styles.roleBtn, role === 'company' && styles.roleBtnActive)}
                onClick={() => role !== 'company' && handleToggleRole()}
              >
                <Text
                  className={classnames(
                    styles.roleBtnText,
                    role === 'company' && styles.roleBtnTextActive
                  )}
                >
                  企业
                </Text>
              </View>
            </View>

            <View className={styles.statsGrid}>
              {role === 'seeker' ? (
                <>
                  <View className={styles.statItem}>
                    <Text className={styles.statNumber}>{appliedCount}</Text>
                    <Text className={styles.statLabel}>投递数</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statNumber}>{bookmarkedCount}</Text>
                    <Text className={styles.statLabel}>收藏数</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statNumber}>{resumeCompletion}%</Text>
                    <Text className={styles.statLabel}>简历完善</Text>
                  </View>
                </>
              ) : (
                <>
                  <View className={styles.statItem}>
                    <Text className={styles.statNumber}>{publishedJobsCount}</Text>
                    <Text className={styles.statLabel}>发布职位</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statNumber}>{receivedAppsCount}</Text>
                    <Text className={styles.statLabel}>收到投递</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statNumber}>3</Text>
                    <Text className={styles.statLabel}>面试安排</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        <View className={styles.menuSection}>
          {menus.map((menu, index) => (
            <React.Fragment key={menu.text}>
              <View className={styles.menuItem} onClick={() => handleMenuTap(menu.url, menu.text)}>
                <Text className={styles.menuIcon}>{menu.icon}</Text>
                <Text className={styles.menuText}>{menu.text}</Text>
                <Text className={styles.menuArrow}>›</Text>
              </View>
              {index < menus.length - 1 && <View className={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        <View className={styles.logoutSection}>
          <View className={styles.logoutBtn} onClick={() => Taro.showToast({ title: '退出登录', icon: 'none' })}>
            <Text className={styles.logoutText}>退出登录</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
