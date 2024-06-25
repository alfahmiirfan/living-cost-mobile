import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// import { ExternalLink } from '@/components/ExternalLink';
import { HoverEffect } from "react-native-gesture-handler";
import TabBar from "@/components/TabBar";

interface BankOptionProps {
  bankName: string;
  bankImage: string;
  onSelect: (bankName: string, bankImage: string) => void;
}

const BankOption: React.FC<BankOptionProps> = ({
  bankName,
  bankImage,
  onSelect,
}) => (
  <TouchableOpacity
    style={styles.bankOptionContainer}
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

  const handleSelectBank = async (bankName: string, bankImage: string) => {
    setSelectedBank(bankName);
    setSelectedBankImage(bankImage);
    try {
      await AsyncStorage.setItem("selectedBank", bankName);
      await AsyncStorage.setItem("selectedBankImage", bankImage);
      navigation.navigate("virtualAccount", { bankName, bankImage });
    } catch (error) {
      console.error("Failed to save the data to the storage");
    }
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
        />
        <BankOption
          bankName="BANK BNI"
          bankImage="assets/images/bni.svg"
          onSelect={handleSelectBank}
        />
        <BankOption
          bankName="BANK BCA"
          bankImage="assets/images/bca.svg"
          onSelect={handleSelectBank}
        />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: </Text>
        <Text style={styles.totalAmount}>Rp. 1.250.000</Text>
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
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
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
});

export default MetodePembayaran;
