import React from 'react';

import {Paper, Stack} from '@mui/material';

export const MainPaper = ({title, children, style, ...props}) => (
  <Paper style={{padding: "20px", ...style}} elevation={5} {...props}>
      {children}
  </Paper>
)

export const CardList = ({children}) => (
  <Stack spacing={1}>
    {children}
  </Stack>
)
