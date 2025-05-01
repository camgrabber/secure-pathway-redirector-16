
import React from 'react';
import { TwitterIcon } from '@/components/icons/TwitterIcon';
import { SocialButton } from './SocialButton';

interface TwitterButtonProps {
  url: string;
}

export const TwitterButton = ({ url }: TwitterButtonProps) => {
  return (
    <SocialButton
      url={url}
      icon={<TwitterIcon className="h-5 w-5 text-blue-400" />}
      title="Twitter"
      bgColor="white"
      hoverColor="blue-50"
    />
  );
};
