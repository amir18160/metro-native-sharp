import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title?: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      className="rounded-xl bg-primary py-3 shadow-sm shadow-black/10 dark:shadow-none">
      <Text className="text-center font-medium text-white dark:text-black">{title}</Text>
    </TouchableOpacity>
  );
});
