import React from 'react';
import {StatusBar, View, ActivityIndicator, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import CreateWorkoutScreen from './src/screens/CreateWorkoutScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GroupsScreen from './src/screens/GroupsScreen';
import GroupDetailScreen from './src/screens/GroupDetailScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import NewCheckInScreen from './src/screens/NewCheckInScreen';
import GroupInfoScreen from './src/screens/GroupInfoScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import {theme} from './src/theme';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import {NetworkProvider} from './src/contexts/NetworkContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.bgPrimary,
    card: theme.colors.bgSecondary,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
    notification: theme.colors.primary,
  },
};

const tabIcons: Record<string, string> = {
  Dashboard: '📊',
  Treinos: '🏋️',
  Grupos: '👥',
  Perfil: '👤',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}: {route: any}) => ({
        headerStyle: {
          backgroundColor: theme.colors.bgSecondary,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {fontWeight: '600'},
        tabBarStyle: {
          backgroundColor: theme.colors.bgSecondary,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {fontSize: 11, fontWeight: '500'},
        tabBarIcon: ({focused}: {focused: boolean}) => (
          <Text style={{fontSize: 20, opacity: focused ? 1 : 0.5}}>
            {tabIcons[route.name] || '📋'}
          </Text>
        ),
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Treinos" component={WorkoutsScreen} />
      <Tab.Screen name="Grupos" component={GroupsScreen} />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

const stackScreenOptions = {
  headerShown: true,
  headerStyle: {backgroundColor: theme.colors.bgSecondary},
  headerTintColor: theme.colors.textPrimary,
};

function AppNavigator() {
  const {isAuthenticated, isLoading} = useAuth();
  
  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: theme.colors.bgPrimary, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen 
                name="CreateWorkout" 
                component={CreateWorkoutScreen} 
                options={{...stackScreenOptions, title: 'Novo Treino'}} 
              />
              <Stack.Screen 
                name="GroupDetail" 
                component={GroupDetailScreen} 
                options={{...stackScreenOptions, title: 'Grupo'}} 
              />
              <Stack.Screen 
                name="CreateGroup" 
                component={CreateGroupScreen} 
                options={{...stackScreenOptions, title: 'Criar Grupo'}} 
              />
              <Stack.Screen 
                name="UserProfile" 
                component={UserProfileScreen} 
                options={{...stackScreenOptions, title: 'Perfil do Atleta'}} 
              />
              <Stack.Screen 
                name="NewCheckIn" 
                component={NewCheckInScreen} 
                options={{...stackScreenOptions, title: 'Novo Check-in'}} 
              />
              <Stack.Screen 
                name="GroupInfo" 
                component={GroupInfoScreen} 
                options={{...stackScreenOptions, title: 'Detalhes do Grupo'}} 
              />
              <Stack.Screen 
                name="PostDetail" 
                component={PostDetailScreen} 
                options={{...stackScreenOptions, title: 'Publicação'}} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgPrimary} />
          <AppNavigator />
        </SafeAreaProvider>
      </NetworkProvider>
    </AuthProvider>
  );
}

export default App;
