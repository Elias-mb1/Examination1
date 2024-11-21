
"use client";
import { useEffect, useState } from "react";
import { MenuItems, Dip, Drink } from "../types";

//dip api
const API_KEY = "yum-7BTxHCyHhzI";
const BASE_URL =
  "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu?type=dip";

export const useDipData = () => {
  const [dips, setDips] = useState<Dip[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDipData = async () => {
      try {
        const response = await fetch(BASE_URL, {
          headers: {
            accept: "application/json",
            "x-zocom": API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch wonton data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("fetched dip:", data);
        setDips(data.items);
      } catch (error) {
        console.error("Error fetching dip data:", error);
        setError("Failed to fetch dip data");
      }
    };

    fetchDipData();
  }, []);

  return { dips, error };
};

//drink api

const BASE_URL_drink =
  "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu?type=drink";

export const useDrinkData = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrinkData = async () => {
      try {
        const response = await fetch(BASE_URL_drink, {
          headers: {
            accept: "application/json",
            "x-zocom": API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch wonton data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("fetched drink:", data);
        setDrinks(data.items);
      } catch (error) {
        console.error("Error fetching drink data:", error);
        setError("Failed to fetch drink data");
      }
    };

    fetchDrinkData();
  }, []);

  return { drinks, error };
};

//wonton api


const BASE_URL_wonton =
  "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu?type=wonton";

export const useWontonData = () => {
  const [wontons, setWontons] = useState<MenuItems[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWontonData = async () => {
      try {
        const response = await fetch(BASE_URL_wonton, {
          headers: {
            accept: "application/json",
            "x-zocom": API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch wonton data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("fetched wonton:", data);
        setWontons(data.items);
      } catch (error) {
        console.error("Error fetching wonton data:", error);
        setError("Failed to fetch wonton data");
      }
    };

    fetchWontonData();
  }, []);

  return { wontons, error };
};
