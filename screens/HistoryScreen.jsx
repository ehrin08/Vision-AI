import { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HistoryScreen() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    try {
      const isConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here';
      if (!isConfigured) {
        setRows([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('analysis_history')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRows(data ?? []);
    } catch (err) {
      console.warn('Failed to load history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    loadHistory();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  const isConfigured = process.env.EXPO_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here';

  if (!isConfigured) {
    return (
      <View style={styles.centered}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningTitle}>Supabase Not Configured</Text>
        <Text style={styles.warningText}>
          Please add your real Supabase credentials to the .env file to enable analysis history tracking.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rows}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No saved analyses yet.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>
              {new Date(item.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          
          <Text style={styles.label}>Objects Found:</Text>
          <Text style={styles.objectsText}>{item.objects || 'None'}</Text>
          
          <Text style={styles.label}>Context:</Text>
          <Text style={styles.bodyText}>{item.context}</Text>
          
          {item.recommendations ? (
            <>
              <Text style={styles.label}>Recommendation:</Text>
              <Text style={styles.recommendationText}>{item.recommendations}</Text>
            </>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: '#5A6472', fontSize: 16 },
  emptyText: { color: '#64748B', fontSize: 16, textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 12,
  },
  cardDate: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  label: { fontSize: 12, fontWeight: '700', color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  objectsText: { fontSize: 15, color: '#475569', fontWeight: '600', marginTop: 2 },
  bodyText: { fontSize: 14, color: '#475569', marginTop: 2, lineHeight: 20 },
  recommendationText: { fontSize: 14, color: '#4F46E5', fontWeight: '500', marginTop: 2, lineHeight: 20 },
  warningIcon: { fontSize: 40, marginBottom: 16 },
  warningTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  warningText: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20 },
});
