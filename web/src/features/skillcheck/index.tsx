import { useRef, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Indicator from './indicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles } from '@mantine/core';
import type { SkillCheckProps, GameDifficulty } from '../../typings';

export const circleCircumference = 3 * 90 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 40,
  medium: 35,
  hard: 30,
};

const useStyles = createStyles((theme) => ({
  svg: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  track: {
    fill: 'transparent',
    stroke: "#232324",
    strokeOpacity: 0.92,
    strokeWidth: 15,

  },
  skillArea: {
    fill: 'transparent',
    stroke: theme.fn.primaryColor(),
    strokeWidth: 14,
  },
  indicator: {
    stroke: '#fff',
    strokeWidth: 25,
    fill: 'transparent',
  },
  button: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: "#fff",
    fontFamily: "Oswald",
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 400,
  },
}));

const SkillCheck: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';
    setSkillCheck({
      angle: -90 + getRandomAngle(90, 360 - offset),
      difficultyOffset: offset,
      difficulty: gameData,
      key: randomKey,
    });

    setVisible(true);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    setSkillCheck({
      angle: -90 + getRandomAngle(90, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      key,
    });
  };

  return (
    <>
      {visible && (
        <>
          <svg r={90} width={500} height={500} className={classes.svg}>
            {/*Circle track*/}
            <circle r={90} cx={250} cy={250} className={classes.track} strokeDasharray={circleCircumference} />
            {/*SkillCheck area*/}
            <circle
              r={90}
              cx={250}
              cy={250}
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference - (Math.PI * 50 * skillCheck.difficultyOffset) / 180}
              transform={`rotate(${skillCheck.angle}, 250, 250)`}
              className={classes.skillArea}
            />
            <Indicator
              angle={skillCheck.angle}
              offset={skillCheck.difficultyOffset}
              multiplier={
                skillCheck.difficulty === 'easy'
                  ? 0.7
                  : skillCheck.difficulty === 'medium'
                  ? 0.90
                  : skillCheck.difficulty === 'hard'
                  ? 0.95
                  : skillCheck.difficulty.speedMultiplier
              }
              handleComplete={handleComplete}
              className={classes.indicator}
              skillCheck={skillCheck}
            />
          </svg>
          <Box className={classes.button}>{skillCheck.key.toUpperCase()}</Box>
        </>
      )}
    </>
  );
};

export default SkillCheck;
