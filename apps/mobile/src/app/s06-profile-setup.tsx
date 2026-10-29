import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Briefcase, Calendar, Globe, Linkedin, ArrowRight, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { LumoraButton } from '../components/LumoraButton';

const AVAILABLE_INDUSTRIES = [
  'SaaS & Cloud',
  'Manufacturing',
  'FinTech',
  'Healthcare',
  'E-Commerce & D2C',
  'Logistics',
  'Retail'
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token, profile: storeProfile, updateProfile: updateStoreProfile, user } = useAuthStore();

  const isEditMode = params.edit === 'true' || Boolean(storeProfile?.title);

  const titleRef = useRef<TextInput>(null);
  const experienceRef = useRef<TextInput>(null);
  const profileUrlRef = useRef<TextInput>(null);

  const [title, setTitle] = useState(storeProfile?.title || '');
  const [yearsExperience, setYearsExperience] = useState(
    storeProfile?.yearsExperience !== undefined && storeProfile?.yearsExperience !== null
      ? String(storeProfile.yearsExperience)
      : ''
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    Array.isArray(storeProfile?.industries) ? storeProfile.industries : []
  );
  const [timezone, setTimezone] = useState(storeProfile?.timezone || 'Asia/Kolkata');
  const [profileUrl, setProfileUrl] = useState(storeProfile?.profileUrl || '');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Fetch latest saved profile from API on mount to guarantee fresh data
  useEffect(() => {
    let isMounted = true;

    // Immediately pre-fill from Zustand if fields are still empty
    const currentCached = useAuthStore.getState().profile;
    if (currentCached) {
      if (currentCached.title && !title) setTitle(currentCached.title);
      if (currentCached.yearsExperience !== undefined && currentCached.yearsExperience !== null && !yearsExperience) {
        setYearsExperience(String(currentCached.yearsExperience));
      }
      if (Array.isArray(currentCached.industries) && currentCached.industries.length > 0 && selectedIndustries.length === 0) {
        setSelectedIndustries(currentCached.industries);
      }
      if (currentCached.profileUrl && !profileUrl) setProfileUrl(currentCached.profileUrl);
      if (currentCached.timezone) setTimezone(currentCached.timezone);
    }

    if (token) {
      setInitialLoading(true);
      apiClient
        .me()
        .then((res) => {
          if (!isMounted) return;
          if (res.data?.profile) {
            const p = res.data.profile;
            if (p.title) setTitle(p.title);
            if (p.yearsExperience !== undefined && p.yearsExperience !== null) {
              setYearsExperience(String(p.yearsExperience));
            }
            if (Array.isArray(p.industries) && p.industries.length > 0) {
              setSelectedIndustries(p.industries);
            }
            if (p.profileUrl) setProfileUrl(p.profileUrl);
            if (p.timezone) setTimezone(p.timezone);

            updateStoreProfile(p);
          }
        })
        .catch((err) => {
          console.log('Failed to fetch profile on setup screen:', err);
        })
        .finally(() => {
          if (isMounted) setInitialLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const toggleIndustry = (ind: string) => {
    if (selectedIndustries.includes(ind)) {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== ind));
    } else {
      setSelectedIndustries([...selectedIndustries, ind]);
    }
  };

  const handleSave = async () => {
    if (!token) {
      Alert.alert(
        'Sign In Required',
        'Please sign in with your registered phone/email and password to save your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In Now', onPress: () => router.push('/s03-login') }
        ]
      );
      return;
    }

    const finalTitle = title.trim();
    if (!finalTitle) {
      Alert.alert('Designation Required', 'Please enter your professional title or designation (e.g., BD Manager, Consultant, Director).');
      return;
    }

    const finalExp = yearsExperience.trim();
    const finalUrl = profileUrl.trim();

    setLoading(true);
    try {
      const parsedExp = parseInt(finalExp, 10);
      const res = await apiClient.updateProfile({
        title: finalTitle,
        yearsExperience: isNaN(parsedExp) ? 0 : parsedExp,
        industries: selectedIndustries,
        languages: ['English', 'Hindi'],
        timezone,
        profileUrl: finalUrl
      });

      // Update Zustand auth store so all tabs instantly reflect updated profile
      const savedProfile = res.data || {
        title: finalTitle,
        yearsExperience: isNaN(parsedExp) ? 0 : parsedExp,
        industries: selectedIndustries,
        languages: ['English', 'Hindi'],
        timezone,
        profileUrl: finalUrl
      };
      updateStoreProfile(savedProfile as any);

      Alert.alert(
        'Profile Saved! ✅',
        'Your partner profile details have been saved successfully.',
        [
          {
            text: isEditMode ? 'View Profile' : 'Continue',
            onPress: () => {
              if (isEditMode || params.edit === 'true') {
                router.replace('/(tabs)/profile');
              } else {
                router.push('/s07-verification');
              }
            }
          }
        ]
      );
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('token') || err.message?.toLowerCase().includes('unauthorized')) {
        Alert.alert(
          'Sign In Required',
          'Your session has expired. Please sign in to save your profile.',
          [{ text: 'Sign In', onPress: () => router.push('/s03-login') }]
        );
      } else {
        Alert.alert('Notice', err.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Navigation Back Row (if editing) */}
      {isEditMode && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace('/(tabs)/profile')}
          style={styles.backRow}
        >
          <ChevronLeft size={18} color="#4F75FF" />
          <Text style={styles.backText}>Back to Profile</Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <View style={styles.headerPillRow}>
          <View style={styles.headerPill}>
            <Sparkles size={11} color="#4F75FF" />
            <Text style={styles.headerPillText}>
              {isEditMode ? 'EDITING SAVED PROFILE' : 'PARTNER ONBOARDING'}
            </Text>
          </View>
          {initialLoading && (
            <View style={styles.syncingPill}>
              <ActivityIndicator size="small" color="#059669" />
              <Text style={styles.syncingText}>Loading details...</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>
          {isEditMode ? 'Edit Partner Profile' : 'Partner Profile Setup'}
        </Text>
        <Text style={styles.subtitle}>
          {isEditMode
            ? 'Update your professional title, experience, and industry focus. Changes are saved directly to your partner record.'
            : 'Help Lumora & Cypher Swift match you with high-value enterprise leads.'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Professional Title / Designation <Text style={{ color: '#EF4444' }}>*</Text>
          </Text>
          <View style={styles.inputBox}>
            <Briefcase size={16} color="#64748B" />
            <TextInput
              ref={titleRef}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Developer, BD Manager, Enterprise Director"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
              returnKeyType="next"
              onSubmitEditing={() => experienceRef.current?.focus()}
            />
          </View>
        </View>

        {/* Experience */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Years of B2B Sales / BD Experience</Text>
          <View style={styles.inputBox}>
            <Calendar size={16} color="#64748B" />
            <TextInput
              ref={experienceRef}
              value={yearsExperience}
              onChangeText={setYearsExperience}
              placeholder="e.g., 1, 3, 5"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
              returnKeyType="next"
              onSubmitEditing={() => profileUrlRef.current?.focus()}
            />
          </View>
        </View>

        {/* Industry Chips */}
        <View style={styles.inputGroup}>
          <View style={styles.industryHeaderRow}>
            <Text style={styles.label}>Core Industry Focus (Select all that apply)</Text>
            {selectedIndustries.length > 0 && (
              <Text style={styles.selectedCountText}>
                {selectedIndustries.length} selected
              </Text>
            )}
          </View>
          <View style={styles.chipGrid}>
            {AVAILABLE_INDUSTRIES.map((ind) => {
              const isSelected = selectedIndustries.includes(ind);
              return (
                <TouchableOpacity
                  key={ind}
                  activeOpacity={0.8}
                  onPress={() => toggleIndustry(ind)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {isSelected ? `✓ ${ind}` : ind}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Profile URL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>LinkedIn Profile URL (Optional)</Text>
          <View style={styles.inputBox}>
            <Linkedin size={16} color="#64748B" />
            <TextInput
              ref={profileUrlRef}
              value={profileUrl}
              onChangeText={setProfileUrl}
              placeholder="e.g., https://linkedin.com/in/sagar"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
        </View>

        {/* Action Button */}
        <View style={{ marginTop: 12 }}>
          <LumoraButton
            title={isEditMode ? 'Save & Update Profile' : 'Save Profile & Continue'}
            onPress={handleSave}
            loading={loading}
            icon={isEditMode ? <CheckCircle2 size={16} color="#FFFFFF" /> : <ArrowRight size={16} color="#FFFFFF" />}
            size="lg"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 60 },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F75FF'
  },
  header: { marginBottom: 20, gap: 6 },
  headerPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  headerPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.5
  },
  syncingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20
  },
  syncingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669'
  },
  title: { fontSize: 24, fontWeight: '900', color: '#0B0F26', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  form: { gap: 18 },
  inputGroup: { gap: 6 },
  industryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectedCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F75FF'
  },
  label: { fontSize: 12, fontWeight: '700', color: '#334155' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 52
  },
  input: {
    flex: 1,
    color: '#0B0F26',
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontWeight: '600'
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0'
  },
  chipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F75FF'
  },
  chipText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  chipTextActive: { color: '#4F75FF', fontWeight: '800' }
});
