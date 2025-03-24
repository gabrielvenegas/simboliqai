"use client";
import React, { useState, useEffect } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Clock, Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface TransactionQueryResult {
  transactions: Transaction[];
  totalCount: number;
}

const LIMIT = 10;

export default function TransactionHistoryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("All transactions");
  const [page, setPage] = useState(0);

  const supabase = createClient();
  const queryClient = useQueryClient();

  const fetchTransactions = async (
    pageParam: number,
  ): Promise<TransactionQueryResult> => {
    const start = pageParam * LIMIT;
    const end = start + LIMIT - 1;

    const { data, count, error } = await supabase
      .from("credit_transactions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      throw new Error(error.message);
    }

    return {
      transactions: data ?? [],
      totalCount: count ?? 0,
    };
  };

  const { data, error, isLoading, isFetching, isPlaceholderData } = useQuery<
    TransactionQueryResult,
    Error
  >({
    queryKey: ["transactions", page],
    queryFn: () => fetchTransactions(page),
    placeholderData: keepPreviousData,
  });

  const transactions = data?.transactions ?? [];
  const totalCount = data?.totalCount ?? 0;

  useEffect(() => {
    if (!isPlaceholderData) {
      const nextPage = page + 1;
      const nextStart = nextPage * LIMIT;
      if (nextStart < totalCount) {
        queryClient.prefetchQuery({
          queryKey: ["transactions", nextPage],
          queryFn: () => fetchTransactions(nextPage),
        });
      }
    }
  }, [data, isPlaceholderData, page, queryClient, totalCount]);

  const hasMore = (page + 1) * LIMIT < totalCount;

  const filteredTransactions = transactions.filter((transaction) => {
    const q = searchQuery.toLowerCase();

    if (searchQuery) {
      if (transaction.id.toLowerCase().includes(q)) return true;
      if (transaction.description?.toLowerCase().includes(q)) return true;
      return false;
    }

    if (currentFilter === "All transactions") return true;
    if (
      currentFilter === "Credits spent" &&
      transaction.transaction_type === "spend"
    )
      return true;
    if (
      currentFilter === "Credits added" &&
      transaction.transaction_type === "recharge"
    )
      return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Added a bit of padding on smaller devices */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Clock className="text-[#6a2fad]" />
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>
        </div>
        {/* Search and Filter */}
        <div className="bg-white rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search transactions"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{currentFilter}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setCurrentFilter("All transactions")}
                  >
                    All transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCurrentFilter("Credits spent")}
                  >
                    Credits spent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCurrentFilter("Credits added")}
                  >
                    Credits added
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Error: {error.message}
          </div>
        ) : (
          <>
            {/* Responsive Table Container */}
            <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date &amp; Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.created_at
                            ? format(
                                new Date(transaction.created_at),
                                "yyyy-MM-dd HH:mm:ss",
                              )
                            : "--"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.description}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            transaction.transaction_type === "recharge"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No transactions found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Responsive Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{page * LIMIT + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    (page + 1) * LIMIT,
                    transactions.length + page * LIMIT,
                  )}
                </span>{" "}
                of <span className="font-medium">{totalCount}</span>{" "}
                transactions
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((old) => Math.max(old - 1, 0))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !hasMore || isPlaceholderData /* or isPreviousData */
                  }
                  onClick={() => {
                    if (hasMore) {
                      setPage((old) => old + 1);
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </div>

            {isFetching && (
              <div className="text-center text-gray-500 mt-2">
                Loading next page...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
