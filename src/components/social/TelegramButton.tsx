
import React from 'react';
import { TelegramIcon } from '@/components/icons/TelegramIcon';
import { SocialButton } from './SocialButton';

interface TelegramButtonProps {
  url: string;
}

export const TelegramButton = ({ url }: TelegramButtonProps) => {
  return (
    <SocialButton
      url={url}
      icon={<TelegramIcon className="h-5 w-5 text-blue-500" />}
      title="Telegram"
      bgColor="white"
      hoverColor="blue-50"
    />
  );
};
