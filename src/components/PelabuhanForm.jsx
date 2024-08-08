import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
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

  const fetchCountry = async (query) => {
    try {
      const res = await fetch(
        `https://api-hub.ilcs.co.id/my/n/negara?ur_negara=${query}`
      );
      const { data } = await res.json();
      if (data && data.length > 0) {
        setSuggestCountry(data[0]);
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
  useEffect(() => {
    if (suggestCountry) {
      setNegara(suggestCountry.ur_negara);
    }
  }, [suggestCountry]);

  const fetchPelabuhan = async (query) => {
    try {
      const res = await fetch(
        `https://api-hub.ilcs.co.id/my/n/pelabuhan?kd_negara=${suggestCountry.kd_negara}&ur_pelabuhan=${query}`
      );
      const { data } = await res.json();
      if (data && data.length > 0) {
        setSuggestPelabuhan(data[0].ur_pelabuhan);
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
  useEffect(() => {
    if (suggestPelabuhan) {
      setPelabuhan(suggestPelabuhan);
    }
  }, [suggestPelabuhan]);

  const fetchData = async (query) => {
    try {
      const [barangRes, bmRes] = await Promise.all([
        fetch(`https://api-hub.ilcs.co.id/my/n/barang?hs_code=${query}`),
        fetch(`https://api-hub.ilcs.co.id/my/n/tarif?hs_code=${query}`),
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
            value={negara}
            onChange={(e) => setNegara(e.target.value)}
            placeholder="Masukan Negara"
          />
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
