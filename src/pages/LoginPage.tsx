import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Box,
  Affix,
  Transition,
} from '@mantine/core';
import { useToggle, useWindowScroll } from '@mantine/hooks';
import { IconArrowUp, IconBrain, IconHeart, IconMoodSmile, IconStar, IconLeaf, IconCloud, IconSparkles, IconMoon, IconSun, IconFlame, IconSnowflake } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Анимированные floating иконки
const FloatingIcon = ({ icon: Icon, delay = 0, color }: { icon: React.ComponentType<any>, delay?: number, color?: string }) => (
  <motion.div
    style={{
      position: 'fixed',
      opacity: 0.3,
      color: color || 'white',
    }}
    initial={{ y: -50, opacity: 0, scale: 0 }}
    animate={{ 
      y: [0, -25, 0],
      opacity: [0.2, 0.4, 0.2],
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  >
    <Icon size={45} />
  </motion.div>
);

export function LoginPage() {
  const [type, toggle] = useToggle(['login', 'register']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (type === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      // После успешной аутентификации переходим на главную страницу
      navigate('/');
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      // Ошибка уже обработана в контексте, здесь просто логируем
    } finally {
      setIsLoading(false);
    }
  };

  // Вычисляем значения для анимации
  const getInitialX = () => type === 'login' ? -30 : 30;
  const getExitX = () => type === 'login' ? 30 : -30;

  return (
    <Box 
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Анимированный фон */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Floating иконки */}
      <div style={{ position: 'fixed', top: '10%', left: '5%' }}>
        <FloatingIcon icon={IconBrain} delay={0} color="#FFD700" />
      </div>
      <div style={{ position: 'fixed', top: '15%', right: '8%' }}>
        <FloatingIcon icon={IconHeart} delay={1} color="#FF6B6B" />
      </div>
      <div style={{ position: 'fixed', top: '70%', left: '7%' }}>
        <FloatingIcon icon={IconMoodSmile} delay={2} color="#4ECDC4" />
      </div>
      <div style={{ position: 'fixed', top: '25%', left: '12%' }}>
        <FloatingIcon icon={IconStar} delay={3} color="#FFE66D" />
      </div>
      <div style={{ position: 'fixed', top: '60%', right: '12%' }}>
        <FloatingIcon icon={IconLeaf} delay={4} color="#87D37C" />
      </div>
      <div style={{ position: 'fixed', top: '35%', right: '5%' }}>
        <FloatingIcon icon={IconCloud} delay={5} color="#AEA8D3" />
      </div>
      <div style={{ position: 'fixed', top: '80%', right: '6%' }}>
        <FloatingIcon icon={IconSparkles} delay={6} color="#F7DC6F" />
      </div>
      <div style={{ position: 'fixed', top: '20%', left: '15%' }}>
        <FloatingIcon icon={IconMoon} delay={8} color="#A3A0FD" />
      </div>
      <div style={{ position: 'fixed', top: '30%', right: '15%' }}>
        <FloatingIcon icon={IconSun} delay={9} color="#FFA726" />
      </div>
      <div style={{ position: 'fixed', top: '50%', left: '3%' }}>
        <FloatingIcon icon={IconFlame} delay={10} color="#FF5722" />
      </div>
      <div style={{ position: 'fixed', top: '55%', right: '3%' }}>
        <FloatingIcon icon={IconSnowflake} delay={11} color="#29B6F6" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '440px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Title ta="center" c="white" fw={800} size="h2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: '8px' }}>
            MindCheck
          </Title>
          <Text c="white" ta="center" size="lg" opacity={0.9} fw={500}>
            Психологический самоконтроль
          </Text>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ opacity: 0, x: getInitialX() }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: getExitX() }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Paper 
              withBorder 
              shadow="xl" 
              p="xl"
              mt={30}
              radius="xl"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                borderRadius: '20px',
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Text c="dimmed" size="sm" ta="center" mb="lg" fw={500}>
                  {type === 'login' 
                    ? 'Войдите в свой аккаунт' 
                    : 'Создайте новый аккаунт'}
                </Text>
              </motion.div>

              <form onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TextInput 
                    label="Email" 
                    placeholder="your@email.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    radius="lg"
                    size="md"
                    styles={{
                      input: {
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                      }
                    }}
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{ marginTop: '16px' }}
                >
                  <PasswordInput 
                    label="Пароль" 
                    placeholder="Ваш пароль" 
                    required 
                    radius="lg"
                    size="md"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    styles={{
                      input: {
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                      }
                    }}
                  />
                </motion.div>

                {type === 'login' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Group justify="end" mt="lg">
                      <Anchor component="button" type="button" size="sm" c="blue" fw={600}>
                        Забыли пароль?
                      </Anchor>
                    </Group>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{ marginTop: '30px' }}
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      fullWidth 
                      type="submit"
                      size="md"
                      radius="md"
                      loading={isLoading}
                      loaderProps={{ type: 'dots' }}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                        height: '50px',
                        fontSize: '16px',
                        fontWeight: 600,
                        paddingLeft: '30px',
                        paddingRight: '30px',
                      }}
                    >
                      {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Text c="dimmed" size="sm" ta="center" mt="lg">
                  {type === 'login' 
                    ? 'Еще нет аккаунта? ' 
                    : 'Уже есть аккаунт? '}
                  <Anchor 
                    component="button" 
                    type="button"
                    size="sm" 
                    onClick={() => toggle()}
                    c="blue"
                    fw={700}
                  >
                    {type === 'login' ? 'Создать аккаунт' : 'Войти'}
                  </Anchor>
                </Text>
              </motion.div>
            </Paper>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Text c="white" ta="center" size="sm" mt="xl" opacity={0.8}>
            Ваше психическое здоровье важно для нас 💙
          </Text>
        </motion.div>
      </motion.div>

      {/* Кнопка scroll to top */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                leftSection={<IconArrowUp size={16} />}
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
                radius="xl"
                size="sm"
                variant="light"
              >
                Наверх
              </Button>
            </motion.div>
          )}
        </Transition>
      </Affix>
    </Box>
  );
}