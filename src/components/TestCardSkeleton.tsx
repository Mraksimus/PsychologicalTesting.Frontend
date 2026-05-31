import React from 'react';
import { Skeleton } from '@mantine/core';

const TestCardSkeleton: React.FC = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%'
        }}>
            <Skeleton height={120} radius={0} />
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                <Skeleton height={22} width="70%" radius="sm" />
                <Skeleton height={14} radius="sm" />
                <Skeleton height={14} width="90%" radius="sm" />
                <Skeleton height={14} width="60%" radius="sm" />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <Skeleton height={14} width={90} radius="sm" />
                    <Skeleton height={14} width={70} radius="sm" />
                </div>
                <Skeleton height={42} radius="sm" mt="auto" />
            </div>
        </div>
    );
};

export default TestCardSkeleton;
