import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { gitDate, gitSha, release, version } from '../../version'
const Version: React.FC = () => {
  return (
    <Box className="flex">
      <Typography component={'pre'} variant="body1">
        {`Version: ${version}\nGit-Sha: ${gitSha}\nRelease Time: ${moment(
          gitDate
        ).toString()}\nRelease: ${release}`}
      </Typography>
    </Box>
  )
}
export default Version
