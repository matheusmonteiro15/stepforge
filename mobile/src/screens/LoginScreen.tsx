import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../contexts/AuthContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {theme} from '../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();
  const {login} = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Navigation to Main is handled automatically by App.tsx observing isAuthenticated
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Falha ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.logoIcon}>💪</Text>
          <Text style={styles.logoText}>StepForge</Text>
          <Text style={styles.subtitle}>Entre para acompanhar seus treinos</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={theme.colors.textMuted}
            value={email}
            onChangeText={t => {
              setEmail(t);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.textMuted}
            value={password}
            onChangeText={t => {
              setPassword(t);
              setError('');
            }}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && {opacity: 0.7}]} 
            onPress={handleSubmit} 
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register' as never)} style={styles.footer}>
            <Text style={styles.footerText}>
              Não tem conta?{' '}
              <Text style={styles.footerLink}>Criar conta</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logoIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.bgInput,
    borderRadius: theme.radius.md,
    padding: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  footer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  footerLink: {
    color: theme.colors.primaryLight,
    fontWeight: '500',
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    color: '#FCA5A5',
    padding: 10,
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
});
