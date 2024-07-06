import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Footer from '../components/Footer';
import Header from '../components/Header';
// screens
import Home from '../Home';
import Note from '../Note';
import CreateNote from '../CreateNote';
import ModifyNote from '../ModifyNote';
import Login from '../Login';
import DeleteUser from '../DeleteUser';

const Stack = createNativeStackNavigator();

export default function AppNavigation({StatiGlobali}) {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
        });
        return unsubscribe; // questo è il cleanup per rimuovere il listner
    }, [])


    return (
     <SafeAreaView style={{flex:1, backgroundColor:'yellow'}}>
        <Header StatiGlobali={StatiGlobali}/>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                {user ? (
                        <>
                            <Stack.Navigator screenOptions={{ headerShown: false}}>
                                <Stack.Screen name='Home'>
                                    { (props) => <Home {...props} StatiGlobali={StatiGlobali} /> }
                                </Stack.Screen>
                                <Stack.Screen name='Note'>
                                    { (props) => <Note {...props} StatiGlobali={StatiGlobali} /> }
                                </Stack.Screen>
                                <Stack.Screen name='CreateNote'>
                                    { (props) => <CreateNote {...props} StatiGlobali={StatiGlobali} /> }
                                </Stack.Screen>
                                <Stack.Screen name='ModifyNote'>
                                    { (props) => <ModifyNote {...props} StatiGlobali={StatiGlobali} /> }
                                </Stack.Screen>
                                <Stack.Screen name='DeleteUser'>
                                    { (props) => <DeleteUser {...props} StatiGlobali={StatiGlobali} /> }
                                </Stack.Screen>
                            </Stack.Navigator>
                            <Footer StatiGlobali={StatiGlobali}/>
                        </>
                ) : (
                        <Stack.Navigator screenOptions={{ headerShown: false}}>
                            {/* <Stack.Screen name='Login' component={Login}/> */}
                            <Stack.Screen name='Login'>
                                    { (props) => <Login {...props} StatiGlobali={StatiGlobali} /> }
                                </Stack.Screen>
                        </Stack.Navigator>
                )}
            </ThemeProvider>
        </SafeAreaView>
    );
}