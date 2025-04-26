
import { InstagramIcon } from '../icons/InstagramIcon';
import { SocialButton } from './SocialButton';

interface InstagramButtonProps {
  url?: string;
}

export const InstagramButton = ({ url }: InstagramButtonProps) => (
  <SocialButton
    url={url}
    color="[#833AB4]"
    hoverColor="[#833AB4]"
    shadowColor="[#833AB4]"
    gradientColors={["[#833AB4]", "[#FD1D1D]", "[#F77737]"]}
  >
    <InstagramIcon className="h-6 w-6 animate-bounce-small" />
  </SocialButton>
);
