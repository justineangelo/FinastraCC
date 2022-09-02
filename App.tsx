import { SafeAreaProvider } from "react-native-safe-area-context";
import Root from "navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
}
