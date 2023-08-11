import React from 'react';
import { Box, Text, createStyles } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: 550,
    height: 9,
    backgroundColor: "#232324",
    opacity: "92%",
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    height: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  bar: {
    height: '100%',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 550,
    height: 45,
    marginTop: -28,
    alignItems: 'left',
    justifyContent: 'left',
  },
  label: {
    maxWidth: 550,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 18,
    color: "#fff",
    textShadow: theme.shadows.sm,
  },
  progressWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 550,
    height: 45,
    marginTop: -28,
    alignItems: 'right',
    justifyContent: 'right',
  },
  progress: {
    maxWidth: 550,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 18,
    color: "#fff",
    textShadow: theme.shadows.sm,
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [value, setValue] = React.useState(0);

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setValue(0);
    setLabel(data.label);
    setDuration(data.duration);
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: 'progress-bar linear',
                animationDuration: `${duration}ms`,
              }}
            >
              <Box className={classes.labelWrapper}>
                <Text className={classes.label}>{label}</Text>
              </Box>
              <Box className={classes.progressWrapper}>
                <Text className={classes.progress}>{value}%</Text>
              </Box>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;