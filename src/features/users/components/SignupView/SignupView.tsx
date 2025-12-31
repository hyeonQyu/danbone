'use client';

import { PageViewContainer } from '@/components/PageViewContainer';
import { StepForm } from '@/components/StepForm';
import { checkEmailExists, CreateUserData } from '@/features/users';
import { getEmailValidateRule, getMinLengthRule, getReactHookFormComponents } from '@/react-hook-form';
import { useForm } from 'react-hook-form';

function SignupView() {
  const methods = useForm<CreateUserData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    mode: 'onTouched',
  });

  const { TextField, PasswordField } = getReactHookFormComponents<CreateUserData>();

  const handleSubmit = (data: CreateUserData) => {
    // TODO: 회원가입 로직 구현
    console.log('회원가입 데이터:', data);
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
