"use client"

import { useGetMyTransactionsQuery } from '@/redux/featured/Package/packageApi';
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TransactionHistory = () => {
  const {data: transactionHistory, isLoading, error} = useGetMyTransactionsQuery();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      inactive: { variant: 'secondary', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
      expired: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full mt-10">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mt-10">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-center py-8">Error loading transactions</p>
        </CardContent>
      </Card>
    );
  }

  if (!transactionHistory?.data?.transactions?.length) {
    return (
      <Card className="w-full mt-10">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No transactions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4 mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction History</span>
            <Badge variant="outline">
              {transactionHistory.data.totalTransactions} Transaction{transactionHistory.data.totalTransactions !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <caption className="text-sm text-gray-500 mb-4">A list of your recent transactions</caption>
              <thead>
                <tr className="border-b bg-primary">
                  <th className="text-left p-3 font-medium text-white">Package</th>
                  <th className="text-left p-3 font-medium text-white">Payment Type</th>
                  <th className="text-left p-3 font-medium text-white">Amount</th>
                  <th className="text-left p-3 font-medium text-white">Status</th>
                  <th className="text-left p-3 font-medium text-white">Subscription Period</th>
                  <th className="text-left p-3 font-medium text-white">Transaction Date</th>
                  <th className="text-right p-3 font-medium text-white">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.data.transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {transaction.packageName}
                      {transaction.isTrialPeriod && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Trial
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{transaction.paymentType}</Badge>
                    </td>
                    <td className="p-3 font-semibold text-green-600">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="p-3 text-sm">
                      <div>
                        <div className="text-gray-600">Start: {formatDate(transaction.subscriptionPeriod.start)}</div>
                        <div className="text-gray-600">End: {formatDate(transaction.subscriptionPeriod.end)}</div>
                      </div>
                    </td>
                    <td className="p-3">{formatDate(transaction.createdAt)}</td>
                    <td className="p-3 text-right text-xs text-gray-500 font-mono">
                      {transaction.transactionId || "After add free trail"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {transactionHistory.data.transactions.map((transaction) => (
              <Card key={transaction.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{transaction.packageName}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{transaction.paymentType}</Badge>
                        {transaction.isTrialPeriod && (
                          <Badge variant="secondary" className="text-xs">Trial</Badge>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <div className="font-semibold text-green-600 text-lg">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <div className="font-medium">{formatDate(transaction.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Subscription Period:</div>
                    <div className="text-sm">
                      <div>{formatDate(transaction.subscriptionPeriod.start)} - {formatDate(transaction.subscriptionPeriod.end)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">Transaction ID:</div>
                    <div className="text-xs font-mono text-gray-700 break-all">
                      {transaction.transactionId}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;