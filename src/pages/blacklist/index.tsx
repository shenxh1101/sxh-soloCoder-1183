import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const BlacklistPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>黑名单管理</Text>
      <Text className={styles.description}>功能正在开发中...</Text>
    </View>
  );
};

export default BlacklistPage;
