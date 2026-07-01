import { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen({ route, navigation }) {
  const { photoUri } = route.params;
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    try {
      const base64Image = await imageToBase64(photoUri);
      navigation.navigate('Result', { base64Image });
    } catch (error) {
      console.error('Failed to convert photo:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.retakeButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.analyzeButton, loading && styles.disabledButton]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Analyze</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1, resizeMode: 'contain' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  retakeButton: { backgroundColor: '#5A6472', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8 },
  analyzeButton: { backgroundColor: '#5B3FA3', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8 },
  disabledButton: { backgroundColor: '#8A7BBF' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
