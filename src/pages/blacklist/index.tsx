import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useSettingStore } from '@/store/useSettingStore';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

const BlacklistPage: React.FC = () => {
  const { blacklist, removeFromBlacklist } = useSettingStore();

  const handleRemove = (id: string, name: string) => {
    Taro.showModal({
      title: '移除黑名单',
      content: `确定要将「${name}」从黑名单中移除吗？`,
      confirmColor: '#2B6BFF',
    }).then((res) => {
      if (res.confirm) {
        removeFromBlacklist(id);
        Taro.showToast({ title: '已移除', icon: 'success' });
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.tipBar}>
        黑名单中的企业/个人将无法向你发送消息和邀请
      </View>

      {blacklist.length === 0 ? (
        <EmptyState title="暂无黑名单" description="你还没有添加任何黑名单~" />
      ) : (
        <ScrollView className={styles.scrollView} scrollY>
          <View className={styles.list}>
            {blacklist.map((item) => (
              <View key={item.id} className={styles.item}>
                <Image
                  className={styles.avatar}
                  src={item.avatar}
                  mode="aspectFill"
                />
                <View className={styles.info}>
                  <Text className={styles.name}>{item.name}</Text>
                  <View className={styles.typeBadge}>
                    <Text className={styles.typeText}>
                      {item.type === 'company' ? '企业' : '求职者'}
                    </Text>
                  </View>
                  {item.reason && (
                    <Text className={styles.reason}>原因：{item.reason}</Text>
                  )}
                  <Text className={styles.date}>加入时间：{item.addedAt}</Text>
                </View>
                <View
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.id, item.name)}
                >
                  <Text className={styles.removeBtnText}>移除</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default BlacklistPage;
