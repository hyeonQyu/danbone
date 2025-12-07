import { Typography, useTheme } from '@mui/material';

function Logo() {
  const theme = useTheme();

  return (
    <Typography
      variant="h3"
      sx={{
        textAlign: 'center',
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(2),
      }}
    >
      단번에
    </Typography>
  );
}

export default Logo;
