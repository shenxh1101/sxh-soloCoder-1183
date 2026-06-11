import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useResumeStore } from '@/store/useResumeStore';
import type { AttachmentItem } from '@/types';
import styles from './index.module.scss';

const ResumePage: React.FC = () => {
  const { resume, calculateCompletion } = useResumeStore();
  const completion = calculateCompletion();
  const [showAttachmentPreview, setShowAttachmentPreview] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentItem | null>(null);

  useDidShow(() => {
    // 页面显示时自动刷新 - useResumeStore 响应式，无需手动刷新
  });

  const handleEdit = () => {
    Taro.navigateTo({ url: '/pages/resume-edit/index' });
  };

  const handlePreview = () => {
    Taro.navigateTo({ url: '/pages/resume-preview/index' });
  };

  const handlePreviewAttachment = (att: AttachmentItem) => {
    setPreviewAttachment(att);
    setShowAttachmentPreview(att.id);
  };

  const handleCloseAttachmentPreview = () => {
    setShowAttachmentPreview(null);
    setPreviewAttachment(null);
  };

  const getFileTypeLabel = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const map: Record<string, string> = {
      pdf: 'PDF 文档',
      doc: 'Word 文档',
      docx: 'Word 文档',
      xls: 'Excel 表格',
      xlsx: 'Excel 表格',
      ppt: 'PPT 演示',
      pptx: 'PPT 演示',
      jpg: 'JPG 图片',
      jpeg: 'JPG 图片',
      png: 'PNG 图片',
      txt: '文本文件',
    };
    return map[ext] || `${ext.toUpperCase()} 文件`;
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
              <Text className={styles.emptyTipText}>还没有添加工作经历~</Text>
            </View>
          ) : (
            resume.workExperiences.map((exp) => (
              <View key={exp.id} className={styles.experienceItem}>
                <View className={styles.experienceHeader}>
                  <Text className={styles.experienceCompany}>{exp.company}</Text>
                  <Text className={styles.experienceDate}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                </View>
                <Text className={styles.experiencePosition}>{exp.position}</Text>
                <Text className={styles.experienceDescription}>
                  {exp.description}
                </Text>
              </View>
            ))
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionIcon}>🔧</Text>
              <Text className={styles.sectionTitle}>专业技能</Text>
            </View>
            <Text className={styles.sectionEdit} onClick={handleEdit}>编辑</Text>
          </View>
          {resume.skills.length === 0 ? (
            <View className={styles.emptyTip}>
              <Text className={styles.emptyTipText}>还没有添加技能标签~</Text>
            </View>
          ) : (
            <View className={styles.skillsList}>
              {resume.skills.map((skill, index) => (
                <View key={`${skill}-${index}`} className={styles.skillTag}>
                  <Text className={styles.skillText}>{skill}</Text>
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
          {!resume.expectedPosition && !resume.expectedSalary && !resume.expectedLocation ? (
            <View className={styles.emptyTip}>
              <Text className={styles.emptyTipText}>还没有添加求职期望~</Text>
            </View>
          ) : (
            <View className={styles.expectationBox}>
              {resume.expectedPosition && (
                <View className={styles.expectationRow}>
                  <Text className={styles.expectationLabel}>期望职位</Text>
                  <Text className={styles.expectationValue}>
                    {resume.expectedPosition}
                  </Text>
                </View>
              )}
              {resume.expectedLocation && (
                <View className={styles.expectationRow}>
                  <Text className={styles.expectationLabel}>期望城市</Text>
                  <Text className={styles.expectationValue}>
                    {resume.expectedLocation}
                  </Text>
                </View>
              )}
              {resume.expectedSalary && (
                <View className={styles.expectationRow}>
                  <Text className={styles.expectationLabel}>期望薪资</Text>
                  <Text className={styles.expectationValue}>
                    {resume.expectedSalary}
                  </Text>
                </View>
              )}
            </View>
          )}
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
                <Text className={styles.attachmentAction} onClick={() => handlePreviewAttachment(att)}>预览</Text>
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

      {showAttachmentPreview && previewAttachment && (
        <View className={styles.previewModal} onClick={handleCloseAttachmentPreview}>
          <View className={styles.previewModalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.previewModalHeader}>
              <Text className={styles.previewModalTitle}>附件详情</Text>
              <Text className={styles.previewModalClose} onClick={handleCloseAttachmentPreview}>×</Text>
            </View>
            <View className={styles.previewFileIcon}>
              <Text style={{ fontSize: '120rpx' }}>📄</Text>
            </View>
            <View className={styles.previewFileInfo}>
              <View className={styles.previewInfoRow}>
                <Text className={styles.previewInfoLabel}>文件名称</Text>
                <Text className={styles.previewInfoValue}>{previewAttachment.name}</Text>
              </View>
              <View className={styles.previewInfoRow}>
                <Text className={styles.previewInfoLabel}>文件类型</Text>
                <Text className={styles.previewInfoValue}>{getFileTypeLabel(previewAttachment.name)}</Text>
              </View>
              <View className={styles.previewInfoRow}>
                <Text className={styles.previewInfoLabel}>文件大小</Text>
                <Text className={styles.previewInfoValue}>{previewAttachment.size}</Text>
              </View>
              <View className={styles.previewInfoRow}>
                <Text className={styles.previewInfoLabel}>上传时间</Text>
                <Text className={styles.previewInfoValue}>{previewAttachment.uploadedAt}</Text>
              </View>
            </View>
            <View className={styles.previewActions}>
              <View className={styles.previewDownloadBtn} onClick={() => Taro.showToast({ title: '下载中...', icon: 'loading' })}>
                <Text className={styles.previewDownloadBtnText}>下载文件</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ResumePage;
