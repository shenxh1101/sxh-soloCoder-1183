import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无内容',
  description = '这里还没有任何内容哦~',
}) => {
  return (
    <View className={styles.container}>
      <Text className={styles.icon}>📋</Text>
      <Text className={styles.title}>{title}</Text>
      <Text className={styles.description}>{description}</Text>
    </View>
  );
};

export default EmptyState;
