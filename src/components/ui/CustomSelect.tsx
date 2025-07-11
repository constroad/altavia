"use client";

import {
  SelectRoot,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValueText,
  SelectLabel,
} from "@/components/ui/select";
import { Portal, createListCollection } from "@chakra-ui/react";
import { FC } from "react";

type Item = { label: string; value: string };

interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  items: Item[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
  width?: any;
}

export const CustomSelect: FC<CustomSelectProps> = ({
  label,
  placeholder = "Selecciona una opción",
  items,
  value,
  onChange,
  size = "sm",
  width = "200px",
}) => {
  const collection = createListCollection({ items });

  return (
    <SelectRoot
      collection={collection}
      value={[value]}
      onValueChange={(details) => {
        const newValue = Array.isArray(details.value) ? details.value[0] : '';
        if (newValue) {
          onChange(newValue);
        }
      }}
      size={size}
      width={width}
      className="custom-select-trigger custom-select-trigger"
      positioning={{
        placement: "top-start", // o "top", "top-end"
      }}
    >
      {label && <SelectLabel fontSize={{ base: 10, md: 12 }}>{label}</SelectLabel>}
      <SelectTrigger>
        <SelectValueText fontSize={{ base: 10, md: 12 }} lineHeight='12px' placeholder={placeholder} />
      </SelectTrigger>
      <Portal>
        <SelectContent>
          {collection.items.map((item) => (
            <SelectItem fontSize={{ base: 10, md: 12 }} lineHeight='12px' key={item.value} item={item}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Portal>
    </SelectRoot>
  );
};
