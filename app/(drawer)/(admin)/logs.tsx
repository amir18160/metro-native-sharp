import React, { useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

import { useLogs } from '~/hooks/services/logs/useGetLogsList';
import LogList from '~/components/logs/LogList';
import LogFilters from '~/components/logs/LogFilters';
import LogDetailsModal from '~/components/logs/LogDetailsModal';

const LogsScreen = () => {
  const [filters, setFilters] = useState({ title: '', level: '' });
  const [selectedLog, setSelectedLog] = useState(null);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLogs(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
  };

  const closeModal = () => {
    setSelectedLog(null);
  };

  if (isLoading && !data) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-lg text-red-500">Error fetching logs: {error.message}</Text>
      </View>
    );
  }

  const allLogs = data?.pages.flatMap((page: { items: any }) => page.items) ?? [];

  return (
    <View className="flex-1 bg-gray-900">
      <LogFilters onFilter={handleFilterChange} />
      <LogList
        logs={allLogs}
        onViewDetails={handleViewDetails}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator size="small" color="#007bff" /> : null
        }
      />
      {selectedLog && (
        <LogDetailsModal visible={!!selectedLog} log={selectedLog} onClose={closeModal} />
      )}
    </View>
  );
};

export default LogsScreen;
