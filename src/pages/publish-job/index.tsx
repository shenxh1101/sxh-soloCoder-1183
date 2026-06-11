import React, { useState } from 'react';
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useJobStore } from '@/store/useJobStore';
import styles from './index.module.scss';

const typeOptions = ['全职', '兼职', '实习', '远程'];
const experienceOptions = ['不限', '应届', '1-3年', '3-5年', '5-10年', '10年以上'];
const educationOptions = ['不限', '大专', '本科', '硕士', '博士'];
const locationOptions = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京'];

const PublishJobPage: React.FC = () => {
  const { addJob } = useJobStore();

  const [title, setTitle] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('全职');
  const [experience, setExperience] = useState('不限');
  const [education, setEducation] = useState('不限');
  const [description, setDescription] = useState('');
  const [welfare, setWelfare] = useState<string[]>(['五险一金', '年终奖']);

  const [showPicker, setShowPicker] = useState<null | 'type' | 'experience' | 'education' | 'location'>(null);

  const welfareOptions = ['五险一金', '年终奖', '带薪年假', '弹性工作', '免费午餐', '健身房', '定期团建', '节日福利'];

  const canPublish = title.trim() && salaryMin && salaryMax && location;

  const handlePublish = () => {
    if (!canPublish) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    addJob({
      id: '',
      title: title.trim(),
      company: '',
      companyLogo: '',
      salaryMin: parseInt(salaryMin),
      salaryMax: parseInt(salaryMax),
      location,
      experience,
      education,
      type,
      description,
      tags: welfare,
      welfare,
      isBookmarked: false,
      isApplied: false,
      publishedAt: '',
    } as any);

    Taro.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleWelfareToggle = (item: string) => {
    if (welfare.includes(item)) {
      setWelfare(welfare.filter((w) => w !== item));
    } else {
      setWelfare([...welfare, item]);
    }
  };

  const renderPicker = () => {
    if (!showPicker) return null;

    let options: string[] = [];
    let currentValue = '';
    switch (showPicker) {
      case 'type':
        options = typeOptions;
        currentValue = type;
        break;
      case 'experience':
        options = experienceOptions;
        currentValue = experience;
        break;
      case 'education':
        options = educationOptions;
        currentValue = education;
        break;
      case 'location':
        options = locationOptions;
        currentValue = location;
        break;
    }

    const handleSelect = (value: string) => {
      switch (showPicker) {
        case 'type':
          setType(value);
          break;
        case 'experience':
          setExperience(value);
          break;
        case 'education':
          setEducation(value);
          break;
        case 'location':
          setLocation(value);
          break;
      }
      setShowPicker(null);
    };

    return (
      <View className={styles.pickerMask} onClick={() => setShowPicker(null)}>
        <View className={styles.pickerContent} onClick={(e) => e.stopPropagation()}>
          <View className={styles.pickerHeader}>
            <Text className={styles.pickerCancel} onClick={() => setShowPicker(null)}>取消</Text>
            <Text className={styles.pickerTitle}>请选择</Text>
            <Text className={styles.pickerConfirm} onClick={() => setShowPicker(null)}>确定</Text>
          </View>
          <ScrollView className={styles.pickerOptions} scrollY>
            {options.map((opt) => (
              <View
                key={opt}
                className={classnames(
                  styles.pickerOption,
                  currentValue === opt && styles.pickerOptionActive
                )}
                onClick={() => handleSelect(opt)}
              >
                <Text>{opt}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>
            基本信息
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>职位名称</Text>
            <Input
              className={styles.formInput}
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              placeholder="请输入职位名称"
              placeholderClass={styles.formPlaceholder}
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>薪资范围</Text>
            <View className={styles.salaryRow}>
              <Input
                className={styles.salaryInput}
                type="number"
                value={salaryMin}
                onInput={(e) => setSalaryMin(e.detail.value)}
                placeholder="最低"
                placeholderClass={styles.formPlaceholder}
              />
              <Text className={styles.salaryUnit}>K</Text>
              <Text className={styles.salaryUnit}>-</Text>
              <Input
                className={styles.salaryInput}
                type="number"
                value={salaryMax}
                onInput={(e) => setSalaryMax(e.detail.value)}
                placeholder="最高"
                placeholderClass={styles.formPlaceholder}
              />
              <Text className={styles.salaryUnit}>K</Text>
            </View>
          </View>
          <View className={styles.formItem} onClick={() => setShowPicker('location')}>
            <Text className={styles.formLabel}>工作地点</Text>
            <Text className={classnames(styles.formInput, !location && styles.formPlaceholder)} style={{ textAlign: 'right' }}>
              {location || '请选择'}
            </Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>
            职位要求
          </View>
          <View className={styles.formItem} onClick={() => setShowPicker('type')}>
            <Text className={styles.formLabel}>工作类型</Text>
            <Text className={styles.formInput} style={{ textAlign: 'right' }}>{type}</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
          <View className={styles.formItem} onClick={() => setShowPicker('experience')}>
            <Text className={styles.formLabel}>经验要求</Text>
            <Text className={styles.formInput} style={{ textAlign: 'right' }}>{experience}</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
          <View className={styles.formItem} onClick={() => setShowPicker('education')}>
            <Text className={styles.formLabel}>学历要求</Text>
            <Text className={styles.formInput} style={{ textAlign: 'right' }}>{education}</Text>
            <Text className={styles.formArrow}>›</Text>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎁</Text>
            福利待遇
          </View>
          <View className={styles.formItem} style={{ alignItems: 'flex-start' }}>
            <Text className={styles.formLabel} style={{ paddingTop: '8rpx' }}>选择福利</Text>
            <View className={styles.tagsRow}>
              {welfareOptions.map((item) => (
                <View
                  key={item}
                  className={classnames(
                    styles.tagItem,
                    welfare.includes(item) && styles.tagItemActive
                  )}
                  onClick={() => handleWelfareToggle(item)}
                >
                  <Text className={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📄</Text>
            职位描述
          </View>
          <View className={styles.textareaItem}>
            <Text className={styles.textareaLabel}>岗位职责与要求</Text>
            <Textarea
              className={styles.textarea}
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              placeholder="请输入职位描述，包括岗位职责、任职要求等"
              placeholderClass={styles.formPlaceholder}
              maxlength={2000}
            />
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View
          className={classnames(
            styles.publishBtn,
            !canPublish && styles.publishBtnDisabled
          )}
          onClick={handlePublish}
        >
          <Text className={styles.publishBtnText}>立即发布</Text>
        </View>
      </View>

      {renderPicker()}
    </View>
  );
};

export default PublishJobPage;
