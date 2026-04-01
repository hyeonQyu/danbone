'use client';

import { PageViewContainer } from '@/components/PageViewContainer';
import { StepForm } from '@/components/StepForm';
import { checkEmailExists, registerUser } from '@/features/users';
import { SignupForm } from '@/features/users/components/SignupView/signup.types';
import { getEmailValidateRule, getMinLengthRule, getReactHookFormComponents } from '@/react-hook-form';
import { useTypedRouter } from '@/routes';
import { enqueueClosableSnackbar } from '@/styles';
import { useForm } from 'react-hook-form';

function SignupView() {
  const methods = useForm<SignupForm>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    mode: 'onTouched',
  });

  const { TextField, PasswordField } = getReactHookFormComponents<SignupForm>();

  const router = useTypedRouter();

  const handleSubmit = async (data: SignupForm) => {
    try {
      await registerUser(data);

      enqueueClosableSnackbar({
        message: '회원가입이 완료되었습니다.',
        variant: 'success',
      });

      router.push('/login', {
        searchParams: {
          email: data.email,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        enqueueClosableSnackbar({
          message: e.message,
          variant: 'error',
        });
      } else {
        enqueueClosableSnackbar({
          message: '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.',
          variant: 'error',
        });
      }
    }
  };

  const handleEmailCheck = async () => {
    const email = methods.getValues('email');

    if (!email) return true;

    const exists = await checkEmailExists(email);

    if (exists) {
      methods.setError('email', {
        type: 'duplicate',
        message: '이미 사용 중인 이메일입니다.',
      });
      return false;
    }

    return true;
  };

  return (
    <PageViewContainer
      sx={{
        justifyContent: 'flex-start',
        paddingTop: 12,
      }}
    >
      <StepForm methods={methods} onSubmit={handleSubmit}>
        <StepForm.Step description="이메일을 입력해주세요" onValidate={handleEmailCheck}>
          <TextField formName="email" label="이메일" type="email" required fullWidth autoFocus rules={getEmailValidateRule()} />
        </StepForm.Step>

        <StepForm.Step description="비밀번호를 설정해주세요">
          <PasswordField formName="password" label="비밀번호" required fullWidth autoFocus rules={getMinLengthRule(8)} />
        </StepForm.Step>

        <StepForm.Step description="이름을 알려주세요">
          <TextField formName="name" label="이름" required fullWidth autoFocus />
        </StepForm.Step>
      </StepForm>
    </PageViewContainer>
  );
}

export default SignupView;
