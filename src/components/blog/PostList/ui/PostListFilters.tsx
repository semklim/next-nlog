import { Input } from "@/components/ui/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select"
import { Filter, Search } from "lucide-react"
import { AppConfig, useTranslations } from "next-intl"

// Sub-components
interface PostListFiltersProps {
  searchInput: string
  setSearchInput: (value: string) => void
  selectedCategory: string
  handleSearchSubmit: (e: React.FormEvent) => void
  handleCategoryChange: (category: string) => void
  isLoading: boolean
}

const getCategories = (): (keyof AppConfig['Messages']['PostList']['categories'])[] => [
  'all',
  'technology',
  'lifestyle',
  'travel',
  'food',
  'health',
  'business',
  'education',
  'entertainment'
]

export const PostListFilters = ({
  searchInput,
  setSearchInput,
  selectedCategory,
  handleSearchSubmit,
  handleCategoryChange,
  isLoading,
}: PostListFiltersProps) => {
  const t = useTranslations('PostList')

  const categories = getCategories()



  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </form>

      <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={isLoading}>
        <SelectTrigger className="w-full sm:w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category} value={category}>
              {t(`categories.${category}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}