import React from 'react';
import { FeaturedTest } from '@/types';

interface TestCardProps {
    test: FeaturedTest;
    onStartTest: (testId: number) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onStartTest }) => {
    const getGradientByCategory = (category: string): string => {
        const gradients: { [key: string]: string } = {
            'Психология': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'Развитие': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'Коммуникации': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'Здоровье': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        };
        return gradients[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };

    const getIconByCategory = (category: string): string => {
        const icons: { [key: string]: string } = {
            'Психология': '🧠',
            'Развитие': '📈',
            'Коммуникации': '💬',
            'Здоровье': '❤️'
        };
        return icons[category] || '📊';
    };

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
                    background: getGradientByCategory(test.category),
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
                    {getIconByCategory(test.category)}
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
                    {test.category}
                </div>
            </div>

            <div style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#2c3e50', marginTop: 0 }}>
                    {test.title}
                </h3>
                <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.5', marginTop: 0 }}>
                    {test.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        <span>❓</span>
                        <span>{test.questionsCount} вопросов</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        <span>⏱️</span>
                        <span>{test.time} мин</span>
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
                    onClick={() => onStartTest(test.id)}
                >
                    Начать тест
                </button>
            </div>
        </div>
    );
};

export default TestCard;