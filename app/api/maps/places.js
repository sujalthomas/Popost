"use client";

import { useState, useMemo } from "react";
import { useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export default function Places({ value, onChange, onSelect }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return null;

  return <PlacesAutocomplete value={value} onChange={onChange} onSelect={onSelect} />;
}

// In your Map function
function Map() {
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState(""); // <--- state to hold the selected address

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    // Here you can do anything else with the selected address, 
    // like setting it in a form field
  };

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} onAddressSelect={handleAddressSelect} />
      </div>
      {selected && <Marker position={selected} />}
    </>
  );
}

const PlacesAutocomplete = ({ value: inputValue, onChange, onSelect }) => {
  const {
    ready,
    value: autocompleteValue,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();


  const handleSelect = async (address) => {
    console.log("Selected Address from Places:", address);
    setValue(address, false);
    clearSuggestions();
    // setSelected(address); // <-- Comment out or remove this line
    if (onSelect) onSelect(address); // This will update the address in the parent component or form
};




  return (
    <Combobox onSelect={handleSelect} className="relative">
      <ComboboxInput
        value={inputValue}
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        disabled={!ready}
        className={`combobox-input w-full form_input relative z-10`}
        placeholder="Search an address"
      />
      <ComboboxPopover className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-300 shadow-md max-h-40 overflow-y-auto">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} className="px-4 py-2 hover:bg-gray-200 cursor-pointer" />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>

  );
};