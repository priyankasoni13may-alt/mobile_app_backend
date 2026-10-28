import React, { useState, useRef } from 'react';
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
import { useRouter } from 'expo-router';
import { Briefcase, Calendar, Globe, Linkedin, ArrowRight } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

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
  const token = useAuthStore((s) => s.token);

  const titleRef = useRef<TextInput>(null);
  const experienceRef = useRef<TextInput>(null);
  const profileUrlRef = useRef<TextInput>(null);

  const [title, setTitle] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);

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
    const finalExp = yearsExperience.trim();
    const finalUrl = profileUrl.trim();

    setLoading(true);
    try {
      await apiClient.updateProfile({
        title: finalTitle,
        yearsExperience: Number(finalExp) || 0,
        industries: selectedIndustries,
        languages: ['English', 'Hindi'],
        timezone,
        profileUrl: finalUrl
      });
      router.push('/s07-verification');
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('token') || err.message?.toLowerCase().includes('unauthorized')) {
        Alert.alert(
          'Sign In Required',
          'Your session has expired. Please sign in to save your profile.',
          [
            { text: 'Sign In', onPress: () => router.push('/s03-login') }
          ]
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
      <View style={styles.header}>
        <Text style={styles.title}>Partner Profile Setup</Text>
        <Text style={styles.subtitle}>Help Lumora & Cypher Swift match you with high-value enterprise leads</Text>
      </View>

      <View style={styles.form}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Professional Title / Designation</Text>
          <View style={styles.inputBox}>
            <Briefcase size={16} color="#64748B" />
            <TextInput
              ref={titleRef}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter your professional title or designation"
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
              placeholder="Enter years of experience"
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
          <Text style={styles.label}>Core Industry Focus (Select all that apply)</Text>
          <View style={styles.chipGrid}>
            {AVAILABLE_INDUSTRIES.map((ind) => {
              const isSelected = selectedIndustries.includes(ind);
              return (
                <TouchableOpacity
                  key={ind}
                  onPress={() => toggleIndustry(ind)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {ind}
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
              placeholder="Enter LinkedIn profile URL"
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

        <View style={{ marginTop: 12 }}>
          <LumoraButton
            title="Save Profile & Continue"
            onPress={handleSave}
            loading={loading}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
            size="lg"
          />
        </View>
      </View>

      <PoweredByFooter style={{ marginTop: 30, marginBottom: 10 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 60 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#0B0F26' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 20 },
  form: { gap: 18 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
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
    paddingHorizontal: 0
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  chipActive: { backgroundColor: '#4F75FF', borderColor: '#4F75FF' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  chipTextActive: { color: '#FFFFFF' }
});
