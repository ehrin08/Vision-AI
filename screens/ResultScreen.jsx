import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { analyzeImage, ANALYSIS_PROMPT } from '../lib/gemini';

export default function ResultScreen({ route }) {
  const { base64Image } = route.params;
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runAnalysis();
  }, [base64Image]);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeImage(base64Image, ANALYSIS_PROMPT);
      let textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textPart) throw new Error('Empty response from Gemini');
      
      // Clean markdown code blocks if any
      textPart = textPart.trim();
      if (textPart.startsWith('```')) {
        const lines = textPart.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].startsWith('```')) lines.pop();
        textPart = lines.join('\n').trim();
      }

      const parsedData = JSON.parse(textPart);
      setAnalysis(parsedData);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Could not analyze this image. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={runAnalysis}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Objects</Text>
      {analysis?.objects && analysis.objects.length > 0 ? (
        analysis.objects.map((obj, i) => (
          <Text key={i} style={styles.listItem}>• {obj}</Text>
        ))
      ) : (
        <Text style={styles.bodyText}>No objects identified.</Text>
      )}

      <Text style={styles.sectionTitle}>Context</Text>
      <Text style={styles.bodyText}>{analysis?.context || 'No context details provided.'}</Text>

      <Text style={styles.sectionTitle}>Activities</Text>
      <Text style={styles.bodyText}>{analysis?.activities || 'No activity details provided.'}</Text>

      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.bodyText}>{analysis?.recommendations || 'No recommendations provided.'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#5A6472', fontSize: 16, fontWeight: '500' },
  errorText: { color: '#B3261E', textAlign: 'center', fontSize: 16, marginBottom: 20 },
  retryButton: {
    backgroundColor: '#5B3FA3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, color: '#1F2A44', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 6 },
  listItem: { fontSize: 15, marginTop: 6, color: '#334155', paddingLeft: 8 },
  bodyText: { fontSize: 15, marginTop: 8, color: '#334155', lineHeight: 22 },
});
