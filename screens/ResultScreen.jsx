import { View, Text, StyleSheet } from 'react-native';

export default function ResultScreen({ route }) {
  // Stub for Phase 3, will be fully implemented in Phase 5
  const photoUri = route.params?.photoUri || 'No photo';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Result Screen Placeholder</Text>
      <Text style={styles.subtext}>Photo URI: {photoUri}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  text: { fontSize: 18, fontWeight: 'bold' },
  subtext: { fontSize: 14, color: '#666', marginTop: 10 },
});
