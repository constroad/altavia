import React from 'react';

import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control'
import { Portal, Select, createListCollection } from '@chakra-ui/react';

interface SelectFieldProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  isRequired?: boolean;
  field?: any;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  isRequired = false,
  field,
}) => {

  const frameworks = createListCollection({
    items: options,
  })

  return (
    <Select.Root
      {...field}
      id={name}
      name={field?.name}
      value={field?.value}
      onValueChange={({ value }) => field?.onChange(value)}
      onInteractOutside={() => field?.onBlur()}
      collection={frameworks}
      // style={{
      //   padding: '6px',
      //   borderRadius: '6px',
      //   fontSize: '14px',
      //   border: '1px solid #CBD5E0',
      //   width: '100%',
      // }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Selecciona un rol" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content zIndex={99999}>
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
