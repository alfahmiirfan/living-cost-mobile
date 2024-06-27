import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Clipboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import useSWR from "swr";

const PaymentScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [bankName, setBankName] = useState<string | null>(null);
  const [bankImage, setBankImage] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("Salin");
  const [harga, setHarga] = useState<number>(0);
  const [virtualAccountt, setVirtualAccount] = useState<string>("");
  const [dataCallback, setDataCallback] = useState<any>([]);
  const [reference, setReference] = useState<string>("");

  useEffect(() => {
    const loadBankInfo = async () => {
      const storedBankName = await AsyncStorage.getItem("selectedBank");
      const storedBankImage = await AsyncStorage.getItem("selectedBankImage");
      const virtualAccount: any = await AsyncStorage.getItem("va");
      setVirtualAccount(virtualAccount);
      if (storedBankName && storedBankImage) {
        setBankName(storedBankName);
        setBankImage(storedBankImage);
      }
    };
    loadBankInfo();
  }, []);

  const handleCopy = async () => {
    const virtualAccount: any = await AsyncStorage.getItem("va");
    Clipboard.setString(virtualAccount);
    setCopyStatus("Disalin");
    setTimeout(() => {
      setCopyStatus("Salin");
    }, 3000);
  };

  useEffect(() => {
    const harga = async () => {
      try {
        const response = await axios
          .get("http://127.0.0.1:8000/v1/siswa/harga")
          .then((response) => {
            // console.log(response.data.data.amoung);
            setHarga(response.data.data.amoung);
          });
      } catch (err) {
        console.log(err);
      }
    };
    harga();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const fethData = async (url: string) => {
    const response = await axios.get(url);
    return response.data.data;
  };
  useEffect(() => {
    const getReference = async () => {
      const storedReference: any = await AsyncStorage.getItem("reference");
      setReference(storedReference);
    };
    getReference();
  }, []);

  const { data, error } = useSWR(
    reference ? `http://127.0.0.1:8000/v1/transaction/${reference}` : null,
    fethData
  );

  useEffect(() => {
    if (data) {
      if (data.status === "PAID" && data.reference === reference) {
        // console.log("PAID");
        navigation.navigate("(tabs)", { screen: "informasi" });
      }
    }
  }, [data]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muhammad Alfahmi Irfan</Text>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("metodePembayaran")}
        >
          <Image
            source={{
              uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xNSAyMy43NUw2LjI1IDE1TDE1IDYuMjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgICA8cGF0aCBkPSJNMjMuNzUgMTVINS4yNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+",
            }}
            style={styles.backIcon}
          />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bankInfoContainer}>
        {bankImage && (
          <Image source={{ uri: bankImage }} style={styles.bankImage} />
        )}
        {bankName && <Text style={styles.bankName}>{bankName}</Text>}
      </View>
      <View style={styles.virtualAccountContainer}>
        <View>
          <Text style={styles.virtualAccountLabel}>No. Virtual Account</Text>
          {virtualAccountt && (
            <Text style={styles.virtualAccountNumber}>{virtualAccountt}</Text>
          )}
        </View>
        <TouchableOpacity onPress={handleCopy}>
          <Text style={styles.copyButton}>{copyStatus}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total: </Text>
        <Text style={styles.totalAmount}>{formatRupiah(harga)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  backButtonContainer: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F5E81D",
    borderRadius: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  bankInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  bankImage: {
    width: 35,
    height: 35,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  virtualAccountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 16,
  },
  virtualAccountLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  virtualAccountNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  copyButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentScreen;
