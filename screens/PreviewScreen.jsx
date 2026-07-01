import { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen({ route, navigation }) {
  const { photoUri } = route.params;
  const [loading, setLoading] = useState(false);
  const [loadingPersona, setLoadingPersona] = useState(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  async function handleAnalyze(promptKey) {
    setLoading(true);
    setLoadingPersona(promptKey);
    try {
      const base64Image = await imageToBase64(photoUri);
      navigation.navigate('Result', { base64Image, promptKey });
    } catch (error) {
      console.error('Failed to convert photo:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setLoading(false);
      setLoadingPersona(null);
    }
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: photoUri }} 
        style={[
          styles.preview,
          isTablet && { maxWidth: 600, alignSelf: 'center', width: '100%' }
        ]} 
      />

      <View style={[
        styles.controlPanel,
        isTablet && { maxWidth: 600, width: '100%', alignSelf: 'center', borderRadius: 20, marginBottom: 20 }
      ]}>
        <TouchableOpacity 
          style={styles.retakeButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.retakeButtonText}>← Retake Photo</Text>
        </TouchableOpacity>

        <Text style={styles.pickerTitle}>Analyze Photo With:</Text>

        <View style={styles.personaContainer}>
          <TouchableOpacity
            style={[styles.personaButton, { backgroundColor: '#4F46E5' }, loading && styles.disabledButton]}
            onPress={() => handleAnalyze('academic')}
            disabled={loading}
          >
            {loading && loadingPersona === 'academic' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>🎓 Academic Professor</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.personaButton, { backgroundColor: '#DC2626' }, loading && styles.disabledButton]}
            onPress={() => handleAnalyze('safety')}
            disabled={loading}
          >
            {loading && loadingPersona === 'safety' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>🚨 Safety Inspector</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.personaButton, { backgroundColor: '#059669' }, loading && styles.disabledButton]}
            onPress={() => handleAnalyze('inventory')}
            disabled={loading}
          >
            {loading && loadingPersona === 'inventory' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>📋 Inventory Clerk</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  preview: { flex: 1, resizeMode: 'contain' },
  controlPanel: { backgroundColor: '#1E293B', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  retakeButton: { alignSelf: 'flex-start', marginBottom: 15 },
  retakeButtonText: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  pickerTitle: { color: '#E2E8F0', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  personaContainer: { gap: 10 },
  personaButton: { 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
