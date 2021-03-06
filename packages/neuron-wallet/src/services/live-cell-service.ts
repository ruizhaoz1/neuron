import IndexerService from "./indexer-service";
import Script from "models/chain/script";
import LiveCell from "models/chain/live-cell";

export default class LiveCellService {
  private static instance: LiveCellService;

  public static getInstance = () => {
    if (!LiveCellService.instance) {
      LiveCellService.instance = new LiveCellService(IndexerService.getInstance())
    }

    return LiveCellService.instance
  }

  private indexer: IndexerService

  constructor(indexer: IndexerService) {
    this.indexer = indexer
  }

  public async getOneByLockScriptAndTypeScript(lock: Script | null, type: Script | null) {
    const result = await this.indexer.getLiveCellsByScript(lock, type, null)
    if (result.length === 0) {
      return null
    }

    const typeHash = type ? type.computeHash() : ""
    for (let i = 0; i < result.length; i++) {
      const item = LiveCell.fromLumos(result[i]);
      if (type) {
        if (typeHash === item.typeHash) {
          return item
        }
      } else {
        return item
      }
    }

    return null
  }

  public async getManyByLockScriptAndTypeScript(lock: Script | null, type: Script | null) {
    const result = await this.indexer.getLiveCellsByScript(lock, type, null)

    const cells = []

    const typeHash = type ? type.computeHash() : ""
    for (let i = 0; i < result.length; i++) {
      // @ts-ignore
      const item = LiveCell.fromLumos(result[i]);
      if (type) {
        if (typeHash === item.typeHash) {
          cells.push(item)
        }
      } else {
        cells.push(item)
      }
    }

    return cells
  }

  public async getManyByLockScriptsAndTypeScript(locks: Script[], type: Script | null) {
    const result = []

    for (const lock of locks) {
      const cells = await this.getManyByLockScriptAndTypeScript(lock, type)
      if (cells.length > 0) {
        result.push(...cells)
      }
    }

    return result
  }
}
