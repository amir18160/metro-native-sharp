import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="(user)" options={{ title: 'User Home' }} />
      <Drawer.Screen name="(admin)" options={{ title: 'Admin Dashboard' }} />
    </Drawer>
  );
}
