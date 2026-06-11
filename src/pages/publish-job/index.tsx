import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const PublishJobPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>发布职位</Text>
      <Text className={styles.description}>功能正在开发中...</Text>
    </View>
  );
};

export default PublishJobPage;
