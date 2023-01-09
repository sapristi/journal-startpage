import React from 'react';

import {Paper, Typography} from '@mui/material';

export const HFlex = ({children, style}) => (
  <div style={{display: "flex", flexDirection: "row",
               alignItems: "center", ...style}}>
    {children}
  </div>
)

export const VFlex = ({children, style}) => (
  <div style={{...style, display: "flex", flexDirection: "column"}}>
    {children}
  </div>
)

export const MainPaper = ({title, children, props}) => (
  <Paper style={{padding: "20px"}} elevation={5} {...props}>
    <Typography variant="h3">{title}</Typography>
      {children}
  </Paper>
)

export const CardList = ({children}) => (
  <VFlex style={{gap: "10px"}}>
    {children}
  </VFlex>
)
