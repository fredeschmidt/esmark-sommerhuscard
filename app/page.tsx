import type { Metadata } from "next";
import HouseList from "@/components/HouseList";
import { getListingHouses } from "@/lib/houses";

export const metadata: Metadata = {
  title: "Sommerhuse ved Vestkysten",
  description:
    "Hundevenlige sommerhuse med plads til mindst 6 personer ved den jyske vestkyst. Find dit feriehus hos Esmark.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const houses = getListingHouses();
  return (
    <HouseList
      heading="Sommerhuse ved Vestkysten"
      houses={houses}
      listName="Sommerhuse ved Vestkysten"
    />
  );
}
