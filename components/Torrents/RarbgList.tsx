import { View, FlatList } from 'react-native';
import { Error } from '../Error/Error';
import { Loading } from '../Loading/Loading';
import { NoData } from '../NoData/NoData';
import { Text } from '../nativewindui/Text';

export default function RarbgList() {
    const rarbgList = useRarbgList();

    if (rarbgList.isError) {
        return <Error message={'Something went wrong'} />;
    }

    if (rarbgList.isLoading) {
        return <Loading />;
    }

    if (!rarbgList.data?.data || rarbgList.data?.data.length === 0) {
        return <NoData />;
    }

    return (
        <View>
            <Text>Latest Torrents</Text>
            <FlatList
                data={rarbgList.data?.data}
                renderItem={({ item }) => <Text>{item.title}</Text>}
                horizontal
            />
        </View>
    );
}
