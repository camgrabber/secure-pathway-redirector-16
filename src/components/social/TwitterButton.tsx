
import { TwitterIcon } from '../icons/TwitterIcon';
import { SocialButton } from './SocialButton';

interface TwitterButtonProps {
  url?: string;
}

export const TwitterButton = ({ url }: TwitterButtonProps) => (
  <SocialButton
    url={url}
    color="black"
    hoverColor="black/90"
    shadowColor="black"
  >
    <TwitterIcon className="h-6 w-6 animate-bounce-small" />
  </SocialButton>
);
