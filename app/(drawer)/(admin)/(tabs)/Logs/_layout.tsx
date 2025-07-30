import { Stack } from 'expo-router';

export default function LogsStackLayout() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={INDEX_OPTIONS} />
    </Stack>
  );
}

const INDEX_OPTIONS = {
  headerLargeTitle: true,
  title: 'NativeWindUI',
} as const;

const SCREEN_OPTIONS = {
  animation: 'ios_from_right',
} as const;
