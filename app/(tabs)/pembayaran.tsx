import React, { useEffect, useState } from "react";
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
import { getToken, isAuthenticated } from "@/utils/storage";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [username, setUsername] = useState<string|null>('');

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      if (!auth) {
        navigation.navigate("login");
      }
      const name = await AsyncStorage.getItem('username');
      setUsername(name)
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const dataIncome = async () => {
      try {
        const token = await getToken();
        const response = await axios
          .get("http://127.0.0.1:8000/api/v1/income/list/siswa", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const filterData = response.data.data.filter((item: any) => item.status == 'Belum Bayar');
            // console.log(response.data.data);
            setData(filterData);
            setLoading(false);
          });
        console.log(data);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    dataIncome();
  }, []);

  const toMetodePembayaran = async (id:string) => {
    await AsyncStorage.setItem("id_income", id);
    navigation.navigate("metodePembayaran");
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentPageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        <Text style={styles.pageButton}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.pageNumber}>
        {currentPage} / {totalPages}
      </Text>
      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      >
        <Text style={styles.pageButton}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
      // <TabLayout>  
    <View style={styles.wrap}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Dashboard User</Text>
        <Text style={styles.subtitle}>{username}</Text>
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
            data={currentPageData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>{item.year}</Text>
                <Text style={styles.tableCell}>{item.month}</Text>
                <Text style={styles.tableCell}>
                  <TouchableOpacity style={styles.payButton} onPress={() => toMetodePembayaran(item.id)}>
                    <Text style={styles.payButtonText}>Bayar</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
      {renderPagination()}
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pageButton: {
    marginHorizontal: 10,
    fontSize: 18,
    color: "blue",
  },
  pageNumber: {
    fontSize: 18,
  },
});

export default Pembayaran;