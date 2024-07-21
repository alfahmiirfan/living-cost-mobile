import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { saveToken, getToken } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import LOGO from "../assets/images/logo-sma.png";

const LoginAdmin: React.FC = () => {
  const navigation: any = useNavigation();
  const [nisn, setNisn] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  let token: any = "";

  const handleLogin = async () => {
    // Handle the login logic here
    try {
      const response = await axios
        .post("https://sman10pentagon-livingcost.my.id/api/v1/siswa/login", {
          nisn: nisn,
          password: password,
        })
        .then((response) => {
          // console.log(response.data);
          saveToken(response.data.data.access_token);
          setData(response.data);
          AsyncStorage.setItem("username", response.data.data.name);
          setLoading(false);
          navigation.navigate("(tabs)", { screen: "pembayaran" });
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          // source={{
          //   uri: "../assets/images/logo-sma.png",
          // }}
          source={require('../assets/images/logo-sma.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>LOGIN</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan NISN"
            value={nisn}
            onChangeText={setNisn}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        {/* Uncomment the below line if you have a Forgot Password screen */}
        {/* <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Lupa Password?</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#F5E81D",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#007BFF",
    textAlign: "center",
    marginTop: 16,
  },
});

export default LoginAdmin;
