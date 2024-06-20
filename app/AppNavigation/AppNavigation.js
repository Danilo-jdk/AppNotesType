import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Footer from '../components/Footer';
import Header from '../components/Header';
// screens
import Home from '../Home';
import Note from '../Note';
import CreateNote from '../CreateNote';
import Login from '../Login';

const Stack = createNativeStackNavigator();

export default function AppNavigation({StatiGlobali}) {
    const colorScheme = useColorScheme();
    return (
     <SafeAreaView style={{flex:1, backgroundColor:'yellow'}}>
        <Header />
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack.Navigator screenOptions={{ headerShown: false}}>
                            <Stack.Screen name='Login' component={Login}/>
                            <Stack.Screen name='Home'>
                                { (props) => <Home {...props} StatiGlobali={StatiGlobali} /> }
                            </Stack.Screen>
                            <Stack.Screen name='Note'>
                                { (props) => <Note {...props} StatiGlobali={StatiGlobali} /> }
                            </Stack.Screen>
                            <Stack.Screen name='CreateNote'>
                                { (props) => <CreateNote {...props} StatiGlobali={StatiGlobali} /> }
                            </Stack.Screen>
                        </Stack.Navigator>
                        <Footer />
            </ThemeProvider>
        </SafeAreaView>
    );
}