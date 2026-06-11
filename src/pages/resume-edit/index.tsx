import React, { useState, useCallback } from 'react';
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useResumeStore } from '@/store/useResumeStore';
import type { WorkExperience } from '@/types';
import styles from './index.module.scss';

const ResumeEditPage: React.FC = () => {
  const {
    resume,
    setBasicInfo,
    addWorkExperience,
    removeWorkExperience,
    addSkill,
    removeSkill,
    setExpectation,
    addAttachment,
    removeAttachment,
  } = useResumeStore();

  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState<Partial<WorkExperience>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [showAttachmentPreview, setShowAttachmentPreview] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<any>(null);

  const handleSave = useCallback(() => {
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  }, []);

  const handleAddExperience = () => {
    if (!expForm.company || !expForm.position) {
      Taro.showToast({ title: '请填写公司和职位', icon: 'none' });
      return;
    }
    addWorkExperience(expForm as Omit<WorkExperience, 'id'>);
    setExpForm({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setShowExpModal(false);
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleRemoveExperience = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条工作经历吗？',
      success: (res) => {
        if (res.confirm) {
          removeWorkExperience(id);
          Taro.showToast({ title: '已删除', icon: 'none' });
        }
      },
    });
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) {
      Taro.showToast({ title: '请输入技能名称', icon: 'none' });
      return;
    }
    if (resume.skills.includes(skillInput.trim())) {
      Taro.showToast({ title: '该技能已存在', icon: 'none' });
      return;
    }
    addSkill(skillInput.trim());
    setSkillInput('');
  };

  const handleUploadAttachment = () => {
    const mockFile = {
      name: `附件_${Date.now()}.pdf`,
      size: `${(Math.random() * 5 + 1).toFixed(1)}MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    addAttachment(mockFile);
    Taro.showToast({ title: '上传成功', icon: 'success' });
  };

  const handlePreviewAttachment = (att: any) => {
    setPreviewAttachment(att);
    setShowAttachmentPreview(att.id);
  };

  const handleRemoveAttachment = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这份附件吗？',
      success: (res) => {
        if (res.confirm) {
          removeAttachment(id);
          Taro.showToast({ title: '已删除', icon: 'none' });
        }
      },
    });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>
            基本信息
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>姓名</Text>
            <Input
              className={classnames(styles.formInput, styles.formInputLeft)}
              value={resume.name}
              onInput={(e) => setBasicInfo({ name: e.detail.value })}
              placeholder="请输入姓名"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>电话</Text>
            <Input
              className={classnames(styles.formInput, styles.formInputLeft)}
              value={resume.phone}
              onInput={(e) => setBasicInfo({ phone: e.detail.value })}
              placeholder="请输入手机号"
              type="number"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>邮箱</Text>
            <Input
              className={classnames(styles.formInput, styles.formInputLeft)}
              value={resume.email}
              onInput={(e) => setBasicInfo({ email: e.detail.value })}
              placeholder="请输入邮箱"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>年龄</Text>
            <Input
              className={classnames(styles.formInput, styles.formInputLeft)}
              value={String(resume.age)}
              onInput={(e) => setBasicInfo({ age: Number(e.detail.value) })}
              placeholder="请输入年龄"
              type="number"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>性别</Text>
            <View
              className={styles.formInput}
              style={{ textAlign: 'right' }}
              onClick={() => {
                Taro.showActionSheet({
                  itemList: ['男', '女'],
                  success: (res) => {
                    setBasicInfo({ gender: res.tapIndex === 0 ? '男' : '女' });
                  },
                });
              }}
            >
              <Text style={{ color: resume.gender ? '$color-text-primary' : '$color-text-tertiary' }}>
                {resume.gender || '请选择'}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💼</Text>
            工作经历
          </View>
          {resume.workExperiences.map((exp) => (
            <View key={exp.id} className={styles.experienceCard}>
              <View className={styles.expHeader}>
                <Text className={styles.expCompany}>{exp.company}</Text>
                <Text
                  className={styles.expDelete}
                  onClick={() => handleRemoveExperience(exp.id)}
                >
                  删除
                </Text>
              </View>
              <Text className={styles.expPosition}>{exp.position}</Text>
              <Text className={styles.expDate}>
                {exp.startDate} - {exp.endDate}
              </Text>
              <Text className={styles.expDesc}>{exp.description}</Text>
            </View>
          ))}
          <View className={styles.addBtn} onClick={() => setShowExpModal(true)}>
            <Text className={styles.addBtnIcon}>+</Text>
            <Text className={styles.addBtnText}>添加工作经历</Text>
          </View>
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
                <Text
                  className={styles.skillTagRemove}
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </Text>
              </View>
            ))}
          </View>
          <View className={styles.skillInputRow}>
            <Input
              className={styles.skillInput}
              value={skillInput}
              onInput={(e) => setSkillInput(e.detail.value)}
              placeholder="输入技能名称，如：React"
              onConfirm={handleAddSkill}
            />
            <View className={styles.skillAddBtn} onClick={handleAddSkill}>
              <Text className={styles.skillAddBtnText}>+</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎯</Text>
            求职期望
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>期望职位</Text>
            <Input
              className={classnames(styles.formInput, styles.formInputLeft)}
              value={resume.expectedPosition}
              onInput={(e) => setExpectation({ expectedPosition: e.detail.value })}
              placeholder="请输入期望职位"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>期望薪资</Text>
            <Input
              className={classnames(styles.formInput, styles.formInputLeft)}
              value={resume.expectedSalary}
              onInput={(e) => setExpectation({ expectedSalary: e.detail.value })}
              placeholder="如：20K-30K"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>期望地点</Text>
            <Input
              className={classnames(styles.formInput, styles.formInputLeft)}
              value={resume.expectedLocation}
              onInput={(e) => setExpectation({ expectedLocation: e.detail.value })}
              placeholder="如：北京/上海"
            />
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📎</Text>
            附件管理
          </View>
          {resume.attachments.length > 0 &&
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
                <View className={styles.attachmentActions}>
                  <Text
                    className={styles.attachmentAction}
                    onClick={() => handlePreviewAttachment(att)}
                  >
                    预览
                  </Text>
                  <Text
                    className={styles.attachmentDelete}
                    onClick={() => handleRemoveAttachment(att.id)}
                  >
                    删除
                  </Text>
                </View>
              </View>
            ))}
          <View className={styles.addBtn} style={{ marginTop: '$spacing-md' }} onClick={handleUploadAttachment}>
            <Text className={styles.addBtnIcon}>+</Text>
            <Text className={styles.addBtnText}>上传附件</Text>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.saveBtn} onClick={handleSave}>
          <Text className={styles.saveBtnText}>保存简历</Text>
        </View>
      </View>

      {showExpModal && (
        <View className={styles.modalMask} onClick={() => setShowExpModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加工作经历</Text>
            <View className={styles.modalFormItem}>
              <Text className={styles.modalFormLabel}>公司名称</Text>
              <Input
                className={styles.modalFormInput}
                value={expForm.company}
                onInput={(e) => setExpForm({ ...expForm, company: e.detail.value })}
                placeholder="请输入公司名称"
              />
            </View>
            <View className={styles.modalFormItem}>
              <Text className={styles.modalFormLabel}>职位</Text>
              <Input
                className={styles.modalFormInput}
                value={expForm.position}
                onInput={(e) => setExpForm({ ...expForm, position: e.detail.value })}
                placeholder="请输入职位"
              />
            </View>
            <View className={styles.modalFormItem}>
              <Text className={styles.modalFormLabel}>起止时间</Text>
              <View style={{ display: 'flex', gap: '$spacing-sm' }}>
                <Input
                  className={styles.modalFormInput}
                  style={{ flex: 1 }}
                  value={expForm.startDate}
                  onInput={(e) => setExpForm({ ...expForm, startDate: e.detail.value })}
                  placeholder="如：2023-01"
                />
                <Input
                  className={styles.modalFormInput}
                  style={{ flex: 1 }}
                  value={expForm.endDate}
                  onInput={(e) => setExpForm({ ...expForm, endDate: e.detail.value })}
                  placeholder="如：至今"
                />
              </View>
            </View>
            <View className={styles.modalFormItem}>
              <Text className={styles.modalFormLabel}>工作描述</Text>
              <Textarea
                className={styles.modalFormTextarea}
                value={expForm.description}
                onInput={(e) => setExpForm({ ...expForm, description: e.detail.value })}
                placeholder="请描述工作内容和成果"
              />
            </View>
            <View className={styles.modalActions}>
              <View className={styles.modalCancelBtn} onClick={() => setShowExpModal(false)}>
                <Text className={styles.modalCancelBtnText}>取消</Text>
              </View>
              <View className={styles.modalConfirmBtn} onClick={handleAddExperience}>
                <Text className={styles.modalConfirmBtnText}>确定</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {showAttachmentPreview && (
        <View className={styles.modalMask} onClick={() => setShowAttachmentPreview(null)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>附件预览</Text>
            {previewAttachment && (
              <>
                <View style={{ display: 'flex', alignItems: 'center', marginBottom: '$spacing-md' }}>
                  <Text style={{ fontSize: '80rpx', marginRight: '$spacing-md' }}>📄</Text>
                  <View>
                    <Text style={{ fontSize: '$font-size-md', color: '$color-text-primary', display: 'block', marginBottom: '$spacing-xs' }}>
                      {previewAttachment.name}
                    </Text>
                    <Text style={{ fontSize: '$font-size-sm', color: '$color-text-tertiary' }}>
                      {previewAttachment.size} · {previewAttachment.uploadedAt}
                    </Text>
                  </View>
                </View>
                <View style={{ padding: '$spacing-lg', background: '$color-bg-hover', borderRadius: '$radius-md', minHeight: '200rpx' }}>
                  <Text style={{ fontSize: '$font-size-sm', color: '$color-text-secondary', textAlign: 'center', padding: '40rpx 0' }}>
                    📄 附件内容预览区
                    {'\n'}
                    （此处为模拟预览，实际项目中可使用 PDF 预览组件）
                  </Text>
                </View>
              </>
            )}
            <View className={styles.modalActions}>
              <View className={styles.modalCancelBtn} onClick={() => setShowAttachmentPreview(null)}>
                <Text className={styles.modalCancelBtnText}>关闭</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ResumeEditPage;
