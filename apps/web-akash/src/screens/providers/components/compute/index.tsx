import Box from '@/components/box';
import CustomToolTip from '@/components/custom_tool_tip';
import { useStyles } from '@/screens/providers/components/compute/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import numeral from 'numeral';
import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

const Compute: React.FC<{
  className?: string;
  compute: {
    available: number;
    used: number;
  };
}> = ({ className, compute }) => {
  const { t } = useTranslation('providers');
  const { classes, theme } = useStyles();

  const total = compute.available + compute.used;

  const data = [
    {
      legendKey: 'used',
      percentKey: 'usedPercent',
      value: numeral(compute.used / 1000).format('0,0.00'),
      rawValue: compute.used,
      percent: `${numeral((compute.used * 100) / total).format('0.00')}%`,
      fill: theme.palette.custom.tokenomics.one,
    },
    {
      legendKey: 'available',
      percentKey: 'availablePercent',
      value: numeral(compute.available / 1000).format('0,0.00'),
      rawValue: compute.available,
      percent: `${numeral((compute.available * 100) / total).format('0.00')}%`,
      fill: theme.palette.custom.tokenomics.three,
    },
  ];

  return (
    <Box className={classnames(className, classes.root)}>
      <Typography variant="h2" className={classes.label}>
        {t('compute')}
      </Typography>
      <div className={classes.content}>
        <PieChart width={200} height={200}>
          <Pie
            stroke="none"
            cornerRadius={100}
            cy={90}
            data={data}
            innerRadius={80}
            outerRadius={90}
            dataKey="rawValue"
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.legendKey} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            content={
              <CustomToolTip>
                {(x) => (
                  <>
                    <Typography variant="caption">{t(x.legendKey)}</Typography>
                    <Typography variant="body1">
                      {x.value}
                      vCPUs ({x.percent})
                    </Typography>
                  </>
                )}
              </CustomToolTip>
            }
          />
        </PieChart>

        <div className={classes.legends}>
          {data.map((x) => (
            <div className="legends__item" key={x.legendKey}>
              <Typography variant="caption" className="usage">
                {t(x.legendKey)}{' '}
              </Typography>
              <Typography variant="caption" className="vCPUs">
                ( {x.value} vCPUs )
              </Typography>
              <Typography variant="caption" className="percent">
                {' '}
                {x.percent}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default Compute;
