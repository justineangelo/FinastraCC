import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "screens/home";

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "User Courses" }}
      />
    </Stack.Navigator>
  );
};
