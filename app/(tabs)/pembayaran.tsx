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

interface DropdownItem {
  label: string;
  value: string;
}

// const years: DropdownItem[] = [
//   { label: "2022", value: "2022" },
//   { label: "2023", value: "2023" },
//   { label: "2024", value: "2024" },
//   { label: "2025", value: "2025" },
// ];

// const months: DropdownItem[] = [
//   { label: "Januari", value: "Januari" },
//   { label: "Februari", value: "Februari" },
//   { label: "Maret", value: "Maret" },
//   { label: "April", value: "April" },
//   { label: "Mei", value: "Mei" },
//   { label: "Juni", value: "Juni" },
//   { label: "Juli", value: "Juli" },
//   { label: "Agustus", value: "Agustus" },
//   { label: "September", value: "September" },
//   { label: "Oktober", value: "Oktober" },
//   { label: "November", value: "November" },
//   { label: "Desember", value: "Desember" },
// ];

const Pembayaran: React.FC = () => {
  const navigation: any = useNavigation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>('');
  const [years, setYears] = useState<DropdownItem[]>([]);
  // const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [username, setUsername] = useState<string | null>("");

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      if (!auth) {
        navigation.navigate("login");
      }
      const name = await AsyncStorage.getItem("username");
      setUsername(name);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    getData();
    getYears();
  }, []);

  const getData = (year:string|null = '') => {
    const dataIncome = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          "https://sman10pentagon-livingcost.my.id/api/v1/income/list/siswa?year=" + year,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const filterData = response.data.data.filter(
          (item: any) => item.status == "Belum Bayar"
        );
        setData(filterData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    dataIncome();
  }

  const getYears = (year:string = '') => {
    const dataYears = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          "https://sman10pentagon-livingcost.my.id/api/v1/income/list/tahun",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let temp = JSON.parse(response.data.data);
        var result = Object.keys(temp).map((key) => temp[key]);
        result = result.map((item: string|number) => ({label: item, value: item}))
        if (result) {
          setYears(result);
          if (result.length > 0) {
            setSelectedYear(result[0].label)
          }
        } else {
          setYears([]);
        }
        // const filterData = response.data.data.filter(
        //   (item: any) => item.status == "Belum Bayar"
        // );
        // setData(filterData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    dataYears();
  }

  const setFilter = (value: string | null) => {
    setSelectedYear(value)
    getData(value)
  }

  const toMetodePembayaran = async (id: string) => {
    await AsyncStorage.setItem("id_income", id.toString());
    navigation.navigate("metodePembayaran");
  };

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
    // <View style={styles.wrap}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Selamat Datang,</Text>
          <Text style={styles.userName}>{username}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Pembayaran Living Cost</Text>
        </View>
        <View style={styles.dropdownWrapper}>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setFilter(itemValue)}
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
          {/* <View style={styles.dropdownContainer}>
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
          </View> */}
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
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => toMetodePembayaran(item.id)}
                  >
                    <Text style={styles.payButtonText}>Bayar</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            )}
          />
        </View>
        {renderPagination()}
      </SafeAreaView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingRight: 28,
    // paddingLeft: 28,
  },
  header: {
    paddingRight: 28,
    paddingLeft: 28,
    paddingTop: 28,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: "#333333",
  },
  userName: {
    fontSize: 16,
    color: "#333333",
  },
  section: {
    paddingBottom: 16,
  },
  heading: {
    paddingRight: 28,
    paddingLeft: 28,
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownWrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  dropdownContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    paddingRight: 28,
    paddingLeft: 28,

  },
  picker: {
    height: 50,
    width: "50%",
    borderRadius: 2,
    backgroundColor: '#F5E81D',
  },
  tableContainer: {
    // marginTop: 16,
    // borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    paddingLeft: 28,
    paddingRight: 28,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#085288",
    padding: 10,
    // paddingRight: 32,
    paddingLeft: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    // textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "##F5E81D",
    padding: 8,
    // paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    // textAlign: "center",
    fontSize: 14,
  },
  payButton: {
    backgroundColor: "#085288",
    padding: 6,
    borderRadius: 4,
    width: 60,
  },
  payButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pageButton: {
    marginHorizontal: 20,
    fontSize: 14,
    color: "blue",
  },
  pageNumber: {
    fontSize: 16,
  },
});

export default Pembayaran;
