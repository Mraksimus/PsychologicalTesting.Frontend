import React from 'react';
import { Survey } from '@/types';
import { getCategoryGradient, getCategoryIcon, getCategoryLabel } from '@/utils/testAdapters';

interface SurveyCardProps {
    survey: Survey;
    onStartSurvey: (survey: Survey) => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onStartSurvey }) => {
    const questionsCount = survey.questionsCount ?? 0;
    const duration = survey.durationMins || '—';
    const categoryGradient = survey.category
        ? getCategoryGradient(survey.category)
        : 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)';
    const categoryIcon = survey.category ? getCategoryIcon(survey.category) : '📝';
    const categoryLabel = survey.category ? getCategoryLabel(survey.category) : 'Опрос';

    return (
        <div style={{
            background: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%'
        }}>
            <div
                style={{
                    background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '1rem',
                    position: 'relative'
                }}
            >
                <div style={{ fontSize: '3rem' }}>📝</div>
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
                    Опрос
                </div>
            </div>

            <div style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#2c3e50', marginTop: 0 }}>
                    {survey.name}
                </h3>
                <p style={{
                    color: '#666',
                    marginBottom: 'auto',
                    lineHeight: '1.5',
                    marginTop: 0,
                    flex: 1,
                    minHeight: '60px'
                }}>
                    {survey.description}
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    marginTop: '1rem'
                }}>
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
                        background: '#185a9d',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: 0
                    }}
                    onClick={() => onStartSurvey(survey)}
                >
                    Пройти опрос
                </button>
            </div>
        </div>
    );
};

export default SurveyCard;
