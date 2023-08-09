import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, Stack, Text, Flex, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 320,
    height: 580,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    // gap: 6,
    borderTop: "solid white 1px ",
    borderLeft: "solid white 1px ",
    borderRight: "solid white 1px ",
  },
  titleContainer: {
    flex: '1 100%',
    flexDirection: "row",
    opacity: "98%",
    backgroundColor: "#232324",
    paddingBottom: "10px",
  },
  titleText: {
    color: theme.colors.dark[0],
    padding: 6,
    paddingTop: "14px",
    textAlign: 'left',
  },
  titleBox: {
    textAlign: 'right',
    Align: 'right',
  },
  buttonsContainer: {
    borderRadius: 0,
    height: 560,
    overflowY: 'scroll',
  },
  buttonsFlexWrapper: {
    gap: 0,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Flex className={classes.header}>
          <Box className={classes.titleContainer}>
            <Text className={classes.titleText}>
              <ReactMarkdown>{contextMenu.title}</ReactMarkdown>
            </Text>
          </Box>
          {contextMenu.menu && (
            <HeaderButton icon="arrow-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
          )}
          <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
        </Flex>
        <Box className={classes.buttonsContainer}>
          <Stack className={classes.buttonsFlexWrapper}>
            {Object.entries(contextMenu.options).map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} />
            ))}
          </Stack>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;
