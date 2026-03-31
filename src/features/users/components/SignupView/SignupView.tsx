'use client';

import { PageViewContainer } from '@/components/PageViewContainer';
import { StepByStepForm } from '@/components/StepByStepForm';
import { CreateUserData } from '@/features/users';
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

  return (
    <PageViewContainer
      sx={{
        justifyContent: 'flex-start',
        paddingTop: 12,
      }}
    >
      <StepByStepForm methods={methods} onSubmit={handleSubmit}>
        <StepByStepForm.Step description="이메일을 입력해주세요">
          <TextField formName="email" label="이메일" type="email" required fullWidth autoFocus rules={getEmailValidateRule()} />
        </StepByStepForm.Step>

        <StepByStepForm.Step description="비밀번호를 설정해주세요">
          <PasswordField formName="password" label="비밀번호" required fullWidth autoFocus rules={getMinLengthRule(8)} />
        </StepByStepForm.Step>

        <StepByStepForm.Step description="이름을 알려주세요">
          <TextField formName="name" label="이름" required fullWidth autoFocus />
        </StepByStepForm.Step>
      </StepByStepForm>
    </PageViewContainer>
  );
}

export default SignupView;
