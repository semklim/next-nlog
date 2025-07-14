import { Card, CardContent } from "@/components/ui/shadcn/card"

interface PostErrorMessageProps {
  error: string
}

export const PostErrorMessage = ({ error }: PostErrorMessageProps) => (
  <Card className="border-red-200 bg-red-50">
    <CardContent className="p-4">
      <p className="text-red-600">{error}</p>
    </CardContent>
  </Card>
)