import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiProps, TextUiPosition } from '../../typings';

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: params.position === 'top-center' ? 'baseline' : 'center',
    justifyContent:
      params.position === 'right-center' ? 'flex-end' : params.position === 'left-center' ? 'flex-start' : 'center',
  },
  container: {
    fontSize: 16,
    padding: 12,
    margin: 8,
    border: "solid #ffffffad 1px",
    opacity: "92%",
    backgroundColor: "#232324",
    borderRadius: "3px",
    color: "#ffffffad",
    fontFamily: 'Roboto',
    boxShadow: theme.shadows.sm,
    fontWeight: 500,
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.container}>
            <Group spacing={12}>
              {data.icon && <FontAwesomeIcon icon={data.icon} fixedWidth size="lg" style={{ color: "#3066a0" }} />}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.text}</ReactMarkdown>
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
