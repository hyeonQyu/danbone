import { createVocabularyBook } from '@/features/vocabulary/actions/vocabularyBook.actions';
import { VOCABULARY_BOOK_COLORS } from '@/features/vocabulary/vocabulary.constants';
import { TargetLanguage } from '@/language';
import { serverAction } from '@/lib';
import { getMaxLengthRule, getRequiredErrorMessage } from '@/react-hook-form';
import { ReactHookFormColorSelector, ReactHookFormTextField } from '@/react-hook-form/components';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface VocabularyBookFormData {
  name: string;
  color: string;
}

const LIMITS = {
  name: {
    max: 50,
  },
};

interface VocabularyBookAddDialogProps {
  targetLanguage: TargetLanguage;
  onClose: (result?: { created: boolean }) => void;
}

function VocabularyBookAddDialog({ targetLanguage, onClose }: VocabularyBookAddDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<VocabularyBookFormData>({
    defaultValues: {
      name: '',
      color: VOCABULARY_BOOK_COLORS[0],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: VocabularyBookFormData) => {
    try {
      setError(null);
      await serverAction(createVocabularyBook)(targetLanguage, data.name, data.color);
      onClose({ created: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '단어장 생성에 실패했습니다.');
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => onClose()} aria-label="닫기" disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
            새 단어장 만들기
          </Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container maxWidth="sm" sx={{ mt: 4, pb: 4 }}>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {targetLanguage === 'ja' ? '일본어' : targetLanguage} 단어장
            </Typography>

            <ReactHookFormTextField
              formName="name"
              label="단어장 이름"
              required
              rules={{
                required: getRequiredErrorMessage(),
                ...getMaxLengthRule(LIMITS.name.max),
              }}
              fullWidth
              autoFocus
              disabled={isSubmitting}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                색상 선택
              </Typography>
              <ReactHookFormColorSelector formName="color" colors={VOCABULARY_BOOK_COLORS} />
            </Box>

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
              {isSubmitting ? '생성 중...' : '단어장 생성'}
            </Button>
          </Box>
        </FormProvider>
      </Container>
    </>
  );
}

export default VocabularyBookAddDialog;
