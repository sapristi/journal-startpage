import React from 'react';

import {Paper} from '@mui/material';

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

export const MainPaper = ({title, children, style, ...props}) => (
  <Paper style={{padding: "20px", ...style}} elevation={5} {...props}>
      {children}
  </Paper>
)

export const CardList = ({children}) => (
  <VFlex style={{gap: "10px"}}>
    {children}
  </VFlex>
)
