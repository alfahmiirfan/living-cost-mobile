import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";

export const saveToken = async (token: string):Promise<void> => {
    try{
        await AsyncStorage.setItem(TOKEN_KEY,token);
    }catch(err){
        console.log(err);
    }
}

export const getToken = async ():Promise<string | null> => {
    try{
        return await AsyncStorage.getItem(TOKEN_KEY)
    }catch(err){
        console.log(err);
        return null;
    }
}

export const removeToken = async ():Promise<void> => {
    try{
        await AsyncStorage.removeItem(TOKEN_KEY);
    }catch(err){
        console.log(err);
    }
}

export const isAuthenticated = async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token !== null || token !== undefined;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false; 
    }
  };