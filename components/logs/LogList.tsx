import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { styled } from 'nativewind';
import LogItem from './LogItem';

const StyledView = styled(View);
const StyledText = styled(Text);

const LogList = ({ logs, onViewDetails, ...props }) => {
  return (
    <FlatList
      data={logs}
      renderItem={({ item }) => <LogItem item={item} onPress={() => onViewDetails(item)} />}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <StyledView className="flex-1 items-center justify-center mt-10">
          <StyledText className="text-gray-400 text-lg">No logs found.</StyledText>
        </StyledView>
      }
      {...props}
    />
  );
};

export default LogList;