import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const ResumePreviewPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>简历预览</Text>
      <Text className={styles.description}>功能正在开发中...</Text>
    </View>
  );
};

export default ResumePreviewPage;
