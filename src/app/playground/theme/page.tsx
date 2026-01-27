'use client';

import { useThemeMode } from '@/styles/ThemeModeContext';
import {
  Add as AddIcon,
  DarkMode as DarkModeIcon,
  Delete as DeleteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  LightMode as LightModeIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function DesignSystemPage() {
  const [tabValue, setTabValue] = useState(0);
  const { mode, setMode } = useThemeMode();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3">MUI Design System</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <LightModeIcon sx={{ color: mode === 'light' ? 'primary.main' : 'text.disabled' }} />
          <Switch checked={mode === 'dark'} onChange={toggleTheme} />
          <DarkModeIcon sx={{ color: mode === 'dark' ? 'primary.main' : 'text.disabled' }} />
        </Stack>
      </Box>

      {/* Colors Section */}
      <Section title="Colors (색상)">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 2,
          }}
        >
          {['primary', 'secondary', 'error', 'warning', 'info', 'success'].map((color) => (
            <Card key={color}>
              <Box
                sx={{
                  height: 100,
                  bgcolor: `${color}.main`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: `${color}.contrastText` }}>
                  {color}
                </Typography>
              </Box>
              <CardContent>
                <Stack spacing={1}>
                  <ColorSwatch label="main" color={`${color}.main`} />
                  <ColorSwatch label="light" color={`${color}.light`} />
                  <ColorSwatch label="dark" color={`${color}.dark`} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Background & Text Colors
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Background
            </Typography>
            <Stack spacing={1}>
              <ColorSwatch label="default" color="background.default" />
              <ColorSwatch label="paper" color="background.paper" />
            </Stack>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Text
            </Typography>
            <Stack spacing={1}>
              <ColorSwatch label="primary" color="text.primary" />
              <ColorSwatch label="secondary" color="text.secondary" />
              <ColorSwatch label="disabled" color="text.disabled" />
            </Stack>
          </Paper>
        </Box>
      </Section>

      {/* Typography Section */}
      <Section title="Typography (타이포그래피)">
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
            <Divider />
            <Typography variant="body1">
              Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pretium ante erat, vitae sodales mi varius quis.
            </Typography>
            <Typography variant="body2">
              Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pretium ante erat, vitae sodales mi varius quis.
            </Typography>
            <Typography variant="subtitle1">Subtitle 1</Typography>
            <Typography variant="subtitle2">Subtitle 2</Typography>
            <Typography variant="button">Button Text</Typography>
            <Typography variant="caption">Caption text</Typography>
            <Typography variant="overline">Overline text</Typography>
          </Stack>
        </Paper>
      </Section>

      {/* Buttons Section */}
      <Section title="Buttons (버튼)">
        <Stack spacing={3}>
          {/* Contained Buttons */}
          <div>
            <Typography variant="h6" gutterBottom>
              Contained
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1 }}>
              <Button variant="contained">Primary</Button>
              <Button variant="contained" color="secondary">
                Secondary
              </Button>
              <Button variant="contained" color="success">
                Success
              </Button>
              <Button variant="contained" color="error">
                Error
              </Button>
              <Button variant="contained" color="warning">
                Warning
              </Button>
              <Button variant="contained" color="info">
                Info
              </Button>
              <Button variant="contained" disabled>
                Disabled
              </Button>
            </Stack>
          </div>

          {/* Outlined Buttons */}
          <div>
            <Typography variant="h6" gutterBottom>
              Outlined
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1 }}>
              <Button variant="outlined">Primary</Button>
              <Button variant="outlined" color="secondary">
                Secondary
              </Button>
              <Button variant="outlined" color="success">
                Success
              </Button>
              <Button variant="outlined" color="error">
                Error
              </Button>
              <Button variant="outlined" disabled>
                Disabled
              </Button>
            </Stack>
          </div>

          {/* Text Buttons */}
          <div>
            <Typography variant="h6" gutterBottom>
              Text
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1 }}>
              <Button variant="text">Primary</Button>
              <Button variant="text" color="secondary">
                Secondary
              </Button>
              <Button variant="text" color="success">
                Success
              </Button>
              <Button variant="text" color="error">
                Error
              </Button>
              <Button variant="text" disabled>
                Disabled
              </Button>
            </Stack>
          </div>

          {/* Button Sizes */}
          <div>
            <Typography variant="h6" gutterBottom>
              Sizes
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="contained" size="small">
                Small
              </Button>
              <Button variant="contained" size="medium">
                Medium
              </Button>
              <Button variant="contained" size="large">
                Large
              </Button>
            </Stack>
          </div>

          {/* Buttons with Icons */}
          <div>
            <Typography variant="h6" gutterBottom>
              With Icons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1 }}>
              <Button variant="contained" startIcon={<AddIcon />}>
                Add
              </Button>
              <Button variant="contained" endIcon={<DeleteIcon />}>
                Delete
              </Button>
              <IconButton color="primary">
                <FavoriteIcon />
              </IconButton>
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </div>
        </Stack>
      </Section>

      {/* Form Inputs Section */}
      <Section title="Form Inputs (폼 입력)">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          <Stack spacing={3}>
            <TextField label="Default" size="small" />
            <TextField label="Default" size="medium" />
            <TextField label="Filled" variant="filled" />
            <TextField label="Outlined" variant="outlined" />
            <TextField label="Disabled" disabled value="Disabled text" />
            <TextField label="Error" error helperText="Error message" />
            <TextField label="With Helper Text" helperText="This is helper text" />
            <TextField label="Multiline" multiline rows={4} />
          </Stack>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="select-label">Select</InputLabel>
              <Select labelId="select-label" label="Select" defaultValue="option1">
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
                <MenuItem value="option3">Option 3</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel control={<Checkbox />} label="Checkbox" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
            <FormControlLabel control={<Checkbox disabled />} label="Disabled" />
            <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />

            <FormControlLabel control={<Switch />} label="Switch" />
            <FormControlLabel control={<Switch defaultChecked />} label="Checked" />
            <FormControlLabel control={<Switch disabled />} label="Disabled" />

            <RadioGroup>
              <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
              <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
              <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
            </RadioGroup>
          </Stack>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Slider
          </Typography>
          <Slider defaultValue={30} />
          <Slider defaultValue={[20, 40]} />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Rating
          </Typography>
          <Stack spacing={2}>
            <Rating defaultValue={2.5} precision={0.5} />
            <Rating defaultValue={3} icon={<FavoriteIcon />} emptyIcon={<FavoriteBorderIcon />} />
          </Stack>
        </Box>
      </Section>

      {/* Progress Section */}
      <Section title="Progress Indicators (진행 표시)">
        <Stack spacing={3}>
          <div>
            <Typography variant="h6" gutterBottom>
              Linear Progress
            </Typography>
            <Stack spacing={2}>
              <LinearProgress />
              <LinearProgress value={40} variant="determinate" />
              <LinearProgress value={60} variant="determinate" color="secondary" />
              <LinearProgress value={80} variant="determinate" color="success" />
            </Stack>
          </div>

          <div>
            <Typography variant="h6" gutterBottom>
              Circular Progress
            </Typography>
            <Stack direction="row" spacing={2}>
              <CircularProgress />
              <CircularProgress color="secondary" />
              <CircularProgress color="success" />
              <CircularProgress variant="determinate" value={75} />
            </Stack>
          </div>
        </Stack>
      </Section>

      {/* Chips Section */}
      <Section title="Chips (칩)">
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <Chip label="Default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Error" color="error" />
            <Chip label="Warning" color="warning" />
            <Chip label="Info" color="info" />
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <Chip label="Outlined" variant="outlined" />
            <Chip label="Deletable" onDelete={() => {}} />
            <Chip label="Clickable" onClick={() => {}} />
            <Chip label="Icon" icon={<FavoriteIcon />} />
          </Stack>
        </Stack>
      </Section>

      {/* Alerts Section */}
      <Section title="Alerts (알림)">
        <Stack spacing={2}>
          <Alert severity="success">This is a success alert</Alert>
          <Alert severity="info">This is an info alert</Alert>
          <Alert severity="warning">This is a warning alert</Alert>
          <Alert severity="error">This is an error alert</Alert>
          <Alert severity="success" variant="outlined">
            This is an outlined success alert
          </Alert>
          <Alert severity="info" variant="filled">
            This is a filled info alert
          </Alert>
        </Stack>
      </Section>

      {/* Cards Section */}
      <Section title="Cards (카드)">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 2,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Card Title
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a basic card with some content. Cards are surfaces that display content and actions on a single topic.
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Outlined Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is an outlined variant of the card component.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Colored Card
              </Typography>
              <Typography variant="body2">This card has a custom background color.</Typography>
            </CardContent>
          </Card>
        </Box>
      </Section>

      {/* Tabs Section */}
      <Section title="Tabs (탭)">
        <Paper>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
            <Tab label="Disabled" disabled />
          </Tabs>
          <Box sx={{ p: 3 }}>
            <Typography>Tab {tabValue + 1} content</Typography>
          </Box>
        </Paper>
      </Section>

      {/* Badges Section */}
      <Section title="Badges (뱃지)">
        <Stack direction="row" spacing={4}>
          <Badge badgeContent={4} color="primary">
            <MailIcon />
          </Badge>
          <Badge badgeContent={10} color="secondary">
            <MailIcon />
          </Badge>
          <Badge badgeContent={100} color="error">
            <MailIcon />
          </Badge>
          <Badge variant="dot" color="success">
            <MailIcon />
          </Badge>
        </Stack>
      </Section>

      {/* Tooltips Section */}
      <Section title="Tooltips (툴팁)">
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1 }}>
          <Tooltip title="Default tooltip">
            <Button variant="outlined">Hover me</Button>
          </Tooltip>
          <Tooltip title="Top" placement="top">
            <Button variant="outlined">Top</Button>
          </Tooltip>
          <Tooltip title="Right" placement="right">
            <Button variant="outlined">Right</Button>
          </Tooltip>
          <Tooltip title="Bottom" placement="bottom">
            <Button variant="outlined">Bottom</Button>
          </Tooltip>
          <Tooltip title="Left" placement="left">
            <Button variant="outlined">Left</Button>
          </Tooltip>
        </Stack>
      </Section>

      {/* Spacing Section */}
      <Section title="Spacing (간격)">
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" gutterBottom>
            MUI uses an 8px base spacing unit. You can use sx prop with spacing values (1 = 8px, 2 = 16px, etc.)
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((spacing) => (
              <Box key={spacing} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  spacing={spacing}
                </Typography>
                <Box sx={{ width: spacing * 8, height: 24, bgcolor: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {spacing * 8}px
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Section>

      {/* Shadows Section */}
      <Section title="Shadows (그림자)">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((elevation) => (
            <Paper
              key={elevation}
              elevation={elevation}
              sx={{
                p: 2,
                textAlign: 'center',
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2">elevation={elevation}</Typography>
            </Paper>
          ))}
        </Box>
      </Section>
    </Container>
  );
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 40,
          height: 24,
          bgcolor: color,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}
