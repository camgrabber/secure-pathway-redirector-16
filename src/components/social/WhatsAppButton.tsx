
import React from 'react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { SocialButton } from './SocialButton';

interface WhatsAppButtonProps {
  url: string;
}

export const WhatsAppButton = ({ url }: WhatsAppButtonProps) => {
  return (
    <SocialButton
      url={url}
      icon={<WhatsappIcon className="h-5 w-5 text-green-500" />}
      title="WhatsApp"
      bgColor="white"
      hoverColor="green-50"
    />
  );
};
