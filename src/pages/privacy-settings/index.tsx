import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useSettingStore } from '@/store/useSettingStore';
import styles from './index.module.scss';

const PrivacySettingsPage: React.FC = () => {
  const { privacy, updatePrivacy } = useSettingStore();

  const handleToggle = (key: keyof typeof privacy) => {
    updatePrivacy({ [key]: !privacy[key] });
    Taro.showToast({
      title: privacy[key] ? '已关闭' : '已开启',
      icon: 'none',
      duration: 1000,
    });
  };

  const settings = [
    {
      key: 'resumeVisible' as const,
      label: '简历可见',
      desc: '关闭后企业将无法搜索到你的简历',
    },
    {
      key: 'showPhone' as const,
      label: '显示手机号',
      desc: '允许企业查看你的联系方式',
    },
    {
      key: 'showEmail' as const,
      label: '显示邮箱',
      desc: '允许企业查看你的邮箱地址',
    },
    {
      key: 'allowCompanyView' as const,
      label: '允许企业查看',
      desc: '允许企业主动查看你的简历',
    },
    {
      key: 'hideFromCurrentCompany' as const,
      label: '对当前公司隐藏',
      desc: '避免被现任公司发现你在找工作',
    },
  ];

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.tipBox}>
          <Text className={styles.tipTitle}>🔒 隐私说明</Text>
          <Text className={styles.tipText}>
            我们重视您的隐私安全。您可以根据需要自由控制哪些信息对企业可见，所有设置都会立即生效并保存。
          </Text>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>简历隐私</View>
          {settings.map((item) => (
            <View
              key={item.key}
              className={styles.settingItem}
              onClick={() => handleToggle(item.key)}
            >
              <View className={styles.settingInfo}>
                <Text className={styles.settingLabel}>{item.label}</Text>
                <Text className={styles.settingDesc}>{item.desc}</Text>
              </View>
              <View
                className={classnames(
                  styles.switch,
                  privacy[item.key] && styles.switchActive
                )}
              >
                <View className={styles.switchDot} />
              </View>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>黑名单管理</View>
          <View
            className={styles.settingItem}
            onClick={() => Taro.navigateTo({ url: '/pages/blacklist/index' })}
          >
            <View className={styles.settingInfo}>
              <Text className={styles.settingLabel}>黑名单</Text>
              <Text className={styles.settingDesc}>管理你屏蔽的企业和职位</Text>
            </View>
            <Text className={styles.settingArrow}>›</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacySettingsPage;
