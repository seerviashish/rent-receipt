import { Box, styled } from '@mui/material'

export const MUIBox = styled(Box)<{ isPageBreak?: boolean }>`
  ${({ isPageBreak }) =>
    isPageBreak
      ? `
        page-break-after: always;
        break-after: page;
        `
      : ''}
`
