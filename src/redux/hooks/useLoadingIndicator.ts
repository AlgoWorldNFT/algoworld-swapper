import { setLoadingIndicator } from '../slices/applicationSlice';
import { useAppDispatch } from '../store/hooks';

export default function useLoadingIndicator() {
  const dispatch = useAppDispatch();

  const setLoading = (message: string) => {
    dispatch(setLoadingIndicator({ isLoading: true, message: message }));
  };

  const resetLoading = () => {
    dispatch(setLoadingIndicator({ isLoading: false, message: undefined }));
  };

  return { setLoading, resetLoading };
}
