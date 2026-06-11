import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useUserStore } from '@/store/useUserStore';
import { mockUserProfile } from '@/data/profile';
import styles from './index.module.scss';

const seekerMenus = [
  { icon: '📝', text: '我的投递', url: '/pages/applications/index' },
  { icon: '⭐', text: '我的收藏', url: '/pages/applications/index' },
  { icon: '🔒', text: '隐私设置', url: '/pages/privacy-settings/index' },
  { icon: '🚫', text: '黑名单管理', url: '/pages/blacklist/index' },
];

const companyMenus = [
  { icon: '📌', text: '发布职位', url: '/pages/publish-job/index' },
  { icon: '📊', text: '已发布职位', url: '/pages/applications/index' },
  { icon: '📋', text: '收到的投递', url: '/pages/applications/index' },
  { icon: '🔒', text: '隐私设置', url: '/pages/privacy-settings/index' },
  { icon: '🚫', text: '黑名单管理', url: '/pages/blacklist/index' },
];

const ProfilePage: React.FC = () => {
  const { role, toggleRole } = useUserStore();
  const profile = mockUserProfile;

  const menus = role === 'seeker' ? seekerMenus : companyMenus;

  const handleMenuTap = (url: string) => {
    Taro.navigateTo({ url });
  };

  return (
    <View className={styles.container}>
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
              onClick={() => role !== 'seeker' && toggleRole()}
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
              onClick={() => role !== 'company' && toggleRole()}
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
                  <Text className={styles.statNumber}>{profile.applicationCount}</Text>
                  <Text className={styles.statLabel}>投递数</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statNumber}>{profile.bookmarkCount}</Text>
                  <Text className={styles.statLabel}>收藏数</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statNumber}>{profile.resumeCompletion}%</Text>
                  <Text className={styles.statLabel}>简历完善</Text>
                </View>
              </>
            ) : (
              <>
                <View className={styles.statItem}>
                  <Text className={styles.statNumber}>{profile.publishedJobs}</Text>
                  <Text className={styles.statLabel}>发布职位</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statNumber}>{profile.receivedApplications}</Text>
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
            <View className={styles.menuItem} onClick={() => handleMenuTap(menu.url)}>
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
    </View>
  );
};

export default ProfilePage;
