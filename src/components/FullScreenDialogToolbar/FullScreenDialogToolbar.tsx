import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Toolbar, Typography } from '@mui/material';

interface FullScreenDialogToolbarProps {
  title: string;
  onClose: () => void;
  disabled?: boolean;
}

function FullScreenDialogToolbar({ title, onClose, disabled }: FullScreenDialogToolbarProps) {
  return (
    <Toolbar sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <IconButton edge="start" color="inherit" onClick={onClose} aria-label="닫기" disabled={disabled}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
        {title}
      </Typography>
    </Toolbar>
  );
}

export default FullScreenDialogToolbar;
