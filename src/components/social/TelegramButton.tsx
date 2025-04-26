
import { TelegramIcon } from '../icons/TelegramIcon';
import { SocialButton } from './SocialButton';

interface TelegramButtonProps {
  url?: string;
}

export const TelegramButton = ({ url }: TelegramButtonProps) => (
  <SocialButton
    url={url}
    color="[#0088cc]"
    hoverColor="[#0088cc]/90"
    shadowColor="[#0088cc]"
  >
    <TelegramIcon className="h-6 w-6 animate-bounce-small" />
  </SocialButton>
);
