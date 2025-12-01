import React from 'react';
import { Test } from '@/types';
import { getCategoryLabel, getCategoryGradient, getCategoryIcon } from '@/utils/testAdapters';

interface TestCardProps {
    test: Test;
    onStartTest: (test: Test) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onStartTest }) => {
    const categoryLabel = getCategoryLabel(test.category);
    const categoryGradient = getCategoryGradient(test.category);
    const categoryIcon = getCategoryIcon(test.category);
    const questionsCount = test.questionsCount;
    const duration = test.durationMins || '—';

    return (
        <div style={{
            background: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div
                style={{
                    background: categoryGradient,
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '1rem',
                    position: 'relative'
                }}
            >
                <div style={{ fontSize: '3rem', marginRight: '1rem' }}>
                    {categoryIcon}
                </div>
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.3)'
                }}>
                    {categoryLabel}
                </div>
            </div>

            <div style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#2c3e50', marginTop: 0 }}>
                    {test.name}
                </h3>
                <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.5', marginTop: 0 }}>
                    {test.description || test.transcript}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        <span>❓</span>
                        <span>{questionsCount} вопросов</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        <span>⏱️</span>
                        <span>{duration} мин</span>
                    </div>
                </div>

                <button
                    type="button"
                    style={{
                        width: '100%',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: 'auto'
                    }}
                    onClick={() => onStartTest(test)}
                >
                    Начать тест
                </button>
            </div>
        </div>
    );
};

export default TestCard;