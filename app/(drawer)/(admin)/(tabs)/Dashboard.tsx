import { ScrollView, View } from 'react-native';

import DashboardActions from '~/components/Dashboard/DashboardActions';
import Stats from '~/components/Dashboard/Stats';
import SystemInfoDisplay from '~/components/Dashboard/SystemResources';

export default function Dashboard() {
    return (
        <ScrollView className="flex-1">
            <View className="pb-20">
                <DashboardActions />
                <SystemInfoDisplay />
                <Stats />
            </View>
        </ScrollView>
    );
}
