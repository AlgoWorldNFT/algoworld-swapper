import { useWallet } from '@txnlab/use-wallet';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { useAppDispatch } from '@/redux/store/hooks';
import { MainButton } from '@vkruglikov/react-telegram-web-app';
import { useRouter } from 'next/router';

const TelegramFooter = () => {
  const dispatch = useAppDispatch();
  const { activeAddress } = useWallet();
  const router = useRouter();

  return activeAddress ? (
    <MainButton
      text="Connect wallet"
      onClick={() => {
        dispatch(setIsWalletPopupOpen(true));
      }}
    />
  ) : (
    <MainButton
      text="My Swaps"
      onClick={() => {
        if (router.pathname !== `/swaps/my-swaps`) {
          router.push(`/swaps/my-swaps`);
        }
      }}
    />
  );
};

export default TelegramFooter;
