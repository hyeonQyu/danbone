import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { VocabularyBookAddDialogResult, VocabularyBookCreateDialog } from '@/features/vocabulary/components/VocabularyBookCreateDialog';
import { useTargetLanguage } from '@/language';

export const useCreateVocabularyBook = () => {
  const targetLanguage = useTargetLanguage();
  const dialog = useDialog();

  return () =>
    dialog.open<VocabularyBookAddDialogResult>({
      fullScreen: true,
      slots: {
        transition: SlideUpTransition,
      },
      content: (close) => <VocabularyBookCreateDialog targetLanguage={targetLanguage} onClose={close} />,
    });
};
