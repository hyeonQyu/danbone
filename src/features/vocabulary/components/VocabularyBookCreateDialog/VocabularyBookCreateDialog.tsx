import { FullScreenDialogToolbar } from '@/components/FullScreenDialogToolbar';
import { createVocabularyBook } from '@/features/vocabulary/actions/vocabularyBook.actions';
import { VOCABULARY_BOOK_COLORS } from '@/features/vocabulary/vocabulary.constants';
import { VocabularyBookEntity } from '@/features/vocabulary/vocabulary.types';
import { getLanguageLabel, TargetLanguage } from '@/language';
import { devLogError, serverAction } from '@/lib';
import { getMaxLengthRule, getReactHookFormComponents, getRequiredErrorMessage } from '@/react-hook-form';
import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface VocabularyBookFormData {
  name: string;
  color: string;
}

const LIMITS = {
  name: {
    max: 20,
  },
};

export type VocabularyBookAddDialogResult = { book: VocabularyBookEntity };

interface VocabularyBookAddDialogProps {
  targetLanguage: TargetLanguage;
  onClose: (result?: VocabularyBookAddDialogResult) => void;
}

function VocabularyBookAddDialog({ targetLanguage, onClose }: VocabularyBookAddDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<VocabularyBookFormData>({
    defaultValues: {
      name: '',
      color: VOCABULARY_BOOK_COLORS[0],
    },
    mode: 'onTouched',
  });

  const { TextField, ColorSelector } = getReactHookFormComponents<VocabularyBookFormData>();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = handleSubmit(
    async (data) => {
      try {
        setError(null);
        const book = await serverAction(createVocabularyBook)(targetLanguage, data.name, data.color);
        onClose({ book });
      } catch (e) {
        setError(e instanceof Error ? e.message : '단어장 생성에 실패했습니다.');
      }
    },
    (errors) => {
      devLogError('VocabularyBookAddDialog form errors', errors);
    },
  );

  return (
    <>
      <FullScreenDialogToolbar title="새 단어장 만들기" onClose={() => onClose()} disabled={isSubmitting} />

      <Container maxWidth="sm" sx={{ pt: 4, pb: 4, overflow: 'auto' }}>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" color="text.secondary">
              {getLanguageLabel(targetLanguage)} 단어장
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2">색상 선택</Typography>
              <ColorSelector formName="color" colors={VOCABULARY_BOOK_COLORS} />
            </Box>

            <TextField
              formName="name"
              label="단어장 이름"
              required
              rules={{
                required: getRequiredErrorMessage(),
                ...getMaxLengthRule(LIMITS.name.max),
              }}
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2, mb: 2 }}
            />

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" loading={isSubmitting} fullWidth>
              단어장 생성
            </Button>
          </Box>
        </FormProvider>
      </Container>
    </>
  );
}

export default VocabularyBookAddDialog;
