import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import TabBar from "@/components/TabBar";
import axios from "axios";
import { getToken } from "@/utils/storage";

interface BankOptionProps {
  bankName: string;
  bankImage: string;
  onSelect: (bankName: string, bankImage: string) => void;
  isSelected: boolean;
}

const BankOption: React.FC<BankOptionProps> = ({
  bankName,
  bankImage,
  onSelect,
  isSelected,
}) => (
  <TouchableOpacity
    style={[styles.bankOptionContainer, isSelected && styles.selectedBank]}
    onPress={() => onSelect(bankName, bankImage)}
  >
    <View style={styles.bankOptionContent}>
      <Image source={{ uri: bankImage }} style={styles.bankImage} />
      <Text style={styles.bankText}>{bankName}</Text>
    </View>
  </TouchableOpacity>
);

const MetodePembayaran: React.FC = () => {
  const navigation: any = useNavigation();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedBankImage, setSelectedBankImage] = useState<string | null>(
    null
  );
  const [harga, setHarga] = useState<number>(0);

  const handleSelectBank = async (bankName: string, bankImage: string) => {
    setSelectedBank(bankName);
    setSelectedBankImage(bankImage);
    try {
      await AsyncStorage.setItem("selectedBank", bankName);
      await AsyncStorage.setItem("selectedBankImage", bankImage);
    } catch (error) {
      console.error("Failed to save the data to the storage");
    }
  };

  const getid = async () => {
    try {
      const value = await AsyncStorage.getItem("id_income");
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const ValueBank = async () => {
    try {
      const value = await AsyncStorage.getItem("selectedBank");
      switch (value) {
        case "BANK BRI":
          return "BRIVA";
        case "BANK BNI":
          return "BNIVA";
        case "BANK BCA":
          return "BCAVA";
        default:
          return null;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePayNow = async () => {
    if (selectedBank) {
      const id = await getid();
      const bank = await ValueBank();
      const token = await getToken();
      Number(id);
      const response = await axios
        .post(
          `http://127.0.0.1:8000/v1/siswa/payment/${id}`,
          {
            method: bank,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data.data.data.pay_code);
          AsyncStorage.setItem("va", response.data.data.data.pay_code);
          AsyncStorage.setItem("reference", response.data.data.data.reference);
          // console.log(response.data);
          navigation.navigate("virtualAccount");
        })
        .catch((err) => {
          console.log(err);
        });
      // navigation.navigate("virtualAccount", {
      //   bankName: selectedBank,
      //   bankImage: selectedBankImage,
      // });
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muhammad Alfahmi Irfan</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate("(tabs)", { screen: "pembayaran" })
          }
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
      <Text style={styles.italicText}>*Silahkan pilih metode pembayaran</Text>
      <View style={styles.bankOptionsContainer}>
        <BankOption
          bankName="BANK BRI"
          bankImage="assets/images/bri.svg"
          onSelect={handleSelectBank}
          isSelected={selectedBank === "BANK BRI"}
        />
        <BankOption
          bankName="BANK BNI"
          bankImage="assets/images/bni.svg"
          onSelect={handleSelectBank}
          isSelected={selectedBank === "BANK BNI"}
        />
        <BankOption
          bankName="BANK BCA"
          bankImage="assets/images/bca.svg"
          onSelect={handleSelectBank}
          isSelected={selectedBank === "BANK BCA"}
        />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: </Text>
        <Text style={styles.totalAmount}>{formatRupiah(harga)}</Text>
      </View>
      <View style={styles.payNowContainer}>
        <TouchableOpacity
          style={styles.payNowButton}
          onPress={handlePayNow}
          disabled={!selectedBank}
        >
          <Text style={styles.payNowButtonText}>Bayar Sekarang</Text>
        </TouchableOpacity>
      </View>
      {/* <TabBar /> */}
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
  backIcon: {
    width: 30,
    height: 30,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F5E81D",
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  italicText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 16,
  },
  bankOptionsContainer: {
    marginBottom: 16,
  },
  bankOptionContainer: {
    marginBottom: 8,
  },
  bankOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 10,
  },
  selectedBank: {
    borderColor: "#86B6F6",
    backgroundColor: "#B4D4FF",
  },
  bankImage: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  bankText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  payNowContainer: {
    paddingTop: 16,
    alignItems: "flex-end",
  },
  payNowButton: {
    padding: 16,
    backgroundColor: "#F5E81D",
    borderRadius: 10,
  },
  payNowButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default MetodePembayaran;
