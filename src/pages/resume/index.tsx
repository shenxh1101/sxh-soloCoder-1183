import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './index.module.scss';

const ResumePage: React.FC = () => {
  const { resume, calculateCompletion } = useResumeStore();
  const completion = calculateCompletion();

  useDidShow(() => {
    // 页面显示时自动刷新
  });

  const handleEdit = () => {
    Taro.navigateTo({ url: '/pages/resume-edit/index' });
  };

  const handlePreview = () => {
    Taro.navigateTo({ url: '/pages/resume-preview/index' });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.profileHeader}>
          <Image className={styles.avatar} src={resume.avatar} mode="aspectFill" />
          <View className={styles.profileInfo}>
            <Text className={styles.profileName}>{resume.name}</Text>
            <View className={styles.profileMeta}>
              <Text className={styles.metaTag}>{resume.gender}</Text>
              <Text className={styles.metaTag}>·</Text>
              <Text className={styles.metaTag}>{resume.age}岁</Text>
              <Text className={styles.metaTag}>·</Text>
              <Text className={styles.metaTag}>{resume.phone}</Text>
            </View>
            <View className={styles.completionBar}>
              <View className={styles.completionTrack}>
                <View
                  className={styles.completionFill}
                  style={{ width: `${completion}%` }}
                />
              </View>
              <Text className={styles.completionText}>完善度 {completion}%</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionIcon}>📋</Text>
              <Text className={styles.sectionTitle}>基本信息</Text>
            </View>
            <Text className={styles.sectionEdit} onClick={handleEdit}>编辑</Text>
          </View>
          <View className={styles.basicInfoGrid}>
            <View className={styles.basicInfoItem}>
              <Text className={styles.basicInfoLabel}>电话</Text>
              <Text className={styles.basicInfoValue}>{resume.phone}</Text>
            </View>
            <View className={styles.basicInfoItem}>
              <Text className={styles.basicInfoLabel}>邮箱</Text>
              <Text className={styles.basicInfoValue}>{resume.email}</Text>
            </View>
            <View className={styles.basicInfoItem}>
              <Text className={styles.basicInfoLabel}>年龄</Text>
              <Text className={styles.basicInfoValue}>{resume.age}岁</Text>
            </View>
            <View className={styles.basicInfoItem}>
              <Text className={styles.basicInfoLabel}>性别</Text>
              <Text className={styles.basicInfoValue}>{resume.gender}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionIcon}>💼</Text>
              <Text className={styles.sectionTitle}>工作经历</Text>
            </View>
            <Text className={styles.sectionEdit} onClick={handleEdit}>编辑</Text>
          </View>
          {resume.workExperiences.length === 0 ? (
            <View className={styles.emptyTip}>
              <Text className={styles.emptyTipText}>还没有工作经历，快去添加吧~</Text>
            </View>
          ) : (
            resume.workExperiences.map((exp) => (
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
            ))
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionIcon}>🛠</Text>
              <Text className={styles.sectionTitle}>专业技能</Text>
            </View>
            <Text className={styles.sectionEdit} onClick={handleEdit}>编辑</Text>
          </View>
          {resume.skills.length === 0 ? (
            <View className={styles.emptyTip}>
              <Text className={styles.emptyTipText}>还没有添加技能标签~</Text>
            </View>
          ) : (
            <View className={styles.skillTags}>
              {resume.skills.map((skill) => (
                <View key={skill} className={styles.skillTag}>
                  <Text className={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionIcon}>🎯</Text>
              <Text className={styles.sectionTitle}>求职期望</Text>
            </View>
            <Text className={styles.sectionEdit} onClick={handleEdit}>编辑</Text>
          </View>
          <View className={styles.expectItem}>
            <Text className={styles.expectLabel}>期望薪资</Text>
            <Text className={styles.expectValue}>{resume.expectedSalary || '未填写'}</Text>
          </View>
          <View className={styles.expectItem}>
            <Text className={styles.expectLabel}>期望职位</Text>
            <Text className={styles.expectValue}>{resume.expectedPosition || '未填写'}</Text>
          </View>
          <View className={styles.expectItem}>
            <Text className={styles.expectLabel}>期望地点</Text>
            <Text className={styles.expectValue}>{resume.expectedLocation || '未填写'}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionIcon}>📎</Text>
              <Text className={styles.sectionTitle}>附件管理</Text>
            </View>
            <Text className={styles.sectionEdit} onClick={handleEdit}>上传</Text>
          </View>
          {resume.attachments.length === 0 ? (
            <View className={styles.emptyTip}>
              <Text className={styles.emptyTipText}>还没有上传附件简历~</Text>
            </View>
          ) : (
            resume.attachments.map((att) => (
              <View key={att.id} className={styles.attachmentItem}>
                <View className={styles.attachmentInfo}>
                  <Text className={styles.attachmentIcon}>📄</Text>
                  <View className={styles.attachmentDetail}>
                    <Text className={styles.attachmentName}>{att.name}</Text>
                    <Text className={styles.attachmentMeta}>
                      {att.size} · {att.uploadedAt}
                    </Text>
                  </View>
                </View>
                <Text className={styles.attachmentAction} onClick={() => Taro.showToast({ title: '预览功能', icon: 'none' })}>预览</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.editBtn} onClick={handleEdit}>
          <Text className={styles.editBtnText}>编辑简历</Text>
        </View>
        <View className={styles.previewBtn} onClick={handlePreview}>
          <Text className={styles.previewBtnText}>预览简历</Text>
        </View>
      </View>
    </View>
  );
};

export default ResumePage;
