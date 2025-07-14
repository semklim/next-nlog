import { Card, CardContent } from "@/components/ui/shadcn/card";
import { useTranslations } from "next-intl";

interface PostListEmptyStateProps {
  filters: { search: string; category: string }
}

export const PostListEmptyState = ({ filters }: PostListEmptyStateProps) => {
  const t = useTranslations('PostList')

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {filters.search || filters.category !== 'all' ? t('noPostsFound') : t('noPostsYet')}
        </h3>
        <p className="text-gray-600">
          {filters.search || filters.category !== 'all'
            ? t('adjustFilters')
            : t('beFirstToPost')
          }
        </p>
      </CardContent>
    </Card>
  )
}
