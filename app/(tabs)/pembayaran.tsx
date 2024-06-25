import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
// import TabLayout from "./layout";

interface DropdownItem {
  label: string;
  value: string;
}

const years: DropdownItem[] = [
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
];

const months: DropdownItem[] = [
  { label: "Januari", value: "Januari" },
  { label: "Februari", value: "Februari" },
  { label: "Maret", value: "Maret" },
  { label: "April", value: "April" },
  { label: "Mei", value: "Mei" },
  { label: "Juni", value: "Juni" },
  { label: "Juli", value: "Juli" },
  { label: "Agustus", value: "Agustus" },
  { label: "September", value: "September" },
  { label: "Oktober", value: "Oktober" },
  { label: "November", value: "November" },
  { label: "Desember", value: "Desember" },
];

const dummyData = [
  {
    no: 1,
    tahun: "2023",
    bulan: "November",
  },
];

const Pembayaran: React.FC = () => {
    const navigation:any = useNavigation()
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  return (
      // <TabLayout>  
    <View style={styles.wrap}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Dashboard User</Text>
        <Text style={styles.subtitle}>Muhammad Alfahmi Irfan</Text>
        <View style={styles.section}>
          <Text style={styles.heading}>Informasi Pembayaran Living Cost</Text>
        </View>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tahun" value={null} />
            {years.map((year) => (
              <Picker.Item
                key={year.value}
                label={year.label}
                value={year.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Bulan" value={null} />
            {months.map((month) => (
              <Picker.Item
                key={month.value}
                label={month.label}
                value={month.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>No</Text>
            <Text style={styles.tableHeaderText}>Tahun</Text>
            <Text style={styles.tableHeaderText}>Bulan</Text>
            <Text style={styles.tableHeaderText}>Aksi</Text>
          </View>
          <FlatList
            data={dummyData}
            keyExtractor={(item) => item.no.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.no}</Text>
                <Text style={styles.tableCell}>{item.tahun}</Text>
                <Text style={styles.tableCell}>{item.bulan}</Text>
                <Text style={styles.tableCell}>
                  <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate("metodePembayaran")}>
                    
                    <Text style={styles.payButtonText}>Bayar</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    padding: 28,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  section: {
    paddingBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
  },
  dropdownContainer: {
    marginBottom: 16,
    width: 180,
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F5E81D",
  },
  tableContainer: {
    marginTop: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#085288",
    padding: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  statusBadge: {
    backgroundColor: "#32D62F",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
  },
  payButton: {
    backgroundColor: "#085288",
    padding: 10,
    borderRadius: 8,
  },
  payButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Pembayaran;
