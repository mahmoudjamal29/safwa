'use client'

import * as React from 'react'
import { ComponentRef } from 'react'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

type PhoneInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'ref' | 'value'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void
  }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<ComponentRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, ...props }, ref) => {
      return (
        <RPNInput.default
          className={cn(
            'flex border-none! **:h-10 [&_svg:not([class*=size-])]:size-6',
            className
          )}
          countrySelectComponent={CountrySelect}
          flagComponent={FlagComponent}
          inputComponent={InputComponent}
          onChange={(newValue) => {
            const normalized =
              typeof newValue === 'string' ? newValue.replace(/^\+/, '') : ''

            onChange?.((normalized || undefined) as RPNInput.Value)
          }}
          ref={ref}
          smartCaret={false}
          value={value || undefined}
          {...props}
        />
      )
    }
  )
PhoneInput.displayName = 'PhoneInput'

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      'border-e-none rounded-s-none rounded-e-lg rtl:rounded-s-lg rtl:rounded-e-none',
      className
    )}
    ref={ref}
    {...props}
  />
))
InputComponent.displayName = 'InputComponent'

type CountryEntry = { label: string; value: RPNInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  onChange: (country: RPNInput.Country) => void
  options: CountryEntry[]
  value: RPNInput.Country
}

const CountrySelect = ({
  disabled,
  onChange,
  options: countryList,
  value: selectedCountry
}: CountrySelectProps) => {
  const t = useTranslations('components.ui.phoneInput')
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover
      modal
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          setSearchValue('')
        }
      }}
      open={isOpen}
    >
      <PopoverTrigger asChild>
        <Button
          className="bg-background border-input text-foreground aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20 border-e-none flex gap-1 rounded-s-lg rounded-e-none px-3 transition-[color,box-shadow] focus:z-10 focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 [[readonly]]:cursor-not-allowed"
          disabled={disabled}
          type="button"
          variant="outline"
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              'text-muted-foreground -me-2 size-4',
              disabled ? 'hidden' : 'opacity-100'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            className="bg-background text-foreground placeholder:text-muted-foreground/80 [[readonly]]:bg-muted/80 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20 my-2 flex h-8.5 w-full border px-3 text-sm leading-(--text-sm--line-height) shadow-xs shadow-black/5 transition-[color,box-shadow] file:me-3 file:h-full file:border-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 [[readonly]]:cursor-not-allowed"
            onValueChange={(value) => {
              setSearchValue(value)
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    '[data-radix-scroll-area-viewport]'
                  )
                  if (viewportElement) {
                    viewportElement.scrollTop = 0
                  }
                }
              }, 0)
            }}
            placeholder={t('searchPlaceholder')}
            value={searchValue}
          />
          <CommandList>
            <ScrollArea className="h-72" ref={scrollAreaRef}>
              <CommandEmpty>{t('noCountryFound')}</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ label, value }) =>
                  value ? (
                    <CountrySelectOption
                      country={value}
                      countryName={label}
                      key={value}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                      selectedCountry={selectedCountry}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  onChange: (country: RPNInput.Country) => void
  onSelectComplete: () => void
  selectedCountry: RPNInput.Country
}

const CountrySelectOption = ({
  country,
  countryName,
  onChange,
  onSelectComplete,
  selectedCountry
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country)
    onSelectComplete()
  }

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-foreground/50 text-sm">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`${country === selectedCountry ? 'opacity-100' : 'opacity-0'} ms-auto size-4`}
      />
    </CommandItem>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-6 items-center justify-center overflow-hidden rounded-sm [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export { PhoneInput }
