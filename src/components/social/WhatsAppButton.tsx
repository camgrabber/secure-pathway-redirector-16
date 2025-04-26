
import { WhatsappIcon } from '../icons/WhatsappIcon';
import { SocialButton } from './SocialButton';

interface WhatsAppButtonProps {
  url?: string;
}

export const WhatsAppButton = ({ url }: WhatsAppButtonProps) => (
  <SocialButton
    url={url}
    color="[#25D366]"
    hoverColor="[#128C7E]"
    shadowColor="[#25D366]"
  >
    <WhatsappIcon className="h-6 w-6 animate-bounce-small" />
  </SocialButton>
);
