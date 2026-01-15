'use client';

import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          안녕하세요
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          MUI 커스텀 테마가 적용되었습니다
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">
            Primary Button
          </Button>
          <Button variant="contained" color="secondary">
            Secondary Button
          </Button>
          <Button variant="outlined" color="primary">
            Outlined Button
          </Button>
        </Box>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              테마 카드
            </Typography>
            <Typography variant="body2" color="text.secondary">
              이 카드는 커스텀 테마의 스타일이 적용되어 있습니다. 그림자와 border radius를 확인해보세요.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
