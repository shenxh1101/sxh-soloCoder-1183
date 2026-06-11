import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './index.module.scss';

const ResumePreviewPage: React.FC = () => {
  const { resume } = useResumeStore();

  const handleExport = () => {
    Taro.showToast({ title: '简历导出中...', icon: 'loading' });
    setTimeout(() => {
      Taro.showToast({ title: '已导出PDF', icon: 'success' });
    }, 1500);
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.resumePaper}>
          <View className={styles.header}>
            <View className={styles.headerRow}>
              <Image className={styles.avatar} src={resume.avatar} mode="aspectFill" />
              <View className={styles.headerInfo}>
                <Text className={styles.name}>{resume.name}</Text>
                <View className={styles.meta}>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaIcon}>📱</Text>
                    <Text>{resume.phone}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaIcon}>✉️</Text>
                    <Text>{resume.email}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaIcon}>🎂</Text>
                    <Text>{resume.age}岁</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaIcon}>👤</Text>
                    <Text>{resume.gender}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🎯</Text>
              求职期望
            </View>
            <View className={styles.expectGrid}>
              <View className={styles.expectItem}>
                <Text className={styles.expectLabel}>期望职位：</Text>
                <Text className={styles.expectValue}>{resume.expectedPosition}</Text>
              </View>
              <View className={styles.expectItem}>
                <Text className={styles.expectLabel}>期望薪资：</Text>
                <Text className={styles.expectValue}>{resume.expectedSalary}</Text>
              </View>
              <View className={styles.expectItem}>
                <Text className={styles.expectLabel}>期望地点：</Text>
                <Text className={styles.expectValue}>{resume.expectedLocation}</Text>
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>💼</Text>
              工作经历
            </View>
            {resume.workExperiences.map((exp) => (
              <View key={exp.id} className={styles.experienceItem}>
                <View className={styles.expHeader}>
                  <Text className={styles.expCompany}>{exp.company}</Text>
                  <Text className={styles.expDate}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                </View>
                <Text className={styles.expPosition}>{exp.position}</Text>
                <Text className={styles.expDesc}>{exp.description}</Text>
              </View>
            ))}
          </View>

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🛠</Text>
              专业技能
            </View>
            <View className={styles.skillTags}>
              {resume.skills.map((skill) => (
                <View key={skill} className={styles.skillTag}>
                  <Text className={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {resume.attachments.length > 0 && (
            <View className={styles.section}>
              <View className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>📎</Text>
                附件简历
              </View>
              {resume.attachments.map((att) => (
                <View key={att.id} className={styles.attachmentItem}>
                  <Text className={styles.attachmentIcon}>📄</Text>
                  <Text className={styles.attachmentName}>{att.name}</Text>
                  <Text className={styles.attachmentSize}>{att.size}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.shareBtn} onClick={() => Taro.showToast({ title: '分享功能开发中', icon: 'none' })}>
          <Text className={styles.shareBtnIcon}>📤</Text>
          <Text className={styles.shareBtnText}>分享</Text>
        </View>
        <View className={styles.exportBtn} onClick={handleExport}>
          <Text className={styles.exportBtnText}>导出 PDF</Text>
        </View>
      </View>
    </View>
  );
};

export default ResumePreviewPage;
