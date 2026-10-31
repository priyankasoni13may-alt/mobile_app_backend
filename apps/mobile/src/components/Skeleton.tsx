/**
 * Skeleton Loading Components
 * Professional skeleton loading placeholders with smooth pulse animation.
 * Used across all screens to show content shape while data loads.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle
} from 'react-native';

// --- Core Shimmer Bone ---

interface SkeletonBoneProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBone: React.FC<SkeletonBoneProps> = ({
  width = '100%',
  height = 14,
  borderRadius = 8,
  style
}) => {
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#E2E8F0',
          opacity: opacityAnim
        },
        style
      ]}
    />
  );
};

// --- Dashboard Home Skeleton ---

export const HomeSkeleton: React.FC = () => (
  <View style={skeletonStyles.container}>
    {/* Hero Card Skeleton */}
    <View style={skeletonStyles.heroCard}>
      <View style={skeletonStyles.heroTopRow}>
        <SkeletonBone width={120} height={22} borderRadius={12} />
        <SkeletonBone width={72} height={22} borderRadius={12} />
      </View>
      <SkeletonBone width={180} height={24} borderRadius={6} style={{ marginTop: 14 }} />
      <SkeletonBone width={260} height={12} borderRadius={4} style={{ marginTop: 8 }} />
      <View style={skeletonStyles.heroMetaStrip}>
        <SkeletonBone width={70} height={28} borderRadius={6} />
        <SkeletonBone width={90} height={28} borderRadius={6} />
        <SkeletonBone width={60} height={28} borderRadius={6} />
      </View>
    </View>

    {/* Section Header */}
    <View style={skeletonStyles.sectionRow}>
      <SkeletonBone width={200} height={14} borderRadius={4} />
      <SkeletonBone width={80} height={12} borderRadius={4} />
    </View>

    {/* 4 KPI Cards */}
    <View style={skeletonStyles.kpiGrid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={skeletonStyles.kpiCard}>
          <View style={skeletonStyles.kpiTopRow}>
            <SkeletonBone width={36} height={36} borderRadius={10} />
            <SkeletonBone width={40} height={18} borderRadius={6} />
          </View>
          <SkeletonBone width={60} height={28} borderRadius={6} style={{ marginTop: 10 }} />
          <SkeletonBone width={'80%'} height={10} borderRadius={4} style={{ marginTop: 6 }} />
          <SkeletonBone width={'100%'} height={6} borderRadius={3} style={{ marginTop: 8 }} />
          <SkeletonBone width={70} height={9} borderRadius={3} style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>

    {/* Quick Actions */}
    <View style={skeletonStyles.sectionRow}>
      <SkeletonBone width={120} height={14} borderRadius={4} />
    </View>
    <View style={skeletonStyles.quickGrid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={skeletonStyles.quickCard}>
          <SkeletonBone width={42} height={42} borderRadius={14} />
          <SkeletonBone width={50} height={10} borderRadius={4} style={{ marginTop: 8 }} />
          <SkeletonBone width={60} height={8} borderRadius={3} style={{ marginTop: 4 }} />
        </View>
      ))}
    </View>

    {/* Activity */}
    <View style={skeletonStyles.sectionRow}>
      <SkeletonBone width={130} height={14} borderRadius={4} />
      <SkeletonBone width={80} height={12} borderRadius={4} />
    </View>
    <View style={skeletonStyles.activityCard}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={skeletonStyles.activityRow}>
          <SkeletonBone width={36} height={36} borderRadius={12} />
          <View style={{ flex: 1, gap: 6 }}>
            <SkeletonBone width={'70%'} height={13} borderRadius={4} />
            <SkeletonBone width={'90%'} height={10} borderRadius={3} />
          </View>
          <SkeletonBone width={32} height={10} borderRadius={3} />
        </View>
      ))}
    </View>
  </View>
);

// --- Leads List Skeleton ---

export const LeadsSkeleton: React.FC = () => (
  <View style={skeletonStyles.container}>
    {/* Search Bar */}
    <SkeletonBone width={'100%'} height={44} borderRadius={12} style={{ marginBottom: 12 }} />

    {/* Filter Pills */}
    <View style={skeletonStyles.filterRow}>
      {[80, 65, 90, 70].map((w, i) => (
        <SkeletonBone key={i} width={w} height={30} borderRadius={16} />
      ))}
    </View>

    {/* Lead Cards */}
    {[0, 1, 2, 3, 4].map((i) => (
      <View key={i} style={skeletonStyles.leadCard}>
        <View style={skeletonStyles.leadTopRow}>
          <SkeletonBone width={36} height={36} borderRadius={12} />
          <View style={{ flex: 1, gap: 6, marginLeft: 12 }}>
            <SkeletonBone width={'65%'} height={14} borderRadius={4} />
            <SkeletonBone width={'45%'} height={10} borderRadius={3} />
          </View>
          <SkeletonBone width={68} height={20} borderRadius={6} />
        </View>
        <SkeletonBone width={'85%'} height={10} borderRadius={3} style={{ marginTop: 10 }} />
        <View style={skeletonStyles.leadFootRow}>
          <SkeletonBone width={80} height={9} borderRadius={3} />
          <SkeletonBone width={50} height={9} borderRadius={3} />
        </View>
      </View>
    ))}
  </View>
);

// --- Meetings Skeleton ---

export const MeetingsSkeleton: React.FC = () => (
  <View style={skeletonStyles.container}>
    {/* Tab Switcher */}
    <View style={skeletonStyles.tabRow}>
      <SkeletonBone width={'48%'} height={36} borderRadius={10} />
      <SkeletonBone width={'48%'} height={36} borderRadius={10} />
    </View>

    {/* Meeting Cards */}
    {[0, 1, 2].map((i) => (
      <View key={i} style={skeletonStyles.meetingCard}>
        <View style={skeletonStyles.meetingTopRow}>
          <SkeletonBone width={40} height={40} borderRadius={20} />
          <View style={{ flex: 1, gap: 6, marginLeft: 12 }}>
            <SkeletonBone width={'60%'} height={14} borderRadius={4} />
            <SkeletonBone width={'40%'} height={10} borderRadius={3} />
          </View>
        </View>
        <View style={skeletonStyles.meetingInfoRow}>
          <SkeletonBone width={90} height={10} borderRadius={3} />
          <SkeletonBone width={70} height={10} borderRadius={3} />
        </View>
        <SkeletonBone width={'100%'} height={36} borderRadius={8} style={{ marginTop: 10 }} />
      </View>
    ))}
  </View>
);

// --- Earnings Skeleton ---

export const EarningsSkeleton: React.FC = () => (
  <View style={skeletonStyles.container}>
    {/* Balance Card */}
    <View style={skeletonStyles.earningsCard}>
      <SkeletonBone width={160} height={12} borderRadius={4} />
      <SkeletonBone width={100} height={32} borderRadius={6} style={{ marginTop: 8 }} />
      <SkeletonBone width={220} height={10} borderRadius={3} style={{ marginTop: 6 }} />
      <View style={skeletonStyles.earningsRow}>
        <SkeletonBone width={'30%'} height={28} borderRadius={6} />
        <SkeletonBone width={'30%'} height={28} borderRadius={6} />
        <SkeletonBone width={'30%'} height={28} borderRadius={6} />
      </View>
    </View>

    {/* Action Buttons */}
    <SkeletonBone width={'100%'} height={48} borderRadius={12} style={{ marginTop: 12 }} />
    <SkeletonBone width={'100%'} height={48} borderRadius={12} style={{ marginTop: 10 }} />

    {/* Commission Cards */}
    {[0, 1].map((i) => (
      <View key={i} style={skeletonStyles.commissionCard}>
        <SkeletonBone width={120} height={12} borderRadius={4} />
        <SkeletonBone width={80} height={20} borderRadius={4} style={{ marginTop: 6 }} />
        <SkeletonBone width={'90%'} height={10} borderRadius={3} style={{ marginTop: 6 }} />
      </View>
    ))}
  </View>
);

const skeletonStyles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14
  },
  /* Home */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    gap: 4
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heroMetaStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 12
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7'
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    alignItems: 'center'
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    gap: 14
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  /* Leads */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 10
  },
  leadTopRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leadFootRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  /* Meetings */
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  meetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 10
  },
  meetingTopRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  meetingInfoRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10
  },
  /* Earnings */
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EDF2F7'
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },
  commissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginTop: 10
  }
});

