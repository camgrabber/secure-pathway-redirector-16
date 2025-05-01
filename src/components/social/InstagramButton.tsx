
import React from 'react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { SocialButton } from './SocialButton';

interface InstagramButtonProps {
  url: string;
}

export const InstagramButton = ({ url }: InstagramButtonProps) => {
  return (
    <SocialButton
      url={url}
      icon={<InstagramIcon className="h-5 w-5 text-pink-600" />}
      title="Instagram"
      bgColor="white"
      hoverColor="pink-50"
    />
  );
};
