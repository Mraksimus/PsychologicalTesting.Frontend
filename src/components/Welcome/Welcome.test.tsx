import { render, screen } from '@test-utils';
import { Welcome } from './Welcome';

describe('Welcome component', () => {
  it('renders welcome title', () => {
    render(<Welcome />);
    expect(screen.getByText('Добро пожаловать на сервис психологического тестирования')).toBeInTheDocument();
  });

  it('renders welcome description', () => {
    render(<Welcome />);
    expect(screen.getByText('Пройдите психологические тесты и получите персонализированные рекомендации от нашего AI-помощника')).toBeInTheDocument();
  });
});