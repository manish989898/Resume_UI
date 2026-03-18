import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    transactions: [
        {
          timestamp: '2024-07-24 10:00:00.123',
          user: 'User 1',
          level: 'INFO',
          message: 'User logged in',
        },
        {
          timestamp: '2024-07-24 09:59:58.987',
          user: 'User 5',
          level: 'ERROR',
          message: 'Database connection error',
        },
        {
          timestamp: '2024-07-24 09:59:55.456',
          user: 'User 3',
          level: 'WARNING',
          message: 'Resource not found',
        },
        {
          timestamp: '2024-07-24 09:59:55.456',
          user: 'User 2',
          level: 'WARNING',
          message: 'Resource not found',
        },
      ]
}

export const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        getTransactions: (state,action) => {
            return { ...state, transactions: action.payload}
        }
    }
})

export const { getTransactions } = transactionSlice.actions
export default transactionSlice.reducer