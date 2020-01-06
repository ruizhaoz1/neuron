import { ipcRenderer } from 'electron'
import initConnection from 'database/chain/ormconfig'
import IndexerRPC from 'block-sync-renderer/indexer/indexer-rpc'
import BlockListener from 'block-sync-renderer/sync/block-listener'
import IndexerQueue from 'block-sync-renderer/indexer/queue'
import LockUtils from 'models/lock-utils'
import DaoUtils from 'models/dao-utils'
import { register as registerTxStatusListener, unregister as unregisterTxStatusListener } from './tx-status-listener'
import CommonUtils from 'utils/common'

const isIndexerEnabled = async (url: string): Promise<boolean> => {
  const indexerRPC = new IndexerRPC(url)
  try {
    await CommonUtils.retry(3, 100, () => {
      return indexerRPC.getLockHashIndexStates()
    })
    return true
  } catch {
    return false
  }
}

// Normal block syncing with BlockListener.
// This runs when CKB Indexer module is not enabled.
let blockListener: BlockListener | null
const startBlockSyncing = async (url: string, genesisBlockHash: string, lockHashes: string[], rescan: boolean) => {
  if (blockListener) {
    await blockListener.stopAndWait()
  }

  // TODO: Do not clean meta info here!!!
  LockUtils.cleanInfo()
  DaoUtils.cleanInfo()

  await initConnection(genesisBlockHash)

  blockListener = new BlockListener(url, lockHashes)
  blockListener.start(rescan)
}

// Indexer syncing with IndexerQueue.
// This runs when CKB Indexer module is enabled.
let indexerQueue: IndexerQueue | null
const startIndexerSyncing = async (nodeURL: string, genesisBlockHash: string, lockHashes: string[]) => {
  if (indexerQueue) {
    await indexerQueue.stopAndWait()
  }

  // TODO: Do not clean meta info here!!!
  LockUtils.cleanInfo()
  DaoUtils.cleanInfo()

  await initConnection(genesisBlockHash)

  const lockHashInfos = lockHashes.map(h => {
    return {
      lockHash: h,
      isImporting: false
    }
  })

  indexerQueue = new IndexerQueue(nodeURL, lockHashInfos)

  indexerQueue.start()
  indexerQueue.processFork()
}

ipcRenderer.on('block-sync:start', async (_, url: string, genesisHash: string, lockHashes: string[], rescan = false) => {
  if (await isIndexerEnabled(url)) {
    await startIndexerSyncing(url, genesisHash, lockHashes)
  } else {
    await startBlockSyncing(url, genesisHash, lockHashes, rescan)
  }
})

window.addEventListener('beforeunload', () => {
  unregisterTxStatusListener()

  blockListener?.stop()
  blockListener = null

  indexerQueue?.stop()
  indexerQueue = null
})

registerTxStatusListener()