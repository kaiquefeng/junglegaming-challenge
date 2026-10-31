import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs'
import type { NftSort, NftTab } from '../../services/catalog.types'
import type { CatalogToolbarProps } from './catalog-toolbar.types'

const tabs: { value: NftTab; label: string }[] = [
  { value: 'all', label: 'Todos os NFTs' },
  { value: 'new', label: 'Novos lançamentos' },
  { value: 'trending', label: 'Em alta' },
]

const sortOptions: { value: NftSort; label: string }[] = [
  { value: 'recent', label: 'Listados recentemente' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

export function CatalogToolbar({
  tab,
  sort,
  onTabChange,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Tabs value={tab} onValueChange={(value) => onTabChange(value as NftTab)}>
        <TabsList
          variant="line"
          aria-label="Filtrar NFTs"
          className="h-auto flex-wrap justify-start p-0"
        >
          {tabs.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="flex-none px-3 text-sm font-bold text-foreground data-[state=active]:text-highlight after:bg-highlight"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 text-sm">
        <span id="sort-label">Ordenar por:</span>
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as NftSort)}
        >
          <SelectTrigger
            aria-labelledby="sort-label"
            className="w-auto gap-2 border-0 bg-transparent px-0 shadow-none dark:bg-transparent"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
