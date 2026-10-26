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
            <Briefcase size={16} color="#94A3B8" />
            <TextInput
              ref={titleRef}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. B2B Technology Consultant"
              placeholderTextColor="#64748B"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#5B8EE2"
              selectionColor="#5B8EE2"
              returnKeyType="next"
              onSubmitEditing={() => experienceRef.current?.focus()}
            />
          </View>
        </View>

        {/* Experience */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Years of B2B Sales / BD Experience</Text>
          <View style={styles.inputBox}>
            <Calendar size={16} color="#94A3B8" />
            <TextInput
              ref={experienceRef}
              value={yearsExperience}
              onChangeText={setYearsExperience}
              placeholder="e.g. 5"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#5B8EE2"
              selectionColor="#5B8EE2"
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
            <Linkedin size={16} color="#94A3B8" />
            <TextInput
              ref={profileUrlRef}
              value={profileUrl}
              onChangeText={setProfileUrl}
              placeholder="https://linkedin.com/in/username"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
              style={styles.input}
              underlineColorAndroid="transparent"
              cursorColor="#5B8EE2"
              selectionColor="#5B8EE2"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={loading}
          style={styles.submitBtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Save Profile & Continue</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 20, paddingBottom: 60 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 4, lineHeight: 18 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#CBD5E1' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1026',
    borderWidth: 1,
    borderColor: '#1E294B',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 52
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 0
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0B1026',
    borderWidth: 1,
    borderColor: '#1E294B'
  },
  chipActive: { backgroundColor: '#5B8EE2', borderColor: '#5B8EE2' },
  chipText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  chipTextActive: { color: '#FFFFFF' },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#5B8EE2',
    borderRadius: 10,
    height: 48,
    marginTop: 12
  },
  submitBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }
});
