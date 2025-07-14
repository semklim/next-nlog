import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/shadcn/pagination"

interface PostListPaginationProps {
  currentPage: number
  hasNextPage: boolean
  handlePageChange: (page: number) => void
}

export const PostListPagination = ({ currentPage, hasNextPage, handlePageChange }: PostListPaginationProps) => {
  if (currentPage <= 1 && !hasNextPage) return null

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, currentPage + (hasNextPage ? 1 : 0)) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i
            if (pageNum > currentPage + 2) return null

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={pageNum === currentPage}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          {hasNextPage && (
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}