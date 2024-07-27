import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getToken, isAuthenticated } from "@/utils/storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DropdownItem {
  label: string;
  value: string;
}

// const years: DropdownItem[] = [
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

type IncomeData = {
  id: number;
  year: number;
  month: string;
  status: string;
};

const Informasi: React.FC = () => {
  const [data, setData] = useState<IncomeData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [years, setYears] = useState<DropdownItem[]>([]);
  // const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
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
        // const filterData = response.data.data.filter(
        //   (item: any) => item.status == "Belum Bayar"
        // );
        setData(response.data.data)
        // setData(filterData);
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

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Telat Bayar":
        return styles.statusRed;
      case "Belum Bayar":
        return styles.statusYellow;
      case "Sudah Bayar":
        return styles.statusGreen;
      default:
        return styles.statusDefault;
    }
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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>No Data Available</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Datang,</Text>
        <Text style={styles.userName}>{username}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Informasi Pembayaran Living Cost</Text>
      </View>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tahun" value={null} />
          {years.map((year) => (
            <Picker.Item key={year.value} label={year.label} value={year.value} />
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
            <Picker.Item key={month.value} label={month.label} value={month.value} />
          ))}
        </Picker>
      </View> */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>No</Text>
          <Text style={styles.tableHeaderText}>Tahun</Text>
          <Text style={styles.tableHeaderText}>Bulan</Text>
          <Text style={styles.tableHeaderText}>Status</Text>
        </View>
        <FlatList
          data={currentPageData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </Text>
              <Text style={styles.tableCell}>{item.year}</Text>
              <Text style={styles.tableCell}>{item.month}</Text>
              <View style={[styles.tableCell, styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>
                  {item.status == "Sudah Bayar" ? "Lunas" : item.status}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      {renderPagination()}
    </SafeAreaView>
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
    paddingRight: 26,
    // paddingLeft: 0,
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    // paddingLeft: 4,
    // textAlign: "center",
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: "center",
    // justifyContent: "center",
  },
  statusText: {
    color: "#black",
    fontSize: 12,
    fontWeight: "500",
  },
  statusRed: {
    backgroundColor: "red",
  },
  statusYellow: {
    backgroundColor: "#FFFF00",
  },
  statusGreen: {
    backgroundColor: "#32D62F",
  },
  statusDefault: {
    backgroundColor: "gray",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pageButton: {
    marginHorizontal: 20,
    fontSize: 16,
    color: "blue",
  },
  pageNumber: {
    fontSize: 16,
  },
});

export default Informasi;
