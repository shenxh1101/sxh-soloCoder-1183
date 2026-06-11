import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockResume } from '@/data/profile';
import styles from './index.module.scss';

const ResumePage: React.FC = () => {
  const resume = mockResume;

  return (
    <View className={styles.container}>
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
                style={{ width: `${resume.completion}%` }}
              />
            </View>
            <Text className={styles.completionText}>完善度 {resume.completion}%</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitleRow}>
            <Text className={styles.sectionIcon}>📋</Text>
            <Text className={styles.sectionTitle}>基本信息</Text>
          </View>
          <Text className={styles.sectionEdit}>编辑</Text>
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
          <Text className={styles.sectionEdit}>编辑</Text>
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
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitleRow}>
            <Text className={styles.sectionIcon}>🛠</Text>
            <Text className={styles.sectionTitle}>专业技能</Text>
          </View>
          <Text className={styles.sectionEdit}>编辑</Text>
        </View>
        <View className={styles.skillTags}>
          {resume.skills.map((skill) => (
            <View key={skill} className={styles.skillTag}>
              <Text className={styles.skillTagText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitleRow}>
            <Text className={styles.sectionIcon}>🎯</Text>
            <Text className={styles.sectionTitle}>求职期望</Text>
          </View>
          <Text className={styles.sectionEdit}>编辑</Text>
        </View>
        <View className={styles.expectItem}>
          <Text className={styles.expectLabel}>期望薪资</Text>
          <Text className={styles.expectValue}>{resume.expectedSalary}</Text>
        </View>
        <View className={styles.expectItem}>
          <Text className={styles.expectLabel}>期望职位</Text>
          <Text className={styles.expectValue}>{resume.expectedPosition}</Text>
        </View>
        <View className={styles.expectItem}>
          <Text className={styles.expectLabel}>期望地点</Text>
          <Text className={styles.expectValue}>{resume.expectedLocation}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitleRow}>
            <Text className={styles.sectionIcon}>📎</Text>
            <Text className={styles.sectionTitle}>附件管理</Text>
          </View>
          <Text className={styles.sectionEdit}>上传</Text>
        </View>
        {resume.attachments.map((att) => (
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
            <Text className={styles.attachmentAction}>预览</Text>
          </View>
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View
          className={styles.editBtn}
          onClick={() => Taro.navigateTo({ url: '/pages/resume-edit/index' })}
        >
          <Text className={styles.editBtnText}>编辑简历</Text>
        </View>
        <View
          className={styles.previewBtn}
          onClick={() => Taro.navigateTo({ url: '/pages/resume-preview/index' })}
        >
          <Text className={styles.previewBtnText}>预览简历</Text>
        </View>
      </View>
    </View>
  );
};

export default ResumePage;
