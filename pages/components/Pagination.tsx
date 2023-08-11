// components/Pagination.tsx
import usePagination from '@lucasmogari/react-pagination';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, PropsWithChildren, ReactNode } from 'react';

type Props = {
  page: number;
  itemCount: number;
  perPage: number;
};

const Pagination = ({ page, itemCount, perPage }: Props) => {
  // use the usePagination hook
  // getPageItem - function that returns the type of page based on the index.
  // size - the number of pages
  const { getPageItem, totalPages } = usePagination({
    totalItems: itemCount,
    page: page,
    itemsPerPage: perPage,
    maxPageItems: 7,
  });

  const firstPage = 1;
  // calculate the next page
  const nextPage = Math.min(page + 1, totalPages);
  // calculate the previous page
  const prevPage = Math.max(page - 1, firstPage);
  // create a new array based on the total pages
  const arr = new Array(totalPages);

  return (
    <div className="flex gap-2 items-center">
      {[...arr].map((_, i) => {
        // getPageItem function returns the type of page based on the index.
        // it also automatically calculates if the page is disabled.
        const { page, disabled, current } = getPageItem(i);
        console.log(page, current);

        if (page === 'previous') {
          return (
            <PaginationLink page={prevPage} disabled={disabled} key={page}>
              {`<`}
            </PaginationLink>
          );
        }

        if (page === 'gap') {
          return <span key={`${page}-${i}`}>...</span>;
        }

        if (page === 'next') {
          return (
            <PaginationLink page={nextPage} disabled={disabled} key={page}>
              {`>`}
            </PaginationLink>
          );
        }

        return (
          <PaginationLink active={current} key={page} page={page!}>
            {page}
          </PaginationLink>
        );
      })}
    </div>
  );
};

type PaginationLinkProps = {
  page?: number | string;
  active?: boolean;
  disabled?: boolean;
} & PropsWithChildren;

function PaginationLink({ page, children, ...props }: PaginationLinkProps) {
  const router = useRouter();
  const query = router.query;

  // we use existing data from router query, we just modify the page.
  const q = { ...query, page };
  return (
    <Link
      // only use the query for the url, it will only modify the query, won't modify the route.
      href={{ query: q }}
      // toggle the appropriate classes based on active, disabled states.
      className={cn({
        'p-2': true,
        'font-bold text-indigo-700': props.active,
        'text-indigo-400': !props.active,
        'pointer-events-none text-gray-200': props.disabled,
      })}
    >
      {children}
    </Link>
  );
}
export default memo(Pagination);
