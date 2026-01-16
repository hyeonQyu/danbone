'use client';

import { useDialog } from '@/dialog';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface UserFormDialogProps {
  onClose: (result?: { name: string; age: string } | null) => void;
}

function UserFormDialog({ onClose }: UserFormDialogProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="이름" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="나이" type="number" value={age} onChange={(e) => setAge(e.target.value)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>취소</Button>
        <Button onClick={() => onClose({ name, age })} variant="contained" disabled={!name || !age}>
          제출
        </Button>
      </DialogActions>
    </>
  );
}

export default function DialogPlaygroundPage() {
  const dialog = useDialog();
  const [result, setResult] = useState<string>('');

  const handleAlert = async () => {
    await dialog.alert({
      title: '알림',
      content: '이것은 간단한 알림 메시지입니다.',
    });
    setResult('Alert 확인됨');
  };

  const handleConfirm = async () => {
    const confirmed = await dialog.confirm({
      title: '확인',
      content: '정말로 이 작업을 수행하시겠습니까?',
    });
    setResult(confirmed ? 'Confirm: 확인' : 'Confirm: 취소');
  };

  const handleCustomDialog = async () => {
    const result = await dialog.open<{ name: string; age: string } | null>({
      title: '사용자 정보 입력',
      maxWidth: 'sm',
      fullWidth: true,
      content: (close) => <UserFormDialog onClose={close} />,
    });

    if (result) {
      setResult(`Custom: 이름=${result.name}, 나이=${result.age}`);
    } else {
      setResult('Custom: 취소됨');
    }
  };

  const handleFullScreenDialog = async () => {
    const action = await dialog.open<'save' | 'discard' | null>({
      fullScreen: true,
      // disableBackdropClick은 fullScreen이면 자동으로 true
      disableEscapeKeyDown: false,
      content: (close) => (
        <>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => close('discard')} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Sound Settings
              </Typography>
              <Button autoFocus color="inherit" onClick={() => close('save')}>
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItemButton onClick={() => close('save')}>
              <ListItemText primary="Phone ringtone" secondary="Titania" />
            </ListItemButton>
            <ListItemButton onClick={() => close('save')}>
              <ListItemText primary="Default notification ringtone" secondary="Tethys" />
            </ListItemButton>
          </List>
        </>
      ),
    });

    setResult(action ? `FullScreen: ${action}` : 'FullScreen: 취소됨');
  };

  const handleStaticContent = async () => {
    await dialog.open({
      title: '정적 콘텐츠',
      maxWidth: 'sm',
      content: (
        <>
          <DialogContent>
            <Typography>이것은 정적 콘텐츠입니다. (close 함수 없음)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Backdrop 클릭이나 ESC 키로만 닫을 수 있습니다.
            </Typography>
          </DialogContent>
        </>
      ),
    });
    setResult('Static: 닫힘');
  };

  const handleNoBackdropClose = async () => {
    await dialog.open({
      title: '중요한 알림',
      maxWidth: 'sm',
      disableBackdropClick: true,
      disableEscapeKeyDown: true,
      content: (close) => (
        <>
          <DialogContent>
            <Typography>이 Dialog는 Backdrop 클릭이나 ESC 키로 닫을 수 없습니다.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              반드시 버튼을 클릭해야 합니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => close()} variant="contained">
              확인
            </Button>
          </DialogActions>
        </>
      ),
    });
    setResult('NoBackdropClose: 확인됨');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dialog Playground
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        명령형 Dialog 시스템 테스트
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        <Button variant="outlined" onClick={handleAlert} fullWidth>
          1. Alert Dialog
        </Button>

        <Button variant="outlined" onClick={handleConfirm} fullWidth>
          2. Confirm Dialog
        </Button>

        <Button variant="outlined" onClick={handleCustomDialog} fullWidth>
          3. Custom Dialog (Form)
        </Button>

        <Button variant="outlined" onClick={handleFullScreenDialog} fullWidth>
          4. Full Screen Dialog
        </Button>

        <Button variant="outlined" onClick={handleStaticContent} fullWidth>
          5. Static Content (no close function)
        </Button>

        <Button variant="outlined" onClick={handleNoBackdropClose} fullWidth>
          6. No Backdrop/ESC Close
        </Button>
      </Stack>

      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              결과
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                fontFamily: 'monospace',
              }}
            >
              {result}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
