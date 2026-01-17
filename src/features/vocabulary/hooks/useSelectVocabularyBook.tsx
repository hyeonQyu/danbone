import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { VocabularyBookSelectDialog, VocabularyBookSelectDialogResult } from '@/features/vocabulary/components/VocabularyBookSelectDialog';

export const useSelectVocabularyBook = () => {
  const dialog = useDialog();

  return () =>
    dialog.open<VocabularyBookSelectDialogResult>({
      fullScreen: true,
      slots: {
        transition: SlideUpTransition,
      },
      content: (close) => <VocabularyBookSelectDialog onClose={close} />,
    });
};
