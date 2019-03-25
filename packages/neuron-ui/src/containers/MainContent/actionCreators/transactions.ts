import { MainActions } from '../reducer'
import { getTransactions, GetTransactionsParams, getTransaction } from '../../../services/UILayer'

export default {
  getTransaction: (hash: string) => {
    getTransaction(hash)
    return {
      type: MainActions.UpdateLoading,
      payload: {
        transaction: true,
      },
    }
  },

  getTransactions: (params: GetTransactionsParams) => {
    getTransactions(params)
    return {
      type: MainActions.UpdateLoading,
      payload: {
        transactions: true,
      },
    }
  },
}
