import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import CameraScreen from './screens/CameraScreen';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <CameraScreen />
      <StatusBar style="auto" />
    </View>
  );
}
