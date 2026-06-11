import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import type { Interview } from '@/types';
import styles from './index.module.scss';

interface InterviewCardProps {
  interview: Interview;
  onAction?: (id: string, action: string) => void;
  onTap?: (id: string) => void;
}

const statusMap: Record<string, { label: string; style: string }> = {
  pending: { label: '待确认', style: 'statusPending' },
  confirmed: { label: '已确认', style: 'statusConfirmed' },
  rescheduled: { label: '已改期', style: 'statusRescheduled' },
  completed: { label: '已完成', style: 'statusCompleted' },
  cancelled: { label: '已取消', style: 'statusCancelled' },
};

const resultMap: Record<string, { label: string; style: string }> = {
  passed: { label: '通过', style: 'resultPassed' },
  failed: { label: '未通过', style: 'resultFailed' },
  pending: { label: '待定', style: 'resultPending' },
};

const InterviewCard: React.FC<InterviewCardProps> = ({ interview, onAction, onTap }) => {
  const statusInfo = statusMap[interview.status] || statusMap.pending;
  const resultInfo = interview.result ? resultMap[interview.result] : null;
  const isUpcoming = ['pending', 'confirmed', 'rescheduled'].includes(interview.status);

  return (
    <View className={styles.card} onClick={() => onTap?.(interview.id)}>
      <View className={styles.header}>
        <Image className={styles.logo} src={interview.companyLogo} mode="aspectFill" />
        <View className={styles.headerInfo}>
          <Text className={styles.jobTitle}>{interview.jobTitle}</Text>
          <Text className={styles.companyName}>{interview.companyName}</Text>
        </View>
        <View className={classnames(styles.statusBadge, styles[statusInfo.style])}>
          <Text className={styles.statusText}>{statusInfo.label}</Text>
        </View>
      </View>

      <View className={styles.detailRow}>
        <Text className={styles.detailIcon}>🕐</Text>
        <Text className={styles.detailText}>{interview.time}</Text>
      </View>
      <View className={styles.detailRow}>
        <Text className={styles.detailIcon}>📍</Text>
        <Text className={styles.detailText}>{interview.location}</Text>
      </View>
      <View className={styles.detailRow}>
        <Text className={styles.detailIcon}>👤</Text>
        <Text className={styles.detailText}>{interview.interviewer}</Text>
      </View>

      {interview.notes && (
        <View className={styles.notesRow}>
          <Text className={styles.notesText}>{interview.notes}</Text>
        </View>
      )}

      {interview.status === 'completed' && resultInfo && (
        <View className={styles.resultRow}>
          <Text className={styles.resultLabel}>面试结果：</Text>
          <View className={classnames(styles.resultBadge, styles[resultInfo.style])}>
            <Text className={styles.resultText}>{resultInfo.label}</Text>
          </View>
        </View>
      )}

      <View className={styles.actionRow}>
        {interview.status === 'pending' && (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnDefault)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'remind');
              }}
            >
              <Text className={styles.actionBtnText}>发送提醒</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnReschedule)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'reschedule');
              }}
            >
              <Text className={styles.actionBtnText}>改期</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnConfirm)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'confirm');
              }}
            >
              <Text className={styles.actionBtnText}>确认面试</Text>
            </View>
          </>
        )}
        {interview.status === 'confirmed' && (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnDefault)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'remind');
              }}
            >
              <Text className={styles.actionBtnText}>发送提醒</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnRecord)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'record');
              }}
            >
              <Text className={styles.actionBtnText}>完成记录</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnReschedule)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'reschedule');
              }}
            >
              <Text className={styles.actionBtnText}>申请改期</Text>
            </View>
          </>
        )}
        {interview.status === 'rescheduled' && (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnDefault)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'remind');
              }}
            >
              <Text className={styles.actionBtnText}>发送提醒</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnConfirm)}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(interview.id, 'confirm');
              }}
            >
              <Text className={styles.actionBtnText}>确认面试</Text>
            </View>
          </>
        )}
        {interview.status === 'completed' && !interview.result && (
          <View
            className={classnames(styles.actionBtn, styles.btnRecord)}
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(interview.id, 'record');
            }}
          >
            <Text className={styles.actionBtnText}>补录结果</Text>
          </View>
        )}
        {interview.status === 'completed' && interview.result && (
          <View
            className={classnames(styles.actionBtn, styles.btnRecord)}
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(interview.id, 'record');
            }}
          >
            <Text className={styles.actionBtnText}>修改结果</Text>
          </View>
        )}
        {!isUpcoming && interview.status !== 'completed' && (
          <View className={styles.actionHint}>
            <Text className={styles.actionHintText}>该面试已结束</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default InterviewCard;
