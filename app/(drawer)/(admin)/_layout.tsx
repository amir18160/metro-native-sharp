import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useUserStore } from '~/stores/userUserStore';
import { Roles } from '~/types/common/roles';

const AdminLayout = () => {
  const user = useUserStore((state) => state.user);

  const isAdmin = user?.role === Roles.Admin || user?.role === Roles.Owner;

  if (!isAdmin) {
    return <Redirect href="/(drawer)/(user)/Home" />;
  }

  return (
    <Stack>
      <Stack.Screen name="logs" options={{ title: 'Application Logs' }} />
    </Stack>
  );
};

export default AdminLayout;
