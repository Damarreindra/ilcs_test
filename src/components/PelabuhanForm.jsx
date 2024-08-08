import {
  Box,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

function PelabuhanForm() {
  const [negara, setNegara] = useState("");
  const [pelabuhan, setPelabuhan] = useState("");
  const [kb, setKb] = useState("");
  const [bm, setBm] = useState("");
  const [barang, setBarang] = useState("");
  const [suggestCountry, setSuggestCountry] = useState("");
  const [suggestPelabuhan, setSuggestPelabuhan] = useState("");
  const [harga, setHarga] = useState(0);
  const [displayHarga, setDisplayHarga] = useState("");
  const [total, setTotal] = useState(0);

  const fetchCountry = async (query) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}/negara?ur_negara=${query}`
      );
      const { data } = await res.json();
      if (data && data.length > 0) {
        setSuggestCountry(data);
      } else {
        setSuggestCountry("");
      }
    } catch (err) {
      throw new Error(err);
    }
  };
  useEffect(() => {
    if (negara.length === 3) {
      fetchCountry(negara);
    }
  }, [negara]);
  const handleCountrySelect = (selectedCountry) => {
    setNegara(selectedCountry);
    setSuggestCountry([]);
  };

  const fetchPelabuhan = async (query) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}/pelabuhan?kd_negara=${negara.kd_negara}&ur_pelabuhan=${query}`
      );
      const { data } = await res.json();
      if (data && data.length > 0) {
        setSuggestPelabuhan(data);
      } else {
        setSuggestPelabuhan("");
      }
    } catch (err) {
      throw new Error(err);
    }
  };
  useEffect(() => {
    if (pelabuhan.length === 3) {
      fetchPelabuhan(pelabuhan);
    }
  }, [pelabuhan]);

  const handlePelabuhanSelect = (selectedPelabuhan) => {
    setPelabuhan(selectedPelabuhan.ur_pelabuhan);
    setSuggestPelabuhan([]);
  };

  const fetchData = async (query) => {
    try {
      const [barangRes, bmRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API}/barang?hs_code=${query}`),
        fetch(`${process.env.REACT_APP_API}/tarif?hs_code=${query}`),
      ]);

      const { data: barangData } = await barangRes.json();
      const { data: bmData } = await bmRes.json();

      if (barangData && barangData.length > 0 && bmData && bmData.length > 0) {
        setBarang(barangData[0]);
        setBm(bmData[0].bm);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const formatNumber = (number) => {
    if (isNaN(number)) return "";
    return number.toLocaleString("id-ID");
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/\./g, "");
    setHarga(rawValue);
  };

  useEffect(() => {
    setDisplayHarga(formatNumber(Number(harga)));
  }, [harga]);

  useEffect(() => {
    if (kb.length > 7) {
      fetchData(kb);
    }
  }, [kb]);

  useEffect(() => {
    if (harga && bm) {
      setTotal(formatNumber(harga / bm));
    }
  }, [harga, bm]);

  useEffect(() => {
    setPelabuhan("");
    setSuggestPelabuhan([]);
  }, [negara]);

  return (
    <Box p={12} w={"full"} bg={"white"} borderWidth={1}>
      <Text fontWeight={"bold"} fontSize={"xl"}>
        Form Pelabuhan
      </Text>
      <Flex direction={{ base: "column", md: "row" }} gap={4}>
        <FormControl>
          <FormLabel>Negara</FormLabel>
          <Input
            type="text"
            value={negara.ur_negara}
            onChange={(e) => setNegara(e.target.value)}
            placeholder="Masukan Negara"
          />
          <Menu isOpen={suggestCountry.length > 0}>
            {suggestCountry.length > 0 && (
              <MenuList>
                {suggestCountry.map((country, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleCountrySelect(country)}
                  >
                    {country.ur_negara}
                  </MenuItem>
                ))}
              </MenuList>
            )}
          </Menu>
        </FormControl>
        <FormControl>
          <FormLabel>Pelabuhan</FormLabel>
          <Input
            type="text"
            value={pelabuhan}
            onChange={(e) => setPelabuhan(e.target.value)}
            placeholder="Masukan Pelabuhan"
            isDisabled={!suggestCountry}
          />
          <Menu isOpen={suggestPelabuhan.length > 0}>
            {suggestPelabuhan.length > 0 && (
              <MenuList>
                {suggestPelabuhan.map((port, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handlePelabuhanSelect(port)}
                  >
                    {port.ur_pelabuhan}
                  </MenuItem>
                ))}
              </MenuList>
            )}
          </Menu>
        </FormControl>
      </Flex>

      <FormControl>
        <FormLabel>Kode Barang</FormLabel>

        <Flex direction={{ base: "column", md: "row" }} gap={4}>
          <Input
            type="text"
            value={kb}
            onChange={(e) => setKb(e.target.value)}
            placeholder="Masukkan Kode Barang"
          />

          <Textarea
            placeholder="Nama Barang"
            value={barang ? `${barang.sub_header} ${barang.uraian_id}` : ""}
            isReadOnly
          />
        </Flex>
      </FormControl>

      <Flex direction={{ base: "column", md: "row" }} gap={4}>
        <FormControl>
          <FormLabel>Harga </FormLabel>
          <Input
            type="text"
            isDisabled={!bm}
            value={displayHarga}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tarif Bea Masuk</FormLabel>
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <Input type="number" value={bm} w={100} readOnly /> %
            <Input type="text" readOnly value={total} />
          </Flex>
        </FormControl>
      </Flex>
    </Box>
  );
}

export default PelabuhanForm;
