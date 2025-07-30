import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useUserStore } from '~/stores/userUserStore';
import { Roles } from '~/types/common/roles';

const AdminLayout = () => {
  const user = useUserStore((state) => state.user);

  const isAdmin = user?.role === Roles.Admin || user?.role === Roles.Owner;

  if (!isAdmin) {
    return <Redirect href="/(drawer)/(user)/Home" />;
  }

  return (
    <>
      <Tabs>
        <Tabs.Screen name="(tabs)/Logs" options={{ title: 'Application Logs' }} />
        <Tabs.Screen name="(tabs)/Tasks" options={{ title: 'Tasks Logs' }} />
        <Tabs.Screen name="(tabs)/Dashboard" options={{ title: 'Dashboard Logs' }} />
      </Tabs>
    </>
  );
};

export default AdminLayout;
