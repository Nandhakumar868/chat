import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Welcome from '../screens/Welcome';
import PersonalLogin from '../screens/PersonalLogin';
import OrganizationLogin from '../screens/OrganizationLogin';
import { RootStackParamList } from './NavigationTypes';
import { useSelector } from 'react-redux';
import SupervisorTabBar from './SupervisorTabBar';
import NewOrganization from '../screens/NewOrganization';
import SupervisorProfile from '../screens/Supervisor/SupervisorProfile';
import Colors from '../styles/Colors';
import { StyleSheet, Text, View } from 'react-native';
import ProjectView from '../screens/Supervisor/ProjectView';
import { useEffect } from 'react';
import { initializeUser } from '../redux/userRedux/actions';
import ForgetPassword from '../screens/ForgetPassword';
//import SupervisorMenu from './SupervisorMenu';

const Stack = createNativeStackNavigator<RootStackParamList>();



const Navigation = () => {
  const user = useSelector(state  => state.user.user);



  return (
    <NavigationContainer>
      {user ?
        <Stack.Navigator initialRouteName="SupervisorTabBar" screenOptions={{gestureDirection:'horizontal' , animation:'slide_from_right',animationDuration:50}}>
            {/* <Stack.Screen name="SupervisorTabBar" options={{headerShown:false}} component={SupervisorTabBar}  /> */}
            <Stack.Screen name="SupervisorTabBar" options={{headerShown:false}} component={SupervisorTabBar}  />
            <Stack.Screen name="ProjectView"  options={{headerShown:false}} component={ProjectView}/>


            <Stack.Screen name="SupervisorProfile" options={{
              headerStyle:{
                backgroundColor:Colors.primary,
                
              },
              headerTitle:'',
              headerLeft:()=>(<View>
                <Text style={styles.headerLeftTitle}> Profile</Text>
              </View>),
              headerTitleStyle:{
                color:Colors.White
              }
            }} component={SupervisorProfile}/>
        </Stack.Navigator>
        :
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown:false ,gestureDirection:'horizontal' , animation:'slide_from_right',animationDuration:50}}>
          <Stack.Screen name="Welcome" component={Welcome}  />
          <Stack.Screen name="OrganizationLogin" component={OrganizationLogin}  />
          <Stack.Screen name='NewOrganization' component={NewOrganization}/>
          <Stack.Screen name="PersonalLogin" component={PersonalLogin}  />
          <Stack.Screen name='ForgetPassword' component={ForgetPassword}/> 
        
      </Stack.Navigator>
    }
      
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  headerLeftTitle:{
    fontFamily:'Poppins',
    fontSize:22,
    fontWeight:'600',
    color:'white'
}
})