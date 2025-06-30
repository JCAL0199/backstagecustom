import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard } from '@backstage/core-components';
import { Typography, Box } from '@mui/material';

export const VersionInfoCard = () => {
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations || {};

  const version = annotations['version'];
  const deployedAt = annotations['deployed-at'];
  const commit = annotations['git-commit'];

  return (
    <InfoCard title="Información de despliegue">
      <Box>
        <Typography variant="body1">
          <strong>Versión:</strong> {version ?? 'No especificada'}
        </Typography>
        <Typography variant="body1">
          <strong>Fecha de despliegue:</strong> {deployedAt ?? 'No especificada'}
        </Typography>
        {commit && (
          <Typography variant="body1">
            <strong>Commit:</strong> {commit}
          </Typography>
        )}
      </Box>
    </InfoCard>
  );
};
